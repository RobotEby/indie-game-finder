SELECT
  d.name AS developer,
  g.title AS game,
  (
    SELECT COUNT(*)
    FROM followers f
    WHERE f.developer_id = d.id
  ) AS followers
FROM developers d
JOIN games g ON g.developer_id = d.id
ORDER BY followers DESC, d.name ASC, g.title ASC;
