import { useState } from "react";
import { formatTime } from "../hooks/useTimer";
import styles from "../styles/VictoryModal.module.css";

const VictoryModal = ({ timeInMs, onSubmit, onSkip }) => {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const name = playerName.trim();
    if (!name) {
      setError("Please enter a name");
      return;
    }
    if (name.length > 20) {
      setError("Name must be 20 characters or less");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await onSubmit(name);
      setSubmitted(true);
    } catch {
      setError("Failed to submit score. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.confetti}>
          {["🎉", "⭐", "🏆", "✨", "🎊"].map((emoji, i) => (
            <span
              key={i}
              className={styles.confettiPiece}
              style={{ "--delay": `${i * 0.15}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <h2 className={styles.title}>You found them all!</h2>

        <div className={styles.timeDisplay}>
          <span className={styles.timeLabel}>Your time</span>
          <span className={styles.timeValue}>{formatTime(timeInMs)}</span>
        </div>

        {!submitted ? (
          <div className={styles.form}>
            <p className={styles.prompt}>Enter your name for the leaderboard</p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Your name..."
              className={styles.input}
              maxLength={20}
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Submitting..." : "Save score"}
              </button>
              <button onClick={onSkip} className={styles.skipButton}>
                Skip
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.success}>
            <p className={styles.successText}>Score saved! 🎯</p>
            <button onClick={onSkip} className={styles.submitButton}>
              Back to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VictoryModal;
