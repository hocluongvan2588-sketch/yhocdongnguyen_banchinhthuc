-- Seed sample data for Y Dịch Đồng Nguyên
-- This creates sample solutions for 3 popular hexagrams

-- Sample user for testing (email: test@example.com)
INSERT INTO users (email, coin_balance) 
VALUES ('test@example.com', 200)
ON CONFLICT (email) DO NOTHING;

-- Hexagram 1: Thủy Hỏa Ký Tế (Water over Fire) - Harmony & Balance
-- Key: 6_3_2 (Khảm over Ly, moving line 2)

-- Acupoint solution for Thủy Hỏa Ký Tế
INSERT INTO solutions (
  hexagram_key, 
  solution_type, 
  title, 
  description,
  unlock_cost,
  acupoint_name,
  acupoint_location,
  acupoint_image_url,
  acupoint_guide_pdf_url,
  reference_source
) VALUES (
  '6_3_2',
  'acupoint',
  'Huyệt Thần Môn (HT7) - Cổng Thần Linh',
  'Huyệt Thần Môn thuộc kinh Tâm, có tác dụng an thần, điều hòa khí huyết, chữa mất ngủ, hồi hộp, lo âu. Đây là huyệt chủ yếu trong điều trị các bệnh liên quan đến tâm thần.',
  50,
  'Thần Môn (神門)',
  'Ở mặt trong cổ tay, nếp gấp cổ tay, phía xương đậu (bên trong gân cơ gấp cổ tay trụ)',
  '/images/acupoints/than-mon-ht7.jpg',
  '/guides/than-mon-application.pdf',
  'Nam Dược Thần Hiệu - Chương Châm Cứu, trang 156'
);

-- Prescription solution for Thủy Hỏa Ký Tế
INSERT INTO solutions (
  hexagram_key,
  solution_type,
  title,
  description,
  unlock_cost,
  herb_name,
  meridian_pathway,
  preparation_method,
  reference_source
) VALUES (
  '6_3_2',
  'prescription',
  'Thiên Vương Bổ Tâm Đan - Thang Bổ Tâm Thần',
  'Bài thuốc cổ phương chuyên điều trị suy nhược tâm thần, mất ngủ, hồi hộp đánh trống ngực, hay quên. Bài thuốc bổ tâm huyết, an tâm thần, kiện não tỳ.',
  50,
  'Nhân sâm 12g, Huyền sâm 15g, Đan sâm 15g, Thục địa 24g, Đương quy 12g, Thiên môn đông 12g, Mai môn đông 12g, Viễn chí 10g, Thạch xương bồ 12g, Bá tử nhân 10g, Toan táo nhân 12g, Ngũ vị tử 10g',
  'Quy kinh: Tâm, Can, Thận',
  'Sắc thuốc với 800ml nước còn 300ml, chia 2 lần uống sáng tối sau ăn',
  'Nam Dược Thần Hiệu - Phương Tâm Khoa, trang 89'
);

-- Symbol number solution for Thủy Hỏa Ký Tế
INSERT INTO solutions (
  hexagram_key,
  solution_type,
  title,
  description,
  unlock_cost,
  number_sequence,
  chanting_instructions,
  reference_source
) VALUES (
  '6_3_2',
  'symbol_number',
  'Tượng Số Thủy Hỏa Ký Tế - 160.380',
  'Dãy số này đại diện cho sự hòa hợp giữa Thủy và Hỏa, âm và dương cân bằng. Số 160 tượng trưng cho Khảm (Thủy), số 380 tượng trưng cho Ly (Hỏa). Khi niệm đều đặn, giúp cân bằng khí huyết, an thần định chí.',
  50,
  '160.380',
  'Ngồi yên tĩnh, thở sâu 3 lần. Niệm thầm dãy số "160.380" liên tục trong 108 lần (có thể dùng chuỗi tràng hạt). Thực hiện vào lúc 11h-13h (giờ Ngọ) hoặc 23h-01h (giờ Tý) để tăng hiệu quả.',
  'Lý Ngọc Sơn - Y Học Tượng Số Học, quyển 2'
);

-- Hexagram 2: Địa Thiên Thái (Earth over Heaven) - Peace & Prosperity
-- Key: 8_1_3 (Khôn over Càn, moving line 3)

INSERT INTO solutions (
  hexagram_key,
  solution_type,
  title,
  description,
  unlock_cost,
  acupoint_name,
  acupoint_location,
  acupoint_image_url,
  acupoint_guide_pdf_url,
  reference_source
) VALUES (
  '8_1_3',
  'acupoint',
  'Huyệt Túc Tam Lý (ST36) - Đại Bổ Huyệt',
  'Túc Tam Lý là một trong những huyệt quan trọng nhất, có tác dụng bổ khí huyết, tăng cường sức đề kháng, điều hòa tỳ vị, chữa bệnh tiêu hóa, mệt mỏi.',
  50,
  'Túc Tam Lý (足三里)',
  'Dưới đầu gối 3 thốn (khoảng 4 ngón tay), ngoài xương chày 1 ngang ngón',
  '/images/acupoints/tuc-tam-ly-st36.jpg',
  '/guides/tuc-tam-ly-application.pdf',
  'Nam Dược Thần Hiệu - Chương Huyệt Đạo, trang 203'
);

