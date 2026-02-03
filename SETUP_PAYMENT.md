# Hướng dẫn cài đặt hệ thống thanh toán Timo

## Lỗi gặp phải

```
Could not find the table 'public.payment_methods' in the schema cache
```

Lỗi này xảy ra vì các bảng thanh toán chưa được tạo trong database.

## Cách khắc phục

### Bước 1: Chạy script tạo bảng

Bạn cần chạy script SQL sau để tạo các bảng cần thiết:

```bash
# Script cần chạy (đã có sẵn trong project)
scripts/03-create-timo-payment-tables.sql
```

Script này sẽ tạo các bảng:
- `payment_methods` - Lưu thông tin phương thức thanh toán (Timo)
- `deposits` - Lưu giao dịch nạp tiền
- `bank_transactions` - Lưu lịch sử giao dịch ngân hàng
- `user_access` - Lưu quyền truy cập gói dịch vụ của user

### Bước 2: Cấu hình biến môi trường (Tùy chọn)

Nếu bạn muốn tùy chỉnh thông tin tài khoản Timo, thêm vào file `.env.local`:

```env
TIMO_ACCOUNT_NUMBER=9020283397825
TIMO_ACCOUNT_NAME=NGUYEN VAN A
```

Nếu không cấu hình, hệ thống sẽ dùng giá trị mặc định.

### Bước 3: Kiểm tra

Sau khi chạy script, thử lại tính năng thanh toán. Hệ thống sẽ:
1. Tự động lấy thông tin Timo từ bảng `payment_methods`
2. Nếu bảng chưa có, sử dụng cấu hình mặc định từ env hoặc hardcoded

## Lưu ý

- Code hiện đã được cập nhật để có fallback khi bảng `payment_methods` chưa tồn tại
- Tuy nhiên, vẫn cần chạy script để tạo đầy đủ các bảng cho hệ thống thanh toán hoạt động đúng
- Bảng `deposits` bắt buộc phải tồn tại để lưu giao dịch

## Kiểm tra xem bảng đã tồn tại chưa

Chạy query SQL sau trong Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('payment_methods', 'deposits', 'bank_transactions', 'user_access');
```

Nếu không có kết quả hoặc thiếu bảng, cần chạy script tạo bảng.
