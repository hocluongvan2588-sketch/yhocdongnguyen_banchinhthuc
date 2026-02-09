"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, CheckCircle2, ArrowRight, Zap } from "lucide-react"
import type { SeverityLevel } from "@/lib/diagnosis/interpretation-logic"

interface SmartPackageRecommendationProps {
  severity: SeverityLevel
  status: "good" | "warning" | "bad" | "neutral"
  primaryRecommendation: string
  reason: string
  onScrollToPackages: () => void
}

export function SmartPackageRecommendation({
  severity,
  status,
  primaryRecommendation,
  reason,
  onScrollToPackages,
}: SmartPackageRecommendationProps) {
  const getRecommendationContent = () => {
    if (severity === "severe") {
      return {
        variant: "destructive" as const,
        icon: <AlertTriangle className="h-6 w-6 flex-shrink-0" />,
        title: "Tình trạng cần quan tâm đặc biệt",
        description:
          "Dựa trên phân tích Mai Hoa Dịch Số, tình trạng của bạn cần được chú ý và chăm sóc kịp thời. Chúng tôi khuyến nghị bạn tham khảo gói tư vấn chuyên sâu để có phác đồ chi tiết nhất.",
        recommendedPackages: [
          {
            name: "Gói Tượng Số",
            description: "Phân tích toàn diện với lộ trình dài hạn",
            highlight: true,
          },
          {
            name: "Gói Nam Dược",
            description: "Bài thảo dược riêng theo ngũ hành",
            highlight: false,
          },
        ],
        alertClass: "bg-red-50 border-red-300 text-red-900",
      }
    }

    if (severity === "moderate") {
      return {
        variant: "default" as const,
        icon: <Info className="h-6 w-6 flex-shrink-0 text-amber-600" />,
        title: "Nên theo dõi và chăm sóc",
        description:
          "Kết quả chẩn đoán cho thấy cơ thể bạn cần được hỗ trợ để tránh tình trạng trở nên nghiêm trọng hơn. Việc can thiệp sớm sẽ giúp phục hồi nhanh chóng.",
        recommendedPackages: [
          {
            name: "Gói Nam Dược",
            description: "Cân bằng ngũ hành với thảo dược",
            highlight: true,
          },
          {
            name: "Gói Khai Huyệt",
            description: "Khai thông kinh lạc bằng huyệt đạo",
            highlight: false,
          },
        ],
        alertClass: "bg-amber-50 border-amber-300 text-amber-900",
      }
    }

    // mild severity
    return {
      variant: "default" as const,
      icon: <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-blue-600" />,
      title: "Tình trạng ổn định - Có thể tối ưu",
      description:
        "Cơ thể bạn đang trong trạng thái cân bằng tốt. Để duy trì và tối ưu hóa sức khỏe, bạn có thể tham khảo các gói tư vấn để hiểu sâu hơn về cách chăm sóc bản thân.",
      recommendedPackages: [
        {
          name: "Gói Tượng Số",
          description: "Hiểu sâu về bản thân qua Dịch học",
          highlight: true,
        },
        {
          name: "Gói Khai Huyệt",
          description: "Duy trì sức khỏe phòng ngừa",
          highlight: false,
        },
      ],
      alertClass: "bg-blue-50 border-blue-300 text-blue-900",
    }
  }

  const content = getRecommendationContent()

  // Don't show for mild cases with good status
  if (severity === "mild" && status === "good") {
    return null
  }

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="pt-6 space-y-6">
        <Alert variant={content.variant} className={`border-2 ${content.alertClass || ""}`}>
          {content.icon}
          <AlertTitle className="text-xl md:text-2xl font-bold mb-3 whitespace-normal">{content.title}</AlertTitle>
          <AlertDescription className="text-base md:text-lg leading-relaxed whitespace-normal break-words">
            {content.description}
          </AlertDescription>
        </Alert>

        <div className="bg-background/50 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary flex-shrink-0" />
            <h3 className="text-lg md:text-xl font-semibold whitespace-normal">Gợi ý dựa trên kết quả của bạn</h3>
          </div>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-normal break-words">
            {reason}
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {content.recommendedPackages.map((pkg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  pkg.highlight
                    ? "bg-primary/10 border-primary shadow-md"
                    : "bg-muted/30 border-border hover:border-primary/50"
                } transition-all`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-base md:text-lg font-semibold">{pkg.name}</h4>
                  {pkg.highlight && (
                    <Badge variant="default" className="text-sm flex-shrink-0">
                      Khuyên dùng
                    </Badge>
                  )}
                </div>
                <p className="text-sm md:text-base text-muted-foreground whitespace-normal break-words">
                  {pkg.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex-1 space-y-1 min-w-0">
            <p className="font-semibold text-base md:text-lg whitespace-normal">
              Sẵn sàng bắt đầu hành trình chăm sóc sức khỏe?
            </p>
            <p className="text-sm md:text-base text-muted-foreground whitespace-normal break-words">
              Xem chi tiết các gói phù hợp với tình trạng của bạn
            </p>
          </div>
          <Button onClick={onScrollToPackages} size="lg" className="gap-2 text-base w-full sm:w-auto flex-shrink-0">
            Xem gói dịch vụ
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {severity === "severe" && (
          <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <AlertTitle className="text-base md:text-lg font-semibold text-amber-800 dark:text-amber-200">
              Lưu ý quan trọng
            </AlertTitle>
            <AlertDescription className="text-sm md:text-base text-amber-700 dark:text-amber-300 leading-relaxed whitespace-normal break-words">
              Kết quả chẩn đoán qua Mai Hoa Dịch Số là công cụ tham khảo. Với các triệu chứng nghiêm trọng, bạn nên đi
              khám bác sĩ chuyên khoa để có chẩn đoán chính xác và phương pháp chăm sóc kịp thời.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
