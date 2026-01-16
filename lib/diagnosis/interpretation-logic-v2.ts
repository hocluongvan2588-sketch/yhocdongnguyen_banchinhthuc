import { BAGUA_HEALTH_MAPPING, SPECIAL_HEXAGRAM_COMBINATIONS } from "./bagua-mappings"
import { calculateMutualHexagram, getSeasonalStrength } from "./hexagram-calculation"
import { KHAC, SINH } from "./element-relations"
import { ELEMENT_TO_ORGAN } from "./organ-mappings"

export interface ComprehensiveDiagnosis {
  // Quẻ Chủ
  mainHexagram: {
    upper: number
    lower: number
    upperName: string
    lowerName: string
    bodyTrigram: number // Thể
    useTrigram: number // Dụng
    movingLine: number
  }

  // Quẻ Hổ
  mutualHexagram: {
    upper: number
    lower: number
    upperName: string
    lowerName: string
    meaning: string
  }

  // Quẻ Biến
  transformedHexagram: {
    upper: number
    lower: number
    upperName: string
    lowerName: string
  }

  // Phân tích Thể-Dụng
  bodyUseAnalysis: {
    bodyElement: string
    useElement: string
    relationship: string // "Dụng khắc Thể" | "Thể khắc Dụng" | "Dụng sinh Thể" | "Thể sinh Dụng" | "Tỷ hòa"
    severity: "mild" | "moderate" | "severe"
    prognosis: string
  }

  // Phân tích cơ quan bị ảnh hưởng
  affectedOrgans: {
    primary: string
    secondary: string
    bodyParts: string[]
    symptoms: string[]
  }

  // Phân tích theo mùa
  seasonalAnalysis: {
    bodyStrength: ReturnType<typeof getSeasonalStrength>
    useStrength: ReturnType<typeof getSeasonalStrength>
    overallAssessment: string
  }

  // Diễn giải chi tiết
  interpretation: {
    title: string
    summary: string
    mechanism: string
    specificSymptoms: string
    advice: string
    urgency: "low" | "medium" | "high"
  }

  // Gợi ý gói cước
  recommendedPackage: "basic" | "advanced" | "comprehensive"
}

