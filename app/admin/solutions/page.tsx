import { Suspense } from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SolutionsTable } from "./components/solutions-table"
import { PurchaseHistory } from "./components/purchase-history"
import { SolutionsStats } from "./components/solutions-stats"

export default async function AdminSolutionsPage() {
  const supabase = await getSupabaseServerClient()

  // Check if user is authenticated and admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: userData } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

  if (!userData?.is_admin) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Gói Dịch Vụ</h1>
        <p className="text-muted-foreground mt-2">
          Xem và quản lý các gói nam dược, giá bán, và lịch sử mua hàng
        </p>
      </div>

      <Suspense fallback={<div>Đang tải thống kê...</div>}>
        <SolutionsStats />
      </Suspense>

      <Tabs defaultValue="solutions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="solutions">Danh sách gói</TabsTrigger>
          <TabsTrigger value="purchases">Lịch sử mua hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="solutions" className="space-y-4">
          <Suspense fallback={<div>Đang tải danh sách gói...</div>}>
            <SolutionsTable />
          </Suspense>
        </TabsContent>

        <TabsContent value="purchases">
          <Suspense fallback={<div>Đang tải lịch sử...</div>}>
            <PurchaseHistory />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
