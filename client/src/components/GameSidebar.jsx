import { useState, memo } from "react";
import styles from "../styles/Game.module.css";
import apiService from "../services/api";
import CharacterInfo from "./CharacterInfo";

const GameSidebar = memo(function GameSidebar({
  characters,
  foundCharacters = [],
}) {
  const [hoveredCharacterId, setHoveredCharacterId] = useState(null);

  if (!characters || characters.length === 0) return null;

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>Characters to find</h3>

      <ul className={styles.characterList}>
        {characters.map((character) => {
          const isFound = foundCharacters.some((c) => c.id === character.id);
          const isHovered = hoveredCharacterId === character.id;

          return (
            <li
              key={character.id}
              className={`${styles.characterItem} ${isFound ? styles.found : ""} ${isHovered ? styles.hovered : ""}`}
              onMouseEnter={() => setHoveredCharacterId(character.id)}
              onMouseLeave={() => setHoveredCharacterId(null)}
            >
              <div className={styles.characterWrapper}>
                {character.imageUrl && (
                  <img
                    src={(() => {
                      const url = apiService.getImageUrl(character.imageUrl);
                      console.log("URL générée:", url);
                      return url;
                    })()}
                    alt={character.name}
                    className={styles.characterImage}
                  />
                )}
                <span className={styles.characterName}>{character.name}</span>
                {isFound && <span className={styles.foundBadge}>✓</span>}
              </div>

              {isHovered && <CharacterInfo character={character} />}
            </li>
          );
        })}
      </ul>
    </aside>
  );
});

export default GameSidebar;
