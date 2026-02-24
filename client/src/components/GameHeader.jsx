import { formatTime } from "../hooks/useTimer";
import styles from "../styles/Game.module.css";

export default function GameHeader({
  game,
  onBack,
  foundCharacters,
  elapsedMs,
}) {
  const remaining = game.characters
    ? game.characters.length - foundCharacters.length
    : 0;

  return (
    <header className={styles.header}>
      <button
        onClick={onBack}
        className={styles.backButton}
        title="Return to homepage"
      >
        ← Back
      </button>

      <div className={styles.gameInfo}>
        <h1 className={styles.title}>{game.name}</h1>
        <p className={styles.charactersCount}>
          {remaining} character{remaining !== 1 ? "s" : ""} to find
        </p>
      </div>

      <div className={styles.timerDisplay}>
        <span className={styles.timerLabel}>Time</span>
        <span className={styles.timerValue}>{formatTime(elapsedMs)}</span>
      </div>
    </header>
  );
}
