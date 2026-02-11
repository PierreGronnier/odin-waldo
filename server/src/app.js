const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Route test
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

module.exports = app;
