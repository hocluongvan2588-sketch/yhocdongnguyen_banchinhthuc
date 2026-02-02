/**
 * Vietnamese Lunar Calendar Conversion
 * Based on the standard algorithm by Ho Ngoc Duc (Hồ Ngọc Đức)
 * Reference: https://www.informatik.uni-leipzig.de/~duc/amlich/
 * 
 * Rules:
 * - First day of lunar month is the day of New Moon (Sóc)
 * - Ordinary year has 12 lunar months; leap year has 13 lunar months
 * - Winter Solstice always falls in lunar month 11
 * - Calculations based on meridian 105° East (Vietnam, timezone = 7)
 */

const PI = Math.PI

// Timezone for Vietnam (UTC+7)
const TIME_ZONE = 7

// Helper function for integer division (floor division)
function INT(x: number): number {
  return Math.floor(x)
}

// Heavenly Stems (Thiên Can)
const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']

// Earthly Branches (Địa Chi)
const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

// Chinese Zodiac Animals
const CON_GIAP = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

/**
 * Convert Gregorian date to Julian Day Number
 * Đổi ngày dd/mm/yyyy ra số ngày Julius jd
 */
function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12)
  const y = yy + 4800 - a
  const m = mm + 12 * a - 3
  
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045
  
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083
  }
  
  return jd
}

/**
 * Convert Julian Day Number to Gregorian date
 * Đổi số ngày Julius jd ra ngày dd/mm/yyyy
 */
function jdToDate(jd: number): [number, number, number] {
  let a: number, b: number, c: number
  
  if (jd > 2299160) {
    // After 5/10/1582, Gregorian calendar
    a = jd + 32044
    b = INT((4 * a + 3) / 146097)
    c = a - INT((b * 146097) / 4)
  } else {
    b = 0
    c = jd + 32082
  }
  
  const d = INT((4 * c + 3) / 1461)
  const e = c - INT((1461 * d) / 4)
  const m = INT((5 * e + 2) / 153)
  
  const day = e - INT((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * INT(m / 10)
  const year = b * 100 + d - 4800 + INT(m / 10)
  
  return [day, month, year]
}

/**
 * Compute the New Moon day (Sóc)
 * Tính ngày Sóc thứ k kể từ điểm Sóc ngày 1/1/1900
 */
function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85 // Time in Julian centuries from 1900 January 0.5
  const T2 = T * T
  const T3 = T2 * T
  const dr = PI / 180
  
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr) // Mean new moon
  
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3 // Sun's mean anomaly
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3 // Moon's mean anomaly
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3 // Moon's argument of latitude
  
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M)
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr)
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr)
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr))
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M))
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr))
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M))
  
  let deltat: number
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2
  }
  
  const JdNew = Jd1 + C1 - deltat
  return INT(JdNew + 0.5 + timeZone / 24)
}

/**
 * Compute sun longitude at given Julian day number
 * Tính tọa độ mặt trời
 */
function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525 // Time in Julian centuries from 2000-01-01 12:00:00 GMT
  const T2 = T * T
  const dr = PI / 180 // degree to radian
  
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2 // mean anomaly, degree
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2 // mean longitude, degree
  
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M)
  
  let L = L0 + DL // true longitude, degree
  L = L * dr
  L = L - PI * 2 * INT(L / (PI * 2)) // Normalize to (0, 2*PI)
  
  return INT(L / PI * 6)
}

/**
 * Find the day that starts the 11th lunar month
 * Tìm ngày bắt đầu tháng 11 âm lịch (tháng có chứa Đông chí)
 */
function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021
  const k = INT(off / 29.530588853)
  let nm = getNewMoonDay(k, timeZone)
  const sunLong = getSunLongitude(nm, timeZone) // sun longitude at local midnight
  
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone)
  }
  
  return nm
}

/**
 * Find the leap month offset
 * Xác định tháng nhuận
 */
function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5)
  let last = 0
  let i = 1 // We start with the month following lunar month 11
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  
  do {
    last = arc
    i++
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  } while (arc !== last && i < 14)
  
  return i - 1
}

/**
 * Convert Solar date to Lunar date
 * Đổi ngày dương dd/mm/yyyy ra ngày âm
 */
