"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Mail, Calendar, ShoppingBag } from "lucide-react"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { getUserAccessibleSolutions } from "@/lib/actions/solution-actions"
import type { Solution, UserAccess } from "@/lib/supabase/types"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; full_name?: string; created_at?: string } | null>(null)
  const [purchases, setPurchases] = useState<
    Array<{
      access: UserAccess
      solution: Solution
    }>
  >([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      // Get current user
      const { user: currentUser } = await getCurrentUser()

      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      setUser(currentUser)

      // Get purchased solutions
      const { accessRecords } = await getUserAccessibleSolutions()

      if (accessRecords) {
        const formattedPurchases = accessRecords.map((record: any) => ({
          access: record,
          solution: record.solutions,
        }))
        setPurchases(formattedPurchases)
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email.charAt(0).toUpperCase()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getSolutionTypeLabel = (type: string) => {
    const labels = {
      acupoint: "Khai Huyệt",
      herbal: "Dùng Thuốc",
      numerology: "Tượng Số",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Trang Cá Nhân</h1>
              <p className="text-sm text-muted-foreground mt-1">Quản lý thông tin và gói đã mua</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              Trang chủ
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Info Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Thông Tin Cá Nhân</CardTitle>
              <CardDescription>Thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">{user.full_name || "Người dùng"}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                  </div>
                </div>

                {user.created_at && (
                  <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ngày tham gia</p>
                      <p className="text-sm font-medium text-foreground">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Purchased Solutions */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Gói Đã Mua
                  </CardTitle>
                  <CardDescription>Các giải pháp bạn có quyền truy cập</CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {purchases.length} gói
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">Bạn chưa mua gói nào</p>
                  <Button onClick={() => router.push("/")}>Khám phá ngay</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map(({ access, solution }) => (
                    <div key={access.id} className="p-4 bg-secondary/20 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{solution.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{solution.description}</p>
                        </div>
                        <Badge variant="default">{getSolutionTypeLabel(solution.solution_type)}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(access.access_granted_at)}</span>
                          </div>
                          {solution.price && (
                            <div>
                              <span className="font-semibold text-primary">
                                {solution.price.toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                          )}
                        </div>

                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          Truy cập trọn đời
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{purchases.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Gói đã mua</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {purchases.reduce((sum, { solution }) => sum + (solution.price || 0), 0).toLocaleString("vi-VN")}đ
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Tổng chi tiêu</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {new Set(purchases.map((p) => p.solution.hexagram)).size}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Quẻ đã tư vấn</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
