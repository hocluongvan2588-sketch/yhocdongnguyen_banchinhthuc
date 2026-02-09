// File này chỉ để export các config nếu cần custom

export const AI_CONFIG = {
  model: "openai/gpt-4o-mini", // Default model qua Vercel AI Gateway
  temperature: 0.7,
  maxTokens: 1200, // Giảm từ 2000 xuống 1200
  cacheEnabled: true, // Enable caching
  cacheDuration: 5 * 60 * 1000, // 5 phút
}

// Có thể thêm các models khác nếu user muốn
export const AVAILABLE_MODELS = {
  "gpt-4o-mini": "openai/gpt-4o-mini",
  "gpt-4": "openai/gpt-4",
  "claude-sonnet": "anthropic/claude-sonnet-4",
  "gemini-flash": "google/gemini-2.0-flash",
} as const

export function estimateCost(inputTokens: number, outputTokens: number): number {
  const INPUT_COST = 0.15 / 1_000_000 // $0.15 per 1M tokens
  const OUTPUT_COST = 0.6 / 1_000_000 // $0.60 per 1M tokens
  return inputTokens * INPUT_COST + outputTokens * OUTPUT_COST
}

export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English, 1.5 chars for Vietnamese
  return Math.ceil(text.length / 2)
}
