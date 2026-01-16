import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react"
import type { DetailedInterpretation } from "@/lib/diagnosis/interpretation-logic"

interface DiagnosisSummaryProps {
  interpretation: DetailedInterpretation
}

export function DiagnosisSummary({ interpretation }: DiagnosisSummaryProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "destructive"
      case "moderate":
        return "default"
      case "mild":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getSeverityIcon = (status: string) => {
    switch (status) {
      case "bad":
        return <AlertTriangle className="h-6 w-6" />
      case "warning":
        return <AlertCircle className="h-6 w-6" />
      case "good":
        return <CheckCircle2 className="h-6 w-6" />
      default:
        return <Info className="h-6 w-6" />
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-2xl md:text-3xl font-bold leading-tight">{interpretation.title}</CardTitle>
          <Badge variant={getSeverityColor(interpretation.severity)} className="text-base px-3 py-1 flex-shrink-0">
            {interpretation.severityLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant={interpretation.status === "bad" ? "destructive" : "default"} className="border-2">
          <div className="flex items-start gap-3">
            {getSeverityIcon(interpretation.status)}
            <div className="flex-1">
              <AlertTitle className="text-xl md:text-2xl font-bold mb-3">Kết luận chính</AlertTitle>
              <AlertDescription className="text-lg md:text-xl leading-relaxed">
                {interpretation.summarySimple}
              </AlertDescription>
            </div>
          </div>
        </Alert>

        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <h3 className="text-xl md:text-2xl font-semibold">Giải thích chi tiết</h3>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">{interpretation.summary}</p>
          <p className="text-base md:text-lg leading-relaxed">{interpretation.healthDetail}</p>
        </div>

        {interpretation.concernAnalysis && (
          <Alert>
            <Info className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Phân tích triệu chứng của bạn</AlertTitle>
            <AlertDescription className="text-base md:text-lg leading-relaxed mt-2">
              <span className="font-semibold text-primary">"{interpretation.concernAnalysis.keyword}"</span> →{" "}
              {interpretation.concernAnalysis.info.description}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
