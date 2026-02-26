import { useState, useEffect, useCallback, memo } from "react";
import styles from "../styles/PaintingInfo.module.css";

const PaintingInfo = memo(function PaintingInfo({ game }) {
  const [isOpen, setIsOpen] = useState(false);

  const data = (() => {
    try {
      return game.description ? JSON.parse(game.description) : null;
    } catch {
      return null;
    }
  })();

  const handleOpen = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!data) return null;

  return (
    <>
      <button
        className={styles.infoBtn}
        onClick={handleOpen}
        aria-label={`Learn more about ${game.name}`}
        title="Learn more"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="3" />
          <line x1="12" y1="12" x2="12" y2="16" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={game.name}
          >
            {/* Header */}
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{game.name}</h2>
                <p className={styles.modalMeta}>
                  <span>{data.artist}</span>
                  <span className={styles.dot}>·</span>
                  <span>{data.year}</span>
                  <span className={styles.dot}>·</span>
                  <span>{data.location}</span>
                </p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className={styles.modalBody}>
              <p className={styles.intro}>{data.intro}</p>
              <p className={styles.bodyText}>{data.body}</p>

              <div className={styles.funFact}>
                <p>{data.funFact}</p>
              </div>

              {/* YouTube link */}
              {data.youtubeUrl && (
                <a
                  href={data.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.youtubeLink}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={styles.youtubeIcon}
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>{data.youtubeLabel || "Watch on YouTube"}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default PaintingInfo;
