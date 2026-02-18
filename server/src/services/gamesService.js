const prisma = require("../config/prisma");

async function getAllGames() {
  return await prisma.game.findMany({
    include: {
      characters: true,
    },
  });
}

async function getGameById(id) {
  return await prisma.game.findUnique({
    where: { id: Number(id) },
    include: {
      characters: true,
    },
  });
}

async function getCharacterById(characterId) {
  return await prisma.character.findUnique({
    where: { id: Number(characterId) },
  });
}

module.exports = {
  getAllGames,
  getGameById,
  getCharacterById,
};
