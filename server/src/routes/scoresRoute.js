const express = require("express");
const router = express.Router();
const scoresController = require("../controllers/scoresController");

// GET /api/scores — all games with their top scores
router.get("/", scoresController.getAllScores);

// GET /api/scores/:gameId — top scores for a specific game
router.get("/:gameId", scoresController.getScores);

// POST /api/scores/:gameId — submit a score
router.post("/:gameId", scoresController.submitScore);

module.exports = router;
