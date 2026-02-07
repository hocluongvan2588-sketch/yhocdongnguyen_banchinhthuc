import { ELEMENT_TO_ORGAN, SYMPTOM_KEYWORDS } from "./organ-mappings"
import { PURE_HEXAGRAMS, getMovingLineHealthInfluence } from "./hexagram-interpretations"
import { KHAC } from "./element-relations"

export type SeverityLevel = "mild" | "moderate" | "severe"

export interface DetailedInterpretation {
  bodyElementName: string
  useElementName: string
  bodyOrganInfo: (typeof ELEMENT_TO_ORGAN)[string]
  useOrganInfo: (typeof ELEMENT_TO_ORGAN)[string]
  concernAnalysis: { keyword: string; info: { element: string; description: string } } | null
  status: "good" | "warning" | "bad" | "neutral"
  title: string
  summarySimple: string
  summary: string
  healthDetail: string
  imbalanceLocation: string | null
  imbalanceDetail: string | null
  symptoms: string[] | null
  causes?: string[]
  consequences?: string[]
  advice: string
  prognosis: string
  severity: SeverityLevel
  severityLabel: string
}

function analyzeHealthConcern(
  concern: string,
): { keyword: string; info: { element: string; description: string } } | null {
  if (!concern) return null

  const lowerConcern = concern.toLowerCase()

  for (const [keyword, info] of Object.entries(SYMPTOM_KEYWORDS)) {
    if (lowerConcern.includes(keyword.toLowerCase())) {
      return { keyword, info }
    }
  }

  return null
}

function analyzeSpecificSymptom(
  concern: string,
  bodyElement: string,
  useElement: string,
  relationship: string,
): {
  affectedOrgan: string
  symptomAnalysis: string
  specificAdvice: string
} {
  const lowerConcern = concern.toLowerCase()

  if (
    lowerConcern.includes("đầu gối") ||
    lowerConcern.includes("dau dau goi") ||
    lowerConcern.includes("gối") ||
    lowerConcern.includes("khớp gối") ||
    (lowerConcern.includes("đau") && lowerConcern.includes("gối"))
  ) {
    const analysis = analyzeKneePain(bodyElement, useElement, relationship)
    return {
      affectedOrgan: "Khớp gối và Kinh lạc chi hạ",
      symptomAnalysis: analysis.detail,
      specificAdvice: analysis.advice,
    }
  }

  // Phân tích dựa trên từ khóa trong câu hỏi
  if (lowerConcern.includes("đau đầu") || lowerConcern.includes("nhức đầu") || lowerConcern.includes("đau nửa đầu")) {
    const analysis = analyzeHeadache(bodyElement, useElement, relationship)
    return {
      affectedOrgan: "Đầu và Não",
      symptomAnalysis: analysis.detail,
      specificAdvice: analysis.advice,
    }
  }

  if (lowerConcern.includes("đau chân") || lowerConcern.includes("nhức chân") || lowerConcern.includes("tê chân")) {
    const analysis = analyzeLegPain(bodyElement, useElement, relationship)
    return {
      affectedOrgan: "Chân và Kinh lạc chi dưới",
      symptomAnalysis: analysis.detail,
      specificAdvice: analysis.advice,
    }
  }

  if (lowerConcern.includes("đau răng") || lowerConcern.includes("nhức răng") || lowerConcern.includes("sâu răng")) {
    const analysis = analyzeToothache(bodyElement, useElement, relationship)
    return {
      affectedOrgan: "Răng và Nướu",
      symptomAnalysis: analysis.detail,
      specificAdvice: analysis.advice,
    }
  }

  if (
    lowerConcern.includes("đau dạ dày") ||
    lowerConcern.includes("đau bụng") ||
    lowerConcern.includes("đau ruột") ||
    lowerConcern.includes("tiêu hóa")
  ) {
    const analysis = analyzeStomachPain(bodyElement, useElement, relationship)
    return {
      affectedOrgan: "Dạ dày và Hệ tiêu hóa",
      symptomAnalysis: analysis.detail,
      specificAdvice: analysis.advice,
    }
  }

  if (lowerConcern.includes("mất ngủ") || lowerConcern.includes("khó ngủ") || lowerConcern.includes("ngủ không sâu")) {
    const analysis = analyzeInsomnia(bodyElement, useElement, relationship)
    return {
      affectedOrgan: "Tâm Thần và Giấc Ngủ",
      symptomAnalysis: analysis.detail,
      specificAdvice: analysis.advice,
    }
  }

  if (lowerConcern.includes("ho") || lowerConcern.includes("khó thở") || lowerConcern.includes("hen")) {
    const analysis = analyzeCough(bodyElement, useElement, relationship)
    return {
      affectedOrgan: "Phổi và Hệ hô hấp",
      symptomAnalysis: analysis.detail,
      specificAdvice: analysis.advice,
    }
  }

  // Mặc định: phân tích theo ELEMENT_TO_ORGAN
  return {
    affectedOrgan: ELEMENT_TO_ORGAN[bodyElement]?.organSimple || bodyElement,
    symptomAnalysis: `Dựa trên quẻ, vấn đề liên quan đến hệ thống ${ELEMENT_TO_ORGAN[bodyElement]?.organ || bodyElement}.`,
    specificAdvice: "Cần thầy thuốc khám trực tiếp để chẩn đoán chính xác.",
  }
}

function analyzeHeadache(bodyElement: string, useElement: string, relationship: string) {
  const bodyOrgan = ELEMENT_TO_ORGAN[bodyElement]
  const useOrgan = ELEMENT_TO_ORGAN[useElement]

  if (relationship.includes("Dụng khắc Thể")) {
    return {
      detail: `Đau đầu của bạn xuất phát từ việc ${useOrgan?.organ} (${useElement}) đang **khắc hại** ${bodyOrgan?.organ} (${bodyElement}). 

**Cơ chế cụ thể:** ${useElement === "Mộc" ? "Can khí quá thịnh, can dương thượng kháng lên đầu gây đau nhức, thường đau 2 bên thái dương, kèm mắt đỏ." : useElement === "Hỏa" ? "Tâm hỏa vượng thịnh, hỏa viêm thượng xông lên đầu gây đau đỉnh đầu, nóng bức, mặt đỏ." : useElement === "Thổ" ? "Tỳ thấp ứ trệ, đàm trọc mông lung che mờ thanh khiếu, gây đau đầu nặng nề, buồn nôn." : useElement === "Kim" ? "Phế khí bất tuyên, khí huyết không lên đầu đủ, gây đau đầu âm ỉ, choáng váng." : "Thận thủy không lên nuôi não, gây đau đầu mỏi, tê đầu, hay quên."}

**Vị trí đau chủ yếu:** ${bodyElement === "Mộc" ? "Đỉnh đầu, thái dương 2 bên" : bodyElement === "Hỏa" ? "Trán, vùng giữa đầu" : bodyElement === "Thổ" ? "Toàn bộ đầu, nặng nề" : bodyElement === "Kim" ? "Sau gáy, chẩm" : "Sau gáy, đỉnh đầu"}

**Triệu chứng kèm theo:** ${bodyOrgan?.symptoms?.slice(0, 3).join(", ")}`,
      advice: `**ĐỂ GIẢM ĐAU ĐẦU NHANH:**

1. **Bấm huyệt tức thì:** Huyệt Thái Dương (thái dương), Ấn Đường (giữa 2 lông mày), Phong Trì (sau gáy) - bấm mạnh 1-2 phút mỗi huyệt
2. **Uống ngay:** ${bodyElement === "Mộc" ? "Trà cúc hoa hoặc trà bạc hà để thanh Can hỏa" : bodyElement === "Hỏa" ? "Nước mát, nước dừa để thanh nhiệt Tâm" : bodyElement === "Thổ" ? "Nước gừng ấm để hóa đàm Tỳ" : bodyElement === "Kim" ? "Mật ong ấm để nhuận Phế" : "Nước muối loãng để bổ Thận"}
3. **Nằm nghỉ:** Phòng tối, yên tĩnh, gối cao đầu
4. **Tránh:** ${useElement === "Mộc" ? "Gió lạnh, cay nóng, giận dữ" : useElement === "Hỏa" ? "Ánh nắng, nóng bức, căng thẳng" : useElement === "Thổ" ? "Đồ ngọt, đồ ăn nhiều dầu mỡ" : useElement === "Kim" ? "Khói thuốc, không khí lạnh" : "Lạnh, mệt mỏi quá"}

**ĐIỀU TRỊ LÂU DÀI (cần gặp thầy thuốc):**
- Phác đồ thuốc bổ ${bodyOrgan?.organSimple}, tiết ${useOrgan?.organSimple}
- Châm cứu điều hòa kinh lạc
- Thay đổi chế độ ăn uống, sinh hoạt`,
    }
  }

  if (relationship.includes("Thể sinh Dụng")) {
    return {
      detail: `Đau đầu của bạn là do ${bodyOrgan?.organ} (${bodyElement}) đang **hao tổn năng lượng** nuôi ${useOrgan?.organ} (${useElement}), khiến khí huyết không đủ lên nuôi não.

**Cơ chế:** Não bộ cần rất nhiều khí huyết. Khi ${bodyOrgan?.organSimple} bị suy yếu do "sinh" ra quá nhiều cho ${useOrgan?.organSimple}, khí huyết thiếu hụt, não không được nuôi dưỡng → đau đầu mỏi, chóng mặt.

**Đặc điểm đau:** Đau âm ỉ, mỏi, không nhói, thường xuất hiện khi mệt, tối hơn, kèm chóng mặt, mắt mờ.`,
      advice: `**CÁCH XỬ LÝ:**

1. **Nghỉ ngơi ngay:** Đừng cố gắng tiếp tục làm việc
2. **Bổ sung năng lượng:** Ăn thực phẩm vị ${bodyOrgan?.taste?.toLowerCase()}, uống nước ấm có đường
3. **Massage nhẹ nhàng:** Xoa bóp đầu, gáy nhẹ nhàng để lưu thông khí huyết
4. **Ngủ sớm:** Ngủ trước 22h để cơ thể tự phục hồi

**LƯU Ý:** Đau đầu này không phải do "nóng" hay "viêm", đừng uống thuốc giảm đau mạnh hoặc thuốc hạ nhiệt, sẽ làm suy yếu thêm!`,
    }
  }

  // Các trường hợp khác
  return {
    detail: `Đau đầu có thể do nhiều nguyên nhân. Cần thầy thuốc khám trực tiếp để chẩn đoán chính xác theo mạch, lưỡi và toàn bộ triệu chứng.`,
    advice: "Gặp bác sĩ Đông y có kinh nghiệm để được khám và kê đơn chính xác.",
  }
}

