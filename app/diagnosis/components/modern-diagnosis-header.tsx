"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Sparkles } from "lucide-react"

interface ModernDiagnosisHeaderProps {
  hexagramName: string
  year: string
  month: string
  day: string
  hour: string
  minute: string
}

export function ModernDiagnosisHeader({ hexagramName, year, month, day, hour, minute }: ModernDiagnosisHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-xl border border-border/50 p-8 md:p-10">
      {/* Decorative pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-primary to-transparent" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge variant="secondary" className="font-medium text-sm">
            Kết Quả Chẩn Đoán
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{hexagramName}</h1>

        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Dựa trên nguyên lý <strong className="text-foreground">Mai Hoa Dịch Số</strong> của Thiệu Khang Tiết, phân
          tích quan hệ Thể-Dụng và Ngũ Hành để đánh giá tình trạng sức khỏe.
        </p>

        {/* Timestamp */}
        {(year || month || day) && (
          <div className="flex flex-wrap gap-4 pt-3 text-sm text-muted-foreground">
            {(year || month || day) && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {year && `${year}/`}
                  {month && `${month.padStart(2, "0")}/`}
                  {day && day.padStart(2, "0")}
                </span>
              </div>
            )}
            {(hour || minute) && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {hour && hour.padStart(2, "0")}
                  {minute && `:${minute.padStart(2, "0")}`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
