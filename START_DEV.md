# Development Server Setup

This project consists of a backend server (Node.js/Express) and a frontend server (React/Vite). This guide explains how to run both servers together.

## Quick Start

### Option 1: PowerShell Script (Recommended for Windows)

Run the PowerShell script from the project root:

```powershell
.\start-dev.ps1
```

This will:
- Check for Node.js and npm
- Install dependencies if needed
- Start the backend server on port 3001
- Start the frontend server on port 5173
- Display output from both servers

Press `Ctrl+C` to stop both servers.

### Option 2: Batch Script (Windows)

Run the batch script from the project root:

```cmd
start-dev.bat
```

This will open two separate command windows:
- One for the backend server (port 3001)
- One for the frontend server (port 5173)

Close the windows to stop the servers.

### Option 3: Manual Start

Start each server manually in separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Option 4: Using Concurrently (Cross-platform)

First, install `concurrently` as a dev dependency:

```bash
npm install --save-dev concurrently
```

Then update `package.json` scripts to:

```json
"scripts": {
  "dev:all": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" --names \"BACKEND,FRONTEND\" --prefix name --prefix-colors \"blue,magenta\""
}
```

Run with:
```bash
npm run dev:all
```

## Server URLs

- **Backend API**: http://localhost:3001
- **Frontend App**: http://localhost:5173

## CORS and Cookies Configuration

The setup is configured to handle CORS and cookies properly:

1. **Vite Proxy**: The frontend Vite server proxies all `/api/*` requests to the backend server. This eliminates CORS issues during development.

2. **Backend CORS**: The backend is configured to accept requests from `http://localhost:5173` with credentials enabled.

3. **Cookies**: 
   - Backend sessions use cookies with `httpOnly`, `sameSite: 'lax'`, and `secure: false` for local development
   - Frontend API calls use `credentials: 'include'` to send cookies with requests

## Environment Variables

### Backend (.env in backend folder)

Create a `backend/.env` file with:

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (.env in root folder)

Create a `.env` file in the root folder if you want to override the API base URL:

```env
VITE_API_BASE=http://localhost:3001
```

**Note**: With the Vite proxy configuration, you typically don't need to set `VITE_API_BASE` as requests to `/api/*` are automatically proxied to the backend.

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use:

1. **Backend**: Set `PORT` in `backend/.env` to a different port
2. **Frontend**: Update `vite.config.ts` server port and backend proxy target

### Cookies Not Working

1. Ensure `credentials: 'include'` is set in all fetch requests
2. Check that backend CORS has `credentials: true`
3. Verify cookie settings in `backend/index.js` session configuration
4. Make sure you're accessing the frontend at `http://localhost:5173` (not `127.0.0.1`)

### CORS Errors

1. Verify the Vite proxy is working (check browser network tab)
2. Ensure backend CORS origin matches frontend URL
3. Check that `CLIENT_ORIGIN` in backend `.env` is correct

## Project Structure

```
.
├── backend/          # Backend server (Express, Node.js)
│   ├── index.js     # Main server file
│   ├── routes/      # API routes
│   └── sessions/    # Session storage
├── src/             # Frontend source (React, TypeScript)
├── start-dev.ps1    # PowerShell script to run both servers
├── start-dev.bat    # Batch script to run both servers
└── vite.config.ts   # Vite configuration with proxy
```

