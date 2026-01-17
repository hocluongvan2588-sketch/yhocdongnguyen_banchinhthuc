"use client"

import { useState, useEffect } from "react"
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
  }
}
