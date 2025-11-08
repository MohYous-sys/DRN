const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get statistics
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Get total donations (sum of all Amount values)
    const totalDonationsResult = await conn.query(
      'SELECT COALESCE(SUM(Amount), 0) as total FROM Donations WHERE Amount IS NOT NULL'
    );
    const totalDonations = Number(totalDonationsResult[0].total) || 0;
    
    // Get number of supplies (sum of Supplies array lengths)
    let numberOfSupplies = 0;
    try {
      const suppliesResult = await conn.query(
        'SELECT COALESCE(SUM(JSON_LENGTH(Supplies)), 0) as total FROM Donations WHERE Supplies IS NOT NULL AND JSON_VALID(Supplies)'
      );
      numberOfSupplies = Number(suppliesResult[0].total) || 0;
    } catch (e) {
      // Fallback
      const donationsResult = await conn.query('SELECT Supplies FROM Donations WHERE Supplies IS NOT NULL');
      donationsResult.forEach(donation => {
        if (donation.Supplies) {
          try {
            let supplies = [];
            if (typeof donation.Supplies === 'string') {
              supplies = JSON.parse(donation.Supplies);
            } else if (Array.isArray(donation.Supplies)) {
              supplies = donation.Supplies;
            }
            numberOfSupplies += supplies.length;
          } catch (parseError) {
            // Skip invalid JSON
          }
        }
      });
    }
    
    // Get number of unique donors (users who have at least one donation)
    const donorsResult = await conn.query(
      'SELECT COUNT(DISTINCT Donor) as donors FROM Donations WHERE Donor IS NOT NULL'
    );
    const donors = Number(donorsResult[0].donors) || 0;
    
    // Get number of active campaigns
    const campaignsResult = await conn.query('SELECT COUNT(*) as campaigns FROM Campaigns');
    const activeCampaigns = Number(campaignsResult[0].campaigns) || 0;
    
    res.json({
      totalDonations: totalDonations,
      numberOfSupplies: numberOfSupplies,
      donors: donors,
      activeCampaigns: activeCampaigns
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;

