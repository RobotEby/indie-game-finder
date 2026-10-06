-- Migration for databases created before this change (schema.sql recreates the
-- database from scratch, so fresh installs do not need it).
--
-- game_sessions used UNIQUE (player_id, game_id), which allowed only ONE row per
-- player and game, so a second play session of the same game could not be
-- recorded. It now holds one row per session.
--
-- Requires MySQL 8.0.16+ (CHECK constraints are ignored by earlier versions).
-- Run once:  mysql -u root -p indieGameFinder < database/migrations/001-game-sessions-multiple-sessions.sql

USE indieGameFinder;

-- Add the replacement index first: the player_id foreign key needs an index,
-- and MySQL refuses to drop the unique key while it is the only one covering it.
ALTER TABLE game_sessions
  ADD KEY idx_sessions_player_game (player_id, game_id, session_date);

ALTER TABLE game_sessions
  DROP INDEX unique_player_game;

-- Fails if existing rows already have minutes_played <= 0; fix those first.
ALTER TABLE game_sessions
  ADD CONSTRAINT chk_sessions_minutes_positive CHECK (minutes_played > 0);
