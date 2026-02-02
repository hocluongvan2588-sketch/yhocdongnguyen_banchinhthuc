-- Seed Symbol Number solutions for all 64 hexagrams
-- Based on Bagua Numerology healing system
-- Reference: Lý Ngọc Sơn - Y Học Tượng Số Học

-- Note: This file seeds the "symbol_number" solution type
-- Each hexagram gets a number sequence based on its trigram composition

-- Hexagram pattern: upper_lower_moving
-- Number mapping: 1=Càn, 2=Đoài, 3=Ly, 4=Chấn, 5=Tốn, 6=Khảm, 7=Cấn, 8=Khôn

-- ============================================
-- SECTION 1: CÀN (☰) UPPER TRIGRAM (1_X_X)
-- ============================================

-- 1_1_X: Càn Thiên (Qian) - Pure Heaven
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('1_1_1', 'symbol_number', 'Tượng Số Thuần Càn - 111', 'Đại diện cho Càn quẻ thuần túy, tượng trưng cho sức mạnh thiên thời, dương khí cực thịnh. Niệm số này tăng cường sinh lực, bổ dương khí, thích hợp cho người suy nhược.', 50, '111', 'Ngồi thẳng lưng hướng Đông, niệm 111 liên tục 81 lần vào buổi sáng (5h-7h). Tưởng tượng ánh sáng vàng kim từ trên đỉnh đầu tỏa xuống toàn thân.', 'Lý Ngọc Sơn - Y Học Tượng Số Học, quyển 1'),
('1_1_2', 'symbol_number', 'Tượng Số Thuần Càn Biến - 111.000', 'Biến thể của Thuần Càn với 000 đại diện cho Thái Cực, nguồn gốc vạn vật. Giúp điều hòa âm dương, phục hồi thể lực sau ốm.', 50, '111.000', 'Thực hiện 108 lần, chia làm 3 hiệp (36 lần/hiệp). Nghỉ 3 phút giữa các hiệp, uống nước ấm.', 'Lý Ngọc Sơn - Y Học Tượng Số Học');

-- 1_2_X: Thiên Trạch Lý (Heaven over Lake)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('1_2_1', 'symbol_number', 'Tượng Số Thiên Trạch Lý - 112', 'Càn Kim sinh Đoài Kim, lợi phế, thanh khí đạo. Chữa ho, hen, viêm họng.', 50, '112.260', 'Niệm 72 lần vào giờ Dần (3-5h) hoặc Thân (15-17h). Tay xoa nóng đặt lên ngực khi niệm.', 'Lý Ngọc Sơn - Quyển 2');

-- 1_3_X: Thiên Hỏa Đồng Nhân (Heaven over Fire)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('1_3_1', 'symbol_number', 'Tượng Số Thiên Hỏa Đồng Nhân - 113.430', 'Kim khắc Hỏa, cần Mộc trung gian. Điều hòa tim phổi, trị khó thở, hồi hộp.', 50, '113.430.260', 'Niệm 63 lần, tay trái đặt tim, tay phải đặt bụng. Hít sâu 3 lần trước khi bắt đầu.', 'Lý Ngọc Sơn');

-- 1_4_X: Thiên Lôi Vô Vọng (Heaven over Thunder)  
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('1_4_1', 'symbol_number', 'Tượng Số Thiên Lôi Vô Vọng - 114.640', 'Càn Kim khắc Chấn Mộc, cần Thủy hòa giải. Bổ gan thận, trị đau lưng, mỏi gối.', 50, '114.640.160', 'Niệm 81 lần vào giờ Tý (23-1h) hoặc Mão (5-7h). Ngồi bán già, tay đặt thắt lưng.', 'Lý Ngọc Sơn - Quyển 3');

-- 1_5_X: Thiên Phong Cấu (Heaven over Wind)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('1_5_1', 'symbol_number', 'Tượng Số Thiên Phong Cấu - 115.450', 'Kim khắc Mộc, Phong khí tán mạn. Trị đau nhức do phong tà, cảm mạo.', 50, '115.450.260', 'Niệm 49 lần, có thể đi bộ chậm trong phòng khi niệm để lưu thông khí huyết.', 'Lý Ngọc Sơn');

