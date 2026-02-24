import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGames";
import { useDisplayTimer } from "../hooks/useTimer";
import { useCompletedGames } from "../hooks/useCompletedGames.js";
import ImageViewer from "../components/ImageViewer";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import GameHeader from "../components/GameHeader";
import GameSidebar from "../components/GameSidebar";
import SelectCharacter from "../components/SelectCharacter";
import VictoryModal from "../components/VictoryModal";
import apiService from "../services/api";
import styles from "../styles/Game.module.css";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { game, loading, error } = useGame(id);
  const { displayMs, stop: stopDisplay } = useDisplayTimer();
  const { markGameCompleted } = useCompletedGames();

  const sessionIdRef = useRef(null);
  const sessionStartedRef = useRef(false);

  const [clickCoords, setClickCoords] = useState(null);
  const [isSelectMenuOpen, setIsSelectMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [verificationError, setVerificationError] = useState(null);
  const [showVictory, setShowVictory] = useState(false);
  const [finalTime, setFinalTime] = useState(0);

  // Start server session once game is loaded
  useEffect(() => {
    if (!game || sessionStartedRef.current) return;
    sessionStartedRef.current = true;

    apiService
      .startSession(game.id)
      .then((session) => {
        sessionIdRef.current = session.id;
      })
      .catch((err) => {
        console.error("Could not start session:", err);
      });
  }, [game]);

  // Check win condition
  useEffect(() => {
    if (!game || foundCharacters.length === 0) return;
    if (foundCharacters.length !== game.characters.length) return;

    stopDisplay();

    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      // Fallback: use display time if session failed to start
      setFinalTime(displayMs);
      setTimeout(() => setShowVictory(true), 600);
      return;
    }

    // Get authoritative time from server
    apiService
      .finishSession(game.id, sessionId)
      .then(({ timeInMs }) => {
        setFinalTime(timeInMs);
        setTimeout(() => setShowVictory(true), 600);
      })
      .catch(() => {
        // Fallback to display time on network error
        setFinalTime(displayMs);
        setTimeout(() => setShowVictory(true), 600);
      });
  }, [foundCharacters, game]);

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
    if (foundCharacters.includes(character.id)) {
      setVerificationError("Already found!");
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
        setVerificationError("Wrong spot — try again!");
      }
    } catch {
      setVerificationError("Verification failed. Please try again.");
    }

    setTimeout(() => setIsSelectMenuOpen(false), 1000);
  };

  const handleScoreSubmit = async (playerName) => {
    await apiService.submitScore(Number(id), playerName, finalTime);
    markGameCompleted(id);
  };

  const handleVictoryClose = () => {
    markGameCompleted(id);
    navigate("/");
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
    game.name === "Along the river during the Qingming festival" ? 45 : 7;

  return (
    <div className={styles.container} onContextMenu={handleContextMenu}>
      <GameHeader
        game={game}
        onBack={() => navigate("/")}
        foundCharacters={foundCharacters}
        elapsedMs={displayMs}
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
        onClose={() => setIsSelectMenuOpen(false)}
        foundCharacters={foundCharacters}
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

      {showVictory && (
        <VictoryModal
          timeInMs={finalTime}
          onSubmit={handleScoreSubmit}
          onSkip={handleVictoryClose}
        />
      )}
    </div>
  );
}
