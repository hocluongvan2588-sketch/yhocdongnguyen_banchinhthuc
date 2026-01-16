# Hướng Dẫn Cập Nhật Kiến Thức

## Cấu trúc thư mục

```
lib/ai/knowledge/
├── mai-hoa-core.md          # Tri thức cốt lõi về Mai Hoa Dịch Số
├── symptom-analysis.md      # Phân tích triệu chứng chi tiết
├── tcm-principles.md        # (Có thể thêm) Nguyên lý Đông y
└── treatment-guidelines.md  # (Có thể thêm) Nguyên tắc điều trị
```

## Cách cập nhật kiến thức

### Bước 1: Mở file markdown cần sửa

Ví dụ muốn thêm phân tích về "đau lưng":

```bash
Mở: lib/ai/knowledge/symptom-analysis.md
```

### Bước 2: Thêm nội dung mới

```markdown
## ĐAU LƯNG

### Nguyên nhân theo Ngũ hành:

1. **Thận hư (Khảm suy):**
   - Cơ chế: Thận chủ cốt, Thận hư → xương lưng yếu
   - Triệu chứng kèm: đau âm ỉ, tăng khi mệt, giảm khi nghỉ
   - Thời gian nặng: mùa hè, ban ngày
   - Xử lý: bổ Thận, dùng thảo dược bổ Thận dương

2. **Phong thấp (Ngoại cảm):**
   - Cơ chế: Phong thấp xâm nhập cơ lưng
   - Triệu chứng kèm: đau nhói, cứng lưng, khó cúi
   - Xử lý: khử phong thấp, hoạt huyết
```

### Bước 3: Save file

Chỉ cần save file markdown, KHÔNG CẦN code lại gì!

### Bước 4: Test

Khi user hỏi về "đau lưng", AI sẽ TỰ ĐỘNG đọc nội dung mới và đưa ra phân tích.

## Lưu ý quan trọng

1. **KHÔNG** thay đổi cấu trúc heading (##)
2. **LUÔN** giữ format markdown đúng chuẩn
3. **PHẢI** dựa trên tài liệu Mai Hoa Dịch Số gốc
4. **NÊN** có ví dụ cụ thể, dễ hiểu

## Ví dụ cập nhật tri thức mới

### Thêm quẻ đặc biệt mới

File: `mai-hoa-core.md`

```markdown
## TỔ HỢP QUẺ ĐẶC BIỆT

### 5. Phong Hỏa Gia Nhân (Tốn trên Ly)
Bệnh về gan mật và tim mạch đồng thời, dễ nóng nảy và mất ngủ
```

### Thêm phương pháp điều trị mới

File: `treatment-guidelines.md` (tạo mới nếu chưa có)

```markdown
# NGUYÊN TẮC ĐIỀU TRỊ

## Bổ Gan

1. **Thực phẩm:** Rau xanh, gân bò, gan heo, nho đỏ
2. **Thảo dược:** Đương quy, Bạch thược, Xuyên khung
3. **Huyệt đạo:** Thái Xung, Thái Khê, Huyết Hải
```

## Kiểm tra kết quả

Sau khi cập nhật, test bằng cách hỏi câu hỏi liên quan:
- User hỏi: "Tôi bị đau lưng"
- AI sẽ tự động sử dụng nội dung mới để phân tích

**KHÔNG CẦN restart server hay deploy lại!**
```

Đã hoàn thành refactor logic tách rời tính toán và diễn giải, tạo hàm `diagnoseWithAI()` để AI sinh nội dung dựa trên kết quả tính toán thuần túy, có fallback về logic cứng nếu API lỗi, và tạo README hướng dẫn cập nhật kiến thức siêu đơn giản bằng cách chỉnh sửa file markdown. Tiếp theo tôi sẽ hoàn thành demo và tạo tài liệu hướng dẫn đầy đủ.
