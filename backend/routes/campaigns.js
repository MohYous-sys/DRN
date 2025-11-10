const express = require('express');
const router = express.Router();
const pool = require('../db');
const { login_required, admin_required } = require('../middleware');

// Helper function to format date to YYYY-MM-DD for database
function formatDateForDB(dateValue) {
  if (!dateValue) return null;
  
  // If it's already in YYYY-MM-DD format, return as is
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // Handle ISO date strings (e.g., "2022-12-21T20:00:00.000Z")
  if (typeof dateValue === 'string') {
    // Extract date part before 'T' or space
    const dateMatch = dateValue.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      return dateMatch[1];
    }
  }
  
  // If it's a Date object, format it
  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Fallback: try to parse as date and format
  try {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  return dateValue;
}

// Helper to ensure Due is returned as a YYYY-MM-DD string in API responses
function formatDueForResponse(due) {
  if (!due) return due;
  if (due instanceof Date) {
    return formatDateForDB(due);
  }
  const str = String(due);
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : str;
}

// Get all campaigns
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    // Get only active (non-deleted) campaigns with count of unique donators
    const rows = await conn.query(`
      SELECT 
        c.*,
        COALESCE(COUNT(DISTINCT d.Donor), 0) as numberOfDonators
      FROM Campaigns c
      LEFT JOIN Donations d ON c.ID = d.CampaignID
      WHERE c.isDeleted = 0 OR c.isDeleted IS NULL
      GROUP BY c.ID
      ORDER BY c.ID
    `);
    
    // Format the response - convert numberOfDonators to number and ensure Due is a string
    const campaigns = rows.map(campaign => ({
      ...campaign,
      numberOfDonators: Number(campaign.numberOfDonators) || 0,
      // Ensure Due date is always returned as a string in YYYY-MM-DD format
      Due: formatDueForResponse(campaign.Due)
    }));
    
    res.json(campaigns);
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
    // Format the date to YYYY-MM-DD format for the database
    const formattedDue = formatDateForDB(Due);
    // CurrentAmount defaults to 0.00 for new campaigns, isDeleted defaults to 0
    const result = await conn.query('INSERT INTO Campaigns (Title, Location, Urgency, Description, Image, Goal, CurrentAmount, Due, isDeleted) VALUES (?, ?, ?, ?, ?, ?, 0.00, ?, 0)', [Title, Location, Urgency, Description, Image, Goal, formattedDue]);
    res.status(201).json({ 
      id: Number(result.insertId), 
      ...req.body,
      Due: formatDueForResponse(formattedDue), // Ensure Due is always returned as YYYY-MM-DD string
      CurrentAmount: 0.00,
      isDeleted: 0
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
    // Format the date to YYYY-MM-DD format for the database
    const formattedDue = formatDateForDB(Due);
    // Note: CurrentAmount and isDeleted are not updated here - CurrentAmount is automatically managed by donations, isDeleted is managed by delete endpoint
    const result = await conn.query(
      'UPDATE Campaigns SET Title = ?, Location = ?, Urgency = ?, Description = ?, Image = ?, Goal = ?, Due = ? WHERE ID = ? AND (isDeleted = 0 OR isDeleted IS NULL)',
      [Title, Location, Urgency, Description, Image, Goal, formattedDue, id]
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

// Delete a campaign (Admin only) - Soft delete: marks campaign as deleted but keeps donations
router.delete('/:id', admin_required, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    // Soft delete: mark campaign as deleted instead of actually deleting it
    // This preserves all donations, stats, and top donators data
    const result = await conn.query(
      'UPDATE Campaigns SET isDeleted = 1 WHERE ID = ? AND (isDeleted = 0 OR isDeleted IS NULL)',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Campaign not found or already deleted.' });
    }

    res.status(200).json({ message: 'Campaign deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
