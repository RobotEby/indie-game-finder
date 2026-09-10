const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM developers");
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch developers", details: err.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        d.name AS developer,
        g.title AS game,
        (SELECT COUNT(*) FROM followers f WHERE f.developer_id = d.id) AS followers
      FROM developers d
      JOIN games g ON g.developer_id = d.id
      ORDER BY followers DESC, d.name ASC, g.title ASC
    `);
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Failed to fetch developer profiles",
        details: err.message,
      });
  }
});

router.get("/:name/games", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.name AS developer, g.title AS game
       FROM developers d
       JOIN games g ON g.developer_id = d.id
       WHERE d.name = ?
       ORDER BY g.title ASC`,
      [req.params.name],
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch developer games", details: err.message });
  }
});

module.exports = router;
