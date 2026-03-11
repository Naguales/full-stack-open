# Full Stack Open - Part 4: Blog List Backend

This project contains the **Blog List backend** exercises from Part 4 of the Full Stack Open course.

The application provides a REST API for blogs backed by MongoDB via Mongoose, and includes unit-tested helper functions for blog list analytics.

It demonstrates:

* Building an HTTP API with **Express**
* Persisting blog data with **MongoDB + Mongoose**
* Organizing backend code with `app.js`, `index.js`, `controllers`, `models`, and `utils`
* JSON request parsing with `express.json()`
* Centralized request/error middleware
* Unit testing with Node's built-in test runner (`node:test`)

## Exercises implemented

* **4.1-4.2**
  * `GET /api/blogs` returns all blogs
  * `POST /api/blogs` creates a new blog (`201 Created`)
  * Project structured using best-practice module layout
* **4.3-4.7**
  * `utils/list_helper.js` functions:
    * `dummy`
    * `totalLikes`
    * `favoriteBlog`
    * `mostBlogs`
    * `mostLikes`
  * Unit tests in `tests/list_helper.test.js`

## Project structure

```text
├── controllers
│   └── blogs.js
├── models
│   └── blog.js
├── tests
│   └── list_helper.test.js
├── utils
│   ├── config.js
│   ├── list_helper.js
│   ├── logger.js
│   └── middleware.js
├── app.js
├── index.js
├── package-lock.json
├── package.json
```

## API Base URL

```text
http://localhost:3003
```

## Endpoints

* `GET /api/blogs`
* `POST /api/blogs`

Example `POST /api/blogs` body:

```json
{
  "title": "Full Stack Open",
  "author": "University of Helsinki",
  "url": "https://fullstackopen.com",
  "likes": 10
}
```

## Environment variables

Create `.env` in project root (optional if using defaults):

```env
MONGODB_URI=mongodb_connection_string
PORT=3003
```

## Run the project

Install dependencies:

```bash
npm install
```

Start server:

```bash
npm start
```

Start development server (watch mode):

```bash
npm run dev
```

## Linting

Check lint rules:

```bash
npm run lint
```

Automatically fix fixable lint issues:

```bash
npm run lint:fix
```

## Run tests (4.3-4.7)

```bash
npm test
```

The tests cover all helper functions in `utils/list_helper.js`.