export function performComprehensiveDiagnosis(params: {
  upperTrigram: number
  lowerTrigram: number
  movingLine: number
  healthConcern: string
  currentMonth: number
  transformedUpper: number
  transformedLower: number
}): ComprehensiveDiagnosis {
  const { upperTrigram, lowerTrigram, movingLine, healthConcern, currentMonth, transformedUpper, transformedLower } =
    params

  // Xác định Thể và Dụng theo hào động
  let bodyTrigram: number, useTrigram: number
  if (movingLine <= 3) {
    bodyTrigram = upperTrigram // Thượng quẻ là Thể
    useTrigram = lowerTrigram // Hạ quẻ là Dụng
  } else {
    bodyTrigram = lowerTrigram // Hạ quẻ là Thể
    useTrigram = upperTrigram // Thượng quẻ là Dụng
  }

  const bodyInfo = BAGUA_HEALTH_MAPPING[bodyTrigram]
  const useInfo = BAGUA_HEALTH_MAPPING[useTrigram]

  // Tính Quẻ Hổ
  const mutual = calculateMutualHexagram(upperTrigram, lowerTrigram)
  const mutualUpperInfo = BAGUA_HEALTH_MAPPING[mutual.mutualUpper]
  const mutualLowerInfo = BAGUA_HEALTH_MAPPING[mutual.mutualLower]

  // Phân tích quan hệ Thể-Dụng
  const bodyElement = bodyInfo.element
  const useElement = useInfo.element

  let relationship = ""
  let severity: "mild" | "moderate" | "severe" = "mild"
  let prognosis = ""

  if (KHAC[useElement] === bodyElement) {
    relationship = "Dụng khắc Thể"
    severity = "severe"
    prognosis = "Bệnh nặng, khó khỏi, có biến chứng. Cần can thiệp tích cực ngay."
  } else if (KHAC[bodyElement] === useElement) {
    relationship = "Thể khắc Dụng"
    severity = "moderate"
    prognosis = "Bệnh kéo dài nhưng người bệnh đủ sức chống chọi. Cần kiên trì điều trị."
  } else if (SINH[bodyElement] === useElement) {
    relationship = "Thể sinh Dụng"
    severity = "moderate"
    prognosis = "Sức khỏe suy kiệt, tốn kém tiền bạc điều trị. Cần nghỉ ngơi và bồi bổ."
  } else if (SINH[useElement] === bodyElement) {
    relationship = "Dụng sinh Thể"
    severity = "mild"
    prognosis = "Bệnh mau khỏi, gặp thầy gặp thuốc. Đây là quẻ tốt!"
  } else {
    relationship = "Tỷ hòa"
    severity = "mild"
    prognosis = "Bệnh nhẹ, ổn định, tự khỏi hoặc dễ chữa."
  }

  // Kiểm tra tổ hợp quẻ đặc biệt
  const specialKey = `${upperTrigram}-${lowerTrigram}`
  const specialCombo = SPECIAL_HEXAGRAM_COMBINATIONS[specialKey]
  if (specialCombo) {
    severity = specialCombo.severity
    prognosis += ` ⚠️ ${specialCombo.warning}`
  }

  // Phân tích theo mùa
  const bodyStrength = getSeasonalStrength(bodyElement, currentMonth)
  const useStrength = getSeasonalStrength(useElement, currentMonth)

  let seasonalAssessment = ""
  if (bodyStrength.strength === "tử" || bodyStrength.strength === "tù") {
    seasonalAssessment = `⚠️ CẢNH BÁO: Hiện tại là tháng ${currentMonth}, ${bodyInfo.organSimple} (${bodyElement}) đang trong trạng thái "${bodyStrength.strength}" - CỰC KỲ YẾU. ${bodyStrength.description}. ${bodyStrength.advice}`
    severity = "severe"
  } else if (bodyStrength.strength === "vượng") {
    seasonalAssessment = `✅ TỐT: Tháng ${currentMonth}, ${bodyInfo.organSimple} (${bodyElement}) đang "vượng" - mạnh nhất trong năm. ${bodyStrength.description}. Đây là thời điểm TỐT để điều trị!`
    if (severity === "severe") severity = "moderate"
  } else {
    seasonalAssessment = `Tháng ${currentMonth}, ${bodyInfo.organSimple} (${bodyElement}) đang ở mức "${bodyStrength.strength}". ${bodyStrength.description}`
  }

  // Phân tích cụ thể theo triệu chứng
  const specificAnalysis = analyzeSpecificConcern(
    healthConcern,
    bodyElement,
    useElement,
    relationship,
    movingLine,
    currentMonth,
  )

  // Gợi ý gói cước
  let recommendedPackage: "basic" | "advanced" | "comprehensive" = "basic"
  if (severity === "severe") {
    recommendedPackage = "comprehensive"
  } else if (severity === "moderate") {
    recommendedPackage = "advanced"
  }

  return {
    mainHexagram: {
      upper: upperTrigram,
      lower: lowerTrigram,
      upperName: BAGUA_HEALTH_MAPPING[upperTrigram].name,
      lowerName: BAGUA_HEALTH_MAPPING[lowerTrigram].name,
      bodyTrigram,
      useTrigram,
      movingLine,
    },
    mutualHexagram: {
      upper: mutual.mutualUpper,
      lower: mutual.mutualLower,
      upperName: mutualUpperInfo.name,
      lowerName: mutualLowerInfo.name,
      meaning: mutual.description,
    },
    transformedHexagram: {
      upper: transformedUpper,
      lower: transformedLower,
      upperName: BAGUA_HEALTH_MAPPING[transformedUpper].name,
      lowerName: BAGUA_HEALTH_MAPPING[transformedLower].name,
    },
    bodyUseAnalysis: {
      bodyElement,
      useElement,
      relationship,
      severity,
      prognosis,
    },
    affectedOrgans: {
      primary: bodyInfo.organs,
      secondary: useInfo.organs,
      bodyParts: [bodyInfo.bodyPart, useInfo.bodyPart],
      symptoms: [...bodyInfo.symptoms, ...specificAnalysis.additionalSymptoms],
    },
    seasonalAnalysis: {
      bodyStrength,
      useStrength,
      overallAssessment: seasonalAssessment,
    },
    interpretation: {
      title: specificAnalysis.title,
      summary: specificAnalysis.summary,
      mechanism: specificAnalysis.mechanism,
      specificSymptoms: specificAnalysis.symptoms,
      advice: specificAnalysis.advice,
      urgency: severity === "severe" ? "high" : severity === "moderate" ? "medium" : "low",
    },
    recommendedPackage,
  }
}

