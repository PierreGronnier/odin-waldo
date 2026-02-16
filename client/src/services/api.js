const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/games";

class ApiService {
  // Récupérer tous les jeux
  async getGames() {
    try {
      const response = await fetch(API_BASE_URL);
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
      const response = await fetch(`${API_BASE_URL}/${id}`);
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
    return `http://localhost:3000/images/${imagePath}`;
  }
}

export default new ApiService();
