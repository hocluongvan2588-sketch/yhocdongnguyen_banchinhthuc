"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { BookOpen, Sparkles, Zap, Target, ArrowLeft } from "lucide-react"

export default function LearnPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Tìm Hiểu Mai Hoa Dịch Số</h1>
              <p className="text-sm text-muted-foreground mt-1">Khám phá phương pháp dự đoán linh hoạt</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Mai Hoa Dịch Số là gì?</CardTitle>
              </div>
              <CardDescription className="text-base">
                梅花易数 - Phương pháp khởi quẻ linh hoạt từ Triều Bắc Tống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Mai Hoa Dịch Số</strong> (梅花易数) là phương pháp dự đoán dựa trên
                Kinh Dịch, do <strong className="text-foreground">Thiệu Ung</strong> (邵雍, 1011-1077, Triều Bắc Tống)
                sáng lập. Tên gọi xuất phát từ câu chuyện Thiệu Ung thấy hai chim sẻ tranh nhau trên cành hoa mơ, từ đó
                khởi quẻ và đoán chính xác sự việc sắp xảy ra.
              </p>
              <p>
                Khác với phương pháp <strong className="text-foreground">Tứ Trụ Bát Tự</strong> hay{" "}
                <strong className="text-foreground">Lục Hào</strong> truyền thống cần nhiều công cụ phức tạp, Mai Hoa
                Dịch Số cho phép <strong className="text-foreground">khởi quẻ từ bất cứ đâu</strong>: thời gian, âm
                thanh, màu sắc, phương hướng, số lượng sự vật, thậm chí từ cảm nhận tức thời.
              </p>
            </CardContent>
          </Card>

          {/* Core Principles */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle>Phương Pháp Khởi Quẻ</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">1. Theo Thời Gian</h4>
                    <p className="text-sm text-muted-foreground">
                      • Thượng quẻ = (Năm + Tháng + Ngày) mod 8<br />• Hạ quẻ = (Năm + Tháng + Ngày + Giờ) mod 8<br />•
                      Động hào = (Năm + Tháng + Ngày + Giờ) mod 6
                    </p>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">2. Theo Sự Vật</h4>
                    <p className="text-sm text-muted-foreground">
                      Quan sát vật thể xung quanh, đếm số lượng hoặc phương vị xuất hiện để lập quẻ
                    </p>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">3. Theo Số Tự Nhiên</h4>
                    <p className="text-sm text-muted-foreground">
                      Lấy số ngẫu nhiên hoặc số có ý nghĩa đặc biệt để khởi quẻ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <CardTitle>Thể Dụng Lý Thuyết</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Thể Dụng</strong> (体用) là cốt lõi của Mai Hoa Dịch Số:
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Badge variant="outline">Thể quẻ</Badge>
                      <span className="text-sm font-normal text-muted-foreground">體卦</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Quẻ không có động hào, đại diện cho{" "}
                      <strong className="text-foreground">bản thân, chủ động</strong>, là cái cần bảo vệ và nuôi dưỡng.
                    </p>
                  </div>

                  <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Badge variant="outline">Dụng quẻ</Badge>
                      <span className="text-sm font-normal text-muted-foreground">用卦</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Quẻ có động hào, đại diện cho <strong className="text-foreground">ngoại cảnh, tác động</strong>,
                      là yếu tố biến đổi.
                    </p>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Quan hệ Ngũ Hành</strong> giữa Thể và Dụng quyết định cát
                      hung:
                      <br />• <span className="text-primary">Dụng sinh Thể</span> → Cát
                      <br />• <span className="text-primary">Thể sinh Dụng</span> → Tiêu hao
                      <br />• <span className="text-destructive">Dụng khắc Thể</span> →흉
                      <br />• <span className="text-primary">Thể khắc Dụng</span> → Kiểm soát được
                      <br />• <span className="text-muted-foreground">Thể Dụng hòa</span> → Bình thường
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Eight Trigrams Reference */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle>Bát Quái và Ngũ Hành</CardTitle>
              </div>
              <CardDescription>Tám quẻ cơ bản và thuộc tính của chúng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Càn", element: "Kim", symbol: "☰", nature: "Trời, cha" },
                  { name: "Đoài", element: "Kim", symbol: "☱", nature: "Đầm, thiếu nữ" },
                  { name: "Ly", element: "Hỏa", symbol: "☲", nature: "Lửa, trung nữ" },
                  { name: "Chấn", element: "Mộc", symbol: "☳", nature: "Sấm, trưởng nam" },
                  { name: "Tốn", element: "Mộc", symbol: "☴", nature: "Gió, trưởng nữ" },
                  { name: "Khảm", element: "Thủy", symbol: "☵", nature: "Nước, trung nam" },
                  { name: "Cấn", element: "Thổ", symbol: "☶", nature: "Núi, thiếu nam" },
                  { name: "Khôn", element: "Thổ", symbol: "☷", nature: "Đất, mẹ" },
                ].map((trigram, idx) => (
                  <div key={idx} className="p-3 bg-secondary/30 rounded-lg text-center">
                    <div className="text-2xl mb-1">{trigram.symbol}</div>
                    <div className="font-semibold text-foreground">{trigram.name}</div>
                    <Badge variant="outline" className="mt-1 mb-2">
                      {trigram.element}
                    </Badge>
                    <div className="text-xs text-muted-foreground">{trigram.nature}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application in Medicine */}
          <Card className="border-border/50 shadow-lg bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Ứng Dụng Trong Y Học</CardTitle>
              <CardDescription>Kết hợp Mai Hoa Dịch Số với Y học cổ truyền</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Hệ thống <strong className="text-foreground">Y Dịch Đồng Nguyên</strong> kết hợp Mai Hoa Dịch Số với{" "}
                <strong className="text-foreground">Hoàng Đế Nội Kinh</strong> (黄帝内经) để chẩn đoán sức khỏe:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Bát Quái ↔ Tạng Phủ</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Càn (Kim) → Đại trường, phổi</li>
                    <li>• Đoài (Kim) → Phổi, hô hấp</li>
                    <li>• Ly (Hỏa) → Tim, tiểu trường</li>
                    <li>• Chấn (Mộc) → Gan, mật</li>
                    <li>• Tốn (Mộc) → Gan, đường mật</li>
                    <li>• Khảm (Thủy) → Thận, bàng quang</li>
                    <li>• Cấn (Thổ) → Tỳ, vị</li>
                    <li>• Khôn (Thổ) → Tỳ, tiêu hóa</li>
                  </ul>
                </div>

                <div className="p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Phương Pháp Điều Trị</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong className="text-foreground">Khai huyệt:</strong> Bấm huyệt theo kinh mạch
                    </li>
                    <li>
                      • <strong className="text-foreground">Nam Dược:</strong> Phương thuốc từ dược liệu Nam Bộ
                    </li>
                    <li>
                      • <strong className="text-foreground">Tượng số:</strong> Niệm số năng lượng Bát Quái
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm">
                  <strong className="text-foreground">Nguyên lý:</strong> Phân tích quan hệ Thể Dụng và Ngũ Hành sinh
                  khắc để xác định tạng phủ nào đang thừa (thịnh) hay thiếu (suy), từ đó đề xuất phương pháp điều trị
                  cân bằng âm dương trong cơ thể.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" onClick={() => router.push("/")}>
              Bắt Đầu Khởi Quẻ
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
