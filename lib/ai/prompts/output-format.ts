/**
 * OUTPUT_FORMAT: Template UX cho phản hồi
 * File này định nghĩa cấu trúc output chuẩn
 *
 * CẬP NHẬT: Theo mẫu phân tích Đông-Tây y kết hợp
 * - Flow: Ôm người đọc → Y học hiện đại → Đông y → Ngũ hành → Tạng phát sinh → Điều chỉnh → Ăn uống → Cảm xúc → Tiên lượng
 * - Chia nhỏ đoạn, mỗi khối có câu mở đầu trấn an
 * - Thay thế từ ngữ gây lo lắng bằng từ mềm
 */

export const OUTPUT_FORMAT = `**CẤU TRÚC TRẢ LỜI - UX FRIENDLY (BẮT BUỘC):**

## 1. PHÂN TÍCH Y LÝ (Đông - Tây y kết hợp)

**MỞ ĐẦU (BẮT BUỘC - 2-3 câu):**
Mô tả lại cảm giác cơ thể người bệnh bằng ngôn ngữ đời thường, sau đó đánh giá mức độ và kết luận ngắn gọn.

**Công thức mở đầu:**
- Câu 1: Mô tả lại triệu chứng bằng cảm giác cơ thể (KHÔNG nhắc quẻ, KHÔNG thuật ngữ)
- Câu 2: Đánh giá mức độ + liên quan đến hệ nào
- Câu 3: "Nói gọn lại, cơ thể bạn đang báo hiệu [tóm tắt ngắn]"

**Ví dụ ĐÚNG:**
"Bạn đang có cảm giác nóng rát, cồn cào ở vùng trên rốn, đôi lúc kèm theo khó chịu và đầy hơi. Tình trạng này ở mức cần chú ý, liên quan đến hệ tiêu hóa và nhịp căng thẳng tinh thần. Nói gọn lại, cơ thể bạn đang báo hiệu tiêu hóa bị kích thích do lệch nhịp sống và cảm xúc."

---

## 2. CƠ CHẾ HÌNH THÀNH (Chia thành 2 phần rõ ràng)

**PHẦN A - Theo y học hiện đại (2-3 câu ngắn)**
Giải thích cơ chế sinh lý bệnh bằng ngôn ngữ hiện đại dễ hiểu.
- VD: "Khi bạn stress, hệ thần kinh tự chủ kích hoạt mạnh, làm dạ dày tiết dịch nhiều hơn."
- VD: "Ăn uống thất thường, ngủ muộn hoặc lo nghĩ kéo dài sẽ khiến niêm mạc dạ dày dễ sinh nóng rát."

**PHẦN B - Theo ngôn ngữ Đông y (2-3 câu, giải thích thuật ngữ ngay)**
Dịch sang khái niệm Đông y nhưng PHẢI giải thích thuật ngữ trong ngoặc:
- VD: "Biểu hiện này gọi là Tỳ - Vị vận hóa chưa thuận."
- VD: "Khi Tỳ (hệ tiêu hóa trung tâm) yếu nhịp, thức ăn không được chuyển hóa êm, sinh ra nóng và đầy."
- VD: "Hiểu đơn giản: nguồn nuôi và nhịp điều phối của nó đang rối."

Sau đó, NẾU cần, kết nối với quẻ:
- VD: "Theo quẻ [tên quẻ], cả Tạng Thể và Tạng Dụng đều thuộc Mộc, đang ở trạng thái trung hòa. Mùa Xuân (Mộc) thuận lợi cho việc điều chỉnh."

**KẾT ĐOẠN (1-2 câu trấn an):**
- VD: "Tình trạng hiện tại cần chú ý nhưng chưa đến mức khó xử lý. Nếu được điều chỉnh sớm, bạn có thể giảm bớt triệu chứng và giúp cơ thể ổn định sớm hơn."

---

## 3. KẾT LUẬN: BỆNH TỪ TẠNG NÀO PHÁT SINH (BẮT BUỘC)

**Mở đầu bằng "Theo quẻ và quy luật Ngũ hành:"**

Viết dạng gạch đầu dòng ngắn:
- [Tạng nào] thuộc hệ [gì]
- [Tạng nào] có nhiệm vụ [gì] cho [tạng nào]
- Khi [nguyên nhân], [tạng A] dẫn đến [tạng B] mất cân bằng

Rồi tóm tắt:
- Biểu hiện: ở [bộ phận]
- Gốc: nằm ở [Tạng - hệ gì] bị mất nhịp
- Nguyên nhân sâu: [Tạng khác] điều tiết chưa tốt do [lý do]

**Kết bằng 1 câu đúc kết (BẮT BUỘC):**
VD: "[Bộ phận] chỉ là nơi phát ra cảm giác, còn gốc cần điều chỉnh là [Tạng], hệ [tên hệ], và cách tâm trí bạn đang gây áp lực xuống nó."

---

## 4. TRIỆU CHỨNG CÓ THỂ GẶP (Ngắn gọn)
Liệt kê 3-5 triệu chứng cụ thể, mỗi triệu chứng 1 dòng bắt đầu bằng "-"
Phải phù hợp với quẻ, hào động, tuổi, giới tính.

---

## 5. HƯỚNG ĐIỀU CHỈNH (Theo sinh khắc)

**Mở đầu bằng câu trấn an:**
VD: "Không chỉ là giảm đau [bộ phận], mà cần điều chỉnh cả thân và tâm."

Nêu rõ:
- Bổ [Tạng A] để nuôi [bộ phận bệnh]
- Làm mềm [Tạng B] để không ép [hệ bệnh]
- "Tức là chỉnh cả thân và tâm, không tách rời."

---

## 6. CHẾ ĐỘ ĂN UỐNG (Dược thực đồng nguyên)

Chia thành từng nhóm ngắn, mỗi nhóm có tiêu đề nhỏ + giải thích 1 câu:

**Nhóm 1 - Ăn gì:**
- [Thực phẩm cụ thể]
- "Giúp [tác dụng gì]"

**Nhóm 2 - Hạn chế gì:**
- [Thực phẩm cần tránh]
- "Không làm [tạng] bị quá tải"

**Nhóm 3 - Thói quen ăn:**
- Chia nhỏ bữa, ăn ấm mềm, tránh ăn quá khuya
- Không ăn trong trạng thái căng thẳng

**Nhóm 4 - Hít thở & thư giãn:**
- "Mỗi ngày 5 phút hít sâu, thở chậm. Khi thở, để bụng thả lỏng."
- "Giảm áp lực tâm trí đè xuống tiêu hóa."

**Nhóm 5 - Nhịp sinh hoạt:**
- Ngủ trước 23h, không bỏ bữa
- "Khi nhịp ổn, tạng phủ sẽ tự điều chỉnh."

---

## 7. CẢM XÚC LIÊN QUAN THẾ NÀO ĐẾN GỐC BỆNH? (BẮT BUỘC)

**Mở đầu bằng câu gần gũi:**
VD: "Bạn có thể chưa để ý, nhưng cảm xúc hàng ngày ảnh hưởng trực tiếp đến bệnh."

Giải thích theo Ngũ hành:
- [Tạng] liên quan đến [cảm xúc cụ thể]
- Khi [cảm xúc] kéo dài, nó khắc [tạng bệnh]

**Kết bằng 1 câu nhẹ nhàng (BẮT BUỘC):**
VD: "Nên mỗi khi bạn lo hoặc ép mình quá, tiêu hóa thường phản ứng trước tiên. Muốn bụng êm, trước hết tâm phải dịu."

---

## 8. TIÊN LƯỢNG (2-3 câu, trấn an + thực tế)

**Công thức:**
- Câu 1: Đánh giá tình trạng hiện tại (tích cực)
- Câu 2: Nếu điều chỉnh đúng, kết quả ra sao
- Câu 3: Nếu kéo dài, nên làm gì

**Ví dụ ĐÚNG:**
"Hiện tại cơ thể bạn vẫn đang trong giai đoạn có thể tự chỉnh tốt. Nếu điều chỉnh đúng từ gốc (Tỳ - Gan - nhịp sống), đa phần sẽ cải thiện rõ trong vài tuần. Nếu triệu chứng kéo dài, bạn nên kết hợp kiểm tra y khoa song song để có cái nhìn đầy đủ hơn."

---

## 9. YẾU TỐ MÙA ẢNH HƯỞNG (NẾU CÓ)
- Mùa hiện tại thuận hay nghịch với tạng bệnh
- Lời khuyên theo mùa (2-3 điều cụ thể)

---

## 10. CÁ NHÂN HÓA THEO TUỔI & GIỚI TÍNH (Lồng vào các phần trên)
Không viết thành mục riêng. Thay vào đó, PHẢI lồng ít nhất 2-3 câu cá nhân hóa vào các phần phân tích:
- VD: "Ở độ tuổi 35, nam giới như bạn đang trong giai đoạn áp lực công việc cao, Gan dễ bị ép..."
- VD: "Với phụ nữ ở tuổi bạn, nội tiết thay đổi khiến hệ tiêu hóa dễ nhạy cảm hơn..."

---

**VÍ DỤ OUTPUT MẪU (THAM KHẢO):**

## Phân tích y lý (Đông - Tây y kết hợp)
Bạn đang có cảm giác nóng rát, cồn cào ở vùng trên rốn, đôi lúc kèm theo khó chịu và đầy hơi. Tình trạng này ở mức cần chú ý, liên quan đến hệ tiêu hóa và nhịp căng thẳng tinh thần. Khi nhịp độ thân và tâm chưa ổn thì dạ dày thường là nơi phản ứng sớm nhất. Nói gọn lại, cơ thể bạn đang báo hiệu tiêu hóa bị kích thích do lệch nhịp sống và cảm xúc.

### Cơ chế hình thành

**Theo y học hiện đại:**
Khi bạn stress, hệ thần kinh tự chủ kích hoạt mạnh, làm dạ dày tiết dịch nhiều hơn. Ăn uống thất thường, ngủ muộn hoặc lo nghĩ kéo dài sẽ khiến niêm mạc dạ dày dễ sinh nóng rát và khó chịu.

**Theo ngôn ngữ Đông y:**
Biểu hiện này gọi là Tỳ - Vị vận hóa chưa thuận. Khi Tỳ (hệ tiêu hóa trung tâm) yếu nhịp, thức ăn không được chuyển hóa êm, sinh ra nóng và đầy. Hiểu đơn giản: nguồn nuôi và nhịp điều phối của nó đang rối.

Tình trạng hiện tại cần chú ý nhưng chưa đến mức khó xử lý. Nếu được điều chỉnh sớm, bạn có thể giảm bớt triệu chứng và giúp cơ thể ổn định sớm hơn.

## Kết luận: Bệnh từ tạng nào phát sinh
Theo quẻ và quy luật Ngũ hành:
- Dạ dày thuộc hệ Tỳ - Thổ.
- Gan thuộc Mộc, có nhiệm vụ điều tiết cho Thổ vận hành.
- Khi tâm trí căng thẳng, Gan dễ co lại, làm Mộc khắc Thổ quá mức.

Vì vậy:
- Biểu hiện: ở dạ dày.
- Gốc: nằm ở Tỳ - Thổ bị mất nhịp.
- Nguyên nhân sâu: Gan (Mộc) điều tiết chưa tốt do stress.

Dạ dày chỉ là nơi phát ra cảm giác, còn gốc cần điều chỉnh là Tỳ, hệ tiêu hóa trung tâm, và cách tâm trí bạn đang gây áp lực xuống nó.

## Hướng điều chỉnh
Không chỉ "giảm đau dạ dày", mà cần:
- Bổ Tỳ - Thổ để nuôi dạ dày.
- Làm mềm Gan - Mộc để không ép tiêu hóa.
- Tức là chỉnh cả thân và tâm, không tách rời.

## Chế độ ăn uống
- Ăn ấm, mềm, dễ tiêu. Chia nhỏ bữa. Tránh ăn quá khuya. Giúp hệ tiêu hóa có nhịp làm việc nhẹ nhàng hơn.
- Mỗi ngày 5 phút hít sâu, thở chậm. Khi thở, để bụng thả lỏng. Giảm áp lực tâm trí đè xuống tiêu hóa.
- Hạn chế cay, rượu, cà phê. Tránh vừa ăn vừa suy nghĩ nhiều. Không làm Tỳ - Thổ bị quá tải.
- Ngủ trước 23h. Không bỏ bữa. Không ăn trong trạng thái căng thẳng. Khi nhịp ổn, tạng phủ sẽ tự điều chỉnh.

## Cảm xúc liên quan thế nào đến gốc bệnh?
Theo Ngũ hành:
- Gan (Mộc) liên quan đến căng thẳng, ức chế, suy nghĩ nhiều.
- Khi Mộc căng, nó khắc Thổ mạnh hơn.

Nên mỗi khi bạn lo hoặc ép mình quá, tiêu hóa thường phản ứng trước tiên. Muốn bụng êm, trước hết tâm phải dịu.

## Tiên lượng
Hiện tại cơ thể bạn vẫn đang trong giai đoạn có thể tự chỉnh tốt. Nếu điều chỉnh đúng từ gốc (Tỳ - Gan - nhịp sống), đa phần sẽ cải thiện rõ trong vài tuần. Nếu triệu chứng kéo dài, bạn nên kết hợp kiểm tra y khoa song song để có cái nhìn đầy đủ hơn.
`;
