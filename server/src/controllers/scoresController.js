const scoresService = require("../services/scoresService");

async function getScores(req, res) {
  try {
    const { gameId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const scores = await scoresService.getTopScores(gameId, limit);
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllScores(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const scores = await scoresService.getAllGamesScores(limit);
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function submitScore(req, res) {
  try {
    const { gameId } = req.params;
    const { playerName, timeInMs } = req.body;

    if (!playerName || !timeInMs) {
      return res
        .status(400)
        .json({ message: "playerName and timeInMs are required" });
    }

    if (typeof timeInMs !== "number" || timeInMs <= 0) {
      return res
        .status(400)
        .json({ message: "timeInMs must be a positive number" });
    }

    const score = await scoresService.createScore(
      Number(gameId),
      playerName.trim(),
      timeInMs,
    );
    res.status(201).json(score);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getScores, getAllScores, submitScore };
