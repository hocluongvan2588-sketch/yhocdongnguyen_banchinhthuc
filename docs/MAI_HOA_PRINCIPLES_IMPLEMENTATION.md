# Triển Khai Nguyên Tắc Mai Hoa Dịch Số

## Tổng Quan

Hệ thống đã được nâng cấp để tuân thủ đầy đủ 5 nguyên tắc cơ bản của Mai Hoa Dịch Số theo Thiệu Khang Tiết.

## Các Nguyên Tắc Đã Implement

### 1. BẤT ĐỘNG BẤT CHIÊM (Không động không gieo)

**Triết lý:** Chỉ gieo quẻ khi thực sự có sự việc xảy ra, có cảm xúc lo lắng hoặc triệu chứng rõ ràng.

**Implementation:**
- Check xem user có gieo quá 3 lần trong 1 giờ không
- Nếu có → Cảnh báo và khóa tạm thời
- Function: `checkRapidDivination()`

**UI Message:**
> "Tiên sinh Thiệu Khang Tiết dạy: 'Bất động bất chiêm' - không nên gieo quẻ liên tục trong thời gian ngắn. Hãy tịnh tâm và quay lại sau ít nhất 1 giờ."

### 2. NHẤT SỰ NHẤT CHIÊM (Một việc một quẻ)

**Triết lý:** Với một vấn đề, chỉ nên gieo một quẻ duy nhất trong ngày. Hỏi đi hỏi lại gọi là "Độc" (làm nhờn quẻ).

**Implementation:**
- Semantic similarity check với threshold 75%
- So sánh với tất cả consultations trong 24h
- Nếu trùng → Hiển thị kết quả cũ + không cho gieo lại
- Function: `checkDuplicateQuestion()`

**UI Message:**
> Kinh Dịch dạy: "Sơ thệ cáo, tái tam độc, độc tắc bất cáo" (Lần đầu thì bảo, hỏi lại nhiều lần thì không linh nữa).
> 
> Bạn đã hỏi về vấn đề tương tự "..." cách đây X giờ và nhận được quẻ Y.
> 
> Để quẻ có độ ứng nghiệm cao, bạn nên chờ ít nhất 24 giờ trước khi hỏi lại về cùng vấn đề này.

### 3. GIỚI HẠN TẦN SUẤT

**Triết lý:** Một ngày không nên quá lao tâm vào việc chiêm đoán.

**Implementation:**
- Daily limit: 3 lần/ngày
- Spacing: Tối thiểu 15 phút giữa mỗi lần gieo
- Functions: `checkDailyDivinationLimit()`, `checkMinimumSpacing()`

**UI Messages:**
- Daily limit: "Theo triết lý Mai Hoa Dịch Số, một ngày không nên quá lao tâm vào việc chiêm đoán. Bạn đã sử dụng hết 3 lần gieo quẻ hôm nay."
- Spacing: "Để 'khí' được bình ổn và quẻ có độ chính xác cao, vui lòng chờ X phút nữa trước khi gieo quẻ tiếp theo."

### 4. AUTHENTICATION REQUIRED

**Implementation:**
- Tất cả divination functions đều check user authentication
- Nếu chưa login → AuthGateModal
- Tracking qua Supabase để đồng bộ cross-device

### 5. COMPREHENSIVE VALIDATION

**Function:** `canUserDivine()`

Check theo thứ tự:
1. Authentication
2. Rapid divination (3 lần/1h)
3. Minimum spacing (15 phút)
4. Daily limit (3 lần/ngày)
5. Duplicate question (similarity 75% trong 24h)

## UI Components

### MaiHoaGuardrailModal
Modal thông minh hiển thị các loại cảnh báo khác nhau:
- Icon phù hợp (Info/Clock/AlertTriangle)
- Message theo nguyên tắc Mai Hoa
- Hiển thị kết quả cũ nếu là duplicate
- Countdown timer nếu là spacing
- Progress bar nếu là daily limit

## Database Schema

Consultations table tracking:
- `user_id`: User authentication
- `created_at`: Timestamp cho spacing và daily limit
- `diagnosis_text`: Text cho duplicate detection
- `hexagram_name`: Kết quả quẻ

## Benefits

1. **Tăng độ ứng nghiệm:** Tuân thủ nguyên tắc cổ truyền
2. **Better UX:** User hiểu rõ lý do bị giới hạn
3. **Prevent abuse:** Không spam, không hỏi vô tội vạ
4. **Cost optimization:** Giảm API calls không cần thiết
5. **Educational:** Dạy user về triết lý Mai Hoa

## Future Enhancements

- Sentiment analysis để phát hiện "tâm không tĩnh"
- Multi-topic detection để cảnh báo "hỏi nhiều việc cùng lúc"
- Premium users có thể có limit cao hơn
- Analytics dashboard cho admin
