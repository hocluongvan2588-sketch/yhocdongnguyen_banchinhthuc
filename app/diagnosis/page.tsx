"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Sparkles } from "lucide-react"
import { getTrigramByNumber, TRIGRAMS } from "@/lib/data/trigram-data"
import { getHexagramByTrigrams } from "@/lib/data/hexagram-data"
import { generateDiagnosis, type DiagnosisResult } from "@/lib/diagnosis-data"
import { PaymentModal } from "@/components/payment-modal"
import { analyzeBodyUse } from "@/lib/plum-blossom-calculations"
import { ELEMENT_TO_ORGAN } from "@/lib/diagnosis/organ-mappings"
import { analyzeSeasonalInfluence } from "@/lib/diagnosis/seasonal-calculations"
import { getDetailedInterpretation } from "@/lib/diagnosis/interpretation-logic"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { ModernDiagnosisHeader } from "./components/modern-diagnosis-header"
import { ModernSummaryCard } from "./components/modern-summary-card"
import { ModernElementsDisplay } from "./components/modern-elements-display"
import { ModernAdviceCard } from "./components/modern-advice-card"
import { SmartPackageRecommendation } from "./components/smart-package-recommendation"
import { SeasonalAnalysis } from "./components/seasonal-analysis"
import { HexagramSVG } from "@/components/hexagram-svg"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function DiagnosisContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<1 | 2 | 3 | null>(null)
  const [useAI, setUseAI] = useState(true)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiInterpretation, setAiInterpretation] = useState<any>(null)

  const upper = Number.parseInt(searchParams.get("upper") || "1")
  const lower = Number.parseInt(searchParams.get("lower") || "1")
  const moving = Number.parseInt(searchParams.get("moving") || "1")
  const healthConcern = searchParams.get("healthConcern") || ""
  const year = searchParams.get("year") || ""
  const month = searchParams.get("month") || ""
  const day = searchParams.get("day") || ""
  const hour = searchParams.get("hour") || ""
  const minute = searchParams.get("minute") || ""
  const method = searchParams.get("method") || "time"

  const currentMonth = month ? Number.parseInt(month) : new Date().getMonth() + 1

  useEffect(() => {
    const result = generateDiagnosis(upper, lower, moving)
    setDiagnosis(result)
  }, [upper, lower, moving])

  const upperTrigram = getTrigramByNumber(upper)
  const lowerTrigram = getTrigramByNumber(lower)
  const hexagramData = getHexagramByTrigrams(upper, lower)

  const calculateTransformedHexagram = () => {
    if (!upperTrigram || !lowerTrigram || !moving) return null

    const isLowerMoving = moving >= 1 && moving <= 3
    const lineIndexInTrigram = isLowerMoving ? moving - 1 : moving - 4

    if (isLowerMoving) {
      const newLowerLines = [...lowerTrigram.lines]
      newLowerLines[lineIndexInTrigram] = !newLowerLines[lineIndexInTrigram]

      const newLowerTrigram = Object.values(TRIGRAMS).find((trig: any) =>
        trig?.lines?.every((line: boolean, i: number) => line === newLowerLines[i]),
      )

      if (newLowerTrigram) {
        return {
          upper: upper,
          lower: newLowerTrigram.number,
          hexagram: getHexagramByTrigrams(upper, newLowerTrigram.number),
        }
      }
    } else {
      const newUpperLines = [...upperTrigram.lines]
      newUpperLines[lineIndexInTrigram] = !newUpperLines[lineIndexInTrigram]

      const newUpperTrigram = Object.values(TRIGRAMS).find((trig: any) =>
        trig?.lines?.every((line: boolean, i: number) => line === newUpperLines[i]),
      )

      if (newUpperTrigram) {
        return {
          upper: newUpperTrigram.number,
          lower: lower,
          hexagram: getHexagramByTrigrams(newUpperTrigram.number, lower),
        }
      }
    }
    return null
  }

  const transformedHexagram = calculateTransformedHexagram()
  const bodyUseAnalysis = analyzeBodyUse(upper, lower, moving)
  const seasonalAnalysis = analyzeSeasonalInfluence(
    bodyUseAnalysis.bodyElement,
    bodyUseAnalysis.useElement,
    currentMonth,
  )

  const detailedInterpretation = getDetailedInterpretation(
    bodyUseAnalysis.bodyElement,
    bodyUseAnalysis.useElement,
    bodyUseAnalysis.relationship,
    healthConcern,
    hexagramData?.number,
    moving,
    currentMonth,
  )

  const fetchAIInterpretation = async () => {
    if (!useAI || !hexagramData) return

    setIsLoadingAI(true)
    try {
      const response = await fetch("/api/diagnose-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upperTrigram: upperTrigram?.vietnamese || "",
          lowerTrigram: lowerTrigram?.vietnamese || "",
          movingLine: moving,
          healthConcern,
          currentMonth,
          transformedUpper: transformedHexagram?.upper,
          transformedLower: transformedHexagram?.lower,
        }),
      })

      const aiResult = await response.json()

      if (!response.ok || aiResult.status === "error") {
        console.error("[v0] AI diagnosis returned error:", aiResult)
        setAiInterpretation(null)
        return
      }

      console.log("[v0] AI diagnosis result:", aiResult.usedAI ? "AI generated" : "Fallback logic")
      setAiInterpretation(aiResult)
    } catch (error) {
      console.error("[v0] AI interpretation error:", error)
      setAiInterpretation(null)
    } finally {
      setIsLoadingAI(false)
    }
  }

  useEffect(() => {
    fetchAIInterpretation()
  }, [useAI, hexagramData, moving, healthConcern, bodyUseAnalysis, currentMonth])

  const displayInterpretation = useAI && aiInterpretation ? aiInterpretation : detailedInterpretation

  const getRecommendedPackage = () => {
    const relation = bodyUseAnalysis.relationship
    if (relation.includes("khắc") && relation.includes("Dụng khắc Thể")) {
      return {
        primary: "khai-huyet",
        reason:
          "Khi Dụng khắc Thể, kinh lạc dễ bị tắc nghẽn. Khai thông huyệt đạo giúp điều hòa khí huyết hiệu quả nhất.",
        secondary: "nam-duoc",
      }
    } else if (relation.includes("khắc") && relation.includes("Thể khắc Dụng")) {
      return {
        primary: "nam-duoc",
        reason: "Thể khắc Dụng tiêu hao năng lượng. Bổ sung dược liệu thiên nhiên giúp phục hồi sinh lực nhanh chóng.",
        secondary: "tuong-so",
      }
    } else if (relation.includes("sinh") && relation.includes("Dụng sinh Thể")) {
      return {
        primary: "tuong-so",
        reason:
          "Quẻ Dụng sinh Thể, sức khỏe thuận lợi. Thời điểm này phù hợp để tìm hiểu sâu về Tượng Số nhằm tối ưu hóa năng lượng cá nhân.",
        secondary: "nam-duoc",
      }
    } else {
      return {
        primary: "nam-duoc",
        reason: "Bổ sung thảo dược phù hợp với ngũ hành của bạn giúp cân bằng cơ thể toàn diện.",
        secondary: "khai-huyet",
      }
    }
  }

  const recommendedPackage = getRecommendedPackage()

  const scrollToPackages = () => {
    const element = document.getElementById("treatment-packages")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handlePackageClick = (packageNumber: 1 | 2 | 3) => {
    setSelectedPackage(packageNumber)
    setShowPaymentModal(true)
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Đang phân tích kết quả chẩn đoán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Kết Quả Chẩn Đoán</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 border border-border">
                <Sparkles className={`w-4 h-4 transition-colors ${useAI ? "text-primary" : "text-muted-foreground"}`} />
                <Label htmlFor="ai-mode" className="text-sm font-medium cursor-pointer whitespace-nowrap">
                  AI Nâng cao
                </Label>
                <Switch id="ai-mode" checked={useAI} onCheckedChange={setUseAI} />
                {isLoadingAI && (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto max-w-5xl">
        <div className="space-y-8">
          <ModernDiagnosisHeader
            hexagramName={hexagramData?.vietnamese || `${upperTrigram?.vietnamese} ${lowerTrigram?.vietnamese}`}
            year={year}
            month={month}
            day={day}
            hour={hour}
            minute={minute}
          />

          {useAI && aiInterpretation && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-primary font-medium">
                Kết quả được phân tích bởi AI với tri thức Mai Hoa Dịch Số chuẩn xác
              </p>
            </div>
          )}

          <ModernSummaryCard interpretation={displayInterpretation} />

          <SmartPackageRecommendation
            severity={displayInterpretation.severity}
            status={displayInterpretation.status}
            primaryRecommendation={recommendedPackage.primary}
            reason={recommendedPackage.reason}
            onScrollToPackages={scrollToPackages}
          />

          <ModernElementsDisplay
            bodyElement={bodyUseAnalysis.bodyElement}
            useElement={bodyUseAnalysis.useElement}
            bodyOrganSimple={ELEMENT_TO_ORGAN[bodyUseAnalysis.bodyElement]?.organSimple || bodyUseAnalysis.bodyElement}
            useOrganSimple={ELEMENT_TO_ORGAN[bodyUseAnalysis.useElement]?.organSimple || bodyUseAnalysis.useElement}
            relation={bodyUseAnalysis.relationship}
            relationExplanation={displayInterpretation.summary}
          />

          <ModernAdviceCard interpretation={displayInterpretation} />

          <SeasonalAnalysis
            seasonElement={seasonalAnalysis.seasonElement}
            bodyStrength={seasonalAnalysis.bodyStrength}
            useStrength={seasonalAnalysis.useStrength}
            dangerousMonths={seasonalAnalysis.dangerousMonths}
            safeMonths={seasonalAnalysis.safeMonths}
            recoveryMonths={seasonalAnalysis.recoveryMonths}
            currentMonthRisk={seasonalAnalysis.currentMonthRisk}
            currentMonth={currentMonth}
          />

          <Card className="border border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Quẻ Hình và Biến Hóa</CardTitle>
              <p className="text-sm text-muted-foreground">Quẻ chính và quẻ biến sau khi hào động thay đổi</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="main" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="main" className="text-base">
                    Quẻ Chính (本卦)
                  </TabsTrigger>
                  <TabsTrigger value="transformed" className="text-base">
                    Quẻ Biến (变卦)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="main" className="space-y-4 mt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <HexagramSVG
                      upperLines={upperTrigram?.lines || [true, true, true]}
                      lowerLines={lowerTrigram?.lines || [true, true, true]}
                      movingLine={moving}
                      className="w-32 h-32"
                    />

                    <div className="text-center space-y-2">
                      <h3 className="text-3xl font-bold text-foreground">{hexagramData?.chinese || "—"}</h3>
                      <p className="text-xl text-primary font-medium">{hexagramData?.vietnamese || "—"}</p>
                      <p className="text-sm text-muted-foreground">Quẻ thứ {hexagramData?.number}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-center">
                      <Badge variant="secondary" className="text-sm">
                        Thượng: {upperTrigram?.vietnamese} ({upperTrigram?.element})
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        Hạ: {lowerTrigram?.vietnamese} ({lowerTrigram?.element})
                      </Badge>
                      <Badge variant="outline" className="text-sm bg-accent/10">
                        Động: Hào {moving}
                      </Badge>
                    </div>

                    {hexagramData && (
                      <div className="w-full p-4 bg-secondary/50 border border-border/50 rounded-lg space-y-3 mt-4">
                        <div>
                          <h4 className="font-semibold text-base text-foreground mb-1">Quẻ tượng:</h4>
                          <p className="text-base text-muted-foreground leading-relaxed">{hexagramData.image}</p>
                          <p className="text-sm text-muted-foreground/70 italic mt-1">{hexagramData.imageVietnamese}</p>
                        </div>
                        <div className="border-t pt-3">
                          <h4 className="font-semibold text-base text-foreground mb-1">Ý nghĩa:</h4>
                          <p className="text-base text-muted-foreground">{hexagramData.meaning}</p>
                          <p className="text-sm text-muted-foreground/70 italic mt-1">
                            {hexagramData.meaningVietnamese}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="transformed" className="space-y-4 mt-6">
                  {transformedHexagram ? (
                    <div className="flex flex-col items-center space-y-4">
                      <HexagramSVG
                        upperLines={getTrigramByNumber(transformedHexagram.upper)?.lines || [true, true, true]}
                        lowerLines={getTrigramByNumber(transformedHexagram.lower)?.lines || [true, true, true]}
                        movingLine={undefined}
                        className="w-32 h-32"
                      />

                      <div className="text-center space-y-2">
                        <h3 className="text-3xl font-bold text-primary">
                          {transformedHexagram.hexagram?.chinese || "—"}
                        </h3>
                        <p className="text-xl font-medium text-primary">
                          {transformedHexagram.hexagram?.vietnamese || "—"}
                        </p>
                        <p className="text-sm text-muted-foreground">Quẻ thứ {transformedHexagram.hexagram?.number}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap justify-center">
                        <Badge variant="secondary" className="text-sm">
                          Thượng: {getTrigramByNumber(transformedHexagram.upper)?.vietnamese}
                        </Badge>
                        <Badge variant="secondary" className="text-sm">
                          Hạ: {getTrigramByNumber(transformedHexagram.lower)?.vietnamese}
                        </Badge>
                      </div>

                      <div className="w-full p-4 bg-primary/10 border border-primary/20 rounded-lg mt-4">
                        <p className="text-base text-muted-foreground text-center">
                          Quẻ này thể hiện xu hướng biến hóa trong tương lai
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base text-muted-foreground">Không có quẻ biến</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div id="treatment-packages" className="scroll-mt-20">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl md:text-3xl">Gói Điều Trị Chi Tiết</CardTitle>
                </div>
                <p className="text-base text-muted-foreground">
                  Chọn gói phù hợp để nhận phác đồ điều trị cá nhân hóa từ chuyên gia
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div
                    className={`border-2 rounded-lg p-6 space-y-4 transition-all hover:shadow-lg cursor-pointer ${recommendedPackage.primary === "nam-duoc" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => handlePackageClick(1)}
                  >
                    {recommendedPackage.primary === "nam-duoc" && <Badge className="mb-2">Phù hợp với bạn</Badge>}
                    <h3 className="text-xl font-bold">Gói Nam Dược</h3>
                    <p className="text-3xl font-bold text-primary">500.000đ</p>
                    <p className="text-sm text-muted-foreground">Phác đồ thảo dược phù hợp ngũ hành</p>
                    <Button
                      className="w-full"
                      variant={recommendedPackage.primary === "nam-duoc" ? "default" : "outline"}
                    >
                      Chọn gói này
                    </Button>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-6 space-y-4 transition-all hover:shadow-lg cursor-pointer ${recommendedPackage.primary === "khai-huyet" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => handlePackageClick(2)}
                  >
                    {recommendedPackage.primary === "khai-huyet" && <Badge className="mb-2">Phù hợp với bạn</Badge>}
                    <h3 className="text-xl font-bold">Gói Khai Huyệt</h3>
                    <p className="text-3xl font-bold text-primary">800.000đ</p>
                    <p className="text-sm text-muted-foreground">Khai thông kinh lạc, huyệt đạo</p>
                    <Button
                      className="w-full"
                      variant={recommendedPackage.primary === "khai-huyet" ? "default" : "outline"}
                    >
                      Chọn gói này
                    </Button>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-6 space-y-4 transition-all hover:shadow-lg cursor-pointer ${recommendedPackage.primary === "tuong-so" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => handlePackageClick(3)}
                  >
                    {recommendedPackage.primary === "tuong-so" && <Badge className="mb-2">Phù hợp với bạn</Badge>}
                    <h3 className="text-xl font-bold">Gói Tượng Số</h3>
                    <p className="text-3xl font-bold text-primary">1.200.000đ</p>
                    <p className="text-sm text-muted-foreground">Phân tích sâu Mai Hoa Dịch Số</p>
                    <Button
                      className="w-full"
                      variant={recommendedPackage.primary === "tuong-so" ? "default" : "outline"}
                    >
                      Chọn gói này
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {showPaymentModal && selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedPackage(null)
          }}
          selectedPackage={selectedPackage}
        />
      )}
    </div>
  )
}

export default function DiagnosisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      }
    >
      <DiagnosisContent />
    </Suspense>
  )
}
