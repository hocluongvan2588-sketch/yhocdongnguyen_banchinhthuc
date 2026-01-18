// Acupressure points data based on diagnosis
import { getTrigramByNumber } from "./data/trigram-data"

export interface AcupressurePoint {
  id: string // H01, H02, etc.
  code: string // LU9, KI3, etc. (WHO Standard)
  name: string
  vietnamese: string
  location: string
  technique: string
  pressure: "Light" | "Medium" | "Strong"
  duration: string
  benefits: string[]
  contraindications?: string[]
  position: { x: number; y: number } // Position on body map (percentage)
}

export interface AcupressureTreatment {
  diagnosis: string
  primaryPoints: AcupressurePoint[]
  secondaryPoints: AcupressurePoint[]
  instructions: string
  frequency: string
  precautions: string[]
  safetyAlerts?: string[]
}

// Master acupoint database - Chuẩn hóa theo WHO và Y lý cổ truyền
const ACUPRESSURE_POINTS_DB: Record<string, AcupressurePoint> = {
  // H01: Thái Uyên (LU9) - Bổ Phế, Kim
  ThaiUyen: {
    id: "H01",
    code: "LU9",
    name: "Taiyuan",
    vietnamese: "Thái Uyên",
    location: "Ở cổ tay, phía trong, dưới gân ngang cổ tay (vị trí đập mạch)",
    technique: "Bấm nhẹ nhàng với đầu ngón cái, xoa tròn 30 lần. Không bấm quá mạnh vào mạch máu.",
    pressure: "Light",
    duration: "1-2 phút mỗi tay",
    benefits: ["Bổ phổi khí", "Cải thiện hô hấp", "Giảm ho, long đờm", "Tăng cường hệ hô hấp"],
    position: { x: 25, y: 45 },
  },

  // H02: Thái Khê (KI3) - Bổ Thận, Thủy
  ThaiKhe: {
    id: "H02",
    code: "KI3",
    name: "Taixi",
    vietnamese: "Thái Khê",
    location: "Giữa mắt cá chân trong và gân gót, vị trí lõm",
    technique: "Bấm nhẹ nhàng với đầu ngón cái, xoa tròn 30-50 lần",
    pressure: "Medium",
    duration: "2-3 phút mỗi bên",
    benefits: ["Bổ thận", "Tăng cường sinh lực", "Giảm mệt mỏi", "Cải thiện chức năng sinh dục"],
    position: { x: 52, y: 88 },
  },

  // H03: Hợp Cốc (LI4) - Sơ phong, thanh nhiệt
  HopCoc: {
    id: "H03",
    code: "LI4",
    name: "Hegu",
    vietnamese: "Hợp Cốc",
    location: "Giữa xương bàn tay thứ 1 và thứ 2, phía lưng bàn tay",
    technique: "Bấm chặt với ngón cái và ngón trỏ, xoa bóp 1-2 phút. Có thể cảm thấy đau nhức là bình thường.",
    pressure: "Strong",
    duration: "1-2 phút mỗi tay",
    benefits: ["Giảm đau đầu, đau răng", "Thông kinh lạc", "Tăng miễn dịch", "Giải cảm, hạ sốt"],
    contraindications: ["Phụ nữ có thai tuyệt đối tránh"],
    position: { x: 30, y: 50 },
  },

  // H04: Tam Âm Giao (SP6) - Dưỡng âm, bổ can thận
  TamAmGiao: {
    id: "H04",
    code: "SP6",
    name: "Sanyinjiao",
    vietnamese: "Tam Âm Giao",
    location: "Trên mắt cá chân trong 3 tấc (9cm), sau xương chày",
    technique: "Bấm nhẹ nhàng với đầu ngón cái, giữ 2-3 phút. Không xoay mạnh.",
    pressure: "Light",
    duration: "2-3 phút mỗi bên",
    benefits: ["Điều hòa gan thận tỳ", "An thần", "Cải thiện giấc ngủ", "Điều kinh, bổ thận"],
    contraindications: ["Phụ nữ có thai tuyệt đối tránh"],
    position: { x: 48, y: 85 },
  },

  // H05: Túc Tam Lý (ST36) - Kiện tỳ, ích khí
  TucTamLy: {
    id: "H05",
    code: "ST36",
    name: "Zusanli",
    vietnamese: "Túc Tam Lý",
    location: "Dưới đầu gối 3 tấc (9cm), ngoài xương chày 1 ngón tay",
    technique: "Bấm mạnh với đầu ngón cái, xoay tròn 30-50 lần theo chiều kim đồng hồ",
    pressure: "Strong",
    duration: "3-5 phút mỗi bên",
    benefits: ["Tăng cường tiêu hóa", "Bồi bổ khí huyết", "Tăng sức đề kháng", "Điều trị đau dạ dày"],
    position: { x: 50, y: 70 },
  },

  // H06: Thái Xung (LR3) - Bình can, lý khí
  ThaiXung: {
    id: "H06",
    code: "LR3",
    name: "Taichong",
    vietnamese: "Thái Xung",
    location: "Trên mu bàn chân, giữa xương bàn chân thứ 1 và thứ 2",
    technique: "Bấm mạnh với ngón cái 1-2 phút. Có thể cảm thấy đau nhức.",
    pressure: "Strong",
    duration: "1-2 phút mỗi chân",
    benefits: ["Giảm stress", "Điều hòa gan, giải độc", "Cải thiện tuần hoàn", "Hạ huyết áp"],
    position: { x: 50, y: 95 },
  },

  // H07: Thần Môn (HT7) - An thần, thanh tâm
  ThanMon: {
    id: "H07",
    code: "HT7",
    name: "Shenmen",
    vietnamese: "Thần Môn",
    location: "Ở cổ tay, phía trong, bên ngoài gân cổ tay",
    technique: "Bấm nhẹ với đầu ngón cái, giữ 2-3 phút. Có thể kết hợp xoa nhẹ nhàng.",
    pressure: "Light",
    duration: "2-3 phút mỗi tay",
    benefits: ["An thần", "Giảm căng thẳng", "Cải thiện giấc ngủ", "Điều trị lo âu, hồi hộp"],
    position: { x: 28, y: 46 },
  },

  // H08: Thần Đình (GV24) - Tỉnh não, khai khiếu
  ThanDinh: {
    id: "H08",
    code: "GV24",
    name: "Shenting",
    vietnamese: "Thần Đình",
    location: "Giữa trán, trên đường viền tóc 0.5 tấc",
    technique: "Xoa nhẹ nhàng bằng đầu ngón tay 50 lần. Không bấm mạnh, chỉ xoa tròn.",
    pressure: "Light",
    duration: "2-3 phút",
    benefits: ["Thanh tâm, tỉnh trí", "Giảm đau đầu, chóng mặt", "Cải thiện trí nhớ", "Tập trung"],
    position: { x: 50, y: 8 },
  },
}