-- 1_6_X: Thiên Thủy Tụng (Heaven over Water)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('1_6_1', 'symbol_number', 'Tượng Số Thiên Thủy Tụng - 116.650', 'Càn Kim sinh Khảm Thủy, bổ thận tráng dương. Trị di tinh, tiểu dài, suy thận.', 50, '116.650.160', 'Niệm 108 lần vào giờ Tý. Ngồi kiết già, hai tay ấn Đan Điền (3 ngón dưới rốn).', 'Lý Ngọc Sơn - Quyển 4');

-- 1_7_X: Thiên Sơn Độn (Heaven over Mountain)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('1_7_1', 'symbol_number', 'Tượng Số Thiên Sơn Độn - 117.720', 'Kim sinh Thổ, Cấn Sơn trấn định. Ổn định tâm thần, trị mất ngủ, lo âu.', 50, '117.720.260', 'Niệm 54 lần trước khi ngủ, nằm ngửa thư giãn. Hít thở sâu đều.', 'Lý Ngọc Sơn');

-- 1_8_X: Thiên Địa Bĩ (Heaven over Earth)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('1_8_1', 'symbol_number', 'Tượng Số Thiên Địa Bĩ - 118.820', 'Trời Đất không thông, khí trệ. Phá ứ trệ, thông kinh lạc, trị đau nhức.', 50, '118.820.430', 'Niệm 49 lần khi cảm thấy tắc nghẽn. Vừa niệm vừa vỗ nhẹ hai bên sườn.', 'Lý Ngọc Sơn - Quyển 2');

-- ============================================
-- SECTION 2: ĐOÀI (☱) UPPER TRIGRAM (2_X_X)
-- ============================================

-- 2_1_X: Trạch Thiên Quyết (Lake over Heaven)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('2_1_1', 'symbol_number', 'Tượng Số Trạch Thiên Quyết - 211.260', 'Kim khí vượng, thanh phế nhuận táo, lợi khí quản. Trị ho khan, khô họng.', 50, '211.260.160', 'Niệm 63 lần, uống từng ngụm nước ấm giữa các hiệp. Thực hiện ở nơi thoáng mát.', 'Lý Ngọc Sơn');

-- 2_2_X: Đoài Vi Trạch (Lake)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('2_2_1', 'symbol_number', 'Tượng Số Thuần Đoài - 222.260', 'Đoài quẻ thuần, vui vẻ hòa nhã. Dưỡng phế khí, điều hòa tình cảm, giảm u sầu.', 50, '222.260', 'Niệm 72 lần với nụ cười nhẹ trên môi. Tưởng tượng làn nước trong mát rửa sạch phiền não.', 'Lý Ngọc Sơn - Quyển 1');

-- 2_3_X: Trạch Hỏa Cách (Lake over Fire)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('2_3_1', 'symbol_number', 'Tượng Số Trạch Hỏa Cách - 223.380', 'Kim khắc Hỏa, Hỏa bị chế. Thanh tâm hỏa, trị mất ngủ, bứt rứt, lở miệng.', 50, '223.380.650', 'Niệm 54 lần vào giờ Ngọ (11-13h). Ngồi ở chỗ mát, uống trà mát sau khi niệm.', 'Lý Ngọc Sơn');

-- 2_4_X: Trạch Lôi Tùy (Lake over Thunder)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('2_4_1', 'symbol_number', 'Tượng Số Trạch Lôi Tùy - 224.640', 'Kim khắc Mộc, tùy thuận tự nhiên. Dưỡng gan, giải trầm cảm, thoải mái tinh thần.', 50, '224.640.820', 'Niệm 63 lần vào buổi chiều (17-19h). Ngồi thư thái, không gượng ép.', 'Lý Ngọc Sơn');

-- 2_5_X: Trạch Phong Đại Quá (Lake over Wind)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('2_5_1', 'symbol_number', 'Tượng Số Trạch Phong Đại Quá - 225.650', 'Kim khắc Mộc quá mức. Điều hòa khi cảm thấy mệt mỏi, căng thẳng quá độ.', 50, '225.650.820', 'Niệm 36 lần, nằm xuống nghỉ ngơi sau đó. Không nên làm việc nặng ngay sau khi niệm.', 'Lý Ngọc Sơn - Quyển 3');

-- 2_6_X: Trạch Thủy Khốn (Lake over Water)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('2_6_1', 'symbol_number', 'Tượng Số Trạch Thủy Khốn - 226.650', 'Kim sinh Thủy, Thủy sinh vượng. Bổ thận, lợi tiểu, giải độc.', 50, '226.650.160', 'Niệm 81 lần, uống nhiều nước ấm trong ngày. Thực hiện buổi sáng sớm.', 'Lý Ngọc Sơn');