function analyzeLegPain(bodyElement: string, useElement: string, relationship: string) {
  const bodyOrgan = ELEMENT_TO_ORGAN[bodyElement]
  const useOrgan = ELEMENT_TO_ORGAN[useElement]

  if (relationship.includes("Dụng khắc Thể")) {
    return {
      detail: `Đau chân của bạn liên quan đến **kinh lạc bị tắc** do ${useOrgan?.organ} (${useElement}) khắc hại ${bodyOrgan?.organ} (${bodyElement}).

**Theo y học cổ truyền:** "Thống tắc bất thông, bất thông tắc thống" - Đau là do tắc, tắc là do không thông.

**Cơ chế cụ thể:** 
- ${bodyElement} chi phối kinh lạc chi hạ (chân dưới)
- ${useElement} đang khắc ${bodyElement} → khí huyết không lưu thông qua kinh lạc → ứ trệ → đau

**Vị trí đau:** ${bodyElement === "Mộc" ? "Mặt trong đùi, gân cơ, đầu gối" : bodyElement === "Hỏa" ? "Bắp chân, vùng máu nhiều" : bodyElement === "Thổ" ? "Bắp thịt, đùi to" : bodyElement === "Kim" ? "Xương, khớp" : "Lưng chân, gót chân"}

**Đặc điểm:** ${relationship.includes("Dụng khắc Thể") ? "Đau nhói, co rút, tê bì, nặng hơn vào buổi tối" : "Đau mỏi, yếu, khó đi lâu"}`,
      advice: `**GIẢM ĐAU NGAY:**

1. **Ngâm chân nước ấm:** 40-45°C, ngâm 20-30 phút, thêm muối hoặc rượu gừng
2. **Bấm huyệt chân:** 
   - Huyết Hải (mặt trong đầu gối): bấm 2-3 phút
   - Tam Âm Giao (trên cổ chân trong): bấm 2-3 phút
   - Thừa Sơn (giữa bắp chân): bấm mạnh 1-2 phút
3. **Đắp nóng:** Túi chườm nóng ở vùng đau
4. **Tránh:** Đứng/đi lâu, lạnh, ẩm

**ĐIỀU TRỊ LÂU DÀI:**
- Châm cứu khai thông kinh lạc 2-3 lần/tuần
- Uống thuốc hoạt huyết hóa어 (theo đơn thầy)
- Vận động nhẹ nhàng: đi bộ, kéo giãn cơ
- Giữ ấm chân, đặc biệt mùa đông`,
    }
  }

  return {
    detail: "Đau chân cần khám trực tiếp để xác định nguyên nhân chính xác.",
    advice: "Gặp bác sĩ Đông y để được châm cứu và kê đơn thuốc phù hợp.",
  }
}

function analyzeToothache(bodyElement: string, useElement: string, relationship: string) {
  const bodyOrgan = ELEMENT_TO_ORGAN[bodyElement]
  const useOrgan = ELEMENT_TO_ORGAN[useElement]

  if (relationship.includes("Dụng khắc Thể") && (bodyElement === "Thủy" || useElement === "Hỏa")) {
    return {
      detail: `Đau răng của bạn có nguyên nhân sâu xa từ **Thận hư** (${bodyElement}) bị ${useElement} khắc hại.

**Theo Hoàng Đế Nội Kinh:** "Thận chủ cốt, sinh tủy, xỉ vi nha" - Thận chi phối xương, sinh tủy, răng là phần thừa của xương.

**Cơ chế:**
- Răng thuộc Thận trong y học cổ truyền (xương cốt)
- ${useElement === "Hỏa" ? "Hỏa khắc Kim, Kim khắc Mộc, gián tiếp làm Thận thủy hư" : `${useElement} đang khắc ${bodyElement}`}
- Thận hư → không nuôi được xương và răng → răng yếu, lung lay, đau

**Đặc điểm đau răng do Thận hư:**
- Đau âm ỉ, kéo dài
- Răng lung lay, rụng sớm
- Nướu teo, không sưng đỏ
- Đau nhiều hơn khi mệt, tối`,
      advice: `**XỬ LÝ TẠM THỜI:**

1. **Súc miệng nước muối ấm:** Giúp giảm đau, sát khuẩn
2. **Bấm huyệt:** Hợp Cốc (giữa ngón cái và ngón trỏ) - bấm mạnh 2-3 phút
3. **Tránh:** Đồ lạnh, đá, nước đá
4. **Ăn mềm:** Cháo, súp, tránh nhai cứng

**ĐIỀU TRỊ CĂN BẢN:**
⚠️ **QUAN TRỌNG:** Đau răng do Thận hư KHÔNG THỂ chỉ nhờ nha khoa! Phải bổ Thận mới hết.

- **Gặp bác sĩ Đông y:** Kê đơn thuốc bổ Thận như Lục Vị Địa Hoàng Hoàn
- **Ăn bổ Thận:** Đậu đen, mè đen, óc chó, xương hầm, tủy heo
- **Kiêng:** Cay nóng, thuốc lá, rượu, thức khuya
- **Bổ sung Canxi:** Sữa, cá nhỏ ăn xương

**Đến nha sĩ:** Để xử lý sâu răng, viêm nướu nếu có, nhưng ĐỒNG THỜI phải uống thuốc bổ Thận.`,
    }
  }

  if (relationship.includes("Dụng khắc Thể") && (useElement === "Hỏa" || bodyElement === "Thổ")) {
    return {
      detail: `Đau răng của bạn do **Vị hỏa thượng viêm** - nhiệt từ ${useOrgan?.organ} (${useElement}) khắc ${bodyOrgan?.organ} (${bodyElement}), khiến hỏa viêm lên răng.

**Đặc điểm:**
- Đau nhói, dữ dội
- Nướu sưng đỏ, chảy máu, mủ
- Miệng hôi, khát nước
- Đau nhiều ban ngày, khi ăn nóng

**Nguyên nhân:** Ăn cay nóng, thức khuya, stress → Vị tích nhiệt → hỏa viêm`,
      advice: `**GIẢM ĐAU NGAY:**

1. **Ngậm đá:** Giúp giảm viêm, giảm đau tức thì
2. **Súc miệng:** Nước muối pha loãng, lá ổi luộc
3. **Uống:** Nước mát, nước dừa, trà bạc hà để thanh nhiệt
4. **Tránh tuyệt đối:** Đồ cay, chiên, rán, nướng, thuốc lá, rượu

**ĐẾN NHA SĨ NGAY nếu:**
- Sưng má, sốt cao
- Mủ chảy nhiều
- Răng lung lay nghiêm trọng

**SAU KHI HẾT ĐAU:**
- Gặp bác sĩ Đông y để thanh Vị hỏa căn bản
- Thay đổi chế độ ăn: nhiều rau xanh, trái cây mát
- Ngủ sớm, giảm stress`,
    }
  }

  return {
    detail: "Đau răng có thể do nhiều nguyên nhân. Nên đến nha sĩ kiểm tra trước.",
    advice: "Đến nha khoa khám, sau đó gặp bác sĩ Đông y để điều trị căn bản.",
  }
}

