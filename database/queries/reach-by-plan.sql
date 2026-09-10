SELECT
  g.title AS name,
  COUNT(s.player_id) AS players
FROM games g
JOIN game_sessions s ON s.game_id = g.id
JOIN players p ON p.id = s.player_id
JOIN plans pl ON pl.id = p.plan_id
WHERE pl.name IN ('Free', 'Plus')
GROUP BY g.id, g.title
ORDER BY g.title ASC;
