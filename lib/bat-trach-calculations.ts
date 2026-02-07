/**
 * Bát Trạch Minh Cảnh - Calculation Logic
 * Tính toán Cung Phi và 8 phương vị theo năm sinh + giới tính
 */

export type CungPhi =
  | "Khảm"
  | "Khôn"
  | "Chấn"
  | "Tốn"
  | "Càn"
  | "Đoài"
  | "Cấn"
  | "Ly"

export type Direction =
  | "Bắc"
  | "Đông Bắc"
  | "Đông"
  | "Đông Nam"
  | "Nam"
  | "Tây Nam"
  | "Tây"
  | "Tây Bắc"

export type StarType =
  | "Sinh Khí"
  | "Thiên Y"
  | "Diên Niên"
  | "Phục Vị"
  | "Họa Hại"
  | "Lục Sát"
  | "Ngũ Quỷ"
  | "Tuyệt Mệnh"

export interface BatTrachStar {
  star: StarType
  direction: Direction
  element: string
  trigram: string
  quality: "Thượng Cát" | "Trung Cát" | "Tiểu Cát" | "Tiểu Hung" | "Trung Hung" | "Đại Hung"
}

export interface BatTrachResult {
  cungPhi: CungPhi
  group: "Đông Tứ Trạch" | "Tây Tứ Trạch"
  element: string
  stars: BatTrachStar[]
}

/**
 * Tính Cung Phi dựa trên năm sinh và giới tính
 */
export function calculateCungPhi(birthYear: number, gender: "male" | "female"): CungPhi {
  const lastTwoDigits = birthYear % 100

  let result: number

  if (gender === "male") {
    // Nam: (100 - 2 chữ số cuối) % 9
    result = (100 - lastTwoDigits) % 9
  } else {
    // Nữ: (2 chữ số cuối - 4) % 9
    result = (lastTwoDigits - 4) % 9
  }

  // Xử lý số 0 → 9
  if (result === 0) result = 9

  // Mapping số → Cung
  const mapping: Record<number, CungPhi> = {
    1: "Khảm",
    2: "Khôn",
    3: "Chấn",
    4: "Tốn",
    5: gender === "male" ? "Khôn" : "Cấn", // Số 5 đặc biệt
    6: "Càn",
    7: "Đoài",
    8: "Cấn",
    9: "Ly",
  }

  return mapping[result]
}

/**
 * Ma trận Bát Trạch đầy đủ cho 8 cung
 */
