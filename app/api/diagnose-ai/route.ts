import { type NextRequest, NextResponse } from "next/server"
import { performComprehensiveDiagnosis } from "@/lib/diagnosis/interpretation-logic-v2"
import {
  SYSTEM_INSTRUCTION,
  ANALYSIS_RULES,
  CORE_KNOWLEDGE,
  GEOGRAPHY_KNOWLEDGE,
} from "@/lib/ai/prompts/system-instruction"
import { buildUnifiedMedicalPrompt } from "@/lib/prompts/unified-medical.prompt"
import { getHexagramName } from "@/lib/data/hexagram-data"
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

function buildUnifiedPromptInput(
  rawData: ReturnType<typeof performComprehensiveDiagnosis>,
  healthConcern: string,
  currentMonth: number,
  gender?: string,
  age?: number,
  subject?: string,
) {
  // Map trigram names to get full hexagram information
  const getTrigramInfo = (name: string) => {
    const trigramMap: Record<string, { element: string; organs: string[] }> = {
      'Càn': { element: 'Kim', organs: ['Phổi', 'Đại Tràng'] },
      'Đoài': { element: 'Kim', organs: ['Phổi', 'Đại Tràng'] },
      'Ly': { element: 'Hỏa', organs: ['Tâm', 'Tiểu Tràng'] },
      'Chấn': { element: 'Mộc', organs: ['Gan', 'Mật'] },
      'Tốn': { element: 'Mộc', organs: ['Gan', 'Mật'] },
      'Khảm': { element: 'Thủy', organs: ['Thận', 'Bàng Quang'] },
      'Cấn': { element: 'Thổ', organs: ['Tỳ', 'Vị'] },
      'Khôn': { element: 'Thổ', organs: ['Tỳ', 'Vị'] },
    };
    return trigramMap[name] || { element: 'Kim', organs: ['Phổi'] };
  };

  const upperInfo = getTrigramInfo(rawData.mainHexagram.upperName);
  const lowerInfo = getTrigramInfo(rawData.mainHexagram.lowerName);
  
  // Get proper Vietnamese hexagram names
  const mainHexagramName = getHexagramName(rawData.mainHexagram.upper, rawData.mainHexagram.lower);
  const changedHexagramName = getHexagramName(rawData.transformedHexagram.upper, rawData.transformedHexagram.lower);
  const mutualHexagramName = getHexagramName(rawData.mutualHexagram.upper, rawData.mutualHexagram.lower);
  
  const input = {
    patientContext: {
      gender: gender || 'Không rõ',
      age: age || 0,
      subject: subject || 'banthan',
      question: healthConcern,
    },
    maihua: {
      mainHexagram: { name: mainHexagramName },
      changedHexagram: { name: changedHexagramName },
      mutualHexagram: { name: mutualHexagramName },
      movingLine: rawData.mainHexagram.movingLine,
      interpretation: {
        health: rawData.interpretation.title || mainHexagramName,
        trend: rawData.bodyUseAnalysis.relationship,
        mutual: rawData.mutualHexagram.meaning || '',
      },
    },
    diagnostic: {
      mapping: {
        upperTrigram: {
          name: rawData.mainHexagram.upperName,
          element: upperInfo.element,
          primaryOrgans: upperInfo.organs,
        },
        lowerTrigram: {
          name: rawData.mainHexagram.lowerName,
          element: lowerInfo.element,
          primaryOrgans: lowerInfo.organs,
        },
        movingYao: {
          name: `Hào ${rawData.mainHexagram.movingLine}`,
          position: rawData.mainHexagram.movingLine,
          bodyLevel: rawData.affectedOrgans.bodyLevel || 'Trung tiêu',
          anatomy: rawData.affectedOrgans.bodyParts || [rawData.affectedOrgans.primary],
          organs: [rawData.affectedOrgans.primary, rawData.affectedOrgans.secondary],
          clinicalSignificance: rawData.interpretation.summary || rawData.bodyUseAnalysis.relationship,
        },
      },
      expertAnalysis: {
        tiDung: {
          ti: { element: rawData.bodyUseAnalysis.bodyElement },
          dung: { element: rawData.bodyUseAnalysis.useElement },
          relation: rawData.bodyUseAnalysis.relationship,
          severity: rawData.bodyUseAnalysis.severity,
          prognosis: rawData.bodyUseAnalysis.prognosis,
        },
      },
    },
    seasonInfo: {
      tietKhi: {
        name: 'Hiện tại',
        season: currentMonth >= 3 && currentMonth <= 5 ? 'Xuân' : 
                currentMonth >= 6 && currentMonth <= 8 ? 'Hạ' :
                currentMonth >= 9 && currentMonth <= 11 ? 'Thu' : 'Đông',
        element: currentMonth >= 3 && currentMonth <= 5 ? 'Mộc' : 
                 currentMonth >= 6 && currentMonth <= 8 ? 'Hỏa' :
                 currentMonth >= 9 && currentMonth <= 11 ? 'Kim' : 'Thủy',
      },
      seasonAnalysis: {
        relation: 'trung-hòa' as const,
        description: rawData.seasonalAnalysis.overallAssessment,
        advice: 'Tuân thủ theo mùa',
      },
      lunar: {
        day: new Date().getDate(),
        month: currentMonth,
        year: new Date().getFullYear(),
      },
    },
  };

  return buildUnifiedMedicalPrompt(input);
}

