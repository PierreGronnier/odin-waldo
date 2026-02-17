import styles from "../styles/Game.module.css";
import apiService from "../services/api";

export default function GameSidebar({ characters }) {
  if (!characters || characters.length === 0) return null;

  return (
    <aside className={styles.sidebar}>
      <h3>Characters to find</h3>

      <ul className={styles.characterList}>
        {characters.map((character) => (
          <li key={character.id} className={styles.characterItem}>
            <div className={styles.characterWrapper}>
              {/* Image du personnage */}
              {character.imageUrl && (
                <img
                  src={apiService.getImageUrl(character.imageUrl)}
                  alt={character.name}
                  className={styles.characterImage}
                />
              )}

              <span className={styles.characterName}>{character.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
