// File này chỉ để export các config nếu cần custom

export const AI_CONFIG = {
  model: "openai/gpt-4o-mini", // Default model qua Vercel AI Gateway
  temperature: 0.7,
  maxTokens: 2000,
}

// Có thể thêm các models khác nếu user muốn
export const AVAILABLE_MODELS = {
  "gpt-4o-mini": "openai/gpt-4o-mini",
  "gpt-4": "openai/gpt-4",
  "claude-sonnet": "anthropic/claude-sonnet-4",
  "gemini-flash": "google/gemini-2.0-flash",
} as const
