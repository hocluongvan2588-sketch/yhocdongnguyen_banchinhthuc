export interface SeasonalInfluence {
  favorableMonths: number[]
  unfavorableMonths: number[]
  currentInfluence: string
  explanation?: string
}

export interface ComprehensiveDiagnosisResult {
  bodyUseAnalysis: any
  affectedOrgans: any
  seasonalInfluence: SeasonalInfluence // Guaranteed structure
  movingLineEffect: any
  transformationGuidance: any
}

export type Gender = "male" | "female" | "other"
export type PainLocation = "left" | "right" | "center" | "whole" | "unspecified"
export type GeographicRegion = "north" | "south" | "central" | "coastal" | "highland" | "unspecified"

export interface UserAnthropometricData {
  gender: Gender
  age: number
  painLocation: PainLocation
  location: string // Tỉnh/thành phố
}
