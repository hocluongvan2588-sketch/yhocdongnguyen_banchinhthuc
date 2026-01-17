/**
 * Anthropometric Logic - Lớp xử lý trung gian
 * Chuyển đổi dữ liệu thô từ user thành nhận định kỹ thuật
 * Giảm tải cho AI, chỉ cần AI luận giải văn chương
 */

export type Gender = "male" | "female" | "other"
export type PainLocation = "left" | "right" | "center" | "whole" | "unspecified"
export type AgeGroup = "child" | "youth" | "adult" | "senior"
export type GeographicRegion = "north" | "south" | "central" | "coastal" | "highland" | "unspecified"

// Mapping tỉnh thành với ngũ hành vùng miền
const PROVINCE_TO_REGION_ELEMENT: Record<string, { region: GeographicRegion; element: string; climate: string }> = {
  // Miền Bắc - Thủy
  "Hà Nội": { region: "north", element: "Thủy", climate: "Lạnh ẩm mùa đông, nóng ẩm mùa hè" },
  "Hải Phòng": { region: "coastal", element: "Thủy", climate: "Ven biển, gió mùa mạnh" },
  "Quảng Ninh": { region: "coastal", element: "Thủy", climate: "Ven biển, lạnh về đông" },
  "Bắc Ninh": { region: "north", element: "Thủy", climate: "Lạnh ẩm" },
  "Hải Dương": { region: "north", element: "Thủy", climate: "Lạnh ẩm" },
  "Hà Nam": { region: "north", element: "Thủy", climate: "Lạnh ẩm" },
  "Nam Định": { region: "north", element: "Thủy", climate: "Lạnh ẩm" },
  "Thái Bình": { region: "north", element: "Thủy", climate: "Lạnh ẩm" },
  "Ninh Bình": { region: "north", element: "Thủy", climate: "Lạnh ẩm" },

  // Tây Bắc - Mộc
  "Sơn La": { region: "highland", element: "Mộc", climate: "Cao nguyên, lạnh về đông" },
  "Lai Châu": { region: "highland", element: "Mộc", climate: "Núi cao, lạnh quanh năm" },
  "Điện Biên": { region: "highland", element: "Mộc", climate: "Cao nguyên, lạnh về đông" },
  "Hòa Bình": { region: "highland", element: "Mộc", climate: "Núi cao, mát mẻ" },

  // Miền Trung - Hỏa
  "Thanh Hóa": { region: "central", element: "Hỏa", climate: "Nóng khô mùa hè" },
  "Nghệ An": { region: "central", element: "Hỏa", climate: "Nóng khô, gió Lào" },
  "Hà Tĩnh": { region: "central", element: "Hỏa", climate: "Nóng khô, gió Lào" },
  "Quảng Bình": { region: "central", element: "Hỏa", climate: "Nóng khô" },
  "Quảng Trị": { region: "central", element: "Hỏa", climate: "Nóng ẩm" },
  Huế: { region: "central", element: "Hỏa", climate: "Nóng ẩm, mưa nhiều" },
  "Đà Nẵng": { region: "coastal", element: "Kim", climate: "Ven biển, nóng ẩm" },
  "Quảng Nam": { region: "central", element: "Hỏa", climate: "Nóng ẩm, mưa lũ" },
  "Quảng Ngãi": { region: "central", element: "Hỏa", climate: "Nóng khô" },

  // Tây Nguyên - Thổ
  "Kon Tum": { region: "highland", element: "Thổ", climate: "Cao nguyên, mát mẻ" },
  "Gia Lai": { region: "highland", element: "Thổ", climate: "Cao nguyên, nắng gắt" },
  "Đắk Lắk": { region: "highland", element: "Thổ", climate: "Cao nguyên, khô hạn" },
  "Đắk Nông": { region: "highland", element: "Thổ", climate: "Cao nguyên, khô hạn" },
  "Lâm Đồng": { region: "highland", element: "Thổ", climate: "Cao nguyên, mát mẻ quanh năm" },

  // Miền Nam - Kim
  "Bình Thuận": { region: "south", element: "Kim", climate: "Nắng nóng, khô hạn" },
  "Ninh Thuận": { region: "south", element: "Kim", climate: "Nắng nóng, khô hạn" },
  "TP. Hồ Chí Minh": { region: "south", element: "Kim", climate: "Nóng ẩm quanh năm" },
  "Đồng Nai": { region: "south", element: "Kim", climate: "Nóng ẩm" },
  "Bình Dương": { region: "south", element: "Kim", climate: "Nóng ẩm" },
  "Bà Rịa - Vũng Tàu": { region: "coastal", element: "Kim", climate: "Ven biển, nóng ẩm" },
  "Tiền Giang": { region: "south", element: "Thủy", climate: "Đồng bằng sông nước" },
  "Bến Tre": { region: "south", element: "Thủy", climate: "Đồng bằng sông nước" },
  "Vĩnh Long": { region: "south", element: "Thủy", climate: "Đồng bằng sông nước" },
  "Cần Thơ": { region: "south", element: "Thủy", climate: "Đồng bằng sông nước" },
  "An Giang": { region: "south", element: "Thủy", climate: "Đồng bằng sông nước" },
  "Kiên Giang": { region: "south", element: "Thủy", climate: "Ven biển, sông nước" },
  "Cà Mau": { region: "south", element: "Thủy", climate: "Ven biển, ẩm ướt" },
}

