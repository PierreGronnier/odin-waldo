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
    return `${API_URL}/images/${imagePath}`;
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
}

export default new ApiService();