async function generateTextWithOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout cho prompt chuyên gia

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1500,
        temperature: 0.3, // Giảm temperature để AI tuân thủ format chặt chẽ hơn
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ""
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error("[v0] OpenAI request timeout after 15s")
        throw new Error("AI request timed out")
      }
      console.error("[v0] OpenAI fetch error:", error.message)
    }
    throw error
  }
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
  const startTime = Date.now()
  
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    console.log(`[v0] Diagnosis request from IP: ${ip}`)
    
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

    const {
      upperTrigram,
      lowerTrigram,
      movingLine,
      healthConcern,
      currentMonth,
      transformedUpper,
      transformedLower,
      gender,
      age,
      painLocation,
      userLocation,
      canNam,
      chiNam,
      canNgay,
      chiNgay,
      element,
      lunarYear,
      subject, // Đối tượng hỏi: banthan, cha, me, con, vo, chong, anhchiem
    } = body
    
    console.log('[v0] Patient personalization:', { subject, gender, age })

    if (
      upperTrigram === null ||
      upperTrigram === undefined ||
      upperTrigram === "" ||
      lowerTrigram === null ||
      lowerTrigram === undefined ||
      lowerTrigram === "" ||
      !movingLine ||
      !healthConcern
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
            healthConcern: healthConcern || "missing",
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
      gender,
      age,
      painLocation,
      userLocation,
      canNam,
      chiNam,
      element,
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
      // Giảm max tokens từ 1500 -> 1000 để tăng tốc độ
      // Use unified medical prompt builder
      const userPrompt = buildUnifiedPromptInput(
        rawCalculation,
        healthConcern || "",
        currentMonth || 1,
        gender,
        age,
        subject,
      )

      // System prompt - enforce strict format compliance
      const systemPrompt = `Bạn là chuyên gia phân tích y học cổ truyền.

⚠️ QUY TẮC TUYỆT ĐỐI:
1. BẮT BUỘC tuân thủ CHÍNH XÁC format trong 【】
2. PHẢI có cấu trúc "**Theo y học hiện đại:**" + "**Theo ngôn ngữ Đông y:**"
3. KHÔNG tự ý sáng tạo format khác
4. SỬ DỤNG đúng ví dụ mẫu đã cho
5. KHÔNG bỏ qua bất kỳ phần bắt buộc nào

Nếu AI vi phạm format, output sẽ bị từ chối.`

      console.log("[v0] Starting AI generation...")
      console.log("[v0] User prompt preview (first 1000 chars):", userPrompt.substring(0, 1000))
      console.log("[v0] Search for '【PHÂN TÍCH Y LÝ】' in prompt:", userPrompt.includes('【PHÂN TÍCH Y LÝ】'))
      console.log("[v0] Search for 'FORMAT OUTPUT BẮT BUỘC' in prompt:", userPrompt.includes('FORMAT OUTPUT BẮT BUỘC'))
      const startTime = Date.now()
      const text = await generateTextWithOpenAI(systemPrompt, userPrompt)
      const endTime = Date.now()
      console.log(`[v0] AI generation completed in ${endTime - startTime}ms`)
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
    const duration = Date.now() - startTime
    console.error(`[v0] API error after ${duration}ms:`, error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
        return NextResponse.json(
          {
            error: "Kết nối AI bị gián đoạn",
            details: "Vui lòng thử lại hoặc tắt chế độ AI để xem kết quả cơ bản",
            status: "connection_error",
            fallback: true,
          },
          { status: 503 },
        )
      }
    }
    
    return NextResponse.json(
      {
        error: "Không thể tạo kết quả chẩn đoán",
        details: error instanceof Error ? error.message : "Lỗi không xác định",
        status: "error",
        fallback: true,
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
    rootOrganAnalysis: "",
    seasonal: {
      favorableMonths: [] as number[],
      unfavorableMonths: [] as number[],
    },
  }

  // Parse phần TÓM TẮT BỆNH TRẠNG (unified format)
  const summaryMatch = text.match(/【TÓM TẮT BỆNH TRẠNG】[\s\S]*?\n([\s\S]*?)(?=【|$)/i)
  
  // Parse phần PHÂN TÍCH Y LÝ (Đông - Tây y kết hợp)
  const mechanismMatch = text.match(/【PHÂN TÍCH Y LÝ[^\]]*】[\s\S]*?\n([\s\S]*?)(?=【|$)/i)
  
  // Parse phần KẾT LUẬN: BỆNH TỪ TẠNG NÀO PHÁT SINH
  const rootOrganMatch = text.match(/【KẾT LUẬN[^\]]*】[\s\S]*?\n([\s\S]*?)(?=【|$)/i)
  
  // Parse phần TRIỆU CHỨNG CÓ THỂ GẶP
  const symptomsMatch = text.match(/【TRIỆU CHỨNG[^\]]*】[\s\S]*?\n([\s\S]*?)(?=【|$)/i)
  
  // Parse phần HƯỚNG ĐIỀU CHỈNH
  const immediateMatch = text.match(/【HƯỚNG ĐIỀU CHỈNH】[\s\S]*?\n([\s\S]*?)(?=【|$)/i)
  
  // Parse phần CHẾ ĐỘ ĂN UỐNG
  const dietMatch = text.match(/【CHẾ ĐỘ ĂN UỐNG[^\]]*】[\s\S]*?\n([\s\S]*?)(?=【|$)/i)
  
  // Parse phần LỜI KHUYÊN SINH HOẠT
  const lifestyleMatch = text.match(/【LỜI KHUYÊN SINH HOẠT】[\s\S]*?\n([\s\S]*?)(?=【|$)/i)
  
  // Parse phần YẾU TỐ MÙA
  const seasonalMatch = text.match(/【YẾU TỐ MÙA[^\]]*】[\s\S]*?\n([\s\S]*?)(?=【|$)/i)

  sections.summary = summaryMatch?.[1]?.trim() || ""
  sections.mechanism = mechanismMatch?.[1]?.trim() || ""
  sections.rootOrganAnalysis = rootOrganMatch?.[1]?.trim() || ""
  sections.symptoms = symptomsMatch?.[1]?.trim() || ""
  sections.immediateAdvice = immediateMatch?.[1]?.trim() || ""
  sections.timing = seasonalMatch?.[1]?.trim() || ""
  sections.longTermTreatment = [dietMatch?.[1]?.trim(), lifestyleMatch?.[1]?.trim()].filter(Boolean).join('\n\n') || ""

  // Fallback for old format (if unified format not found)
  if (!sections.summary) {
    const oldSummaryMatch = text.match(/##\s*1\.\s*TỔNG QUAN[^\n]*\n([\s\S]*?)(?=##|【|$)/i)
    sections.summary = oldSummaryMatch?.[1]?.trim() || text.substring(0, 500)
  }

  return sections
}
