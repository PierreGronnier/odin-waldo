import styles from "../styles/Game.module.css";
import apiService from "../services/api";

export default function GameSidebar({ characters, foundCharacters = [] }) {
  if (!characters || characters.length === 0) return null;

  return (
    <aside className={styles.sidebar}>
      <h3>Characters to find</h3>

      <ul className={styles.characterList}>
        {characters.map((character) => {
          const isFound = foundCharacters.includes(character.id);
          return (
            <li
              key={character.id}
              className={`${styles.characterItem} ${isFound ? styles.found : ""}`}
            >
              <div className={styles.characterWrapper}>
                {character.imageUrl && (
                  <img
                    src={apiService.getImageUrl(character.imageUrl)}
                    alt={character.name}
                    className={styles.characterImage}
                  />
                )}
                <span className={styles.characterName}>{character.name}</span>
                {isFound && <span className={styles.foundBadge}>✓</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
