export const ELEMENT_TO_ORGAN: Record<
  string,
  {
    organ: string
    organSimple: string
    viscera: string
    bodyPart: string
    emotion: string
    taste: string
    symptoms: string[]
    causes: string[]
    consequences: string[]
  }
> = {
  Mộc: {
    organ: "Gan (肝)",
    organSimple: "Gan",
    viscera: "Mật (胆)",
    bodyPart: "Gân cơ, mắt",
    emotion: "Giận dữ",
    taste: "Chua",
    symptoms: [
      "Mắt mờ, khô mắt, đỏ mắt",
      "Dễ cáu gắt, nóng giận",
      "Đau vùng hông sườn",
      "Chuột rút, co cứng cơ",
      "Móng tay giòn, dễ gãy",
      "Mất ngủ, khó ngủ sâu",
    ],
    causes: [
      "Căng thẳng, stress kéo dài",
      "Hay nóng giận, uất ức",
      "Uống rượu bia nhiều",
      "Thức khuya, ngủ muộn",
      "Ăn nhiều đồ cay nóng",
    ],
    consequences: [
      "Can hỏa vượng gây cao huyết áp",
      "Mắt ngày càng kém",
      "Rối loạn tiêu hóa mật",
      "Tính tình thay đổi thất thường",
    ],
  },
  Hỏa: {
    organ: "Tim (心)",
    organSimple: "Tim",
    viscera: "Tiểu tràng (小肠)",
    bodyPart: "Huyết mạch, lưỡi",
    emotion: "Vui mừng",
    taste: "Đắng",
    symptoms: [
      "Tim đập nhanh, hồi hộp",
      "Mất ngủ, hay mơ",
      "Lưỡi đỏ, lở miệng",
      "Hay quên, khó tập trung",
      "Ra mồ hôi tay chân",
      "Lo âu, bồn chồn",
    ],
    causes: [
      "Lo nghĩ, suy tư quá độ",
      "Vui quá hóa buồn, cảm xúc thái quá",
      "Mất ngủ kéo dài",
      "Làm việc căng thẳng trí óc",
      "Ăn nhiều đồ cay nóng, uống cà phê",
    ],
    consequences: ["Suy tim, rối loạn nhịp tim", "Trầm cảm, rối loạn lo âu", "Suy giảm trí nhớ", "Mất ngủ mãn tính"],
  },
  Thổ: {
    organ: "Tỳ (脾)",
    organSimple: "Tỳ Vị (Hệ tiêu hóa)",
    viscera: "Dạ dày (胃)",
    bodyPart: "Cơ bắp, miệng",
    emotion: "Lo nghĩ",
    taste: "Ngọt",
    symptoms: [
      "Ăn không tiêu, đầy bụng",
      "Chân tay nặng nề, mệt mỏi",
      "Da vàng sạm, môi nhợt",
      "Hay lo lắng, suy nghĩ nhiều",
      "Phân lỏng, tiêu chảy",
      "Chán ăn, ăn không ngon miệng",
    ],
    causes: [
      "Lo nghĩ, suy tư quá độ",
      "Ăn uống không điều độ",
      "Ăn nhiều đồ lạnh, sống",
      "Ngồi nhiều, ít vận động",
      "Ăn quá nhiều đồ ngọt",
    ],
    consequences: ["Suy dinh dưỡng, thiếu máu", "Rối loạn tiêu hóa mãn tính", "Sụt cân hoặc béo phì", "Cơ bắp teo yếu"],
  },
  Kim: {
    organ: "Phổi (肺)",
    organSimple: "Phổi",
    viscera: "Đại tràng (大肠)",
    bodyPart: "Da lông, mũi",
    emotion: "Buồn bã",
    taste: "Cay",
    symptoms: [
      "Ho khan, ho có đờm",
      "Khó thở, tức ngực",
      "Da khô, ngứa, dễ dị ứng",
      "Hay buồn, u sầu",
      "Táo bón, đại tiện khó",
      "Nghẹt mũi, viêm mũi",
    ],
    causes: [
      "Buồn bã, u sầu kéo dài",
      "Hít phải khói bụi, ô nhiễm",
      "Thời tiết thay đổi đột ngột",
      "Ăn nhiều đồ cay nóng",
      "Uống ít nước",
    ],
    consequences: ["Viêm phổi, viêm phế quản mãn", "Hen suyễn, khó thở", "Bệnh ngoài da mãn tính", "Táo bón kéo dài"],
  },
  Thủy: {
    organ: "Thận (肾)",
    organSimple: "Thận",
    viscera: "Bàng quang (膀胱)",
    bodyPart: "Xương tủy, tai",
    emotion: "Sợ hãi",
    taste: "Mặn",
    symptoms: [
      "Đau lưng, mỏi gối",
      "Ù tai, nghe kém",
      "Tiểu đêm nhiều lần",
      "Tóc bạc sớm, rụng tóc",
      "Hay sợ hãi, lo lắng vô cớ",
      "Chân tay lạnh, sợ lạnh",
    ],
    causes: [
      "Làm việc quá sức kéo dài",
      "Sinh hoạt tình dục quá độ",
      "Sợ hãi, kinh hoàng kéo dài",
      "Ăn quá mặn, uống ít nước",
      "Tuổi cao suy giảm tự nhiên",
    ],
    consequences: ["Suy thận, đau xương khớp", "Điếc, ù tai mãn tính", "Loãng xương, dễ gãy xương", "Suy giảm sinh lý"],
  },
}

