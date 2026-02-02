import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { getSupabaseServerClient } from "@/lib/supabase/server" // Declare the variable before using it

export async function PurchaseHistory() {
  const supabase = await createClient()

  // Get user_access records for prescription solutions with user and solution details
  const { data: purchases } = await supabase
    .from("user_access")
    .select(
      `
      id,
      unlocked_at,
      user_id,
      users!inner(email, full_name),
      solutions!inner(
        hexagram_key,
        title,
        solution_type,
        unlock_cost
      )
    `,
    )
    .eq("solutions.solution_type", "prescription")
    .order("unlocked_at", { ascending: false })
    .limit(100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử mua gói Nam Dược (100 gần nhất)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Quẻ</TableHead>
                <TableHead>Bài thuốc</TableHead>
                <TableHead>Giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!purchases || purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Chưa có lịch sử mua hàng
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase) => {
                  const user = purchase.users as any
                  const solution = purchase.solutions as any

                  return (
                    <TableRow key={purchase.id}>
                      <TableCell className="text-sm">
                        {formatDistanceToNow(new Date(purchase.unlocked_at), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{user?.full_name || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user?.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{solution?.hexagram_key}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">{solution?.title}</TableCell>
                      <TableCell>{solution?.unlock_cost} coin</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
