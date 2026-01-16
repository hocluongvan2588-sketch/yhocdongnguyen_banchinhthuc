import { getHexagramName } from "./data/hexagram-data"
import { calculatePlumBlossom } from "./plum-blossom-calculations"
import type { PlumBlossomInput, PlumBlossomResult } from "./plum-blossom-calculations"

export interface DivinationInput {
  year: number
  month: number
  day: number
  hour: number
  minute?: number // Thêm phút vào input
}

export interface DivinationResult {
  upperTrigram: number
  lowerTrigram: number
  movingLine: number
  hexagramName: string
}

export function calculateHexagram(input: DivinationInput): DivinationResult {
  const { year, month, day, hour, minute = 0 } = input

  // Quẻ Thượng: (Năm + Tháng + Ngày) % 8, dư 0 lấy 8
  const upperSum = year + month + day
  const upperTrigram = upperSum % 8 === 0 ? 8 : upperSum % 8

  // Quẻ Hạ: (Năm + Tháng + Ngày + Giờ) % 8, dư 0 lấy 8
  const lowerSum = year + month + day + hour
  const lowerTrigram = lowerSum % 8 === 0 ? 8 : lowerSum % 8

  // Thêm phút để đa dạng hóa kết quả hào động
  const movingSum = year + month + day + hour + minute
  const movingLine = movingSum % 6 === 0 ? 6 : movingSum % 6

  const hexagramName = getHexagramName(upperTrigram, lowerTrigram)

  return {
    upperTrigram,
    lowerTrigram,
    movingLine,
    hexagramName,
  }
}

export { calculatePlumBlossom }
export type { DivinationInput, DivinationResult, PlumBlossomInput, PlumBlossomResult }
