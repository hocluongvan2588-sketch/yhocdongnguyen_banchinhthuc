"use client"

import React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSolution } from "@/lib/actions/admin-actions"
import { toast } from "sonner"

interface Solution {
  id: string
  hexagram_key: string
  title: string
  description: string | null
  unlock_cost: number
  herb_name: string | null
  meridian_pathway: string | null
  preparation_method: string | null
  reference_source: string | null
  promo_message: string | null
}

interface SolutionEditDialogProps {
  solution: Solution
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function SolutionEditDialog({ solution, open, onOpenChange, onSaved }: SolutionEditDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: solution.title,
    description: solution.description || "",
    unlock_cost: solution.unlock_cost,
    reference_source: solution.reference_source || "",
    promo_message: solution.promo_message || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await updateSolution(solution.id, formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Đã cập nhật gói dịch vụ")
      onSaved()
      onOpenChange(false)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa gói dịch vụ - {solution.hexagram_key}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tên bài thuốc</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unlock_cost">Giá unlock (coins)</Label>
            <Input
              id="unlock_cost"
              type="number"
              value={formData.unlock_cost}
              onChange={(e) => setFormData({ ...formData, unlock_cost: Number.parseInt(e.target.value) })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Lưu ý: Đây là giá coin, không phải VNĐ. Giá VNĐ được quản lý trong tab Giá bán.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference_source">Nguồn tham khảo</Label>
            <Input
              id="reference_source"
              value={formData.reference_source}
              onChange={(e) => setFormData({ ...formData, reference_source: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo_message">Thông báo khuyến mãi (tùy chọn)</Label>
            <Textarea
              id="promo_message"
              value={formData.promo_message}
              onChange={(e) => setFormData({ ...formData, promo_message: e.target.value })}
              rows={2}
              placeholder="VD: 🎊 Chúc mừng năm mới! Giảm giá đặc biệt 20% dịp Tết"
            />
            <p className="text-xs text-muted-foreground">
              Thông báo này sẽ hiển thị trong modal thanh toán để user biết về khuyến mãi/tri ân
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Thông tin quẻ (Read-only)</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Quẻ:</span> {solution.hexagram_key}
              </div>
              <div>
                <span className="text-muted-foreground">Vị thuốc:</span>{" "}
                {solution.herb_name?.split("|").length || 0} vị
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Kinh lạc:</span> {solution.meridian_pathway || "—"}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Chi tiết vị thuốc và công thức được tạo tự động bởi logic Ngũ Hành trong code.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
