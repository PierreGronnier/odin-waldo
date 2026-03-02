# Art Finder — A Photo Tagging App

> A _Where's Waldo_-style game built on top of famous works of art. Zoom into iconic paintings and find hidden characters before the clock runs out.

🔗 **[Live Demo](https://odin-waldo-v4if.vercel.app/)**

This project was built as part of [The Odin Project](https://www.theodinproject.com/) NodeJS curriculum. Rather than using the classic Waldo illustrations, I chose to base the game on renowned works of art — paintings by Pieter Bruegel the Elder, Hieronymus Bosch, and a Qing dynasty imperial scroll — giving the game a more cultural and educational flavour.

---

## Paintings Featured

| Painting                                     | Artist                     | Year         |
| -------------------------------------------- | -------------------------- | ------------ |
| The Dutch Proverbs                           | Pieter Bruegel the Elder   | 1559         |
| Children's Games                             | Pieter Bruegel the Elder   | 1560         |
| The Garden of Earthly Delights               | Hieronymus Bosch           | c. 1490–1510 |
| Along the River During the Qingming Festival | Qing dynasty court artists | 18th century |

---

## Project Structure

```
pierregronnier-odin-waldo/
├── client/   # React + Vite frontend
└── server/   # Express + Prisma backend API
```

---

## Features

- **Zoom & pan** — explore large, detail-rich paintings with a custom image viewer
- **Character detection** — right-click anywhere to open a character selection menu; the backend verifies your click against stored coordinates
- **Server-side timer** — a game session is created on the server when the image loads; the final time is computed server-side to prevent cheating
- **Victory modal** — submit your name to the leaderboard once all characters are found
- **Leaderboard** — per-painting top-10 scores, sorted by time
- **Completed badge** — local storage tracks which paintings you have already finished
- **Painting info modal** — learn about each artwork (artist, year, location, fun fact, YouTube link)

---

## Tech Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | React 19, React Router 7, Vite 7, CSS Modules |
| Backend  | Node.js, Express 5                            |
| Database | PostgreSQL via Prisma ORM                     |
| Hosting  | Vercel (server), Vercel Blob (images)         |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A PostgreSQL database (local or hosted)

### 1. Clone the repository

```bash
git clone https://github.com/PierreGronnier/odin-waldo.git
cd odin-waldo
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/artfinder"
CLIENT_URL="http://localhost:5173"
PORT=3000
```

Run migrations and seed the database:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Start the server:

```bash
node src/server.js
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Detailed Documentation

- [Client README](./client/README.md) — frontend architecture, components, hooks, and routing
- [Server README](./server/README.md) — API reference, database schema, and services

---

## Author

**Pierre Gronnier** — [GitHub](https://github.com/PierreGronnier)
