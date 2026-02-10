-- Add promo_message column to solutions table
-- This allows admin to add promotional announcements for each package

ALTER TABLE public.solutions
ADD COLUMN IF NOT EXISTS promo_message TEXT;

COMMENT ON COLUMN public.solutions.promo_message IS 'Promotional message or announcement to display in payment modal (e.g., Tet discount, thank you message)';

-- Example: Update a package with promo message
-- UPDATE public.solutions 
-- SET promo_message = '🎊 Chúc mừng năm mới! Giảm giá đặc biệt 20% dịp Tết Nguyên Đán 2026'
-- WHERE package_id = 'package_3';
