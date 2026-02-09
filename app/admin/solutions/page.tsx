import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SolutionsTable } from "./components/solutions-table"
import { PurchaseHistory } from "./components/purchase-history"
import { SolutionsStats } from "./components/solutions-stats"
import { getSupabaseServerClient } from "@/lib/supabase/server" // Declare the variable before using it

export default async function AdminSolutionsPage() {
  const supabase = await createClient()

  // Check if user is authenticated and admin (using profiles.role like admin layout)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  console.log('[v0] Solutions page - user:', user.id);
  console.log('[v0] Solutions page - profile:', profile);

  if (!profile || profile.role !== 'admin') {
    console.log('[v0] Solutions page - NOT ADMIN, redirecting');
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
