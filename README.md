# Doodle Chat – Frontend Challenge

A chat application built with React, TypeScript and Vite for the Doodle frontend challenge.

---

## Features

- Messages refresh every 3 seconds via REST polling (no WebSocket support on the backend)
- Login / logout with session saved in `localStorage`
- Dark / light mode toggle, preference persisted across reloads
- Responsive layout (mobile + desktop)
- Custom CSS design tokens – no hardcoded hex values in components

---

## Project structure

```
src/
├── api/
│   └── chatApi.ts          # getMessages / postMessage wrappers
├── components/
│   ├── MessageBubble.tsx   # Single chat bubble
│   ├── MessageList.tsx     # Scrollable message list
│   └── MessageInput.tsx    # Text input + send button
├── hooks/
│   └── useMessages.ts      # Polling + send logic
├── types/
│   └── message.ts          # Message type
├── App.tsx                 # Login / Chat screens, theme state
├── index.css               # Global color classes
└── main.tsx
tests/
└── chat.spec.ts            # Playwright E2E tests
```

---

## Getting started

### Requirements

- Node.js ≥ 18
- A running Doodle backend (or any compatible API)

### Setup

```bash
git clone https://github.com/iaco32/Doodle-Frontend-Challenge.git
cd Doodle-Frontend-Challenge
npm install
cp .env.example .env   # fill in your values
npm run dev
```

The app will be at `http://localhost:5173`.

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:3000` |
| `VITE_API_TOKEN` | Bearer token | _(empty)_ |
| `VITE_POLLING_INTERVAL_MS` | Poll interval (ms) | `3000` |

---

## Testing

### Unit tests

```bash
npm run test          # run once
npm run test:watch    # watch mode
npm run test:ui       # Vitest UI
```

22 tests across:
- `chatApi.ts` – fetch / post with mocked `fetch`
- `MessageBubble.tsx` – rendering, alignment, timestamp
- `MessageList.tsx` – author label logic
- `MessageInput.tsx` – controlled input, disabled state
- `useMessages.ts` – polling, send, error handling

### E2E tests (Playwright)

```bash
npx playwright install chromium   # first time only
npx playwright test
npx playwright test --ui          # interactive mode
```

Covers: login flow, session persistence, message display, send (click + Enter), logout, dark/light toggle.

---

## Notes on implementation

**Polling** – the backend is plain REST, so `setInterval` is used to re-fetch the full list every 3 s. Messages are sorted by `createdAt` after each fetch. On send, the new message is appended immediately and deduped on the next poll via `_id` comparison.

**CSS tokens** – all colours live in `index.css` as named classes (`.bg-doodle-form-bg`, `.bg-doodle-bubble-own`, etc.). This made palette tweaks straightforward without touching components.

**Dark mode** – Tailwind's `darkMode: 'class'` strategy; a `dark`/`light` class is toggled on the root div. The doodle background image (white base) gets a semi-transparent overlay in dark mode so the patterns stay visible.

**TDD** – tests were written before each implementation. Vitest + Testing Library for units, Playwright for E2E.
