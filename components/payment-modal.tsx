"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { processPayment } from "@/lib/actions/payment-actions"
import { getSolutionsByHexagram } from "@/lib/actions/solution-actions"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { getTrigramByNumber } from "@/lib/data/trigram-data"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  packageNumber: 1 | 2 | 3 | null
  upper: number
  lower: number
  moving: number
}

const PACKAGE_INFO = {
  1: {
    name: "Gói Khai Huyệt",
    price: "299.000đ",
    amount: 299000,
    route: "/treatment/acupressure",
    solutionType: "acupoint" as const,
  },
  2: {
    name: "Gói Dùng Thuốc",
    price: "199.000đ",
    amount: 199000,
    route: "/treatment/herbal",
    solutionType: "herbal" as const,
  },
  3: {
    name: "Gói Tượng Số",
    price: "99.000đ",
    amount: 99000,
    route: "/treatment/numerology",
    solutionType: "numerology" as const,
  },
}

export function PaymentModal({ isOpen, onClose, packageNumber, upper, lower, moving }: PaymentModalProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!packageNumber) return null

  const packageInfo = PACKAGE_INFO[packageNumber]

  const handlePayment = async () => {
    setError(null)
    setIsProcessing(true)

    try {
      // Step 1: Check if user is authenticated
      const { user } = await getCurrentUser()

      if (!user) {
        setError("Bạn cần đăng nhập để thanh toán")
        setIsProcessing(false)
        return
      }

      // Step 2: Get hexagram name
      const upperTrigram = getTrigramByNumber(upper)
      const lowerTrigram = getTrigramByNumber(lower)
      const hexagramName = `${upperTrigram.vietnamese} ${lowerTrigram.vietnamese}`

      // Step 3: Find solution ID for this hexagram and package type
      const { solutions, error: solutionError } = await getSolutionsByHexagram(hexagramName)

      if (solutionError || !solutions || solutions.length === 0) {
        setError("Không tìm thấy giải pháp cho quẻ này")
        setIsProcessing(false)
        return
      }

      const solution = solutions.find((s) => s.solution_type === packageInfo.solutionType)

      if (!solution) {
        setError(`Không tìm thấy ${packageInfo.name} cho quẻ này`)
        setIsProcessing(false)
        return
      }

      // Step 4: Process payment (simulated for demo, but uses real backend)
      const result = await processPayment({
        solutionId: solution.id,
        paymentMethod: "card",
        amount: packageInfo.amount,
        cardInfo: {
          cardNumber,
          cardName,
          expiry,
          cvv,
        },
      })

      if (result.error) {
        setError(result.error)
        setIsProcessing(false)
        return
      }

      // Step 5: Payment successful!
      setSuccess(true)
      setIsProcessing(false)

      // Wait a bit to show success message, then redirect
      setTimeout(() => {
        onClose()
        const params = new URLSearchParams({
          upper: upper.toString(),
          lower: lower.toString(),
          moving: moving.toString(),
        })
        router.push(`${packageInfo.route}?${params.toString()}`)
        router.refresh() // Refresh to update access state
      }, 1500)
    } catch (err) {
      console.error("[v0] Payment error:", err)
      setError("Đã xảy ra lỗi trong quá trình thanh toán")
      setIsProcessing(false)
    }
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">Thanh Toán Thành Công!</h3>
              <p className="text-muted-foreground">Đang chuyển đến nội dung...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Thanh Toán</DialogTitle>
          <DialogDescription>{packageInfo.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Package Summary */}
          <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
            <span className="font-medium text-foreground">{packageInfo.name}</span>
            <span className="text-2xl font-bold text-primary">{packageInfo.price}</span>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Tên trên thẻ</Label>
              <Input
                id="cardName"
                placeholder="NGUYEN VAN A"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Số thẻ</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "")
                    const formatted = value.match(/.{1,4}/g)?.join(" ") || value
                    setCardNumber(formatted)
                  }}
                  maxLength={19}
                  disabled={isProcessing}
                />
                <CreditCard className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Ngày hết hạn</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={3}
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              `Thanh toán ${packageInfo.price}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Đây là giao diện thanh toán giả lập cho mục đích demo
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
