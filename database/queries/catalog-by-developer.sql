SELECT
  d.name AS developer,
  g.title AS game
FROM developers d
JOIN games g ON g.developer_id = d.id
WHERE d.name = 'Nova Terra Studio'
ORDER BY g.title ASC;
