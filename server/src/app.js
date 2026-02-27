const express = require("express");
const cors = require("cors");
const gamesRoute = require("./routes/gamesRoute");
const scoresRoute = require("./routes/scoresRoute");
const sessionsRoute = require("./routes/sessionsRoute");

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());

// Route health check
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/games", gamesRoute);
app.use("/api/scores", scoresRoute);
app.use("/api/games/:id/sessions", sessionsRoute);

module.exports = app;
