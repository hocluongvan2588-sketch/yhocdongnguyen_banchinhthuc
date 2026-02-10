# Hướng Dẫn Setup Hệ Thống AI Prompts Động

## 📋 Tổng Quan

Hệ thống AI Prompts động cho phép admin quản lý và chỉnh sửa prompts mà AI sử dụng để phân tích bệnh lý, **không cần deploy lại code**. Prompts được lưu trong database và AI sẽ tự động load prompts mới nhất.

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────┐
│  Admin UI (/admin/prompts)                          │
│  - Upload/Edit/Delete prompts                       │
│  - Activate/Deactivate versions                     │
│  - Preview & Test                                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Database (Supabase)                                │
│  - prompt_templates table                           │
│  - Version control                                  │
│  - Active/Inactive status                           │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Dynamic Prompt Builder                             │
│  - Load active prompts from DB                      │
│  - Replace variables ({{patientContext}}, etc.)    │
│  - Fallback to hardcoded if DB unavailable         │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  AI API (/api/analyze)                              │
│  - Use dynamic prompt                               │
│  - Generate diagnosis                               │
│  - Return structured JSON                           │
└─────────────────────────────────────────────────────┘
```

## 🚀 Bước 1: Chạy Database Migrations

### 1.1. Tạo Bảng `prompt_templates`

Chạy script tạo bảng trong Supabase SQL Editor:

```bash
# Copy nội dung từ file
scripts/21-create-prompt-templates.sql
```

Hoặc trực tiếp trong Supabase Dashboard → SQL Editor:

```sql
-- Tạo bảng lưu prompts
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  template_content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  variables TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

-- Admin có thể làm tất cả
CREATE POLICY "Admin full access to prompts"
  ON prompt_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### 1.2. Seed Prompts Mặc Định

Chạy script seed để nạp 3 prompts mặc định:

```bash
scripts/22-seed-default-prompts.sql
```

Script này sẽ tạo:
- ✅ **diagnosis**: Prompt chính cho phân tích y học
- ✅ **json-formatter**: Prompt cấu trúc hóa output
- ✅ **system-core**: Hướng dẫn cốt lõi cho AI

## 🎨 Bước 2: Truy Cập Admin UI

### 2.1. Login as Admin

Đảm bảo tài khoản của bạn có `role = 'admin'` trong bảng `profiles`:

```sql
-- Kiểm tra role hiện tại
SELECT email, role FROM profiles
JOIN auth.users ON profiles.id = auth.users.id
WHERE auth.users.email = 'your-email@example.com';

-- Nếu chưa phải admin, update:
UPDATE profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

### 2.2. Truy Cập Trang Prompts

Sau khi login admin, vào:

```
https://your-domain.com/admin/prompts
```

Giao diện sẽ hiển thị:
- 📝 Danh sách prompts (tên, slug, category, status)
- ➕ Nút "Thêm Prompt Mới"
- ✏️ Actions: Edit, Activate/Deactivate, Delete

## 📝 Bước 3: Tạo/Edit Prompts

### 3.1. Tạo Prompt Mới

Click **"Thêm Prompt Mới"** → Điền form:

**Thông Tin Cơ Bản:**
- **Tên**: Tên mô tả (VD: "Chẩn Đoán Y Học Nâng Cao v2")
- **Slug**: Unique identifier (VD: `diagnosis-v2`)
- **Mô tả**: Giải thích mục đích sử dụng
- **Category**: 
  - `diagnosis` - Prompts phân tích bệnh
  - `formatting` - Prompts cấu trúc output
  - `system` - Hướng dẫn hệ thống
  - `general` - Khác

**Nội Dung Prompt:**

Viết prompt theo cú pháp:

```markdown
# VAI TRÒ
Bạn là chuyên gia Y học cổ truyền...

# DỮ LIỆU PHÂN TÍCH
{{patientContext}}
{{maihua}}
{{diagnostic}}

# YÊU CẦU OUTPUT
...
```

**Variables Hỗ Trợ:**

Sử dụng `{{variable}}` để inject data động:

| Variable | Mô tả | Ví dụ |
|----------|-------|-------|
| `{{patientContext}}` | Thông tin bệnh nhân | Giới tính, tuổi, câu hỏi |
| `{{maihua}}` | Dữ liệu quẻ Mai Hoa | Quẻ chính, quẻ biến, hào động |
| `{{diagnostic}}` | Phân tích chẩn đoán | Ngũ hành, tạng phủ, mối quan hệ |
| `{{seasonInfo}}` | Thông tin tiết khí | Mùa, ngũ hành mùa, quan hệ |
| `{{namDuocInfo}}` | Thông tin Nam Dược | Bài thuốc, dược liệu |

**Version Control:**
- Mỗi lần edit, tăng số version (VD: v1 → v2)
- Giữ lại các versions cũ để rollback nếu cần

### 3.2. Activate Prompt

Sau khi tạo prompt mới:

1. Click **"Activate"** để bật prompt
2. Hệ thống sẽ tự động deactivate prompt cũ cùng slug
3. AI sẽ ngay lập tức sử dụng prompt mới (không cần deploy)

### 3.3. Test Prompt

Để test prompt mới:

1. Activate prompt
2. Vào trang chẩn đoán: `/diagnosis`
3. Nhập thông tin và gieo quẻ
4. Kiểm tra kết quả phân tích
5. Nếu không như mong muốn, edit và activate version mới

## 🔧 Bước 4: Variables & Template Syntax

### 4.1. Cú Pháp Variables

```markdown
# Simple variable
{{patientContext}}