export const SYMPTOM_KEYWORDS: Record<string, { element: string; description: string }> = {
  // Mộc - Gan
  mắt: { element: "Mộc", description: "Mắt thuộc Mộc, liên quan đến Gan" },
  "đỏ mắt": { element: "Mộc", description: "Mắt đỏ thường do Can hỏa vượng" },
  "mờ mắt": { element: "Mộc", description: "Mắt mờ liên quan đến huyết Gan suy" },
  gân: { element: "Mộc", description: "Gân cơ thuộc Mộc, Gan chủ gân" },
  "chuột rút": { element: "Mộc", description: "Chuột rút do Gan huyết không đủ nuôi gân" },
  "móng tay": { element: "Mộc", description: "Móng tay là biểu hiện của Gan" },

  // Hỏa - Tim
  tim: { element: "Hỏa", description: "Tim thuộc Hỏa" },
  "đánh trống ngực": { element: "Hỏa", description: "Tim đập nhanh do Tâm hỏa vượng" },
  "hồi hộp": { element: "Hỏa", description: "Hồi hộp liên quan đến Tâm khí" },
  lưỡi: { element: "Hỏa", description: "Lưỡi thuộc Hỏa, Tim khai khiếu ra lưỡi" },
  "lở miệng": { element: "Hỏa", description: "Lở miệng do Tâm hỏa bốc lên" },
  "mất ngủ": { element: "Hỏa", description: "Mất ngủ liên quan đến Tâm thần bất an" },

  // Thổ - Tỳ Vị
  "đau bụng": { element: "Thổ", description: "Bụng thuộc Thổ, Tỳ Vị chủ tiêu hóa" },
  "đầy bụng": { element: "Thổ", description: "Đầy bụng do Tỳ khí hư" },
  "tiêu chảy": { element: "Thổ", description: "Tiêu chảy do Tỳ Vị hư hàn" },
  "ăn không tiêu": { element: "Thổ", description: "Không tiêu do Tỳ khí suy" },
  miệng: { element: "Thổ", description: "Miệng thuộc Thổ, Tỳ khai khiếu ra miệng" },
  môi: { element: "Thổ", description: "Môi là biểu hiện của Tỳ" },

  // Kim - Phổi
  ho: { element: "Kim", description: "Ho liên quan đến Phế khí" },
  "khó thở": { element: "Kim", description: "Khó thở do Phế khí hư" },
  da: { element: "Kim", description: "Da thuộc Kim, Phổi chủ bì mao" },
  mũi: { element: "Kim", description: "Mũi thuộc Kim, Phổi khai khiếu ra mũi" },
  "nghẹt mũi": { element: "Kim", description: "Nghẹt mũi do Phế khí bất tuyên" },
  "táo bón": { element: "Kim", description: "Táo bón do Đại tràng (Kim) táo nhiệt" },
  răng: {
    element: "Kim",
    description: "Răng thuộc Thận (xương) nhưng nướu răng thuộc Vị (Thổ), đau răng thường do Vị hỏa hoặc Thận hư",
  },

  // Thủy - Thận
  lưng: { element: "Thủy", description: "Lưng thuộc Thủy, Thận chủ cốt" },
  "đau lưng": { element: "Thủy", description: "Đau lưng thường do Thận hư" },
  gối: { element: "Thủy", description: "Gối thuộc Thủy, Thận chủ xương" },
  tai: { element: "Thủy", description: "Tai thuộc Thủy, Thận khai khiếu ra tai" },
  "ù tai": { element: "Thủy", description: "Ù tai do Thận tinh suy" },
  tóc: { element: "Thủy", description: "Tóc là biểu hiện của Thận tinh" },
  "tiểu đêm": { element: "Thủy", description: "Tiểu đêm do Thận dương hư" },
  xương: { element: "Thủy", description: "Xương thuộc Thủy, Thận chủ cốt tủy" },
}
