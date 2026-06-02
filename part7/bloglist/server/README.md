# Server

This directory contains the Express backend for the Blog App.

## Responsibilities

- REST API for blogs, users, and login
- JWT-based authentication
- MongoDB persistence via Mongoose
- Serving the built frontend in production

## Main Endpoints

- `GET /api/blogs`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`
- `POST /api/blogs/:id/comments`
- `GET /api/users`
- `POST /api/users`
- `POST /api/login`

## Environment Variables

Create `server/.env` with:

```env
MONGODB_URI=mongodb+srv://user:password@mongodb-cluster-url/bloglist?retryWrites=true&w=majority&appName=Cluster0
TEST_MONGODB_URI=mongodb+srv://user:password@mongodb-test-cluster-url/bloglist-test?retryWrites=true&w=majority&appName=Cluster0
PORT=3003
```

Notes:

- Do not wrap the values in quotes.
- `MONGODB_URI` should point to the main application database.
- `TEST_MONGODB_URI` should point to a separate test database.
- `PORT=3003` is a normal plain integer assignment in `.env`.

## Scripts

Run from `server/`:

```bash
npm install
npm run dev
npm start
npm test
```

Available scripts:

- `npm run dev` starts the backend in watch mode
- `npm start` starts the backend normally
- `npm run dev:test` starts the backend in test mode
- `npm test` runs backend tests
- `npm run lint` checks backend lint rules
- `npm run lint:fix` fixes backend lint issues when possible

## Project Structure

```text
server/
├── controllers/
├── models/
├── tests/
├── utils/
├── app.js
├── index.js
└── package.json
```

## Notes

- Backend tests require a working MongoDB test database.
- In production, the backend serves the built frontend from `../client/dist`.