/**
 * Ánh xạ từ Quẻ Mai Hoa sang Huyệt Đạo theo Y Lý Cổ Truyền
 * Tuân thủ WHO Acupuncture Standards
 */
export function getAcupressureTreatment(
  upperTrigram: number,
  lowerTrigram: number,
  movingLine: number,
  isPregnant = false,
): AcupressureTreatment {
  const upper = getTrigramByNumber(upperTrigram)
  const lower = getTrigramByNumber(lowerTrigram)

  const diagnosis = `${upper.vietnamese} ${lower.vietnamese} - Ảnh hưởng ${upper.organ} và ${lower.organ}`

  const primaryPoints: AcupressurePoint[] = []
  const secondaryPoints: AcupressurePoint[] = []
  const safetyAlerts: string[] = []

  // === LOGIC ÁNH XẠ THEO BẢNG SPEC ===

  // Càn (Quẻ 1) - Kim - Phế, Đầu
  if (upper.vietnamese === "Càn" || lower.vietnamese === "Càn") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.HopCoc, ACUPRESSURE_POINTS_DB.ThaiUyen)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.ThanDinh)
  }

  // Đoài (Quẻ 2) - Kim - Phế, Họng, Miệng
  if (upper.vietnamese === "Đoài" || lower.vietnamese === "Đoài") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.HopCoc, ACUPRESSURE_POINTS_DB.ThaiUyen)
  }

  // Ly (Quẻ 3) - Hỏa - Tâm, Mắt
  if (upper.vietnamese === "Ly" || lower.vietnamese === "Ly") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.ThanMon)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.ThanDinh)
  }

  // Chấn (Quẻ 4) - Mộc - Gan, Chân
  if (upper.vietnamese === "Chấn" || lower.vietnamese === "Chấn") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.ThaiXung)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.ThanMon)
  }

  // Tốn (Quẻ 5) - Mộc - Gan, Tay
  if (upper.vietnamese === "Tốn" || lower.vietnamese === "Tốn") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.ThaiXung)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.TamAmGiao)
  }

  // Khảm (Quẻ 6) - Thủy - Thận, Tai
  if (upper.vietnamese === "Khảm" || lower.vietnamese === "Khảm") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.ThaiKhe)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.TamAmGiao)
  }

  // Cấn (Quẻ 7) - Thổ - Tỳ vị, Khớp xương
  if (upper.vietnamese === "Cấn" || lower.vietnamese === "Cấn") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.TucTamLy)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.HopCoc)
  }

  // Khôn (Quẻ 8) - Thổ - Bụng, Tỳ
  if (upper.vietnamese === "Khôn" || lower.vietnamese === "Khôn") {
    primaryPoints.push(ACUPRESSURE_POINTS_DB.TucTamLy)
    secondaryPoints.push(ACUPRESSURE_POINTS_DB.TamAmGiao)
  }

  // Remove duplicates
  const uniquePrimary = Array.from(new Set(primaryPoints))
  const uniqueSecondary = Array.from(new Set(secondaryPoints.filter((p) => !uniquePrimary.includes(p))))

  // === SAFETY CHECKS ===
  if (isPregnant) {
    const dangerousPoints = [ACUPRESSURE_POINTS_DB.HopCoc, ACUPRESSURE_POINTS_DB.TamAmGiao]
    const hasDangerous = [...uniquePrimary, ...uniqueSecondary].some((p) => dangerousPoints.includes(p))

    if (hasDangerous) {
      safetyAlerts.push(
        "⚠️ CẢNH BÁO: Phụ nữ có thai TUYỆT ĐỐI KHÔNG sử dụng huyệt Hợp Cốc (LI4) và Tam Âm Giao (SP6) vì có thể gây sẩy thai.",
      )
    }
  }

  // === TIMING SUGGESTION ===
  const currentHour = new Date().getHours()
  let timingSuggestion = ""
  if (currentHour >= 6 && currentHour < 8) {
    timingSuggestion = "⏰ Đây là thời điểm vàng (6h-8h) để bổ Dương khí, rất tốt cho bấm huyệt."
  } else if (currentHour >= 20 && currentHour < 22) {
    timingSuggestion = "⏰ Thời điểm tốt (20h-22h) để an thần, dưỡng âm trước khi ngủ."
  }

  return {
    diagnosis,
    primaryPoints: uniquePrimary.slice(0, 2),
    secondaryPoints: uniqueSecondary.slice(0, 2),
    instructions: `${timingSuggestion ? timingSuggestion + "\n\n" : ""}Thực hiện bấm huyệt 2 lần mỗi ngày: buổi sáng sau khi thức dậy (6h-8h) và buổi tối trước khi ngủ (20h-22h). Bắt đầu với các huyệt chính, sau đó đến các huyệt phụ. Nên bấm trong tư thế ngồi thoải mái, lưng thẳng, hơi thở đều đặn.`,
    frequency: "2 lần/ngày, liên tục trong 2-4 tuần",
    precautions: [
      "Không bấm huyệt khi quá đói hoặc quá no (cách bữa ăn 1h)",
      "Không bấm huyệt khi vừa mới tắm nước nóng hoặc vận động mạnh",
      "Không bấm khi say rượu hoặc có vết thương tại vị trí huyệt",
      "Nếu cảm thấy đau quá mức, giảm lực bấm xuống",
      "Người cao tuổi, trẻ em nên giảm lực bấm và thời gian",
      "Nếu có bệnh nặng (ung thư, tim mạch, tiểu đường nặng), NÊN TƯ VẤN BÁC SĨ trước khi thực hiện",
    ],
    safetyAlerts: safetyAlerts.length > 0 ? safetyAlerts : undefined,
  }
}
