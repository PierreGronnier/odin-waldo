import { useState, useEffect, useRef, memo } from "react";
import apiService from "../services/api";
import styles from "../styles/SelectCharacter.module.css";

const SelectCharacter = memo(function SelectCharacter({
  isOpen,
  position,
  characters,
  onSelect,
  onClose,
  foundCharacters = [],
}) {
  const menuRef = useRef(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [menuStyle, setMenuStyle] = useState({});

  const availableCharacters = characters?.filter(
    (c) => !foundCharacters.some((fc) => fc.id === c.id),
  );

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Empêche le menu de sortir de l'écran
    x = Math.min(Math.max(x, 10), viewportWidth - menuRect.width - 10);
    y = Math.min(Math.max(y, 10), viewportHeight - menuRect.height - 10);

    setMenuStyle({ left: x, top: y });
  }, [isOpen, position]);

  // Fermeture au clic extérieur
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Reset selected character when menu opens
  useEffect(() => {
    if (isOpen) setSelectedCharacter(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div ref={menuRef} className={styles.menu} style={menuStyle}>
        <div className={styles.header}>
          <h3>Select Character</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.characterList}>
          {availableCharacters?.length > 0 ? (
            availableCharacters.map((character) => (
              <button
                key={character.id}
                className={`${styles.characterItem} ${
                  selectedCharacter?.id === character.id ? styles.selected : ""
                }`}
                onClick={() => {
                  setSelectedCharacter(character);
                  onSelect(character);
                }}
              >
                {character.imageUrl && (
                  <img
                    src={apiService.getImageUrl(character.imageUrl)}
                    alt={character.name}
                    className={styles.characterImage}
                  />
                )}
                <span className={styles.characterName}>{character.name}</span>
              </button>
            ))
          ) : (
            <div className={styles.emptyState}>No characters to find</div>
          )}
        </div>

        <div className={styles.footer}>
          <p className={styles.instructions}>Click on a character to verify</p>
        </div>
      </div>

      <div className={styles.overlay} onClick={onClose} />
    </>
  );
});

export default SelectCharacter;
