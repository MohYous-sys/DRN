const express = require('express');
const router = express.Router();
const pool = require('../db');
const { login_required } = require('../middleware');

// Get all donations
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    // Join with Users table to get donor username
    const rows = await conn.query(`
      SELECT 
        d.*,
        u.Username as DonorUsername
      FROM Donations d
      LEFT JOIN Users u ON d.Donor = u.ID
      ORDER BY d.ID DESC
    `);
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
        Supplies: supplies,
        // Include both Donor (ID) and DonorUsername for backward compatibility
        DonorUsername: donation.DonorUsername || 'Anonymous'
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
    
    // Verify that the campaign exists and is not deleted
    const campaignCheck = await conn.query('SELECT ID FROM Campaigns WHERE ID = ? AND (isDeleted = 0 OR isDeleted IS NULL)', [CampaignID]);
    if (campaignCheck.length === 0) {
      return res.status(404).json({ error: 'Campaign not found or has been deleted.' });
    }
    
    // Start a transaction to ensure both donation and campaign update succeed or fail together
    await conn.beginTransaction();
    
    try {
      // Store Supplies as JSON array
      const result = await conn.query('INSERT INTO Donations (Amount, Supplies, Donor, CampaignID) VALUES (?, ?, ?, ?)', 
        [Amount, JSON.stringify(suppliesArray), Donor, CampaignID]);
      
      // Update the campaign's CurrentAmount by adding the donation amount
      await conn.query(
        'UPDATE Campaigns SET CurrentAmount = COALESCE(CurrentAmount, 0) + ? WHERE ID = ?',
        [Amount, CampaignID]
      );
      
      // Commit the transaction
      await conn.commit();
      
      res.status(201).json({ 
        id: Number(result.insertId), 
        Amount, 
        Supplies: suppliesArray, 
        Donor, 
        CampaignID 
      });
    } catch (err) {
      // Rollback the transaction on error
      await conn.rollback();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Get top donators
router.get('/top-donators', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    // Get users with their total donation amounts, ordered by total descending
    const rows = await conn.query(`
      SELECT 
        u.Username as donatorName,
        COALESCE(SUM(d.Amount), 0) as totalAmount
      FROM Users u
      INNER JOIN Donations d ON u.ID = d.Donor
      GROUP BY u.ID, u.Username
      ORDER BY totalAmount DESC
    `);
    
    // Format the response
    const topDonators = rows.map(row => ({
      donatorName: row.donatorName,
      totalAmount: Number(row.totalAmount) || 0
    }));
    
    res.json(topDonators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
