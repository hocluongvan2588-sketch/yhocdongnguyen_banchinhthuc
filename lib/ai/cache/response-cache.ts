import crypto from "crypto"

interface CachedResponse {
  response: any
  timestamp: number
  expiresAt: number // Added expiration time for flexible caching
}

const responseCache = new Map<string, CachedResponse>()
const RESPONSE_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 giờ

// Tạo cache key từ semantic data (bỏ qua thời gian, chỉ giữ ý nghĩa)
export function generateSemanticCacheKey(params: {
  upperTrigram: number
  lowerTrigram: number
  movingLine: number
  healthConcernNormalized: string // đã normalize
  transformedUpper: number
  transformedLower: number
}): string {
  const keyData = `${params.upperTrigram}-${params.lowerTrigram}-${params.movingLine}-${params.healthConcernNormalized}-${params.transformedUpper}-${params.transformedLower}`

  return crypto.createHash("md5").update(keyData).digest("hex")
}

export function normalizeHealthConcern(concern: string): string {
  return concern
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // normalize spaces
    .replace(/[.,!?;:]/g, "") // remove punctuation
}

export function getCachedResponse(cacheKey: string): any | null {
  const cached = responseCache.get(cacheKey)

  if (!cached) return null

  const now = Date.now()
  if (now > cached.expiresAt) {
    responseCache.delete(cacheKey)
    return null
  }

  return cached.response
}

export function setCachedResponse(cacheKey: string, response: any, cacheDuration?: number): void {
  const duration = cacheDuration || RESPONSE_CACHE_DURATION
  const now = Date.now()

  responseCache.set(cacheKey, {
    response,
    timestamp: now,
    expiresAt: now + duration,
  })

  // Cleanup old entries (giữ tối đa 1000 entries)
  if (responseCache.size > 1000) {
    const oldestKey = Array.from(responseCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, 100)
      .map(([key]) => key)

    oldestKey.forEach((key) => responseCache.delete(key))
  }
}

export function clearCache(): void {
  responseCache.clear()
}
