const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/general", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM games) AS games,
        (SELECT COUNT(*) FROM developers) AS developers,
        (SELECT COUNT(DISTINCT genre) FROM games) AS genres
    `);
    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch general stats", details: err.message });
  }
});

router.get("/revenue", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        ROUND(MIN(pl.price), 2) AS min_revenue,
        ROUND(MAX(pl.price), 2) AS max_revenue,
        ROUND(AVG(pl.price), 2) AS avg_revenue,
        ROUND(SUM(pl.price), 2) AS total_revenue
      FROM players p
      JOIN plans pl ON pl.id = p.plan_id
    `);
    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch revenue stats", details: err.message });
  }
});

module.exports = router;
