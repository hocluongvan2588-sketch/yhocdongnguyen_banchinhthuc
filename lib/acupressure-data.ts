// Acupressure points data based on diagnosis
import { getTrigramByNumber } from "./data/trigram-data"

export interface AcupressurePoint {
  name: string
  vietnamese: string
  location: string
  technique: string
  duration: string
  benefits: string[]
  position: { x: number; y: number } // Position on body map (percentage)
}

export interface AcupressureTreatment {
  diagnosis: string
  primaryPoints: AcupressurePoint[]
  secondaryPoints: AcupressurePoint[]
  instructions: string
  frequency: string
  precautions: string[]
}

const ACUPRESSURE_POINTS_DB: Record<string, AcupressurePoint> = {
  TucTamLy: {
    name: "ST36",
    vietnamese: "Túc Tam Lý",
    location: "Dưới đầu gối 3 tấc (9cm), ngoài xương chày 1 ngón tay",
    technique: "Bấm mạnh với đầu ngón cái, xoay tròn 30-50 lần theo chiều kim đồng hồ",
    duration: "3-5 phút mỗi bên",
    benefits: ["Tăng cường tiêu hóa", "Bồi bổ khí huyết", "Tăng sức đề kháng"],
    position: { x: 50, y: 70 },
  },
  TamAmGiao: {
    name: "SP6",
    vietnamese: "Tam Âm Giao",
    location: "Trên mắt cá chân trong 3 tấc (9cm), sau xương chày",
    technique: "Bấm nhẹ nhàng với đầu ngón cái, giữ 2-3 phút",
    duration: "2-3 phút mỗi bên",
    benefits: ["Điều hòa gan thận tỳ", "An thần", "Cải thiện giấc ngủ"],
    position: { x: 48, y: 85 },
  },
  HopCoc: {
    name: "LI4",
    vietnamese: "Hợp Cốc",
    location: "Giữa xương bàn tay thứ 1 và thứ 2, phía lưng bàn tay",
    technique: "Bấm chặt với ngón cái và ngón trỏ, xoa bóp 1-2 phút",
    duration: "1-2 phút mỗi tay",
    benefits: ["Giảm đau đầu", "Thông kinh lạc", "Tăng cường miễn dịch"],
    position: { x: 30, y: 50 },
  },
  ThaiBach: {
    name: "LU9",
    vietnamese: "Thái Bạch",
    location: "Ở cổ tay, phía trong, dưới gân ngang cổ tay",
    technique: "Bấm nhẹ nhàng, xoa tròn 30 lần",
    duration: "1-2 phút mỗi tay",
    benefits: ["Bổ phổi", "Cải thiện hô hấp", "Giảm ho"],
    position: { x: 25, y: 45 },
  },
  ThanMon: {
    name: "HT7",
    vietnamese: "Thần Môn",
    location: "Ở cổ tay, phía trong, bên ngoài gân cổ tay",
    technique: "Bấm nhẹ, giữ 2-3 phút",
    duration: "2-3 phút mỗi tay",
    benefits: ["An thần", "Giảm căng thẳng", "Cải thiện giấc ngủ"],
    position: { x: 28, y: 46 },
  },
  ThanDinh: {
    name: "GV24",
    vietnamese: "Thần Đình",
    location: "Giữa trán, trên đường viền tóc 0.5 tấc",
    technique: "Xoa nhẹ nhàng bằng đầu ngón tay 50 lần",
    duration: "2-3 phút",
    benefits: ["Thanh tâm", "Giảm đau đầu", "Tỉnh trí"],
    position: { x: 50, y: 8 },
  },
  ThaiXung: {
    name: "LR3",
    vietnamese: "Thái Xung",
    location: "Trên mu bàn chân, giữa xương bàn chân thứ 1 và thứ 2",
    technique: "Bấm mạnh với ngón cái 1-2 phút",
    duration: "1-2 phút mỗi chân",
    benefits: ["Giảm stress", "Điều hòa gan", "Cải thiện tuần hoàn"],
    position: { x: 50, y: 95 },
  },
  ThanDuc: {
    name: "KI3",
    vietnamese: "Thận Dực",
    location: "Giữa mắt cá chân trong và gân gót",
    technique: "Bấm nhẹ nhàng, xoa tròn 30-50 lần",
    duration: "2-3 phút mỗi bên",
    benefits: ["Bổ thận", "Tăng cường sinh lực", "Giảm mệt mỏi"],
    position: { x: 52, y: 88 },
  },
}

export function getAcupressureTreatment(
  upperTrigram: number,
  lowerTrigram: number,
  movingLine: number,
): AcupressureTreatment {
  const upper = getTrigramByNumber(upperTrigram)
  const lower = getTrigramByNumber(lowerTrigram)

  const diagnosis = `${upper.vietnamese} ${lower.vietnamese} - Ảnh hưởng ${upper.organ} và ${lower.organ}`

  // Determine points based on elements
  const primaryPoints: AcupressurePoint[] = []
  const secondaryPoints: AcupressurePoint[] = []

  // Map elements to acupressure points
  if (upper.element === "Thổ" || lower.element === "Thổ") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.TucTamLy)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.TamAmGiao)
  }

  if (upper.element === "Kim" || lower.element === "Kim") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.ThaiBach, ACUPRESSURE_POINTS_DB.HopCoc)
  }

  if (upper.element === "Hỏa" || lower.element === "Hỏa") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.ThanMon)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.ThanDinh)
  }

  if (upper.element === "Thủy" || lower.element === "Thủy") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.ThanDuc)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.TamAmGiao)
  }

  if (upper.element === "Mộc" || lower.element === "Mộc") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.ThaiXung)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.ThanMon)
  }

  // Ensure we have at least 2 primary and 2 secondary points
  if (primaryPoints.length < 2) {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.HopCoc)
  }
  if (secondaryPoints.length < 2) {
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.TucTamLy, ACUPRESSURE_POINTS_DB.ThaiXung)
  }

  return {
    diagnosis,
    primaryPoints: primaryPoints.slice(0, 3),
    secondaryPoints: secondaryPoints.slice(0, 3),
    instructions:
      "Thực hiện bấm huyệt 2 lần mỗi ngày: buổi sáng sau khi thức dậy và buổi tối trước khi ngủ. Bắt đầu với các huyệt chính, sau đó đến các huyệt phụ. Nên bấm trong tư thế ngồi thoải mái, hơi thở đều đặn.",
    frequency: "2 lần/ngày, liên tục trong 2-4 tuần",
    precautions: [
      "Không bấm huyệt khi quá đói hoặc quá no",
      "Không bấm huyệt khi vừa mới tắm hoặc vận động mạnh",
      "Phụ nữ có thai tránh bấm huyệt Tam Âm Giao và Hợp Cốc",
      "Nếu cảm thấy đau quá mức, giảm lực bấm",
      "Nên tư vấn thầy thuốc trước khi thực hiện với người có bệnh nền",
    ],
  }
}