export interface AnthropometricAnalysis {
  // Phân tích giới tính - vị trí đau
  genderPainAnalysis: {
    tendency: "Thuận" | "Nghịch" | "Không áp dụng" // Chỉ áp dụng khi có left/right
    severity: "normal" | "concerning" // Nghịch = concerning
    explanation: string
    recommendation: string
  }

  // Phân tích độ tuổi
  ageAnalysis: {
    group: AgeGroup
    vulnerabilities: string[] // Điểm yếu theo lứa tuổi
    strengths: string[] // Điểm mạnh
    fearPattern: string // Sợ nhất pattern nào (Thể sinh Dụng / Dụng khắc Thể)
    recommendation: string
  }

  // Phân tích địa lý
  geographyAnalysis: {
    region: GeographicRegion
    element: string // Ngũ hành vùng miền
    climate: string
    environmentalRisks: string[] // Rủi ro từ môi trường
    seasonalConsideration: string
  }

  // Kết luận tổng hợp
  overallAssessment: {
    riskLevel: "low" | "medium" | "high"
    keyFactors: string[] // Yếu tố then chốt cần chú ý
    priorityAdvice: string // Lời khuyên ưu tiên nhất
  }
}

/**
 * Phân tích Giới tính + Vị trí đau (Quy tắc Thuận/Nghịch)
 */
export function analyzeGenderAndPainLocation(
  gender: Gender,
  painLocation: PainLocation,
): AnthropometricAnalysis["genderPainAnalysis"] {
  // Chỉ áp dụng khi vị trí đau rõ ràng là trái hoặc phải
  if (painLocation !== "left" && painLocation !== "right") {
    return {
      tendency: "Không áp dụng",
      severity: "normal",
      explanation: "Quy tắc Thuận/Nghịch chỉ áp dụng khi vị trí đau rõ ràng ở bên trái hoặc bên phải cơ thể.",
      recommendation: "Tập trung phân tích quan hệ Thể-Dụng và ngũ hành.",
    }
  }

  // Nam đau trái = Thuận, đau phải = Nghịch
  // Nữ ngược lại
  const isFavorable =
    (gender === "male" && painLocation === "left") || (gender === "female" && painLocation === "right")

  return {
    tendency: isFavorable ? "Thuận" : "Nghịch",
    severity: isFavorable ? "normal" : "concerning",
    explanation: isFavorable
      ? `Theo Y Dịch, ${gender === "male" ? "nam giới" : "nữ giới"} đau bên ${painLocation === "left" ? "trái" : "phải"} thuộc "Thuận tính" - phù hợp với khí huyết tự nhiên.`
      : `Theo Y Dịch, ${gender === "male" ? "nam giới" : "nữ giới"} đau bên ${painLocation === "left" ? "trái" : "phải"} thuộc "Nghịch tính" - ngược dòng khí huyết, bệnh dễ dai dẳng.`,
    recommendation: isFavorable
      ? "Bệnh dễ hồi phục nếu được điều trị đúng cách và kiên trì."
      : "Cần kiên nhẫn và bền bỉ trong quá trình điều trị, tránh tự ý ngưng thuốc khi triệu chứng giảm nhẹ.",
  }
}

