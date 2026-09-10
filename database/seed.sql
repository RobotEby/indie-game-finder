USE indieGameFinder;

INSERT INTO plans (name, price) VALUES
  ('Free', 0.00),
  ('Plus', 14.90),
  ('Pro', 29.90);

INSERT INTO developers (name, country) VALUES
  ('Nova Terra Studio', 'Brazil'),
  ('Pixel Marmot', 'Brazil'),
  ('Quiet Harbor Games', 'Canada'),
  ('Rustbelt Interactive', 'USA'),
  ('Lantern Games', 'Portugal');

INSERT INTO games (title, genre, release_year, developer_id) VALUES
  ('Iron Roots', 'RPG', 2022, 1),
  ('Space Marmot', 'Platformer', 2023, 2),
  ('Silent Harbor', 'Adventure', 2021, 3),
  ('City of Ashes', 'Survival', 2023, 4),
  ('Last Lantern', 'Puzzle', 2020, 5),
  ('Iron Roots II', 'RPG', 2024, 1),
  ('Lost Orbit', 'Platformer', 2022, 2);

INSERT INTO players (name, email, plan_id) VALUES
  ('Alice', 'alice@indieGameFinder.com', 2),
  ('Bruno', 'bruno@indieGameFinder.com', 1),
  ('Carla', 'carla@indieGameFinder.com', 3),
  ('Diego', 'diego@indieGameFinder.com', 1),
  ('Elis', 'elis@indieGameFinder.com', 2);

INSERT INTO game_sessions (player_id, game_id, session_date, minutes_played) VALUES
  (1, 1, '2023-05-10', 320),
  (1, 3, '2023-06-02', 150),
  (1, 6, '2024-02-15', 400),
  (2, 2, '2023-01-20', 90),
  (2, 5, '2023-03-11', 60),
  (3, 1, '2022-11-01', 500),
  (3, 4, '2023-07-19', 210),
  (3, 6, '2024-01-05', 380),
  (4, 5, '2021-09-30', 45),
  (5, 2, '2023-08-14', 130),
  (5, 7, '2023-09-01', 175),
  (5, 6, '2024-03-20', 260);

INSERT INTO followers (player_id, developer_id) VALUES
  (1, 1), (1, 3),
  (2, 2),
  (3, 1), (3, 4), (3, 5),
  (5, 2), (5, 1);
