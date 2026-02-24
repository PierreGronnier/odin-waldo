import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Display-only timer — ticks locally for UX purposes only.
 * The authoritative elapsed time is always computed server-side.
 */
export function useDisplayTimer() {
  const [displayMs, setDisplayMs] = useState(0);
  const startRef = useRef(Date.now());
  const frameRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      setDisplayMs(Date.now() - startRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
  }, []);

  return { displayMs, stop };
}

/** Format milliseconds into mm:ss.t */
export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}
