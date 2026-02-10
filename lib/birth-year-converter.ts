/**
 * Chuyển đổi lịch Dương sang Can Chi theo Đặc tả Kỹ thuật
 * Áp dụng cho toàn hệ thống: Mai Hoa, Tứ trụ, Bát Trạch, Nam Dược, Khai Huyệt
 */

export interface BirthYearInfo {
  gregorianYear: number
  gregorianMonth: number
  gregorianDay: number
  jdn: number // Julian Day Number
  canNam: string // Thiên Can Năm
  chiNam: string // Địa Chi Năm
  canNgay: string // Thiên Can Ngày
  chiNgay: string // Địa Chi Ngày
  element: string // Ngũ hành năm
  animalZodiac: string // Con giáp
  age: number
  ageGroup: "pediatric" | "youth" | "adult" | "geriatric"
  lunarYear: number // Năm mệnh lý (theo Lập Xuân)
}

const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]
const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]
const CON_GIAP = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]

// Ngũ hành theo Địa Chi
const DIA_CHI_ELEMENTS: Record<string, string> = {
  Tý: "Thủy",
  Sửu: "Thổ",
  Dần: "Mộc",
  Mão: "Mộc",
  Thìn: "Thổ",
  Tỵ: "Hỏa",
  Ngọ: "Hỏa",
  Mùi: "Thổ",
  Thân: "Kim",
  Dậu: "Kim",
  Tuất: "Thổ",
  Hợi: "Thủy",
}

const HEAVENLY_STEMS = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]
const EARTHLY_BRANCHES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]
const HEAVENLY_STEM_ELEMENTS: Record<string, string> = {
  Giáp: "Hỏa",
  Ất: "Đất",
  Bính: "Thủy",
  Đinh: "Kim",
  Mậu: "Mộc",
  Kỷ: "Thủy",
  Canh: "Kim",
  Tân: "Hỏa",
  Nhâm: "Đất",
  Quý: "Mộc",
}

/**
 * Tính Julian Day Number (JDN) theo đặc tả kỹ thuật
 * Áp dụng từ năm 1582+ (sau cải cách lịch Gregorian)
 */
export function calculateJDN(year: number, month: number, day: number): number {
  let y = year
  let m = month

  // Nếu tháng <= 2, chuyển về năm trước và tháng +12
  if (m <= 2) {
    y = y - 1
    m = m + 12
  }

  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)

  const JDN = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5

  return Math.floor(JDN)
}

/**
 * Chuyển đổi Can Chi Ngày dựa trên JDN
 */
export function getCanChiNgay(jdn: number): { can: string; chi: string } {
  const canIdx = (jdn + 9) % 10
  const chiIdx = (jdn + 1) % 12

  return {
    can: THIEN_CAN[canIdx],
    chi: DIA_CHI[chiIdx],
  }
}

/**
 * Xác định ngày Lập Xuân (xấp xỉ)
 * Lập Xuân thường rơi vào 4-5 tháng 2 dương lịch
 */
export function getLapXuanDate(year: number): { month: number; day: number } {
  // Xấp xỉ: Lập Xuân rơi vào 4/2
  return { month: 2, day: 4 }
}

/**
 * Chuyển đổi Can Chi Năm (dựa trên Lập Xuân)
 * Trong mệnh lý, năm mới bắt đầu từ Lập Xuân, không phải Tết
 */
export function getCanChiNam(
  year: number,
  month: number,
  day: number,
): { can: string; chi: string; lunarYear: number } {
  const lapXuan = getLapXuanDate(year)

  // Nếu chưa đến Lập Xuân, thuộc năm trước
  let effectiveYear = year
  if (month < lapXuan.month || (month === lapXuan.month && day < lapXuan.day)) {
    effectiveYear = year - 1
  }

  let canIdx = (effectiveYear - 4) % 10
  let chiIdx = (effectiveYear - 4) % 12

  // Xử lý số âm
  if (canIdx < 0) canIdx += 10
  if (chiIdx < 0) chiIdx += 12

  return {
    can: THIEN_CAN[canIdx],
    chi: DIA_CHI[chiIdx],
    lunarYear: effectiveYear,
  }
}

/**
 * Tính tuổi Âm lịch (Vietnamese lunar age)
 * Theo truyền thống Việt Nam:
 * - Sinh ra đã 1 tuổi
 * - Tăng 1 tuổi mỗi Tết Nguyên Đán
 * 
 * Công thức đơn giản: (Năm hiện tại - Năm sinh) + 1
 * Lưu ý: Đây là tuổi âm lịch đầy đủ, không phụ thuộc vào việc đã qua sinh nhật chưa
 */
