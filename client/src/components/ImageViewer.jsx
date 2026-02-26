import { useState, useRef, useCallback, useEffect, memo } from "react";
import styles from "../styles/ImageViewer.module.css";

const MIN_SCALE = 0.5;
const ZOOM_FACTOR = 0.1;
const BUTTON_ZOOM_FACTOR = 1.25;

const ImageViewer = memo(function ImageViewer({
  src,
  alt,
  onClick,
  maxZoom = 7,
  markers = [],
  markerBaseSize = 30,
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const markersLayerRef = useRef(null);

  const transformRef = useRef({ scale: 1, x: 0, y: 0 });
  const [displayScale, setDisplayScale] = useState(1);

  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, tx: 0, ty: 0 });

  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const applyTransformDOM = useCallback((scale, x, y) => {
    const wrapper = imageRef.current?.parentElement;
    if (!wrapper) return;
    wrapper.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

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

    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    };
  }, []);

  // Mise à jour des markers directement dans le DOM
  const updateMarkersDOM = useCallback(() => {
    const layer = markersLayerRef.current;
    const container = containerRef.current;
    const image = imageRef.current;
    if (!layer || !container || !image) return;

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    Array.from(layer.children).forEach((el, i) => {
      const marker = markers[i];
      if (!marker) return;

      const imgX = (marker.x / 100) * imageRect.width;
      const imgY = (marker.y / 100) * imageRect.height;
      const left = imageRect.left + imgX - containerRect.left;
      const top = imageRect.top + imgY - containerRect.top;

      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    });
  }, [markers]);

  const setTransform = useCallback(
    (scale, x, y, updateDisplay = true) => {
      const constrained = getConstrainedTranslate(scale, x, y);
      transformRef.current = { scale, ...constrained };
      applyTransformDOM(scale, constrained.x, constrained.y);
      requestAnimationFrame(updateMarkersDOM);
      if (updateDisplay) setDisplayScale(scale);
    },
    [applyTransformDOM, getConstrainedTranslate, updateMarkersDOM],
  );

  // Zoom
  const zoomAt = useCallback(
    (clientX, clientY, newScale) => {
      const container = containerRef.current;
      if (!container) return;

      const { scale, x, y } = transformRef.current;
      const rect = container.getBoundingClientRect();

      const cx = clientX - rect.left - rect.width / 2;
      const cy = clientY - rect.top - rect.height / 2;

      const newX = cx - (cx - x) * (newScale / scale);
      const newY = cy - (cy - y) * (newScale / scale);

      setTransform(newScale, newX, newY);
    },
    [setTransform],
  );

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      const newScale = Math.min(
        Math.max(
          transformRef.current.scale * (1 + delta * ZOOM_FACTOR),
          MIN_SCALE,
        ),
        maxZoom,
      );
      zoomAt(e.clientX, e.clientY, newScale);
    },
    [maxZoom, zoomAt],
  );

  const zoomInBtn = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const newScale = Math.min(
      transformRef.current.scale * BUTTON_ZOOM_FACTOR,
      maxZoom,
    );
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, newScale);
  }, [maxZoom, zoomAt]);

  const zoomOutBtn = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const newScale = Math.max(
      transformRef.current.scale / BUTTON_ZOOM_FACTOR,
      MIN_SCALE,
    );
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, newScale);
  }, [zoomAt]);

  const resetZoom = useCallback(() => setTransform(1, 0, 0), [setTransform]);

  // Drag
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
      const newX = tx + (e.clientX - mouseX);
      const newY = ty + (e.clientY - mouseY);
      setTransform(transformRef.current.scale, newX, newY, false);
    },
    [setTransform],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const wrapper = imageRef.current?.parentElement;
    if (wrapper) wrapper.style.cursor = "grab";
    setDisplayScale(transformRef.current.scale);
  }, []);

  // Right-click → placer un marqueur
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

  //Effets
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
      const { scale, x, y } = transformRef.current;
      setTransform(scale, x, y, false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setTransform]);

  // Re-positionner les markers si la liste change
  useEffect(() => {
    requestAnimationFrame(updateMarkersDOM);
  }, [markers, updateMarkersDOM]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setTransform(1, 0, 0);
  }, [setTransform]);

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
          fetchPriority="high"
        />
      </div>

      <div ref={markersLayerRef} className={styles.markersLayer}>
        {markers.map((char) => (
          <div
            key={char.id}
            className={styles.mapMarker}
            style={{
              position: "absolute",
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
        ))}
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
});

export default ImageViewer;
