const express = require("express");
const router = express.Router({ mergeParams: true });
const sessionsController = require("../controllers/sessionsController");

// POST /api/games/:id/sessions — start a session
router.post("/", sessionsController.startSession);

// POST /api/games/:id/sessions/:sessionId/finish — finish a session, get timeInMs
router.post("/:sessionId/finish", sessionsController.finishSession);

module.exports = router;
