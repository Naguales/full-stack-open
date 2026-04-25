# Full Stack Open - Part 6: Anecdotes with Zustand

This project contains the **Anecdotes** exercises from Part 6 of the Full Stack Open course.

The app displays software engineering anecdotes, allows users to vote for them, add new ones, filter the list, and delete anecdotes that still have zero votes. Anecdotes are fetched from and persisted to a JSON Server backend, and the list is kept in descending order by votes.

It demonstrates:

- Managing shared state with Zustand
- Using a separate Zustand store for notifications
- Fetching and persisting data with the Fetch API
- Splitting UI into focused React components
- Sorting and filtering derived data for rendering

## Run the project

```bash
npm install
npx json-server --port 3001 --watch db.json
npm run dev
```

Start JSON Server first, then run the Vite development server in a separate terminal.

Built with React, Zustand, Vite, and JSON Server for learning purposes.