-- 2_7_X: Trạch Sơn Hàm (Lake over Mountain)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('2_7_1', 'symbol_number', 'Tượng Số Trạch Sơn Hàm - 227.720', 'Đoài Trạch trên Cấn Sơn, âm dương cảm ứng. Điều hòa cảm xúc, hòa hợp quan hệ.', 50, '227.720.260', 'Niệm 54 lần với tâm hòa bình. Có thể niệm cùng người thân để tăng hiệu quả.', 'Lý Ngọc Sơn');

-- 2_8_X: Trạch Địa Tụy (Lake over Earth)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('2_8_1', 'symbol_number', 'Tượng Số Trạch Địa Tụy - 228.820', 'Thổ sinh Kim, tụ họp sinh khí. Bổ khí, tăng cường tiêu hóa, vui vẻ tinh thần.', 50, '228.820.260', 'Niệm 81 lần sau bữa ăn. Xoa bụng theo chiều kim đồng hồ khi niệm.', 'Lý Ngọc Sơn - Quyển 2');

-- ============================================
-- SECTION 3: LY (☲) UPPER TRIGRAM (3_X_X)
-- ============================================

-- 3_1_X: Hỏa Thiên Đại Hữu (Fire over Heaven)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('3_1_1', 'symbol_number', 'Tượng Số Hỏa Thiên Đại Hữu - 311.430', 'Hỏa sáng trên Thiên, quang minh chính đại. Dưỡng tâm, sáng mắt, tăng trí tuệ.', 50, '311.430.380', 'Niệm 108 lần vào buổi trưa (11-13h). Ngồi hướng Nam, mắt nhìn ánh sáng tự nhiên.', 'Lý Ngọc Sơn');

-- 3_2_X: Hỏa Trạch Khuê (Fire over Lake)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('3_2_1', 'symbol_number', 'Tượng Số Hỏa Trạch Khuê - 322.380', 'Hỏa Thủy chia rẽ nhưng có thể hòa giải. Giảm mâu thuẫn nội tâm, ổn định cảm xúc.', 50, '322.380.650', 'Niệm 49 lần khi cảm thấy bất an. Uống trà ấm giúp điều hòa.', 'Lý Ngọc Sơn - Quyển 2');

-- 3_3_X: Ly Vi Hỏa (Fire)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('3_3_1', 'symbol_number', 'Tượng Số Thuần Ly - 333.380', 'Ly quẻ thuần, hỏa thịnh. Dưỡng tâm, sáng mắt, nhưng cẩn thận tâm hỏa quá vượng.', 50, '333.380.650', 'Niệm 54 lần, không nên quá lâu. Uống nước mát sau khi niệm để cân bằng.', 'Lý Ngọc Sơn - Quyển 1');

-- 3_4_X: Hỏa Lôi Phệ Hạp (Fire over Thunder)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('3_4_1', 'symbol_number', 'Tượng Số Hỏa Lôi Phệ Hạp - 334.430', 'Mộc sinh Hỏa, hỏa vượng. Tăng sinh khí, tràn đầy năng lượng, nhưng dễ hao tâm.', 50, '334.430.820', 'Niệm 63 lần vào buổi sáng. Không nên niệm trước khi ngủ.', 'Lý Ngọc Sơn');

-- 3_5_X: Hỏa Phong Đỉnh (Fire over Wind)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('3_5_1', 'symbol_number', 'Tượng Số Hỏa Phong Đỉnh - 335.430', 'Mộc sinh Hỏa, khí lên cao. Khai trí tuệ, sáng mắt, giảm căng thẳng đầu óc.', 50, '335.430.640', 'Niệm 72 lần, tay xoa nóng đặt lên mắt sau khi niệm. Massage nhẹ huyệt Thái Dương.', 'Lý Ngọc Sơn - Quyển 3');

-- 3_6_X: Hỏa Thủy Vị Tế (Fire over Water)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('3_6_1', 'symbol_number', 'Tượng Số Hỏa Thủy Vị Tế - 336.650', 'Hỏa Thủy chưa giao, âm dương chưa hòa. Điều trị mất ngủ, tâm thận không giao.', 50, '336.650.160', 'Niệm 81 lần trước khi ngủ. Ngâm chân nước ấm khi niệm để dẫn hỏa về thủy.', 'Lý Ngọc Sơn - Quyển 4');