function analyzeStomachPain(bodyElement: string, useElement: string, relationship: string) {
  const bodyOrgan = ELEMENT_TO_ORGAN[bodyElement]

  if (bodyElement === "Thổ" || useElement === "Thổ") {
    return {
      detail: `Đau dạ dày/bụng liên quan trực tiếp đến **Tỳ Vị** (thuộc Thổ). Trong y học cổ truyền, "Tỳ Vị vi hậu thiên chi bản" - Tỳ Vị là căn bản hậu thiên.

**Theo quẻ của bạn:**
${relationship.includes("Dụng khắc Thể") ? `${useElement} đang **khắc hại Tỳ Vị**, làm Tỳ vị khí yếu, không tiêu hóa được thức ăn. Triệu chứng: đau bụng sau ăn, ợ chua, buồn nôn, đầy hơi, tiêu chảy.` : relationship.includes("Thể sinh Dụng") ? `Tỳ Vị đang **hao tổn** năng lượng, yếu dần. Triệu chứng: đau bụng khi đói, ăn không tiêu, mệt mỏi, gầy sút cân.` : `Tỳ Vị đang cần được chăm sóc đặc biệt.`}

**Vị trí đau:** ${relationship.includes("Dụng khắc Thể") ? "Thượng vị (dưới xương ức), đau nhói hoặc nóng rát" : "Toàn bộ bụng, đau âm ỉ, khó chịu"}`,
      advice: `**XỬ LÝ NGAY:**

1. **Ngừng ăn:** Nhịn đói 2-4 giờ cho dạ dày nghỉ ngơi
2. **Uống nước ấm:** Nước gừng ấm, trà bạc hà ấm (nhấp từng ngụm nhỏ)
3. **Nằm nghỉ:** Nằm nghiêng bên phải, gối cao đầu
4. **Chườm ấm:** Đắp túi nóng lên bụng
5. **Bấm huyệt:** Trung Quản (giữa bụng, trên rốn 4 ngón), Túc Tam Lý (dưới đầu gối mặt ngoài)

**CHẾ ĐỘ ĂN UỐNG ĐẶC BIỆT:**

🥣 **NÊN ĂN:**
- Cháo trắng, cháo yến mạch (ăn ấm, nguội vừa)
- Rau luộc mềm: bí đỏ, cà rốt
- Súp gà nhạt
- Chuối chín, táo hấp

🚫 **TUYỆT ĐỐI TRÁNH:**
- Cay nóng: ớt, tiêu, gừng sống
- Chua: cam, chanh, dấm
- Lạnh: đá, kem, nước lạnh
- Cứng, khó tiêu: thịt bò, nếp, bánh mì
- Cà phê, rượu, thuốc lá

**QUY TẮC ĂN UỐNG:**
- Ăn 5-6 bữa nhỏ thay vì 3 bữa lớn
- Nhai kỹ 20-30 lần mỗi miếng
- Ăn chậm, không vội
- Không ăn khi giận dữ, căng thẳng

**ĐẾN BỆNH VIỆN NGAY nếu:**
- Đau dữ dội không chịu được
- Nôn ra máu, đại tiện đen
- Sốt cao, vã mồ hôi
- Đau lan ra lưng, vai

**ĐIỀU TRỊ LÂU DÀI:**
- Gặp bác sĩ Tiêu hóa: nội soi, xét nghiệm H.Pylori
- Gặp bác sĩ Đông y: uống thuốc điều Tỳ Vị
- Thay đổi lối sống: ăn uống quy củ, ngủ sớm, giảm stress`,
    }
  }

  return {
    detail: "Đau bụng cần khám để xác định nguyên nhân chính xác (viêm dạ dày, loét, ruột thừa, sỏi mật...).",
    advice: "Đến bệnh viện khám nội khoa tiêu hóa để chẩn đoán chính xác.",
  }
}

function analyzeInsomnia(bodyElement: string, useElement: string, relationship: string) {
  const bodyOrgan = ELEMENT_TO_ORGAN[bodyElement]

  if (bodyElement === "Hỏa" || useElement === "Hỏa") {
    return {
      detail: `Mất ngủ của bạn liên quan đến **Tâm thần bất an**. Trong y học cổ truyền, "Tâm chủ thần minh" - Tim chi phối tinh thần.

**Cơ chế:**
${relationship.includes("Dụng khắc Thể") ? `${useElement} khắc ${bodyElement} → Tâm huyết hư hoặc Tâm hỏa vượng → thần không được nuôi → mất ngủ.` : relationship.includes("Thể sinh Dụng") ? `Tim đang hao tổn năng lượng → Tâm huyết thiếu → không nuôi được thần → mất ngủ.` : `Tâm thần cần được điều dưỡng.`}

**Triệu chứng:**
- ${relationship.includes("hỏa vượng") || relationship.includes("Dụng khắc") ? "Khó ngủ, nằm trằn trọc, tỉnh giấc nhiều lần, giấc ngủ nông, hay mơ, đánh trống ngực, bồn chồn" : "Ngủ không sâu, mệt khi thức dậy, hay quên, chóng mặt"}`,
      advice: `**NGỦ NGON TỐI NAY:**

1. **Trước khi ngủ 2 giờ:**
   - Tắt điện thoại, TV
   - Đọc sách nhẹ nhàng
   - Nghe nhạc thiền, nhạc thiên nhiên

2. **Trước khi ngủ 30 phút:**
   - Tắm nước ấm
   - Uống sữa ấm hoặc trà hoa cúc
   - Massage chân, bấm huyệt Thần Môn (cổ tay)

3. **Môi trường ngủ:**
   - Phòng tối, yên tĩnh
   - Nhiệt độ 20-23°C
   - Giường sạch, mềm mại

4. **Tránh:**
   - Cà phê sau 14h
   - Ăn no trước khi ngủ
   - Vận động mạnh tối
   - Suy nghĩ, lo lắng

**ĐIỀU TRỊ LÂU DÀI:**

🌙 **Thảo dược:**
- Trà hoa cúc, táo nhân, liên tử
- Thuốc An Thần (theo đơn thầy): Thiên Vương Bổ Tâm Đan, Toan Tảo Nhân Thang

🧘 **Tâm lý:**
- Thiền định 15-20 phút/ngày
- Viết nhật ký, giải tỏa cảm xúc
- Tư vấn tâm lý nếu cần

⏰ **Quy luật:**
- Ngủ 22h, dậy 6h mỗi ngày (kể cả cuối tuần!)
- Không ngủ trưa quá 30 phút
- Vận động buổi sáng 30 phút

**LƯU Ý:** Nếu mất ngủ > 1 tháng, gặp bác sĩ để loại trừ bệnh lý khác (rối loạn giấc ngủ, trầm cảm, lo âu).`,
    }
  }

  return {
    detail: "Mất ngủ có nhiều nguyên nhân. Cần thầy thuốc khám để tìm nguyên nhân chính xác.",
    advice: "Gặp bác sĩ Đông y để được kê đơn thuốc an thần phù hợp với thể trạng.",
  }
}

function analyzeCough(bodyElement: string, useElement: string, relationship: string) {
  const bodyOrgan = ELEMENT_TO_ORGAN[bodyElement]

  if (bodyElement === "Kim" || useElement === "Kim") {
    return {
      detail: `Ho/khó thở liên quan đến **Phổi** (thuộc Kim). "Phế vi khí chi bản" - Phổi là căn bản của khí.

**Theo quẻ:**
${relationship.includes("Dụng khắc Thể") ? `${useElement} đang khắc Phổi (Kim) → Phế khí bị tổn thương → ho, khó thở. ${useElement === "Hỏa" ? "Đặc biệt: Hỏa khắc Kim → phế nhiệt, ho khan, khó thở, đờm vàng đặc." : ""}` : relationship.includes("Thể sinh Dụng") ? `Phổi đang hao tổn → Phế khí hư → ho yếu, khó thở khi gắng sức.` : `Phổi cần được chăm sóc.`}

**Triệu chứng:**
- ${relationship.includes("Hỏa khắc Kim") || relationship.includes("nhiệt") ? "Ho khan, họng khô, đờm vàng, khó khạc, thở nhanh" : "Ho nhẹ kéo dài, đờm trắng loãng, mệt, hơi thở yếu"}`,
      advice: `**XỬ LÝ NGAY:**

1. **Uống ngay:** 
   - ${relationship.includes("nhiệt") || relationship.includes("Hỏa") ? "Nước mát, nước lê hầm phèn đường, trà bạc hà" : "Nước ấm, trà gừng mật ong"}
   
2. **Hít thở:**
   - Hít sâu qua mũi, thở ra qua miệng từ từ
   - Ngồi thẳng, nới lỏng cổ áo
   
3. **Xông hơi:** 
   - ${relationship.includes("nhiệt") ? "Xông lá bạc hà, lá bạch đàn" : "Xông tinh dầu bạc hà, gừng"}
   
4. **Tránh:**
   - Khói thuốc, bụi
   - Lạnh, gió
   - Nói to, cười nhiều

**ĐIỀU TRỊ:**

🚨 **ĐẾN BỆNH VIỆN NGAY nếu:**
- Khó thở nghiêm trọng, tím môi
- Ho ra máu
- Sốt cao >38.5°C kéo dài
- Đau ngực dữ dội

💊 **Gặp bác sĩ Đông y nếu:**
- Ho kéo dài > 2 tuần
- Tái phát nhiều lần
- Đờm nhiều, khó khạc

**PHÒNG NGỪA:**
- Giữ ấm ngực, cổ
- Đeo khẩu trang khi ra đường
- Tránh lạnh, ẩm, gió
- Ăn bổ Phổi: nấm trắng, yến mạch, lê, lạc`,
    }
  }

  return {
    detail: "Ho/khó thở cần khám để xác định nguyên nhân (viêm phổi, hen, COPD...).",
    advice: "Đến bệnh viện khám hô hấp để chẩn đoán chính xác.",
  }
}

