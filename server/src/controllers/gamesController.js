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

module.exports = {
  getGames,
  getGame,
};