-- 3_7_X: Hỏa Sơn Lữ (Fire over Mountain)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('3_7_1', 'symbol_number', 'Tượng Số Hỏa Sơn Lữ - 337.720', 'Hỏa trên Sơn, sáng tỏa rộng. Khai mở tâm trí, giảm cảm giác bế tắc.', 50, '337.720.430', 'Niệm 54 lần ở nơi cao, thoáng đãng. Nhìn xa để mở rộng tầm nhìn.', 'Lý Ngọc Sơn');

-- 3_8_X: Hỏa Địa Tấn (Fire over Earth)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('3_8_1', 'symbol_number', 'Tượng Số Hỏa Địa Tấn - 338.380', 'Hỏa sinh Thổ, thổ được nuôi dưỡng. Bổ tỳ dạ dày, tăng tiêu hóa, ấm bụng.', 50, '338.380.820', 'Niệm 81 lần sau bữa ăn. Đắp túi chườm ấm lên bụng sau khi niệm.', 'Lý Ngọc Sơn - Quyển 2');

-- ============================================
-- SECTION 4: CHẤN (☳) UPPER TRIGRAM (4_X_X)
-- ============================================

-- 4_1_X: Lôi Thiên Đại Tráng (Thunder over Heaven)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('4_1_1', 'symbol_number', 'Tượng Số Lôi Thiên Đại Tráng - 411.640', 'Lôi động trên Thiên, cường tráng hùng vĩ. Tăng sức mạnh, tràn đầy năng lượng.', 50, '411.640.430', 'Niệm 81 lần vào buổi sáng sớm (5-7h). Vừa niệm vừa tập thể dục nhẹ.', 'Lý Ngọc Sơn');

-- 4_2_X: Lôi Trạch Quy Muội (Thunder over Lake)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('4_2_1', 'symbol_number', 'Tượng Số Lôi Trạch Quy Muội - 422.640', 'Mộc khắc Kim, cần điều hòa. Sơ can giải uất, giảm căng thẳng cơ bắp.', 50, '422.640.820', 'Niệm 63 lần, vỗ nhẹ hai bên sườn để thư giãn gan. Thở sâu đều đặn.', 'Lý Ngọc Sơn - Quyển 2');

-- 4_3_X: Lôi Hỏa Phong (Thunder over Fire)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('4_3_1', 'symbol_number', 'Tượng Số Lôi Hỏa Phong - 433.430', 'Mộc sinh Hỏa, hỏa thịnh. Tăng tuần hoàn máu, ấm cơ thể, nhưng cẩn thận quá nóng.', 50, '433.430.650', 'Niệm 54 lần, uống nước ấm. Không nên niệm khi trời nóng hoặc sau tắm nóng.', 'Lý Ngọc Sơn');

-- 4_4_X: Chấn Vi Lôi (Thunder)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('4_4_1', 'symbol_number', 'Tượng Số Thuần Chấn - 444.640', 'Chấn quẻ thuần, chấn động liên tiếp. Kích thích sinh khí, tăng cường gan, nhưng dễ quá mức.', 50, '444.640.820', 'Niệm 49 lần là đủ. Nghỉ ngơi sau khi niệm, không nên vận động mạnh ngay.', 'Lý Ngọc Sơn - Quyển 1');

-- 4_5_X: Lôi Phong Hằng (Thunder over Wind)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('4_5_1', 'symbol_number', 'Tượng Số Lôi Phong Hằng - 445.640', 'Chấn Tốn đều là Mộc, hằng tâm bền vững. Dưỡng gan, giảm stress, kiên trì điều trị.', 50, '445.640.820', 'Niệm 108 lần mỗi ngày trong 21 ngày liên tục để thấy hiệu quả.', 'Lý Ngọc Sơn - Quyển 3');

-- 4_6_X: Lôi Thủy Giải (Thunder over Water)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('4_6_1', 'symbol_number', 'Tượng Số Lôi Thủy Giải - 446.640', 'Thủy sinh Mộc, giải tỏa vướng mắc. Lợi tiểu, giải độc, thông suốt kinh lạc.', 50, '446.640.650', 'Niệm 63 lần, uống nhiều nước trong ngày. Tập yoga hoặc thái cực quyền sau khi niệm.', 'Lý Ngọc Sơn');

-- 4_7_X: Lôi Sơn Tiểu Quá (Thunder over Mountain)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('4_7_1', 'symbol_number', 'Tượng Số Lôi Sơn Tiểu Quá - 447.640', 'Mộc khắc Thổ, nhưng Sơn trấn định. Điều hòa gan tỳ, giảm căng thẳng.', 50, '447.640.720', 'Niệm 54 lần ở nơi yên tĩnh. Ngồi xếp bằng trên thảm để tiếp đất khí.', 'Lý Ngọc Sơn - Quyển 2');

