# Client

This directory contains the Vite + React frontend for the Blog App.

## Responsibilities

- Login flow and session-aware UI
- Blog list, blog detail, comments, likes, and deletion
- Users list and individual user pages
- Routing, error boundary, and not-found page
- Material UI-based presentation layer

## State Management

- **React Query** manages backend data:
  - blogs
  - users
  - blog mutations like create, like, delete, and comment
- **Zustand** manages client-side app state:
  - signed-in user
  - notifications

## Scripts

Run from `client/`:

```bash
npm install
npm run dev
npm run build
npm test
```

Available scripts:

- `npm run dev` starts the Vite dev server
- `npm run build` creates the production build
- `npm run preview` previews the production build locally
- `npm test` runs the frontend test suite
- `npm run lint` checks frontend lint rules

## Development Notes

- Vite provides hot reload during development.
- API requests are proxied to the backend server.
- The frontend expects the backend API under `/api`.

## Main Libraries

- React
- React Router
- React Query
- Zustand
- Material UI
- Axios
- Vitest
