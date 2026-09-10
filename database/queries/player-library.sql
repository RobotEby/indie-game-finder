SELECT COUNT(*) AS games_in_library
FROM game_sessions s
JOIN players p ON p.id = s.player_id
WHERE p.name = 'Alice';
