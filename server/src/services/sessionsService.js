const prisma = require("../config/prisma");

async function startSession(gameId) {
  return await prisma.gameSession.create({
    data: { gameId: Number(gameId) },
    select: { id: true, startedAt: true },
  });
}

/**
 * Finish a session and return the elapsed time in ms.
 * Returns null if the session doesn't exist or already finished.
 */
async function finishSession(sessionId, gameId) {
  const session = await prisma.gameSession.findUnique({
    where: { id: Number(sessionId) },
  });

  if (!session || session.finishedAt !== null) return null;

  // Security: make sure session belongs to the right game
  if (session.gameId !== Number(gameId)) return null;

  const finishedAt = new Date();
  const timeInMs = finishedAt.getTime() - session.startedAt.getTime();

  await prisma.gameSession.update({
    where: { id: Number(sessionId) },
    data: { finishedAt },
  });

  return { timeInMs, finishedAt };
}

module.exports = { startSession, finishSession };
