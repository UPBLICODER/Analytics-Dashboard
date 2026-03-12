# Analytics Dashboard Challenge

This repository implements the Vigility full‑stack challenge described in the
attached PDF. It consists of a Node/Express backend with Prisma (SQLite) and a
React/Vite frontend.

## Features implemented

- User registration and login with JWT
- Tracking of feature interactions
- Filterable analytics with age/gender/date range
- Bar and line charts using chart.js
- Cookies remember selected filters
- Seed script populates database with dummy data
- Protected API endpoints via auth middleware
- Basic login page and routing with react-router

## Getting started (local)

### Backend

```powershell
cd backend
npm install
# create SQLite database and run migrations
npx prisma migrate dev --name init
# seed with sample data
npm run seed
# run API server
npm start
```

By default the server listens on port 5000. You can set `PORT` and
`JWT_SECRET` via environment variables (create a `.env` file if desired).

### Frontend

```powershell
cd "frontend"
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default and proxies API calls
to the backend.

### Authentication

- Register a new user via `POST /api/auth/register` with JSON
  `{ username, password, age, gender }`.
- Login via the UI or `POST /api/auth/login` to obtain a JWT.
- The token is stored in `localStorage` and sent automatically on API calls.

### Filters & cookies

The dashboard maintains the last selected age, gender and date range in
cookies. Reloading the page restores the filters.

### Seeding

`npm run seed` in the `backend` folder creates 20 users and 100 random
feature clicks across the past 10 days.

### Architecture notes

For a production deployment you would switch SQLite to PostgreSQL and
securely manage environment variables. The `/track` and `/analytics`
endpoints are protected using a simple JWT middleware.

### Scaling (essay)

To handle 1 million write events per minute, the backend would need to be
re-architected for write throughput:

1. Add a message queue (Kafka, RabbitMQ) to buffer incoming track events and
   decouple writes from the API layer.
2. Use a write-optimized datastore (Cassandra, DynamoDB, or a time-series
   database) partitioned/sharded by time or user.
3. Batch writes or perform asynchronous ingestion to reduce per-event overhead.
4. Maintain pre-aggregated counts in a fast key-value cache such as Redis to
   serve analytics queries without scanning the entire clicks table.
5. Horizontally scale API servers behind a load balancer and ensure the
   database layer is clustered.

These changes would allow smoothing of spike loads and ensure near-real-time
analytics while keeping the API responsive.

## Deployment

You can deploy the backend to platforms such as Heroku/Render/Railway and
the frontend to Netlify or Vercel. Ensure you configure appropriate
environment variables and use PostgreSQL in production.

## Next steps

- Improve UI styling and responsiveness (currently inline styles)
- Add more comprehensive error/loading states
- Implement registration and account management on frontend
- Add tests for both frontend and backend
