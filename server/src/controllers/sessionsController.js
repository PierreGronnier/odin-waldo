const sessionsService = require("../services/sessionsService");

async function startSession(req, res) {
  try {
    const { id: gameId } = req.params;
    const session = await sessionsService.startSession(gameId);
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function finishSession(req, res) {
  try {
    const { id: gameId, sessionId } = req.params;
    const result = await sessionsService.finishSession(sessionId, gameId);

    if (!result) {
      return res
        .status(400)
        .json({
          message: "Session not found, already finished, or game mismatch",
        });
    }

    res.json({ timeInMs: result.timeInMs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { startSession, finishSession };
