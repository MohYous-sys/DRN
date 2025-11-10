const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

const saltRounds = 10;

// Register a new user
router.post('/register', async (req, res) => {
  const { Username, Password } = req.body;

  if (Username.toLowerCase() === 'admin') {
    return res.status(403).json({ error: 'The username \'admin\' is reserved.' });
  }

    let conn;
  try {
    const hash = await bcrypt.hash(Password, saltRounds);
    conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO Users (Username, Password) VALUES (?, ?)', [Username, hash]);
    res.status(201).json({ id: Number(result.insertId), Username });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username already exists.' });
    }
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});


// User Login
router.post('/login', async (req, res) => {
  const { Username, Password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const users = await conn.query('SELECT * FROM Users WHERE Username = ?', [Username]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(Password, user.Password);

    if (match) {
      // Passwords match, create session
      req.session.user = {
        id: user.ID,
        username: user.Username,
        isAdmin: user.Username.toLowerCase() === 'admin'
      };
      res.status(200).json({ message: 'Login successful.', user: req.session.user });
    } else {
      // Passwords do not match
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Check Session Status
router.get('/status', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

// User Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid'); // The default session cookie name
    res.status(200).json({ message: 'Logout successful.' });
  });
});

module.exports = router;
