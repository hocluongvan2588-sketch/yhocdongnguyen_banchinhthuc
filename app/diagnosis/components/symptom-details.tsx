import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle, Leaf } from "lucide-react"
import type { DetailedInterpretation } from "@/lib/diagnosis/interpretation-logic"

interface SymptomDetailsProps {
  interpretation: DetailedInterpretation
}

export function SymptomDetails({ interpretation }: SymptomDetailsProps) {
  if (!interpretation.symptoms || interpretation.symptoms.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Chi tiết Triệu chứng & Nguyên nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {interpretation.imbalanceLocation && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg md:text-xl font-semibold">Vị trí mất cân bằng</AlertTitle>
            <AlertDescription className="text-base md:text-lg leading-relaxed mt-2">
              {interpretation.imbalanceDetail}
            </AlertDescription>
          </Alert>
        )}

        {interpretation.symptoms && interpretation.symptoms.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Các triệu chứng có thể gặp
            </h3>
            <ul className="space-y-3">
              {interpretation.symptoms.map((symptom, i) => (
                <li key={i} className="flex items-start gap-3 text-base md:text-lg">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {interpretation.causes && interpretation.causes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Nguyên nhân thường gặp
            </h3>
            <ul className="space-y-3">
              {interpretation.causes.map((cause, i) => (
                <li key={i} className="flex items-start gap-3 text-base md:text-lg">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {interpretation.consequences && interpretation.consequences.length > 0 && (
          <Alert>
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg md:text-xl font-semibold">Hệ quả nếu không điều trị</AlertTitle>
            <AlertDescription className="mt-3">
              <ul className="space-y-2">
                {interpretation.consequences.map((consequence, i) => (
                  <li key={i} className="text-base md:text-lg leading-relaxed">
                    • {consequence}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-5">
          <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-primary" />
            Lời khuyên ban đầu
          </h3>
          <p className="text-base md:text-lg leading-relaxed">{interpretation.advice}</p>
        </div>
      </CardContent>
    </Card>
  )
}
