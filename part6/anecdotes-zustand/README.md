# Full Stack Open - Part 6: Anecdotes with Zustand

This project contains the **Anecdotes** exercises from Part 6 of the Full Stack Open course.

The app displays software engineering anecdotes, allows users to vote for them, add new ones, filter the list, and delete anecdotes that still have zero votes. Anecdotes are fetched from and persisted to a JSON Server backend, the list is kept in descending order by votes, and notifications are shown for create, vote, and delete actions.

It demonstrates:

- Managing shared state with Zustand
- Using a separate Zustand store for notifications
- Fetching and persisting data with the Fetch API
- Splitting UI into focused React components
- Sorting and filtering derived data for rendering
- Testing React components and store-driven behavior with Vitest and React Testing Library

## Run the project

```bash
npm install
npx json-server --port 3001 --watch db.json
npm run dev
```

Start JSON Server first, then run the Vite development server in a separate terminal.

## Run tests

```bash
npm test
```

The test suite covers backend initialization, vote-based sorting, filtering, and voting behavior.

Built with React, Zustand, Vite, Vitest, React Testing Library, and JSON Server for learning purposes.
