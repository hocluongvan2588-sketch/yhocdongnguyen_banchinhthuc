"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getTrigramByNumber } from "@/lib/data/trigram-data"
import { getHexagramByTrigrams } from "@/lib/data/hexagram-data"
import { HexagramSVG } from "@/components/hexagram-svg"
import { useRouter } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { Sparkles, BookOpen, Info, ArrowRight, HelpCircle, CheckCircle2, Clock, Hash } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MaiHoaGuardrailModal } from "@/components/mai-hoa-guardrail-modal"
import { canUserDivine, saveDivinationRecord } from "@/lib/actions/divination-actions"
import { useAuth } from "@/lib/auth/use-auth" // Import useAuth hook

interface TimeInput {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

interface DivinationRecord {
  timestamp: number
  concern: string
}

function calculateHexagramWithMinute(input: TimeInput) {
  const { year, month, day, hour, minute } = input

  // Chuyển giờ sang địa chi (1-12)
  const hourBranch = getHourBranch(hour)

  // Quẻ Thượng: (Năm + Tháng + Ngày) % 8, dư 0 lấy 8
  const upperSum = year + month + day
  const upperTrigram = upperSum % 8 === 0 ? 8 : upperSum % 8

  // Quẻ Hạ: (Năm + Tháng + Ngày + Giờ địa chi) % 8, dư 0 lấy 8
  const lowerSum = year + month + day + hourBranch
  const lowerTrigram = lowerSum % 8 === 0 ? 8 : lowerSum % 8

  // Hào Động: (Năm + Tháng + Ngày + Giờ địa chi + Phút) % 6, dư 0 lấy 6
  // Thêm phút để đa dạng hóa kết quả hào động
  const movingSum = year + month + day + hourBranch + minute
  const movingLine = movingSum % 6 === 0 ? 6 : movingSum % 6

  return {
    upperTrigram,
    lowerTrigram,
    movingLine,
    hourBranch,
  }
}

function getHourBranch(hour: number): number {
  // Tý (23:00-00:59) = 1
  // Sửu (01:00-02:59) = 2
  // Dần (03:00-04:59) = 3
  // Mão (05:00-06:59) = 4
  // Thìn (07:00-08:59) = 5
  // Tỵ (09:00-11:00) = 6
  // Ngọ (11:00-13:00) = 7
  // Mùi (13:00-15:00) = 8
  // Thân (15:00-17:00) = 9
  // Dậu (17:00-19:00) = 10
  // Tuất (19:00-21:00) = 11
  // Hợi (21:00-23:00) = 12
  if (hour === 23 || hour === 0) return 1 // Tý
  return Math.floor((hour + 1) / 2) + 1
}

function getHourBranchName(branch: number): string {
  const names = ["", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]
  return names[branch] || ""
}

const ZODIAC_HOURS = [
  { label: "Tý (23:00-01:00)", value: 1 },
  { label: "Sửu (01:00-03:00)", value: 2 },
  { label: "Dần (03:00-05:00)", value: 3 },
  { label: "Mão (05:00-07:00)", value: 4 },
  { label: "Thìn (07:00-09:00)", value: 5 },
  { label: "Tỵ (09:00-11:00)", value: 6 },
  { label: "Ngọ (11:00-13:00)", value: 7 },
  { label: "Mùi (13:00-15:00)", value: 8 },
  { label: "Thân (15:00-17:00)", value: 9 },
  { label: "Dậu (17:00-19:00)", value: 10 },
  { label: "Tuất (19:00-21:00)", value: 11 },
  { label: "Hợi (21:00-23:00)", value: 12 },
]

function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
  const s1 = normalize(text1)
  const s2 = normalize(text2)

  if (s1 === s2) return 1.0

  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  const commonWords = words1.filter((w) => words2.includes(w)).length
  const similarity = (2 * commonWords) / (words1.length + words2.length)

  return similarity
}

function findSimilarPreviousQuestion(
  currentQuestion: string,
  history: DivinationRecord[],
): { found: boolean; record?: DivinationRecord; similarity?: number } {
  if (!currentQuestion || history.length === 0) {
    return { found: false }
  }

  for (const record of history.slice().reverse()) {
    const similarity = calculateSimilarity(currentQuestion, record.concern)
    if (similarity >= 0.8) {
      // 80% giống nhau
      return { found: true, record, similarity }
    }
  }

  return { found: false }
}

