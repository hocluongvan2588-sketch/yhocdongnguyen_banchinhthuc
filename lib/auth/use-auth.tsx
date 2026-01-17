"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { AuthGateModal } from "@/components/auth-gate-modal"

interface User {
  id: string
  email: string
  full_name?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthGateModal, setShowAuthGateModal] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { user } = await getCurrentUser()
      setUser(user as User | null)
      setIsLoading(false)
    }
    loadUser()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    showAuthGateModal,
    setShowAuthGateModal,
    AuthGateModal: () => <AuthGateModal open={showAuthGateModal} onOpenChange={setShowAuthGateModal} />,
  }
}