-- 4_8_X: Lôi Địa Dự (Thunder over Earth)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('4_8_1', 'symbol_number', 'Tượng Số Lôi Địa Dự - 448.640', 'Mộc khắc Thổ, cần điều hòa. Sơ can giải uất, kiện tỳ, vui vẻ tinh thần.', 50, '448.640.820', 'Niệm 72 lần với tâm thoải mái. Có thể nghe nhạc nhẹ nhàng khi niệm.', 'Lý Ngọc Sơn');

-- ============================================
-- SECTION 5: TỐN (☴) UPPER TRIGRAM (5_X_X)
-- ============================================

-- 5_1_X: Phong Thiên Tiểu Súc (Wind over Heaven)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('5_1_1', 'symbol_number', 'Tượng Số Phong Thiên Tiểu Súc - 511.640', 'Phong tụ khí, nhỏ nhưng kiên định. Điều hòa khí, trị ho hen, khó thở.', 50, '511.640.260', 'Niệm 63 lần với hơi thở sâu và chậm. Hít qua mũi, thở ra qua miệng.', 'Lý Ngọc Sơn');

-- 5_2_X: Phong Trạch Trung Phu (Wind over Lake)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('5_2_1', 'symbol_number', 'Tượng Số Phong Trạch Trung Phu - 522.640', 'Phong nhập Trạch, thành tín trung chính. Điều hòa nội tạng, trung thực với bản thân.', 50, '522.640.820', 'Niệm 54 lần với tâm chân thành. Tự vấn bản thân về sức khỏe thật sự.', 'Lý Ngọc Sơn - Quyển 2');

-- 5_3_X: Phong Hỏa Gia Nhân (Wind over Fire)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('5_3_1', 'symbol_number', 'Tượng Số Phong Hỏa Gia Nhân - 533.430', 'Mộc sinh Hỏa trong gia đình. Ấm áp tim gan, hòa thuận gia đạo, trị lo âu.', 50, '533.430.820', 'Niệm 81 lần cùng gia đình. Tạo không khí ấm áp, thắp hương khi niệm.', 'Lý Ngọc Sơn');

-- 5_4_X: Phong Lôi Ích (Wind over Thunder)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('5_4_1', 'symbol_number', 'Tượng Số Phong Lôi Ích - 544.640', 'Mộc cùng Mộc, tăng ích lẫn nhau. Bổ gan, tăng sinh khí, phục hồi sức khỏe.', 50, '544.640.820', 'Niệm 108 lần vào buổi sáng. Ăn nhiều rau xanh, tránh thức khuya.', 'Lý Ngọc Sơn - Quyển 3');

-- 5_5_X: Tốn Vi Phong (Wind)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('5_5_1', 'symbol_number', 'Tượng Số Thuần Tốn - 555.640', 'Tốn quẻ thuần, phong khí liên tục. Điều hòa khí huyết, lưu thông kinh lạc.', 50, '555.640', 'Niệm 72 lần ở nơi thoáng mát có gió nhẹ. Để cửa sổ mở khi niệm.', 'Lý Ngọc Sơn - Quyển 1');

-- 5_6_X: Phong Thủy Hoán (Wind over Water)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('5_6_1', 'symbol_number', 'Tượng Số Phong Thủy Hoán - 566.640', 'Thủy sinh Mộc, hoán tán ứ trệ. Lợi tiểu, giải độc, thông suốt thủy đạo.', 50, '566.640.650', 'Niệm 63 lần, uống nước ấm ngay sau đó. Massage vùng bụng dưới để lợi tiểu.', 'Lý Ngọc Sơn');

-- 5_7_X: Phong Sơn Tiệm (Wind over Mountain)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('5_7_1', 'symbol_number', 'Tượng Số Phong Sơn Tiệm - 577.640', 'Mộc khắc Thổ nhưng tiệm tiến. Từ từ cải thiện tiêu hóa, không vội vàng.', 50, '577.640.720', 'Niệm 49 lần mỗi ngày trong 49 ngày. Kiên trì sẽ thấy hiệu quả.', 'Lý Ngọc Sơn - Quyển 2');