function analyzeSpecificConcern(
  concern: string,
  bodyElement: string,
  useElement: string,
  relation: string,
  movingLine: number,
  currentMonth: number,
): {
  title: string
  summary: string
  mechanism: string
  symptoms: string
  advice: string
  additionalSymptoms: string[]
} {
  const lowerConcern = concern.toLowerCase().trim()

  if (lowerConcern.includes("đầu gối") || lowerConcern.includes("gối") || lowerConcern.includes("khớp gối")) {
    return analyzeKneePain(bodyElement, useElement, relation, movingLine, currentMonth, lowerConcern)
  }

  // Kiểm tra đau đầu (head pain) - PHẢI SAU khi loại trừ "đầu gối"
  if (lowerConcern.includes("đau đầu") || lowerConcern.includes("nhức đầu") || lowerConcern.includes("đau nửa đầu")) {
    return analyzeHeadache(bodyElement, useElement, relation, movingLine, currentMonth, lowerConcern)
  }

  const bodyInfo = Object.values(BAGUA_HEALTH_MAPPING).find((info) => info.element === bodyElement)
  const useInfo = Object.values(BAGUA_HEALTH_MAPPING).find((info) => info.element === useElement)

  return {
    title: `Tình trạng liên quan đến ${bodyInfo?.organs}`,
    summary: `Quẻ tượng cho thấy ${bodyInfo?.organs} (${bodyElement}) đang ${relation}. ${bodyInfo?.description}`,
    mechanism: `Theo Mai Hoa Dịch Số, ${bodyInfo?.name} quẻ chủ ${bodyInfo?.bodyPart}. Khi ${relation}, ảnh hưởng trực tiếp đến ${bodyInfo?.organs} và các cơ quan liên quan.`,
    symptoms: `Có thể xuất hiện các triệu chứng: ${bodyInfo?.symptoms.join(", ")}`,
    advice: `Nên gặp thầy thuốc Đông y để được khám trực tiếp và kê đơn chính xác theo thể trạng cá nhân. Trong thời gian chờ đợi:
1. Nghỉ ngơi đầy đủ, tránh căng thẳng
2. Ăn uống điều độ, phù hợp với ngũ hành
3. Chú ý các triệu chứng bất thường và ghi chép lại
4. Không tự ý dùng thuốc mạnh

Hãy tin tưởng vào khả năng tự phục hồi của cơ thể khi được chăm sóc đúng cách!`,
    additionalSymptoms: bodyInfo?.symptoms.slice(0, 2) || [],
  }
}