const BAT_TRACH_MATRIX: Record<CungPhi, BatTrachStar[]> = {
  Khảm: [
    {
      star: "Sinh Khí",
      direction: "Đông Nam",
      trigram: "Tốn",
      element: "Mộc",
      quality: "Thượng Cát",
    },
    {
      star: "Thiên Y",
      direction: "Đông",
      trigram: "Chấn",
      element: "Mộc",
      quality: "Thượng Cát",
    },
    {
      star: "Diên Niên",
      direction: "Nam",
      trigram: "Ly",
      element: "Hỏa",
      quality: "Trung Cát",
    },
    {
      star: "Phục Vị",
      direction: "Bắc",
      trigram: "Khảm",
      element: "Thủy",
      quality: "Tiểu Cát",
    },
    {
      star: "Họa Hại",
      direction: "Tây Nam",
      trigram: "Khôn",
      element: "Thổ",
      quality: "Tiểu Hung",
    },
    {
      star: "Lục Sát",
      direction: "Tây",
      trigram: "Đoài",
      element: "Kim",
      quality: "Trung Hung",
    },
    {
      star: "Ngũ Quỷ",
      direction: "Tây Bắc",
      trigram: "Càn",
      element: "Kim",
      quality: "Đại Hung",
    },
    {
      star: "Tuyệt Mệnh",
      direction: "Đông Bắc",
      trigram: "Cấn",
      element: "Thổ",
      quality: "Đại Hung",
    },
  ],
  Ly: [
    {
      star: "Sinh Khí",
      direction: "Đông",
      trigram: "Chấn",
      element: "Mộc",
      quality: "Thượng Cát",
    },
    {
      star: "Thiên Y",
      direction: "Đông Nam",
      trigram: "Tốn",
      element: "Mộc",
      quality: "Thượng Cát",
    },
    {
      star: "Diên Niên",
      direction: "Bắc",
      trigram: "Khảm",
      element: "Thủy",
      quality: "Trung Cát",
    },
    {
      star: "Phục Vị",
      direction: "Nam",
      trigram: "Ly",
      element: "Hỏa",
      quality: "Tiểu Cát",
    },
    {
      star: "Họa Hại",
      direction: "Đông Bắc",
      trigram: "Cấn",
      element: "Thổ",
      quality: "Tiểu Hung",
    },
    {
      star: "Lục Sát",
      direction: "Tây Bắc",
      trigram: "Càn",
      element: "Kim",
      quality: "Trung Hung",
    },
    {
      star: "Ngũ Quỷ",
      direction: "Tây",
      trigram: "Đoài",
      element: "Kim",
      quality: "Đại Hung",
    },
    {
      star: "Tuyệt Mệnh",
      direction: "Tây Nam",
      trigram: "Khôn",
      element: "Thổ",
      quality: "Đại Hung",
    },
  ],
  Chấn: [
    {
      star: "Sinh Khí",
      direction: "Nam",
      trigram: "Ly",
      element: "Hỏa",
      quality: "Thượng Cát",
    },
    {
      star: "Thiên Y",
      direction: "Bắc",
      trigram: "Khảm",
      element: "Thủy",
      quality: "Thượng Cát",
    },
    {
      star: "Diên Niên",
      direction: "Đông Nam",
      trigram: "Tốn",
      element: "Mộc",
      quality: "Trung Cát",
    },
    {
      star: "Phục Vị",
      direction: "Đông",
      trigram: "Chấn",
      element: "Mộc",
      quality: "Tiểu Cát",
    },
    {
      star: "Họa Hại",
      direction: "Tây",
      trigram: "Đoài",
      element: "Kim",
      quality: "Tiểu Hung",
    },
    {
      star: "Lục Sát",
      direction: "Đông Bắc",
      trigram: "Cấn",
      element: "Thổ",
      quality: "Trung Hung",
    },
    {
      star: "Ngũ Quỷ",
      direction: "Tây Nam",
      trigram: "Khôn",
      element: "Thổ",
      quality: "Đại Hung",
    },
    {
      star: "Tuyệt Mệnh",
      direction: "Tây Bắc",
      trigram: "Càn",
      element: "Kim",
      quality: "Đại Hung",
    },
  ],
  Tốn: [
    {
      star: "Sinh Khí",
      direction: "Bắc",
      trigram: "Khảm",
      element: "Thủy",
      quality: "Thượng Cát",
    },
    {
      star: "Thiên Y",
      direction: "Nam",
      trigram: "Ly",
      element: "Hỏa",
      quality: "Thượng Cát",
    },
    {
      star: "Diên Niên",
      direction: "Đông",
      trigram: "Chấn",
      element: "Mộc",
      quality: "Trung Cát",
    },
    {
      star: "Phục Vị",
      direction: "Đông Nam",
      trigram: "Tốn",
      element: "Mộc",
      quality: "Tiểu Cát",
    },
    {
      star: "Họa Hại",
      direction: "Tây Bắc",
      trigram: "Càn",
      element: "Kim",
      quality: "Tiểu Hung",
    },
    {
      star: "Lục Sát",
      direction: "Tây Nam",
      trigram: "Khôn",
      element: "Thổ",
      quality: "Trung Hung",
    },
    {
      star: "Ngũ Quỷ",
      direction: "Đông Bắc",
      trigram: "Cấn",
      element: "Thổ",
      quality: "Đại Hung",
    },
    {
      star: "Tuyệt Mệnh",
      direction: "Tây",
      trigram: "Đoài",
      element: "Kim",
      quality: "Đại Hung",
    },
  ],
  Càn: [
    {
      star: "Sinh Khí",
      direction: "Tây",
      trigram: "Đoài",
      element: "Kim",
      quality: "Thượng Cát",
    },
    {
      star: "Thiên Y",
      direction: "Đông Bắc",
      trigram: "Cấn",
      element: "Thổ",
      quality: "Thượng Cát",
    },
    {
      star: "Diên Niên",
      direction: "Tây Nam",
      trigram: "Khôn",
      element: "Thổ",
      quality: "Trung Cát",
    },
    {
      star: "Phục Vị",
      direction: "Tây Bắc",
      trigram: "Càn",
      element: "Kim",
      quality: "Tiểu Cát",
    },
    {
      star: "Họa Hại",
      direction: "Đông Nam",
      trigram: "Tốn",
      element: "Mộc",
      quality: "Tiểu Hung",
    },
    {
      star: "Lục Sát",
      direction: "Nam",
      trigram: "Ly",
      element: "Hỏa",
      quality: "Trung Hung",
    },
    {
      star: "Ngũ Quỷ",
      direction: "Bắc",
      trigram: "Khảm",
      element: "Thủy",
      quality: "Đại Hung",
    },
    {
      star: "Tuyệt Mệnh",
      direction: "Đông",
      trigram: "Chấn",
      element: "Mộc",
      quality: "Đại Hung",
    },
  ],
  Khôn: [
    {
      star: "Sinh Khí",
      direction: "Đông Bắc",
      trigram: "Cấn",
      element: "Thổ",
      quality: "Thượng Cát",
    },
    {
      star: "Thiên Y",
      direction: "Tây",
      trigram: "Đoài",
      element: "Kim",
      quality: "Thượng Cát",
    },
    {
      star: "Diên Niên",
      direction: "Tây Bắc",
      trigram: "Càn",
      element: "Kim",
      quality: "Trung Cát",
    },
    {
      star: "Phục Vị",
      direction: "Tây Nam",
      trigram: "Khôn",
      element: "Thổ",
      quality: "Tiểu Cát",
    },
    {
      star: "Họa Hại",
      direction: "Bắc",
      trigram: "Khảm",
      element: "Thủy",
      quality: "Tiểu Hung",
    },
    {
      star: "Lục Sát",
      direction: "Đông",
      trigram: "Chấn",
      element: "Mộc",
      quality: "Trung Hung",
    },
    {
      star: "Ngũ Quỷ",
      direction: "Đông Nam",
      trigram: "Tốn",
      element: "Mộc",
      quality: "Đại Hung",
    },
    {
      star: "Tuyệt Mệnh",
      direction: "Nam",
      trigram: "Ly",
      element: "Hỏa",
      quality: "Đại Hung",
    },
  ],
  Cấn: [
    {
      star: "Sinh Khí",
      direction: "Tây Nam",
      trigram: "Khôn",
      element: "Thổ",
      quality: "Thượng Cát",
    },
    {
      star: "Thiên Y",
      direction: "Tây Bắc",
      trigram: "Càn",
      element: "Kim",
      quality: "Thượng Cát",
    },
    {
      star: "Diên Niên",
      direction: "Tây",
      trigram: "Đoài",
      element: "Kim",
      quality: "Trung Cát",
    },
    {
      star: "Phục Vị",
      direction: "Đông Bắc",
      trigram: "Cấn",
      element: "Thổ",
      quality: "Tiểu Cát",
    },
    {
      star: "Họa Hại",
      direction: "Đông",
      trigram: "Chấn",
      element: "Mộc",
      quality: "Tiểu Hung",
    },
    {
      star: "Lục Sát",
      direction: "Đông Nam",
      trigram: "Tốn",
      element: "Mộc",
      quality: "Trung Hung",
    },
    {
      star: "Ngũ Quỷ",
      direction: "Nam",
      trigram: "Ly",
      element: "Hỏa",
      quality: "Đại Hung",
    },
    {
      star: "Tuyệt Mệnh",
      direction: "Bắc",
      trigram: "Khảm",
      element: "Thủy",
      quality: "Đại Hung",
    },
  ],
  ��oài: [
    {
      star: "Sinh Khí",
      direction: "Tây Bắc",
      trigram: "Càn",
      element: "Kim",
      quality: "Thượng Cát",
    },
    {
      star: "Thiên Y",
      direction: "Tây Nam",
      trigram: "Khôn",
      element: "Thổ",
      quality: "Thượng Cát",
    },
    {
      star: "Diên Niên",
      direction: "Đông Bắc",
      trigram: "Cấn",
      element: "Thổ",
      quality: "Trung Cát",
    },
    {
      star: "Phục Vị",
      direction: "Tây",
      trigram: "Đoài",
      element: "Kim",
      quality: "Tiểu Cát",
    },
    {
      star: "Họa Hại",
      direction: "Nam",
      trigram: "Ly",
      element: "Hỏa",
      quality: "Tiểu Hung",
    },
    {
      star: "Lục Sát",
      direction: "Bắc",
      trigram: "Khảm",
      element: "Thủy",
      quality: "Trung Hung",
    },
    {
      star: "Ngũ Quỷ",
      direction: "Đông",
      trigram: "Chấn",
      element: "Mộc",
      quality: "Đại Hung",
    },
    {
      star: "Tuyệt Mệnh",
      direction: "Đông Nam",
      trigram: "Tốn",
      element: "Mộc",
      quality: "Đại Hung",
    },
  ],
}

