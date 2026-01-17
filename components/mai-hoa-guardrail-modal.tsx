"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Clock, Info, BookOpen } from "lucide-react"
import Link from "next/link"

interface MaiHoaGuardrailModalProps {
  isOpen: boolean
  onClose: () => void
  reason: string
  details?: {
    dailyLimit?: { remaining: number; total: number }
    spacing?: { minutesRemaining: number }
    duplicate?: {
      previousQuestion: {
        id: string
        created_at: string
        diagnosis_text: string
        hexagram_name: string
        similarity: number
      }
    }
  }
}

export function MaiHoaGuardrailModal({ isOpen, onClose, reason, details }: MaiHoaGuardrailModalProps) {
  const isDuplicate = details?.duplicate !== undefined
  const isSpacing = details?.spacing !== undefined
  const isDailyLimit = details?.dailyLimit !== undefined

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isDuplicate && <Info className="h-5 w-5 text-amber-500" />}
            {isSpacing && <Clock className="h-5 w-5 text-blue-500" />}
            {isDailyLimit && <AlertTriangle className="h-5 w-5 text-orange-500" />}
            <DialogTitle className="text-lg">Nguyên Tắc Mai Hoa Dịch Số</DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Thông báo về nguyên tắc gieo quẻ theo Mai Hoa Dịch Số
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main message */}
          <Alert className="border-amber-200 bg-amber-50">
            <BookOpen className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-900 whitespace-pre-line">{reason}</AlertDescription>
          </Alert>

          {/* Duplicate question - show previous result */}
          {isDuplicate && details.duplicate && (
            <div className="rounded-lg border bg-slate-50 p-4">
              <h4 className="font-medium text-sm mb-2">Kết quả trước đó:</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Câu hỏi:</span> {details.duplicate.previousQuestion.diagnosis_text}
                </p>
                <p>
                  <span className="font-medium">Quẻ:</span> {details.duplicate.previousQuestion.hexagram_name}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(details.duplicate.previousQuestion.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <Link href={`/consultation/${details.duplicate.previousQuestion.id}`}>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  Xem lại kết quả chi tiết →
                </Button>
              </Link>
            </div>
          )}

          {/* Spacing countdown */}
          {isSpacing && details.spacing && (
            <div className="text-center py-2">
              <div className="text-3xl font-bold text-blue-600">{details.spacing.minutesRemaining} phút</div>
              <p className="text-sm text-slate-600 mt-1">Vui lòng chờ để "khí" bình ổn</p>
            </div>
          )}

          {/* Daily limit info */}
          {isDailyLimit && details.dailyLimit && (
            <div className="text-center py-2">
              <div className="text-sm text-slate-600">
                Bạn đã sử dụng{" "}
                <span className="font-bold text-orange-600">
                  {details.dailyLimit.total - details.dailyLimit.remaining}/{details.dailyLimit.total}
                </span>{" "}
                lần gieo quẻ hôm nay
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button onClick={onClose} className="w-full">
              Tôi hiểu rồi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
