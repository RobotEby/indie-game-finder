SELECT
  (SELECT COUNT(*) FROM games) AS games,
  (SELECT COUNT(*) FROM developers) AS developers,
  (SELECT COUNT(DISTINCT genre) FROM games) AS genres;
