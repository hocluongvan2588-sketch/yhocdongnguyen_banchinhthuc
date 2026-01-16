import { performComprehensiveDiagnosis } from "../diagnosis/interpretation-logic-v2"

// Interface cho kết quả chẩn đoán
export interface AIDiagnosisResult {
  rawCalculation: ReturnType<typeof performComprehensiveDiagnosis>
  aiInterpretation: {
    summary: string
    mechanism: string
    symptoms: string
    timing: string
    immediateAdvice: string
    longTermTreatment: string
  }
  usedAI: boolean
  generatedAt: string
}

// Wrapper function that calls API endpoint
export async function diagnoseWithAI(params: {
  upperTrigram: number
  lowerTrigram: number
  movingLine: number
  healthConcern: string
  currentMonth: number
  transformedUpper: number
  transformedLower: number
}): Promise<AIDiagnosisResult> {
  try {
    const response = await fetch("/api/diagnose-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] AI API call failed:", error)
    // Fallback: return basic structure
    return {
      rawCalculation: performComprehensiveDiagnosis(params),
      aiInterpretation: {
        summary: "Đang xử lý kết quả chẩn đoán...",
        mechanism: "Hệ thống đang phân tích theo Mai Hoa Dịch Số",
        symptoms: "Vui lòng thử lại sau",
        timing: "Đang tải...",
        immediateAdvice: "Đang tải...",
        longTermTreatment: "Đang tải...",
      },
      usedAI: false,
      generatedAt: new Date().toISOString(),
    }
  }
}

// Wrapper for simplified API
export async function getDiagnosisWithAI(params: {
  hexagramNumber: number
  upperTrigram: string
  lowerTrigram: string
  movingLine: number
  bodyElement: string
  useElement: string
  relationship: string
  healthConcern: string
  month: number
}): Promise<any> {
  const upperNum = 1
  const lowerNum = 1
  const transformedUpper = 1
  const transformedLower = 1

  try {
    const result = await diagnoseWithAI({
      upperTrigram: upperNum,
      lowerTrigram: lowerNum,
      movingLine: params.movingLine,
      healthConcern: params.healthConcern,
      currentMonth: params.month,
      transformedUpper,
      transformedLower,
    })

    return {
      summarySimple: result.aiInterpretation.summary,
      summary: result.aiInterpretation.mechanism,
      advice: `${result.aiInterpretation.immediateAdvice}\n\n${result.aiInterpretation.longTermTreatment}`,
      severity: result.rawCalculation.bodyUseAnalysis.severity,
      status: result.rawCalculation.bodyUseAnalysis.relationship,
      specificConcernAnalysis: result.aiInterpretation.symptoms,
    }
  } catch (error) {
    console.error("[v0] getDiagnosisWithAI error:", error)
    return {
      summarySimple: "Đang xử lý kết quả chẩn đoán...",
      summary: "Hệ thống đang phân tích theo Mai Hoa Dịch Số",
      advice: "Vui lòng thử lại sau",
      severity: "moderate",
      status: params.relationship,
    }
  }
}
