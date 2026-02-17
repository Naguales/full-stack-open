# Full Stack Open – Part 2: Phonebook

This project contains the **Phonebook** exercises from Part 2 of the Full Stack Open course.

The application allows users to:

* Fetch initial phonebook data from a backend server
* Prevent duplicate entries (case-insensitive)
* Add new people and persist them to the backend
* Delete people from the backend with a per-entry delete button and confirmation
* Update an existing person's number via HTTP `PUT` after confirmation
* Filter the list of people by name
* Show typed notifications for user actions and validation feedback

It demonstrates:

* Managing and updating React state
* Fetching data from a server using **axios**
* Creating, updating, and deleting data via HTTP `POST`, `PUT`, and `DELETE`
* Using `useEffect` for side effects
* Using `useRef` + cleanup to safely manage notification timeouts
* Controlled form inputs
* Form validation and user feedback
* Rendering dynamic lists
* Deriving filtered data from state
* Splitting UI into reusable components

## Notifications

The app uses a centralized notification system instead of browser alerts for most feedback.

Notification types:

* `success` for successful operations
* `error` for failed server operations
* `info` for missing required form input
* `warning` for non-failing conflicts

Behavior:

* Notifications are shown in the UI and automatically disappear after ~3 seconds
* A single active timeout is tracked with `useRef` to prevent overlapping timers
* Timeout cleanup runs on component unmount to avoid stale updates

Stale data handling:

* If a person is deleted elsewhere and an update/delete fails, the app shows an error notification and removes stale local data from state

## Backend

The application expects a JSON server running at:

```
http://localhost:3001/persons
```

Start the backend separately:

```bash
npm run server
```

## Run the project

```bash
npm install
npm run dev
```

Built with React and Vite for learning purposes.
