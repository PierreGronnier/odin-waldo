# 🖥️ Art Finder — Client

React + Vite frontend for the Art Finder photo-tagging game.

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Router provider entry point
├── main.jsx                 # React root, imports global styles
├── router/
│   └── index.jsx            # Route definitions
├── pages/
│   ├── Home.jsx             # Game selection grid
│   ├── Game.jsx             # Main game page
│   ├── Leaderboard.jsx      # Per-painting top scores
│   └── NotFound.jsx         # 404 fallback
├── components/
│   ├── ImageViewer.jsx      # Zoomable/pannable image with marker overlay
│   ├── SelectCharacter.jsx  # Right-click popup to pick a character
│   ├── GameHeader.jsx       # Top bar with back button, title, and timer slot
│   ├── GameSidebar.jsx      # Character list with found/not found states
│   ├── GameTimer.jsx        # DOM-based timer (rAF loop, no re-renders)
│   ├── GameCard.jsx         # Painting card for the home grid
│   ├── PaintingInfo.jsx     # Info modal (artist, year, fun fact, YouTube)
│   ├── VictoryModal.jsx     # End-of-game score submission
│   ├── CharacterInfo.jsx    # Expanded character description on hover
│   ├── ErrorMessage.jsx     # Generic error display with retry button
│   └── Loader.jsx           # Spinner component
├── hooks/
│   ├── useGames.js          # Fetch all games / single game
│   ├── useTimer.js          # Display-only timer hook + formatTime utility
│   └── useCompletedGames.js # localStorage-backed completed game tracking
├── services/
│   └── api.js               # All API calls (games, verify, sessions, scores)
└── styles/
    ├── variables.css        # Design tokens (colors, spacing, radii, z-index)
    ├── global.css           # Reset + base typography
    └── *.module.css         # Per-component scoped styles
```

---

## 🧩 Key Components

### `ImageViewer`

The most complex component in the project. It provides:

- **Zoom** via mouse wheel or `+`/`−` buttons (clamped between 0.5× and up to 45× for the large Qingming scroll)
- **Pan** via click-and-drag
- **Right-click** to open the character selection menu at the exact click coordinates
- **Markers** — found characters are rendered in a separate DOM layer (`markersLayerRef`) and repositioned directly in the DOM using `requestAnimationFrame`, avoiding React re-render overhead during zoom and pan
- All transforms are applied directly to the DOM (`style.transform`) rather than through React state, keeping the animation loop smooth

### `GameTimer`

Uses `requestAnimationFrame` and a `useRef` for the start timestamp to update the displayed time without triggering React re-renders. The parent (`Game.jsx`) holds a `stopTimerRef` callback ref populated by the timer via `useEffect`. When the game ends, the parent calls `stopTimerRef.current()` to capture the local elapsed time as a fallback in case the server session call fails.

### `SelectCharacter`

A fixed-position popup that appears at the mouse coordinates when the user right-clicks the image. It filters out already-found characters and constrains its position to stay within the viewport. Clicking outside closes it via a `mousedown` document listener.

### `PaintingInfo`

Parses the game's `description` field (stored as JSON in the database) and displays it in an animated modal. Includes artist, year, location, a fun fact, and an optional YouTube link.

---

## 🪝 Hooks

| Hook                   | Purpose                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| `useGames` / `useGame` | Fetch the game list or a single game from the API                                |
| `useDisplayTimer`      | Local display timer (for UX only — the authoritative time comes from the server) |
| `formatTime(ms)`       | Formats milliseconds as `mm:ss.t`                                                |
| `useCompletedGames`    | Reads/writes a `localStorage` array of completed game IDs                        |

---

## 🔌 API Service (`src/services/api.js`)

All backend communication goes through a single `ApiService` class instance:

| Method                                       | Endpoint                                         | Description                                                    |
| -------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `getGames()`                                 | `GET /api/games`                                 | Fetch all games with their characters (coordinates excluded)   |
| `getGame(id)`                                | `GET /api/games/:id`                             | Fetch a single game                                            |
| `verifyCharacter(gameId, characterId, x, y)` | `POST /api/games/:id/verify`                     | Check if a click is within tolerance of a character's position |
| `startSession(gameId)`                       | `POST /api/games/:id/sessions`                   | Start a server-side session (returns `{ id, startedAt }`)      |
| `finishSession(gameId, sessionId)`           | `POST /api/games/:id/sessions/:sessionId/finish` | End the session and get the authoritative `timeInMs`           |
| `getLeaderboard()`                           | `GET /api/scores?limit=10`                       | Fetch top scores for all games                                 |
| `submitScore(gameId, playerName, timeInMs)`  | `POST /api/scores/:gameId`                       | Submit a score                                                 |
| `getImageUrl(path)`                          | —                                                | Builds the full image URL (corrects `.png` → `.PNG` casing)    |
| `getThumbUrl(path)`                          | —                                                | Builds the thumbnail URL for the home grid                     |

---

## 🎨 Styling

The project uses **CSS Modules** for component-level scoping alongside two global files:

- `variables.css` — all design tokens (`--color-*`, `--spacing-*`, `--radius-*`, `--z-*`, etc.)
- `global.css` — CSS reset, base element styles, scrollbar customisation

The colour scheme is dark by default (`#0a0a0a` background, `#646cff` accent).

---

## ⚙️ Environment Variables

| Variable       | Default                 | Description          |
| -------------- | ----------------------- | -------------------- |
| `VITE_API_URL` | `http://localhost:3000` | Backend API base URL |

---

## 📦 Available Scripts

```bash
npm run dev       # Start the Vite dev server
npm run build     # Production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```
