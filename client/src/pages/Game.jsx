import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGames";
import ImageViewer from "../components/ImageViewer";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import GameHeader from "../components/GameHeader";
import GameSidebar from "../components/GameSidebar";
import SelectCharacter from "../components/SelectCharacter";
import apiService from "../services/api";
import styles from "../styles/Game.module.css";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { game, loading, error } = useGame(id);

  const [clickCoords, setClickCoords] = useState(null);
  const [isSelectMenuOpen, setIsSelectMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [verificationError, setVerificationError] = useState(null);

  const handleImageClick = (coords) => {
    setClickCoords(coords);
    setIsSelectMenuOpen(true);
    setVerificationError(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCharacterSelect = async (character) => {
    // Vérifier si déjà trouvé
    if (foundCharacters.includes(character.id)) {
      setVerificationError("You already found this character!");
      setTimeout(() => setIsSelectMenuOpen(false), 1000);
      return;
    }

    try {
      const result = await apiService.verifyCharacter(
        id,
        character.id,
        clickCoords.x,
        clickCoords.y,
      );
      if (result.success) {
        setFoundCharacters((prev) => [...prev, character.id]);
        setVerificationError(null);
      } else {
        setVerificationError("Wrong character or incorrect position!");
      }
    } catch (err) {
      setVerificationError("Verification failed. Please try again.");
    }

    setTimeout(() => {
      setIsSelectMenuOpen(false);
    }, 1000);
  };

  const handleCloseMenu = () => {
    setIsSelectMenuOpen(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader message="Loading game..." />
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <ErrorMessage
            message={error || "Game not found"}
            onRetry={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  const maxZoom =
    game.name === "Along the river during the Qingming festival" ? 45 : 5;

  return (
    <div className={styles.container} onContextMenu={handleContextMenu}>
      <GameHeader
        game={game}
        onBack={() => navigate("/")}
        clickCoords={clickCoords}
      />

      <div className={styles.gameArea}>
        <ImageViewer
          src={apiService.getImageUrl(game.imageUrl)}
          alt={game.name}
          onClick={handleImageClick}
          maxZoom={maxZoom}
        />
      </div>

      <SelectCharacter
        isOpen={isSelectMenuOpen}
        position={menuPosition}
        characters={game.characters || []}
        onSelect={handleCharacterSelect}
        onClose={handleCloseMenu}
      />

      {verificationError && (
        <div className={`${styles.toast} ${styles.error}`}>
          {verificationError}
        </div>
      )}

      {game.characters && game.characters.length > 0 && (
        <GameSidebar
          characters={game.characters}
          foundCharacters={foundCharacters}
        />
      )}
    </div>
  );
}
