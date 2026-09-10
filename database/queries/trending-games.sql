SELECT
  g.title AS game,
  COUNT(s.player_id) AS players_reached
FROM games g
JOIN game_sessions s ON s.game_id = g.id
GROUP BY g.title
ORDER BY players_reached DESC, g.title ASC
LIMIT 2;  
