type PendingRequest = {
  promise: Promise<any>
  timestamp: number
}

const pendingRequests = new Map<string, PendingRequest>()
const REQUEST_TIMEOUT = 30000 // 30 seconds

export function deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  // Check if there's already a pending request with this key
  const existing = pendingRequests.get(key)

  if (existing) {
    const age = Date.now() - existing.timestamp
    if (age < REQUEST_TIMEOUT) {
      console.log("[v0] Deduplicating request:", key)
      return existing.promise
    } else {
      // Request timeout, remove it
      pendingRequests.delete(key)
    }
  }

  // Create new request
  const promise = requestFn().finally(() => {
    // Cleanup after request completes
    setTimeout(() => pendingRequests.delete(key), 1000)
  })

  pendingRequests.set(key, {
    promise,
    timestamp: Date.now(),
  })

  return promise
}

export function clearPendingRequests() {
  pendingRequests.clear()
}
