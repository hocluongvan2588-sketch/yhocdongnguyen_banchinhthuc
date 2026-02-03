/**
 * TẦNG 2 - JSON FORMATTER (OPTIMIZED)
 * Model: GPT-4o-mini (nhẹ, nhanh, chỉ format không sáng tạo)
 * Mục tiêu: Chuyển đổi text từ Unified Layer thành JSON chuẩn
 * Temperature: 0.1 (rất thấp, tối đa tính deterministic)
 * Output: JSON thuần túy, không text bên ngoài
 */

export function buildJsonFormatterPrompt(unifiedContent: string): string {
  return `Bạn là hệ thống FORMAT DỮ LIỆU. KHÔNG sáng tạo, CHỈ trích xuất và format.

NHIỆM VỤ: Chuyển nội dung thành JSON THEO ĐÚNG SCHEMA.

═══════════════════════════════════════════════════════════
NỘI DUNG CẦN CHUYỂN ĐỔI:
═══════════════════════════════════════════════════════════

${unifiedContent}

═══════════════════════════════════════════════════════════
SCHEMA JSON (TUÂN THỦ CHÍNH XÁC):
═══════════════════════════════════════════════════════════

{
  "patientInfo": {
    "subject": "string - Đối tượng hỏi (banthan/cha/me/con/vo/chong/anhchiem)",
    "gender": "string - Giới tính PHẢI KHỚP với input (Nam/Nữ)",
    "age": "number - Tuổi PHẢI KHỚP với input",
    "pronoun": "string - Cách xưng hô (bạn/cha bạn/mẹ bạn/con bạn/vợ bạn/chồng bạn/anh chị em bạn)"
  },
  "summary": "string - Lấy từ mục 【TÓM TẮT BỆNH TRẠNG】, 2-3 câu",
  "explanation": "string - Ghép 4 đoạn PHÂN TÍCH Y LÝ thành 1 chuỗi, ngăn cách bằng \\n\\n",
  "symptoms": ["string", "string", ...] - Lấy từ mục TRIỆU CHỨNG, 5-8 items,
  "emotionalConnection": {
    "emotion": "string - Cảm xúc CỤ THỂ gây bệnh (VD: Giận dữ, Lo nghĩ, Sợ hãi, Buồn bã)",
    "organ": "string - Tạng phủ bị ảnh hưởng (VD: Gan, Tỳ, Thận, Phổi)",
    "patientFeeling": "string - Mô tả cảm xúc người bệnh đang trải qua (VD: 'Bạn có thể đang cảm thấy dễ cáu gắt...')",
    "mechanismTCM": "string - Cơ chế theo Đông Y (VD: 'Khí Gan uất kết, không sơ tiết...')",
    "mechanismModern": "string - Cơ chế theo Y học hiện đại (VD: 'Tăng cortisol, co mạch máu...')"
  },
  "diet": {
    "shouldEat": ["string - Thực phẩm + lý do", ...] - 4-5 items,
    "shouldAvoid": ["string - Thực phẩm kiêng + lý do", ...] - 3-4 items,
    "drinks": ["string - Thức uống + tác dụng", ...] - 2-3 items
  },
  "lifestyle": ["string - Lời khuyên sinh hoạt", ...] - 4-5 items,
  "prognosis": {
    "outlook": "string - Tiên lượng tổng quan",
    "recoveryTime": "string - Thời gian hồi phục ước tính",
    "improvementSigns": ["string", ...] - 2-3 items,
    "warningSigns": ["string", ...] - 2-3 items
  },
  "treatmentOrigin": {
    "affectedOrgan": "string - Tạng bệnh phát sinh (VD: Gan, Tâm, Tỳ, Phổi, Thận)",
    "affectedElement": "string - Ngũ hành của tạng bệnh (Mộc/Hỏa/Thổ/Kim/Thủy)",
    "motherOrgan": "string - Tạng mẹ cần bổ trợ theo ngũ hành tương sinh",
    "motherElement": "string - Ngũ hành của tạng mẹ",
    "explanation": "string - Giải thích chi tiết (3-4 câu) tại sao cần bổ trợ tạng mẹ thay vì chữa con",
    "treatmentDirection": "string - Hướng điều trị tổng hợp gồm 4 trụ cột cụ thể"
  },
  "seasonalFactor": {
    "currentSeason": "string - Mùa hiện tại (Xuân/Hạ/Thu/Đông)",
    "seasonElement": "string - Ngũ hành của mùa (Mộc/Hỏa/Kim/Thủy)",
    "compatibility": "string - Tương tác với bệnh (Thuận mùa/Nghịch mùa/Trung hòa)",
    "explanation": "string - Giải thích ảnh hưởng cụ thể của mùa (3-4 câu)",
    "seasonalAdvice": ["string - Lời khuyên 1", "string - Lời khuyên 2", "string - Lời khuyên 3"]
  },
  "serviceRecommendations": {
    "herbalMedicine": {
      "recommended": boolean,
      "reason": "string - Lý do từ quẻ"
    },
    "acupressure": {
      "recommended": boolean,
      "reason": "string - Lý do từ quẻ"
    },
    "energyNumber": {
      "recommended": boolean,
      "reason": "string - Lý do từ quẻ"
    }
  }
}

═══════════════════════════════════════════════════════════
QUY TẮC CHUYỂN ĐỔI:
═══════════════════════════════════════════════════════════

0. "patientInfo": TRÍCH XUẤT TỪ MỤC 【THÔNG TIN BỆNH NHÂN】 - BẮT BUỘC CHÍNH XÁC 100%
   - subject: Lấy từ "Đối tượng hỏi:" - chỉ lấy code (banthan/cha/me/con/vo/chong/anhchiem)
   - gender: Lấy từ "Giới tính BỆNH NHÂN:" - PHẢI GIỮ NGUYÊN, KHÔNG ĐƯỢC THAY ĐỔI
   - age: Lấy từ "Tuổi BỆNH NHÂN:" - PHẢI LÀ SỐ NGUYÊN, KHÔNG ĐƯỢC THAY ĐỔI
   - pronoun: Lấy từ "Cách xưng hô:" - giữ nguyên giá trị
   ⚠️ QUAN TRỌNG: Nếu nhầm giới tính hoặc tuổi, toàn bộ JSON sẽ VÔ GIÁ TRỊ

1. "summary": Lấy từ mục 【TÓM TẮT BỆNH TRẠNG】
2. "explanation": Ghép toàn bộ nội dung từ mục 【PHÂN TÍCH Y LÝ CHI TIẾT】 thành 1 STRING, ngăn cách đoạn bằng "\\n\\n"
3. "symptoms": Trích xuất từng triệu chứng từ mục 【TRIỆU CHỨNG CÓ THỂ GẶP】
4. "emotionalConnection": Trích xuất từ mục 【MỐI LIÊN HỆ CẢM XÚC - BỆNH LÝ】
   - emotion: Từ dòng "Cảm xúc có thể gây bệnh:" - Lấy cảm xúc CỤ THỂ (VD: "Giận dữ", "Lo nghĩ", "Sợ hãi")
   - organ: Từ dòng "Tạng phủ bị ảnh hưởng:" - Lấy tên tạng (VD: "Gan", "Tỳ", "Thận")
   - patientFeeling: Từ dòng "Biểu hiện cảm xúc ở người bệnh:" - Lấy NGUYÊN VĂN mô tả cảm xúc
   - mechanismTCM: Từ dòng "Cơ chế gây bệnh (Đông Y):" - Lấy giải thích theo Đông Y
   - mechanismModern: Từ dòng "Cơ chế gây bệnh (Y học hiện đại):" - Lấy giải thích theo Tây Y
5. "diet": Trích xuất từ mục 【CHẾ ĐỘ ĂN UỐNG】
6. "lifestyle": Trích xuất từ mục 【LỜI KHUYÊN SINH HOẠT】
7. "prognosis": Trích xuất từ mục 【TIÊN LƯỢNG & HỒI PHỤC】
8. "treatmentOrigin": Trích xuất từ mục 【KẾT LUẬN: BỆNH TỪ TẠNG NÀO PHÁT SINH】
   - affectedOrgan: Từ dòng "TẠNG BỆNH:" - chỉ lấy tên tạng (VD: "Gan", "Tâm", "Tỳ")
   - motherOrgan: Từ dòng "TẠNG MẸ CẦN BỔ:" - chỉ lấy tên tạng (VD: "Thận", "Gan")
   - explanation: Từ dòng "GIẢI THÍCH:" - lấy toàn bộ nội dung giải thích
   - treatmentDirection: Từ dòng "HƯỚNG ĐIỀU TRỊ:" - lấy toàn bộ phương hướng điều trị
9. "seasonalFactor": Trích xuất từ mục 【YẾU TỐ MÙA ẢNH HƯỞNG】
   - currentSeason: Từ dòng "MÙA HIỆN TẠI:" (VD: "Xuân", "Hạ", "Thu", "Đông")
   - compatibility: Từ dòng "TƯƠNG TÁC:" - chỉ lấy giá trị đầu tiên (VD: "Thuận mùa", "Nghịch mùa", "Trung hòa")
   - explanation: Ghép nội dung từ "GIẢI THÍCH:" và "LỜI KHUYÊN THEO MÙA:"
10. "serviceRecommendations": Trích xuất từ mục 【GỢI Ý DỊCH VỤ CHUYÊN SÂU】
   - recommended = true nếu "Khuyến nghị: Có"
   - recommended = false nếu "Khuyến nghị: Không"

QUY TẮC NGHIÊM NGẶT:
- Output CHỈ CHỨA JSON thuần túy, KHÔNG có text giải thích trước/sau
- "explanation" PHẢI là STRING, KHÔNG phải object
- Tất cả giá trị boolean: true hoặc false (không viết hoa)
- Không thêm field mới ngoài schema
- Nếu thiếu thông tin: string → "", array → [], boolean → false
- TUYỆT ĐỐI KHÔNG tự đoán hoặc sáng tạo dữ liệu không có trong nội dung`;
}

/**
 * JSON FORMATTER CONFIG
 * ═══════════════════════════════════════════════════════════
 * HYBRID ARCHITECTURE: GPT-4o (Quality) + Groq (Speed)
 * ═══════════════════════════════════════════════════════════
 * 
 * Layer 2 sử dụng Groq Llama-3.3-70B thay vì GPT-4o-mini vì:
 * 1. Groq LPU (Language Processing Unit) nhanh 6-10x so với GPU
 * 2. Task format JSON đơn giản, không cần sáng tạo
 * 3. Llama-3.3-70B đủ tốt cho việc parse và format text
 * 
 * Kết quả ước tính:
 * - Trước (GPT-4o-mini): 3-6 giây
 * - Sau (Groq): 0.5-1.5 giây
 * - Tiết kiệm: 2-5 giây mỗi request
 */
export const JSON_FORMATTER_CONFIG = {
  // Config này giữ để reference, thực tế dùng Groq trực tiếp trong route
  model: 'groq/llama-3.3-70b-versatile',
  temperature: 0.05,
  maxTokens: 2600, // Tăng từ 2000 để tránh sát trần khi explanation dài
};
