require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());

// Session Middleware
app.use(session({
  store: new FileStore({ path: './sessions', ttl: 86400, retries: 0 }),
  secret: 'a secret key to sign the cookie',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax', 
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    path: '/' // Ensure cookies are sent for all paths
  }
}));

const pool = require('./db');

// Test DB connection
async function testDbConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Successfully connected to the database.');
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

testDbConnection();

// API Routes
const campaignsRouter = require('./routes/campaigns');
const usersRouter = require('./routes/users');
const donationsRouter = require('./routes/donations');
const statsRouter = require('./routes/stats');
app.use('/api/campaigns', campaignsRouter);
app.use('/api/users', usersRouter);
app.use('/api/donations', donationsRouter);
app.use('/api/stats', statsRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('DRN Backend is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
