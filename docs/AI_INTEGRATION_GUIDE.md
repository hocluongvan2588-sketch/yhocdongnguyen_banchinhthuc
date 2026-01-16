# Hướng Dẫn Tích Hợp AI Vào Hệ Thống Chẩn Đoán

## Tổng Quan Kiến Trúc

Hệ thống AI được thiết kế theo mô hình **Hybrid 3 tầng**:

```
┌─────────────────────────────────────────────────┐
│ Tầng 1: Logic Tính Toán (TypeScript - Cứng)    │
│ - Tính quẻ chủ, quẻ hổ, quẻ biến               │
│ - Xác định Thể-Dụng                             │
│ - Tính quan hệ sinh khắc                        │
│ - Phân tích theo mùa                            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Tầng 2: Knowledge Base (Markdown - Dễ sửa)     │
│ lib/ai/knowledge/                               │
│ ├── mai-hoa-core.md (8 quẻ thuần, quan hệ)     │
│ ├── symptom-analysis.md (Triệu chứng)          │
│ └── README.md (Hướng dẫn cập nhật)             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Tầng 3: AI Generation (GPT-4o-mini)            │
│ - Đọc knowledge base                            │
│ - Nhận dữ liệu từ tầng 1                       │
│ - Sinh văn bản theo văn phong chuyên gia       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Tầng 4: Fallback Logic                         │
│ - Nếu API lỗi → dùng logic cũ                  │
│ - Luôn đảm bảo có kết quả trả về               │
└─────────────────────────────────────────────────┘
```

## Cách Sử Dụng AI trong Code

### Option 1: Sử dụng API Route (Khuyến nghị)

```typescript
// Trong component hoặc server action
async function getDiagnosisWithAI(params) {
  const response = await fetch('/api/diagnose-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      upperTrigram: 1,
      lowerTrigram: 6,
      movingLine: 3,
      healthConcern: "đau đầu gối",
      currentMonth: 2,
      transformedUpper: 1,
      transformedLower: 5,
    }),
  })

  const result = await response.json()
  return result
}
```

### Option 2: Gọi trực tiếp hàm (Server Component)

```typescript
import { diagnoseWithAI } from "@/lib/ai/diagnosis-with-ai"

export default async function DiagnosisPage() {
  const result = await diagnoseWithAI({
    upperTrigram: 1,
    lowerTrigram: 6,
    movingLine: 3,
    healthConcern: "đau đầu gối",
    currentMonth: 2,
    transformedUpper: 1,
    transformedLower: 5,
  })

  return (
    <div>
      <h1>{result.aiInterpretation.summary}</h1>
      <p>{result.aiInterpretation.mechanism}</p>
    </div>
  )
}
```

## Cấu Trúc Kết Quả Trả Về

```typescript
{
  rawCalculation: {
    // Toàn bộ dữ liệu tính toán từ logic cứng
    mainHexagram: {...},
    mutualHexagram: {...},
    transformedHexagram: {...},
    bodyUseAnalysis: {...},
    seasonalAnalysis: {...},
  },
  
  aiInterpretation: {
    summary: "Qua phân tích quẻ, tôi thấy Gan của bạn...",
    mechanism: "Theo Mai Hoa Dịch Số, Quẻ Thể của bạn là Chấn...",
    symptoms: "- Đau chân, yếu gối\n- Nóng nảy, dễ cáu...",
    timing: "Hiện tại là tháng 2, theo Mai Hoa thì Kim đang vượng...",
    immediateAdvice: "1. Ăn rau xanh...\n2. Massage huyệt...",
    longTermTreatment: "Về lâu dài, bạn nên tìm bác sĩ Đông y..."
  },
  
  usedAI: true,  // false nếu fallback
  generatedAt: "2026-01-16T10:30:00.000Z"
}
```

## Cách Cập Nhật Kiến Thức (SIÊU ĐƠN GIẢN)

### Ví dụ: Thêm phân tích "đau lưng"

**Bước 1:** Mở file `lib/ai/knowledge/symptom-analysis.md`

**Bước 2:** Thêm nội dung mới:

```markdown
## ĐAU LƯNG

### Nguyên nhân theo Ngũ hành:

1. **Thận hư (Khảm suy):**
   - Cơ chế: Thận chủ cốt, Thận hư → xương lưng yếu
   - Triệu chứng kèm: đau âm ỉ, tăng khi mệt
   - Xử lý: bổ Thận, ăn đậu đen, óc chó
```

**Bước 3:** Save file

**Bước 4:** Test ngay (không cần restart!)

```bash
# User hỏi: "Tôi bị đau lưng"
# AI sẽ TỰ ĐỘNG đọc nội dung mới và phân tích
```

### Ví dụ: Thêm quẻ đặc biệt mới

**File:** `lib/ai/knowledge/mai-hoa-core.md`

```markdown
## TỔ HỢP QUẺ ĐẶC BIỆT

### 5. Thiên Hỏa Đồng Nhân (Càn trên Ly)
Bệnh về phổi và tim, ho khan kèm tim đập nhanh, cần bổ cả Phổi và Tim
```

## Chi Phí & Hiệu Suất

### Chi phí API (GPT-4o-mini)

- **Input:** $0.15 / 1M tokens
- **Output:** $0.60 / 1M tokens

**Ước tính:**
- Mỗi request: ~2,500 tokens input + 800 tokens output
- Chi phí/request: $0.00085
- 1,000 lượt/tháng: **$0.85**
- 10,000 lượt/tháng: **$8.50**

### Tốc độ

- Thời gian response: 1-3 giây
- Fallback logic: < 0.1 giây

## Lưu Ý Quan Trọng

1. **Logic tính toán KHÔNG BAO GIỜ thay đổi** - luôn chính xác tuyệt đối
2. **AI CHỈ diễn giải** - không ảnh hưởng đến kết quả tính toán
3. **Có fallback** - nếu API lỗi, vẫn có kết quả từ logic cứng
4. **Cập nhật kiến thức** - chỉ cần sửa file .md, không cần code

## Troubleshooting

### Lỗi: "Failed to generate diagnosis"

**Nguyên nhân:** API key không được set hoặc hết quota

**Giải pháp:**
1. Check environment variables
2. Hệ thống tự động fallback về logic cứng
3. Kiểm tra `usedAI: false` trong response

### Lỗi: AI trả về nội dung không đúng format

**Nguyên nhân:** Prompt bị thay đổi hoặc model thay đổi

**Giải pháp:**
1. Check `lib/ai/prompts/system-instruction.ts`
2. Đảm bảo structure prompt đúng
3. Parse function sẽ xử lý fallback

### Knowledge base không load được

**Nguyên nhân:** File path không đúng

**Giải pháp:**
```typescript
// Check trong diagnose-with-ai.ts
const knowledgePath = path.join(process.cwd(), "lib/ai/knowledge")
```

## Best Practices

1. **Luôn test kỹ** trước khi deploy lên production
2. **Monitor chi phí API** qua Vercel dashboard
3. **Cập nhật knowledge base** thường xuyên dựa trên feedback
4. **Giữ fallback logic** luôn hoạt động tốt
5. **Log errors** để debug nhanh

## Roadmap

- [ ] Thêm cache để giảm chi phí API
- [ ] Thêm rate limiting cho API route
- [ ] Thêm analytics để track chất lượng AI
- [ ] Thêm A/B testing giữa AI và logic cứng
- [ ] Thêm user feedback để fine-tune prompt
