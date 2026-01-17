"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, Calendar, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DuplicateQuestionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue: () => void
  previousDate: string
  similarity: number
  question: string
}

export function DuplicateQuestionModal({
  open,
  onOpenChange,
  onContinue,
  previousDate,
  similarity,
  question,
}: DuplicateQuestionModalProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 24) {
      return `hôm nay lúc ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffHours < 48) {
      return `hôm qua lúc ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <AlertDialogTitle className="text-xl">Câu hỏi tương tự đã gieo</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-4">
            <div className="flex items-start gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 mt-1 flex-shrink-0" />
              <span>
                Bạn đã gieo quẻ về vấn đề này{" "}
                <strong className="text-foreground">{formatDate(Number(previousDate))}</strong>
              </span>
            </div>

            <Alert className="border-amber-500/30 bg-amber-500/5">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-sm">
                <strong className="text-foreground">Lưu ý về Mai Hoa Dịch Số:</strong>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Cùng một vấn đề không nên hỏi nhiều lần trong ngày</li>
                  <li>• Mỗi thời điểm có năng lượng vũ trụ khác nhau</li>
                  <li>• Kết quả gieo lại có thể khác, gây nhầm lẫn</li>
                  <li>• Nên tin tưởng vào quẻ đầu tiên</li>
                </ul>
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground italic">
              Độ tương đồng: <strong className="text-foreground">{Math.round(similarity * 100)}%</strong>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="sm:flex-1">Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue} className="sm:flex-1 bg-primary">
            Vẫn tiếp tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
