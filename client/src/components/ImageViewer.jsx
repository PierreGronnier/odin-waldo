import { useState, useRef, useEffect, useCallback } from "react";
import styles from "../styles/ImageViewer.module.css";

const MIN_SCALE = 0.5;
const ZOOM_FACTOR = 0.1; // par cran de molette
const BUTTON_ZOOM_FACTOR = 1.25;

const ImageViewer = ({ src, alt, onLoad, onClick, maxZoom = 7 }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // On stocke scale + translate dans un ref pour éviter les re-renders inutiles pendant le drag
  const transformRef = useRef({ scale: 1, x: 0, y: 0 });
  const [displayScale, setDisplayScale] = useState(1); // uniquement pour afficher le %
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, tx: 0, ty: 0 });

  // Applique le transform directement sur le DOM (pas de re-render)
  const applyTransform = useCallback((scale, x, y) => {
    const wrapper = imageRef.current?.parentElement;
    if (!wrapper) return;
    wrapper.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  // Calcule les bounds pour que l'image ne sorte pas entièrement
  // On garde au minimum MIN_VISIBLE_PX pixels visibles de chaque côté
  const getConstrainedTranslate = useCallback((scale, x, y) => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return { x, y };

    const cW = container.clientWidth;
    const cH = container.clientHeight;

    // Dimensions naturelles de l'image telles qu'elles s'affichent à scale=1
    // L'image est rendue avec max-width/max-height via CSS, on récupère sa taille rendue
    const naturalW = image.naturalWidth;
    const naturalH = image.naturalHeight;

    // Taille de l'image à scale=1 : on simule le comportement object-fit: contain
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

    // On veut qu'au minimum MIN_VISIBLE soit visible
    const MIN_VISIBLE = 80; // px

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

  const setTransform = useCallback(
    (scale, x, y, updateDisplay = true) => {
      const constrained = getConstrainedTranslate(scale, x, y);
      transformRef.current = { scale, x: constrained.x, y: constrained.y };
      applyTransform(scale, constrained.x, constrained.y);
      if (updateDisplay) setDisplayScale(scale);
    },
    [applyTransform, getConstrainedTranslate],
  );

  // Zoom centré sur un point (clientX, clientY)
  const zoomAt = useCallback(
    (clientX, clientY, newScale) => {
      const container = containerRef.current;
      if (!container) return;

      const { scale, x, y } = transformRef.current;
      const rect = container.getBoundingClientRect();

      // Position du curseur relative au centre du conteneur
      const cx = clientX - rect.left - rect.width / 2;
      const cy = clientY - rect.top - rect.height / 2;

      // On veut que le point sous le curseur reste fixe :
      // cx = (cx - x) / scale * newScale + newX  =>  newX = cx - (cx - x) * newScale / scale
      const newX = cx - (cx - x) * (newScale / scale);
      const newY = cy - (cy - y) * (newScale / scale);

      setTransform(newScale, newX, newY);
    },
    [setTransform],
  );

  // Molette
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const { scale } = transformRef.current;
      const delta = e.deltaY < 0 ? 1 : -1;
      const newScale = Math.min(
        Math.max(scale * (1 + delta * ZOOM_FACTOR), MIN_SCALE),
        maxZoom,
      );
      zoomAt(e.clientX, e.clientY, newScale);
    },
    [maxZoom, zoomAt],
  );

  // Boutons zoom centrés
  const zoomInBtn = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const { scale } = transformRef.current;
    const newScale = Math.min(scale * BUTTON_ZOOM_FACTOR, maxZoom);
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, newScale);
  }, [maxZoom, zoomAt]);

  const zoomOutBtn = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const { scale } = transformRef.current;
    const newScale = Math.max(scale / BUTTON_ZOOM_FACTOR, MIN_SCALE);
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, newScale);
  }, [zoomAt]);

  const resetZoom = useCallback(() => {
    setTransform(1, 0, 0);
  }, [setTransform]);

  // Drag — toujours actif (peu importe le scale)
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      tx: transformRef.current.x,
      ty: transformRef.current.y,
    };
    e.currentTarget.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;
      const { mouseX, mouseY, tx, ty } = dragStart.current;
      const { scale } = transformRef.current;
      const newX = tx + (e.clientX - mouseX);
      const newY = ty + (e.clientY - mouseY);
      const constrained = getConstrainedTranslate(scale, newX, newY);
      transformRef.current.x = constrained.x;
      transformRef.current.y = constrained.y;
      applyTransform(scale, constrained.x, constrained.y);
    },
    [applyTransform, getConstrainedTranslate],
  );

  const handleMouseUp = useCallback((e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const wrapper = imageRef.current?.parentElement;
    if (wrapper) wrapper.style.cursor = "grab";
    setDisplayScale(transformRef.current.scale);
  }, []);

  // Right-click to get coordinates — same calculation as original:
  // % relative to the image's bounding rect (accounts for zoom/pan automatically)
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
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Resize : recheck constraints
  useEffect(() => {
    const handleResize = () => {
      const { scale, x, y } = transformRef.current;
      setTransform(scale, x, y, false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setTransform]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    // Reset transform après chargement
    setTransform(1, 0, 0);
    onLoad?.();
  }, [onLoad, setTransform]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setImageError(true);
  }, []);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onContextMenu={handleContextMenu}
    >
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Loading image...</p>
        </div>
      )}
      {imageError && (
        <div className={styles.errorState}>
          <p>Image loading error</p>
        </div>
      )}
      <div
        className={styles.imageWrapper}
        style={{ cursor: "grab" }}
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
      <div className={styles.controls}>
        <button
          onClick={zoomOutBtn}
          disabled={displayScale <= MIN_SCALE}
          title="Zoom out"
        >
          −
        </button>
        <span
          className={styles.zoomLevel}
          onDoubleClick={resetZoom}
          title="Double-clic pour reset"
        >
          {Math.round(displayScale * 100)}%
        </span>
        <button
          onClick={zoomInBtn}
          disabled={displayScale >= maxZoom}
          title="Zoom in"
        >
          +
        </button>
      </div>
      {!isLoading && !imageError && (
        <div
          className={styles.instructions}
          style={{ bottom: "auto", top: "var(--spacing-lg)" }}
        >
          Scroll to zoom • Drag to pan • Right-click if you find a character
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
