// 梅花易数 calculation engine with Body-Use theory

import {
  getTrigramByNumber,
  determineBodyUseRelation,
  interpretBodyUseRelation,
  BodyUseRelation,
  SEASONAL_PROSPERITY,
  WU_XING_RELATIONS,
} from "./data/plum-blossom-data"
import { getHexagramByTrigrams } from "./data/hexagram-data"

export interface PlumBlossomInput {
  year: number
  month: number
  day: number
  hour: number
  method?: string // Divination method used
}

export interface PlumBlossomResult {
  // Basic hexagram info
  upperTrigram: number
  lowerTrigram: number
  movingLine: number
  hexagramName: string

  // Body and Use hexagrams
  bodyTrigram: number // 体卦
  useTrigram: number // 用卦
  mutualUpperTrigram: number // 互卦上
  mutualLowerTrigram: number // 互卦下
  changeTrigram: number // 变卦

  // Elements
  bodyElement: string
  useElement: string

  // Relationship analysis
  bodyUseRelation: BodyUseRelation
  relationInterpretation: {
    marriage: string
    career: string
    wealth: string
    health: string
  }

  // Seasonal analysis
  season: string
  bodyProsperity: "旺" | "衰" | "平"
  useProsperity: "旺" | "衰" | "平"

  // Detailed trigram info
  bodyTrigramInfo: any
  useTrigramInfo: any

  // Overall judgment
  overallJudgment: string
  favorableAspects: string[]
  unfavorableAspects: string[]
}

export function calculatePlumBlossom(input: PlumBlossomInput): PlumBlossomResult {
  const { year, month, day, hour } = input

  // 1. Calculate basic hexagram (本卦)
  const upperSum = year + month + day
  const upperTrigram = upperSum % 8 === 0 ? 8 : upperSum % 8

  const lowerSum = year + month + day + hour
  const lowerTrigram = lowerSum % 8 === 0 ? 8 : lowerSum % 8

  const movingLine = lowerSum % 6 === 0 ? 6 : lowerSum % 6

  // 2. Determine Body and Use hexagrams (体卦、用卦)
  // The hexagram with moving line is Use, the other is Body
  const bodyTrigram = upperTrigram // 上卦为体
  const useTrigram = lowerTrigram // 下卦为用

  // In traditional method: if moving line is in upper (4-6), upper is use
  // if moving line is in lower (1-3), lower is use
  // For simplicity, we use: lower trigram contains moving line

  // 3. Calculate Mutual hexagrams (互卦)
  // Mutual hexagrams are derived from lines 2,3,4 (upper) and 3,4,5 (lower)
  // Simplified: we take adjacent trigrams
  const mutualUpperTrigram = lowerTrigram
  const mutualLowerTrigram = upperTrigram

  // 4. Calculate Change hexagram (变卦)
  // After the moving line changes, we get a new trigram
  let changeTrigram = useTrigram
  if (movingLine >= 1 && movingLine <= 3) {
    // Lower trigram changes
    changeTrigram = (useTrigram % 8) + 1
    if (changeTrigram > 8) changeTrigram = 1
  }

  // 5. Get hexagram name
  const hexagram = getHexagramByTrigrams(upperTrigram, lowerTrigram)
  const hexagramName = hexagram ? hexagram.vietnamese : `Quẻ ${upperTrigram}-${lowerTrigram}`

  // 6. Get trigram elements
  const bodyTrigramInfo = getTrigramByNumber(bodyTrigram)
  const useTrigramInfo = getTrigramByNumber(useTrigram)

  const bodyElement = bodyTrigramInfo?.element || "Thổ"
  const useElement = useTrigramInfo?.element || "Thổ"

  // 7. Analyze Body-Use relationship
  const bodyUseRelation = determineBodyUseRelation(bodyElement, useElement)

  const relationInterpretation = {
    marriage: interpretBodyUseRelation(bodyUseRelation, "marriage"),
    career: interpretBodyUseRelation(bodyUseRelation, "career"),
    wealth: interpretBodyUseRelation(bodyUseRelation, "wealth"),
    health: interpretBodyUseRelation(bodyUseRelation, "health"),
  }

  // 8. Determine season and prosperity
  const season = determineSeason(month)
  const bodyProsperity = determineTrigramProsperity(bodyTrigramInfo?.vietnamese || "", season)
  const useProsperity = determineTrigramProsperity(useTrigramInfo?.vietnamese || "", season)

  // 9. Overall judgment
  const { overallJudgment, favorableAspects, unfavorableAspects } = generateOverallJudgment(
    bodyUseRelation,
    bodyProsperity,
    useProsperity,
    bodyElement,
    useElement,
  )

  return {
    upperTrigram,
    lowerTrigram,
    movingLine,
    hexagramName,
    bodyTrigram,
    useTrigram,
    mutualUpperTrigram,
    mutualLowerTrigram,
    changeTrigram,
    bodyElement,
    useElement,
    bodyUseRelation,
    relationInterpretation,
    season,
    bodyProsperity,
    useProsperity,
    bodyTrigramInfo,
    useTrigramInfo,
    overallJudgment,
    favorableAspects,
    unfavorableAspects,
  }
}