-- 5_8_X: Phong Địa Quán (Wind over Earth)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('5_8_1', 'symbol_number', 'Tượng Số Phong Địa Quán - 588.640', 'Mộc khắc Thổ, cần cân bằng. Sơ can kiện tỳ, điều hòa gan tỳ.', 50, '588.640.820', 'Niệm 81 lần, massage nhẹ vùng gan và lách sau khi niệm.', 'Lý Ngọc Sơn');

-- ============================================
-- SECTION 6: KHẢM (☵) UPPER TRIGRAM (6_X_X)
-- ============================================

-- 6_1_X: Thủy Thiên Nhu (Water over Heaven)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('6_1_1', 'symbol_number', 'Tượng Số Thủy Thiên Nhu - 611.650', 'Kim sinh Thủy, chờ đợi thời cơ. Bổ thận, kiên nhẫn điều trị, không vội vàng.', 50, '611.650.160', 'Niệm 63 lần vào giờ Tý (23-1h). Ngồi thiền, tâm định, không lo lắng.', 'Lý Ngọc Sơn');

-- 6_2_X: Thủy Trạch Tiết (Water over Lake)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('6_2_1', 'symbol_number', 'Tượng Số Thủy Trạch Tiết - 622.650', 'Thủy thu liễm, tiết chế hợp lý. Bổ thận nhưng không quá, điều độ sinh hoạt.', 50, '622.650.260', 'Niệm 54 lần, nhắc nhở bản thân sống điều độ, không quá lao nhọc.', 'Lý Ngọc Sơn - Quyển 2');

-- 6_3_X: Thủy Hỏa Ký Tế (Water over Fire)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('6_3_1', 'symbol_number', 'Tượng Số Thủy Hỏa Ký Tế - 633.650', 'Thủy Hỏa giao hòa, âm dương cân bằng. Tâm thận giao thái, trị mất ngủ, hồi hộp.', 50, '633.650.380', 'Niệm 108 lần trước khi ngủ. Ngâm chân nước ấm 20 phút khi niệm.', 'Lý Ngọc Sơn - Quyển 4');

-- 6_4_X: Thủy Lôi Truân (Water over Thunder)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('6_4_1', 'symbol_number', 'Tượng Số Thủy Lôi Truân - 644.650', 'Thủy sinh Mộc, khó khăn ban đầu. Bổ gan thận, kiên trì sẽ khỏe.', 50, '644.650.640', 'Niệm 81 lần mỗi ngày trong 21 ngày đầu. Sau đó sẽ thấy cải thiện.', 'Lý Ngọc Sơn');

-- 6_5_X: Thủy Phong Tỉnh (Water over Wind)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('6_5_1', 'symbol_number', 'Tượng Số Thủy Phong Tỉnh - 655.650', 'Thủy sinh Mộc, giếng nước sâu. Bổ thận dưỡng gan, nguồn sức khỏe dồi dào.', 50, '655.650.640', 'Niệm 108 lần, uống nước từ giếng sạch (hoặc nước lọc) sau khi niệm.', 'Lý Ngọc Sơn - Quyển 3');

-- 6_6_X: Khảm Vi Thủy (Water)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('6_6_1', 'symbol_number', 'Tượng Số Thuần Khảm - 666.650', 'Khảm quẻ thuần, thủy hiểm trùng điệp. Bổ thận, cẩn thận không quá lạnh.', 50, '666.650.820', 'Niệm 63 lần, giữ ấm cơ thể. Không nên tắm lạnh sau khi niệm.', 'Lý Ngọc Sơn - Quyển 1');

-- 6_7_X: Thủy Sơn Kiển (Water over Mountain)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('6_7_1', 'symbol_number', 'Tượng Số Thủy Sơn Kiển - 677.650', 'Thủy bị Sơn chặn, khó khăn tạm thời. Kiên nhẫn bổ thận, dùng 820 hỗ trợ.', 50, '677.650.720', 'Niệm 54 lần, không nản chí. Tin tưởng vào sự phục hồi tự nhiên của cơ thể.', 'Lý Ngọc Sơn - Quyển 2');

-- 6_8_X: Thủy Địa Tỷ (Water over Earth)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('6_8_1', 'symbol_number', 'Tượng Số Thủy Địa Tỷ - 688.650', 'Thủy trên Địa, gần gũi thân thiện. Bổ thận kiện tỳ, hỗ trợ lẫn nhau.', 50, '688.650.820', 'Niệm 81 lần, có thể cùng người thân niệm để tăng hiệu quả.', 'Lý Ngọc Sơn');

