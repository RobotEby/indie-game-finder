SELECT
  ROUND(MIN(p.price), 2) AS min_revenue,
  ROUND(MAX(p.price), 2) AS max_revenue,
  ROUND(AVG(p.price), 2) AS avg_revenue,
  ROUND(SUM(p.price), 2) AS total_revenue
FROM players pl
JOIN plans p ON p.id = pl.plan_id;
