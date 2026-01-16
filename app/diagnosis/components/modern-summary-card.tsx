"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react"
import type { DetailedInterpretation } from "@/lib/diagnosis/interpretation-logic"

interface ModernSummaryCardProps {
  interpretation: DetailedInterpretation
}

export function ModernSummaryCard({ interpretation }: ModernSummaryCardProps) {
  const getStatusIcon = () => {
    switch (interpretation.status) {
      case "good":
        return <CheckCircle2 className="w-6 h-6 text-jade flex-shrink-0" />
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0" />
      case "bad":
        return <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
      default:
        return <Info className="w-6 h-6 text-primary flex-shrink-0" />
    }
  }

  const getStatusColor = () => {
    switch (interpretation.status) {
      case "good":
        return "bg-jade/10 border-jade/30"
      case "warning":
        return "bg-accent/10 border-accent/30"
      case "bad":
        return "bg-destructive/10 border-destructive/30"
      default:
        return "bg-primary/10 border-primary/30"
    }
  }

  const getSeverityBadge = () => {
    const severity = interpretation.severity || "mild"
    const severityLabel = interpretation.severityLabel || "Nhẹ"

    const variants: Record<string, { bg: string; text: string; label: string }> = {
      mild: { bg: "bg-jade/15", text: "text-jade", label: severityLabel },
      moderate: { bg: "bg-accent/15", text: "text-accent", label: severityLabel },
      severe: { bg: "bg-destructive/15", text: "text-destructive", label: severityLabel },
    }
    const variant = variants[severity]

    if (!variant) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground whitespace-nowrap flex-shrink-0">
          {severityLabel}
        </span>
      )
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variant.bg} ${variant.text} whitespace-nowrap flex-shrink-0`}
      >
        {variant.label}
      </span>
    )
  }

  const renderMarkdown = (text: string) => {
    if (!text) return null

    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return (
      <span className="whitespace-normal">
        {parts.map((part, index) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={index} className="font-bold">
                {part.slice(2, -2)}
              </strong>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </span>
    )
  }

  return (
    <Card className={`border-2 ${getStatusColor()} shadow-lg`}>
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{getStatusIcon()}</div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-normal break-words">
                {interpretation.title}
              </h2>
              {getSeverityBadge()}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-normal break-words">
              {renderMarkdown(interpretation.summarySimple)}
            </p>
          </div>
        </div>

        <Alert className="border-l-4 border-l-primary">
          <AlertTitle className="text-lg font-semibold mb-2 whitespace-normal">Phân tích chi tiết</AlertTitle>
          <AlertDescription className="text-base leading-relaxed space-y-2 whitespace-normal break-words">
            <p className="whitespace-normal">{renderMarkdown(interpretation.summary)}</p>
            {interpretation.healthDetail && (
              <div className="text-muted-foreground space-y-3">
                {interpretation.healthDetail.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="leading-relaxed whitespace-normal break-words">
                    {renderMarkdown(paragraph)}
                  </p>
                ))}
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
          <p className="text-sm font-medium text-muted-foreground mb-1 whitespace-normal">Tiên lượng:</p>
          <p className="text-base font-medium text-foreground whitespace-normal break-words">
            {renderMarkdown(interpretation.prognosis)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
