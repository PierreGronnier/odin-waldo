import { memo } from "react";
import styles from "../styles/Game.module.css";

const GameHeader = memo(function GameHeader({
  game,
  onBack,
  foundCharacters,
  timerSlot,
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

      {timerSlot}
    </header>
  );
});

export default GameHeader;
