-- Seed 3 gói dịch vụ chính vào bảng solutions
-- Xóa dữ liệu cũ nếu có
DELETE FROM public.solutions WHERE solution_type IN ('acupoint', 'prescription', 'numerology');

-- Package 1: Gói Khai Huyệt - 299,000 VND
INSERT INTO public.solutions (
  hexagram_key,
  title,
  description,
  solution_type,
  unlock_cost,
  created_at,
  updated_at
) VALUES (
  'package_1',
  'Gói Khai Huyệt',
  'Phương pháp điều trị bằng bấm huyệt và massage theo kinh lạc',
  'acupoint',
  299000,
  NOW(),
  NOW()
);

-- Package 2: Gói Nam Dược - 199,000 VND
INSERT INTO public.solutions (
  hexagram_key,
  title,
  description,
  solution_type,
  unlock_cost,
  created_at,
  updated_at
) VALUES (
  'package_2',
  'Gói Nam Dược',
  'Bài thuốc Nam kết hợp với Mai Hoa Dịch Số',
  'prescription',
  199000,
  NOW(),
  NOW()
);

-- Package 3: Gói Tượng Số - 99,000 VND
INSERT INTO public.solutions (
  hexagram_key,
  title,
  description,
  solution_type,
  unlock_cost,
  created_at,
  updated_at
) VALUES (
  'package_3',
  'Gói Tượng Số',
  'Phân tích tượng số và liệu pháp thiền định',
  'numerology',
  99000,
  NOW(),
  NOW()
);
