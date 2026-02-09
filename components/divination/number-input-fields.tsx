"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberInputFieldsProps {
  numberInput: { upper: string; lower: string; moving: string }
  setNumberInput: (input: { upper: string; lower: string; moving: string }) => void
}

export function NumberInputFields({ numberInput, setNumberInput }: NumberInputFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm">Số Thượng quái (1-8)</Label>
        <Input
          type="number"
          min="1"
          max="999"
          value={numberInput.upper}
          onChange={(e) => setNumberInput({ ...numberInput, upper: e.target.value })}
          placeholder="Nhập số bất kỳ"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Số Hạ quái (1-8)</Label>
        <Input
          type="number"
          min="1"
          max="999"
          value={numberInput.lower}
          onChange={(e) => setNumberInput({ ...numberInput, lower: e.target.value })}
          placeholder="Nhập số bất kỳ"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Số Động hào (1-6)</Label>
        <Input
          type="number"
          min="1"
          max="999"
          value={numberInput.moving}
          onChange={(e) => setNumberInput({ ...numberInput, moving: e.target.value })}
          placeholder="Nhập số bất kỳ"
        />
      </div>

      <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
        💡 <strong>Cách dùng:</strong> Nhập 3 số bất kỳ dựa trên cảm nhận của bạn. Hệ thống sẽ tự động
        chuyển đổi thành quẻ theo quy tắc Mai Hoa
      </p>
    </div>
  )
}
