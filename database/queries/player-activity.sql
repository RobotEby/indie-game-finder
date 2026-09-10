SELECT
  p.name AS player,
  COUNT(s.game_id) AS games_played,
  SUM(s.minutes_played) AS total_minutes
FROM players p
JOIN game_sessions s ON s.player_id = p.id
GROUP BY p.id, p.name
ORDER BY p.name ASC;
