import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../hooks/useTimer";
import apiService from "../services/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/Leaderboard.module.css";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [gamesData, setGamesData] = useState([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLeaderboard();
        setGamesData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <Loader message="Loading leaderboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const selectedGame = gamesData[selectedGameIndex];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate("/")} className={styles.backButton}>
          ← Back
        </button>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>Top times for each painting</p>
        </div>
        <div className={styles.placeholder} />
      </header>

      <main className={styles.main}>
        {/* Tab navigation */}
        <nav className={styles.tabs}>
          {gamesData.map((game, index) => (
            <button
              key={game.id}
              className={`${styles.tab} ${index === selectedGameIndex ? styles.activeTab : ""}`}
              onClick={() => setSelectedGameIndex(index)}
            >
              <span className={styles.tabName}>{game.name}</span>
              <span className={styles.tabCount}>
                {game.scores.length}{" "}
                {game.scores.length === 1 ? "score" : "scores"}
              </span>
            </button>
          ))}
        </nav>

        {/* Scores table */}
        {selectedGame && (
          <div className={styles.scoreBoard}>
            <div className={styles.gameName}>{selectedGame.name}</div>

            {selectedGame.scores.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🎯</span>
                <p>No scores yet — be the first!</p>
              </div>
            ) : (
              <ol className={styles.scoreList}>
                {selectedGame.scores.map((score, index) => (
                  <li
                    key={score.id}
                    className={`${styles.scoreRow} ${index < 3 ? styles[`rank${index + 1}`] : ""}`}
                  >
                    <span className={styles.rank}>
                      {index < 3 ? MEDALS[index] : `#${index + 1}`}
                    </span>
                    <span className={styles.playerName}>
                      {score.playerName}
                    </span>
                    <span className={styles.time}>
                      {formatTime(score.timeInMs)}
                    </span>
                    <span className={styles.date}>
                      {new Date(score.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
