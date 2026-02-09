"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown } from "lucide-react"
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
  const getBridgeContent = () => {
    if (severity === "severe") {
      return {
        headline: "Bạn đã thấy rõ gốc tạng và chiều lệch khí.",
        body: "Nếu chỉ dừng ở việc \"biết\", cơ thể vẫn sẽ tự vận hành theo quán tính cũ. Khí huyết để lâu không thông thì càng khó hồi phục. Bước quan trọng nhất lúc này là can thiệp đúng chỗ, đúng thời điểm.",
        urgency: "Điều chỉnh sớm giúp cơ thể tự cân bằng nhanh hơn, tránh tình trạng kéo dài.",
      }
    }
    if (severity === "moderate") {
      return {
        headline: "Quẻ đã cho thấy điểm lệch khí và tạng chủ đạo của bạn.",
        body: "Nếu chỉ dừng ở việc \"biết\", cơ thể vẫn sẽ tự vận hành theo quán tính cũ. Bước tiếp theo quan trọng nhất là can thiệp đúng chỗ để cơ thể tự điều chỉnh lại.",
        urgency: "Khí huyết lệch lâu sẽ khó hồi. Điều chỉnh sớm sẽ nhẹ nhàng và hiệu quả hơn nhiều.",
      }
    }
    return {
      headline: "Cơ thể bạn đang trong trạng thái tương đối cân bằng.",
      body: "Đây là thời điểm tốt để tối ưu hóa sức khỏe. Thay vì đợi đến khi có vấn đề, việc chủ động điều chỉnh ngay bây giờ giúp duy trì trạng thái này lâu dài.",
      urgency: "Phòng bệnh hơn chữa bệnh. Duy trì nhịp sống đúng giúp tạng phủ tự cân bằng bền vững.",
    }
  }

  const bridge = getBridgeContent()

  // Don't show for mild cases with good status
  if (severity === "mild" && status === "good") {
    return null
  }

  return (
    <Card className="border border-primary/20 bg-gradient-to-b from-background to-primary/5">
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-4">
          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug">
            {bridge.headline}
          </h3>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {bridge.body}
          </p>

          <div className="flex flex-col gap-2 pl-4 border-l-2 border-primary/30">
            <p className="text-base text-foreground">
              <span className="font-medium">{"Th\u00F4ng kh\u00ED"}</span>{" \u2014 \u0111\u1EC3 kh\u00F4ng \u1EE9"}
            </p>
            <p className="text-base text-foreground">
              <span className="font-medium">{"\u0110i\u1EC1u t\u1EA1ng"}</span>{" \u2014 \u0111\u1EC3 kh\u00F4ng l\u1EC7ch"}
            </p>
            <p className="text-base text-foreground">
              <span className="font-medium">{"D\u1EABn kh\u00ED"}</span>{" \u2014 \u0111\u1EC3 kh\u00F4ng t\u00E1i"}
            </p>
          </div>

          <p className="text-sm md:text-base text-primary/80 italic leading-relaxed">
            {bridge.urgency}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <div className="flex-1 min-w-0">
            <p className="text-base text-muted-foreground leading-relaxed">
              {"H\u1EC7 th\u1ED1ng g\u1EE3i \u00FD c\u00E1c l\u1ED9 tr\u00ECnh b\u00EAn d\u01B0\u1EDBi d\u1EF1a tr\u00EAn ch\u00EDnh qu\u1EBB v\u00E0 t\u00ECnh tr\u1EA1ng c\u1EE7a b\u1EA1n, kh\u00F4ng ch\u1ECDn \u0111\u1EA1i tr\u00E0."}
            </p>
          </div>
          <Button onClick={onScrollToPackages} size="lg" className="gap-2 text-base w-full sm:w-auto flex-shrink-0">
            {"Xem l\u1ED9 tr\u00ECnh ph\u00F9 h\u1EE3p"}
            <ArrowDown className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
