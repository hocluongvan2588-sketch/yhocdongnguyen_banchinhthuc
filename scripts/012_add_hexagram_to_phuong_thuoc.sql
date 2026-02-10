-- =====================================================
-- MIGRATION: Add hexagram mapping to nam_duoc_phuong_thuoc
-- Cho phep mapping bai thuoc voi cac que cu the
-- =====================================================

-- Them cot que_thuong va que_ha (so trigram 1-8)
ALTER TABLE public.nam_duoc_phuong_thuoc 
ADD COLUMN IF NOT EXISTS que_thuong INTEGER CHECK (que_thuong BETWEEN 1 AND 8),
ADD COLUMN IF NOT EXISTS que_ha INTEGER CHECK (que_ha BETWEEN 1 AND 8);

-- Them index de query nhanh theo que
CREATE INDEX IF NOT EXISTS idx_phuong_thuoc_que 
ON public.nam_duoc_phuong_thuoc(que_thuong, que_ha);

-- Them comment giai thich
COMMENT ON COLUMN public.nam_duoc_phuong_thuoc.que_thuong IS 'So trigram thuong que (1=Can, 2=Doai, 3=Ly, 4=Chan, 5=Ton, 6=Kham, 7=Can, 8=Khon)';
COMMENT ON COLUMN public.nam_duoc_phuong_thuoc.que_ha IS 'So trigram ha que (1=Can, 2=Doai, 3=Ly, 4=Chan, 5=Ton, 6=Kham, 7=Can, 8=Khon)';

-- =====================================================
-- CAP NHAT CAC BAI THUOC HIEN CO VOI QUE TUONG UNG
-- Dua tren gua_ap_dung va ngu_hanh_chinh
-- =====================================================

-- Bai thuoc giai cam - Kim (Phe) - Que Can/Doai
UPDATE public.nam_duoc_phuong_thuoc 
SET que_thuong = 1, que_ha = 2 
WHERE ten_phuong = 'Bài thuốc giải cảm' AND que_thuong IS NULL;

-- Bai thuoc tri ho dom - Kim (Phe) - Que Doai/Can
UPDATE public.nam_duoc_phuong_thuoc 
SET que_thuong = 2, que_ha = 1 
WHERE ten_phuong = 'Bài thuốc trị ho đờm' AND que_thuong IS NULL;

-- Bai thuoc bo gan - Moc (Can) - Que Chan/Ton
UPDATE public.nam_duoc_phuong_thuoc 
SET que_thuong = 4, que_ha = 5 
WHERE ten_phuong = 'Bài thuốc bổ gan' AND que_thuong IS NULL;

-- Bai thuoc an than - Hoa (Tam) - Que Ly
UPDATE public.nam_duoc_phuong_thuoc 
SET que_thuong = 3, que_ha = 3 
WHERE ten_phuong = 'Bài thuốc an thần' AND que_thuong IS NULL;

-- Bai thuoc bo than - Thuy (Than) - Que Kham
UPDATE public.nam_duoc_phuong_thuoc 
SET que_thuong = 6, que_ha = 6 
WHERE ten_phuong = 'Bài thuốc bổ thận' AND que_thuong IS NULL;

-- Bai thuoc kien ty - Tho (Ty Vi) - Que Khon/Can
UPDATE public.nam_duoc_phuong_thuoc 
SET que_thuong = 8, que_ha = 7 
WHERE ten_phuong = 'Bài thuốc kiện tỳ' AND que_thuong IS NULL;

-- =====================================================
-- THEM BAI THUOC BO TRUNG ICH KHI THANG (QUE 7_8)
-- Que San Dia Bac = Can (7) / Khon (8)
-- =====================================================

INSERT INTO public.nam_duoc_phuong_thuoc (
  ten_phuong, ten_han, xuat_xu, khoa_id, loai_benh,
  que_thuong, que_ha,
  ngu_hanh_chinh, tang_phu_chinh,
  thanh_phan, cach_bao_che, cach_dung, lieu_trinh,
  chi_dinh, chong_chi_dinh, luu_y, muc_do_benh, do_uu_tien, is_active
) VALUES (
  'Bổ Trung Ích Khí Thang',
  '補中益氣湯',
  'Nam Dược Thần Hiệu - Lý Đông Viên',
  1,
  ARRAY['Sa dạ dày', 'Mệt mỏi', 'Khí hư'],
  7, 8, -- Que San Dia Bac
  'tho',
  ARRAY['Tỳ', 'Vị'],
  '[
    {"ten": "Hoàng kỳ", "lieu_luong": "15-20g", "vai_tro": "quan"},
    {"ten": "Nhân sâm", "lieu_luong": "10g", "vai_tro": "than"},
    {"ten": "Bạch truật", "lieu_luong": "10g", "vai_tro": "ta"},
    {"ten": "Thăng ma", "lieu_luong": "6-9g", "vai_tro": "su"},
    {"ten": "Sài hồ", "lieu_luong": "6g", "vai_tro": "su"},
    {"ten": "Đương quy", "lieu_luong": "10g", "vai_tro": "ta"},
    {"ten": "Trần bì", "lieu_luong": "6g", "vai_tro": "ta"},
    {"ten": "Cam thảo", "lieu_luong": "5g", "vai_tro": "su"}
  ]'::jsonb,
  'Rửa sạch các vị thuốc, ngâm trong nước lạnh 20-30 phút',
  'Sắc với 800ml nước còn 300ml, chia 2 lần uống sáng tối sau ăn 30 phút',
  '2-4 tuần liên tục',
  ARRAY['Tỳ Vị hư nhược', 'Sa dạ dày, sa tử cung', 'Mệt mỏi kinh niên', 'Ăn kém, chướng bụng', 'Tiêu chảy kéo dài'],
  ARRAY['Người âm hư hỏa vượng', 'Đang sốt cao', 'Huyết áp cao không kiểm soát'],
  'Quẻ Sơn Địa Bác thể hiện Tỳ Vị suy yếu, mất nguyên khí. Bài thuốc này bổ Trung Tiêu, thăng Dương khí, phục hồi chức năng tiêu hóa.',
  ARRAY['trung-binh', 'nang'],
  10,
  true
) ON CONFLICT DO NOTHING;
