import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGames";
import { useCompletedGames } from "../hooks/useCompletedGames.js";
import ImageViewer from "../components/ImageViewer";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import GameHeader from "../components/GameHeader";
import GameTimer from "../components/GameTimer";
import GameSidebar from "../components/GameSidebar";
import SelectCharacter from "../components/SelectCharacter";
import VictoryModal from "../components/VictoryModal";
import apiService from "../services/api";
import styles from "../styles/Game.module.css";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { game, loading, error } = useGame(id);
  const { markGameCompleted } = useCompletedGames();

  const stopTimerRef = useRef(null);

  const sessionIdRef = useRef(null);
  const sessionStartedRef = useRef(false);

  const [clickCoords, setClickCoords] = useState(null);
  const [isSelectMenuOpen, setIsSelectMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [verificationError, setVerificationError] = useState(null);
  const [showVictory, setShowVictory] = useState(false);
  const [finalTime, setFinalTime] = useState(0);

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

    const localMs = stopTimerRef.current?.() ?? 0;

    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      setFinalTime(localMs);
      setTimeout(() => setShowVictory(true), 600);
      return;
    }

    apiService
      .finishSession(game.id, sessionId)
      .then(({ timeInMs }) => {
        setFinalTime(timeInMs);
        setTimeout(() => setShowVictory(true), 600);
      })
      .catch(() => {
        setFinalTime(localMs);
        setTimeout(() => setShowVictory(true), 600);
      });
  }, [foundCharacters, game]);

  const handleImageClick = useCallback((coords) => {
    setClickCoords(coords);
    setIsSelectMenuOpen(true);
    setVerificationError(null);
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleCloseSelect = useCallback(() => {
    setIsSelectMenuOpen(false);
  }, []);

  const handleCharacterSelect = useCallback(
    async (character) => {
      if (foundCharacters.some((c) => c.id === character.id)) {
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
          setVerificationError(null);
          setTimeout(() => {
            setIsSelectMenuOpen(false);
            setFoundCharacters((prev) => [
              ...prev,
              { id: character.id, x: clickCoords.x, y: clickCoords.y },
            ]);
          }, 1000);
          return;
        } else {
          setVerificationError("Wrong spot — try again!");
        }
      } catch {
        setVerificationError("Verification failed. Please try again.");
      }

      setTimeout(() => setIsSelectMenuOpen(false), 1000);
    },
    [foundCharacters, id, clickCoords],
  );

  const handleScoreSubmit = useCallback(
    async (playerName) => {
      await apiService.submitScore(Number(id), playerName, finalTime);
      markGameCompleted(id);
    },
    [id, finalTime, markGameCompleted],
  );

  const handleVictoryClose = useCallback(() => {
    markGameCompleted(id);
    navigate("/");
  }, [id, markGameCompleted, navigate]);

  const handleBack = useCallback(() => navigate("/"), [navigate]);
  const timerSlot = useMemo(() => <GameTimer onStop={stopTimerRef} />, []);

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

  const isQingming =
    game.name === "Along the River During the Qingming Festival";
  const maxZoom = isQingming ? 45 : 7;
  const markerBaseSize = isQingming ? 20 : 30;

  return (
    <div className={styles.container} onContextMenu={handleContextMenu}>
      <GameHeader
        game={game}
        onBack={handleBack}
        foundCharacters={foundCharacters}
        timerSlot={timerSlot}
      />

      <div className={styles.gameArea}>
        <ImageViewer
          src={apiService.getImageUrl(game.imageUrl)}
          alt={game.name}
          onClick={handleImageClick}
          maxZoom={maxZoom}
          markers={foundCharacters}
          markerBaseSize={markerBaseSize}
        />
      </div>

      <SelectCharacter
        isOpen={isSelectMenuOpen}
        position={menuPosition}
        characters={game.characters || []}
        onSelect={handleCharacterSelect}
        onClose={handleCloseSelect}
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
