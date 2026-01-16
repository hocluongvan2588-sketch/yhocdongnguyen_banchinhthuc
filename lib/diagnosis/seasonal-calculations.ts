export const SEASON_TO_ELEMENT: Record<number, string> = {
  1: "Mộc",
  2: "Mộc",
  3: "Thổ",
  4: "Hỏa",
  5: "Hỏa",
  6: "Thổ",
  7: "Kim",
  8: "Kim",
  9: "Thổ",
  10: "Thủy",
  11: "Thủy",
  12: "Thổ",
}

export const ELEMENT_GENERATES: Record<string, string> = {
  Mộc: "Hỏa",
  Hỏa: "Thổ",
  Thổ: "Kim",
  Kim: "Thủy",
  Thủy: "Mộc",
}

export const ELEMENT_CONTROLS: Record<string, string> = {
  Mộc: "Thổ",
  Thổ: "Thủy",
  Thủy: "Hỏa",
  Hỏa: "Kim",
  Kim: "Mộc",
}

export function analyzeSeasonalInfluence(bodyElement: string, useElement: string, currentMonth: number) {
  const seasonElement = SEASON_TO_ELEMENT[currentMonth] || "Thổ"

  const bodyStrength =
    seasonElement === bodyElement
      ? "vượng"
      : ELEMENT_GENERATES[seasonElement] === bodyElement
        ? "tương sinh"
        : ELEMENT_CONTROLS[seasonElement] === bodyElement
          ? "bị khắc"
          : ELEMENT_GENERATES[bodyElement] === seasonElement
            ? "bị tiêu hao"
            : "bình thường"

  const useStrength =
    seasonElement === useElement
      ? "vượng"
      : ELEMENT_GENERATES[seasonElement] === useElement
        ? "được sinh"
        : ELEMENT_CONTROLS[seasonElement] === useElement
          ? "bị khắc"
          : ELEMENT_GENERATES[useElement] === seasonElement
            ? "bị tiêu hao"
            : "bình thường"

  const dangerousMonths: number[] = []
  const safeMonths: number[] = []
  const recoveryMonths: number[] = []

  for (let month = 1; month <= 12; month++) {
    const monthElement = SEASON_TO_ELEMENT[month]

    if (
      ELEMENT_CONTROLS[useElement] === bodyElement &&
      (monthElement === useElement || ELEMENT_GENERATES[monthElement] === useElement)
    ) {
      dangerousMonths.push(month)
    }

    if (monthElement === bodyElement || ELEMENT_GENERATES[monthElement] === bodyElement) {
      safeMonths.push(month)
    }

    if (ELEMENT_CONTROLS[monthElement] === useElement) {
      recoveryMonths.push(month)
    }
  }

  return {
    seasonElement,
    bodyStrength,
    useStrength,
    dangerousMonths,
    safeMonths,
    recoveryMonths,
    currentMonthRisk: dangerousMonths.includes(currentMonth)
      ? "high"
      : safeMonths.includes(currentMonth)
        ? "low"
        : "medium",
  }
}

export function getMonthName(month: number): string {
  const names = ["", "Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười một", "Chạp"]
  return names[month] || `Tháng ${month}`
}

export function getSeasonName(month: number): string {
  if (month >= 1 && month <= 3) return "Xuân"
  if (month >= 4 && month <= 6) return "Hạ"
  if (month >= 7 && month <= 9) return "Thu"
  return "Đông"
}

export function getEarthlyBranch(hour: number): string {
  const branches = [
    { name: "Tý", range: "23:00-01:00", start: 23, end: 1 },
    { name: "Sửu", range: "01:00-03:00", start: 1, end: 3 },
    { name: "Dần", range: "03:00-05:00", start: 3, end: 5 },
    { name: "Mão", range: "05:00-07:00", start: 5, end: 7 },
    { name: "Thìn", range: "07:00-09:00", start: 7, end: 9 },
    { name: "Tỵ", range: "09:00-11:00", start: 9, end: 11 },
    { name: "Ngọ", range: "11:00-13:00", start: 11, end: 13 },
    { name: "Mùi", range: "13:00-15:00", start: 13, end: 15 },
    { name: "Thân", range: "15:00-17:00", start: 15, end: 17 },
    { name: "Dậu", range: "17:00-19:00", start: 17, end: 19 },
    { name: "Tuất", range: "19:00-21:00", start: 19, end: 21 },
    { name: "Hợi", range: "21:00-23:00", start: 21, end: 23 },
  ]

  for (const branch of branches) {
    if (branch.start > branch.end) {
      if (hour >= branch.start || hour < branch.end) return `${branch.name} (${branch.range})`
    } else {
      if (hour >= branch.start && hour < branch.end) return `${branch.name} (${branch.range})`
    }
  }
  return "Tý (23:00-01:00)"
}
