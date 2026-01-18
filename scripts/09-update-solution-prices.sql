-- Update solution prices to match UI pricing
-- Based on the pricing structure found in the frontend code:
-- - Acupoint (Gói Chữa Huyệt): 99,000đ
-- - Prescription (Gói Nam Dược): 199,000đ  
-- - Symbol Number (Gói Số Biểu): 299,000đ

-- Update acupoint solutions
UPDATE solutions
SET unlock_cost = 99000
WHERE solution_type = 'acupoint';

-- Update prescription solutions (Nam Dược)
UPDATE solutions
SET unlock_cost = 199000
WHERE solution_type = 'prescription';

-- Update symbol number solutions
UPDATE solutions
SET unlock_cost = 299000
WHERE solution_type = 'symbol_number';

-- Verify the updates
SELECT 
  solution_type,
  COUNT(*) as count,
  unlock_cost
FROM solutions
GROUP BY solution_type, unlock_cost
ORDER BY solution_type;
