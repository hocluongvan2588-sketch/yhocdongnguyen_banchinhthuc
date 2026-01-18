"use client"

import { useState } from "react"
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

  const handleConvertToCanChi = () => {
    const year = Number.parseInt(birthYear)
    const month = Number.parseInt(birthMonth) || 6
    const day = Number.parseInt(birthDay) || 15

    if (year && year >= 1900 && year <= 2100) {
      const result = convertBirthYear(year, month, day)
      setCanChiInfo(result)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm">Giới tính</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Nam</SelectItem>
            <SelectItem value="female">Nữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm flex items-center gap-2">
          Ngày sinh (Dương lịch)
          <Badge variant="secondary" className="text-[10px] py-0">
            Không bắt buộc
          </Badge>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            min="1900"
            max="2100"
            value={birthYear}
            onChange={(e) => {
              setBirthYear(e.target.value)
              setCanChiInfo(null)
            }}
            placeholder="Năm"
          />
          <Input
            type="number"
            min="1"
            max="12"
            value={birthMonth}
            onChange={(e) => {
              setBirthMonth(e.target.value)
              setCanChiInfo(null)
            }}
            placeholder="Tháng"
          />
          <Input
            type="number"
            min="1"
            max="31"
            value={birthDay}
            onChange={(e) => {
              setBirthDay(e.target.value)
              setCanChiInfo(null)
            }}
            placeholder="Ngày"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleConvertToCanChi}
          disabled={!birthYear || Number.parseInt(birthYear) < 1900}
          className="w-full bg-transparent"
        >
          <Sparkles className="w-3 h-3 mr-2" />
          Tự động chuyển sang Can Chi
        </Button>

        {canChiInfo && (
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs space-y-1">
              <div className="font-semibold text-sm">
                Năm {canChiInfo.canNam} {canChiInfo.chiNam} ({canChiInfo.animalZodiac})
              </div>
              <div>Can Chi Ngày: {canChiInfo.canNgay} {canChiInfo.chiNgay}</div>
              <div>Ngũ hành: {canChiInfo.element}</div>
              <div>Tuổi: {canChiInfo.age} ({canChiInfo.ageGroup === "pediatric" ? "Trẻ em" : canChiInfo.ageGroup === "youth" ? "Thanh thiếu niên" : canChiInfo.ageGroup === "adult" ? "Người lớn" : "Người cao tuổi"})</div>
              <div className="text-muted-foreground mt-2">
                Năm âm lịch: {canChiInfo.lunarYear} (theo Lập Xuân)
              </div>
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground">
          Hệ thống tự tính Can Chi Năm, Can Chi Ngày và Cung Phi cho phân tích chính xác
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm flex items-center gap-2">
          Vị trí đau/khó chịu
          <Badge variant="outline" className="text-[10px]">
            Dùng để phân tích Thuận/Nghịch
          </Badge>
        </Label>
        <Select value={painLocation} onValueChange={setPainLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn vị trí" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Bên trái cơ thể</SelectItem>
            <SelectItem value="right">Bên phải cơ thể</SelectItem>
            <SelectItem value="center">Trung tâm/Nội tạng</SelectItem>
            <SelectItem value="whole">Toàn thân</SelectItem>
            <SelectItem value="unknown">Không rõ/Không có</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Nam đau trái = Thuận, Nam đau phải = Nghịch. Nữ ngược lại.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Tỉnh/Thành phố hiện tại</Label>
        <Select value={userLocation} onValueChange={setUserLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn tỉnh/thành" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            <SelectItem value="hanoi">Hà Nội</SelectItem>
            <SelectItem value="hochiminh">TP Hồ Chí Minh</SelectItem>
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
            <SelectItem value="thuathienhue">Thừa Thiên Huế</SelectItem>
            <SelectItem value="tiengiang">Tiền Giang</SelectItem>
            <SelectItem value="travinh">Trà Vinh</SelectItem>
            <SelectItem value="tuyenquang">Tuyên Quang</SelectItem>
            <SelectItem value="vinhlong">Vĩnh Long</SelectItem>
            <SelectItem value="vinhphuc">Vĩnh Phúc</SelectItem>
            <SelectItem value="yenbai">Yên Bái</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Dùng để tính địa phương khí hậu và yếu tố môi trường
        </p>
      </div>
    </div>
  )
}
