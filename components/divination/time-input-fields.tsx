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
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Năm</Label>
          <Input
            type="number"
            min="1900"
            max="2100"
            value={input.year}
            onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
            className="text-base"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Tháng</Label>
          <Input
            type="number"
            min="1"
            max="12"
            value={input.month}
            onChange={(e) => handleInputChange("month", Number.parseInt(e.target.value))}
            className="text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Ngày</Label>
          <Input
            type="number"
            min="1"
            max="31"
            value={input.day}
            onChange={(e) => handleInputChange("day", Number.parseInt(e.target.value))}
            className="text-base"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Giờ
          </Label>
          <Input
            type="number"
            min="0"
            max="23"
            value={input.hour}
            onChange={(e) => handleInputChange("hour", Number.parseInt(e.target.value))}
            className="text-base"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Phút</Label>
          <Input
            type="number"
            min="0"
            max="59"
            value={input.minute}
            onChange={(e) => handleInputChange("minute", Number.parseInt(e.target.value))}
            className="text-base"
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground pt-1">
        Tự động chuyển sang Âm lịch và Can Chi
      </p>
    </div>
  )
}
