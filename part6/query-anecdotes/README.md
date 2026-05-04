# Query Anecdotes

A React + Vite anecdote application that uses `@tanstack/react-query` and a local JSON Server backend.

## Run

Install dependencies:

```bash
npm install
```

Start the JSON Server backend on port `3001`:

```bash
npm run server
```

Start the frontend:

```bash
npm run dev
```

## Scripts

- `npm run dev` starts the frontend in development mode
- `npm run server` starts the JSON Server on port `3001`
- `npm run build` creates a production build
- `npm run preview` previews the production build
- `npm run lint` runs ESLint

## Notes

- Backend configuration is in [server.js](./server.js).
- New anecdotes must be at least 5 characters long.
- TanStack Query logic is centralized in [src/hooks/useAnecdotes.js](./src/hooks/useAnecdotes.js).
- Create and vote mutations update the query cache directly instead of refetching all anecdotes.
- If the backend is unavailable, the app shows `anecdote service not available due to problems in server`.
