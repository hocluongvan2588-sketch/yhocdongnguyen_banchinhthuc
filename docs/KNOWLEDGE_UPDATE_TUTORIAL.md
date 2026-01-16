# Tutorial: Cách Cập Nhật Kiến Thức Cho AI

## Giới Thiệu

Bạn KHÔNG CẦN biết code để cập nhật kiến thức cho AI. Chỉ cần biết viết file Markdown (như Word nhưng đơn giản hơn).

## Ví Dụ Thực Tế: Thêm Phân Tích "Đau Vai Gáy"

### Bước 1: Mở File

Mở file: `lib/ai/knowledge/symptom-analysis.md`

### Bước 2: Cuộn xuống cuối file và thêm:

```markdown
## ĐAU VAI GÁY

### Nguyên nhân theo Ngũ hành:

1. **Gan khí ứ trệ (Chấn/Tốn):**
   - Cơ chế: Gan chủ gân, gân vai gáy bị căng cứng
   - Triệu chứng kèm: nóng nảy, đau đầu, mắt mờ
   - Thời gian nặng: mùa thu (Kim khắc Mộc)
   - Xử lý: sơ Gan giải uất, massage huyệt Phong Trì, Kiên Tỉnh

2. **Phong hàn thấp (Ngoại cảm):**
   - Cơ chế: Gió lạnh xâm nhập vai gáy
   - Triệu chứng kèm: cứng gáy, khó xoay đầu, đau lan vai
   - Xử lý: giữ ấm, chườm nóng, uống gừng

### Phân tích theo quan hệ Thể-Dụng:

- **Dụng khắc Thể**: Đau vai gáy nặng, có thể thoát vị đĩa đệm
- **Thể khắc Dụng**: Đau vai gáy nhẹ dần, tự khỏi sau vài ngày
- **Thể sinh Dụng**: Đau vai gáy mạn tính, cần điều trị lâu dài
- **Dụng sinh Thể**: Đau vai gáy dễ điều trị, massage 3-5 ngày là khỏi
```

### Bước 3: Save file (Ctrl+S hoặc Cmd+S)

### Bước 4: Test ngay

Hỏi AI: "Tôi bị đau vai gáy"

AI sẽ trả lời theo nội dung bạn vừa thêm!

## Ví Dụ 2: Thêm Thảo Dược Mới

### File: `lib/ai/knowledge/mai-hoa-core.md`

Tìm section "Thảo dược bổ [Tạng]" và thêm:

```markdown
### Thảo dược bổ Gan:
- **Đương quy**: Bổ huyết Gan, giúp gân cốt khỏe
- **Bạch thược**: Nhu Can, giảm đau co quắp
- **Câu kỷ tử**: Bổ Gan Thận, sáng mắt
- **Linh chi**: Bổ Can khí, an thần
```

## Ví Dụ 3: Sửa Nội Dung Sai

### Tìm nội dung cần sửa:

Giả sử bạn thấy trong file có viết:

```markdown
**Thận chủ xương** ← SAI! Phải là "Thận chủ cốt"
```

### Sửa lại:

```markdown
**Thận chủ cốt**
```

### Save và test ngay!

## Quy Tắc Viết Markdown

### 1. Heading (Tiêu đề)

```markdown
# Tiêu đề lớn nhất
## Tiêu đề cấp 2
### Tiêu đề cấp 3
```

### 2. Bold (In đậm)

```markdown
**Text in đậm**
```

### 3. Danh sách

```markdown
- Mục 1
- Mục 2
- Mục 3

1. Bước 1
2. Bước 2
3. Bước 3
```

### 4. Link

```markdown
[Tên link](https://example.com)
```

## Checklist Trước Khi Save

- [ ] Đã kiểm tra chính tả
- [ ] Đã dựa trên tài liệu Mai Hoa Dịch Số gốc
- [ ] Đã có ví dụ cụ thể
- [ ] Format markdown đúng

## Lỗi Thường Gặp

### 1. Quên dấu # trước tiêu đề

SAI:
```
Đau vai gáy
```

ĐÚNG:
```markdown
## ĐAU VAI GÁY
```

### 2. Quên ** ở cuối text in đậm

SAI:
```
**Gan chủ gân
```

ĐÚNG:
```markdown
**Gan chủ gân**
```

## Khi Nào Cần Cập Nhật?

1. **Phát hiện nội dung AI sai** → Sửa ngay trong knowledge base
2. **Có tài liệu mới** → Thêm vào knowledge base
3. **User hỏi triệu chứng mới** → Thêm phân tích vào symptom-analysis.md
4. **Cần cải thiện văn phong** → Sửa system instruction

## Không Cần Restart Gì Cả!

Sau khi save file markdown, lần chạy tiếp theo AI sẽ TỰ ĐỘNG đọc nội dung mới.

KHÔNG CẦN:
- Restart server
- Deploy lại
- Clear cache
- Code lại gì

Chỉ cần: **Save file → AI tự động dùng ngay!**
