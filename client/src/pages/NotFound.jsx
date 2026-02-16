import { useNavigate } from "react-router-dom";
import styles from "../styles/NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Page not found</p>
        <button onClick={() => navigate("/")} className={styles.button}>
          Return to homepage
        </button>
      </div>
    </div>
  );
}
