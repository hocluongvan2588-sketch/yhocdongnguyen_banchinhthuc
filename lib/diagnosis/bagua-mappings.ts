// Mapping 8 quẻ thuần theo tài liệu Mai Hoa Dịch Số chính thống

export const BAGUA_HEALTH_MAPPING = {
  1: {
    // Càn ☰
    name: "Càn",
    element: "Kim",
    bodyPart: "Đầu, xương, mặt",
    organs: "Phổi, đại tràng",
    symptoms: ["Đau đầu", "Bệnh về xương", "Bệnh hô hấp", "Phế khí không tuyên"],
    description: "Càn chủ đầu, xương cốt. Nếu Càn bị khắc → đau đầu, chấn thương đầu, bệnh xương khớp",
  },
  2: {
    // Đoài ☱
    name: "Đoài",
    element: "Kim",
    bodyPart: "Miệng, lưỡi, răng, họng",
    organs: "Phổi",
    symptoms: ["Viêm họng", "Bệnh răng miệng", "Phế quản", "Ho khan"],
    description: "Đoài chủ miệng lưỡi. Nếu Đoài bị khắc → viêm họng, bệnh răng, lưỡi loét",
  },
  3: {
    // Ly ☲
    name: "Ly",
    element: "Hỏa",
    bodyPart: "Mắt, tim, máu",
    organs: "Tim, ruột non",
    symptoms: ["Sốt cao", "Bệnh tim mạch", "Huyết áp", "Mắt đỏ"],
    description: "Ly chủ mắt, tim, huyết mạch. Nếu Ly bị khắc → bệnh mắt, tim, huyết áp",
  },
  4: {
    // Chấn ☳
    name: "Chấn",
    element: "Mộc",
    bodyPart: "Chân, gan, tóc, gân",
    organs: "Gan, mật",
    symptoms: ["Co quắp chân", "Nóng nảy", "Suy nhược thần kinh", "Gân cơ căng cứng"],
    description: "Chấn chủ chân, gân cơ. Nếu Chấn bị khắc → co quắp, gân cơ căng, suy nhược",
  },
  5: {
    // Tốn ☴
    name: "Tốn",
    element: "Mộc",
    bodyPart: "Đùi, cánh tay, phong thấp",
    organs: "Gan, mật",
    symptoms: ["Phong thấp", "Đau nhức tay chân", "Đường ruột", "Can khí ứ trệ"],
    description: "Tốn chủ đùi, tay. Nếu Tốn bị khắc → phong thấp, đau tay chân",
  },
  6: {
    // Khảm ☵
    name: "Khảm",
    element: "Thủy",
    bodyPart: "Tai, máu, thận, bàng quang",
    organs: "Thận, bàng quang",
    symptoms: ["Thận hư", "Mất ngủ", "Bệnh đường tiết niệu", "Ù tai"],
    description: "Khảm chủ tai, thận. Nếu Khảm bị khắc → thận hư, ù tai, bệnh tiết niệu",
  },
  7: {
    // Cấn ☶
    name: "Cấn",
    element: "Thổ",
    bodyPart: "Tay, ngón tay, mũi, lưng",
    organs: "Tì (Lá lách), vị",
    symptoms: ["Ăn uống kém", "Sưng tấy", "U cục", "Tỳ vị hư hàn"],
    description: "Cấn chủ tay, mũi. Nếu Cấn bị khắc → tay yếu, mũi tắc, khối u",
  },
  8: {
    // Khôn ☷
    name: "Khôn",
    element: "Thổ",
    bodyPart: "Bụng, dạ dày, thịt",
    organs: "Tì, dạ dày",
    symptoms: ["Tiêu hóa kém", "Đau dạ dày", "Cơ bắp yếu", "Tỳ vị không hóa"],
    description: "Khôn chủ bụng, thịt. Nếu Khôn bị khắc → đau bụng, tiêu hóa kém",
  },
}

export const SPECIAL_HEXAGRAM_COMBINATIONS = {
  "1-2": {
    name: "Thiên Trạch Lý",
    warning: "Cẩn thận chấn thương do kim loại hoặc té ngã (2 Kim gặp nhau)",
    severity: "moderate" as const,
  },
  "8-6": {
    name: "Địa Thủy Sư",
    warning: "Bệnh về đường tiêu hóa và thận - Thổ khắc Thủy rất nghiêm trọng",
    severity: "severe" as const,
  },
  "3-4": {
    name: "Hỏa Lôi Phệ Hạp",
    warning: "Sốt cao, co giật - Hỏa Mộc cùng vượng, dễ động kinh",
    severity: "severe" as const,
  },
  "8-7": {
    name: "Địa Sơn Khiêm",
    warning: "Khối u trong bụng, tiêu hóa tắc nghẽn (Thổ tích tụ)",
    severity: "moderate" as const,
  },
}
