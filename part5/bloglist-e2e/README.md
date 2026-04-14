# Bloglist E2E Tests

Playwright end-to-end tests for the Full Stack Open blog list app.

## Run

Start the backend in test mode:

```bash
cd ../part4/bloglist-backend
npm run dev:test
```

Start the frontend:

```bash
cd ../bloglist-frontend
npm run dev
```

Run the tests:

```bash
npm test
```

## Notes

- Frontend runs at `http://localhost:5173`
- Backend runs at `http://localhost:3003`
- Tests use `POST /api/testing/reset` before each test

Run one test only:

```bash
npx playwright test -g "Login form is shown" --project=chromium
```
