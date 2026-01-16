"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, HeartPulse, AlertTriangle } from "lucide-react"
import type { DetailedInterpretation } from "@/lib/diagnosis/interpretation-logic"

interface ModernAdviceCardProps {
  interpretation: DetailedInterpretation
}

export function ModernAdviceCard({ interpretation }: ModernAdviceCardProps) {
  const hasSymptoms = interpretation.symptoms && interpretation.symptoms.length > 0
  const hasCauses = interpretation.causes && interpretation.causes.length > 0

  const renderAdviceText = (text: string) => {
    // Split by double newline for paragraphs
    const paragraphs = text.split("\n\n").filter(Boolean)

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, pIndex) => {
          // Check if it's a header line with **
          if (paragraph.match(/^\*\*[^*]+\*\*:?$/)) {
            const headerText = paragraph.replace(/\*\*/g, "").replace(/:$/, "").trim()
            return (
              <h3 key={pIndex} className="text-lg font-bold text-foreground mt-4 mb-2 whitespace-normal">
                {headerText}
              </h3>
            )
          }

          // Split lines but keep them together
          const lines = paragraph.split("\n").filter((line) => line.trim())

          return (
            <div key={pIndex} className="space-y-2">
              {lines.map((line, lIndex) => {
                const trimmedLine = line.trim()

                // Numbered list (1. 2. 3.)
                if (trimmedLine.match(/^\d+\.\s+/)) {
                  const content = trimmedLine.replace(/^\d+\.\s+/, "")
                  const number = trimmedLine.match(/^(\d+)\./)?.[1]

                  return (
                    <div key={lIndex} className="flex items-start gap-3 ml-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary mt-0.5">
                        {number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-base text-foreground leading-relaxed whitespace-normal break-words">
                          {renderInlineMarkdown(content)}
                        </p>
                      </div>
                    </div>
                  )
                }

                // Bullet list
                if (trimmedLine.match(/^[-•]\s+/)) {
                  const content = trimmedLine.replace(/^[-•]\s+/, "")

                  return (
                    <div key={lIndex} className="flex items-start gap-3 ml-2">
                      <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                      <p className="flex-1 min-w-0 text-base text-foreground leading-relaxed whitespace-normal break-words">
                        {renderInlineMarkdown(content)}
                      </p>
                    </div>
                  )
                }

                // Regular paragraph
                return (
                  <p key={lIndex} className="text-base text-foreground leading-relaxed whitespace-normal break-words">
                    {renderInlineMarkdown(trimmedLine)}
                  </p>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  if (!hasSymptoms && !interpretation.advice) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Symptoms */}
      {hasSymptoms && (
        <Card className="border border-destructive/30 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-destructive flex-shrink-0" />
              <CardTitle className="text-xl whitespace-normal">Các Triệu Chứng Có Thể Gặp</CardTitle>
            </div>
            {interpretation.imbalanceLocation && (
              <p className="text-sm text-muted-foreground mt-2 whitespace-normal break-words">
                Vị trí cần chú ý: <strong className="text-foreground">{interpretation.imbalanceLocation}</strong>
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {interpretation.imbalanceDetail && (
              <Alert variant="destructive" className="bg-destructive/5">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <AlertDescription className="text-base whitespace-normal break-words">
                  {renderInlineMarkdown(interpretation.imbalanceDetail)}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              {interpretation.symptoms.map((symptom, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg border border-border/50"
                >
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-destructive">{index + 1}</span>
                  </div>
                  <p className="text-base text-foreground flex-1 min-w-0 whitespace-normal break-words">{symptom}</p>
                </div>
              ))}
            </div>

            {hasCauses && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2 whitespace-normal">
                  Nguyên nhân thường gặp:
                </p>
                <ul className="space-y-1.5">
                  {interpretation.causes?.map((cause, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1 flex-shrink-0">•</span>
                      <span className="whitespace-normal break-words">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Advice */}
      <Card className="border border-jade/30 shadow-md bg-jade/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-jade flex-shrink-0" />
            <CardTitle className="text-xl whitespace-normal">Lời Khuyên Của Chuyên Gia</CardTitle>
          </div>
        </CardHeader>
        <CardContent>{renderAdviceText(interpretation.advice)}</CardContent>
      </Card>
    </div>
  )
}
