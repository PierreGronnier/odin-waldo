const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/gamesController");

router.get("/", gamesController.getGames);
router.get("/:id", gamesController.getGame);
router.post("/:id/verify", gamesController.verifyCharacter);

module.exports = router;
