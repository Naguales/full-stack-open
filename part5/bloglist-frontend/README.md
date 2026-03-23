# Full Stack Open - Part 5: Blog List Frontend

This project contains the **Blog List Frontend** exercises from Part 5 of the Full Stack Open course.

The application allows users to:

* Fetch blogs from the backend
* Log in with a username and password
* Keep the login session in local storage
* Log out and clear persisted session data
* Add new blogs while logged in
* See success and error notifications for user actions

It demonstrates:

* Managing and updating React state
* Conditional rendering based on authentication state
* Fetching data from a server using **axios**
* Sending authenticated requests with a bearer token
* Persisting login state with `localStorage`
* Using `useEffect` for data fetching and restoring session state
* Controlled form inputs
* Rendering dynamic lists
* Splitting UI into reusable components
* Configuring a Vite development proxy for backend requests

## Notifications

The app uses a notification component to show feedback at the top of the page.

Notification types:

* `success` for successful operations
* `error` for failed operations such as invalid login or failed blog creation
* `info` and `warning` styles are available for future use

Behavior:

* Notifications are shown in the UI and automatically disappear after 5 seconds

## Backend

The application expects the blog list backend to be running at:

```bash
http://localhost:3003
```

Frontend requests are sent through the Vite proxy, so the frontend uses paths like:

```bash
/api/blogs
/api/login
```

The proxy forwards them to the backend server.

Start the backend separately before running the frontend.

## Run the project

```bash
npm install
npm run dev
```

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Built with React, Vite, and Axios for learning purposes.