function analyzeKneePain(bodyElement: string, useElement: string, relationship: string) {
  const bodyOrgan = ELEMENT_TO_ORGAN[bodyElement]
  const useOrgan = ELEMENT_TO_ORGAN[useElement]

  if (relationship.includes("Dụng khắc Thể")) {
    return {
      detail: `Đau khớp gối của bạn xuất phát từ việc **${useOrgan?.organ} (${useElement}) đang khắc hại ${bodyOrgan?.organ} (${bodyElement})**, làm tổn thương kinh lạc và cơ quan chi phối vùng gối.

**Theo y học cổ truyền, gối liên quan đến 3 tạng:**
- **Gan (Mộc) chủ gân:** Gân bao quanh khớp gối, nếu Gan huyết hư → gân yếu, gối đau khi vận động
- **Thận (Thủy) chủ cốt:** Xương khớp gối thuộc Thận, Thận hư → xương yếu, gối mềm, đau âm ỉ
- **Tỳ (Thổ) chủ cơ:** Cơ bắp quanh gối thuộc Tỳ, Tỳ hư → cơ yếu, gối không vững

**Trong trường hợp của bạn:**
${useElement === "Mộc" ? "Mộc (Gan) đang quá thịnh khắc Thổ → gân co rút, gối cứng đau, khó cử động buổi sáng" : useElement === "Kim" ? "Kim (Phế) khắc Mộc (Gan) → khí huyết không nuôi gân, gối yếu, đau mỏi khi đi lâu" : useElement === "Hỏa" ? "Hỏa khắc Kim → khí huyết ứ trệ ở khớp, gối sưng nóng đau nhói" : useElement === "Thủy" ? "Thủy khắc Hỏa → hàn thấp xâm nhập khớp gối, đau nhiều khi trời lạnh ẩm" : "Năng lượng mất cân bằng ảnh hưởng đến kinh lạc chi hạ"}

**Vị trí đau chủ yếu:**
- ${bodyElement === "Mộc" ? "Mặt trong gối, gân bên trong" : bodyElement === "Thủy" ? "Xương khớp, sau gối" : bodyElement === "Thổ" ? "Cơ quanh gối, đùi" : "Toàn bộ khớp gối"}

**Triệu chứng kèm theo:**
- ${relationship.includes("Dụng khắc Thể") ? "Đau nhói, sưng, khó cử động, đi lại khó khăn, nặng hơn buổi tối" : "Đau mỏi, yếu, khó đi lâu"}`,

      advice: `**XỬ LÝ NGAY TẠI NHÀ:**

1. **Ngâm chân nước ấm:**
   - Nước 40-42°C, ngâm 20-30 phút
   - Thêm 2-3 thìa muối hoặc rượu gừng
   - Ngâm đến trên đầu gối

2. **Bấm huyệt quan trọng:**
   - **Huyết Hải** (mặt trong đầu gối, lõm trên xương bánh chè 2 tấc): Bấm 3-5 phút, hết đau ngay
   - **Dương Lăng Tuyền** (dưới đầu gối mặt ngoài, lõm xương): Bấm mạnh 2-3 phút
   - **Tam Âm Giao** (trên cổ chân trong 3 tấc): Bấm 2 phút để bổ Gan Tỳ Thận
   - **Túc Tam Lý** (dư���i đầu gối 3 tấc mặt ngoài): Bấm để bổ khí huyết

3. **Đắp thuốc nam:**
   - Rượu gừng + tinh dầu bạc hà: thoa và massage nhẹ
   - Lá lốt + muối rang nóng: đắp lên gối 15-20 phút
   - Tránh đắp quá nóng gây bỏng

4. **Tư thế nghỉ ngơi:**
   - Nằm gối cao chân (cao hơn tim)
   - Không ngồi xổm, quỳ gối
   - Tránh đứng đi lâu

**ĐIỀU TRỊ LÂU DÀI (BẮT BUỘC):**

⚠️ **QUAN TRỌNG:** Đau gối do mất cân bằng ngũ hành KHÔNG THỂ tự khỏi! Cần điều trị căn bản:

**Bước 1: Gặp bác sĩ Đông y** (ưu tiên cao)
- Châm cứu khai thông kinh lạc: 2-3 lần/tuần, liệu trình 4-6 tuần
- Uống thuốc bổ gan thận, cường gân cốt:
  ${bodyElement === "Mộc" ? "Độc Hoạt Ký Sinh Thang - bổ Gan Thận, trừ phong thấp" : bodyElement === "Thủy" ? "Lục Vị Địa Hoàng Hoàn - bổ Thận cường cốt" : bodyElement === "Thổ" ? "Tứ Quân Tử Thang + Đương Quy - bổ Tỳ sinh cơ" : "Thuốc theo chứng của thầy kê"}

**Bước 2: Vận động đúng cách**
- **NÊN:** Đi bộ nhẹ 20-30 phút/ngày, bơi lội, đạp xe nhẹ, kéo giãn cơ gối
- **TRÁNH:** Chạy bộ, leo cầu thang nhiều, mang vác nặng, ngồi xổm lâu

**Bước 3: Chế độ ăn bổ khớp**
- **Bổ gân:** Móng giò hầm, da heo (nhiều collagen)
- **Bổ xương:** Xương hầm tủy, cá nhỏ ăn xương, tôm cá
- **Bổ Gan Thận:** Đậu đen, mè đen, óc chó, nấm đen
- **Canxi:** Sữa, đậu phụ, rau xanh đậm
- **TRÁNH:** Đồ lạnh, bia rượu, cà phê đậm, đồ cay nóng

**Bước 4: Bảo vệ gối**
- Đeo băng gối khi vận động
- Giữ ấm gối (đặc biệt mùa đông, trời mưa)
- Giảm cân nếu thừa cân (mỗi 1kg = 4kg áp lực lên gối!)

**KHI NÀO CẦN ĐẾN BỆNH VIỆN:**
- Gối sưng to, nóng đỏ, không thể cử động
- Đau dữ dội không giảm sau 3 ngày
- Nghe tiếng "cộc" trong gối khi cử động
- Gối mềm nhũn, lung lay
→ Đi khám chụp X-quang, MRI để kiểm tra dây chằng, sụn

**TIÊN LƯỢNG:**
- Nếu điều trị đúng cách + thay đổi lối sống: 80-90% cải thiện sau 2-3 tháng
- Nếu chỉ uống thuốc giảm đau mà không điều trị căn bản: tiến triển thành thoái hóa khớp, rất khó chữa!`,
    }
  }

  if (relationship.includes("Thể sinh Dụng")) {
    return {
      detail: `Đau gối của bạn do **${bodyOrgan?.organ} (${bodyElement}) đang hao tổn năng lượng** nuôi ${useOrgan?.organ}, khiến khí huyết không đủ nuôi gân cốt và kinh lạc ở gối.

**Đặc điểm đau:**
- Đau mỏi, yếu, không nhói
- Gối mềm, không vững khi đi
- Đau nhiều hơn khi mệt, chiều tối
- Khó đứng lâu, khó leo cầu thang

**Nguyên nhân sâu xa:** Cơ thể đang trong tình trạng "hư ch��ng" - thiếu khí huyết nuôi dưỡng gân cốt.`,
      advice: `**PHỤC HỒI NĂNG LƯỢNG:**

1. **Nghỉ ngơi tuyệt đối:** Giảm vận động, ngủ sớm trước 22h
2. **Bổ sung dinh dưỡng:** Ăn nhiều thịt, cá, trứng, gà hầm, xương hầm
3. **Massage nhẹ nhàng:** Xoa bóp gối nhẹ nhàng để lưu thông khí huyết (KHÔNG bấm mạnh!)
4. **Uống thuốc bổ:** Gặp bác sĩ Đông y để được kê thuốc bổ khí huyết

**LƯU Ý:** ĐỪNG uống thuốc giảm đau! Sẽ làm hao tổn thêm. Cần bổ, không cần tả (tống xuất).`,
    }
  }

  return {
    detail: `Đau gối cần được khám kỹ để xác định nguyên nhân (thoái hóa, viêm khớp, dây chằng, sụn...).`,
    advice: `Gặp bác sĩ chuyên khoa xương khớp để chụp X-quang và có phương án điều trị phù hợp.`,
  }
}