function analyzeKneePain(
  bodyElement: string,
  useElement: string,
  relation: string,
  movingLine: number,
  currentMonth: number,
  concern: string,
): {
  title: string
  summary: string
  mechanism: string
  symptoms: string
  advice: string
  additionalSymptoms: string[]
} {
  const organ = ELEMENT_TO_ORGAN[bodyElement as keyof typeof ELEMENT_TO_ORGAN]

  let analysis = `Về vấn đề "${concern}" của bạn:\n\n`

  // Phân tích theo y học cổ truyền
  analysis += `**Cơ chế bệnh lý theo Đông y:**\n\n`
  analysis += `Khớp gối trong y học cổ truyền thuộc "Tứ chi bách hài" (tứ chi trăm khớp), do Gan chủ gân (肝主筋), Thận chủ cốt (腎主骨), Tỳ chủ cơ (脾主肉). Ba tạng này phối hợp điều hòa thì gối khỏe mạnh.\n\n`

  // Phân tích dựa trên quan hệ Thể-Dụng
  if (relation === "用生體") {
    analysis += `Theo quẻ của bạn, ${organ.organ} đang được hỗ trợ tốt từ bên ngoài. Tuy nhiên, đau gối có thể do:\n\n`
    analysis += `1. **Khí huyết lưu thông chưa đến khớp:** Dù ${organ.organ} khỏe nhưng khí huyết chưa xuống đến gối đủ mạnh.\n`
    analysis += `2. **Phong hàn thấp khí xâm nhập:** Thời tiết lạnh, ẩm làm tắc kinh lạc ở gối (風寒濕邪).\n`
    analysis += `3. **Gan Thận bất túc:** Gan chủ gân, Thận chủ cốt, nếu hai tạng này yếu thì gối dễ đau.\n\n`

    analysis += `**Triệu chứng thường kèm theo:**\n`
    analysis += `- Đau tăng khi trời lạnh, trời mưa\n`
    analysis += `- Gối cứng vào buổi sáng, cử động khó khăn\n`
    analysis += `- Có thể sưng nhẹ, ấn vào đau\n`
    analysis += `- Đau lan xuống cẳng chân hoặc lên đùi\n\n`

    analysis += `**Xử lý ngay tại nhà:**\n`
    analysis += `1. **Chườm nóng:** Dùng túi chườm nóng hoặc khăn ấm đắp lên gối 15-20 phút, 2 lần/ngày.\n`
    analysis += `2. **Xoa bóp huyệt:** Xoa nhẹ huyệt Dương Lăng Tuyền (陽陵泉) ở mặt ngoài gối, huyệt Âm Lăng Tuyền (陰陵泉) ở mặt trong gối, mỗi huyệt 5 phút.\n`
    analysis += `3. **Ngâm chân:** Ngâm chân nước ấm có muối hoặc gừng, kích thích lưu thông khí huyết xuống chi dưới.\n\n`

    analysis += `**Điều trị lâu dài:**\n`
    analysis += `- **Bổ Gan Thận:** Ăn các thực phẩm như đậu đen, óc chó, nấm đông cô, hải sâm.\n`
    analysis += `- **Tránh phong hàn:** Giữ ấm gối, không ngồi sàn lạnh, không tắm nước lạnh.\n`
    analysis += `- **Vận động vừa phải:** Đi bộ nhẹ nhàng, bơi lội, yoga nhẹ để gân cốt khỏe mạnh.\n`
    analysis += `- **Châm cứu:** Tìm thầy thuốc Đông y châm các huyệt Dương Lăng Tuyền, Âm Lăng Tuyền, Túc Tam Lý, Huyết Hải.\n\n`
  } else if (relation === "用克體") {
    analysis += `Theo quẻ của bạn, ${organ.organ} đang bị môi trường bên ngoài khắc chế. Đây là dấu hiệu CẢNH BÁO về đau gối:\n\n`
    analysis += `**Tình trạng nghiêm trọng hơn:**\n`
    analysis += `- Đau gối dai dẳng, khó thuyên giảm\n`
    analysis += `- Có thể có viêm khớp, thoái hóa khớp đang diễn tiến\n`
    analysis += `- Khí huyết bị ứ trệ, không xuống được gối\n`
    analysis += `- ${organ.organ} yếu kéo theo Gan Thận bất túc\n\n`

    analysis += `**BẠN CẦN KHÁM NGAY với bác sĩ Đông y hoặc bác sĩ Cơ Xương Khớp vì:**\n`
    analysis += `- Có thể có tổn thương sụn, dây chằng cần điều trị chuyên sâu\n`
    analysis += `- Cần chụp X-quang hoặc siêu âm để xác định chính xác nguyên nhân\n`
    analysis += `- Có thể cần uống thuốc hoặc châm cứu để hỗ trợ\n\n`

    analysis += `**Xử lý tạm thời:**\n`
    analysis += `1. **Hạn chế vận động:** Tránh leo cầu thang, đi bộ quá nhiều\n`
    analysis += `2. **Chườm nóng:** 2-3 lần/ngày, mỗi lần 20 phút\n`
    analysis += `3. **Nâng cao chân khi nằm:** Giúp giảm sưng và đau\n\n`
  } else if (relation === "體生用") {
    analysis += `Theo quẻ của bạn, ${organ.organ} đang tiêu hao năng lượng ra bên ngoài. Đau gối có thể do:\n\n`
    analysis += `**Nguyên nhân:**\n`
    analysis += `- Cơ thể đang bị mệt mỏi, làm việc quá sức\n`
    analysis += `- Gan Thận hư tổn, không đủ sức nuôi dưỡng gân cốt\n`
    analysis += `- Khí huyết không đủ để nuôi dưỡng khớp gối\n\n`

    analysis += `**Lời khuyên:**\n`
    analysis += `1. **Nghỉ ngơi nhiều hơn:** Không làm việc quá sức, ngủ đủ 7-8 tiếng/đêm\n`
    analysis += `2. **Bồi bổ khí huyết:** Ăn thịt gà, trứng, nấm, rau xanh, hạt dinh dưỡng\n`
    analysis += `3. **Tránh vận động mạnh:** Không chạy, nhảy, leo núi cho đến khi gối bớt đau\n\n`
  } else {
    analysis += `Theo y học cổ truyền, đau gối liên quan đến Gan (chủ gân), Thận (chủ cốt), Tỳ (chủ cơ). Bạn cần gặp bác sĩ Đông y để được khám mạch, xem lưỡi và kê đơn thuốc bồi bổ ba tạng này.\n\n`
  }

  return {
    title: `Đau khớp gối do ${organ.organ} ${relation.includes("khắc") ? "bị tổn thương" : "suy yếu"}`,
    summary: `Từ góc nhìn Mai Hoa Dịch Số, đau khớp gối của bạn xuất phát từ ${organ.organ} quẻ đang ${relation}. Theo y học cổ truyền, đầu gối thuộc về Thận (Thủy) và Gan (Mộc) - Thận chủ xương, Gan chủ gân cơ.`,
    mechanism: analysis,
    symptoms: `Triệu chứng thường gặp: Đau khớp gối khi lên xuống cầu thang, đi lâu thì đau, sưng nhẹ vùng khớp, cứng khớp buổi sáng, đau tăng khi trời lạnh ẩm, yếu mỏi chân.`,
    advice: `Xử lý tức thì: 
1. **Nghỉ ngơi khớp gối**: Tránh đi bộ nhiều, leo cầu thang, mang vác nặng trong 3-5 ngày.
2. **Chườm ấm**: Dùng khăn ấm hoặc túi chườm nóng chườm vào khớp gối 15-20 phút mỗi ngày. Nhiệt độ vừa phải, không quá nóng.
3. **Bấm huyệt**: Bấm huyệt Độc Tỵ (phía trong đầu gối), Dương Lăng Tuyền (phía ngoài đầu gối), Huyết Hải (trên xương bánh chè).
4. **Bổ sung dinh dưỡng**: ${relation.includes("Thận") || bodyElement === "Thủy" ? "Ăn thực phẩm bổ Thận như tôm, cua, hạt sen, hạt dẻ, đậu đen, xương hầm. Uống thuốc bổ xương khớp có Ngưu Tất, Độc Hoạt." : relation.includes("Gan") || bodyElement === "Mộc" ? "Ăn thực phẩm bổ Gan như rau xanh, gân bò, gan heo, nho đỏ. Bổ sung Collagen và Glucosamine." : "Ăn đầy đủ chất dinh dưỡng, tăng cường protein và canxi."}
5. **Vận động nhẹ**: Sau 3 ngày nghỉ, bắt đầu gập duỗi gối nhẹ nhàng, bơi lội (không chạy bộ).

⚠️ **LƯU Ý**: ${relation.includes("khắc") ? "Đừng bỏ qua! Nếu không điều trị kịp thời, khớp gối sẽ thoái hóa nhanh, dẫn đến viêm khớp mãn tính, khó đi lại." : "Đây là thời điểm tốt để điều trị. Hãy kiên trì bồi bổ trong 2-3 tháng để khớp gối phục hồi hoàn toàn."}`,
    additionalSymptoms: [
      "Đau lưng",
      "Yếu chân",
      "Tiểu đêm nhiều (nếu liên quan Thận)",
      "Chuột rút (nếu liên quan Gan)",
    ],
  }
}

