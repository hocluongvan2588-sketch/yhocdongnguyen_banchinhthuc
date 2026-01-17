import { type NextRequest, NextResponse } from "next/server"
import { performComprehensiveDiagnosis } from "@/lib/diagnosis/interpretation-logic-v2"
import { SYSTEM_INSTRUCTION } from "@/lib/ai/prompts/system-instruction"
import fs from "fs"
import path from "path"
import { selectRelevantChunks } from "@/lib/ai/knowledge/knowledge-loader"
import {
  generateSemanticCacheKey,
  normalizeHealthConcern,
  getCachedResponse,
  setCachedResponse,
} from "@/lib/ai/cache/response-cache"
import { generateIntelligentFallback } from "@/lib/ai/fallback-diagnosis"

let knowledgeBaseCache: string | null = null
let knowledgeBaseCacheTime: number | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 giờ

function loadKnowledgeBase(): string {
  const now = Date.now()

  // Sử dụng cache nếu còn hiệu lực
  if (knowledgeBaseCache && knowledgeBaseCacheTime && now - knowledgeBaseCacheTime < CACHE_DURATION) {
    return knowledgeBaseCache
  }

  try {
    const knowledgePath = path.join(process.cwd(), "lib/ai/knowledge")
    const maiHoaCore = fs.readFileSync(path.join(knowledgePath, "mai-hoa-core.md"), "utf-8")
    const symptomAnalysis = fs.readFileSync(path.join(knowledgePath, "symptom-analysis.md"), "utf-8")

    knowledgeBaseCache = `${maiHoaCore}\n\n${symptomAnalysis}`
    knowledgeBaseCacheTime = now

    return knowledgeBaseCache
  } catch (error) {
    console.error("[v0] Failed to load knowledge base:", error)
    return ""
  }
}

function constructPrompt(
  rawData: ReturnType<typeof performComprehensiveDiagnosis>,
  healthConcern: string,
  currentMonth: number,
): string {
  return `**Triệu chứng:** "${healthConcern}"

**Quẻ:** ${rawData.mainHexagram.upperName}/${rawData.mainHexagram.lowerName}, Hào ${rawData.mainHexagram.movingLine}
**Thể-Dụng:** ${rawData.bodyUseAnalysis.bodyElement} vs ${rawData.bodyUseAnalysis.useElement} (${rawData.bodyUseAnalysis.relationship})
**Cơ quan:** ${rawData.affectedOrgans.primary}, ${rawData.affectedOrgans.secondary}
**Tháng:** ${currentMonth}

Phân tích theo 6 phần, mỗi phần ≤100 từ.`
}

async function generateTextWithOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800, // Giảm từ 1200 xuống 800
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ""
}

const requestTracker = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // Giảm từ 10 xuống 5
const RATE_WINDOW = 60 * 1000 // 1 phút

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = requestTracker.get(ip)

  if (!record || now > record.resetTime) {
    requestTracker.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000) // seconds
    return { allowed: false, retryAfter }
  }

  record.count++
  return { allowed: true }
}

function getTrigramNumberFromName(name: string): number {
  const mapping: Record<string, number> = {
    Càn: 1,
    Đoài: 2,
    Ly: 3,
    Chấn: 4,
    Tốn: 5,
    Khảm: 6,
    Cấn: 7,
    Khôn: 8,
  }
  return mapping[name] || 1
}

