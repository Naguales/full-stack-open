# Full Stack Open - Part 5: Blog List Frontend

This project contains the **Blog List Frontend** exercises from Part 5 of the Full Stack Open course.

The application allows users to:

* Fetch blogs from the backend
* Log in with a username and password
* Keep the login session in local storage
* Log out and clear persisted session data
* Add new blogs while logged in
* Navigate between routed blog list, login, blog details, and blog creation views
* Open a dedicated single-blog view from the blog list
* Like blog posts
* Delete blog posts they created
* See blogs sorted by likes
* See success and error notifications for user actions
* Run component tests for blog rendering and blog creation form behavior

It demonstrates:

* Managing and updating React state
* Conditional rendering based on authentication state
* Fetching data from a server using **axios**
* Creating, updating, and deleting blog data via HTTP `POST`, `PUT`, and `DELETE`
* Sending authenticated requests with a bearer token
* Persisting login state with `localStorage`
* Using `useEffect` for data fetching and restoring session state
* Client-side routing with `react-router-dom`
* Controlled form inputs
* Component-local state for blog form inputs and blog detail visibility
* Rendering dynamic lists
* Sorting derived state by likes
* Splitting UI into reusable components
* Configuring a Vite development proxy for backend requests
* Enforcing code style with ESLint
* Testing React components with Vitest and Testing Library

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

* The root route `/` shows the list of all blogs
* The `/login` route shows the login form
* The `/blogs/:id` route shows a single blog view
* The `/blogs/new` route shows the blog creation form for logged-in users
* Creating a blog redirects back to the all blogs view
* Deleting a blog redirects back to the all blogs view
* The `remove` button is shown only for blogs created by the logged-in user
* The `like` button is shown only to logged-in users
* Blogs are kept sorted in descending order by like count

## Testing

The frontend includes component tests for:

* The default collapsed blog view
* Showing blog details after clicking `view`
* Calling the like handler twice when the like button is clicked twice
* Submitting the new blog form with the correct title, author, and URL

Run the tests with:

```bash
# Run the test suite
npm run test

# Run the test suite with coverage
npm test -- --coverage
```

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

* `npm run dev` starts the Vite development server
* `npm run build` creates a production build
* `npm run preview` previews the production build locally
* `npm run lint` runs ESLint
* `npm run test` runs the Vitest test suite
* `npm test -- --coverage` runs the test suite and prints coverage results

Use only one test command at a time:

* `npm run test` for a normal test run
* `npm test -- --coverage` when you want coverage output

Built with React, Vite, Vitest, Testing Library, and Axios for learning purposes.
