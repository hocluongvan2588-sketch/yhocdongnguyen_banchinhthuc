-- Check current solution prices
SELECT 
  id,
  hexagram_key,
  solution_type,
  title,
  unlock_cost,
  created_at
FROM solutions
ORDER BY solution_type, created_at DESC;

-- Count solutions by type
SELECT 
  solution_type,
  COUNT(*) as count,
  AVG(unlock_cost) as avg_price,
  MIN(unlock_cost) as min_price,
  MAX(unlock_cost) as max_price
FROM solutions
GROUP BY solution_type;
