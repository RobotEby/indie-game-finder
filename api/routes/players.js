const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, plan_id FROM players",
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch players", details: err.message });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.name AS player, COUNT(s.game_id) AS games_played, SUM(s.minutes_played) AS total_minutes
      FROM players p
      JOIN game_sessions s ON s.player_id = p.id
      GROUP BY p.id, p.name
      ORDER BY p.name ASC
    `);
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch player activity", details: err.message });
  }
});

router.get("/:name/library", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS games_in_library
       FROM game_sessions s
       JOIN players p ON p.id = s.player_id
       WHERE p.name = ?`,
      [req.params.name],
    );
    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch player library", details: err.message });
  }
});

module.exports = router;
