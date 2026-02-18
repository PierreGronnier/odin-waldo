const gamesService = require("../services/gamesService");

async function getGames(req, res) {
  try {
    const games = await gamesService.getAllGames();
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getGame(req, res) {
  try {
    const { id } = req.params;
    const game = await gamesService.getGameById(id);
    if (!game) return res.status(404).json({ message: "Game non trouvée" });
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function verifyCharacter(req, res) {
  try {
    const { id } = req.params; // gameId
    const { characterId, x, y } = req.body;

    if (!characterId || x === undefined || y === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing parameters" });
    }

    // Récupérer le personnage depuis la DB
    const character = await gamesService.getCharacterById(characterId);
    if (!character) {
      return res
        .status(404)
        .json({ success: false, message: "Character not found" });
    }

    // Vérifier que le personnage appartient bien au jeu (sécurité)
    if (character.gameId !== Number(id)) {
      return res.status(400).json({
        success: false,
        message: "Character does not belong to this game",
      });
    }

    const tolerance = 2.0; // en %
    const dx = Math.abs(character.x - x);
    const dy = Math.abs(character.y - y);
    const success = dx <= tolerance && dy <= tolerance;

    res.json({ success });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  getGames,
  getGame,
  verifyCharacter,
};
