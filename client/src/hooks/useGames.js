import { useState, useEffect } from "react";
import apiService from "../services/api";

export const useGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await apiService.getGames();
        setGames(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return { games, loading, error };
};

export const useGame = (id) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchGame = async () => {
      try {
        setLoading(true);
        const data = await apiService.getGame(id);
        setGame(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  return { game, loading, error };
};