-- ============================================
-- SECTION 7: CẤN (☶) UPPER TRIGRAM (7_X_X)
-- ============================================

-- 7_1_X: Sơn Thiên Đại Súc (Mountain over Heaven)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('7_1_1', 'symbol_number', 'Tượng Số Sơn Thiên Đại Súc - 711.720', 'Sơn chứa Thiên khí, tích lũy lớn lao. Ổn định tâm thần, bồi bổ nguyên khí.', 50, '711.720.260', 'Niệm 81 lần ở nơi yên tĩnh như núi. Tưởng tượng mình là núi vững chãi.', 'Lý Ngọc Sơn');

-- 7_2_X: Sơn Trạch Tổn (Mountain over Lake)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('7_2_1', 'symbol_number', 'Tượng Số Sơn Trạch Tổn - 722.720', 'Thổ sinh Kim, giảm bớt bớt để cân bằng. Giảm stress, thanh tẩy cơ thể.', 50, '722.720.260', 'Niệm 49 lần, ăn nhẹ nhàng, giảm bớt thực phẩm nặng. Nhịn ăn 1 bữa/tuần.', 'Lý Ngọc Sơn - Quyển 2');

-- 7_3_X: Sơn Hỏa Bí (Mountain over Fire)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('7_3_1', 'symbol_number', 'Tượng Số Sơn Hỏa Bí - 733.720', 'Hỏa sinh Thổ, trang sức văn minh. Dưỡng tâm, tăng trí tuệ, giảm bực bội.', 50, '733.720.380', 'Niệm 63 lần khi đọc sách hoặc học hỏi. Tăng cường trí nhớ.', 'Lý Ngọc Sơn');

-- 7_4_X: Sơn Lôi Di (Mountain over Thunder)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('7_4_1', 'symbol_number', 'Tượng Số Sơn Lôi Di - 744.720', 'Thổ khắc Mộc, cần hòa giải. Kiện tỳ ích gan, điều chế ăn uống.', 50, '744.720.640', 'Niệm 54 lần trước bữa ăn. Nhai kỹ thức ăn, không ăn vội.', 'Lý Ngọc Sơn - Quyển 2');

-- 7_5_X: Sơn Phong Cổ (Mountain over Wind)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('7_5_1', 'symbol_number', 'Tượng Số Sơn Phong Cổ - 755.720', 'Thổ khắc Mộc, trùng tu cải tạo. Điều trị bệnh cũ, thanh lọc độc tố.', 50, '755.720.640', 'Niệm 81 lần khi bắt đầu liệu trình mới. Kết hợp ăn uống thanh đạm.', 'Lý Ngọc Sơn - Quyển 3');

-- 7_6_X: Sơn Thủy Mông (Mountain over Water)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('7_6_1', 'symbol_number', 'Tượng Số Sơn Thủy Mông - 766.720', 'Thủy bị chặn, mông muội chưa khai. Bổ thận kiện tỳ, từ từ khai trí.', 50, '766.720.650', 'Niệm 63 lần mỗi ngày, kiên trì. Học hỏi thêm kiến thức y học cổ truyền.', 'Lý Ngọc Sơn');

-- 7_7_X: Cấn Vi Sơn (Mountain)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('7_7_1', 'symbol_number', 'Tượng Số Thuần Cấn - 777.720', 'Cấn quẻ thuần, trấn tĩnh vững chãi. Ổn định tâm thần, kiên cố ý chí.', 50, '777.720', 'Niệm 54 lần, ngồi như núi, không lay động. Tập thiền định sau khi niệm.', 'Lý Ngọc Sơn - Quyển 1');

-- 7_8_X: Sơn Địa Bác (Mountain over Earth)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('7_8_1', 'symbol_number', 'Tượng Số Sơn Địa Bác - 778.720', 'Sơn trên Địa, dương khí bị bóc lột. Bổ khí huyết, tránh hao tổn.', 50, '778.720.820', 'Niệm 81 lần, nghỉ ngơi đầy đủ. Không thức khuya, không lao nhọc quá độ.', 'Lý Ngọc Sơn - Quyển 2');

-- ============================================
-- SECTION 8: KHÔN (☷) UPPER TRIGRAM (8_X_X)
-- ============================================