/**
 * Lấy đầy đủ thông tin Bát Trạch cho một người
 */
export function getBatTrachResult(birthYear: number, gender: "male" | "female"): BatTrachResult {
  const cungPhi = calculateCungPhi(birthYear, gender)
  const stars = BAT_TRACH_MATRIX[cungPhi]

  // Xác định nhóm và hành
  const dongTuTrach: CungPhi[] = ["Khảm", "Ly", "Chấn", "Tốn"]
  const group = dongTuTrach.includes(cungPhi) ? "Đông Tứ Trạch" : "Tây Tứ Trạch"

  const elementMap: Record<CungPhi, string> = {
    Khảm: "Thủy",
    Ly: "Hỏa",
    Chấn: "Mộc",
    Tốn: "Mộc",
    Càn: "Kim",
    Khôn: "Thổ",
    Cấn: "Thổ",
    Đoài: "Kim",
  }

  return {
    cungPhi,
    group,
    element: elementMap[cungPhi],
    stars,
  }
}

/**
 * Lấy các hướng cát tinh (4 hướng tốt)
 */
export function getAuspiciousDirections(batTrachResult: BatTrachResult): BatTrachStar[] {
  return batTrachResult.stars.filter((s) =>
    ["Sinh Khí", "Thiên Y", "Diên Niên", "Phục Vị"].includes(s.star),
  )
}

