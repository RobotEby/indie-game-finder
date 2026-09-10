const express = require("express");
const cors = require("cors");
require("dotenv").config();

const plansRouter = require("./routes/plans");
const developersRouter = require("./routes/developers");
const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");
const statsRouter = require("./routes/stats");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "IndieGameFinder API" });
});

app.use("/plans", plansRouter);
app.use("/developers", developersRouter);
app.use("/games", gamesRouter);
app.use("/players", playersRouter);
app.use("/stats", statsRouter);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`IndieGameFinder API running at http://localhost:${PORT}`);
  });
}
