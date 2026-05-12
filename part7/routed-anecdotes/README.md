# Full Stack Open - Part 7: Routed Anecdotes

This project contains the **Routed Anecdotes** exercises from Part 7 of the Full Stack Open course.

The application allows users to:

* Browse software anecdotes from a JSON Server backend
* Navigate between routed anecdote list, anecdote creation, and about views
* Create new anecdotes
* Reset anecdote form fields
* Delete anecdotes from the list
* Fetch anecdote data through a custom hook instead of handling server state directly in `App`

It demonstrates:

* Client-side routing with `react-router-dom`
* Custom React hooks with `useField` and `useAnecdotes`
* Fetching data from a server using the **Fetch API**
* Creating and deleting anecdote data via HTTP `POST` and `DELETE`
* Using `useEffect` for initial data fetching
* Controlled form inputs
* Encapsulating form logic inside reusable hooks
* Separating UI components, hooks, and service-layer HTTP code
* Rendering dynamic lists
* Enforcing code style with ESLint
* Running a mock backend with JSON Server

## Routes

The app includes the following routes:

* `/` shows the anecdote list
* `/create` shows the anecdote creation form
* `/about` shows information about the application

## Architecture

The frontend is organized into three main layers:

* `src/App.jsx` defines the application shell and routes
* `src/components` contains the UI views such as the anecdote list and anecdote creation form
* `src/hooks/index.js` contains reusable stateful logic:
  * `useField` manages a single input field and exposes spreadable input props plus a reset function
  * `useAnecdotes` fetches anecdotes and exposes functions for creating and deleting them
* `src/services/anecdotes.js` contains the raw HTTP requests to the backend

This keeps routing, UI, hook logic, and server communication separate.

## Backend

The application expects a JSON Server backend to be running at:

```bash
http://localhost:3001
```

The anecdotes resource is available at:

```bash
http://localhost:3001/anecdotes
```

Start the backend with:

```bash
npm run server
```

The frontend assumes the backend exposes:

```bash
GET    /anecdotes
POST   /anecdotes
DELETE /anecdotes/:id
```

## Run the project

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

Run the backend in a separate terminal:

```bash
npm run server
```

## Available scripts

* `npm run dev` starts the Vite development server
* `npm run build` creates a production build
* `npm run preview` previews the production build locally
* `npm run lint` runs ESLint
* `npm run server` starts JSON Server on port `3001`

Built with React, Vite, React Router, JSON Server, and the Fetch API for learning purposes.