export function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear()
  return currentYear - birthYear + 1
}

/**
 * Xác định nhóm tuổi cho điều chỉnh phác đồ
 * - pediatric (0-12): Trẻ em - giảm liều, bấm nhẹ
 * - youth (13-25): Thanh thiếu niên
 * - adult (26-59): Người trưởng thành
 * - geriatric (60+): Người cao tuổi - giảm lực bấm, điều chỉnh liều
 */
export function getAgeGroup(age: number): "pediatric" | "youth" | "adult" | "geriatric" {
  if (age <= 12) return "pediatric"
  if (age <= 25) return "youth"
  if (age <= 59) return "adult"
  return "geriatric"
}

/**
 * Chuyển đổi toàn bộ thông tin từ ngày sinh Dương lịch
 * @param year Năm sinh dương lịch
 * @param month Tháng sinh (1-12), mặc định 6
 * @param day Ngày sinh (1-31), mặc định 15
 */
export function convertBirthYear(year: number, month = 6, day = 15): BirthYearInfo {
  const age = calculateAge(year)
  const ageGroup = getAgeGroup(age)

  // Tính JDN
  const jdn = calculateJDN(year, month, day)

  // Tính Can Chi Năm (dựa trên Lập Xuân)
  const canChiNam = getCanChiNam(year, month, day)

  // Tính Can Chi Ngày
  const canChiNgay = getCanChiNgay(jdn)

  // Ngũ hành dựa trên Địa Chi Năm
  const element = DIA_CHI_ELEMENTS[canChiNam.chi]

  // Con giáp dựa trên Địa Chi Năm
  const animalZodiac = canChiNam.chi

  return {
    gregorianYear: year,
    gregorianMonth: month,
    gregorianDay: day,
    jdn,
    canNam: canChiNam.can,
    chiNam: canChiNam.chi,
    canNgay: canChiNgay.can,
    chiNgay: canChiNgay.chi,
    element,
    animalZodiac,
    age,
    ageGroup,
    lunarYear: canChiNam.lunarYear,
  }
}

/**
 * Chuyển đổi năm Dương lịch sang năm Âm lịch
 * Quy ước: Năm Âm lịch thường khác Dương lịch 1 năm tùy theo tháng sinh
 * Vì không có tháng sinh chính xác, ta ước lượng: trước Tết thì -1, sau Tết giữ nguyên
 * Đơn giản hóa: Âm lịch = Dương lịch (vì Tết thường vào tháng 1-2)
 */
export function convertToLunarYear(solarYear: number): number {
  // Simplified: Assume solar year = lunar year for calculation
  // In real system, need exact birth month/day to determine if before/after Tet
  return solarYear
}

/**
 * Tính Thiên Can từ năm sinh
 */
export function getHeavenlyStem(year: number): string {
  const index = (year - 4) % 10
  return HEAVENLY_STEMS[index]
}

/**
 * Tính Địa Chi từ năm sinh
 */
export function getEarthlyBranch(year: number): string {
  const index = (year - 4) % 12
  return EARTHLY_BRANCHES[index]
}

/**
 * Lấy con giáp từ năm sinh
 */
export function getAnimalZodiac(year: number): string {
  const index = (year - 4) % 12
  return CON_GIAP[index]
}

/**
 * Lấy ngũ hành từ Thiên Can
 */
export function getElementFromStem(stem: string): string {
  return HEAVENLY_STEM_ELEMENTS[stem] || "Mộc"
}

/**
 * Format năm Can Chi (ví dụ: Giáp Tý, Ất Sửu)
 */
export function formatCanChi(can: string, chi: string): string {
  return `${can} ${chi}`
}

/**
 * Lấy mô tả nhóm tuổi
 */
export function getAgeGroupDescription(ageGroup: "pediatric" | "youth" | "adult" | "geriatric"): string {
  const descriptions = {
    pediatric: "Trẻ em (0-12 tuổi) - Giảm liều lượng và lực bấm nhẹ",
    youth: "Thanh thiếu niên (13-25 tuổi) - Điều trị thường quy",
    adult: "Người trưởng thành (26-59 tuổi) - Phác đồ chuẩn",
    geriatric: "Người cao tuổi (60+ tuổi) - Giảm lực bấm, điều chỉnh liều",
  }
  return descriptions[ageGroup]
}

/**
 * Tính tuổi Âm lịch từ năm sinh (chỉ dùng năm, không cần tháng/ngày)
 */
export function calculateSimpleAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear + 1
}