/**
 * Phân tích Độ tuổi
 */
export function analyzeAgeGroup(age: number): AnthropometricAnalysis["ageAnalysis"] {
  if (age < 16) {
    return {
      group: "child",
      vulnerabilities: [
        "Hệ hô hấp non yếu (Phổi - Kim)",
        "Hệ tiêu hóa chưa hoàn thiện (Tỳ - Thổ)",
        "Dễ bị cảm nhiễm ngoại tà (Phong Hàn)",
      ],
      strengths: ["Sinh khí vượng", "Hồi phục nhanh khi được chăm sóc đúng cách"],
      fearPattern: "Dụng khắc Thể (tà khí mạnh áp đảo chính khí)",
      recommendation:
        "Ưu tiên bảo vệ chính khí, tránh dùng thuốc quá mạnh. Tập trung dinh dưỡng và nghỉ ngơi để cơ thể tự hồi phục.",
    }
  } else if (age < 40) {
    return {
      group: "youth",
      vulnerabilities: ["Dễ lao tâm tổn khí do căng thẳng công việc", "Thói quen sinh hoạt không lành mạnh"],
      strengths: ["Khí huyết sung mãn", "Khả năng hồi phục tốt", "Chịu đựng điều trị tốt"],
      fearPattern: "Thể sinh Dụng (tiêu hao quá mức do lao lực)",
      recommendation: "Cân bằng giữa công việc và nghỉ ngơi. Có thể áp dụng cả tả hỏa lẫn bồi bổ một cách linh hoạt.",
    }
  } else if (age < 60) {
    return {
      group: "adult",
      vulnerabilities: [
        "Thận khí bắt đầu suy (Thủy)",
        "Dễ mắc bệnh mãn tính (cao huyết áp, đái tháo đường)",
        "Thoái hóa khớp",
      ],
      strengths: ["Kinh nghiệm tự chăm sóc bản thân", "Ổn định về tinh thần"],
      fearPattern: "Thể sinh Dụng (hao tán nguyên khí khi tuổi già)",
      recommendation:
        "Chú trọng bồi bổ nguyên khí, tránh tiêu hao quá mức. Điều trị từ từ, kiên trì lâu dài hơn là mạnh mà gấp.",
    }
  } else {
    return {
      group: "senior",
      vulnerabilities: [
        "Nguyên khí suy yếu (Thận - Thủy)",
        "Khí huyết bất túc",
        "Dễ mắc nhiều bệnh đồng thời",
        "Chức năng cơ quan suy giảm",
      ],
      strengths: ["Tâm thái ổn định giúp điều trị hiệu quả hơn"],
      fearPattern: "Thể sinh Dụng (SỢ NHẤT - hao tán nguyên khí già yếu)",
      recommendation:
        'Tuyệt đối tránh "Thể sinh Dụng". Ưu tiên bồi bổ, nuôi dưỡng thận khí. Điều trị nhẹ nhàng, lâu dài, không vội vàng.',
    }
  }
}

/**
 * Phân tích Địa lý
 */