export default function MainPage() {
  const router = useRouter()
  const { user, setShowAuthGateModal, AuthGateModal } = useAuth() // Declare user, setShowAuthGateModal, and AuthGateModal using useAuth hook

  const [input, setInput] = useState<TimeInput>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  })

  const [result, setResult] = useState<{
    upperTrigram: number
    lowerTrigram: number
    movingLine: number
    hexagramName: string
    transformedUpperTrigram?: number
    transformedLowerTrigram?: number
    transformedHexagramName?: string
  } | null>(null)
  const [divinationMethod, setDivinationMethod] = useState<"time" | "number">("time")
  const [numberInput, setNumberInput] = useState({ upper: "", lower: "", moving: "" })
  const [healthConcern, setHealthConcern] = useState("")

  const [guardrailModal, setGuardrailModal] = useState<{
    isOpen: boolean
    reason: string
    details?: any
  }>({
    isOpen: false,
    reason: "",
  })

  const currentHourBranch = getHourBranch(input.hour)
  const currentHourBranchName = getHourBranchName(currentHourBranch)

  async function handleNavigateToDiagnosis() {
    if (!user) {
      setShowAuthGateModal(true)
      return
    }

    // Comprehensive check theo nguyên tắc Mai Hoa
    const checkResult = await canUserDivine(healthConcern)

    if (!checkResult.allowed) {
      setGuardrailModal({
        isOpen: true,
        reason: checkResult.reason || "Không thể gieo quẻ lúc này",
        details: checkResult.details,
      })
      return
    }

    // Allowed - proceed with divination
    if (divinationMethod === "time") {
      const timeInput: TimeInput = {
        year: input.year,
        month: input.month,
        day: input.day,
        hour: input.hour,
        minute: input.minute,
      }

      const result = calculateHexagramWithMinute(timeInput)

      // Save to database
      await saveDivinationRecord({
        year: timeInput.year,
        month: timeInput.month,
        day: timeInput.day,
        hour: timeInput.hour,
        upperTrigram: result.upperTrigram,
        lowerTrigram: result.lowerTrigram,
        movingLine: result.movingLine,
        hexagramName: result.hexagramName,
        healthConcern: healthConcern,
      })

      router.push(
        `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&year=${timeInput.year}&month=${timeInput.month}&day=${timeInput.day}&hour=${timeInput.hour}&minute=${timeInput.minute}&method=time`,
      )
    } else {
      // Manual method
      const upper = Number.parseInt(numberInput.upper) || 1
      const lower = Number.parseInt(numberInput.lower) || 1
      const moving = Number.parseInt(numberInput.moving) || 1

      const upperMod = ((upper - 1) % 8) + 1
      const lowerMod = ((lower - 1) % 8) + 1
      const movingMod = ((moving - 1) % 6) + 1

      const upperTrigram = getTrigramByNumber(upperMod)
      const lowerTrigram = getTrigramByNumber(lowerMod)
      const hexagram = getHexagramByTrigrams(upperMod, lowerMod)

      // Save to database
      await saveDivinationRecord({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: new Date().getHours(),
        upperTrigram: upperMod,
        lowerTrigram: lowerMod,
        movingLine: movingMod,
        hexagramName: hexagram?.vietnamese || `${upperTrigram?.vietnamese} ${lowerTrigram?.vietnamese}`,
        healthConcern: healthConcern,
      })

      router.push(
        `/diagnosis?upper=${upperMod}&lower=${lowerMod}&moving=${movingMod}&healthConcern=${encodeURIComponent(healthConcern)}&method=number`,
      )
    }
  }

  const upperTrigram = result ? getTrigramByNumber(result.upperTrigram) : null
  const lowerTrigram = result ? getTrigramByNumber(result.lowerTrigram) : null
  const hexagramData = result ? getHexagramByTrigrams(result.upperTrigram, result.lowerTrigram) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="accent-border-left">
              <h1 className="text-xl font-bold">Y Dịch Đồng Nguyên</h1>
              <p className="text-xs text-muted-foreground">梅花易数 • Mai Hoa Dịch Số</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/learn")}>
              <BookOpen className="w-4 h-4 mr-2" />
              Tìm hiểu
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="hero-pattern" />
        <div className="container px-4 mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                Y học cổ truyền Trung Quốc
              </Badge>
              <h1 className="text-foreground">
                Khám phá sức khỏe qua
                <span className="block text-primary mt-2">Mai Hoa Dịch Số</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Phương pháp khởi quẻ linh hoạt, phân tích <strong>Thể Dụng</strong> chính xác. Kết hợp Y học cổ truyền
                để chẩn đoán tình trạng sức khỏe và đưa ra giải pháp điều trị cụ thể.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("divination-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="gap-2"
                >
                  Bắt đầu khởi quẻ
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/learn")}>
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/10">
                <img
                  src="/traditional-chinese-medicine-herbs-acupuncture-nee.jpg"
                  alt="Y học cổ truyền"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Chọn phương pháp khởi quẻ phù hợp với bạn</h2>

            <Alert className="max-w-2xl mx-auto mt-4 border-primary/20 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Nguyên tắc quan trọng:</strong> Một người chỉ nên khởi quẻ cho một việc duy nhất trong mỗi thời
                khắc (cách nhau tối thiểu 1 ngày). Tâm chí phải tập trung, chân thành thì quẻ mới linh ứng.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input form */}
            <Card className="border-2">
              <CardHeader className="border-b bg-secondary/30">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Nhập Thông Tin Khởi Quẻ
                </CardTitle>
                <CardDescription>Chọn phương pháp khởi quẻ phù hợp với tình huống của bạn</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Trust indicators */}
                <div className="mb-6 p-4 bg-jade/5 border border-jade/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-jade mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Cam kết bảo mật thông tin</p>
                      <p className="text-xs text-muted-foreground">
                        Thông tin của bạn được mã hóa và chỉ sử dụng cho mục đích chẩn đoán. Chúng tôi tuân thủ nghiêm
                        ngặt quy định về bảo mật dữ liệu y tế.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Health concern field */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-primary" />
                      Chủ tố (Lý do hỏi quẻ)
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      Quan trọng
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="Mô tả tình trạng sức khỏe hoặc vấn đề bạn muốn hỏi. Ví dụ: Đau đầu thường xuyên, mất ngủ, đau dạ dày..."
                    value={healthConcern}
                    onChange={(e) => setHealthConcern(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Gợi ý:</strong> Mô tả cụ thể triệu chứng, thời gian xuất hiện, và mức độ ảnh hưởng để nhận
                      được chẩn đoán chính xác hơn.
                    </span>
                  </p>
                </div>

                <Tabs value={divinationMethod} onValueChange={(v) => setDivinationMethod(v as "time" | "number")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="time" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Theo Thời Gian
                    </TabsTrigger>
                    <TabsTrigger value="number" className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Theo Số
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="time" className="space-y-4">
                    <Alert className="bg-primary/5 border-primary/20">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        <strong>Phương pháp Niên Nguyệt Nhật Thời</strong> (年月日时起卦)
                        <br />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Dựa trên nguyên lý "Thiên Nhân Hợp Nhất" - thời điểm hỏi quẻ phản ánh trạng thái năng lượng
                          của người hỏi. Phương pháp này được Thiệu Ung (邵雍) phát triển và ghi chép trong Mai Hoa Dịch
                          Số.
                        </span>
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Năm
                          <span className="text-xs text-muted-foreground">(Dương lịch)</span>
                        </Label>
                        <Input
                          type="number"
                          value={input.year}
                          onChange={(e) => setInput({ ...input, year: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Tháng
                          <span className="text-xs text-muted-foreground">(Âm lịch)</span>
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={input.month}
                          onChange={(e) => setInput({ ...input, month: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        Ngày
                        <span className="text-xs text-muted-foreground">(Âm lịch)</span>
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={input.day}
                        onChange={(e) => setInput({ ...input, day: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Giờ
                          <span className="text-xs text-muted-foreground">(0-23)</span>
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          value={input.hour}
                          onChange={(e) => setInput({ ...input, hour: Number.parseInt(e.target.value) || 0 })}
                          placeholder="VD: 14"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Phút
                          <span className="text-xs text-muted-foreground">(0-59)</span>
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={input.minute}
                          onChange={(e) => setInput({ ...input, minute: Number.parseInt(e.target.value) || 0 })}
                          placeholder="VD: 30"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Địa Chi tương ứng:</span>
                        <Badge variant="outline" className="font-semibold">
                          Giờ {currentHourBranchName} ({currentHourBranch}/12)
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Giờ và phút được tự động cập nhật theo thời gian thực (múi giờ Việt Nam +7). Bạn có thể tự nhập
                        nếu muốn xem quẻ cho thời điểm khác.
                      </p>
                    </div>

                    <Button onClick={handleNavigateToDiagnosis} className="w-full mt-6" size="lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Khởi Quẻ Theo Thời Gian
                    </Button>
                  </TabsContent>

                  <TabsContent value="number" className="space-y-4">
                    <Alert className="bg-accent/5 border-accent/20">
                      <Info className="h-4 w-4 text-accent" />
                      <AlertDescription className="text-sm">
                        <strong>Phương pháp Trực Tiếp Số Tự Nhiên</strong> (直接数字起卦)
                        <br />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Sử dụng số ngẫu nhiên hoặc số có ý nghĩa với bạn (số điện thoại, ngày sinh, số nhà...). Nguyên
                          lý "Vạn vật giai số" - mọi sự vật đều có thể biểu thị bằng số.
                        </span>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Số Thượng Quẻ
                          <span className="text-xs text-muted-foreground">(Quẻ trên)</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="Nhập số bất kỳ (VD: 15, 88, 123...)"
                          value={numberInput.upper}
                          onChange={(e) => setNumberInput({ ...numberInput, upper: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Số ÷ 8 lấy dư → xác định 1 trong 8 quẻ cơ bản (Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Số Hạ Quẻ
                          <span className="text-xs text-muted-foreground">(Quẻ dưới)</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="Nhập số bất kỳ"
                          value={numberInput.lower}
                          onChange={(e) => setNumberInput({ ...numberInput, lower: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Số Động Hào
                          <span className="text-xs text-muted-foreground">(Hào biến đổi)</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="Nhập số bất kỳ"
                          value={numberInput.moving}
                          onChange={(e) => setNumberInput({ ...numberInput, moving: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Số ÷ 6 lấy dư → xác định hào động từ 1-6 (đếm từ dưới lên)
                        </p>
                      </div>

                      <Button onClick={handleNavigateToDiagnosis} className="w-full mt-6" size="lg">
                        <Hash className="w-4 h-4 mr-2" />
                        Khởi Quẻ Theo Số
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Result display */}
            <Card className={`border-2 ${result ? "result-card" : "border-border"}`}>
              <CardHeader className="border-b bg-secondary/30">
                <CardTitle>Kết Quả Gieo Quẻ</CardTitle>
                <CardDescription>{result ? "Quẻ đã được khởi thành công" : "Chờ khởi quẻ"}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {result ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Quẻ Chủ (Main Hexagram) */}
                      <div className="p-6 rounded-lg border bg-card space-y-4">
                        <div className="text-center space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">1. QUẺ CHỦ (GỐC)</p>
                        </div>

                        <div className="flex justify-center">
                          <HexagramSVG
                            upperLines={upperTrigram?.lines || [true, true, true]}
                            lowerLines={lowerTrigram?.lines || [true, true, true]}
                            movingLine={result.movingLine}
                            className="w-32 h-auto"
                          />
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-bold text-foreground">{hexagramData?.chinese}</h3>
                          <p className="text-lg text-primary font-medium">{hexagramData?.vietnamese}</p>
                        </div>

                        <div className="flex justify-center">
                          <Badge variant="secondary" className="text-sm">
                            {hexagramData?.category || "THẾ DỤNG"}
                          </Badge>
                        </div>
                      </div>

                      {/* Quẻ Động (Moving Line Info) */}
                      <div className="p-6 rounded-lg border bg-card space-y-4">
                        <div className="text-center space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">2. QUẺ BIẾN (变卦)</p>
                        </div>

                        <div className="flex justify-center">
                          <HexagramSVG
                            upperLines={
                              result.transformedUpperTrigram
                                ? getTrigramByNumber(result.transformedUpperTrigram)?.lines || [true, true, true]
                                : upperTrigram?.lines || [true, true, true]
                            }
                            lowerLines={
                              result.transformedLowerTrigram
                                ? getTrigramByNumber(result.transformedLowerTrigram)?.lines || [true, true, true]
                                : lowerTrigram?.lines || [true, true, true]
                            }
                            movingLine={undefined}
                            className="w-32 h-auto"
                          />
                        </div>

                        <div className="text-center space-y-2">
                          <p className="text-2xl font-bold text-primary">
                            {result.transformedHexagramName
                              ? getHexagramByTrigrams(result.transformedUpperTrigram!, result.transformedLowerTrigram!)
                                  ?.chinese || ""
                              : hexagramData?.chinese || ""}
                          </p>
                          <p className="text-lg font-medium text-accent">
                            {result.transformedHexagramName || hexagramData?.vietnamese || ""}
                          </p>
                          <p className="text-sm text-muted-foreground mt-3">
                            Quẻ sau khi <strong>Hào {result.movingLine}</strong> biến đổi
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <Badge variant="secondary" className="text-sm">
                            Xu Hướng Biến Hóa
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Phân tích sơ bộ tình trạng sức khỏe
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Dựa trên quẻ <strong>{hexagramData?.vietnamese}</strong> với động hào thứ {result.movingLine},
                        hệ thống đã xác định được xu hướng năng lượng và mối liên hệ với tình trạng sức khỏe của bạn.
                        Quẻ tượng phản ánh sự tương tác giữa các yếu tố âm dương và ngũ hành trong cơ thể.
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Để xem phân tích chi tiết về tình trạng bệnh lý, phương pháp điều trị và các khuyến nghị cụ thể,
                        vui lòng nhấn nút bên dưới để chuyển sang trang chẩn đoán chuyên sâu.
                      </p>
                    </div>

                    <Button onClick={handleNavigateToDiagnosis} className="w-full" size="lg">
                      Xem Kết Quả Chẩn Đoán Chi Tiết
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Chưa có kết quả</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Chọn phương pháp khởi quẻ và nhập thông tin để bắt đầu
                    </p>

                    <div className="mt-8 text-left w-full max-w-sm space-y-3">
                      <p className="text-sm font-medium text-foreground">Hướng dẫn nhanh:</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            1
                          </span>
                          <span>Mô tả tình trạng sức khỏe trong phần "Chủ tố"</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            2
                          </span>
                          <span>Chọn phương pháp khởi quẻ phù hợp</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            3
                          </span>
                          <span>Nhấn "Khởi Quẻ" để xem kết quả</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/ancient-chinese-medical-text-book-i-ching-hexagram.jpg"
                  alt="Sách y học cổ"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-6">
              <Badge variant="outline">Tài liệu tham khảo</Badge>
              <h2 className="text-foreground">Nền tảng lý luận vững chắc</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hệ thống được xây dựng dựa trên các tài liệu kinh điển: <strong>Mai Hoa Dịch Số</strong> của Thiệu Ung,
                <strong> Hoàng Đế Nội Kinh</strong> (黄帝内经), <strong>Châm Cứu Đại Thành</strong>, và phương pháp trị
                liệu độc quyền phát triển từ thực hành lâm sàng.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-jade flex-shrink-0" />
                  <span className="font-medium text-foreground">Khởi quẻ chính xác</span>
                </li>
                <span className="text-muted-foreground">Phương pháp khởi quẻ chuẩn xác theo Mai Hoa Dịch Số</span>
              </ul>
              <Button variant="outline" onClick={() => router.push("/learn")}>
                Tìm hiểu thêm
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold text-foreground">Y Dịch Đồng Nguyên</p>
              <p className="text-sm text-muted-foreground">Kết hợp Y học cổ truyền và Dịch học</p>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Bản quyền thuộc về Y Dịch Đồng Nguyên
            </p>
          </div>
        </div>
      </footer>

      {/* AuthGateModal component */}
      <AuthGateModal />

      {/* MaiHoaGuardrailModal */}
      <MaiHoaGuardrailModal
        isOpen={guardrailModal.isOpen}
        onClose={() => setGuardrailModal({ isOpen: false, reason: "" })}
        reason={guardrailModal.reason}
        details={guardrailModal.details}
      />
    </div>
  )
}
