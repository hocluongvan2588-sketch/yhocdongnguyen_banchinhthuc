import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { getEarthlyBranch } from "@/lib/diagnosis/seasonal-calculations"

interface DiagnosisHeaderProps {
  upperTrigramName: string
  lowerTrigramName: string
  hexagramName: string
  year?: string
  month?: string
  day?: string
  hour?: string
  minute?: string
  method: string
}

export function DiagnosisHeader({
  upperTrigramName,
  lowerTrigramName,
  hexagramName,
  year,
  month,
  day,
  hour,
  minute,
  method,
}: DiagnosisHeaderProps) {
  const earthlyBranch = hour ? getEarthlyBranch(Number.parseInt(hour)) : ""

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Kết Quả Chẩn Đoán</h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                {hexagramName} ({upperTrigramName} trên {lowerTrigramName})
              </p>
            </div>
            <Badge variant="outline" className="w-fit text-base px-4 py-2">
              {method === "time" ? "Phương pháp: Thời gian" : "Phương pháp: Số tự chọn"}
            </Badge>
          </div>

          {method === "time" && year && (
            <div className="flex flex-col sm:flex-row gap-4 text-base md:text-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">
                  Ngày: {day}/{month}/{year} (Âm lịch)
                </span>
              </div>
              {hour && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">
                    Giờ: {hour}:{minute || "00"} ({earthlyBranch})
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
