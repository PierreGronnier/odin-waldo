const prisma = require("../config/prisma");

const CHARACTER_PUBLIC_SELECT = {
  id: true,
  name: true,
  description: true,
  imageUrl: true,
  gameId: true,
};

async function getAllGames() {
  return await prisma.game.findMany({
    include: {
      characters: {
        select: CHARACTER_PUBLIC_SELECT,
      },
    },
  });
}

async function getGameById(id) {
  return await prisma.game.findUnique({
    where: { id: Number(id) },
    include: {
      characters: {
        select: CHARACTER_PUBLIC_SELECT,
      },
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
