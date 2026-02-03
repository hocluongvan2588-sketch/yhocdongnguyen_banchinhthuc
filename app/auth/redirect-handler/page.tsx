"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

/**
 * Trang này xử lý redirect sau khi đăng nhập
 * Đọc URL redirect từ sessionStorage và chuyển hướng đến đó
 * Nếu không có URL, chuyển về trang chủ
 */
export default function RedirectHandlerPage() {
  const router = useRouter()

  useEffect(() => {
    // Đọc redirect URL từ sessionStorage
    const redirectUrl = sessionStorage.getItem("auth-redirect-url")
    
    // Xóa sau khi đọc để tránh redirect loop
    sessionStorage.removeItem("auth-redirect-url")
    
    // Redirect đến URL đã lưu hoặc trang chủ
    if (redirectUrl && redirectUrl !== "/auth/redirect-handler") {
      router.replace(redirectUrl)
    } else {
      router.replace("/")
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    </div>
  )
}
