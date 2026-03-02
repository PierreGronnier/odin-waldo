# Art Finder — Server

Express + Prisma REST API for the Art Finder photo-tagging game.

---

## Project Structure

```
server/
├── src/
│   ├── app.js               # Express app setup (CORS, routes)
│   ├── server.js            # HTTP server entry point
│   ├── config/
│   │   └── prisma.js        # Shared PrismaClient instance
│   ├── routes/
│   │   ├── gamesRoute.js    # /api/games
│   │   ├── scoresRoute.js   # /api/scores
│   │   └── sessionsRoute.js # /api/games/:id/sessions
│   ├── controllers/
│   │   ├── gamesController.js
│   │   ├── scoresController.js
│   │   └── sessionsController.js
│   └── services/
│       ├── gamesService.js
│       ├── scoresService.js
│       └── sessionsService.js
└── prisma/
    ├── schema.prisma        # Database schema
    ├── seed.js              # Seed data (games + characters)
    └── migrations/          # Prisma migration history
```

---

## Database Schema

```prisma
model Game {
  id          Int           @id @default(autoincrement())
  name        String
  imageUrl    String
  description String?       // JSON string (artist, year, location, fun fact, …)
  characters  Character[]
  scores      Score[]
  sessions    GameSession[]
  createdAt   DateTime      @default(now())
}

model Character {
  id          Int     @id @default(autoincrement())
  name        String
  description String?
  imageUrl    String?
  x           Float   // Percentage (0–100) of image width
  y           Float   // Percentage (0–100) of image height
  gameId      Int
  game        Game    @relation(...)
}

model Score {
  id         Int      @id @default(autoincrement())
  playerName String
  timeInMs   Int
  gameId     Int
  createdAt  DateTime @default(now())
}

model GameSession {
  id         Int       @id @default(autoincrement())
  gameId     Int
  startedAt  DateTime  @default(now())
  finishedAt DateTime?
}
```

Character coordinates are stored as percentages of the image dimensions. This makes them resolution-independent and works correctly regardless of screen size or zoom level.

---

## API Reference

### Games

#### `GET /api/games`

Returns all games with their characters. Character coordinates (`x`, `y`) are **never** sent to the client — only `id`, `name`, `description`, and `imageUrl`.

```json
[
  {
    "id": 1,
    "name": "The Dutch Proverbs",
    "imageUrl": "the-dutch-proverbs/main.webp",
    "description": "{\"artist\":\"Pieter Bruegel the Elder\", ...}",
    "characters": [
      {
        "id": 1,
        "name": "Fear makes the old woman trot",
        "imageUrl": "...",
        "gameId": 1
      }
    ]
  }
]
```

#### `GET /api/games/:id`

Returns a single game with its characters.

#### `POST /api/games/:id/verify`

Verifies whether a click landed within the tolerance zone of a character.

**Body:**

```json
{ "characterId": 1, "x": 79.1, "y": 12.3 }
```

**Response:**

```json
{ "success": true }
```

The tolerance is ±2% on both axes. The character's actual coordinates are looked up server-side and never exposed to the client.

---

### Sessions

#### `POST /api/games/:id/sessions`

Creates a new game session and records the start time server-side.

**Response:**

```json
{ "id": 42, "startedAt": "2026-01-01T12:00:00.000Z" }
```

#### `POST /api/games/:id/sessions/:sessionId/finish`

Marks the session as finished and returns the elapsed time in milliseconds, computed entirely on the server. This prevents clients from submitting manipulated times.

**Response:**

```json
{ "timeInMs": 95432 }
```

Returns `400` if the session does not exist, has already been finished, or does not belong to the specified game.

---

### Scores

#### `GET /api/scores`

Returns the top 10 scores for every game (used by the leaderboard).

```json
[
  {
    "id": 1,
    "name": "The Dutch Proverbs",
    "scores": [
      { "id": 7, "playerName": "Alice", "timeInMs": 45200, "createdAt": "..." }
    ]
  }
]
```

#### `GET /api/scores/:gameId`

Returns the top scores for a single game.

#### `POST /api/scores/:gameId`

Submits a score.

**Body:**

```json
{ "playerName": "Alice", "timeInMs": 45200 }
```

`timeInMs` must be a positive integer. `playerName` is trimmed before saving.

---

## Environment Variables

| Variable       | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                                  |
| `CLIENT_URL`   | Allowed CORS origin (e.g. `https://your-frontend.vercel.app`) |
| `PORT`         | Port to listen on (default: `3000`)                           |

---

## Setup

```bash
npm install

# Run all migrations
npx prisma migrate deploy

# Seed the database with the four paintings and their characters
npx prisma db seed

# Start the server
node src/server.js
```

---

## Security Notes

- Character coordinates are stored in the database and **never returned** to the client. The `CHARACTER_PUBLIC_SELECT` object in `gamesService.js` explicitly excludes `x` and `y`.
- The session system ensures that even if a player modifies the timer in their browser, the server computes the authoritative elapsed time from `startedAt` to `finishedAt`.
- The verify endpoint checks that the `characterId` belongs to the requested `gameId`, preventing cross-game spoofing.
