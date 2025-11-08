const express = require('express');
const router = express.Router();
const pool = require('../db');
const { login_required } = require('../middleware');

// Get all donations
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Donations');
    // Parse Supplies from JSON to array
    const donations = rows.map(donation => {
      let supplies = [];
      if (donation.Supplies) {
        if (typeof donation.Supplies === 'string') {
          try {
            supplies = JSON.parse(donation.Supplies);
          } catch (e) {
            // If parsing fails, treat as empty array (backward compatibility)
            supplies = [];
          }
        } else if (Array.isArray(donation.Supplies)) {
          supplies = donation.Supplies;
        }
      }
      return {
        ...donation,
        Supplies: supplies
      };
    });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Create a new donation
router.post('/', login_required, async (req, res) => {
  const { Amount, Supplies, CampaignID } = req.body;
  
  // Get donor ID from session (user must be logged in)
  if (!req.session || !req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  
  const Donor = req.session.user.id;
  
  // Validate required fields
  if (!Amount || Amount <= 0) {
    return res.status(400).json({ error: 'Amount is required and must be greater than 0.' });
  }
  
  if (!CampaignID) {
    return res.status(400).json({ error: 'CampaignID is required.' });
  }
  
  // Ensure Supplies is an array
  const suppliesArray = Array.isArray(Supplies) ? Supplies : (Supplies ? [Supplies] : []);
  
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Verify that the campaign exists
    const campaignCheck = await conn.query('SELECT ID FROM Campaigns WHERE ID = ?', [CampaignID]);
    if (campaignCheck.length === 0) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }
    
    // Store Supplies as JSON array
    const result = await conn.query('INSERT INTO Donations (Amount, Supplies, Donor, CampaignID) VALUES (?, ?, ?, ?)', 
      [Amount, JSON.stringify(suppliesArray), Donor, CampaignID]);
    
    res.status(201).json({ 
      id: Number(result.insertId), 
      Amount, 
      Supplies: suppliesArray, 
      Donor, 
      CampaignID 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
