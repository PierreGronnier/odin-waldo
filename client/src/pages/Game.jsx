import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGames";
import ImageViewer from "../components/ImageViewer";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import apiService from "../services/api";
import styles from "../styles/Game.module.css";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { game, loading, error } = useGame(id);

  const handleImageClick = (coords) => {
    console.log("Clic aux coordonnées:", coords);
    // TODO: Implémenter la logique de vérification des personnages
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

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button
          onClick={() => navigate("/")}
          className={styles.backButton}
          title="Return to homepage"
        >
          ← Back
        </button>
        <div className={styles.gameInfo}>
          <h1 className={styles.title}>{game.name}</h1>
          {game.characters && (
            <p className={styles.charactersCount}>
              {game.characters.length} character
              {game.characters.length > 1 ? "s" : ""} to find
            </p>
          )}
        </div>
        <div className={styles.placeholder}></div>
      </header>

      {/* Image Viewer */}
      <div className={styles.gameArea}>
        <ImageViewer
          src={apiService.getImageUrl(game.imageUrl)}
          alt={game.name}
          onClick={handleImageClick}
        />
      </div>

      {/* Characters sidebar (optionnel pour l'instant) */}
      {game.characters && game.characters.length > 0 && (
        <aside className={styles.sidebar}>
          <h3>Characters to find</h3>
          <ul className={styles.characterList}>
            {game.characters.map((character) => (
              <li key={character.id} className={styles.characterItem}>
                {character.name}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
