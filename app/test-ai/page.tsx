"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getDiagnosisWithAI } from "@/lib/ai/diagnosis-with-ai"
import { getDetailedInterpretation } from "@/lib/diagnosis/interpretation-logic"

export default function TestAIPage() {
  const router = useRouter()
  const [healthConcern, setHealthConcern] = useState("Đau đầu gối")
  const [hexagramNumber, setHexagramNumber] = useState("1")
  const [movingLine, setMovingLine] = useState("1")
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [isLoadingLogic, setIsLoadingLogic] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)
  const [logicResult, setLogicResult] = useState<any>(null)

  const testAI = async () => {
    setIsLoadingAI(true)
    try {
      const result = await getDiagnosisWithAI({
        hexagramNumber: Number.parseInt(hexagramNumber),
        upperTrigram: "Càn",
        lowerTrigram: "Càn",
        movingLine: Number.parseInt(movingLine),
        bodyElement: "Kim",
        useElement: "Kim",
        relationship: "Tỷ hòa",
        healthConcern,
        month: new Date().getMonth() + 1,
      })
      setAiResult(result)
    } catch (error) {
      console.error("[v0] AI test error:", error)
      setAiResult({ error: "Lỗi khi gọi AI: " + (error as Error).message })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const testLogic = async () => {
    setIsLoadingLogic(true)
    try {
      const result = getDetailedInterpretation(
        "Kim",
        "Kim",
        "Tỷ hòa",
        healthConcern,
        Number.parseInt(hexagramNumber),
        Number.parseInt(movingLine),
        new Date().getMonth() + 1,
      )
      setLogicResult(result)
    } catch (error) {
      console.error("[v0] Logic test error:", error)
      setLogicResult({ error: "Lỗi logic: " + (error as Error).message })
    } finally {
      setIsLoadingLogic(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Test AI vs Logic Cứng</h1>
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Input Test</CardTitle>
              <CardDescription>Nhập thông tin để so sánh kết quả AI và Logic cứng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="concern">Triệu chứng / Câu hỏi sức khỏe</Label>
                <Textarea
                  id="concern"
                  value={healthConcern}
                  onChange={(e) => setHealthConcern(e.target.value)}
                  placeholder="Ví dụ: Đau đầu gối, mất ngủ, đau dạ dày..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hexagram">Số quẻ (1-64)</Label>
                  <Select value={hexagramNumber} onValueChange={setHexagramNumber}>
                    <SelectTrigger id="hexagram">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 64 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          Quẻ {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moving">Hào động (1-6)</Label>
                  <Select value={movingLine} onValueChange={setMovingLine}>
                    <SelectTrigger id="moving">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          Hào {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={testAI} disabled={isLoadingAI} className="flex-1 gap-2">
                  {isLoadingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Test AI
                    </>
                  )}
                </Button>
                <Button
                  onClick={testLogic}
                  disabled={isLoadingLogic}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  {isLoadingLogic ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Test Logic Cứng"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Kết quả AI
                  </CardTitle>
                  <Badge>Mới</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {aiResult ? (
                  <div className="space-y-4">
                    {aiResult.error ? (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">{aiResult.error}</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-semibold mb-2">Tóm tắt:</h4>
                          <p className="text-sm whitespace-pre-wrap">{aiResult.summarySimple}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Lời khuyên:</h4>
                          <p className="text-sm whitespace-pre-wrap">{aiResult.advice}</p>
                        </div>
                        <Badge variant="secondary">Severity: {aiResult.severity}</Badge>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nhấn "Test AI" để xem kết quả</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kết quả Logic Cứng</CardTitle>
              </CardHeader>
              <CardContent>
                {logicResult ? (
                  <div className="space-y-4">
                    {logicResult.error ? (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">{logicResult.error}</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-semibold mb-2">Tóm tắt:</h4>
                          <p className="text-sm whitespace-pre-wrap">{logicResult.summarySimple}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Lời khuyên:</h4>
                          <p className="text-sm whitespace-pre-wrap">{logicResult.advice}</p>
                        </div>
                        <Badge variant="secondary">Severity: {logicResult.severity}</Badge>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nhấn "Test Logic Cứng" để xem kết quả</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
