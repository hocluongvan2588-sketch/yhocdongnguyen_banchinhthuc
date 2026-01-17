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
