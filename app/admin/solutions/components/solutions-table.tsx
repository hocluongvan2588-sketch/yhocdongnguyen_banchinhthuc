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
    console.log('[v0] SolutionsTable - getAllSolutions result:', result);
    if (result.solutions) {
      console.log('[v0] SolutionsTable - solutions count:', result.solutions.length);
      // Show all solution types (prescription, acupoint, numerology)
      setSolutions(result.solutions)
    } else {
      console.log('[v0] SolutionsTable - NO SOLUTIONS or ERROR:', result.error);
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
          <CardTitle>Danh sách Gói Dịch Vụ ({solutions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại gói</TableHead>
                  <TableHead>Quẻ</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Giá unlock</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Chưa có dữ liệu. Chạy script seed để thêm dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
                {solutions.map((solution) => (
                  <TableRow key={solution.id}>
                    <TableCell>
                      <Badge 
                        variant={
                          solution.solution_type === 'prescription' ? 'default' :
                          solution.solution_type === 'acupoint' ? 'secondary' :
                          'outline'
                        }
                      >
                        {solution.solution_type === 'prescription' ? 'Nam Dược' :
                         solution.solution_type === 'acupoint' ? 'Khai Huyệt' :
                         solution.solution_type === 'numerology' ? 'Tượng Số' :
                         solution.solution_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{solution.hexagram_key}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{solution.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{solution.description || "—"}</TableCell>
                    <TableCell className="font-semibold">{solution.unlock_cost?.toLocaleString('vi-VN')}đ</TableCell>
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
