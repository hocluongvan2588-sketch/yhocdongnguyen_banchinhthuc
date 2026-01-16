"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Circle } from "lucide-react"

interface ModernElementsDisplayProps {
  bodyElement: string
  useElement: string
  bodyOrganSimple: string
  useOrganSimple: string
  relation: string
  relationExplanation: string
}

const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Mộc: { bg: "bg-green-50", text: "text-green-700", border: "border-green-300" },
  Hỏa: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
  Thổ: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-300" },
  Kim: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-300" },
  Thủy: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-300" },
}

export function ModernElementsDisplay({
  bodyElement,
  useElement,
  bodyOrganSimple,
  useOrganSimple,
  relation,
  relationExplanation,
}: ModernElementsDisplayProps) {
  const bodyColor = ELEMENT_COLORS[bodyElement] || ELEMENT_COLORS.Mộc
  const useColor = ELEMENT_COLORS[useElement] || ELEMENT_COLORS.Mộc

  return (
    <Card className="border border-border/50 shadow-md min-w-0">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl break-words">Phân Tích Thể - Dụng</CardTitle>
        <p className="text-sm text-muted-foreground break-words">Quan hệ giữa cơ thể và môi trường</p>
      </CardHeader>
      <CardContent className="space-y-6 min-w-0">
        {/* Visual relationship */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-0">
          <div className="flex-1 w-full min-w-0">
            <div className={`${bodyColor.bg} ${bodyColor.border} border-2 rounded-lg p-6 text-center space-y-2`}>
              <Circle className={`w-8 h-8 mx-auto ${bodyColor.text}`} fill="currentColor" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Thể Quẻ (Cơ thể)</p>
                <p className={`text-2xl font-bold ${bodyColor.text} mt-1`}>{bodyElement}</p>
                <p className="text-base text-foreground mt-1 break-words">{bodyOrganSimple}</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <ArrowRight className="w-6 h-6 text-muted-foreground md:rotate-0 rotate-90" />
          </div>

          <div className="flex-1 w-full min-w-0">
            <div className={`${useColor.bg} ${useColor.border} border-2 rounded-lg p-6 text-center space-y-2`}>
              <Circle className={`w-8 h-8 mx-auto ${useColor.text}`} fill="currentColor" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Dụng Quẻ (Môi trường)</p>
                <p className={`text-2xl font-bold ${useColor.text} mt-1`}>{useElement}</p>
                <p className="text-base text-foreground mt-1 break-words">{useOrganSimple}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Relationship explanation */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            <Badge variant="default" className="mt-0.5 flex-shrink-0">
              Quan hệ
            </Badge>
            <div className="flex-1 space-y-2 min-w-0">
              <p className="text-base font-semibold text-foreground break-words">{relation}</p>
              <p className="text-base text-muted-foreground leading-relaxed break-words">{relationExplanation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