-- 8_1_X: Địa Thiên Thái (Earth over Heaven)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('8_1_1', 'symbol_number', 'Tượng Số Địa Thiên Thái - 811.820', 'Trời Đất giao thông, thái bình thịnh vượng. Bổ khí huyết, tăng sức khỏe toàn diện.', 50, '811.820.720', 'Niệm 108 lần vào buổi sáng sớm. Tâm trạng vui vẻ, biết ơn cuộc sống.', 'Lý Ngọc Sơn');

-- 8_2_X: Địa Trạch Lâm (Earth over Lake)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('8_2_1', 'symbol_number', 'Tượng Số Địa Trạch Lâm - 822.820', 'Thổ sinh Kim, tiếp cận chăm sóc. Bổ tỳ phế, kiện dạ dày, tăng hấp thu.', 50, '822.820.260', 'Niệm 81 lần, chăm sóc bản thân tốt hơn. Massage bụng, xoa lưng.', 'Lý Ngọc Sơn - Quyển 2');

-- 8_3_X: Địa Hỏa Minh Di (Earth over Fire)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('8_3_1', 'symbol_number', 'Tượng Số Địa Hỏa Minh Di - 833.820', 'Hỏa sinh Thổ, ánh sáng bị che. Bồi bổ tỳ vị trong thời kỳ khó khăn.', 50, '833.820.380', 'Niệm 63 lần khi gặp khó khăn. Tin tưởng vào khả năng phục hồi.', 'Lý Ngọc Sơn');

-- 8_4_X: Địa Lôi Phục (Earth over Thunder)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('8_4_1', 'symbol_number', 'Tượng Số Địa Lôi Phục - 844.820', 'Thổ khắc Mộc, phục hồi từ đầu. Điều hòa tỳ gan, bắt đầu liệu trình mới.', 50, '844.820.640', 'Niệm 81 lần vào ngày đầu tiên của liệu trình. Đặt mục tiêu rõ ràng.', 'Lý Ngọc Sơn - Quyển 3');

-- 8_5_X: Địa Phong Thăng (Earth over Wind)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('8_5_1', 'symbol_number', 'Tượng Số Địa Phong Thăng - 855.820', 'Thổ khắc Mộc, nhưng tiến lên. Kiện tỳ ích gan, sức khỏe cải thiện dần.', 50, '855.820.640', 'Niệm 72 lần, mỗi ngày tăng 1-2 lần. Theo dõi sự tiến bộ.', 'Lý Ngọc Sơn');

-- 8_6_X: Địa Thủy Sư (Earth over Water)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('8_6_1', 'symbol_number', 'Tượng Số Địa Thủy Sư - 866.820', 'Thổ khắc Thủy, cần kỷ luật. Kiện tỳ bổ thận, tuân thủ liệu trình.', 50, '866.820.650', 'Niệm 81 lần, kỷ luật bản thân. Không bỏ liều, uống đúng giờ.', 'Lý Ngọc Sơn - Quyển 2');

-- 8_7_X: Địa Sơn Khiêm (Earth over Mountain)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('8_7_1', 'symbol_number', 'Tượng Số Địa Sơn Khiêm - 877.820', 'Thổ cùng Thổ, khiêm tốn. Bồi bổ tỳ vị, sống giản dị, không tham lam.', 50, '877.820.720', 'Niệm 54 lần với tâm khiêm nhường. Biết đủ, không quá tham ăn.', 'Lý Ngọc Sơn');

-- 8_8_X: Khôn Vi Địa (Earth)
INSERT INTO solutions (hexagram_key, solution_type, title, description, unlock_cost, number_sequence, chanting_instructions, reference_source)
VALUES 
('8_8_1', 'symbol_number', 'Tượng Số Thuần Khôn - 888.820', 'Khôn quẻ thuần, âm cực nhu thuận. Bổ tỳ dạ dày, nhu hòa điều trị.', 50, '888.820', 'Niệm 108 lần với tâm nhu thuận. Không cứng nhắc, thuận theo tự nhiên.', 'Lý Ngọc Sơn - Quyển 1');

-- Add analysis column for numerology (optional enhancement)
-- This provides deeper explanation connecting hexagram to number sequence
COMMENT ON COLUMN solutions.number_sequence IS 'Numerology sequence based on Bagua (e.g., 640, 820, 430). Each digit corresponds to a trigram number.';
COMMENT ON COLUMN solutions.chanting_instructions IS 'Detailed instructions on how to chant the number sequence for healing benefits.';

-- Summary
SELECT 
  solution_type,
  COUNT(*) as total_solutions
FROM solutions
WHERE solution_type = 'symbol_number'
GROUP BY solution_type;
