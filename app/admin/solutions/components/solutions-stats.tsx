import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server" // Declare the variable here

export async function SolutionsStats() {
  const supabase = await createClient()

  // Get total solutions count
  const { count: totalSolutions } = await supabase
    .from("solutions")
    .select("*", { count: "exact", head: true })
    .eq("solution_type", "prescription")

  // Get total purchases count (user_access for prescription packages)
  const { count: totalPurchases } = await supabase
    .from("user_access")
    .select("solution_id, solutions!inner(solution_type)", { count: "exact", head: true })
    .eq("solutions.solution_type", "prescription")

  // Get unique buyers
  const { data: buyers } = await supabase
    .from("user_access")
    .select("user_id, solutions!inner(solution_type)")
    .eq("solutions.solution_type", "prescription")

  const uniqueBuyers = buyers ? new Set(buyers.map((b) => b.user_id)).size : 0

  // Calculate total revenue from purchases table
  const { data: purchases } = await supabase
    .from("purchases")
    .select("amount_vnd")
    .eq("status", "completed")
    .eq("package_type", "nam_duoc")

  const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount_vnd || 0), 0) || 0

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng gói dịch vụ</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSolutions || 64}</div>
          <p className="text-xs text-muted-foreground">Bài thuốc nam dược</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lượt mua</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPurchases || 0}</div>
          <p className="text-xs text-muted-foreground">Tổng lượt unlock</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueBuyers}</div>
          <p className="text-xs text-muted-foreground">Người đã mua</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(totalRevenue / 1000).toFixed(0)}k</div>
          <p className="text-xs text-muted-foreground">VNĐ từ nam dược</p>
        </CardContent>
      </Card>
    </div>
  )
}
