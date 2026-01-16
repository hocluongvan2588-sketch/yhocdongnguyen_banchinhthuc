import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface BodyUseAnalysisProps {
  bodyElement: string
  useElement: string
  bodyOrganSimple: string
  useOrganSimple: string
  relation: string
  relationExplanation: string
}

export function BodyUseAnalysis({
  bodyElement,
  useElement,
  bodyOrganSimple,
  useOrganSimple,
  relation,
  relationExplanation,
}: BodyUseAnalysisProps) {
  const getRelationIcon = (rel: string) => {
    if (rel.includes("sinh")) {
      return <TrendingUp className="w-6 h-6" />
    }
    if (rel.includes("khắc")) {
      return <TrendingDown className="w-6 h-6" />
    }
    return <Minus className="w-6 h-6" />
  }

  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      Mộc: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      Hỏa: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      Thổ: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
      Kim: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
      Thủy: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    }
    return colors[element] || ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Phân tích Thể-Dụng (体用分析)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <div className="flex flex-col items-center gap-3 flex-1 w-full">
            <div className="text-base md:text-lg font-medium text-muted-foreground">Quẻ Thể (Cơ thể)</div>
            <Badge className={`text-xl md:text-2xl px-6 py-3 ${getElementColor(bodyElement)}`}>
              {bodyElement} ({bodyOrganSimple})
            </Badge>
          </div>

          <div className="flex flex-col items-center gap-2">
            {getRelationIcon(relation)}
            <div className="text-sm md:text-base font-semibold text-center max-w-[120px]">{relation}</div>
          </div>

          <div className="flex flex-col items-center gap-3 flex-1 w-full">
            <div className="text-base md:text-lg font-medium text-muted-foreground">Quẻ Dụng (Ngoại cảnh)</div>
            <Badge className={`text-xl md:text-2xl px-6 py-3 ${getElementColor(useElement)}`}>
              {useElement} ({useOrganSimple})
            </Badge>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-5">
          <p className="text-base md:text-lg leading-relaxed">{relationExplanation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
