"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberInputFieldsProps {
  numberInput: { upper: string; lower: string; moving: string }
  setNumberInput: (input: { upper: string; lower: string; moving: string }) => void
}

export function NumberInputFields({ numberInput, setNumberInput }: NumberInputFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Số Thượng quái</Label>
        <Input
          type="number"
          min="1"
          max="999"
          value={numberInput.upper}
          onChange={(e) => setNumberInput({ ...numberInput, upper: e.target.value })}
          placeholder="1-999"
          className="text-base placeholder:text-xs placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Số Hạ quái</Label>
        <Input
          type="number"
          min="1"
          max="999"
          value={numberInput.lower}
          onChange={(e) => setNumberInput({ ...numberInput, lower: e.target.value })}
          placeholder="1-999"
          className="text-base placeholder:text-xs placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Số Động hào</Label>
        <Input
          type="number"
          min="1"
          max="999"
          value={numberInput.moving}
          onChange={(e) => setNumberInput({ ...numberInput, moving: e.target.value })}
          placeholder="1-999"
          className="text-base placeholder:text-xs placeholder:text-muted-foreground/60"
        />
      </div>

      <p className="text-[11px] text-muted-foreground pt-1">
        Nhập 3 số bất kỳ theo cảm nhận
      </p>
    </div>
  )
}
