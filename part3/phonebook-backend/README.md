# Full Stack Open - Part 3: Phonebook Backend

This project contains the **Phonebook backend** exercises from Part 3 of the Full Stack Open course.

The application provides a REST API for phonebook data backed by MongoDB Atlas.

It demonstrates:

* Building an HTTP API with **Express**
* Persisting data with **MongoDB Atlas + Mongoose**
* Parsing JSON request bodies with `express.json()`
* Logging HTTP requests with **morgan**
* Returning correct HTTP status codes (`200`, `201`, `204`, `400`, `404`)
* Basic server-side validation and error responses
* Centralized error handling middleware in Express
* Route parameters for fetching and deleting single resources
* Returning dynamic server info (entry count + request timestamp)

## Features implemented (3.1-3.22)

* `GET /api/persons` returns all phonebook entries
* `GET /info` returns phonebook size and current server time
* `GET /api/persons/:id` returns one entry by id or `404`
* `DELETE /api/persons/:id` deletes one entry and returns `204`
* `POST /api/persons` creates a new entry with a generated random id
* `PUT /api/persons/:id` updates an existing person
* Validation for create:
  * name is required
  * number is required
* Mongoose validations:
  * `name` minimum length is 3 characters
  * `number` minimum length is 8 characters
  * `number` must match format `XX-XXXX...` or `XXX-XXXX...` (custom validator)
* Request logging with morgan (`tiny` style fields)
* POST request body logging using a custom morgan token (`JSON.stringify(req.body)`)
* Frontend (Part 2 Phonebook) connected to backend via `/api/persons`
* Vite development proxy support for local frontend development (`localhost:5173 -> localhost:3001`)
* Frontend production build served by backend from `dist/`
* Data for list/single person/info routes fetched directly from MongoDB
* DB and cast/validation errors handled via Express error middleware
* ESLint configured with Airbnb style guide and warnings fixed
* Validation errors return `400` with JSON, for example:

```json
{ "error": "name must be unique" }
```

## API Base URL

```text
http://localhost:3001
```

## Deployed Application
Phonebook backend + frontend (served by backend on Render):
```text
https://full-stack-open-di4u.onrender.com
```

## Endpoints

* `GET /api/persons`
* `GET /api/persons/:id`
* `POST /api/persons`
* `PUT /api/persons/:id`
* `DELETE /api/persons/:id`
* `GET /info`

## Environment Variables

Create `.env` in backend root:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Full Stack Build (3.11)

Build frontend and copy it into backend `dist`:

```bash
cd ../../part2/phonebook
npm run build
cd ../../part3/phonebook-backend
cp -r ../../part2/phonebook/dist ./dist
```

When deployed, backend serves the built frontend and API from the same origin.

## Logging

The backend uses `morgan` middleware with a custom format that includes:

* method
* URL
* status
* response size
* response time
* POST request body (for `POST` requests only)

## Run the project

Install dependencies:

```bash
npm install
```

Set MongoDB connection string in `.env` (backend root):

```env
MONGODB_URI=mongodb_connection_string
```

Start production-style backend server:

```bash
npm start
```

Start development server (auto-restart on file changes):

```bash
npm run dev
```

## Command-line database tool (3.12)

`mongo.js` uses password as command-line argument (not `.env`):

List all entries:

```bash
node mongo.js <db_password>
```

Add a new entry:

```bash
node mongo.js <db_password> "Anna" "040-1234556"
```

## Testing with VS Code REST Client

Request files are included in `requests/`:

* `requests/get_all_persons.rest`
* `requests/get_info.rest`
* `requests/get_person_by_id.rest`
* `requests/create_person.rest`
* `requests/create_person_errors.rest`
* `requests/update_person_number.rest`
* `requests/delete_person.rest`

Open any `.rest` file in VS Code and click **Send Request** above a request block.
