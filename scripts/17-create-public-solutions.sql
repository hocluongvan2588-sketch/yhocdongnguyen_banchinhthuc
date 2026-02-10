-- Create public.solutions table if it doesn't exist
-- This is the main table for storing treatment packages (gói dịch vụ)

CREATE TABLE IF NOT EXISTS public.solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hexagram_key TEXT NOT NULL, -- Format: "upper_lower_moving" e.g., "6_3_2"
  solution_type TEXT NOT NULL CHECK (solution_type IN ('acupoint', 'prescription', 'numerology')),
  
  -- Common fields
  title TEXT NOT NULL,
  description TEXT,
  unlock_cost INTEGER NOT NULL DEFAULT 50, -- Cost in VND to unlock (e.g., 99000, 199000, 299000)
  
  -- Acupoint specific fields
  acupoint_name TEXT,
  acupoint_location TEXT,
  acupoint_image_url TEXT,
  acupoint_guide_pdf_url TEXT,
  
  -- Prescription specific fields
  herb_name TEXT,
  meridian_pathway TEXT,
  preparation_method TEXT,
  
  -- Numerology specific fields
  number_sequence TEXT,
  chanting_instructions TEXT,
  
  -- References
  reference_source TEXT DEFAULT 'Nam Dược Thần Hiệu, Lý Ngọc Sơn',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_solutions_hexagram_key ON public.solutions(hexagram_key);
CREATE INDEX IF NOT EXISTS idx_solutions_type ON public.solutions(solution_type);

-- Enable RLS (Row Level Security)
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read solutions
CREATE POLICY "Anyone can read solutions" ON public.solutions
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete solutions
CREATE POLICY "Admins can manage solutions" ON public.solutions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE public.solutions IS 'Stores all treatment packages: acupoints (Khai Huyệt), prescriptions (Nam Dược), and numerology (Tượng Số)';
