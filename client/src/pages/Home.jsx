import { Link } from "react-router-dom";
import { useGames } from "../hooks/useGames";
import { useCompletedGames } from "../hooks/useCompletedGames.js";
import GameCard from "../components/GameCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import artFinderIcon from "../assets/artFinder.png";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { games, loading, error } = useGames();
  const { isGameCompleted } = useCompletedGames();

  if (loading) {
    return (
      <div className={styles.container}>
        <Loader message="Loading games..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorMessage
          message={`Error: ${error}`}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2>No games available</h2>
          <p>Come back later to discover new games!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/leaderboard" className={styles.leaderboardLink}>
          🏆 Leaderboard
        </Link>

        <div className={styles.titleGroup}>
          <img
            src={artFinderIcon}
            alt="Art Finder icon"
            className={styles.icon}
          />
          <h1 className={styles.title}>Art Finder</h1>
        </div>

        <p className={styles.subtitle}>
          Find the hidden characters in these famous works of art
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {games.map((game) => (
            <div key={game.id} className={styles.cardWrapper}>
              <GameCard game={game} />
              {isGameCompleted(game.id) && (
                <div className={styles.completedBadge}>
                  <span className={styles.completedIcon}>✓</span>
                  <span>Completed</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