# Nested object access
{{patientContext.gender}}
{{maihua.mainHexagram.name}}

# Array access
{{diagnostic.mapping.movingYao.organs[0]}}

# Conditional
{{#if patientContext.age >= 30}}
Bạn đã trên 30 tuổi...
{{else}}
Bạn còn trẻ...
{{/if}}
```

### 4.2. Variables Có Sẵn

Khi AI xử lý, các variables sau sẽ được replace:

```typescript
{
  patientContext: {
    gender: "Nam" | "Nữ",
    age: number,
    subject: "banthan" | "nguoithan" | "khac",
    question: string,
    pronoun: string // "bạn", "anh", "chị"...
  },
  maihua: {
    mainHexagram: { name: string, number: number },
    changedHexagram: { name: string },
    mutualHexagram: { name: string },
    movingLine: number,
    interpretation: {
      health: string,
      trend: string,
      mutual: string
    }
  },
  diagnostic: {
    mapping: {
      upperTrigram: { name, element, primaryOrgans[] },
      lowerTrigram: { name, element, primaryOrgans[] },
      movingYao: {
        position: number,
        organs: string[],
        anatomy: string[],
        clinicalSignificance: string
      }
    },
    expertAnalysis: {
      tiDung: {
        ti: { element },
        dung: { element },
        relation: string,
        severity: "nhẹ" | "trung bình" | "nặng"
      }
    }
  },
  seasonInfo: {
    tietKhi: { name, season, element },
    seasonAnalysis: { relation, impact }
  }
}
```

## 📊 Bước 5: Monitoring & Debugging

### 5.1. Check Prompt Loading

Xem logs trong browser console hoặc server logs:

```
[v0] Attempting to load dynamic prompt from database...
[v0] ✅ Loaded dynamic prompt from database, length: 5234 chars
```

Hoặc nếu fail:

```
[v0] ⚠️ Failed to load dynamic prompt, using hardcoded fallback
```

### 5.2. Verify Active Prompt

Kiểm tra trong database:

```sql
SELECT name, slug, is_active, version, updated_at
FROM prompt_templates
WHERE slug = 'diagnosis'
ORDER BY version DESC;
```

### 5.3. Rollback Version

Nếu prompt mới có vấn đề:

```sql
-- Deactivate prompt hiện tại
UPDATE prompt_templates
SET is_active = false
WHERE slug = 'diagnosis' AND version = 2;

-- Activate version cũ
UPDATE prompt_templates
SET is_active = true
WHERE slug = 'diagnosis' AND version = 1;
```

## 🎯 Best Practices

### 1. **Version Control**
- Luôn tăng version khi edit prompt
- Ghi rõ changelog trong description
- Giữ lại ít nhất 2-3 versions trước

### 2. **Testing**
- Test prompt mới với nhiều case khác nhau
- Kiểm tra output với các tuổi/giới tính khác nhau
- Verify format JSON có đúng không

### 3. **Security**
- Chỉ admin mới được edit prompts
- Audit log mọi thay đổi
- Backup prompts thường xuyên

### 4. **Performance**
- Giữ prompts ngắn gọn (< 10,000 chars)
- Không hard-code quá nhiều examples
- Sử dụng variables thay vì duplicated text

## 🐛 Troubleshooting

### Lỗi: "Failed to load dynamic prompt"

**Nguyên nhân:**
- Database connection bị lỗi
- Không có prompt nào `is_active = true`
- RLS policy chặn query

**Giải pháp:**
```sql
-- Kiểm tra có prompt active không
SELECT * FROM prompt_templates WHERE is_active = true;

-- Kiểm tra RLS
SELECT * FROM prompt_templates; -- Phải chạy được nếu bạn là admin

-- Force activate một prompt
UPDATE prompt_templates SET is_active = true WHERE slug = 'diagnosis' LIMIT 1;
```

### Lỗi: "Variables not replaced"

**Nguyên nhân:**
- Cú pháp variables sai
- Thiếu data trong input

**Giải pháp:**
- Kiểm tra cú pháp: `{{variable}}` (double curly braces)
- Verify variable path: `{{patientContext.gender}}` chứ không phải `{{gender}}`

## 📚 Resources

- **Admin UI**: `/admin/prompts`
- **API Endpoints**:
  - GET `/api/admin/prompts` - Lấy danh sách
  - POST `/api/admin/prompts` - Tạo mới
  - PUT `/api/admin/prompts/[id]` - Cập nhật
  - DELETE `/api/admin/prompts/[id]` - Xóa
  - POST `/api/admin/prompts/[id]/activate` - Activate

- **Database Schema**: `scripts/21-create-prompt-templates.sql`
- **Seed Data**: `scripts/22-seed-default-prompts.sql`
- **Code Reference**: 
  - `lib/ai/prompt-loader.ts` - Load prompts từ DB
  - `lib/ai/dynamic-prompt-builder.ts` - Build prompts với variables
  - `app/api/analyze/route.ts` - Sử dụng dynamic prompts

---

**✅ Hoàn thành setup! Bây giờ bạn có thể quản lý AI prompts trực tiếp từ admin UI mà không cần deploy code.**
