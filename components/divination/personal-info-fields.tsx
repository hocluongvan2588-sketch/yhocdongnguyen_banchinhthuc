"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { convertBirthYear, type BirthYearInfo } from "@/lib/birth-year-converter"
import { Sparkles, Info } from "lucide-react"

interface PersonalInfoFieldsProps {
  gender: string
  setGender: (value: string) => void
  birthYear: string
  setBirthYear: (value: string) => void
  birthMonth: string
  setBirthMonth: (value: string) => void
  birthDay: string
  setBirthDay: (value: string) => void
  painLocation: string
  setPainLocation: (value: string) => void
  userLocation: string
  setUserLocation: (value: string) => void
}

export function PersonalInfoFields({
  gender,
  setGender,
  birthYear,
  setBirthYear,
  birthMonth,
  setBirthMonth,
  birthDay,
  setBirthDay,
  painLocation,
  setPainLocation,
  userLocation,
  setUserLocation,
}: PersonalInfoFieldsProps) {
  const [canChiInfo, setCanChiInfo] = useState<BirthYearInfo | null>(null)

  // Auto-calculate Can Chi when birth date is complete
  useEffect(() => {
    const year = Number.parseInt(birthYear)
    const month = Number.parseInt(birthMonth)
    const day = Number.parseInt(birthDay)

    if (year && year >= 1900 && year <= 2100 && month && month >= 1 && month <= 12 && day && day >= 1 && day <= 31) {
      const result = convertBirthYear(year, month, day)
      setCanChiInfo(result)
    } else {
      setCanChiInfo(null)
    }
  }, [birthYear, birthMonth, birthDay])

  const handleConvertToCanChi = () => {
    const year = Number.parseInt(birthYear)
    const month = Number.parseInt(birthMonth)
    const day = Number.parseInt(birthDay)

    if (year && year >= 1900 && year <= 2100 && month && month >= 1 && month <= 12 && day && day >= 1 && day <= 31) {
      const result = convertBirthYear(year, month, day)
      setCanChiInfo(result)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Giới tính</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Chọn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Nam</SelectItem>
            <SelectItem value="female">Nữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          Ngày sinh
          <span className="text-[10px] text-muted-foreground font-normal">(Dương lịch)</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            min="1900"
            max="2100"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="Năm"
            className="text-base h-10 placeholder:text-xs placeholder:text-muted-foreground/60"
          />
          <Input
            type="number"
            min="1"
            max="12"
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            placeholder="Tháng"
            className="text-base h-10 placeholder:text-xs placeholder:text-muted-foreground/60"
          />
          <Input
            type="number"
            min="1"
            max="31"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            placeholder="Ngày"
            className="text-base h-10 placeholder:text-xs placeholder:text-muted-foreground/60"
          />
        </div>

        {canChiInfo && (
          <Alert className="bg-primary/5 border-primary/20 py-2 mt-2">
            <Info className="h-3.5 w-3.5 text-primary" />
            <AlertDescription className="text-[11px] space-y-0.5">
              <div className="font-semibold">
                {canChiInfo.canNam} {canChiInfo.chiNam} ({canChiInfo.animalZodiac})
              </div>
              <div>Ngày: {canChiInfo.canNgay} {canChiInfo.chiNgay} • {canChiInfo.element}</div>
              <div className="text-muted-foreground">
                {canChiInfo.age} tuổi • AL: {canChiInfo.lunarYear}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Vị trí đau</Label>
          <Select value={painLocation} onValueChange={setPainLocation}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Chọn vị trí" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Trái</SelectItem>
              <SelectItem value="right">Phải</SelectItem>
              <SelectItem value="center">Trung tâm</SelectItem>
              <SelectItem value="whole">Toàn thân</SelectItem>
              <SelectItem value="unknown">Không rõ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Tỉnh/Thành</Label>
          <Select value={userLocation} onValueChange={setUserLocation}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Chọn" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="hochiminh">TP HCM</SelectItem>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
              <SelectItem value="haiphong">Hải Phòng</SelectItem>
              <SelectItem value="cantho">Cần Thơ</SelectItem>
              <SelectItem value="binhduong">Bình Dương</SelectItem>
              <SelectItem value="dongnai">Đồng Nai</SelectItem>
              <SelectItem value="baclieu">Bạc Liêu</SelectItem>
              <SelectItem value="bacgiang">Bắc Giang</SelectItem>
              <SelectItem value="backan">Bắc Kạn</SelectItem>
              <SelectItem value="bacninh">Bắc Ninh</SelectItem>
              <SelectItem value="bentre">Bến Tre</SelectItem>
              <SelectItem value="camau">Cà Mau</SelectItem>
              <SelectItem value="caobang">Cao Bằng</SelectItem>
              <SelectItem value="daklak">Đắk Lắk</SelectItem>
              <SelectItem value="daknong">Đắk Nông</SelectItem>
              <SelectItem value="dienbien">Điện Biên</SelectItem>
              <SelectItem value="dongthap">Đồng Tháp</SelectItem>
              <SelectItem value="gialai">Gia Lai</SelectItem>
              <SelectItem value="hagiang">Hà Giang</SelectItem>
              <SelectItem value="hanam">Hà Nam</SelectItem>
              <SelectItem value="hatinh">Hà Tĩnh</SelectItem>
              <SelectItem value="haugiang">Hậu Giang</SelectItem>
              <SelectItem value="hoabinh">Hòa Bình</SelectItem>
              <SelectItem value="hungyen">Hưng Yên</SelectItem>
              <SelectItem value="khanhhoa">Khánh Hòa</SelectItem>
              <SelectItem value="kiengiang">Kiên Giang</SelectItem>
              <SelectItem value="kontum">Kon Tum</SelectItem>
              <SelectItem value="laichau">Lai Châu</SelectItem>
              <SelectItem value="lamdong">Lâm Đồng</SelectItem>
              <SelectItem value="langson">Lạng Sơn</SelectItem>
              <SelectItem value="laocai">Lào Cai</SelectItem>
              <SelectItem value="longan">Long An</SelectItem>
              <SelectItem value="namdinh">Nam Định</SelectItem>
              <SelectItem value="nghean">Nghệ An</SelectItem>
              <SelectItem value="ninhbinh">Ninh Bình</SelectItem>
              <SelectItem value="ninhthuan">Ninh Thuận</SelectItem>
              <SelectItem value="phutho">Phú Thọ</SelectItem>
              <SelectItem value="phuyen">Phú Yên</SelectItem>
              <SelectItem value="quangbinh">Quảng Bình</SelectItem>
              <SelectItem value="quangnam">Quảng Nam</SelectItem>
              <SelectItem value="quangngai">Quảng Ngãi</SelectItem>
              <SelectItem value="quangninh">Quảng Ninh</SelectItem>
              <SelectItem value="quangtri">Quảng Trị</SelectItem>
              <SelectItem value="soctrang">Sóc Trăng</SelectItem>
              <SelectItem value="sonla">Sơn La</SelectItem>
              <SelectItem value="tayninh">Tây Ninh</SelectItem>
              <SelectItem value="thaibinh">Thái Bình</SelectItem>
              <SelectItem value="thainguyen">Thái Nguyên</SelectItem>
              <SelectItem value="thanhhoa">Thanh Hóa</SelectItem>
              <SelectItem value="thuathienhue">Huế</SelectItem>
              <SelectItem value="tiengiang">Tiền Giang</SelectItem>
              <SelectItem value="travinh">Trà Vinh</SelectItem>
              <SelectItem value="tuyenquang">Tuyên Quang</SelectItem>
              <SelectItem value="vinhlong">Vĩnh Long</SelectItem>
              <SelectItem value="vinhphuc">Vĩnh Phúc</SelectItem>
              <SelectItem value="yenbai">Yên Bái</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>
    </div>
  )
}
