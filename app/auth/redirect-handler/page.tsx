"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

function RedirectHandlerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Ưu tiên đọc từ query params (được truyền từ auth callback)
    // vì sessionStorage có thể bị mất khi đi qua Google OAuth
    const queryRedirectUrl = searchParams.get("redirectTo")
    
    // Fallback: đọc từ sessionStorage
    const sessionRedirectUrl = sessionStorage.getItem("auth-redirect-url")
    
    // Xóa sessionStorage sau khi đọc để tránh redirect loop
    sessionStorage.removeItem("auth-redirect-url")
    
    // Quyết định URL redirect: ưu tiên query params > sessionStorage > trang chủ
    const redirectUrl = queryRedirectUrl || sessionRedirectUrl
    
    // Redirect đến URL đã lưu hoặc trang chủ
    if (redirectUrl && redirectUrl !== "/auth/redirect-handler") {
      router.replace(redirectUrl)
    } else {
      router.replace("/")
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    </div>
  )
}

/**
 * Trang này xử lý redirect sau khi đăng nhập
 * Ưu tiên đọc URL redirect từ query params (được truyền từ auth callback)
 * Fallback: đọc từ sessionStorage
 * Nếu không có URL, chuyển về trang chủ
 */
export default function RedirectHandlerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang chuyển hướng...</p>
        </div>
      </div>
    }>
      <RedirectHandlerContent />
    </Suspense>
  )
}
