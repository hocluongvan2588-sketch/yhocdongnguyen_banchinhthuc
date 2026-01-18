# Tính Năng Thiền Định Tượng Số Bát Quái

## Tổng Quan

Tính năng meditation tương tác cho phép người dùng thực hành niệm số Bát Quái với giao diện trực quan và hướng dẫn AI.

## Các Tính Năng Chính

### 1. Vòng Tròn Đồng Tâm Tương Tác
- **Vòng tiến độ SVG**: Hiển thị tiến trình niệm từ 0 đến 49 lần
- **Hiệu ứng Ripple**: Gợn sóng lan tỏa mỗi khi chạm vào để tạo cảm giác năng lượng
- **Responsive**: Tự động điều chỉnh kích thước trên mobile và desktop

### 2. Tiếng Chuông Thiền Định
- **Tần số F# (370 Hz)**: Nốt Fa thăng được dùng trong các bát bảo thiền định
- **Web Audio API**: Tạo âm thanh trong trẻo không cần file mp3 bên ngoài
- **Harmonics**: Sử dụng các tần số hài âm để tạo độ sâu và sự an tâm

### 3. AI Dẫn Dắt (Giọng Aoede)
- **Câu dẫn dắt**: "Thả lỏng. Niệm theo chuông. [Số]. Hãy để âm thanh chữa lành tâm hồn bạn."
- **Tích hợp Gemini TTS**: Sử dụng model gemini-2.5-flash-preview-tts
- **Cache audio**: Lưu trữ để tránh gọi API nhiều lần

### 4. Bộ Đếm Thông Minh
- **Đếm tự động**: Tăng từ 0 đến 49 lần niệm
- **Visual feedback**: Vòng tròn tiến độ đầy dần
- **Audio feedback**: Tiếng chuông vang nhẹ mỗi lần chạm

## Quy Trình Meditation

1. **Bắt đầu**: Người dùng nhấn nút "Bắt đầu Meditation"
2. **Chuông mở đầu**: Hệ thống gõ chuông đầu tiên
3. **AI dẫn dắt**: Giọng Aoede nói câu hướng dẫn
4. **Niệm tương tác**: 
   - Người dùng chạm vào vòng tròn
   - Mỗi lần chạm: tiếng chuông + số đếm tăng + ripple effect
5. **Hoàn thành**: Khi đạt 49 lần, chuông kết thúc vang lên

## Tối Ưu Hóa

### Cache Strategy
- **SessionStorage**: Lưu audio đã generate trong phiên làm việc
- **IndexedDB**: Lưu lâu dài cho các dãy số phổ biến
- **Key format**: `tts_cache_${sequence.join('')}`

### Error Handling
- **429 Too Many Requests**: Exponential backoff với retry
- **Fallback**: Nếu TTS fail, hiển thị text hướng dẫn
- **Network error**: Thông báo rõ ràng và cho phép retry

## Technical Stack

- **Gemini TTS API**: Text-to-Speech với giọng Aoede
- **Web Audio API**: Tạo tiếng chuông thiền định
- **React Hooks**: useState, useEffect, useRef
- **SVG Animation**: Vòng tròn tiến độ và ripple effects
- **TypeScript**: Type-safe development

## API Limits (Free Tier)

- **RPM**: 2-15 requests/minute
- **RPD**: Giới hạn theo ngày (đủ cho cá nhân)
- **Solution**: Cache aggressive để giảm số lần gọi API
