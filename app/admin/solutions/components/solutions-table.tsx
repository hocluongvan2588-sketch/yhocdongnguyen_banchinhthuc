"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye } from "lucide-react"
import { getAllSolutions } from "@/lib/actions/admin-actions"
import { SolutionEditDialog } from "./solution-edit-dialog"

interface Solution {
  id: string
  hexagram_key: string
  solution_type: string
  title: string
  description: string | null
  unlock_cost: number
  herb_name: string | null
  meridian_pathway: string | null
  preparation_method: string | null
  reference_source: string | null
}

export function SolutionsTable() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null)

  useEffect(() => {
    loadSolutions()
  }, [])

  async function loadSolutions() {
    setLoading(true)
    const result = await getAllSolutions()
    if (result.solutions) {
      // Filter only prescription type for nam duoc
      const prescriptions = result.solutions.filter((s) => s.solution_type === "prescription")
      setSolutions(prescriptions)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách gói Nam Dược ({solutions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quẻ</TableHead>
                  <TableHead>Tên bài thuốc</TableHead>
                  <TableHead>Vị thuốc</TableHead>
                  <TableHead>Kinh lạc</TableHead>
                  <TableHead>Giá unlock</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Chưa có dữ liệu. Chạy script seed để thêm 64 bài thuốc.
                    </TableCell>
                  </TableRow>
                )}
                {solutions.map((solution) => (
                  <TableRow key={solution.id}>
                    <TableCell>
                      <Badge variant="outline">{solution.hexagram_key}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{solution.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{solution.herb_name || "—"}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{solution.meridian_pathway || "—"}</TableCell>
                    <TableCell>{solution.unlock_cost} coin</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                      {solution.reference_source || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSolution(solution)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingSolution && (
        <SolutionEditDialog
          solution={editingSolution}
          open={!!editingSolution}
          onOpenChange={(open) => !open && setEditingSolution(null)}
          onSaved={loadSolutions}
        />
      )}
    </>
  )
}
