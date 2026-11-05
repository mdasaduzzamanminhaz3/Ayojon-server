# Ayojon Backend

Ayojon Backend is the REST API for the Ayojon event platform. It is
built with Node.js, Express, and MongoDB and provides endpoints for
events, event categories, and event registrations.

## Features

-   Create, retrieve, update, and delete events
-   Retrieve upcoming and past events
-   Retrieve events created by a particular user
-   Create and retrieve event categories
-   Join events
-   Retrieve and cancel joined-event records
-   MongoDB persistence

## Tech Stack

-   Node.js
-   Express
-   MongoDB
-   MongoDB Node.js Driver
-   CORS
-   dotenv

## Getting Started

### Prerequisites

-   Node.js (use a current LTS release)
-   npm
-   A MongoDB database (local MongoDB or MongoDB Atlas)

### 1. Clone the repository

``` bash
git clone <your-backend-repository-url>
cd <backend-project-folder>
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend project root:

``` env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
```

Replace the MongoDB value with your own connection string. Never commit
`.env` files or expose database credentials.

The backend currently uses the `ayojon` database. Its main collections
are:

-   `events`
-   `events-category`
-   `joined-events`

### 4. Start the backend

Use the development command configured in your `package.json`. For
example, if your project defines a `dev` script:

``` bash
npm run dev
```

If your project defines a `start` script:

``` bash
npm start
```

The API uses port `8000` by default, unless `PORT` is configured
differently.

## API Endpoints

### Events

  Method     Endpoint              Purpose
  ---------- --------------------- -----------------------------------
  `POST`     `/event`              Create an event
  `GET`      `/events/upcoming`    Retrieve upcoming events
  `GET`      `/events/past`        Retrieve past events
  `GET`      `/event/:id`          Retrieve an event by ID
  `PATCH`    `/event/:id`          Update an event
  `DELETE`   `/event/:id`          Delete an event
  `GET`      `/my-events/:email`   Retrieve events created by a user

### Event Categories

  Method     Endpoint          Purpose
  ---------- ----------------- ---------------------------
  `GET`      `/categories`     Retrieve all categories
  `GET`      `/category/:id`   Retrieve a category by ID
  `POST`     `/category`       Create a category
  `PATCH`    `/category/:id`   Update a category
  `DELETE`   `/category/:id`   Delete a category

### Joined Events

  Method     Endpoint                  Purpose
  ---------- ------------------------- -----------------------------------
  `POST`     `/join-event`             Register a user for an event
  `GET`      `/joined-events/:email`   Retrieve joined events for a user
  `DELETE`   `/joined-events/:id`      Cancel a joined-event record

The endpoint list documents the routes used by the frontend. Confirm
each route against the current Express application before relying on it.

## Example Event Object

``` json
{
  "title": "Community Charity Program",
  "category": "Charity",
  "description": "A community event to support people in need.",
  "date": "2026-12-15",
  "time": "10:00",
  "location": "Dhaka, Bangladesh",
  "capacity": 100,
  "image": "https://example.com/event-image.jpg",
  "organizer": "Organizer Name",
  "organizerEmail": "organizer@example.com",
  "status": "upcoming",
  "createdAt": "2026-11-05T10:00:00.000Z"
}
```

## Example Category Object

``` json
{
  "name": "Charity",
  "icon": "Heart"
}
```

## Example Joined-Event Object

``` json
{
  "eventId": "EVENT_OBJECT_ID",
  "username": "Participant Name",
  "email": "participant@example.com",
  "title": "Community Charity Program",
  "category": "Charity",
  "date": "2026-12-15",
  "time": "10:00",
  "location": "Dhaka, Bangladesh",
  "joinedDate": "2026-11-05T10:00:00.000Z"
}
```

MongoDB should generate a separate `_id` for each joined-event record.
Store the original event ID in `eventId` rather than reusing the event
document's `_id`.

## Project Structure

A simplified overview:

``` text
ayojon-backend/
├── server.js
├── package.json
├── .env
└── ...
```

Update this section if you split routes, database setup, middleware, or
configuration into separate files.

## Important Backend Practices

-   Validate MongoDB ObjectIds before creating `ObjectId` instances.
-   Return appropriate HTTP status codes for invalid input, missing
    records, and server errors.
-   Validate required event fields and ensure capacity is a valid
    positive number.
-   Validate event dates on the server; frontend form validation alone
    is not sufficient.
-   Prevent duplicate registrations. A unique compound index on
    `{ eventId: 1, email: 1 }` can enforce one registration per user per
    event.
-   Verify the authenticated user's identity on the server. Do not trust
    an email address or user ID supplied only in the request body or
    URL.
-   Check event ownership before allowing an event to be edited or
    deleted.
-   Restrict CORS to the frontend's allowed origin in production.
-   Do not expose MongoDB credentials, authentication secrets, or access
    tokens in logs or responses.

## Deployment

1.  Provision a MongoDB database.
2.  Configure `MONGODB_URI` and `PORT` in the hosting provider's
    environment settings.
3.  Configure CORS to allow the deployed frontend origin.
4.  Deploy the Node.js application.
5.  Set the frontend's `NEXT_PUBLIC_API_URL` to the deployed backend
    URL.
6.  Test the event, category, and joined-event endpoints.

## License

Add your project's license information here.