/**
 * Lấy hướng Thiên Y (trị liệu)
 */
export function getThienYDirection(batTrachResult: BatTrachResult): BatTrachStar {
  return batTrachResult.stars.find((s) => s.star === "Thiên Y")!
}

/**
 * Lấy hướng Sinh Khí (phát triển)
 */
export function getSinhKhiDirection(batTrachResult: BatTrachResult): BatTrachStar {
  return batTrachResult.stars.find((s) => s.star === "Sinh Khí")!
}

/**
 * Tính toán dãy số may mắn dựa trên hành cần bổ cứu
 */
export function getLuckyNumbers(elementToSupport: string): number[] {
  const numberMap: Record<string, number[]> = {
    Thủy: [1, 6],
    Hỏa: [2, 7],
    Mộc: [3, 8],
    Kim: [4, 9],
    Thổ: [5, 0],
  }

  return numberMap[elementToSupport] || [5, 0]
}

/**
 * Tính toán màu sắc trợ mệnh
 */
export function getLuckyColors(elementToSupport: string): string[] {
  const colorMap: Record<string, string[]> = {
    Thủy: ["Đen", "Xanh đậm"],
    Hỏa: ["Đỏ", "Hồng"],
    Mộc: ["Xanh lá", "Xanh lục"],
    Kim: ["Trắng", "Bạc", "Vàng kim"],
    Thổ: ["Vàng", "Nâu"],
  }

  return colorMap[elementToSupport] || ["Vàng", "Nâu"]
}