function determineSeason(month: number): string {
  if (month >= 2 && month <= 4) return "Xuân"
  if (month >= 5 && month <= 7) return "Hạ"
  if (month >= 8 && month <= 10) return "Thu"
  if (month === 11 || month === 12 || month === 1) return "Đông"
  // 辰戌丑未月 (3, 6, 9, 12)
  if (month % 3 === 0) return "Tứ mùa"
  return "Xuân"
}

function determineTrigramProsperity(trigramName: string, season: string): "旺" | "衰" | "平" {
  const seasonInfo = SEASONAL_PROSPERITY[season]
  if (!seasonInfo) return "平"

  if (seasonInfo.prosperous.includes(trigramName)) return "旺"
  if (seasonInfo.declining.includes(trigramName)) return "衰"
  return "平"
}

function generateOverallJudgment(
  relation: BodyUseRelation,
  bodyProsperity: string,
  useProsperity: string,
  bodyElement: string,
  useElement: string,
): {
  overallJudgment: string
  favorableAspects: string[]
  unfavorableAspects: string[]
} {
  const favorable: string[] = []
  const unfavorable: string[] = []
  let judgment = ""

  // Analyze Body-Use relationship
  switch (relation) {
    case BodyUseRelation.BODY_USE_HARMONY:
      judgment = "Thể Dụng tỷ hòa, đại cát đại lợi, mọi việc hanh thông"
      favorable.push("Thể Dụng tỷ hòa - quan hệ hài hòa")
      break
    case BodyUseRelation.USE_GENERATES_BODY:
      judgment = "Dụng sinh Thể, có tiến ích chi hỷ, dễ thành công"
      favorable.push("Dụng sinh Thể - có quý nhân phù trợ")
      break
    case BodyUseRelation.BODY_CONQUERS_USE:
      judgment = "Thể khắc Dụng, sự việc có thể thành, nhưng cần thời gian"
      favorable.push("Thể khắc Dụng - có thể kiểm soát tình hình")
      break
    case BodyUseRelation.BODY_GENERATES_USE:
      judgment = "Thể sinh Dụng, có hao tán chi ưu, nên cẩn trọng"
      unfavorable.push("Thể sinh Dụng - tốn kém công sức tài lực")
      break
    case BodyUseRelation.USE_CONQUERS_BODY:
      judgment = "Dụng khắc Thể, bất lợi, sự việc khó thành"
      unfavorable.push("Dụng khắc Thể - gặp trở ngại lớn")
      break
  }

  // Analyze prosperity
  if (bodyProsperity === "旺") {
    favorable.push("Thể quẻ đắc thời - vượng tướng")
    judgment += ". Thể quẻ vượng tướng, thêm cát lợi"
  } else if (bodyProsperity === "衰") {
    unfavorable.push("Thể quẻ thất thời - suy yếu")
    judgment += ". Thể quẻ suy yếu, cần chú ý"
  }

  // Analyze element generation/conquest with other factors
  const bodyRelation = WU_XING_RELATIONS[bodyElement]
  if (bodyRelation) {
    favorable.push(`${bodyElement} được ${bodyRelation.generatedBy} sinh trợ`)
    unfavorable.push(`Cẩn phòng ${bodyRelation.conqueredBy} khắc hại`)
  }

  return {
    overallJudgment: judgment,
    favorableAspects: favorable,
    unfavorableAspects: unfavorable,
  }
}

