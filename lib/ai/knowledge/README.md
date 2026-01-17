# Hướng Dẫn Cập Nhật Knowledge Base

## ⚠️ LƯU Ý QUAN TRỌNG VỀ TỐI ƯU TOKEN

Knowledge base này được load vào EVERY AI REQUEST. Do đó:

1. **GIỮ NỘI DUNG NGẮN GỌN** - mỗi file không nên quá 150 dòng
2. **CHỈ GHI THÔNG TIN CỐT LÕI** - không viết dài dòng, không lặp lại
3. **SỬ DỤNG BULLET POINTS** - dễ đọc hơn đoạn văn dài
4. **TRÁNH VÍ DỤ DÀI** - chỉ ghi công thức, không cần giải thích chi tiết

## Chi Phí Thực Tế

- **Trước tối ưu:** ~7,000 tokens/request → $0.00185/request
- **Sau tối ưu:** ~2,500 tokens/request → $0.00065/request
- **Tiết kiệm:** 65% chi phí!

## Cách Thêm Nội Dung Mới

### ✅ TốT:
```markdown
## ĐAU LƯNG
- Thận hư (Khảm): xương yếu → bổ Thận
- Gan hư (Chấn): gân yếu → bổ Gan
- Phong thấp: khớp cứng → khử phong
```

### ❌ KHÔNG TỐT:
```markdown
## ĐAU LƯNG

Đau lưng là một trong những triệu chứng phổ biến nhất... (3 đoạn văn)

Theo Mai Hoa Dịch Số, khi người bệnh bị đau lưng, chúng ta cần... (5 đoạn văn)
```

## Cache Strategy

- Knowledge base được cache 5 phút
- Nếu cập nhật nội dung, chờ 5 phút hoặc restart server
- Cache tự động expire sau 5 phút

## Monitoring

Để track chi phí:
1. Check logs: `[v0] Token usage: X input + Y output`
2. Tính cost: `(X * 0.15 + Y * 0.60) / 1,000,000`
3. Mục tiêu: giữ mỗi request < $0.001
