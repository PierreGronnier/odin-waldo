import { Link } from "react-router-dom";

const games = [
  { id: 1, name: "The Dutch Proverbs", image: "TheDutchProverbs.webp" },
  { id: 2, name: "Children's Games", image: "TheElderChildrensGames.webp" },
  {
    id: 3,
    name: "Garden of Earthly Delights",
    image: "TheGardenofEarthlyDelights.jpg",
  },
  {
    id: 4,
    name: "Along the River During the Qingming Festival",
    image: "AlongtheRiverDuringtheQingmingFestival.jpg",
  },
];

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎨 Art Finder</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
        }}
      >
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/game/${game.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "12px",
                transition: "0.2s",
              }}
            >
              <img
                src={`http://localhost:3000/images/${game.image}`}
                alt={game.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h3 style={{ margin: "0.5rem 0 0" }}>{game.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
