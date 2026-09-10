const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM games");
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch games", details: err.message });
  }
});

router.get("/trending", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.title AS game, COUNT(s.player_id) AS players_reached
      FROM games g
      JOIN game_sessions s ON s.game_id = g.id
      GROUP BY g.id, g.title
      ORDER BY players_reached DESC, g.title ASC
      LIMIT 2
    `);
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch trending games", details: err.message });
  }
});

module.exports = router;
