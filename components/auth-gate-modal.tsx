"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Lock, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AuthGateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string // URL để redirect sau khi đăng nhập
}

export function AuthGateModal({ open, onOpenChange, redirectTo }: AuthGateModalProps) {
  const router = useRouter()
  
  // Lưu redirect URL vào sessionStorage trước khi chuyển trang
  const handleRedirect = (path: string) => {
    const targetRedirect = redirectTo || window.location.pathname + window.location.search
    sessionStorage.setItem('auth-redirect-url', targetRedirect)
    onOpenChange(false)
    router.push(`${path}?redirectTo=${encodeURIComponent(targetRedirect)}`)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-xl">Yêu cầu đăng nhập</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="sr-only">
            Yêu cầu đăng nhập để sử dụng tính năng gieo quẻ
          </AlertDialogDescription>
          <div className="text-base space-y-3">
            <p>Bạn cần đăng nhập để sử dụng tính năng gieo quẻ Mai Hoa Dịch Số.</p>

            <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-foreground text-sm">Lợi ích khi đăng ký:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Lưu lịch sử gieo quẻ</li>
                <li>✓ Truy cập kết quả mọi lúc mọi nơi</li>
                <li>✓ Nhận gợi ý phác đồ chăm sóc</li>
                <li>✓ Theo dõi tiến trình sức khỏe</li>
              </ul>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="sm:flex-1 bg-transparent"
            onClick={() => handleRedirect("/auth/login")}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Đăng nhập
          </Button>
          <AlertDialogAction
            className="sm:flex-1"
            onClick={() => handleRedirect("/auth/register")}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Đăng ký ngay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
