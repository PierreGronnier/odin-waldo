const express = require("express");
const cors = require("cors");
const path = require("path");
const gamesRoute = require("./routes/gamesRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Route test
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/games", gamesRoute);
app.use("/api/admin", adminRoute);

module.exports = app;
