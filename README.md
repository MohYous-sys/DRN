# Disaster Response Network (DRN)

Full-stack web application for managing disaster relief campaigns, donations, and donor tracking.

## Tech Stack

**Frontend:** React , TypeScript, Vite, Tailwind CSS  
**Backend:** Node.js, Express, MariaDB  
**Auth:** Session-based (express-session, bcrypt)

## Prerequisites

- Node.js
- MariaDB (port 8800)
- npm

## Quick Start

### Database Setup

Create the database and user using HeidiSQL (or any MariaDB client). The backend automatically initializes the schema via `backend/database.js` on first run.

### Environment Configuration

Create `backend/.env` with database credentials and server configuration. Refer to `backend/db.js` and `backend/index.js` for required variables.

### Running the System

```powershell
.\start-dev.ps1
```

The script installs dependencies and starts both backend and frontend servers. The backend automatically initializes the database schema (`backend/database.js`) on first run.

## Server URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Base: http://localhost:3001/api

## Project Structure

```
.
├── backend/              # Express server
│   ├── routes/          # API endpoints
│   ├── database.js      # Schema initialization
│   └── .env            # Backend configuration
├── src/                 # React frontend
│   ├── components/     # UI components
│   └── api/           # API client
└── start-dev.ps1       # Development startup script
```

## Key Features

- **Campaigns:** CRUD operations with soft delete (preserves donation history)
- **Donations:** Transaction-based creation with automatic campaign amount updates
- **Authentication:** Session-based with admin/user roles
- **Statistics:** Real-time aggregation (total donations, supplies, donors, campaigns)
- **Top Donators:** Leaderboard with total donation amounts

## API Documentation

- **[API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - Complete API reference
- **[RESPONSE_CODES.md](./backend/RESPONSE_CODES.md)** - HTTP status codes reference

## Notes

- Campaign deletion is soft delete (preserves stats and donations)
- All campaign `Due` dates returned as `YYYY-MM-DD` strings
- CORS configured for `localhost:5173` with credentials
- Vite proxy handles `/api/*` requests to backend
