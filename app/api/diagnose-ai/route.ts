import { type NextRequest, NextResponse } from "next/server"
import { performComprehensiveDiagnosis } from "@/lib/diagnosis/interpretation-logic-v2"
import { SYSTEM_INSTRUCTION } from "@/lib/ai/prompts/system-instruction"
import fs from "fs"
import path from "path"

// Load knowledge base
function loadKnowledgeBase(): string {
  try {
    const knowledgePath = path.join(process.cwd(), "lib/ai/knowledge")
    const maiHoaCore = fs.readFileSync(path.join(knowledgePath, "mai-hoa-core.md"), "utf-8")
    const symptomAnalysis = fs.readFileSync(path.join(knowledgePath, "symptom-analysis.md"), "utf-8")
    return `${maiHoaCore}\n\n${symptomAnalysis}`
  } catch (error) {
    console.error("[v0] Failed to load knowledge base:", error)
    return ""
  }
}

// Create prompt for AI
function constructPrompt(
  rawData: ReturnType<typeof performComprehensiveDiagnosis>,
  healthConcern: string,
  currentMonth: number,
): string {
  return `Dữ liệu chẩn đoán từ hệ thống:

**Quẻ Chủ:** ${rawData.mainHexagram.upperName} (thượng) + ${rawData.mainHexagram.lowerName} (hạ)
**Hào động:** Hào ${rawData.mainHexagram.movingLine}
**Thể-Dụng:** ${rawData.bodyUseAnalysis.bodyElement} (Thể) vs ${rawData.bodyUseAnalysis.useElement} (Dụng)
**Quan hệ:** ${rawData.bodyUseAnalysis.relationship}
**Mức độ:** ${rawData.bodyUseAnalysis.severity === "severe" ? "Nghiêm trọng" : rawData.bodyUseAnalysis.severity === "moderate" ? "Trung bình" : "Nhẹ"}

**Quẻ Hổ:** ${rawData.mutualHexagram.upperName} + ${rawData.mutualHexagram.lowerName}
**Quẻ Biến:** ${rawData.transformedHexagram.upperName} + ${rawData.transformedHexagram.lowerName}

**Cơ quan bị ảnh hưởng:**
- Chính: ${rawData.affectedOrgans.primary}
- Phụ: ${rawData.affectedOrgans.secondary}
- Bộ phận: ${rawData.affectedOrgans.bodyParts.join(", ")}

**Triệu chứng:** "${healthConcern}"

---

Hãy phân tích và đưa ra lời tư vấn chi tiết theo cấu trúc:

## 1. TỔNG QUAN (2-3 câu gợi mở)

## 2. CƠ CHẾ BỆNH LÝ (3-4 câu giải thích chi tiết)

## 3. TRIỆU CHỨNG THƯỜNG KÈM THEO (3-5 điểm)

## 4. THỜI ĐIỂM CẦN LƯU Ý (2-3 câu)

## 5. XỬ LÝ NGAY TẠI NHÀ (4-6 bước cụ thể)

## 6. PHÁC ĐỒ ĐIỀU TRỊ LÂU DÀI (3-4 câu)

Lưu ý: Phải dựa vào dữ liệu trên và tri thức trong knowledge base, KHÔNG tự suy diễn!`
}

async function generateTextWithOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  // In production, use environment variable OPENAI_API_KEY
  // For now, this will use Vercel AI Gateway which doesn't require key
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
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ""
}

// Parse AI response
function parseAIResponse(text: string) {
  const sections = {
    summary: "",
    mechanism: "",
    symptoms: "",
    timing: "",
    immediateAdvice: "",
    longTermTreatment: "",
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
    const body = await request.json()
    console.log("[v0] Received body:", body)

    const { upperTrigram, lowerTrigram, movingLine, healthConcern, currentMonth, transformedUpper, transformedLower } =
      body

    if (!upperTrigram || !lowerTrigram || !movingLine) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
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
      const knowledgeBase = loadKnowledgeBase()

      const userPrompt = constructPrompt(rawCalculation, healthConcern || "", currentMonth || 1)
      const systemPrompt = `${SYSTEM_INSTRUCTION}\n\n---\n\nKNOWLEDGE BASE:\n\n${knowledgeBase}`

      const text = await generateTextWithOpenAI(systemPrompt, userPrompt)

      const aiInterpretation = parseAIResponse(text)

      return NextResponse.json({
        ...rawCalculation,
        aiEnhanced: aiInterpretation,
        usedAI: true,
        status: "success",
        severity: rawCalculation.bodyUseAnalysis.severity,
        severityLabel: rawCalculation.bodyUseAnalysis.severityLabel,
      })
    } catch (aiError) {
      console.error("[v0] AI generation failed, using fallback:", aiError)

      return NextResponse.json({
        ...rawCalculation,
        usedAI: false,
        status: "success",
        severity: rawCalculation.bodyUseAnalysis.severity,
        severityLabel: rawCalculation.bodyUseAnalysis.severityLabel,
        fallbackReason: aiError instanceof Error ? aiError.message : "AI unavailable",
      })
    }
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate diagnosis",
        details: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      { status: 500 },
    )
  }
}
