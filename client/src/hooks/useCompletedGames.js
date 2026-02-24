import { useState, useCallback } from "react";

const STORAGE_KEY = "artfinder_completed_games";

function getCompletedGames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useCompletedGames() {
  const [completedGames, setCompletedGames] = useState(() =>
    getCompletedGames(),
  );

  const markGameCompleted = useCallback((gameId) => {
    const current = getCompletedGames();
    if (!current.includes(Number(gameId))) {
      const updated = [...current, Number(gameId)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setCompletedGames(updated);
    }
  }, []);

  const isGameCompleted = useCallback(
    (gameId) => completedGames.includes(Number(gameId)),
    [completedGames],
  );

  return { completedGames, markGameCompleted, isGameCompleted };
}
