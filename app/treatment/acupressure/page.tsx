"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, MapPin, Clock, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { getTrigramByNumber } from "@/lib/data/trigram-data"
import { getAcupressureTreatment, type AcupressurePoint } from "@/lib/acupressure-data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GatedContentWrapper } from "@/components/gated-content-wrapper"
import { PaymentModal } from "@/components/payment-modal"

function AcupressureContent() {
  const searchParams = useSearchParams()
  const [treatment, setTreatment] = useState<ReturnType<typeof getAcupressureTreatment> | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<AcupressurePoint | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const upper = Number.parseInt(searchParams.get("upper") || "1")
  const lower = Number.parseInt(searchParams.get("lower") || "1")
  const moving = Number.parseInt(searchParams.get("moving") || "1")

  useEffect(() => {
    const result = getAcupressureTreatment(upper, lower, moving)
    setTreatment(result)
    if (result.primaryPoints.length > 0) {
      setSelectedPoint(result.primaryPoints[0])
    }
  }, [upper, lower, moving])

  const upperTrigram = getTrigramByNumber(upper)
  const lowerTrigram = getTrigramByNumber(lower)

  const hexagramName = `${upperTrigram.vietnamese} ${lowerTrigram.vietnamese}`

  if (!treatment) {
    return <div className="text-center py-12">Đang tải...</div>
  }

  return (
    <>
      <GatedContentWrapper
        solutionType="acupoint"
        hexagram={hexagramName}
        packageNumber={1}
        onPaymentRequired={() => setShowPaymentModal(true)}
      >
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
          {/* Header */}
          <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Gói 1: Khai Huyệt Trị Liệu</h1>
                  <p className="text-sm text-muted-foreground mt-1">Liệu pháp bấm huyệt theo Y Dịch</p>
                </div>
                <Button variant="outline" onClick={() => (window.location.href = "/")}>
                  Trang chủ
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Diagnosis Summary */}
              <Card className="border-primary/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Info className="w-5 h-5 text-primary" />
                    Chẩn Đoán
                  </CardTitle>
                  <CardDescription>{treatment.diagnosis}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Badge variant="secondary">
                      Thượng: {upperTrigram.vietnamese} ({upperTrigram.element})
                    </Badge>
                    <Badge variant="secondary">
                      Hạ: {lowerTrigram.vietnamese} ({lowerTrigram.element})
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Body Map & Point Details */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Body Map */}
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Bản Đồ Huyệt Đạo</CardTitle>
                    <CardDescription>Nhấn vào các điểm để xem chi tiết</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-secondary/20 to-secondary/10 rounded-lg border-2 border-border">
                      {/* Simple body outline */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Head */}
                        <ellipse
                          cx="50"
                          cy="8"
                          rx="8"
                          ry="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.5"
                          className="text-muted-foreground"
                        />
                        {/* Body */}
                        <path
                          d="M 50 18 L 50 60"
                          stroke="currentColor"
                          strokeWidth="0.5"
                          className="text-muted-foreground"
                        />
                        {/* Arms */}
                        <path
                          d="M 50 25 L 25 45"
                          stroke="currentColor"
                          strokeWidth="0.5"
                          className="text-muted-foreground"
                        />
                        <path
                          d="M 50 25 L 75 45"
                          stroke="currentColor"
                          strokeWidth="0.5"
                          className="text-muted-foreground"
                        />
                        {/* Legs */}
                        <path
                          d="M 50 60 L 45 95"
                          stroke="currentColor"
                          strokeWidth="0.5"
                          className="text-muted-foreground"
                        />
                        <path
                          d="M 50 60 L 55 95"
                          stroke="currentColor"
                          strokeWidth="0.5"
                          className="text-muted-foreground"
                        />

                        {/* Acupressure Points - Primary */}
                        {treatment.primaryPoints.map((point, idx) => (
                          <g key={`primary-${idx}`}>
                            <circle
                              cx={point.position.x}
                              cy={point.position.y}
                              r="3"
                              className="fill-primary cursor-pointer hover:fill-primary/80 transition-colors"
                              onClick={() => setSelectedPoint(point)}
                            />
                            <circle
                              cx={point.position.x}
                              cy={point.position.y}
                              r="4.5"
                              className="fill-none stroke-primary stroke-[0.5] animate-ping"
                              style={{ animationDuration: "2s" }}
                            />
                          </g>
                        ))}

                        {/* Acupressure Points - Secondary */}
                        {treatment.secondaryPoints.map((point, idx) => (
                          <g key={`secondary-${idx}`}>
                            <circle
                              cx={point.position.x}
                              cy={point.position.y}
                              r="2"
                              className="fill-accent cursor-pointer hover:fill-accent/80 transition-colors"
                              onClick={() => setSelectedPoint(point)}
                            />
                          </g>
                        ))}
                      </svg>

                      {/* Legend */}
                      <div className="absolute bottom-4 left-4 space-y-2 bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <span className="text-foreground">Huyệt chính</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                          <span className="text-foreground">Huyệt phụ</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Point Details */}
                <div className="space-y-6">
                  {selectedPoint && (
                    <Card className="border-border/50 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-foreground">{selectedPoint.vietnamese}</CardTitle>
                            <CardDescription>{selectedPoint.name}</CardDescription>
                          </div>
                          <Badge variant="default" className="text-sm">
                            Chi tiết huyệt
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground text-sm">Vị trí:</p>
                              <p className="text-muted-foreground text-sm">{selectedPoint.location}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground text-sm">Thời gian:</p>
                              <p className="text-muted-foreground text-sm">{selectedPoint.duration}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground text-sm">Kỹ thuật:</p>
                              <p className="text-muted-foreground text-sm">{selectedPoint.technique}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border">
                          <p className="font-semibold text-foreground text-sm mb-2">Công dụng:</p>
                          <ul className="space-y-1">
                            {selectedPoint.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Instructions */}
                  <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-foreground text-lg">Hướng Dẫn Thực Hiện</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">{treatment.instructions}</p>

                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                        <p className="text-sm font-semibold text-foreground mb-1">Tần suất:</p>
                        <p className="text-sm text-muted-foreground">{treatment.frequency}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* All Points List */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Danh Sách Huyệt Đạo</CardTitle>
                  <CardDescription>Tất cả các huyệt cần bấm cho liệu trình điều trị</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        Huyệt Chính (Ưu tiên cao)
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {treatment.primaryPoints.map((point, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-secondary/30 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-colors"
                            onClick={() => setSelectedPoint(point)}
                          >
                            <h5 className="font-semibold text-foreground">
                              {point.vietnamese} ({point.name})
                            </h5>
                            <p className="text-sm text-muted-foreground mt-1">{point.location}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        Huyệt Phụ (Hỗ trợ)
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {treatment.secondaryPoints.map((point, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-secondary/20 rounded-lg border border-border cursor-pointer hover:bg-secondary/40 transition-colors"
                            onClick={() => setSelectedPoint(point)}
                          >
                            <h5 className="font-semibold text-foreground">
                              {point.vietnamese} ({point.name})
                            </h5>
                            <p className="text-sm text-muted-foreground mt-1">{point.location}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Precautions */}
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDescription className="ml-2">
                  <p className="font-semibold text-foreground mb-2">Lưu Ý Quan Trọng:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {treatment.precautions.map((precaution, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5">•</span>
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Download Button */}
              <Card className="border-border/50 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">Tải Hướng Dẫn PDF</h3>
                      <p className="text-sm text-muted-foreground">Hướng dẫn chi tiết với hình ảnh minh họa đầy đủ</p>
                    </div>
                    <Button size="lg" className="gap-2">
                      <Download className="w-5 h-5" />
                      Tải xuống
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Evidence Section */}
              <Card className="border-border/50 bg-muted/30">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Dẫn chứng tài liệu:</strong> Các huyệt đạo và kỹ thuật bấm huyệt
                    dựa trên "Châm Cứu Giáp Ất Kinh" (Hoàng Phủ Mật, Triều Tấn) và "Thập Tứ Kinh Mạch Phát Huy" (Trượng
                    Giới Tân). Nghiên cứu hiện đại về hiệu quả của liệu pháp bấm huyệt được WHO công nhận trong
                    "Acupuncture: Review and Analysis of Reports on Controlled Clinical Trials" (2002). Ứng dụng Y Dịch
                    trong châm cứu được ghi nhận trong "Y Dịch Hội Thông" (Chu Đản Khê).
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </GatedContentWrapper>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        packageNumber={1}
        upper={upper}
        lower={lower}
        moving={moving}
      />
    </>
  )
}

export default function AcupressurePage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Đang tải...</div>}>
      <AcupressureContent />
    </Suspense>
  )
}
