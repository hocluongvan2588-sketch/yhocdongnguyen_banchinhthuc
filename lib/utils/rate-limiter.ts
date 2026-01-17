export class ClientRateLimiter {
  private requests: number[] = []
  private limit: number
  private windowMs: number

  constructor(limit = 5, windowMs = 60000) {
    this.limit = limit
    this.windowMs = windowMs
  }

  canMakeRequest(): boolean {
    const now = Date.now()
    // Xóa requests cũ hơn window
    this.requests = this.requests.filter((time) => now - time < this.windowMs)

    if (this.requests.length >= this.limit) {
      return false
    }

    this.requests.push(now)
    return true
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length < this.limit) return 0

    const oldestRequest = Math.min(...this.requests)
    const timeUntilReset = this.windowMs - (Date.now() - oldestRequest)
    return Math.max(0, Math.ceil(timeUntilReset / 1000))
  }
}
