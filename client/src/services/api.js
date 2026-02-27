const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  // Récupérer tous les jeux
  async getGames() {
    try {
      const response = await fetch(`${API_URL}/api/games`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des jeux");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API getGames:", error);
      throw error;
    }
  }

  // Récupérer un jeu spécifique
  async getGame(id) {
    try {
      const response = await fetch(`${API_URL}/api/games/${id}`);
      if (!response.ok) {
        throw new Error("Jeu non trouvé");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API getGame:", error);
      throw error;
    }
  }

  // Construire l'URL d'une image
  getImageUrl(imagePath) {
    // Remplace .png par .PNG à la fin
    const correctedPath = imagePath.replace(/\.png$/, ".PNG");
    return `/images/${correctedPath}`;
  }

  // Miniature pour la page HOME
  getThumbUrl(imagePath) {
    return `/images/${imagePath.replace(/main\..+$/, "thumb.jpg")}`;
  }

  async verifyCharacter(gameId, characterId, x, y) {
    try {
      const response = await fetch(`${API_URL}/api/games/${gameId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, x, y }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la vérification");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API verifyCharacter:", error);
      throw error;
    }
  }

  async getLeaderboard() {
    try {
      const response = await fetch(`${API_URL}/api/scores?limit=10`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return await response.json();
    } catch (error) {
      console.error("API getLeaderboard:", error);
      throw error;
    }
  }

  async submitScore(gameId, playerName, timeInMs) {
    try {
      const response = await fetch(`${API_URL}/api/scores/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, timeInMs }),
      });
      if (!response.ok) throw new Error("Failed to submit score");
      return await response.json();
    } catch (error) {
      console.error("API submitScore:", error);
      throw error;
    }
  }

  //  Start a server-side session — returns { id, startedAt }
  async startSession(gameId) {
    try {
      const response = await fetch(`${API_URL}/api/games/${gameId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to start session");
      return await response.json();
    } catch (error) {
      console.error("API startSession:", error);
      throw error;
    }
  }

  // Finish a session — returns { timeInMs } computed by the server
  async finishSession(gameId, sessionId) {
    try {
      const response = await fetch(
        `${API_URL}/api/games/${gameId}/sessions/${sessionId}/finish`,
        { method: "POST", headers: { "Content-Type": "application/json" } },
      );
      if (!response.ok) throw new Error("Failed to finish session");
      return await response.json();
    } catch (error) {
      console.error("API finishSession:", error);
      throw error;
    }
  }
}

export default new ApiService();
