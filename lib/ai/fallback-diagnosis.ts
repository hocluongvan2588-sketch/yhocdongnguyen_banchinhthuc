import type { performComprehensiveDiagnosis } from "@/lib/diagnosis/interpretation-logic-v2"

type DiagnosisResult = {
  summary: string
  mechanism: string
  symptoms: string
  timing: string
  immediateAdvice: string
  longTermTreatment: string
  seasonal: {
    favorableMonths: number[]
    unfavorableMonths: number[]
  }
}

export function generateIntelligentFallback(
  rawCalculation: ReturnType<typeof performComprehensiveDiagnosis>,
): DiagnosisResult {
  const { bodyUseAnalysis, affectedOrgans, seasonalInfluence } = rawCalculation

  // Generate detailed fallback based on existing logic
  const summary = generateSummary(bodyUseAnalysis)
  const mechanism = generateMechanism(bodyUseAnalysis, affectedOrgans)
  const symptoms = generateSymptoms(affectedOrgans, bodyUseAnalysis)
  const timing = generateTiming(seasonalInfluence)
  const immediateAdvice = generateImmediateAdvice(bodyUseAnalysis)
  const longTermTreatment = generateLongTerm(bodyUseAnalysis, affectedOrgans)

  // Always return full schema with seasonal data
  return {
    summary,
    mechanism,
    symptoms,
    timing,
    immediateAdvice,
    longTermTreatment,
    seasonal: {
      favorableMonths: seasonalInfluence?.favorableMonths || [],
      unfavorableMonths: seasonalInfluence?.unfavorableMonths || [],
    },
  }
}

function generateSummary(bodyUse: any): string {
  const severity = bodyUse.severityLabel || "Trung bình"
  const relationship = bodyUse.relationship

  if (relationship.includes("Dụng khắc Thể")) {
    return `Tình trạng nghiêm trọng (${severity}). Năng lượng bị ức chế mạnh, cần can thiệp ngay để tránh diễn biến xấu. Cơ thể đang trong trạng thái mất cân bằng và cần được hỗ trợ.`
  } else if (relationship.includes("Thể khắc Dụng")) {
    return `Tình trạng nhẹ đến trung bình (${severity}). Cơ thể đang phản ứng tốt, có khả năng tự phục hồi. Cần theo dõi và hỗ trợ để quá trình hồi phục nhanh hơn.`
  } else if (relationship.includes("Tương sinh")) {
    return `Tình trạng ổn định (${severity}). Năng lượng cơ thể hài hòa, quá trình phục hồi diễn ra thuận lợi. Cần duy trì chế độ để tăng cường sức khỏe.`
  } else {
    return `Tình trạng ${severity}. Cần theo dõi và điều chỉnh phù hợp với thể trạng hiện tại.`
  }
}

function generateMechanism(bodyUse: any, organs: any): string {
  const body = bodyUse.bodyElement
  const use = bodyUse.useElement
  const primary = organs.primary

  return `Theo Mai Hoa Dịch Số, yếu tố ${body} (Thể) đang tương tác với ${use} (Dụng). 
Điều này ảnh hưởng trực tiếp đến ${primary}, gây ra sự mất cân bằng trong kinh lạc. 
Khi ${bodyUse.relationship}, năng lượng khí huyết không lưu thông tốt, dẫn đến các triệu chứng bạn đang gặp phải.`
}

function generateSymptoms(organs: any, bodyUse: any): string {
  const primary = organs.primary
  const secondary = organs.secondary

  const symptomMap: Record<string, string> = {
    Mắt: "mờ mắt, khô mắt, đau nhức, sợ ánh sáng",
    Gan: "mệt mỏi, chóng mặt, dễ nổi giận, ngủ không sâu giấc",
    Tim: "hồi hộp, đánh trống ngực, khó thở, mất ngủ",
    "Lá lách": "chán ăn, đầy bụng, mệt mỏi, tiêu chảy",
    Phổi: "ho, khó thở, sổ mũi, da khô",
    Thận: "mỏi lưng, đái đêm nhiều, sợ lạnh, tóc rụng",
  }

  const primarySymptoms = symptomMap[primary] || "khó chịu, mệt mỏi"
  const secondarySymptoms = symptomMap[secondary] || "các triệu chứng phụ"

  return `Triệu chứng chính liên quan ${primary}: ${primarySymptoms}. 
Có thể kèm theo các biểu hiện ở ${secondary}: ${secondarySymptoms}. 
Mức độ: ${bodyUse.severityLabel}.`
}

// Defensive coding with default destructuring at entry point
function generateTiming(seasonal?: any): string {
  // ⛔ BẮT BUỘC: Default destructuring ngay đầu function
  const { favorableMonths = [], unfavorableMonths = [], currentInfluence = "Đang phân tích" } = seasonal || {}

  const favorableText =
    Array.isArray(favorableMonths) && favorableMonths.length > 0 ? favorableMonths.join(", ") : "Chưa xác định"

  const unfavorableText =
    Array.isArray(unfavorableMonths) && unfavorableMonths.length > 0 ? unfavorableMonths.join(", ") : "Chưa xác định"

  return `Thời điểm hiện tại: ${currentInfluence}. 
Tháng thuận lợi cho điều trị: ${favorableText}. 
Cần cẩn thận vào tháng: ${unfavorableText}. 
Lựa chọn thời điểm điều trị phù hợp sẽ giúp quá trình hồi phục nhanh hơn 30-50%.`
}

function generateImmediateAdvice(bodyUse: any): string {
  if (bodyUse.relationship.includes("Dụng khắc Thể")) {
    return `1. Nghỉ ngơi tuyệt đối trong 2-3 ngày
2. Tránh căng thẳng và kích thích mạnh
3. Uống đủ nước (2-2.5L/ngày)
4. Xem xét khám bác sĩ nếu triệu chứng nặng
5. Massage nhẹ các huyệt liên quan để thông kinh lạc`
  } else if (bodyUse.relationship.includes("Thể khắc Dụng")) {
    return `1. Duy trì vận động nhẹ nhàng
2. Ăn uống cân đối, nhiều rau củ quả
3. Ngủ đủ 7-8 tiếng/đêm
4. Tránh thức khuya và lao động nặng
5. Bấm huyệt tự nhiệu 2 lần/ngày`
  } else {
    return `1. Duy trì lối sống lành mạnh
2. Tập thể dục nhẹ 20-30 phút/ngày
3. Ăn uống điều độ theo mùa
4. Giữ tinh thần thoải mái
5. Massage định kỳ để duy trì sức khỏe`
  }
}

function generateLongTerm(bodyUse: any, organs: any): string {
  const primary = organs.primary

  return `Phác đồ dài hạn (3-6 tháng):

**Tuần 1-2:** Tập trung giảm triệu chứng cấp tính, nghỉ ngơi hợp lý
**Tuần 3-4:** Bắt đầu điều chỉnh chế độ ăn uống, tăng cường dinh dưỡng cho ${primary}
**Tháng 2-3:** Khai thông kinh lạc bằng bấm huyệt, massage định kỳ
**Tháng 4-6:** Củng cố sức khỏe, phòng ngừa tái phát

Nên kết hợp: Đông y (thuốc bắc), châm cứu, xoa bóp, và luyện tập khí công.`
}
