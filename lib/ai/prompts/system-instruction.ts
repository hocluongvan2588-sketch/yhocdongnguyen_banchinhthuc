import { SYSTEM_CORE } from './system-core';
import { MEDICAL_LOGIC } from './medical-logic';
import { OUTPUT_FORMAT } from './output-format';
import { GEOGRAPHY_KNOWLEDGE } from './geography-knowledge';

/**
 * SYSTEM_INSTRUCTION: Prompt tổng hợp
 * 
 * Kiến trúc module hóa giúp:
 * - Tiết kiệm token (chỉ load những gì cần)
 * - Dễ maintain và debug
 * - Kiểm soát hành vi AI tốt hơn
 * 
 * 3 modules:
 * - SYSTEM_CORE: Triết lý UX + Giọng điệu + Quy tắc giao tiếp
 * - MEDICAL_LOGIC: Logic Y Dịch (Thể-Dụng, quẻ, hào, mùa)
 * - OUTPUT_FORMAT: Template cấu trúc output chuẩn
 */

export const SYSTEM_INSTRUCTION = `${SYSTEM_CORE}

---

${MEDICAL_LOGIC}

---

${OUTPUT_FORMAT}`;

// Export riêng từng module để có thể dùng độc lập
export { SYSTEM_CORE, MEDICAL_LOGIC, OUTPUT_FORMAT, GEOGRAPHY_KNOWLEDGE };

/**
 * ANALYSIS_RULES: Thứ tự phân tích ưu tiên
 */
export const ANALYSIS_RULES = `
**THỨ TỰ PHÂN TÍCH (ƯU TIÊN):**
Khi nhận dữ liệu bệnh nhân, phân tích theo thứ tự:

1. **Quan hệ Thể - Dụng** (Cốt lõi - luôn làm đầu tiên)
   - Dụng sinh Thể: Dễ hồi phục
   - Thể khắc Dụng: Kéo dài nhưng tự chữa được
   - Thể sinh Dụng: Suy kiệt, cần quan tâm hơn
   - Dụng khắc Thể: Có xu hướng phức tạp, cần lưu ý
   - Tỷ hòa: Ổn định

2. **Mùa và thời điểm** (Ảnh hưởng lớn đến tiên lượng)
   - Thể được mùa: Sức đề kháng tốt
   - Thể mất mùa: Cần chú ý hơn

3. **Quẻ Biến** (Xu hướng phát triển)
   - Quẻ biến tốt hơn: Đang cải thiện
   - Quẻ biến xấu hơn: Cần điều chỉnh sớm

4. **Hào động** (Vị trí cụ thể - CHỈ khi phù hợp triệu chứng)

5. **Độ tuổi** (Điều chỉnh lời khuyên)

6. **Địa lý** (CHỈ khi có thông tin)
`;

/**
 * CORE_KNOWLEDGE: Tri thức cốt lõi về quẻ và cơ quan
 */
export const CORE_KNOWLEDGE = `
**8 Quẻ và Cơ quan:**
- Càn/Đoài (Kim): Phổi, Da, Mũi, Hô hấp
- Ly (Hỏa): Tim, Mạch máu, Mắt, Tinh thần
- Chấn/Tốn (Mộc): Gan, Mật, Cơ, Gân
- Khảm (Thủy): Thận, Bàng quang, Xương, Tai
- Cấn/Khôn (Thổ): Tỳ, Vị, Tiêu hóa, Cơ thịt

**Triệu chứng theo bộ phận:**
- Đầu/não: Càn (Kim), Ly (Hỏa-Tim), Khảm (Thủy-Thận)
- Ngực/tim/phổi: Đoài (Kim-Phổi), Ly (Hỏa-Tim), Chấn (Mộc-Gan)
- Bụng/tiêu hóa: Cấn/Khôn (Thổ-Tỳ Vị)
- Chân/gối/xương: Khảm (Thủy-Thận), Chấn/Tốn (Mộc-Gan)
- Da/da liễu: Càn/Đoài (Kim-Phổi)
`;