export function analyzeGeography(location: string): AnthropometricAnalysis["geographyAnalysis"] {
  const regionData = PROVINCE_TO_REGION_ELEMENT[location]

  if (!regionData) {
    return {
      region: "unspecified",
      element: "Không xác định",
      climate: "Không có thông tin",
      environmentalRisks: [],
      seasonalConsideration: "Vui lòng cung cấp địa điểm cụ thể để phân tích chính xác hơn.",
    }
  }

  const { region, element, climate } = regionData
  const risks: string[] = []

  // Xác định rủi ro theo vùng miền + ngũ hành
  switch (element) {
    case "Thủy":
      risks.push("Nhiễm lạnh, phong thấp")
      risks.push("Bệnh về khớp, xương")
      risks.push("Dễ bị cảm lạnh kéo dài")
      break
    case "Hỏa":
      risks.push("Nhiệt độc, hỏa khí thịnh")
      risks.push("Cao huyết áp, đau đầu")
      risks.push("Dễ nóng giận, mất ngủ")
      break
    case "Mộc":
      risks.push("Phong tà (gió rừng)")
      risks.push("Bệnh về gan, mật")
      risks.push("Dị ứng, ngứa ngáy")
      break
    case "Kim":
      risks.push("Táo khô, tổn thương phổi")
      risks.push("Ho khan, viêm họng")
      risks.push("Da khô, dễ nứt nẻ")
      break
    case "Thổ":
      risks.push("Ẩm thấp (độ cao)")
      risks.push("Bệnh về lách, dạ dày")
      risks.push("Tiêu hóa kém")
      break
  }

  let seasonalConsideration = ""
  const currentMonth = new Date().getMonth() + 1

  if (element === "Thủy" && (currentMonth >= 11 || currentMonth <= 2)) {
    seasonalConsideration = "Mùa đông, Thủy khí thịnh - cần đặc biệt chú ý giữ ấm, tránh lạnh."
  } else if (element === "Hỏa" && currentMonth >= 5 && currentMonth <= 8) {
    seasonalConsideration = "Mùa hè, Hỏa khí thịnh - cần tránh nắng nóng, uống đủ nước, ăn nhẹ."
  } else if (element === "Mộc" && currentMonth >= 3 && currentMonth <= 4) {
    seasonalConsideration = "Mùa xuân, Mộc khí thịnh - mùa dễ dị ứng, cần chú ý vệ sinh môi trường."
  } else {
    seasonalConsideration = "Mùa này khí hậu ổn định, tiếp tục theo dõi và chăm sóc đều đặn."
  }

  return {
    region,
    element,
    climate,
    environmentalRisks: risks,
    seasonalConsideration,
  }
}

/**
 * Kết hợp tất cả yếu tố nhân trắc học
 */
export function performAnthropometricAnalysis(params: {
  gender: Gender
  age: number
  painLocation: PainLocation
  location: string
  bodyUseRelationship: string // Từ logic hiện tại: "Dụng khắc Thể" | "Thể sinh Dụng" | ...
}): AnthropometricAnalysis {
  const { gender, age, painLocation, location, bodyUseRelationship } = params

  const genderPainAnalysis = analyzeGenderAndPainLocation(gender, painLocation)
  const ageAnalysis = analyzeAgeGroup(age)
  const geographyAnalysis = analyzeGeography(location)

  // Tính risk level tổng hợp
  let riskLevel: "low" | "medium" | "high" = "low"
  const keyFactors: string[] = []

  // 1. Check Thuận/Nghịch
  if (genderPainAnalysis.tendency === "Nghịch") {
    riskLevel = "medium"
    keyFactors.push("Vị trí đau nghịch với khí huyết tự nhiên")
  }

  // 2. Check tuổi + relationship
  if (ageAnalysis.group === "senior" && bodyUseRelationship === "Thể sinh Dụng") {
    riskLevel = "high"
    keyFactors.push("Người cao tuổi gặp pattern 'Thể sinh Dụng' - hao tán nguyên khí nghiêm trọng")
  } else if (ageAnalysis.group === "child" && bodyUseRelationship === "Dụng khắc Thể") {
    riskLevel = "high"
    keyFactors.push("Trẻ em gặp pattern 'Dụng khắc Thể' - tà khí mạnh áp đảo chính khí")
  }

  // 3. Check địa lý
  if (geographyAnalysis.environmentalRisks.length > 0) {
    keyFactors.push(`Môi trường ${geographyAnalysis.element} có thể gây ${geographyAnalysis.environmentalRisks[0]}`)
  }

  // Lời khuyên ưu tiên
  let priorityAdvice = ""
  if (riskLevel === "high") {
    priorityAdvice = ageAnalysis.recommendation + " " + genderPainAnalysis.recommendation
  } else if (genderPainAnalysis.tendency === "Nghịch") {
    priorityAdvice = genderPainAnalysis.recommendation
  } else {
    priorityAdvice = "Tiếp tục theo dõi và điều trị theo phác đồ, kết hợp chế độ sinh hoạt phù hợp."
  }

  return {
    genderPainAnalysis,
    ageAnalysis,
    geographyAnalysis,
    overallAssessment: {
      riskLevel,
      keyFactors,
      priorityAdvice,
    },
  }
}

