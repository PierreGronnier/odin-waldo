import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import Leaderboard from "../pages/Leaderboard";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/game/:id",
    element: <Game />,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