function getTrigmramNameFromNumber(num: number): string {
  const mapping: Record<number, string> = {
    1: "Càn",
    2: "Đoài",
    3: "Ly",
    4: "Chấn",
    5: "Tốn",
    6: "Khảm",
    7: "Càn",
    8: "Khôn",
  }
  return mapping[num] || "Càn"
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = checkRateLimit(ip)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Vui lòng chờ một chút trước khi thử lại. Hệ thống đang xử lý nhiều yêu cầu.",
          status: "rate_limited",
          retryAfter: rateLimitResult.retryAfter,
          message: `Bạn có thể thử lại sau ${rateLimitResult.retryAfter} giây. Hoặc tắt chế độ AI để xem kết quả ngay.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter || 60),
            "X-RateLimit-Limit": String(RATE_LIMIT),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + (rateLimitResult.retryAfter || 60)),
          },
        },
      )
    }

    const body = await request.json()
    console.log("[v0] Received body:", body)

    const { upperTrigram, lowerTrigram, movingLine, healthConcern, currentMonth, transformedUpper, transformedLower } =
      body

    if (
      upperTrigram === null ||
      upperTrigram === undefined ||
      upperTrigram === "" ||
      lowerTrigram === null ||
      lowerTrigram === undefined ||
      lowerTrigram === "" ||
      !movingLine
    ) {
      console.error("[v0] Validation failed:", {
        upperTrigram,
        lowerTrigram,
        movingLine,
        healthConcern,
      })
      return NextResponse.json(
        {
          error: "Missing required parameters",
          details: {
            upperTrigram: upperTrigram || "missing",
            lowerTrigram: lowerTrigram || "missing",
            movingLine: movingLine || "missing",
          },
        },
        { status: 400 },
      )
    }

    const upperTrigramNum = typeof upperTrigram === "string" ? getTrigramNumberFromName(upperTrigram) : upperTrigram
    const lowerTrigramNum = typeof lowerTrigram === "string" ? getTrigramNumberFromName(lowerTrigram) : lowerTrigram
    const transformedUpperNum =
      typeof transformedUpper === "number"
        ? transformedUpper
        : typeof transformedUpper === "string"
          ? getTrigramNumberFromName(transformedUpper)
          : upperTrigramNum
    const transformedLowerNum =
      typeof transformedLower === "number"
        ? transformedLower
        : typeof transformedLower === "string"
          ? getTrigramNumberFromName(transformedLower)
          : lowerTrigramNum

    console.log("[v0] Converted to numbers:", {
      upperTrigram: upperTrigramNum,
      lowerTrigram: lowerTrigramNum,
      movingLine,
      transformedUpper: transformedUpperNum,
      transformedLower: transformedLowerNum,
    })

    const normalizedConcern = normalizeHealthConcern(healthConcern || "")
    const cacheKey = generateSemanticCacheKey({
      upperTrigram: upperTrigramNum,
      lowerTrigram: lowerTrigramNum,
      movingLine,
      healthConcernNormalized: normalizedConcern,
      transformedUpper: transformedUpperNum,
      transformedLower: transformedLowerNum,
    })

    const cachedResult = getCachedResponse(cacheKey)
    if (cachedResult) {
      console.log("[v0] Cache hit, returning cached response")
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        status: "success",
      })
    }

    const rawCalculation = performComprehensiveDiagnosis({
      upperTrigram: upperTrigramNum,
      lowerTrigram: lowerTrigramNum,
      movingLine,
      healthConcern: healthConcern || "",
      currentMonth: currentMonth || new Date().getMonth() + 1,
      transformedUpper: transformedUpperNum,
      transformedLower: transformedLowerNum,
    })

    try {
      const relevantKnowledge = selectRelevantChunks(
        healthConcern || "",
        [rawCalculation.affectedOrgans.primary, rawCalculation.affectedOrgans.secondary],
        1500,
      )

      const userPrompt = constructPrompt(rawCalculation, healthConcern || "", currentMonth || 1)
      const systemPrompt = `${SYSTEM_INSTRUCTION}\n\nKIẾN THỨC LIÊN QUAN:\n${relevantKnowledge}`

      const text = await generateTextWithOpenAI(systemPrompt, userPrompt)
      const aiInterpretation = parseAIResponse(text)

      const result = {
        ...rawCalculation,
        aiEnhanced: aiInterpretation,
        usedAI: true,
        cached: false,
        status: "success",
        severity: rawCalculation.bodyUseAnalysis.severity,
        severityLabel: rawCalculation.bodyUseAnalysis.severityLabel,
      }

      setCachedResponse(cacheKey, result)
      return NextResponse.json(result)
    } catch (aiError) {
      console.error("[v0] AI generation failed, using intelligent fallback:", aiError)

      const intelligentFallback = generateIntelligentFallback(rawCalculation)

      const fallbackResult = {
        ...rawCalculation,
        usedAI: false,
        cached: false,
        status: "fallback",
        severity: rawCalculation.bodyUseAnalysis.severity,
        severityLabel: rawCalculation.bodyUseAnalysis.severityLabel,
        fallbackReason: aiError instanceof Error ? aiError.message : "AI tạm thời không khả dụng",
        aiEnhanced: {
          ...intelligentFallback,
        },
      }

      setCachedResponse(cacheKey, fallbackResult, 5 * 60 * 1000)

      return NextResponse.json(fallbackResult)
    }
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      {
        error: "Không thể tạo kết quả chẩn đoán",
        details: error instanceof Error ? error.message : "Lỗi không xác định",
        status: "error",
      },
      { status: 500 },
    )
  }
}

function parseAIResponse(text: string) {
  const sections = {
    summary: "",
    mechanism: "",
    symptoms: "",
    timing: "",
    immediateAdvice: "",
    longTermTreatment: "",
    seasonal: {
      favorableMonths: [] as number[],
      unfavorableMonths: [] as number[],
    },
  }

  const summaryMatch = text.match(/##\s*1\.\s*TỔNG QUAN[^\n]*\n([\s\S]*?)(?=##|$)/i)
  const mechanismMatch = text.match(/##\s*2\.\s*CƠ CHẾ BỆNH LÝ[^\n]*\n([\s\S]*?)(?=##|$)/i)
  const symptomsMatch = text.match(/##\s*3\.\s*TRIỆU CHỨNG[^\n]*\n([\s\S]*?)(?=##|$)/i)
  const timingMatch = text.match(/##\s*4\.\s*THỜI ĐIỂM[^\n]*\n([\s\S]*?)(?=##|$)/i)
  const immediateMatch = text.match(/##\s*5\.\s*XỬ LÝ NGAY[^\n]*\n([\s\S]*?)(?=##|$)/i)
  const longTermMatch = text.match(/##\s*6\.\s*PHÁC ĐỒ[^\n]*\n([\s\S]*?)(?=##|$)/i)

  sections.summary = summaryMatch?.[1]?.trim() || ""
  sections.mechanism = mechanismMatch?.[1]?.trim() || ""
  sections.symptoms = symptomsMatch?.[1]?.trim() || ""
  sections.timing = timingMatch?.[1]?.trim() || ""
  sections.immediateAdvice = immediateMatch?.[1]?.trim() || ""
  sections.longTermTreatment = longTermMatch?.[1]?.trim() || ""

  if (!sections.summary && !sections.mechanism) {
    sections.summary = text.substring(0, 500)
  }

  return sections
}
