SELECT
  p.name AS player,
  CASE
    WHEN YEAR(MAX(s.session_date)) = 2023 THEN 'active'
    ELSE 'inactive'
  END AS player_status
FROM players p
JOIN game_sessions s ON s.player_id = p.id
GROUP BY p.id, p.name
ORDER BY p.name ASC;