export function getDetailedInterpretation(
  bodyElement: string,
  useElement: string,
  relation: string,
  healthConcern: string,
  hexagramNumber?: number,
  movingLine?: number,
  currentMonth?: number,
): DetailedInterpretation {
  const bodyOrgan = ELEMENT_TO_ORGAN[bodyElement]
  const useOrgan = ELEMENT_TO_ORGAN[useElement]

  const concernAnalysis = analyzeHealthConcern(healthConcern)

  const specificAnalysis = healthConcern
    ? analyzeSpecificSymptom(healthConcern, bodyElement, useElement, relation)
    : null

  const baseResult = {
    bodyElementName: bodyElement,
    useElementName: useElement,
    bodyOrganInfo: bodyOrgan,
    useOrganInfo: useOrgan,
    concernAnalysis,
  }

  let hexagramSpecific = ""
  let movingLineSpecific = ""

  if (hexagramNumber && PURE_HEXAGRAMS[hexagramNumber]) {
    const hexInfo = PURE_HEXAGRAMS[hexagramNumber]
    hexagramSpecific = `\n\n**Theo quẻ ${hexInfo.name}:** ${hexInfo.detailedAnalysis}`
  }

  if (movingLine && hexagramNumber) {
    movingLineSpecific = `\n\n**Về hào động (Hào ${movingLine}):** ${getMovingLineHealthInfluence(hexagramNumber, movingLine)}`
  }

  let seasonalAdvice = ""
  if (currentMonth) {
    const seasonInfo = getSeasonalHealthAdvice(bodyElement, currentMonth)
    seasonalAdvice = `\n\n**Theo thời điểm hiện tại (tháng ${currentMonth}):** ${seasonInfo}`
  }

  const specificSummaryAddition = specificAnalysis
    ? `\n\n**Về vấn đề "${healthConcern}" của bạn:** ${specificAnalysis.symptomAnalysis}`
    : ""

  if (relation.includes("dụng_sinh_thể") || relation.includes("Dụng sinh Thể")) {
    return {
      ...baseResult,
      status: "good",
      title: "Dụng Sinh Thể - Đắc Hành (得行)",
      summarySimple: `Tôi xin chúc mừng! Tình trạng sức khỏe của bạn đang rất thuận lợi. Quẻ này cho thấy ${bodyOrgan?.organSimple} đang được môi trường bên ngoài hỗ trợ mạnh mẽ, giống như cây được đất màu và nước mưa nuôi dưỡng vậy. Khí huyết trong người đang lưu thông điều hòa, đây là dấu hiệu rất tốt.${hexagramSpecific}${movingLineSpecific}${specificSummaryAddition}`,
      summary: `Theo nguyên lý Mai Hoa Dịch Số, "Dụng sinh Thể" nghĩa là ngoại ứng (môi trường bên ngoài, người khác, thời tiết) đang sinh trợ cho nội ứng (bản thân bạn). Đây là quan hệ thuận lợi nhất trong Thể Dụng học. Thầy Thiệu Khang Tiết có dạy: "Dụng sinh Thể giả, bất dược hữu hỷ" - Dụng sinh Thể thì không cần uống thuốc cũng có điềm vui.`,
      healthDetail: `Cụ thể với trường hợp của bạn, ${bodyElement} (${bodyOrgan?.organ}) đang được ${useElement} (${useOrgan?.organ}) sinh trợ theo quy luật Ngũ Hành sinh khắc. Điều này tạo nên một dòng năng lượng từ ngoài vào trong cơ thể, giúp ${bodyOrgan?.organ} hoạt động hiệu quả hơn. Trong y học cổ truyền, chúng tôi gọi đây là "đắc khí" - được nhận khí tốt. 

Cơ chế hoạt động như sau: ${useOrgan?.organ} (thuộc ${useElement}) sinh ra năng lượng, và năng lượng này theo kinh lạc chuyển đến ${bodyOrgan?.organ} (thuộc ${bodyElement}). Ví dụ, nếu ${useElement} là Thủy và ${bodyElement} là Mộc, thì "Thủy sinh Mộc" như nước tưới cây - ${bodyOrgan?.organ} của bạn đang được nuôi dưỡng liên tục.${seasonalAdvice}${specificAnalysis ? `\n\n${specificAnalysis.symptomAnalysis}` : ""}`,
      imbalanceLocation: null,
      imbalanceDetail: null,
      symptoms: null,
      advice:
        specificAnalysis?.specificAdvice ||
        `Đây là thời điểm vàng để củng cố sức khỏe. Tôi khuyên bạn:

**1. Duy trì lối sống hiện tại:** Những gì bạn đang làm là đúng đắn. Chế độ ăn, sinh hoạt, làm việc hiện tại đang phù hợp với cơ thể.

**2. Tăng cường thêm:** Ăn các thực phẩm có vị ${bodyOrgan?.taste?.toLowerCase()} để bồi bổ ${bodyOrgan?.organSimple} khi đang khỏe mạnh, như 'đắc lợi thừa thời' - được lợi nhờ thời cơ tốt.

**3. Đừng lơ là:** Dù sức khỏe tốt nhưng vẫn cần chăm sóc đều đặn. Thầy xưa dạy "bất trị dĩ bệnh trị vị bệnh" - không chữa khi đã bệnh mà chữa trước khi bệnh. Hãy khám sức khỏe định kỳ.

**4. Tránh làm việc quá sức:** Dù khỏe nhưng đừng lạm dụng. "Thịnh cực tất suy" - thịnh quá sẽ suy, hãy giữ sự cân bằng.${hexagramNumber && PURE_HEXAGRAMS[hexagramNumber] ? `\n\n**Lời khuyên riêng cho quẻ ${PURE_HEXAGRAMS[hexagramNumber].name}:** ${PURE_HEXAGRAMS[hexagramNumber].advice}` : ""}`,
      prognosis:
        "Có bệnh nhẹ sẽ tự khỏi, không cần thuốc. Nếu đang điều trị thì sẽ nhanh chóng phục hồi. Tiên lượng rất tốt, có thể coi như 'vô sự' - không có chuyện gì.",
      severity: "mild",
      severityLabel: "Khỏe mạnh",
    }
  }

  if (relation.includes("thể_sinh_dụng") || relation.includes("Thể sinh Dụng")) {
    const causesText =
      bodyOrgan?.causes
        ?.slice(0, 3)
        .map((c, i) => `${i + 1}. ${c}`)
        .join("\n") || ""
    const consequencesText =
      bodyOrgan?.consequences
        ?.slice(0, 2)
        .map((c, i) => `• ${c}`)
        .join("\n") || ""

    return {
      ...baseResult,
      status: "warning",
      title: "Thể Sinh Dụng - Hao Tổn Nguyên Khí",
      summarySimple: `Qua quẻ này, tôi thấy cơ thể bạn đang trong tình trạng hao tổn năng lượng dần dần. ${bodyOrgan?.organSimple} của bạn đang phải làm việc quá sức để cung cấp năng lượng ra bên ngoài, giống như ngọn nến đang cháy cả hai đầu. Bạn có cảm thấy mệt mỏi thường xuyên, dù đã nghỉ ngơi vẫn không hết mỏi không?${hexagramSpecific}${movingLineSpecific}${specificSummaryAddition}`,
      summary: `Theo lý thuyết Thể Dụng trong Mai Hoa Dịch Số, "Thể sinh Dụng" là tình huống năng lượng từ bản thân (Thể) bị tiêu hao để nuôi dưỡng bên ngoài (Dụng). Thầy Thiệu Khang Tiết cảnh báo: "Thể sinh Dụng giả, bệnh nan duyệt" - Thể sinh Dụng thì bệnh khó khỏi, vì nguồn gốc năng lượng đang bị rút kiệt.`,
      healthDetail: `Trong trường hợp của bạn, ${bodyElement} (${bodyOrgan?.organ}) đang sinh ra ${useElement} (${useOrgan?.organ}) theo quy luật Ngũ Hành. Điều này nghe có vẻ tốt, nhưng thực chất lại là vấn đề nghiêm trọng. Tại sao? 

Trong y học cổ truyền, mỗi tạng phủ đều có "khí" riêng của mình. Khi ${bodyOrgan?.organ} phải sinh ra năng lượng cho ${useOrgan?.organ}, nghĩa là khí của ${bodyOrgan?.organSimple} đang bị "tiết" (rò rỉ) ra ngoài liên tục. Chúng tôi gọi đây là "mẫu thực tử khí" - người mẹ bị con ăn mất khí. Ví dụ cụ thể: nếu ${bodyElement} là Mộc (Gan) sinh ${useElement} là Hỏa (Tim), thì Can huyết sẽ bị tiêu hao để nuôi Tâm thần, lâu ngày Gan sẽ huyết hư, dẫn đến các triệu chứng:

${
  bodyOrgan?.symptoms
    ?.slice(0, 5)
    .map((s, i) => `• ${s}`)
    .join("\n") || ""
}

**Nguyên nhân thường gặp:**
${causesText}

**Hậu quả nếu không điều trị:**
${consequencesText}${seasonalAdvice}${specificAnalysis ? `\n\n**Phân tích cụ thể về "${healthConcern}":**\n${specificAnalysis.symptomAnalysis}` : ""}`,
      imbalanceLocation: `${bodyOrgan?.organSimple} (${bodyOrgan?.bodyPart})`,
      imbalanceDetail: `${bodyOrgan?.organ} đang trong tình trạng **suy yếu dần** do hao tổn liên tục mà không được bồi hoàn. Cụ thể là vùng ${bodyOrgan?.bodyPart} của bạn đang gặp vấn đề. Về mặt cảm xúc, bạn cũng dễ có cảm giác **${bodyOrgan?.emotion?.toLowerCase()}** vì "ngũ chí thương ngũ tạng" - năm cảm xúc làm tổn thương năm tạng.`,
      symptoms: bodyOrgan?.symptoms?.slice(0, 5) || [],
      causes: bodyOrgan?.causes?.slice(0, 3) || [],
      consequences: bodyOrgan?.consequences?.slice(0, 2) || [],
      advice:
        specificAnalysis?.specificAdvice ||
        `Tình trạng này cần được chú ý và điều chỉnh ngay, tôi khuyên bạn:

**I. BỔ SUNG NGAY (急補):**
- **Ăn bổ dưỡng ${bodyOrgan?.organSimple}:** Các thực phẩm có vị ${bodyOrgan?.taste?.toLowerCase()} sẽ bổ trực tiếp cho ${bodyOrgan?.organ}. Ăn đều đặn 3 bữa, không bỏ bữa.
- **Nghỉ ngơi nhiều hơn:** Ngủ đủ 7-8 tiếng mỗi đêm. ${bodyOrgan?.organSimple} cần thời gian phục hồi.
- **Giảm công việc:** Tạm thời giảm bớt áp lực công việc 30-50% nếu có thể. Sức khỏe quan trọng hơn tiền bạc.

**II. TRÁNH HẠI (避其害):**
- **Tránh ${useElement}**: Các yếu tố thuộc ${useElement} sẽ càng làm hao tổn ${bodyElement}. Ví dụ tránh màu sắc, hương vị, hoạt động liên quan ${useElement}.
- **Kiểm soát cảm xúc ${bodyOrgan?.emotion}:** Cảm xúc này sẽ làm tổn thương ${bodyOrgan?.organSimple} thêm.

**III. TÌM THẦY THUỐC (求醫):**
- Đến gặp bác sĩ đông y để được kê đơn thuốc bổ ${bodyOrgan?.organSimple} phù hợp với thể trạng. Đừng tự ý mua thuốc bổ uống.
- Có thể cần châm cứu, bấm huyệt để điều hòa kinh lạc.

**IV. KIÊN TRÌ ĐIỀU TRỊ (恆心):**
- "Bệnh lai như sơn đảo, bệnh khứ như trừu tơ" - Bệnh đến như núi đổ, bệnh đi như rút tơ. Cần kiên nhẫn điều trị 3-6 tháng mới thấy hiệu quả rõ.${hexagramNumber && PURE_HEXAGRAMS[hexagramNumber] ? `\n\n**Lời khuyên riêng cho quẻ ${PURE_HEXAGRAMS[hexagramNumber].name}:** ${PURE_HEXAGRAMS[hexagramNumber].advice}` : ""}`,
      prognosis:
        "Bệnh có thể kéo dài nếu không điều trị kịp thời. Với chăm sóc đúng cách, 3-6 tháng sẽ cải thiện đáng kể. Cần kiên trì và kiên nhẫn.",
      severity: "moderate",
      severityLabel: "Cần chăm sóc",
    }
  }

  if (relation.includes("thể_khắc_dụng") || relation.includes("Thể khắc Dụng")) {
    return {
      ...baseResult,
      status: "good",
      title: "Thể Khắc Dụng - Chủ Động Kiểm Soát",
      summarySimple: `Tin tốt! Cơ thể bạn đang ở trạng thái **chủ động và khỏe mạnh**. ${bodyOrgan?.organSimple} có đủ năng lượng để kiểm soát và "chế ngự" các yếu tố gây bệnh từ môi trường. Giống như một võ sĩ mạnh mẽ có thể đánh bại kẻ địch vậy.${hexagramSpecific}${movingLineSpecific}${specificSummaryAddition}`,
      summary: `Theo Mai Hoa Dịch Số, "Thể khắc Dụng" nghĩa là bản thân (Thể) có khả năng khắc chế được ngoại cảnh (Dụng). Thầy Thiệu Khang Tiết viết: "Thể khắc Dụng giả, bất dược hữu hỷ" - Thể khắc Dụng thì không uống thuốc cũng có điều vui mừng. Đây là dấu hiệu của sức khỏe tốt, khả năng miễn dịch mạnh.`,
      healthDetail: `Trong trường hợp của bạn, ${bodyElement} (${bodyOrgan?.organ}) đang khắc ${useElement} (${useOrgan?.organ}) theo quy luật Ngũ Hành. Điều này có nghĩa gì?

Trong y học cổ truyền, "khắc" không phải là xấu trong trường hợp Thể khắc Dụng. Ngược lại, đây là biểu hiện của **"chính khí nội tồn, tà bất khả can"** - khí chính bên trong dồi dào, tà khí không thể xâm nhập. ${bodyOrgan?.organ} của bạn đang đủ mạnh để:

1. **Kiểm soát môi trường bên ngoài**: Không bị ảnh hưởng bởi thời tiết, thức ăn, hay stress.
2. **Đề kháng bệnh tật**: Hệ miễn dịch hoạt động hiệu quả, vi khuẩn, virus khó xâm nhập.
3. **Tự điều hòa**: Khi có mất cân bằng nhỏ, cơ thể tự động điều chỉnh về trạng thái ổn định.

Ví dụ: Nếu ${bodyElement} là Kim (Phổi) khắc ${useElement} là Mộc (Gan), nghĩa là Phế khí đang mạnh, có thể điều tiết Can khí, tránh Can hỏa quá thịnh. Đây là sự cân bằng tự nhiên của cơ thể.${seasonalAdvice}${specificAnalysis ? `\n\n**Phân tích cụ thể về "${healthConcern}":**\n${specificAnalysis.symptomAnalysis}` : ""}`,
      imbalanceLocation: null,
      imbalanceDetail: null,
      symptoms: null,
      advice:
        specificAnalysis?.specificAdvice ||
        `Sức khỏe tốt là tài sản quý giá nhất. Để duy trì trạng thái này:

**1. Tiếp tục lối sống lành mạnh hiện tại:**
- Chế độ ăn uống, nghỉ ngơi đang khá hợp lý
- Tiếp tục như vậy để giữ sự cân bằng

**2. Khám định kỳ:**
- Nên khám sức khỏe 6 tháng đến 1 năm/lần
- Để phát hiện sớm nếu có vấn đề

**3. Tăng cường phòng ngừa:**
- Ăn các thực phẩm vị ${bodyOrgan?.taste?.toLowerCase()} để bổ ${bodyOrgan?.organSimple}
- Vận động đều đặn 30 phút mỗi ngày

**4. Giữ tâm bình tĩnh:**
- "Thanh tĩnh vi thiên hạ chính" - Trong sạch tĩnh lặng là chánh đạo của thiên hạ
- Tránh stress và cảm xúc thái quá${hexagramNumber && PURE_HEXAGRAMS[hexagramNumber] ? `\n\n**Lời khuyên riêng cho quẻ ${PURE_HEXAGRAMS[hexagramNumber].name}:** ${PURE_HEXAGRAMS[hexagramNumber].advice}` : ""}`,
      prognosis: "Nếu có bệnh nhẹ sẽ dễ dàng hồi phục. Tình trạng sức khỏe tổng thể ổn định.",
      severity: "mild",
      severityLabel: "Rất tốt",
    }
  }

  if (relation.includes("dụng_khắc_thể") || relation.includes("Dụng khắc Thể")) {
    return {
      ...baseResult,
      status: "bad",
      title: "Dụng Khắc Thể - Tà Khí Vượng Thịnh (最凶)",
      summarySimple: `Tôi cần nói thẳng với bạn - đây là tình huống **nghiêm trọng nhất** trong các quan hệ Thể Dụng. ${bodyOrgan?.organSimple} của bạn đang bị năng lượng ${useElement} (${useOrgan?.organSimple}) **tấn công trực tiếp**, giống như một thành trì đang bị kẻ thù dồn dập tấn công. Tình trạng này cần được **can thiệp y tế ngay lập tức**.${hexagramSpecific}${movingLineSpecific}${specificSummaryAddition}`,
      summary: `Theo Mai Hoa Dịch Số, "Dụng khắc Thể" là hung hiểm nhất. Thầy Thiệu Khang Tiết cảnh báo nghiêm trọng: "Dụng khắc Thể giả, tuy dược vô công" - Dụng khắc Thể thì dù có uống thuốc cũng khó có công hiệu. Điều này không có nghĩa là bỏ cuộc, mà là nhắc nhở phải **tìm thầy thuốc giỏi, kiên trì điều trị lâu dài**.`,
      healthDetail: `Trong trường hợp của bạn, ${useElement} (${useOrgan?.organ}) đang khắc ${bodyElement} (${bodyOrgan?.organ}) theo quy luật Ngũ Hành sinh khắc. Đây là tình huống **"tà thịnh chính suy"** - tà khí vượng thịnh, chính khí suy yếu.

**Cơ chế bệnh lý diễn ra như sau:**

${useElement} (thuộc ${useOrgan?.organSimple}) đang sản sinh ra một luồng năng lượng mạnh mẽ, và luồng năng lượng này theo quy luật Ngũ Hành khắc **tấn công trực tiếp** vào ${bodyElement} (${bodyOrgan?.organ}). Giống như ${getElementExample(useElement, bodyElement)}.

**Kết quả là ${bodyOrgan?.organ} bị tổn thương nghiêm trọng:**

${bodyOrgan?.symptoms?.map((s, i) => `${i + 1}. **${s}** - Đây là dấu hiệu ${bodyOrgan?.organ} đang bị tổn thương`).join("\n") || ""}

**Vùng cơ thể chịu ảnh hưởng:**
- **Trực tiếp**: ${bodyOrgan?.bodyPart} - nơi ${bodyOrgan?.organ} chi phối
- **Gián tiếp**: ${bodyOrgan?.viscera} cũng bị ảnh hưởng vì hai là biểu lý của nhau
- **Cảm xúc**: Dễ có cảm giác **${bodyOrgan?.emotion?.toLowerCase()}** kéo dài

**Nguyên nhân sâu xa:**
${bodyOrgan?.causes?.map((c, i) => `${i + 1}. ${c}`).join("\n") || ""}

**Hậu quả nghiêm trọng nếu không điều trị:**
${bodyOrgan?.consequences?.map((c, i) => `• **${c}** - Có thể ảnh hưởng đến chất lượng cuộc sống lâu dài`).join("\n") || ""}

**Tại sao khó chữa?**
Vì tà khí (${useElement}) đang mạnh hơn chính khí (${bodyElement}), nên dù uống thuốc bổ ${bodyElement} thì vẫn bị ${useElement} khắc hại. Đây như "địch cường ta yếu", cần phải có chiến thuật khôn ngoan.${seasonalAdvice}${specificAnalysis ? `\n\n**Phân tích cụ thể về "${healthConcern}":**\n${specificAnalysis.symptomAnalysis}` : ""}`,
      imbalanceLocation: `${bodyOrgan?.organSimple} (${bodyOrgan?.bodyPart}) - Mức độ: Nghiêm trọng`,
      imbalanceDetail: `${bodyOrgan?.organ} đang trong tình trạng **"hư tổn"** nghiêm trọng. Không chỉ suy yếu đơn thuần mà còn bị tà khí xâm nhập. Trong y học cổ truyền gọi là **"thực chứng"** - có thực tà chiếm cứ trong tạng phủ. Cần phải **"tả thực bổ hư"** - vừa tống xuất tà khí, vừa bổ sung chính khí.`,
      symptoms: bodyOrgan?.symptoms || [],
      causes: bodyOrgan?.causes || [],
      consequences: bodyOrgan?.consequences || [],
      advice:
        specificAnalysis?.specificAdvice ||
        `**⚠️ LỜI KHUYÊN KHẨN CẤP - VUI LÒNG ĐỌC KỸ:**

Tôi với vai trò người tư vấn y học cổ truyền 20 năm, tôi **khuyến cáo mạnh mẽ** bạn cần:

**I. TÌM THẦY THUỐC NGAY (立即就醫):**

🏥 **Trong vòng 1-3 ngày, bạn NÊN:**
- Đến gặp bác sĩ Đông y **có kinh nghiệm** (tối thiểu 10 năm hành nghề)
- Mang theo kết quả chẩn đoán này để thầy thuốc hiểu rõ tình trạng
- Có thể cần xét nghiệm y học hiện đại kết hợp để chẩn đoán chính xác

**Tại sao phải tìm thầy giỏi?**
"Dụng khắc Thể" khó chữa, cần thầy thuốc có tài mới có thể "chuyển họa vi phúc". Thầy phải hiểu sâu về Ngũ Hành, biết cách dùng thuốc để:
1. **Bổ Thể (${bodyElement})** - Tăng cường chính khí
2. **Tiết Dụng (${useElement})** - Giảm bớt tà khí
3. **Điều hòa cả hệ thống** - Không chỉ chữa một tạng

**II. PHÁC ĐỒ ĐIỀU TRỊ DÀI HẠN (6-12 tháng):**

📋 **Giai đoạn 1 (Tháng 1-3): Cấp cứu - Ngăn chặn tổn thương**
- Uống thuốc **đúng giờ, đúng liều** theo đơn thầy kê
- Nghỉ ngơi tối đa, tạm ngừng công việc nặng
- Tránh tuyệt đối các yếu tố thuộc ${useElement}

📋 **Giai đoạn 2 (Tháng 4-6): Ổn định - Bổ sung năng lượng**
- Tiếp tục thuốc nhưng có thể giảm liều  
- Bắt đầu vận động nhẹ, dinh dưỡng tốt
- Châm cứu, bấm huyệt hỗ trợ

📋 **Giai đoạn 3 (Tháng 7-12): Phục hồi - Tăng cường thể chất**
- Dùng thuốc bổ để cố gắng chính khí
- Tập luyện đều đặn, sinh hoạt bình thường
- Khám định kỳ 1 tháng/lần

**III. CHẾ ĐỘ SINH HOẠT ĐẶC BIỆT:**

🍚 **Ăn uống (QUAN TRỌNG):**
- **BẮT BUỘC ăn**: Thực phẩm vị ${bodyOrgan?.taste?.toLowerCase()} để bổ ${bodyOrgan?.organSimple}
- **TUYỆT ĐỐI tránh**: Đồ ăn thuộc ${useElement} - có thể làm tình trạng nặng hơn  
- Ăn 5-6 bữa nhỏ thay vì 3 bữa lớn
- Nhai kỹ, ăn chậm, không ăn no quá

😴 **Ngủ nghỉ:**
- Ngủ trước 22h, dậy sau 6h - tối thiểu 8-9 tiếng
- Ngủ trưa 30 phút mỗi ngày
- Không thức khuya dù bất kỳ lý do gì

💆 **Tự chăm sóc tại nhà:**
- Massage huyệt điểm liên quan ${bodyOrgan?.organSimple} mỗi ngày
- Đắp nóng hoặc chườm nóng vùng ${bodyOrgan?.bodyPart}
- Tắm nước ấm trước khi ngủ

**IV. TÂM LÝ VÀ TINH THẦN:**

🧘 **Kiểm soát cảm xúc ${bodyOrgan?.emotion}:**
- Đây là cảm xúc trực tiếp tổn thương ${bodyOrgan?.organSimple}
- Thiền định 15-20 phút mỗi ngày
- Nếu quá căng thẳng, tìm tư vấn tâm lý

💪 **Giữ tinh thần lạc quan:**
- "Bệnh lai như sơn đảo, bệnh khứ như trừu tơ" - Đừng nản lòng
- Nhiều bệnh nhân của tôi từng ở tình trạng tương tự nhưng đã khỏi nhờ kiên trì
- Tin vào sức mạnh tự phục hồi của cơ thể

**V. THEO DÕI VÀ ĐÁNH GIÁ:**

📊 **Chỉ số cần theo dõi:**
- Triệu chứng có giảm sau 2 tuần điều trị không?
- Có triệu chứng mới xuất hiện không?
- Tinh thần, giấc ngủ có cải thiện không?

📅 **Tái khám:**
- Sau 2 tuần điều trị: Đánh giá ban đầu
- Sau 1 tháng: Điều chỉnh phác đồ nếu cần
- Sau 3 tháng: Đánh giá toàn diện

**⚠️ DẤU HIỆU CẦN CẤP CỨU Y TẾ NGAY:**
- ${bodyOrgan?.symptoms?.[0]} đột ngột trầm trọng
- Đau dữ dội không chịu được
- Chóng mặt, ngất xỉu
- ${bodyOrgan?.bodyPart} bị tổn thương nặng

➡️ **GỌI CỨU THƯƠNG HOẶC ĐẾN BỆNH VIỆN NGAY!**

${hexagramNumber && PURE_HEXAGRAMS[hexagramNumber] ? `\n\n**Lời khuyên đặc biệt cho quẻ ${PURE_HEXAGRAMS[hexagramNumber].name}:**\n\n${PURE_HEXAGRAMS[hexagramNumber].advice}\n\n⚠️ **Dấu hiệu nguy hiểm với quẻ này:** ${PURE_HEXAGRAMS[hexagramNumber].negativeSign}` : ""}

**📞 HỖ TRỢ:**
Nếu cần tư vấn thêm về phác đồ điều trị chi tiết, vui lòng chọn gói dịch vụ phù hợp bên dưới. Sức khỏe là tài sản quý giá nhất, đừng tiếc tiền đầu tư cho bản thân.`,
      prognosis:
        "**Tiên lượng: Khó, cần kiên trì lâu dài.** Với điều trị đúng cách và nghiêm túc, 70-80% bệnh nhân cải thiện sau 6-12 tháng. Tuy nhiên, nếu không chữa hoặc chữa không đúng, bệnh có thể trở nên mạn tính, ảnh hưởng đến chất lượng cuộc sống lâu dài. Quan trọng là **kiên trì và có niềm tin**.",
      severity: "severe",
      severityLabel: "CẦN CAN THIỆP NGAY",
    }
  }

  // Tỷ hòa
  return {
    ...baseResult,
    status: "neutral",
    title: "Thể Dụng Tỷ Hòa - Âm Dương Điều Hòa",
    summarySimple: `Cơ thể bạn đang ở trạng thái **cân bằng tự nhiên**. ${bodyOrgan?.organSimple} và môi trường xung quanh cùng thuộc ${bodyElement}, tạo nên sự hòa hợp như anh em một nhà. Đây là dấu hiệu tốt, thể hiện âm dương điều hòa.${hexagramSpecific}${movingLineSpecific}${specificSummaryAddition}`,
    summary: `Theo Mai Hoa Dịch Số, "Thể Dụng tỷ hòa" nghĩa là quẻ Thể và quẻ Dụng cùng một ngũ hành, không có xung khắc. Thầy Thiệu Khang Tiết viết: "Thể Dụng tỷ hòa, bách sự tùy ý" - Thể Dụng hòa hợp thì trăm việc đều thuận ý. Trong y học, đây là trạng thái **"âm bình dương bí, tinh thần nãi trị"** - âm dương cân bằng, tinh thần mới được điều trị tốt.`,
    healthDetail: `${bodyElement} là ngũ hành chung của cả Thể lẫn Dụng, tạo nên sự đồng điệu tự nhiên. ${bodyOrgan?.organ} của bạn đang hoạt động ổn định, không có mất cân bằng lớn.

Trong y học cổ truyền, trạng thái này gọi là **"bình hòa"** - bình thản và hòa uyển. Các tạng phủ trong cơ thể như một dàn nhạc đang chơi hòa âm, mỗi người làm nhiệm vụ của mình mà không can thiệp quá mức hoặc thiếu hụt.

Tuy nhiên, "bình hòa" không có nghĩa là hoàn hảo tuyệt đối. Vẫn có thể có những dao động nhỏ, nhưng cơ thể có khả năng tự điều chỉnh về trạng thái cân bằng.${seasonalAdvice}${specificAnalysis ? `\n\n**Phân tích cụ thể về "${healthConcern}":**\n${specificAnalysis.symptomAnalysis}` : ""}`,
    imbalanceLocation: null,
    imbalanceDetail: null,
    symptoms: null,
    advice:
      specificAnalysis?.specificAdvice ||
      `Trạng thái sức khỏe của bạn khá ổn định. Hãy:

**1. Duy trì lối sống hiện tại:**
- Chế độ ăn uống, nghỉ ngơi đang khá hợp lý
- Tiếp tục như vậy để giữ sự cân bằng

**2. Khám định kỳ:**
- Nên khám sức khỏe 6 tháng đến 1 năm/lần
- Để phát hiện sớm nếu có vấn đề

**3. Tăng cường phòng ngừa:**
- Ăn các thực phẩm vị ${bodyOrgan?.taste?.toLowerCase()} để bổ ${bodyOrgan?.organSimple}
- Vận động đều đặn 30 phút mỗi ngày

**4. Giữ tâm bình tĩnh:**
- "Thanh tĩnh vi thiên hạ chính" - Trong sạch tĩnh lặng là chánh đạo của thiên hạ
- Tránh stress và cảm xúc thái quá${hexagramNumber && PURE_HEXAGRAMS[hexagramNumber] ? `\n\n**Lời khuyên riêng cho quẻ ${PURE_HEXAGRAMS[hexagramNumber].name}:** ${PURE_HEXAGRAMS[hexagramNumber].advice}` : ""}`,
    prognosis: "Nếu có bệnh nhẹ sẽ dễ dàng hồi phục. Tình trạng sức khỏe tổng thể ổn định.",
    severity: "mild",
    severityLabel: "Cân bằng",
  }
}

