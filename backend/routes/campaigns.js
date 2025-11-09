const express = require('express');
const router = express.Router();
const pool = require('../db');
const { login_required, admin_required } = require('../middleware');

// Get all campaigns
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Campaigns');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Create a new campaign
router.post('/', login_required, async (req, res) => {
  const { Title, Location, Urgency, Description, Image, Goal, Due } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    // CurrentAmount defaults to 0.00 for new campaigns
    const result = await conn.query('INSERT INTO Campaigns (Title, Location, Urgency, Description, Image, Goal, CurrentAmount, Due) VALUES (?, ?, ?, ?, ?, ?, 0.00, ?)', [Title, Location, Urgency, Description, Image, Goal, Due]);
    res.status(201).json({ 
      id: Number(result.insertId), 
      ...req.body,
      CurrentAmount: 0.00
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Update a campaign (Admin only)
router.post('/:id', admin_required, async (req, res) => {
  const { id } = req.params;
  const { Title, Location, Urgency, Description, Image, Goal, Due } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    // Note: CurrentAmount is not updated here - it's automatically managed by donations
    const result = await conn.query(
      'UPDATE Campaigns SET Title = ?, Location = ?, Urgency = ?, Description = ?, Image = ?, Goal = ?, Due = ? WHERE ID = ?',
      [Title, Location, Urgency, Description, Image, Goal, Due, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    res.status(200).json({ message: 'Campaign updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Delete a campaign (Admin only)
router.delete('/:id', admin_required, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM Campaigns WHERE ID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    res.status(200).json({ message: 'Campaign deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