function convertSolar2Lunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone: number
): {
  lunarDay: number
  lunarMonth: number
  lunarYear: number
  lunarLeap: number
} {
  const dayNumber = jdFromDate(dd, mm, yy)
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853)
  let monthStart = getNewMoonDay(k + 1, timeZone)
  
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone)
  }
  
  let a11 = getLunarMonth11(yy, timeZone)
  let b11 = a11
  let lunarYear: number
  
  if (a11 >= monthStart) {
    lunarYear = yy
    a11 = getLunarMonth11(yy - 1, timeZone)
  } else {
    lunarYear = yy + 1
    b11 = getLunarMonth11(yy + 1, timeZone)
  }
  
  const lunarDay = dayNumber - monthStart + 1
  const diff = INT((monthStart - a11) / 29)
  let lunarLeap = 0
  let lunarMonth = diff + 11
  
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone)
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10
      if (diff === leapMonthDiff) {
        lunarLeap = 1
      }
    }
  }
  
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12
  }
  
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1
  }
  
  return { lunarDay, lunarMonth, lunarYear, lunarLeap }
}

/**
 * Convert Lunar date to Solar date
 * Đổi âm lịch ra dương lịch
 */
function convertLunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  lunarLeap: number,
  timeZone: number
): [number, number, number] {
  let a11: number, b11: number
  
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone)
    b11 = getLunarMonth11(lunarYear, timeZone)
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone)
    b11 = getLunarMonth11(lunarYear + 1, timeZone)
  }
  
  let off = lunarMonth - 11
  if (off < 0) {
    off += 12
  }
  
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone)
    let leapMonth = leapOff - 2
    if (leapMonth < 0) {
      leapMonth += 12
    }
    
    if (lunarLeap !== 0 && lunarMonth !== leapMonth) {
      return [0, 0, 0]
    } else if (lunarLeap !== 0 || off >= leapOff) {
      off += 1
    }
  }
  
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853)
  const monthStart = getNewMoonDay(k + off, timeZone)
  
  return jdToDate(monthStart + lunarDay - 1)
}

/**
 * Get Can Chi for day
 * Tính Can-Chi của ngày
 */
function getCanChiDay(jd: number): string {
  const canIndex = (jd + 9) % 10
  const chiIndex = (jd + 1) % 12
  return `${THIEN_CAN[canIndex]} ${DIA_CHI[chiIndex]}`
}

/**
 * Get Can Chi for year
 * Tính Can-Chi của năm
 */
function getCanChiYear(year: number): string {
  const canIndex = (year + 6) % 10
  const chiIndex = (year + 8) % 12
  return `${THIEN_CAN[canIndex]} ${DIA_CHI[chiIndex]}`
}

/**
 * Get Can Chi for month
 * Tính Can-Chi của tháng
 */
function getCanChiMonth(lunarMonth: number, lunarYear: number): string {
  const canIndex = (lunarYear * 12 + lunarMonth + 3) % 10
  // Tháng 11 là Tý, tháng 12 là Sửu, tháng Giêng (1) là Dần
  const chiIndex = (lunarMonth + 1) % 12
  return `${THIEN_CAN[canIndex]} ${DIA_CHI[chiIndex]}`
}

/**
 * Get zodiac animal for year
 */
function getZodiacAnimal(year: number): string {
  return CON_GIAP[(year + 8) % 12]
}

/**
 * Main function: Convert Solar date to Lunar date with Can Chi information
 */
export function solarToLunar(day: number, month: number, year: number) {
  if (day < 1 || day > 31 || month < 1 || month > 12) {
    throw new Error('Invalid date value')
  }
  
  if (year < 1900) {
    throw new Error('Works best for dates after 1900')
  }
  
  const jdn = jdFromDate(day, month, year)
  const lunar = convertSolar2Lunar(day, month, year, TIME_ZONE)
  
  const canChiDay = getCanChiDay(jdn)
  const canChiYear = getCanChiYear(lunar.lunarYear)
  const canChiMonth = getCanChiMonth(lunar.lunarMonth, lunar.lunarYear)
  const zodiacAnimal = getZodiacAnimal(lunar.lunarYear)
  
  return {
    solarDay: day,
    solarMonth: month,
    solarYear: year,
    lunarDay: lunar.lunarDay,
    lunarMonth: lunar.lunarMonth,
    lunarYear: lunar.lunarYear,
    isLeapMonth: lunar.lunarLeap === 1,
    canChiDay,
    canChiMonth,
    canChiYear,
    zodiacAnimal,
    jdn,
  }
}

/**
 * Convert Lunar date to Solar date
 */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth: boolean = false
): { day: number; month: number; year: number } {
  const [day, month, year] = convertLunar2Solar(
    lunarDay,
    lunarMonth,
    lunarYear,
    isLeapMonth ? 1 : 0,
    TIME_ZONE
  )
  
  return { day, month, year }
}

/**
 * Format lunar date for display
 */
export function formatLunarDate(lunarInfo: ReturnType<typeof solarToLunar>): string {
  const leapText = lunarInfo.isLeapMonth ? ' (nhuận)' : ''
  return `${lunarInfo.lunarDay}/${lunarInfo.lunarMonth}${leapText}/${lunarInfo.lunarYear} AL`
}
