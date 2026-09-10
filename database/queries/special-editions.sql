SELECT
  title AS original_title,
  CASE
    WHEN title LIKE '%II' THEN REPLACE(title, 'II', 'Definitive Edition')
    WHEN title LIKE '%Orbit' THEN REPLACE(title, 'Orbit', 'Orbit: Remastered')
    WHEN title LIKE '%Harbor' THEN REPLACE(title, 'Harbor', 'Harbor Remastered')
    ELSE title
  END AS new_title
FROM games
ORDER BY original_title ASC;
