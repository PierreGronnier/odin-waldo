import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGames";
import ImageViewer from "../components/ImageViewer";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import GameHeader from "../components/GameHeader";
import GameSidebar from "../components/GameSidebar";
import apiService from "../services/api";
import styles from "../styles/Game.module.css";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { game, loading, error } = useGame(id);

  const [clickCoords, setClickCoords] = useState(null);

  // Gestion du clic droit pour récupérer les coordonnées
  const handleImageClick = (coords) => {
    console.log("Clic aux coordonnées:", coords);
    setClickCoords(coords);
    // TODO: logique de vérification des personnages
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader message="Chargement du jeu..." />
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <ErrorMessage
            message={error || "Jeu non trouvé"}
            onRetry={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  // Zoom augmenté pour le grand artwork
  const maxZoom =
    game.name === "Along the river during the Qingming festival" ? 45 : 5;

  return (
    <div className={styles.container}>
      {/* Header */}
      <GameHeader
        game={game}
        onBack={() => navigate("/")}
        clickCoords={clickCoords}
      />

      {/* Image Viewer */}
      <div className={styles.gameArea}>
        <ImageViewer
          src={apiService.getImageUrl(game.imageUrl)}
          alt={game.name}
          onClick={handleImageClick}
          maxZoom={maxZoom}
        />
      </div>

      {/* Sidebar */}
      {game.characters && game.characters.length > 0 && (
        <GameSidebar characters={game.characters} />
      )}
    </div>
  );
}
