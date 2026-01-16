/**
 * Quan hệ Ngũ Hành sinh khắc theo Mai Hoa Dịch Số
 * 金生水，水生木，木生火，火生土，土生金
 * 金克木，木克土，土克水，水克火，火克金
 */

// Sinh: A sinh B nghĩa là A tạo ra B, nuôi dưỡng B
export const SINH: Record<string, string> = {
  Mộc: "Hỏa", // Mộc sinh Hỏa (木生火) - Cây sinh ra lửa
  Hỏa: "Thổ", // Hỏa sinh Thổ (火生土) - Lửa sinh ra tro đất
  Thổ: "Kim", // Thổ sinh Kim (土生金) - Đất sinh ra kim loại
  Kim: "Thủy", // Kim sinh Thủy (金生水) - Kim loại sinh ra nước (ngưng tụ)
  Thủy: "Mộc", // Thủy sinh Mộc (水生木) - Nước sinh ra cây
}

// Khắc: A khắc B nghĩa là A chế ngự B, kiểm soát B
export const KHAC: Record<string, string> = {
  Mộc: "Thổ", // Mộc khắc Thổ (木克土) - Cây khắc đất
  Hỏa: "Kim", // Hỏa khắc Kim (火克金) - Lửa khắc kim loại
  Thổ: "Thủy", // Thổ khắc Thủy (土克水) - Đất khắc nước
  Kim: "Mộc", // Kim khắc Mộc (金克木) - Kim khắc cây
  Thủy: "Hỏa", // Thủy khắc Hỏa (水克火) - Nước khắc lửa
}

// Bị sinh: A được sinh bởi B
export const BI_SINH: Record<string, string> = {
  Hỏa: "Mộc", // Hỏa được Mộc sinh
  Thổ: "Hỏa", // Thổ được Hỏa sinh
  Kim: "Thổ", // Kim được Thổ sinh
  Thủy: "Kim", // Thủy được Kim sinh
  Mộc: "Thủy", // Mộc được Thủy sinh
}

// Bị khắc: A bị B khắc
export const BI_KHAC: Record<string, string> = {
  Thổ: "Mộc", // Thổ bị Mộc khắc
  Kim: "Hỏa", // Kim bị Hỏa khắc
  Thủy: "Thổ", // Thủy bị Thổ khắc
  Mộc: "Kim", // Mộc bị Kim khắc
  Hỏa: "Thủy", // Hỏa bị Thủy khắc
}

/**
 * Kiểm tra quan hệ giữa hai ngũ hành
 */
export function checkElementRelation(element1: string, element2: string): string {
  if (element1 === element2) {
    return "Tỷ hòa" // Cùng ngũ hành
  }

  if (SINH[element1] === element2) {
    return "Element1 sinh Element2"
  }

  if (SINH[element2] === element1) {
    return "Element2 sinh Element1"
  }

  if (KHAC[element1] === element2) {
    return "Element1 khắc Element2"
  }

  if (KHAC[element2] === element1) {
    return "Element2 khắc Element1"
  }

  return "Không có quan hệ trực tiếp"
}

/**
 * Tìm ngũ hành nào khắc một ngũ hành cho trước
 */
export function findCounterElement(element: string): string {
  return BI_KHAC[element] || ""
}

/**
 * Tìm ngũ hành nào sinh một ngũ hành cho trước
 */
export function findNourishElement(element: string): string {
  return BI_SINH[element] || ""
}
