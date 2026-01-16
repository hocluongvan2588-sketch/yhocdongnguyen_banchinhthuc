// Core types for the Y Dich Dong Nguyen system
export interface DivinationInput {
  year: number
  month: number
  day: number
  hour: number // Zodiac hour (1-12)
}

export interface DivinationResult {
  upperTrigram: number // 1-8
  lowerTrigram: number // 1-8
  movingLine: number // 1-6
  hexagramName: string
}

export interface Trigram {
  number: number
  chinese: string
  vietnamese: string
  element: string // Kim, Mộc, Thủy, Hỏa, Thổ
  organ: string
  lines: [boolean, boolean, boolean] // true = solid line, false = broken line
}

export interface OrganDiagnosis {
  organ: string
  element: string
  condition: string
  description: string
  severity: "mild" | "moderate" | "severe"
}
