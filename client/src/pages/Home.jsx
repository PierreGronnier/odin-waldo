import { useGames } from "../hooks/useGames";
import GameCard from "../components/GameCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { games, loading, error } = useGames();

  if (loading) {
    return (
      <div className={styles.container}>
        <Loader message="Chargement des jeux..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorMessage
          message={`Erreur : ${error}`}
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
        <h1 className={styles.title}>Art Finder</h1>
        <p className={styles.subtitle}>
          Find the hidden characters in these famous works of art
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
    </div>
  );
}