function getElementExample(useElement: string, bodyElement: string): string {
  const examples: Record<string, string> = {
    Mộc_Thổ: "Mộc (cây) khắc Thổ (đất) - rễ cây xuyên vào đất, phá hủy cấu trúc đất",
    Thổ_Thủy: "Thổ (đất) khắc Thủy (nước) - đất làm đục nước, chặn dòng nước chảy",
    Thủy_Hỏa: "Thủy (nước) khắc Hỏa (lửa) - nước dập tắt lửa, không còn nhiệt độ",
    Hỏa_Kim: "Hỏa (lửa) khắc Kim (kim loại) - lửa nóng chảy kim loại, làm biến dạng",
    Kim_Mộc: "Kim (kim loại) khắc Mộc (cây) - rìu sắt chặt cây, làm gãy nhánh",
  }
  return examples[`${useElement}_${bodyElement}`] || "năng lượng mạnh tấn công năng lượng yếu"
}

function getSeasonalHealthAdvice(element: string, month: number): string {
  // Mùa xuân: 1,2,3 (Mộc vượng)
  // Mùa hạ: 4,5,6 (Hỏa vượng)
  // Mùa thu: 7,8,9 (Kim vượng)
  // Mùa đông: 10,11,12 (Thủy vượng)

  const seasonElement =
    month >= 1 && month <= 3 ? "Mộc" : month >= 4 && month <= 6 ? "Hỏa" : month >= 7 && month <= 9 ? "Kim" : "Thủy"

  if (element === seasonElement) {
    return `Hiện tại là mùa của ${element}, nên ${element} trong cơ thể bạn đang được thiên nhiên hỗ trợ, là thời điểm "đắc thời" - được thời cơ. Hãy tận dụng thời gian này để điều trị hoặc củng cố sức khỏe. Hiệu quả sẽ tăng gấp đôi so với các mùa khác. Thầy xưa nói "đắc thời giả xương, thất thời giả tương" - được thời thì hưng thịnh, mất thời thì suy vong.`
  }

  if (KHAC[seasonElement] === element) {
    return `⚠️ **CHÚ Ý:** Hiện tại là mùa của ${seasonElement}, mà ${seasonElement} khắc ${element}. Điều này có nghĩa là ${element} trong cơ thể bạn đang bị môi trường thiên nhiên "tấn công", dễ bị suy yếu hơn. Bạn cần **đặc biệt chú ý** bảo vệ và bồi bổ ${element} trong giai đoạn này. Tránh làm việc quá sức, ăn uống bổ dưỡng, nghỉ ngơi đầy đủ. Đây là thời điểm dễ phát bệnh nhất!`
  }

  return `Mùa hiện tại (tháng ${month}) tương đối ổn định với ${element} của bạn. Hãy duy trì lối sống lành mạnh.`
}
