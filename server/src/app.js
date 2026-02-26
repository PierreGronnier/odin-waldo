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
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  "/images",
  express.static("public/images", {
    maxAge: "7d",
    etag: true,
    lastModified: true,
    setHeaders(res) {
      res.setHeader(
        "Cache-Control",
        "public, max-age=604800, stale-while-revalidate=86400",
      );
    },
  }),
);

// Route health check
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/games", gamesRoute);
app.use("/api/scores", scoresRoute);
app.use("/api/games/:id/sessions", sessionsRoute);

module.exports = app;
