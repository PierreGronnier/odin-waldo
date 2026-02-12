import { useParams } from "react-router-dom";

const games = {
  1: { image: "TheDutchProverbs.webp" },
  2: { image: "TheElderChildrensGames.webp" },
  3: { image: "TheGardenofEarthlyDelights.jpg" },
  4: { image: "AlongtheRiverDuringtheQingmingFestival.jpg" },
};

export default function Game() {
  const { id } = useParams();
  const game = games[id];

  if (!game) return <div>Image non trouvée</div>;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0a0a" }}>
      <img
        src={`http://localhost:3000/images/${game.image}`}
        alt="game"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
