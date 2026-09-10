const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM plans");
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch plans", details: err.message });
  }
});

module.exports = router;
