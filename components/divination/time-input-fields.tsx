"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { TimeInput } from "@/lib/types"

interface TimeInputFieldsProps {
  input: TimeInput
  setInput: (input: TimeInput) => void
  currentHourBranchName: string
}

export function TimeInputFields({ input, setInput, currentHourBranchName }: TimeInputFieldsProps) {
  const handleInputChange = (field: keyof TimeInput, value: number) => {
    setInput({ ...input, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Năm (Dương lịch)</Label>
          <Input
            type="number"
            min="1900"
            max="2100"
            value={input.year}
            onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Tháng (Dương lịch)</Label>
          <Input
            type="number"
            min="1"
            max="12"
            value={input.month}
            onChange={(e) => handleInputChange("month", Number.parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Ngày (Dương lịch)</Label>
          <Input
            type="number"
            min="1"
            max="31"
            value={input.day}
            onChange={(e) => handleInputChange("day", Number.parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm flex items-center gap-2">
            Giờ
            <Badge variant="secondary" className="text-[10px]">
              {currentHourBranchName}
            </Badge>
          </Label>
          <Input
            type="number"
            min="0"
            max="23"
            value={input.hour}
            onChange={(e) => handleInputChange("hour", Number.parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Phút</Label>
        <Input
          type="number"
          min="0"
          max="59"
          value={input.minute}
          onChange={(e) => handleInputChange("minute", Number.parseInt(e.target.value))}
        />
      </div>

      <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
        💡 <strong>Lưu ý:</strong> Hệ thống tự động chuyển đổi lịch Dương sang lịch Âm và Can Chi để tính quẻ
        chính xác theo Mai Hoa Dịch Số
      </p>
    </div>
  )
}
