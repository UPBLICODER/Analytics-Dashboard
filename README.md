# Product Analytics Dashboard Challenge

---

## Repository
- [GitHub Repository](https://github.com/UPBLICODER/Analytics-Dashboard) <!-- UPDATE with your repo link -->

## Live Demo
- [Try it online](https://analyticsdashboard-sigma.vercel.app/)

---

## Features Implemented

- User registration and login with JWT
- Tracking of feature interactions
- Filterable analytics by age/gender/date range
- Bar and line charts using Chart.js
- Cookies remember selected filters
- Seed script populates database with dummy data
- Protected API endpoints via auth middleware
- Basic login page and routing with React Router

---
### Test User

You can use the following test user to log in to the dashboard:

- **Username:** test  
- **Password:** test@12

---
## Getting Started (Local)

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

> The server listens on port 5000 by default. You can set `PORT` and `JWT_SECRET` via environment variables (create a `.env` file if desired).

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

> The frontend runs on `http://localhost:5173` by default and proxies API calls to the backend.

---

## Authentication

- Register a new user via `POST /api/auth/register` with JSON:  
  `{ "username", "password", "age", "gender" }`  
- Login via the UI or `POST /api/auth/login` to obtain a JWT  
- Token is stored in `localStorage` and sent automatically on API calls

---

## Filters & Cookies

The dashboard maintains the last selected age, gender, and date range in cookies. Reloading the page restores these filters.

---

## Seeding the Database

Run `npm run seed` in the backend folder. This generates:  

- 20 sample users  
- 100 random feature interactions across the past 10 days  

---

## Architecture Choices

- **Backend:** Node.js + Express for REST API, Prisma ORM with SQLite (PostgreSQL recommended for production)  
- **Frontend:** React + Vite, Chart.js for visualization  
- **Auth:** JWT tokens, protected API routes  
- **State Management:** Cookies for persisting dashboard filters  
- **Routing:** React Router for page navigation  

> In production, environment variables would be securely managed, and the database would scale with PostgreSQL or another robust SQL/NoSQL solution.

---

### Short Essay: Scaling for 1 Million Write Events per Minute

If this dashboard needed to handle 1 million write events per minute, the backend would need to handle a large number of requests efficiently.  

Some basic approaches would be:  

- Use multiple servers or a **load balancer** to handle high traffic.  
- Store data in a **fast database** that can manage many writes at once.  
- Use **caching** to quickly provide analytics without reading all the data every time.  

> This ensures the dashboard remains responsive even with a lot of users.

---

## Deployment Notes

- **Backend:** Deployed on Render at `https://analytics-dashboard-c0x7.onrender.com`  
- **Frontend:** Deployed on Vercel at `https://analyticsdashboard-sigma.vercel.app/`  
- Ensure environment variables like `JWT_SECRET` are set for production  
- SQLite is used for development; PostgreSQL is recommended for production

---

## Next Steps / Improvements

- Improve UI styling and responsiveness  
- Add comprehensive error/loading states  
- Implement frontend registration & account management  
- Add tests for both frontend and backend
