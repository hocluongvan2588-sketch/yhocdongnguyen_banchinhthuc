"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Sparkles, AlertCircle } from "lucide-react"
import { getTrigramByNumber, TRIGRAMS } from "@/lib/data/trigram-data"
import { getHexagramByTrigrams } from "@/lib/data/hexagram-data"
import { generateDiagnosis, type DiagnosisResult } from "@/lib/diagnosis-data"
import { PaymentModal } from "@/components/payment-modal"
import { analyzeBodyUse } from "@/lib/plum-blossom-calculations"
import { ELEMENT_TO_ORGAN } from "@/lib/diagnosis/organ-mappings"
import { analyzeSeasonalInfluence } from "@/lib/diagnosis/seasonal-calculations"
import { getDetailedInterpretation } from "@/lib/diagnosis/interpretation-logic"

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
  const [aiResult, setAiResult] = useState<{
    rawCalculation: any
    aiInterpretation?: {
      summary: string
      mechanism: string
      symptoms: string
      timing: string
      immediateAdvice: string
      longTermTreatment: string
    }
    usedAI: boolean
    generatedAt: string
  } | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [retryAfter, setRetryAfter] = useState(0)
  const requestInFlight = useRef(false)
  const hasResult = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentRequestId = useRef<string>("")
  const [aiCompleted, setAiCompleted] = useState(false)
  const [aiFailed, setAiFailed] = useState(false)

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
  const gender = searchParams.get("gender") || ""
  const age = searchParams.get("age") || ""
  const painLocation = searchParams.get("painLocation") || ""
  const userLocation = searchParams.get("location") || ""
  
  // Can Chi information from URL params
  const canNam = searchParams.get("canNam") || ""
  const chiNam = searchParams.get("chiNam") || ""
  const canNgay = searchParams.get("canNgay") || ""
  const chiNgay = searchParams.get("chiNgay") || ""
  const element = searchParams.get("element") || ""
  const lunarYear = searchParams.get("lunarYear") || ""
  const calculatedAge = searchParams.get("age") || ""

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

  const stableBodyUseKey = useMemo(() => {
    return `${upper}-${lower}-${moving}`
  }, [upper, lower, moving])

  const stableDiagnosisKey = useMemo(() => {
    return `${healthConcern}-${currentMonth}-${stableBodyUseKey}`
  }, [healthConcern, currentMonth, stableBodyUseKey])

  const fetchAIInterpretation = async () => {
    if (requestInFlight.current) {
      console.log("[v0] Request already in flight, aborting duplicate")
      return
    }

    if (hasResult.current) {
      console.log("[v0] Already have result, skipping fetch")
      return
    }

    if (isLoadingAI) {
      console.log("[v0] Already loading, skipping fetch")
      return
    }

    if (!useAI) {
      console.log("[v0] useAI is false, skipping AI fetch")
      return
    }

    if (!upper || !lower || !moving || !healthConcern) {
      console.error("[v0] Missing required parameters:", { upper, lower, moving, healthConcern })
      return
    }

    requestInFlight.current = true
    hasResult.current = false
    setIsLoadingAI(true)
    setAiCompleted(false)
    setAiFailed(false)

    if (abortControllerRef.current) {
      console.log("[v0] Aborting previous request")
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    console.log("[v0] Starting AI interpretation fetch")

    try {
      const requestBody = {
        upperTrigram: upper,
        lowerTrigram: lower,
        movingLine: moving,
        transformedUpper: transformedHexagram?.upper || null,
        transformedLower: transformedHexagram?.lower || null,
        healthConcern,
        currentMonth,
        gender: gender || undefined,
        age: age ? Number.parseInt(age) : undefined,
        painLocation: painLocation || undefined,
        userLocation: userLocation || undefined,
        canNam: canNam || undefined,
        chiNam: chiNam || undefined,
        canNgay: canNgay || undefined,
        chiNgay: chiNgay || undefined,
        element: element || undefined,
        lunarYear: lunarYear || undefined,
      }

      console.log("[v0] Request body:", requestBody)

      const response = await fetch("/api/diagnose-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      })

      if (response.status === 429) {
        const data = await response.json()
        const retrySeconds = data.retryAfter || 60
        setRetryAfter(retrySeconds)

        const countdownInterval = setInterval(() => {
          setRetryAfter((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        setAiFailed(true)
        setAiCompleted(true)
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] AI interpretation received:", result)

      setAiResult(result)
      hasResult.current = true

      setAiCompleted(true)
      setAiFailed(!result.usedAI)

      if (!result.usedAI) {
        console.log("[v0] Backend returned fallback, not retrying")
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("[v0] Request was aborted")
      } else {
        console.error("[v0] AI interpretation failed:", error)
        setAiFailed(true)
        setAiCompleted(true)
      }
    } finally {
      setIsLoadingAI(false)
      requestInFlight.current = false
    }
  }

  useEffect(() => {
    const requestId = `${stableDiagnosisKey}-${Date.now()}`

    if (currentRequestId.current !== stableDiagnosisKey) {
      console.log("[v0] New query detected, resetting state")
      currentRequestId.current = stableDiagnosisKey
      requestInFlight.current = false
      hasResult.current = false
      setAiResult(null)
    }

    const debounceTimer = setTimeout(() => {
      if (!requestInFlight.current && !hasResult.current) {
        fetchAIInterpretation()
      }
    }, 500)

    return () => {
      clearTimeout(debounceTimer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [useAI, stableDiagnosisKey])

  const displayInterpretation = useMemo(() => {
    if (useAI && aiResult?.usedAI && aiResult.aiInterpretation) {
      const ai = aiResult.aiInterpretation

      return {
        title: detailedInterpretation.title,
        summary: ai.summary || detailedInterpretation.summary,
        summarySimple: ai.summary?.split("\n\n")[0] || detailedInterpretation.summarySimple,
        healthDetail: `${ai.mechanism}\n\n${ai.symptoms}`,
        prognosis: ai.timing || detailedInterpretation.prognosis,
        severity: detailedInterpretation.severity,
        severityLabel: detailedInterpretation.severityLabel,
        status: detailedInterpretation.status,
        immediateAdvice: ai.immediateAdvice?.split("\n") || detailedInterpretation.immediateAdvice,
        shortTermCare: ai.immediateAdvice?.split("\n").slice(0, 3) || detailedInterpretation.shortTermCare,
        longTermTreatment: ai.longTermTreatment?.split("\n") || detailedInterpretation.longTermTreatment,
        preventionTips: detailedInterpretation.preventionTips,
      }
    }

    return detailedInterpretation
  }, [useAI, aiResult, detailedInterpretation])

  const getRecommendedPackage = () => {
    const relation = bodyUseAnalysis.relationship
    if (relation.includes("khắc") && relation.includes("Dụng khắc Thể")) {
      return {
        primary: "khai-huyet",
        reason:
          "Theo quẻ, khí đang bị ứ trệ ở kinh lạc liên quan. Khai thông huyệt đạo giúp khí huyết lưu thông trở lại, cơ thể tự điều chỉnh nhanh hơn.",
        secondary: "nam-duoc",
      }
    } else if (relation.includes("khắc") && relation.includes("Thể khắc Dụng")) {
      return {
        primary: "nam-duoc",
        reason: "Cơ thể đang tiêu hao năng lượng nhiều hơn bình thường. Bồi bổ tạng gốc bằng thảo dược giúp phục hồi sinh lực, tránh kéo dài.",
        secondary: "tuong-so",
      }
    } else if (relation.includes("sinh") && relation.includes("Dụng sinh Thể")) {
      return {
        primary: "tuong-so",
        reason:
          "Quẻ cho thấy sức khỏe đang thuận lợi. Đây là thời điểm tốt để điều chỉnh nhịp năng lượng, duy trì trạng thái cân bằng lâu dài.",
        secondary: "nam-duoc",
      }
    } else {
      return {
        primary: "nam-duoc",
        reason: "Tạng phủ cần được bồi bổ để tự cân bằng. Thảo dược theo ngũ hành cá nhân giúp điều chỉnh từ gốc, nhẹ nhàng và bền vững.",
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

  const shouldShowContent = !useAI || aiCompleted

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Kết Quả Chẩn Đoán</h1>
            <div className="flex items-center gap-4">
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
            gender={gender}
            age={age}
            painLocation={painLocation}
            userLocation={userLocation}
          />

          {useAI && isLoadingAI && !aiCompleted && (
            <div className="flex flex-col items-center gap-4 px-8 py-12 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-primary">Đang phân tích với AI Mai Hoa Dịch Số...</p>
                <p className="text-sm text-muted-foreground">
                  Hệ thống đang xử lý thông tin của bạn với tri thức Y Dịch chuẩn xác
                </p>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              </div>
            </div>
          )}

          {retryAfter > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-yellow-600 font-medium">
                Hệ thống đang bận, vui lòng thử lại sau {retryAfter} giây
              </p>
            </div>
          )}

          {useAI && aiResult?.usedAI && aiCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-primary font-medium">
                Kết quả được phân tích bởi AI với tri thức Mai Hoa Dịch Số chuẩn xác
              </p>
            </div>
          )}

          {useAI && aiFailed && aiCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-yellow-600 font-medium">
                AI tạm thời không khả dụng, sử dụng logic phân tích cơ bản
              </p>
            </div>
          )}

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

          {shouldShowContent && (
            <>
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
                bodyOrganSimple={
                  ELEMENT_TO_ORGAN[bodyUseAnalysis.bodyElement]?.organSimple || bodyUseAnalysis.bodyElement
                }
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
            </>
          )}

          <div id="treatment-packages" className="scroll-mt-20 space-y-6">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl md:text-3xl">{"L\u1ED9 Tr\u00ECnh \u0110i\u1EC1u Ch\u1EC9nh Theo Qu\u1EBB"}</CardTitle>
                </div>
                <p className="text-base text-muted-foreground">
                  {"M\u1ED7i g\u00F3i gi\u1EA3i quy\u1EBFt m\u1ED9t ph\u1EA7n kh\u00E1c nhau c\u1EE7a qu\u1EBB \u2014 ch\u1ECDn theo nhu c\u1EA7u c\u1EE7a b\u1EA1n"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Goi Khai Huyet - Thong khi */}
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 relative overflow-hidden">
                    {recommendedPackage.primary === "khai-huyet" && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-primary text-primary-foreground shadow-md">{"Ph\u00F9 h\u1EE3p v\u1EDBi b\u1EA1n"}</Badge>
                      </div>
                    )}
                    <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10">
                      <img
                        src="/acupressure-points-meridian-therapy-wellness.jpg"
                        alt={"G\u00F3i Khai Huy\u1EC7t"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs bg-transparent">{"Th\u00F4ng kh\u00ED \u2022 Gi\u1EA3m \u1EE9 tr\u1EC7"}</Badge>
                        <h3 className="text-xl font-bold">{"G\u00F3i Khai Huy\u1EC7t"}</h3>
                      </div>
                      <p className="text-3xl font-bold text-primary">{"299.000\u0111"}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {"T\u00E1c \u0111\u1ED9ng tr\u1EF1c ti\u1EBFp v\u00E0o kinh l\u1EA1c li\u00EAn quan \u0111\u1EBFn t\u1EA1ng ch\u1EE7 trong qu\u1EBB, gi\u00FAp th\u00F4ng kh\u00ED huy\u1EBFt, gi\u1EA3m u\u1EA5t tr\u1EC7 v\u00E0 h\u1ED7 tr\u1EE3 c\u01A1 th\u1EC3 t\u1EF1 h\u1ED3i ph\u1EE5c nhanh h\u01A1n. Ph\u00F9 h\u1EE3p khi b\u1EA1n mu\u1ED1n x\u1EED l\u00FD ngay ph\u1EA7n kh\u00ED \u2013 th\u1EA7n \u2013 huy\u1EBFt b\u00EAn trong."}
                      </p>
                      <Button
                        size="lg"
                        className="w-full"
                        variant={recommendedPackage.primary === "khai-huyet" ? "default" : "outline"}
                        onClick={() => handlePackageClick(2)}
                      >
                        {"Ch\u1ECDn l\u1ED9 tr\u00ECnh n\u00E0y"}
                      </Button>
                    </div>
                  </Card>

                  {/* Goi Tuong So - Dieu tang */}
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 relative overflow-hidden">
                    {recommendedPackage.primary === "tuong-so" && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-primary text-primary-foreground shadow-md">{"Ph\u00F9 h\u1EE3p v\u1EDBi b\u1EA1n"}</Badge>
                      </div>
                    )}
                    <div className="relative h-48 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10">
                      <img
                        src="/i-ching-hexagram-yijing-divination-ancient-wisdom.jpg"
                        alt={"G\u00F3i T\u01B0\u1EE3ng S\u1ED1 B\u00E1t Qu\u00E1i"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs bg-transparent">{"\u0110i\u1EC1u t\u1EA1ng \u2022 C\u00E2n b\u1EB1ng n\u0103ng l\u01B0\u1EE3ng"}</Badge>
                        <h3 className="text-xl font-bold">{"G\u00F3i T\u01B0\u1EE3ng S\u1ED1 B\u00E1t Qu\u00E1i"}</h3>
                      </div>
                      <p className="text-3xl font-bold text-primary">{"99.000\u0111"}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {"D\u1EF1a tr\u00EAn qu\u1EBB c\u00E1 nh\u00E2n \u0111\u1EC3 x\u00E2y d\u1EF1ng nh\u1ECBp th\u1EDF \u2013 thi\u1EC1n \u2013 t\u1EA7n s\u1ED1 c\u00E2n b\u1EB1ng n\u0103ng l\u01B0\u1EE3ng, gi\u00FAp \u1ED5n \u0111\u1ECBnh th\u1EA7n kinh, \u0111i\u1EC1u h\u00F2a c\u1EA3m x\u00FAc v\u00E0 t\u0103ng hi\u1EC7u qu\u1EA3 \u0111i\u1EC1u ch\u1EC9nh t\u1EA1ng ph\u1EE7. Ph\u00F9 h\u1EE3p khi b\u1EA1n mu\u1ED1n \u0111i\u1EC1u ch\u1EC9nh s\u00E2u nh\u01B0ng nh\u1EB9 nh\u00E0ng, c\u00F3 th\u1EC3 d\u00F9ng m\u1ED7i ng\u00E0y."}
                      </p>
                      <Button
                        size="lg"
                        className="w-full"
                        variant={recommendedPackage.primary === "tuong-so" ? "default" : "outline"}
                        onClick={() => handlePackageClick(3)}
                      >
                        {"Ch\u1ECDn l\u1ED9 tr\u00ECnh n\u00E0y"}
                      </Button>
                    </div>
                  </Card>

                  {/* Goi Nam Duoc - Dan khi */}
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 relative overflow-hidden">
                    {recommendedPackage.primary === "nam-duoc" && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-primary text-primary-foreground shadow-md">{"Ph\u00F9 h\u1EE3p v\u1EDBi b\u1EA1n"}</Badge>
                      </div>
                    )}
                    <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
                      <img
                        src="/traditional-herbal-medicine-herbs-natural-remedies.jpg"
                        alt={"G\u00F3i Nam D\u01B0\u1EE3c"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs bg-transparent">{"B\u1ED3i b\u1ED5 t\u1EA1ng ph\u1EE7 \u2022 \u0110i\u1EC1u ch\u1EC9nh s\u00E2u"}</Badge>
                        <h3 className="text-xl font-bold">{"G\u00F3i Nam D\u01B0\u1EE3c"}</h3>
                      </div>
                      <p className="text-3xl font-bold text-primary">{"199.000\u0111"}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {"\u00C1p d\u1EE5ng khi c\u1EA7n \u0111i\u1EC1u ch\u1EC9nh s\u00E2u v\u1EC1 t\u1EA1ng ph\u1EE7. Hi\u1EC7n t\u1EA1i h\u1EC7 th\u1ED1ng \u01B0u ti\u00EAn ph\u01B0\u01A1ng ph\u00E1p kh\u00F4ng d\u00F9ng thu\u1ED1c \u0111\u1EC3 c\u01A1 th\u1EC3 t\u1EF1 c\u00E2n b\u1EB1ng tr\u01B0\u1EDBc. B\u00E0i th\u1EA3o d\u01B0\u1EE3c \u0111\u01B0\u1EE3c pha ch\u1EBF ri\u00EAng theo ng\u0169 h\u00E0nh c\u00E1 nh\u00E2n, h\u1ED7 tr\u1EE3 b\u1ED3i b\u1ED5 t\u1EA1ng g\u1ED1c v\u00E0 \u0111i\u1EC1u h\u00F2a to\u00E0n di\u1EC7n."}
                      </p>
                      <Button
                        size="lg"
                        className="w-full"
                        variant={recommendedPackage.primary === "nam-duoc" ? "default" : "outline"}
                        onClick={() => handlePackageClick(1)}
                      >
                        {"Ch\u1ECDn l\u1ED9 tr\u00ECnh n\u00E0y"}
                      </Button>
                    </div>
                  </Card>
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
          packageNumber={selectedPackage}
          upper={upper}
          lower={lower}
          moving={moving}
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
