import { Link } from "react-router-dom";
import { useState } from "react";
import apiService from "../services/api";
import styles from "../styles/GameCard.module.css";

const GameCard = ({ game }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const thumbUrl = apiService.getThumbUrl(game.imageUrl);
  const fullUrl = apiService.getImageUrl(game.imageUrl);
  const imageUrl = useFallback ? fullUrl : thumbUrl;

  const handleError = () => {
    if (!useFallback) {
      setUseFallback(true);
    } else {
      setHasError(true);
    }
  };

  return (
    <Link to={`/game/${game.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {!isImageLoaded && !hasError && (
          <div className={styles.imagePlaceholder}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {hasError ? (
          <div className={styles.imageError}>X</div>
        ) : (
          <img
            src={imageUrl}
            alt={game.name}
            className={styles.image}
            onLoad={() => setIsImageLoaded(true)}
            onError={handleError}
            loading="lazy"
            style={{ opacity: isImageLoaded ? 1 : 0 }}
          />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{game.name}</h3>
        {game.characters && (
          <p className={styles.info}>
            {game.characters.length} character
            {game.characters.length > 1 ? "s" : ""} to find
          </p>
        )}
      </div>
    </Link>
  );
};

export default GameCard;
