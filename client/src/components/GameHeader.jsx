import styles from "../styles/Game.module.css";

export default function GameHeader({
  game,
  onBack,
  clickCoords,
  foundCharacters,
}) {
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

        {game.characters && (
          <p className={styles.charactersCount}>
            {game.characters.length - foundCharacters.length} character
            {game.characters.length - foundCharacters.length > 1 ? "s" : ""} to
            find
          </p>
        )}

        {/* DEBUG COORDINATES */}
        {clickCoords && (
          <p className={styles.debugCoords}>
            X: {clickCoords.x.toFixed(2)} | Y: {clickCoords.y.toFixed(2)}
          </p>
        )}
      </div>

      <div className={styles.placeholder}></div>
    </header>
  );
}
