# Blog App Monorepo

This repository contains the Full Stack Open Blog App as a monorepo.

- `client/` contains the Vite + React frontend
- `server/` contains the Express + MongoDB backend
- the root `package.json` provides convenience scripts for the full app

## Getting Started

Install dependencies in all package roots:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Run the app in development:

```bash
npm run dev
```

Build the frontend for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Repository Structure

```text
bloglist/
├── client/
├── server/
├── package.json
└── README.md
```

## State Management

- **React Query** manages server state like blogs and users
- **Zustand** manages app state like the signed-in user and notifications

## Documentation

- Backend details: [server/README.md](server/README.md)
- Frontend details: [client/README.md](client/README.md)

## Root Scripts

- `npm run dev` starts backend and frontend together
- `npm run build` builds the frontend
- `npm start` starts the backend in production mode
- `npm run format` formats the repository with Prettier
- `npm run format:check` checks formatting