/**
 * Helper: Chuyển đổi anthropometric analysis thành prompt context cho AI
 */
export function formatAnthropometricContextForAI(analysis: AnthropometricAnalysis): string {
  let context = "**THÔNG TIN NHÂN TRẮC HỌC (Phân tích sẵn):**\n\n"

  // 1. Giới tính - Vị trí đau
  context += `**Quy tắc Thuận/Nghịch:** ${analysis.genderPainAnalysis.tendency}\n`
  context += `- ${analysis.genderPainAnalysis.explanation}\n`
  if (analysis.genderPainAnalysis.tendency !== "Không áp dụng") {
    context += `- Khuyến nghị: ${analysis.genderPainAnalysis.recommendation}\n\n`
  }

  // 2. Độ tuổi
  context += `**Độ tuổi:** ${analysis.ageAnalysis.group === "senior" ? "Người cao tuổi (>60)" : analysis.ageAnalysis.group === "child" ? "Trẻ em (<16)" : analysis.ageAnalysis.group === "youth" ? "Thanh niên (16-40)" : "Trung niên (40-60)"}\n`
  context += `- Điểm yếu: ${analysis.ageAnalysis.vulnerabilities.join(", ")}\n`
  context += `- Sợ nhất pattern: ${analysis.ageAnalysis.fearPattern}\n`
  context += `- Khuyến nghị: ${analysis.ageAnalysis.recommendation}\n\n`

  // 3. Địa lý
  if (analysis.geographyAnalysis.region !== "unspecified") {
    context += `**Địa lý:** Vùng ${analysis.geographyAnalysis.element} (${analysis.geographyAnalysis.climate})\n`
    context += `- Rủi ro môi trường: ${analysis.geographyAnalysis.environmentalRisks.join(", ")}\n`
    context += `- Lưu ý mùa vụ: ${analysis.geographyAnalysis.seasonalConsideration}\n\n`
  }

  // 4. Kết luận
  context += `**MỨC ĐỘ RỦI RO TỔNG HỢP:** ${analysis.overallAssessment.riskLevel === "high" ? "CAO ⚠️" : analysis.overallAssessment.riskLevel === "medium" ? "TRUNG BÌNH ⚡" : "THẤP ✓"}\n`
  if (analysis.overallAssessment.keyFactors.length > 0) {
    context += `- Yếu tố then chốt: ${analysis.overallAssessment.keyFactors.join("; ")}\n`
  }
  context += `- Lời khuyên ưu tiên: ${analysis.overallAssessment.priorityAdvice}\n\n`

  context += `---\n**LƯU Ý CHO AI:** Hãy tham chiếu các thông tin trên khi luận giải. Không cần tính toán lại các quy tắc này, chỉ cần kết hợp với quan hệ Thể-Dụng để đưa ra nhận định văn chương.\n\n`

  return context
}
