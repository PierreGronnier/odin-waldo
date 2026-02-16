import styles from "../styles/Loader.module.css";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default Loader;
