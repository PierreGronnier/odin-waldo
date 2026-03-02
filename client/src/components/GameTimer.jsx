import { useEffect, useRef } from "react";
import { formatTime } from "../hooks/useTimer";
import styles from "../styles/Game.module.css";

const GameTimer = ({ isRunning = true, onStop }) => {
  const spanRef = useRef(null);
  const startRef = useRef(Date.now());
  const frameRef = useRef(null);
  const stoppedAtRef = useRef(null);

  useEffect(() => {
    if (onStop) {
      onStop.current = () => {
        stoppedAtRef.current = Date.now() - startRef.current;
        cancelAnimationFrame(frameRef.current);
        return stoppedAtRef.current;
      };
    }
  }, [onStop]);

  // Gère le démarrage/l'arrêt du timer selon isRunning
  useEffect(() => {
    if (!isRunning) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    // Reset du départ quand on redémarre
    startRef.current = Date.now();

    const tick = () => {
      if (spanRef.current) {
        spanRef.current.textContent = formatTime(Date.now() - startRef.current);
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isRunning]);

  return (
    <div className={styles.timerDisplay}>
      <span className={styles.timerLabel}>Time</span>
      <span ref={spanRef} className={styles.timerValue}>
        00:00.0
      </span>
    </div>
  );
};

export default GameTimer;