// Export updated calculation function for compatibility
export function calculateHexagram(input: PlumBlossomInput) {
  const result = calculatePlumBlossom(input)
  return {
    upperTrigram: result.upperTrigram,
    lowerTrigram: result.lowerTrigram,
    movingLine: result.movingLine,
    hexagramName: result.hexagramName,
  }
}

export interface BodyUseAnalysis {
  bodyTrigram: string
  useTrigram: string
  bodyElement: string
  useElement: string
  relationship: string
  marriageInterpretation: string
  careerInterpretation: string
  healthInterpretation: string
}

export function analyzeBodyUse(upperTrigramNum: number, lowerTrigramNum: number, movingLine: number): BodyUseAnalysis {
  const upperTrigram = getTrigramByNumber(upperTrigramNum)
  const lowerTrigram = getTrigramByNumber(lowerTrigramNum)

  // Determine body and use based on moving line position
  // If moving line is 1-3 (lower), lower trigram is Use, upper is Body
  // If moving line is 4-6 (upper), upper trigram is Use, lower is Body
  const isLowerMoving = movingLine >= 1 && movingLine <= 3

  const bodyTrigram = isLowerMoving ? upperTrigram : lowerTrigram
  const useTrigram = isLowerMoving ? lowerTrigram : upperTrigram

  const bodyElement = bodyTrigram?.element || "Thổ"
  const useElement = useTrigram?.element || "Thổ"

  // Determine relationship
  const relation = determineBodyUseRelation(bodyElement, useElement)
  let relationshipText = ""

  switch (relation) {
    case BodyUseRelation.BODY_USE_HARMONY:
      relationshipText = `${bodyElement} và ${useElement} tỷ hòa - quan hệ hài hòa, mọi việc hanh thông`
      break
    case BodyUseRelation.USE_GENERATES_BODY:
      relationshipText = `${useElement} sinh ${bodyElement} - Dụng sinh Thể, có quý nhân phù trợ, dễ thành công`
      break
    case BodyUseRelation.BODY_GENERATES_USE:
      relationshipText = `${bodyElement} sinh ${useElement} - Thể sinh Dụng, có hao tán, cần cẩn trọng`
      break
    case BodyUseRelation.BODY_CONQUERS_USE:
      relationshipText = `${bodyElement} khắc ${useElement} - Thể khắc Dụng, có thể kiểm soát, nhưng cần thời gian`
      break
    case BodyUseRelation.USE_CONQUERS_BODY:
      relationshipText = `${useElement} khắc ${bodyElement} - Dụng khắc Thể, bất lợi, gặp trở ngại`
      break
  }

  const marriageInterpretation = interpretBodyUseRelation(relation, "marriage")
  const careerInterpretation = interpretBodyUseRelation(relation, "career")
  const healthInterpretation = interpretBodyUseRelation(relation, "health")

  return {
    bodyTrigram: bodyTrigram?.vietnamese || "",
    useTrigram: useTrigram?.vietnamese || "",
    bodyElement,
    useElement,
    relationship: relationshipText,
    marriageInterpretation,
    careerInterpretation,
    healthInterpretation,
  }
}

export function getSeasonalStrength(element: string, date: Date): "vượng" | "suy" | "bình" {
  const month = date.getMonth() + 1 // JavaScript months are 0-indexed
  const season = determineSeason(month)

  // Determine which trigram corresponds to this element
  // We need to check which trigram has this element
  let trigramName = ""
  const trigrams = [
    getTrigramByNumber(1),
    getTrigramByNumber(2),
    getTrigramByNumber(3),
    getTrigramByNumber(4),
    getTrigramByNumber(5),
    getTrigramByNumber(6),
    getTrigramByNumber(7),
    getTrigramByNumber(8),
  ]

  for (const trigram of trigrams) {
    if (trigram?.element === element) {
      trigramName = trigram.vietnamese
      break
    }
  }

  if (!trigramName) return "bình"

  const seasonInfo = SEASONAL_PROSPERITY[season]
  if (!seasonInfo) return "bình"

  if (seasonInfo.prosperous.includes(trigramName)) return "vượng"
  if (seasonInfo.declining.includes(trigramName)) return "suy"
  return "bình"
}