function analyzeHeadache(
  bodyElement: string,
  useElement: string,
  relation: string,
  movingLine: number,
  currentMonth: number,
  concern: string,
): {
  title: string
  summary: string
  mechanism: string
  symptoms: string
  advice: string
  additionalSymptoms: string[]
} {
  const bodyInfo = Object.values(BAGUA_HEALTH_MAPPING).find((info) => info.element === bodyElement)
  const useInfo = Object.values(BAGUA_HEALTH_MAPPING).find((info) => info.element === useElement)

  let analysis = `Về vấn đề "${concern}" của bạn:\n\n`

  // Phân tích theo y học cổ truyền
  analysis += `**Cơ chế bệnh lý theo Đông y:**\n\n`
  analysis += `Đau đầu trong y học cổ truyền liên quan đến các tạng như Tim (chủ Thần), Gan (chủ Can huyết), Hỏa (chủ nhiệt), và Thổ (chủ vận hóa). Quẻ của bạn cho thấy ${bodyInfo?.organs} (${bodyElement}) đang ${relation}.\n\n`

  // Phân tích dựa trên quan hệ Thể-Dụng
  if (relation === "用生體") {
    analysis += `Theo quẻ của bạn, ${bodyInfo?.organs} đang được hỗ trợ tốt từ bên ngoài. Tuy nhiên, đau đầu có thể do:\n\n`
    analysis += `1. **Khí huyết lưu thông chưa đến đầu:** Dù ${bodyInfo?.organs} khỏe nhưng khí huyết chưa đi đến đầu đủ mạnh.\n`
    analysis += `2. **Thân nhiệt tăng cao:** Nếu Tim hoặc Hỏa vượng, có thể gây đau đầu do nhiệt ứ đọng.\n`
    analysis += `3. **Can huyết hư tổn:** Nếu Gan yếu, không đủ sức nuôi dưỡng Thần.\n\n`

    analysis += `**Triệu chứng thường kèm theo:**\n`
    analysis += `- Đau tăng khi trời nóng, thời tiết thay đổi\n`
    analysis += `- Có thể kèm chóng mặt, mỏi mắt\n`
    analysis += `- Đau lan lên cổ hoặc xuống cánh tay\n\n`

    analysis += `**Xử lý ngay tại nhà:**\n`
    analysis += `1. **Nghỉ ngơi ngay:** Đừng cố gắng tiếp tục làm việc. Nằm nghỉ trong phòng tối, yên tĩnh.\n`
    analysis += `2. **Bấm huyệt:** Bấm huyệt Thái Dương (太陽) ở thái dương huyệt, Ấn Đường (印堂) giữa hai lông mày, Phong Trì (風池) sau gáy, Hợp Cốc (合谷) giữa ngón cái và ngón trỏ. Bấm mỗi huyệt 2-3 phút.\n`
    analysis += `3. **Uống nước ấm:** Uống nước ấm có mật ong hoặc đường để bổ sung năng lượng nhanh.\n`
    analysis += `4. **Massage nhẹ:** Xoa bóp đầu, gáy nhẹ nhàng theo chiều từ trán ra sau gáy để lưu thông khí huyết.\n\n`

    analysis += `**Điều trị lâu dài:**\n`
    analysis += `- **Bổ Tim Gan:** Ăn các thực phẩm như cá, thịt gà, hạt sen, nấm đông cô.\n`
    analysis += `- **Tránh nhiệt:** Giữ mát đầu, tránh ánh nắng mạnh, thời tiết thay đổi quá nhanh.\n`
    analysis += `- **Vận động nhẹ nhàng:** Đi bộ nhẹ nhàng, yoga nhẹ để giảm căng thẳng.\n`
    analysis += `- **Châm cứu:** Tìm thầy thuốc Đông y châm các huyệt Thái Dương, Ấn Đường, Phong Trì, Hợp Cốc.\n\n`
  } else if (relation === "用克體") {
    analysis += `Theo quẻ của bạn, ${bodyInfo?.organs} đang bị môi trường bên ngoài khắc chế. Đây là dấu hiệu CẢNH BÁO về đau đầu:\n\n`
    analysis += `**Tình trạng nghiêm trọng hơn:**\n`
    analysis += `- Đau đầu dai dẳng, khó thuyên giảm\n`
    analysis += `- Có thể có đau nửa đầu, chóng mặt liên tục\n`
    analysis += `- Khí huyết bị ứ trệ, không đi đến đầu\n`
    analysis += `- ${bodyInfo?.organs} yếu kéo theo Tim Gan bất túc\n\n`

    analysis += `**BẠN CẦN KHÁM NGAY với bác sĩ Đông y vì:**\n`
    analysis += `- Có thể có các vấn đề về mạch máu hoặc thần kinh cần điều trị chuyên sâu\n`
    analysis += `- Cần xem lưỡi để xác định chính xác nguyên nhân\n`
    analysis += `- Có thể cần uống thuốc hoặc châm cứu để hỗ trợ\n\n`

    analysis += `**Xử lý tạm thời:**\n`
    analysis += `1. **Hạn chế vận động:** Tránh làm việc căng thẳng, nghỉ ngơi nhiều hơn\n`
    analysis += `2. **Chườm nóng:** 2-3 lần/ngày, mỗi lần 20 phút\n`
    analysis += `3. **Nâng cao chân khi nằm:** Giúp giảm sưng và đau\n\n`
  } else if (relation === "體生用") {
    analysis += `Theo quẻ của bạn, ${bodyInfo?.organs} đang tiêu hao năng lượng ra bên ngoài. Đau đầu có thể do:\n\n`
    analysis += `**Nguyên nhân:**\n`
    analysis += `- Cơ thể đang bị mệt mỏi, làm việc quá sức\n`
    analysis += `- Tim Gan hư tổn, không đủ sức nuôi dưỡng Thần\n`
    analysis += `- Khí huyết không đủ để nuôi dưỡng đầu\n\n`

    analysis += `**Lời khuyên:**\n`
    analysis += `1. **Nghỉ ngơi nhiều hơn:** Không làm việc quá sức, ngủ đủ 7-8 tiếng/đêm\n`
    analysis += `2. **Bồi bổ khí huyết:** Ăn thịt gà, trứng, nấm, rau xanh, hạt dinh dưỡng\n`
    analysis += `3. **Tránh vận động mạnh:** Không chạy, nhảy, leo núi cho đến khi đau đầu bớt\n\n`
  } else {
    analysis += `Theo y học cổ truyền, đau đầu liên quan đến Tim (chủ Thần), Gan (chủ Can huyết), Hỏa (chủ nhiệt), và Thổ (chủ vận hóa). Bạn cần gặp bác sĩ Đông y để được khám mạch, xem lưỡi và kê đơn thuốc bồi bổ các tạng này.\n\n`
  }

  return {
    title: `Đau đầu do ${bodyInfo?.organs} ${relation.includes("khắc") ? "bị tổn thương" : "mất cân bằng"}`,
    summary: `Theo Mai Hoa Dịch Số, đau đầu của bạn xuất phát từ ${bodyInfo?.organs} (${bodyElement}) đang ${relation}. ${bodyInfo?.description}`,
    mechanism: analysis,
    symptoms: `Triệu chứng đặc trưng: ${bodyInfo?.symptoms.slice(0, 3).join(", ")}`,
    advice: `Xử lý tức thì: 
1. **Nghỉ ngơi ngay:** Đừng cố gắng tiếp tục làm việc. Nằm nghỉ trong phòng tối, yên tĩnh.
2. **Bấm huyệt:** Bấm huyệt Thái Dương (太陽) ở thái dương huyệt, Ấn Đường (印堂) giữa hai lông mày, Phong Trì (風池) sau gáy, Hợp Cốc (合谷) giữa ngón cái và ngón trỏ. Bấm mỗi huyệt 2-3 phút.
3. **Uống nước ấm:** Uống nước ấm có mật ong hoặc đường để bổ sung năng lượng nhanh.
4. **Massage nhẹ:** Xoa bóp đầu, gáy nhẹ nhàng theo chiều từ trán ra sau gáy để lưu thông khí huyết.
5. **Tránh:** ${useElement === "Hỏa" ? "Ánh nắng, màn hình điện thoại/máy tính, căng thẳng, cay nóng." : useElement === "Mộc" ? "Gió lạnh, điều hòa thổi trực tiếp, thức khuya." : "Lạnh, ẩm, thức ăn lạnh."}

⚠️ **LƯU Ý QUAN TRỌNG**: Đau đầu này không phải do "nóng" hay "viêm", đừng uống thuốc giảm đau mạnh (paracetamol, ibuprofen) liên tục hoặc thuốc hạ nhiệt, sẽ làm suy yếu cơ thể thêm!`,
    additionalSymptoms: ["Chóng mặt", "Mắt mờ", "Cổ vai cứng", "Mất ngủ"],
  }
}
