import { useState, useRef, useEffect, useCallback } from "react";
import styles from "../styles/ImageViewer.module.css";

const ImageViewer = ({ src, alt, onLoad, onClick }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);

  // Gérer le chargement de l'image
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setImageError(true);
  }, []);

  // Zoom avec la molette
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(0.5, scale + delta), 5);
      setScale(newScale);
    },
    [scale],
  );

  // Démarrer le drag
  const handleMouseDown = useCallback(
    (e) => {
      if (scale <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [scale, position],
  );

  // Déplacer l'image
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart],
  );

  // Arrêter le drag
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Gérer le clic sur l'image (pour le gameplay)
  const handleImageClick = useCallback(
    (e) => {
      if (isDragging || scale > 1) return;

      if (onClick) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        onClick({ x, y });
      }
    },
    [isDragging, scale, onClick],
  );

  // Boutons de zoom
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Réinitialiser la position si le zoom revient à 1
  useEffect(() => {
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Loading overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Loading image...</p>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div className={styles.errorState}>
          <p>Image loading error</p>
        </div>
      )}

      {/* Image */}
      <div
        className={styles.imageWrapper}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "crosshair",
        }}
        onMouseDown={handleMouseDown}
        onClick={handleImageClick}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={styles.image}
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* Zoom controls */}
      <div className={styles.controls}>
        <button onClick={zoomOut} disabled={scale <= 0.5} title="Zoom arrière">
          −
        </button>
        <button onClick={resetZoom} title="Réinitialiser">
          {Math.round(scale * 100)}%
        </button>
        <button onClick={zoomIn} disabled={scale >= 5} title="Zoom avant">
          +
        </button>
      </div>

      {/* Instructions */}
      {!isLoading && !imageError && (
        <div className={styles.instructions}>
          <p>Scroll wheel to zoom • Click and drag to move</p>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
