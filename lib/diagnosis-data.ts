import { getTrigramByNumber } from "./data/trigram-data"

export interface DiagnosisResult {
  condition: string
  description: string
  affectedOrgans: string[]
  elementInteraction: string
}

export function generateDiagnosis(upperTrigram: number, lowerTrigram: number, movingLine: number): DiagnosisResult {
  const upper = getTrigramByNumber(upperTrigram)
  const lower = getTrigramByNumber(lowerTrigram)

  // Simplified diagnosis logic based on Five Elements interaction
  const elementInteraction = analyzeElementInteraction(upper.element, lower.element)

  const affectedOrgans = [...upper.organ.split(", "), ...lower.organ.split(", ")]

  return {
    condition: `Mất cân bằng giữa ${upper.vietnamese} và ${lower.vietnamese}`,
    description: `Quẻ ${upper.vietnamese} (${upper.element}) ở vị trí thượng, quẻ ${lower.vietnamese} (${lower.element}) ở vị trí hạ. Hào động thứ ${movingLine} cho thấy sự biến đổi trong cơ thể. ${elementInteraction}`,
    affectedOrgans,
    elementInteraction,
  }
}

function analyzeElementInteraction(element1: string, element2: string): string {
  const interactions: Record<string, Record<string, string>> = {
    Hỏa: {
      Kim: "Hỏa khắc Kim - Có thể ảnh hưởng đến hệ hô hấp và xương khớp",
      Thủy: "Thủy khắc Hỏa - Thận thủy yếu có thể ảnh hưởng tim mạch, gây mất ngủ",
      Mộc: "Mộc sinh Hỏa - Gan mộc hỗ trợ tim hỏa, cần cân bằng năng lượng",
      Thổ: "Hỏa sinh Thổ - Tim hỏa nuôi dưỡng tỳ thổ, cần chú ý tiêu hóa",
    },
    Thủy: {
      Hỏa: "Thủy khắc Hỏa - Thận thủy thịnh có thể gây hồi hộp, lo âu",
      Thổ: "Thổ khắc Thủy - Tỳ vì yếu ảnh hưởng thận, cần tăng cường tiêu hóa",
      Kim: "Kim sinh Thủy - Phổi kim hỗ trợ thận thủy, cần giữ ấm",
      Mộc: "Thủy sinh Mộc - Thận thủy nuôi gan mộc, cần bồi bổ thận",
    },
    Mộc: {
      Thổ: "Mộc khắc Thổ - Gan mộc thịnh ảnh hưởng tỳ vị, gây khó tiêu",
      Kim: "Kim khắc Mộc - Phổi kim yếu ảnh hưởng gan, cần tăng cường hô hấp",
      Thủy: "Thủy sinh Mộc - Thận thủy nuôi gan mộc, cần bồi bổ thận",
      Hỏa: "Mộc sinh Hỏa - Gan mộc nuôi tim hỏa, cần thư giãn tinh thần",
    },
    Kim: {
      Mộc: "Kim khắc Mộc - Phổi kim thịnh ảnh hưởng gan, cần giảm căng thẳng",
      Hỏa: "Hỏa khắc Kim - Tim hỏa thịnh ảnh hưởng phổi, cần chú ý hô hấp",
      Thổ: "Thổ sinh Kim - Tỳ thổ nuôi phổi kim, cần chú ý ăn uống",
      Thủy: "Kim sinh Thủy - Phổi kim nuôi thận thủy, cần giữ ấm cơ thể",
    },
    Thổ: {
      Thủy: "Thổ khắc Thủy - Tỳ vì thịnh ảnh hưởng thận, cần chú ý tiêu hóa",
      Mộc: "Mộc khắc Thổ - Gan mộc thịnh ảnh hưởng tỳ vị, cần bảo vệ dạ dày",
      Hỏa: "Hỏa sinh Thổ - Tim hỏa nuôi tỳ thổ, cần giữ tâm an",
      Kim: "Thổ sinh Kim - Tỳ thổ nuôi phổi kim, cần tăng cường tiêu hóa",
    },
  }

  return interactions[element1]?.[element2] || "Cần cân bằng âm dương và ngũ hành trong cơ thể"
}
