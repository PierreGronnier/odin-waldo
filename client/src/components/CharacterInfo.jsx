import styles from "../styles/CharacterInfo.module.css";

const CharacterInfo = ({ character }) => {
  if (!character) return null;

  return (
    <div className={styles.infoExpanded}>
      <p className={styles.description}>
        {character.description || "No description available"}
      </p>
    </div>
  );
};

export default CharacterInfo;
