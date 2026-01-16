import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, AlertTriangle, CheckCircle2 } from "lucide-react"
import { getMonthName, getSeasonName } from "@/lib/diagnosis/seasonal-calculations"

interface SeasonalAnalysisProps {
  seasonElement: string
  bodyStrength: string
  useStrength: string
  dangerousMonths: number[]
  safeMonths: number[]
  recoveryMonths: number[]
  currentMonthRisk: string
  currentMonth: number
}

export function SeasonalAnalysis({
  seasonElement,
  bodyStrength,
  useStrength,
  dangerousMonths,
  safeMonths,
  recoveryMonths,
  currentMonthRisk,
  currentMonth,
}: SeasonalAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Phân tích theo Mùa (Thời điểm quan trọng)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant={currentMonthRisk === "high" ? "destructive" : "default"}>
          <AlertTitle className="text-lg md:text-xl font-semibold">Tháng hiện tại</AlertTitle>
          <AlertDescription className="text-base md:text-lg leading-relaxed mt-2">
            Mùa {getSeasonName(currentMonth)} (Tháng {getMonthName(currentMonth)}) - Ngũ hành {seasonElement} vượng.
            <br />
            Quẻ Thể ({bodyStrength}), Quẻ Dụng ({useStrength}).
          </AlertDescription>
        </Alert>

        {dangerousMonths.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Các tháng cần cẩn thận
            </h3>
            <div className="flex flex-wrap gap-2">
              {dangerousMonths.map((m) => (
                <Badge key={m} variant="destructive" className="text-base px-3 py-1">
                  {getMonthName(m)}
                </Badge>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Trong các tháng này, Dụng quẻ được tăng cường, cần chú ý sức khỏe, tránh làm việc quá sức.
            </p>
          </div>
        )}

        {safeMonths.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              Các tháng thuận lợi
            </h3>
            <div className="flex flex-wrap gap-2">
              {safeMonths.map((m) => (
                <Badge key={m} variant="secondary" className="text-base px-3 py-1">
                  {getMonthName(m)}
                </Badge>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Các tháng này Thể quẻ được hỗ trợ, là thời điểm tốt để điều trị và phục hồi.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
