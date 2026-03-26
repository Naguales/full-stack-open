# Full Stack Open - Part 5: Blog List Frontend

This project contains the **Blog List Frontend** exercises from Part 5 of the Full Stack Open course.

The application allows users to:

* Fetch blogs from the backend
* Log in with a username and password
* Keep the login session in local storage
* Log out and clear persisted session data
* Add new blogs while logged in
* Open and close blog details per blog entry
* Like blog posts
* Delete blog posts they created
* See blogs sorted by likes
* See success and error notifications for user actions

It demonstrates:

* Managing and updating React state
* Conditional rendering based on authentication state
* Fetching data from a server using **axios**
* Creating, updating, and deleting blog data via HTTP `POST`, `PUT`, and `DELETE`
* Sending authenticated requests with a bearer token
* Persisting login state with `localStorage`
* Using `useEffect` for data fetching and restoring session state
* Controlled form inputs
* Component-local state for blog form inputs and blog detail visibility
* Rendering dynamic lists
* Sorting derived state by likes
* Splitting UI into reusable components
* Configuring a Vite development proxy for backend requests
* Enforcing code style with ESLint

## Notifications

The app uses a notification component to show feedback at the top of the page.

Notification types:

* `success` for successful operations such as login, blog creation, and deletion
* `error` for failed operations such as invalid login, failed likes, invalid ownership, or failed deletion
* `info` and `warning` styles are available for future use

Behavior:

* Notifications are shown in the UI and automatically disappear after 5 seconds

## Blog List Behavior

The blog list includes the following UI behavior:

* The create form is hidden by default and can be toggled open
* The create form closes after a successful submission or when cancelled
* Each blog entry has its own `view` or `hide` toggle for details
* The `remove` button is shown only for blogs created by the logged-in user
* Blogs are kept sorted in descending order by like count

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

The frontend assumes the backend exposes:

```bash
GET    /api/blogs
POST   /api/blogs
PUT    /api/blogs/:id
DELETE /api/blogs/:id
POST   /api/login
```

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
