# Hướng dẫn Tích hợp Thanh toán Timo

## Tổng quan
Dự án này sử dụng VietQR để tạo mã QR thanh toán cho tài khoản Timo và tự động xác nhận thanh toán qua email.

## 1. Thông tin Timo

**Bank Code chuẩn VietQR**: `VCCB` (Viet Capital Bank - ngân hàng mẹ của Timo)

⚠️ **LƯU Ý**: Phải dùng `VCCB`, KHÔNG dùng `TIMO` hay `BVBANK`

## 2. Cấu hình Payment Method

### Database Schema
\`\`\`sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'ewallet', 'card')),
  provider TEXT, -- 'vietqr'
  account_number TEXT, -- Số tài khoản Timo
  account_name TEXT, -- Tên chủ tài khoản
  bank_code TEXT, -- 'VCCB' cho Timo
  min_amount INTEGER DEFAULT 10000,
  max_amount INTEGER,
  fee_percentage DECIMAL(5,2) DEFAULT 0,
  fee_fixed INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
\`\`\`

### Seed Data (Ví dụ)
\`\`\`sql
INSERT INTO payment_methods (
  name, type, provider, 
  account_number, account_name, bank_code
) VALUES (
  'Chuyển khoản Timo',
  'bank_transfer',
  'vietqr',
  '1055116973',  -- Thay bằng số tài khoản Timo thực
  'NGUYEN VAN A',  -- Thay bằng tên thật
  'VCCB'  -- Bank code cho Timo
);
\`\`\`

## 3. Tạo mã QR VietQR

### Function: generateVietQRUrl
\`\`\`typescript
/**
 * Tạo URL QR code cho thanh toán
 * API: https://img.vietqr.io
 */
export function generateVietQRUrl(
  bankCode: string,      // 'VCCB' cho Timo
  accountNumber: string, // Số tài khoản Timo
  accountName: string,   // Tên chủ tài khoản
  amount: number,        // Số tiền (VND)
  content: string        // Nội dung chuyển khoản
): string {
  const baseUrl = "https://img.vietqr.io/image"
  
  // Format: /image/{BANK_CODE}-{ACCOUNT_NUMBER}-{TEMPLATE}.jpg
  const qrUrl = `${baseUrl}/${bankCode}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(accountName)}`
  
  return qrUrl
}
\`\`\`

### Ví dụ sử dụng
\`\`\`typescript
const qrUrl = generateVietQRUrl(
  'VCCB',              // Bank code Timo
  '1055116973',        // Số tài khoản
  'NGUYEN VAN A',      // Tên chủ TK
  100000,              // 100k VND
  'NAPTEND43E5D4201371170'  // Mã thanh toán
)

// Kết quả:
// https://img.vietqr.io/image/VCCB-1055116973-compact2.jpg?amount=100000&addInfo=NAPTEND43E5D4201371170&accountName=NGUYEN%20VAN%20A
\`\`\`

## 4. Generate Payment Code

### Function: generatePaymentCode
\`\`\`typescript
/**
 * Tạo mã thanh toán duy nhất
 * Format: NAPTEN{8_ký_tự_đầu_UserID}{4_ký_tự_random}
 */
export function generatePaymentCode(userId: string): string {
  const cleanUserId = userId.replace(/-/g, "").toUpperCase()
  const userIdShort = cleanUserId.substring(0, 8)
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  
  return `NAPTEN${userIdShort}${randomSuffix}`
}

// Ví dụ:
// userId: "d43e5d42-0137-1170-8e3f-0242ac120002"
// → cleanUserId: "D43E5D4201371170..."
// → userIdShort: "D43E5D42"
// → randomSuffix: "BF7G"
// → result: "NAPTEND43E5D42BF7G"
\`\`\`

## 5. API Endpoint - Tạo Deposit

### POST /api/deposits/create
\`\`\`typescript
export async function POST(request: Request) {
  const { payment_method_id, amount } = await request.json()
  
  // 1. Lấy thông tin payment method
  const { data: paymentMethod } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("id", payment_method_id)
    .single()
  
  // 2. Generate payment code và content
  const paymentCode = generatePaymentCode(user.id)
  const transferContent = generateTransferContent(paymentCode, amount)
  
  // 3. Tạo VietQR URL cho Timo
  if (paymentMethod.provider === "vietqr" && 
      paymentMethod.bank_code === "VCCB") {
    
    const qrUrl = generateVietQRUrl(
      paymentMethod.bank_code,      // 'VCCB'
      paymentMethod.account_number, // Số TK Timo
      paymentMethod.account_name,   // Tên chủ TK
      amount,
      paymentCode
    )
    
    paymentData = {
      qr_url: qrUrl,
      bank_code: paymentMethod.bank_code,
      account_number: paymentMethod.account_number,
      account_name: paymentMethod.account_name,
    }
  }
  
  // 4. Lưu deposit record
  const { data: deposit } = await supabase
    .from("deposits")
    .insert({
      user_id: user.id,
      payment_method_id,
      amount,
      status: "pending",
      payment_code: paymentCode,
      transfer_content: transferContent,
      payment_data: paymentData, // Chứa qr_url
    })
    .select()
    .single()
  
  return NextResponse.json({ success: true, deposit })
}
\`\`\`

## 6. Tự động xác nhận thanh toán qua Email

### Email Parser cho Timo

\`\`\`typescript
{
  name: "Timo",
  fromEmail: "timo", // Email từ support@timo.vn
  patterns: {
    // Match: MBVCB.12225147306.5354BFTVG2RR99AD.NAPTEND43E5D4201371170
    transactionId: /MBVCB\.\d+(?:\.[A-Z0-9]+)+|NAPTEN[A-Z0-9]+/i,
    
    // Match: "tăng 10.000 VND"
    amount: /(?:tăng|nhận|chuyển|giảm|cộng)\s+([\d.,]+)\s*VND/i,
    
    // Match nội dung từ "Mô tả:" đến "Cảm ơn"
    content: /Mô tả[:\s]*(.+?)(?=Cảm ơn|Trân trọng|$)/is,
    
    // Match: "CT tu 1055116973 LUONG VAN HOC"
    sender: /CT\s+tu\s+(\d+)\s+([A-Z\s]+?)(?=\s+toi|\s+tai|$)/i,
  },
}
\`\`\`

### Cấu hình Email IMAP
\`\`\`env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
\`\`\`

### Luồng xử lý tự động
1. Cron job đọc email mới từ `support@timo.vn`
2. Parse thông tin giao dịch (số tiền, mã NAPTEN)
3. Match với deposit đang pending
4. Cập nhật số dư user tự động
5. Gửi thông báo thành công

## 7. UI Component - Hiển thị QR Code

\`\`\`typescript
"use client"

export function TimoPaymentDisplay({ deposit }: { deposit: Deposit }) {
  const qrUrl = deposit.payment_data?.qr_url
  
  return (
    <div className="space-y-4">
      {/* QR Code */}
      <div className="flex justify-center">
        <img 
          src={qrUrl || "/placeholder.svg"} 
          alt="Mã QR thanh toán Timo"
          className="w-64 h-64"
        />
      </div>
      
      {/* Thông tin chuyển khoản */}
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Ngân hàng</p>
          <p className="font-medium">Timo (Viet Capital Bank)</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Số tài khoản</p>
          <p className="font-medium">{deposit.payment_data?.account_number}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Tên chủ tài khoản</p>
          <p className="font-medium">{deposit.payment_data?.account_name}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Số tiền</p>
          <p className="font-bold text-lg">{deposit.amount.toLocaleString('vi-VN')} VND</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Nội dung chuyển khoản</p>
          <p className="font-mono font-bold text-primary">{deposit.payment_code}</p>
        </div>
      </div>
      
      <Alert>
        <AlertDescription>
          Quét mã QR bằng app Timo hoặc app ngân hàng khác hỗ trợ VietQR. 
          Số dư sẽ được cập nhật tự động trong vòng 1-5 phút.
        </AlertDescription>
      </Alert>
    </div>
  )
}
\`\`\`

## 8. Checklist Tích hợp

- [ ] Tạo bảng `payment_methods` trong database
- [ ] Insert payment method cho Timo với bank_code = 'VCCB'
- [ ] Cập nhật số tài khoản và tên chủ TK Timo thật
- [ ] Copy các function: `generateVietQRUrl`, `generatePaymentCode`
- [ ] Tạo API endpoint `/api/deposits/create`
- [ ] Cấu hình IMAP email để nhận thông báo từ Timo
- [ ] Setup cron job để tự động đọc email
- [ ] Test thanh toán với số tiền nhỏ (10,000 VND)
- [ ] Kiểm tra QR code hiển thị đúng
- [ ] Kiểm tra tự động xác nhận sau khi chuyển khoản

## 9. Lưu ý quan trọng

1. **Bank Code**: Bắt buộc dùng `VCCB`, không dùng `TIMO`
2. **Email Pattern**: Timo có format email đặc biệt với MBVCB code
3. **Timeout**: Deposit pending quá 30 phút nên tự động hủy
4. **Security**: Validate amount, payment code trước khi cập nhật số dư
5. **Error Handling**: Log chi tiết để debug khi parse email thất bại

## 10. Troubleshooting

### QR không hiển thị
- Kiểm tra bank_code = 'VCCB'
- Kiểm tra account_number không có space
- Test URL trực tiếp trong browser

### Email không parse được
- Xem log parse error trong `bank_transactions` table
- Kiểm tra email từ `support@timo.vn`
- Verify regex patterns với email mẫu thực tế

### Không tự động cộng tiền
- Kiểm tra payment_code khớp với nội dung CK
- Xem log trong `bank_transactions` status
- Verify cron job chạy đúng schedule
