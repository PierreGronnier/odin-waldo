import { useState, useRef, useCallback, useEffect } from "react";
import styles from "../styles/ImageViewer.module.css";

const MIN_SCALE = 0.5;
const ZOOM_FACTOR = 0.1;
const BUTTON_ZOOM_FACTOR = 1.25;

const ImageViewer = ({
  src,
  alt,
  onClick,
  maxZoom = 7,
  markers = [],
  markerBaseSize = 30,
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, tx: 0, ty: 0 });

  const [displayScale, setDisplayScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Applique la transformation sur le wrapper de l'image
  const applyTransform = useCallback((scale, x, y) => {
    const wrapper = imageRef.current?.parentElement;
    if (!wrapper) return;
    wrapper.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  // Calcule les limites de déplacement pour que l'image reste visible
  const getConstrainedTranslate = useCallback((scale, x, y) => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return { x, y };

    const cW = container.clientWidth;
    const cH = container.clientHeight;
    const naturalW = image.naturalWidth;
    const naturalH = image.naturalHeight;

    const containerAspect = cW / cH;
    const imageAspect = naturalW / naturalH;

    let baseW, baseH;
    if (imageAspect > containerAspect) {
      baseW = cW;
      baseH = cW / imageAspect;
    } else {
      baseH = cH;
      baseW = cH * imageAspect;
    }

    const scaledW = baseW * scale;
    const scaledH = baseH * scale;
    const MIN_VISIBLE = 80;

    const maxX =
      Math.max(scaledW - MIN_VISIBLE, 0) / 2 + (cW - Math.min(scaledW, cW)) / 2;
    const maxY =
      Math.max(scaledH - MIN_VISIBLE, 0) / 2 + (cH - Math.min(scaledH, cH)) / 2;
    const minX = -maxX;
    const minY = -maxY;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  }, []);

  // Met à jour le state transform et applique la transformation
  const updateTransform = useCallback(
    (newScale, newX, newY, updateDisplay = true) => {
      const constrained = getConstrainedTranslate(newScale, newX, newY);
      setTransform({ scale: newScale, x: constrained.x, y: constrained.y });
      applyTransform(newScale, constrained.x, constrained.y);
      if (updateDisplay) setDisplayScale(newScale);
    },
    [applyTransform, getConstrainedTranslate],
  );

  // Zoom centré sur un point
  const zoomAt = useCallback(
    (clientX, clientY, newScale) => {
      const container = containerRef.current;
      if (!container) return;

      const { scale, x, y } = transform;
      const rect = container.getBoundingClientRect();

      const cx = clientX - rect.left - rect.width / 2;
      const cy = clientY - rect.top - rect.height / 2;

      const newX = cx - (cx - x) * (newScale / scale);
      const newY = cy - (cy - y) * (newScale / scale);

      updateTransform(newScale, newX, newY);
    },
    [transform, updateTransform],
  );

  // Molette
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      const newScale = Math.min(
        Math.max(transform.scale * (1 + delta * ZOOM_FACTOR), MIN_SCALE),
        maxZoom,
      );
      zoomAt(e.clientX, e.clientY, newScale);
    },
    [transform.scale, maxZoom, zoomAt],
  );

  // Boutons de zoom
  const zoomInBtn = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const newScale = Math.min(transform.scale * BUTTON_ZOOM_FACTOR, maxZoom);
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, newScale);
  }, [transform.scale, maxZoom, zoomAt]);

  const zoomOutBtn = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const newScale = Math.max(transform.scale / BUTTON_ZOOM_FACTOR, MIN_SCALE);
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, newScale);
  }, [transform.scale, zoomAt]);

  const resetZoom = useCallback(
    () => updateTransform(1, 0, 0),
    [updateTransform],
  );

  // Drag
  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      isDragging.current = true;
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        tx: transform.x,
        ty: transform.y,
      };
      e.currentTarget.style.cursor = "grabbing";
    },
    [transform.x, transform.y],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;
      const { mouseX, mouseY, tx, ty } = dragStart.current;
      const newX = tx + (e.clientX - mouseX);
      const newY = ty + (e.clientY - mouseY);
      updateTransform(transform.scale, newX, newY, false);
    },
    [transform.scale, updateTransform],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const wrapper = imageRef.current?.parentElement;
    if (wrapper) wrapper.style.cursor = "grab";
    setDisplayScale(transform.scale);
  }, [transform.scale]);

  // Right‑click pour placer un marqueur
  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      if (!onClick || !imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      onClick({ x, y });
    },
    [onClick],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleResize = () => {
      updateTransform(transform.scale, transform.x, transform.y, false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [transform, updateTransform]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    updateTransform(1, 0, 0);
  }, [updateTransform]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setImageError(true);
  }, []);

  // Calcule la position en pixels d'un marqueur (pourcentage -> coordonnées absolues)
  const getMarkerPosition = useCallback((char) => {
    if (!containerRef.current || !imageRef.current) return { left: 0, top: 0 };
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    // Coordonnées du centre du marqueur dans l'image (en pixels)
    const imgX = (char.x / 100) * imageRect.width;
    const imgY = (char.y / 100) * imageRect.height;

    // Position absolue par rapport au conteneur
    const left = imageRect.left + imgX - containerRect.left;
    const top = imageRect.top + imgY - containerRect.top;

    return { left, top };
  }, []);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onContextMenu={handleContextMenu}
    >
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <p>Loading...</p>
        </div>
      )}
      {imageError && (
        <div className={styles.errorState}>
          <p>Error loading image</p>
        </div>
      )}

      <div
        className={styles.imageWrapper}
        style={{ cursor: "grab", position: "relative" }}
        onMouseDown={handleMouseDown}
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

      {/* Calque des marqueurs (en dehors du wrapper transformé) */}
      <div className={styles.markersLayer}>
        {markers.map((char) => {
          const { left, top } = getMarkerPosition(char);
          return (
            <div
              key={char.id}
              className={styles.mapMarker}
              style={{
                left,
                top,
                transform: "translate(-50%, -50%)",
                width: markerBaseSize,
                height: markerBaseSize,
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17L4 12" />
              </svg>
            </div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button onClick={zoomOutBtn} disabled={displayScale <= MIN_SCALE}>
          −
        </button>
        <span className={styles.zoomLevel} onDoubleClick={resetZoom}>
          {Math.round(displayScale * 100)}%
        </span>
        <button onClick={zoomInBtn} disabled={displayScale >= maxZoom}>
          +
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