INSERT INTO solutions (
  hexagram_key,
  solution_type,
  title,
  description,
  unlock_cost,
  herb_name,
  meridian_pathway,
  preparation_method,
  reference_source
) VALUES (
  '8_1_3',
  'prescription',
  'Tứ Quân Tử Thang - Bổ Khí Kiện Tỳ',
  'Bài thuốc cổ phương bổ khí, kiện tỳ vị, tăng cường tiêu hóa. Dùng cho người suy nhược cơ thể, mệt mỏi, kém ăn, đại tiện lỏng.',
  50,
  'Nhân sâm 10g, Bạch truật 15g, Phục linh 12g, Cam thảo 6g',
  'Quy kinh: Tỳ, Vị, Phế',
  'Sắc với 600ml nước còn 250ml, chia 2 lần uống sáng chiều trước ăn 30 phút',
  'Nam Dược Thần Hiệu - Phương Bổ Ích, trang 45'
);

INSERT INTO solutions (
  hexagram_key,
  solution_type,
  title,
  description,
  unlock_cost,
  number_sequence,
  chanting_instructions,
  reference_source
) VALUES (
  '8_1_3',
  'symbol_number',
  'Tượng Số Địa Thiên Thái - 820.720',
  'Số 820 đại diện Khôn quẻ (Địa), số 720 đại diện Càn quẻ (Thiên). Sự hòa hợp của Trời Đất mang lại thịnh vượng, bình an. Niệm số này giúp tăng cường sinh lực, bổ khí huyết.',
  50,
  '820.720',
  'Thực hiện vào buổi sáng (5h-7h giờ Mão) khi dương khí mọc. Ngồi thẳng lưng, tay đặt trên đan điền, niệm 820.720 liên tục 81 lần.',
  'Lý Ngọc Sơn - Y Học Tượng Số Học, quyển 3'
);

-- Hexagram 3: Thiên Địa Bĩ (Heaven over Earth) - Stagnation
-- Key: 1_8_4 (Càn over Khôn, moving line 4)

INSERT INTO solutions (
  hexagram_key,
  solution_type,
  title,
  description,
  unlock_cost,
  acupoint_name,
  acupoint_location,
  acupoint_image_url,
  acupoint_guide_pdf_url,
  reference_source
) VALUES (
  '1_8_4',
  'acupoint',
  'Huyệt Hợp Cốc (LI4) - Giải Biểu Chỉ Thống',
  'Hợp Cốc là huyệt chủ yếu trong giải biểu, thông kinh lạc, chỉ thống. Đặc biệt hiệu quả với đau đầu, nghẹt mũi, đau răng, và các chứng đình trệ khí huyết.',
  50,
  'Hợp Cốc (合谷)',
  'Ở mu bàn tay, giữa xương bàn tay thứ 1 và thứ 2, phía gần xương bàn tay thứ 2',
  '/images/acupoints/hop-coc-li4.jpg',
  '/guides/hop-coc-application.pdf',
  'Nam Dược Thần Hiệu - Chương Kinh Lạc, trang 178'
);

INSERT INTO solutions (
  hexagram_key,
  solution_type,
  title,
  description,
  unlock_cost,
  herb_name,
  meridian_pathway,
  preparation_method,
  reference_source
) VALUES (
  '1_8_4',
  'prescription',
  'Sơ Kinh Hoạt Huyết Thang - Thông Kinh Hoạt Huyết',
  'Bài thuốc dùng cho các chứng khí trệ huyết ứ, đau nhức cơ thể, kinh nguyệt không đều. Có tác dụng hành khí hoạt huyết, thông kinh chỉ thống.',
  50,
  'Đương quy 12g, Xích thược 10g, Xuyên khung 6g, Đào nhân 10g, Hồng hoa 6g, Ngưu tất 12g, Địa long 10g, Khương hoàng 6g, Cam thảo 6g',
  'Quy kinh: Can, Tâm, Tỳ',
  'Sắc với 800ml nước còn 300ml, chia 2 lần sáng tối sau ăn',
  'Nam Dược Thần Hiệu - Phương Hoạt Huyết, trang 134'
);

INSERT INTO solutions (
  hexagram_key,
  solution_type,
  title,
  description,
  unlock_cost,
  number_sequence,
  chanting_instructions,
  reference_source
) VALUES (
  '1_8_4',
  'symbol_number',
  'Tượng Số Thiên Địa Bĩ - 720.820',
  'Ngược với Địa Thiên Thái, quẻ này biểu hiện sự nghẽn tắc giữa Thiên và Địa. Niệm số 720.820 giúp phá vỡ đình trệ, thông suốt khí huyết, hóa giải tắc nghẽn.',
  50,
  '720.820',
  'Khi cảm thấy tắc nghẽn, khó chịu, niệm số 720.820 trong 49 lần. Thực hiện khi đi bộ hoặc vận động nhẹ để tăng lưu thông khí huyết.',
  'Lý Ngọc Sơn - Y Học Tượng Số Học, quyển 2'
);

COMMENT ON TABLE solutions IS 'Contains 9 sample solutions (3 hexagrams × 3 solution types) for testing';
