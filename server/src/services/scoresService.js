const prisma = require("../config/prisma");

async function getTopScores(gameId, limit = 10) {
  return await prisma.score.findMany({
    where: { gameId: Number(gameId) },
    orderBy: { timeInMs: "asc" },
    take: limit,
    include: {
      game: { select: { id: true, name: true } },
    },
  });
}

async function getAllGamesScores(limit = 10) {
  const games = await prisma.game.findMany({
    select: { id: true, name: true, imageUrl: true },
  });

  const scoresPerGame = await Promise.all(
    games.map(async (game) => {
      const scores = await prisma.score.findMany({
        where: { gameId: game.id },
        orderBy: { timeInMs: "asc" },
        take: limit,
      });
      return { ...game, scores };
    }),
  );

  return scoresPerGame;
}

async function createScore(gameId, playerName, timeInMs) {
  return await prisma.score.create({
    data: { gameId, playerName, timeInMs },
    include: {
      game: { select: { id: true, name: true } },
    },
  });
}

module.exports = { getTopScores, getAllGamesScores, createScore };
