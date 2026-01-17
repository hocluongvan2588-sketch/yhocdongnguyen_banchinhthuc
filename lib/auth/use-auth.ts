"use client"

import { useState, useEffect, useCallback } from "react"
import { getCurrentUser } from "@/lib/actions/auth-actions"

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const { user } = await getCurrentUser()
    setUser(user)
    return user
  }, [])

  useEffect(() => {
    async function loadUser() {
      const { user } = await getCurrentUser()
      setUser(user)
      setLoading(false)
    }
    loadUser()
  }, [])

  return {
    user,
    loading,
    refreshUser, // Export refreshUser to allow components to refresh auth state
  }
}
