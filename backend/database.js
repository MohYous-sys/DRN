require('dotenv').config();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 5,
  port:8800,
  allowPublicKeyRetrieval: true
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
  );
`;

const createCampaignsTable = `
  CREATE TABLE IF NOT EXISTS Campaigns (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    Urgency VARCHAR(50),
    Description TEXT,
    Image VARCHAR(255),
    Goal DECIMAL(15, 2) NOT NULL,
    CurrentAmount DECIMAL(15, 2) DEFAULT 0.00,
    Due DATE
  );
`;

const addCurrentAmountColumn = `
  ALTER TABLE Campaigns 
  ADD COLUMN IF NOT EXISTS CurrentAmount DECIMAL(15, 2) DEFAULT 0.00;
`;

const dropForeignKey = `
  ALTER TABLE Donations DROP FOREIGN KEY donations_ibfk_2;
`;

const addForeignKey = `
  ALTER TABLE Donations ADD CONSTRAINT donations_ibfk_2 FOREIGN KEY (CampaignID) REFERENCES Campaigns(ID) ON DELETE CASCADE;
`;

const createDonationsTable = `
  CREATE TABLE IF NOT EXISTS Donations (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Amount DECIMAL(15, 2),
    Supplies JSON,
    Donor INT,
    CampaignID INT,
    FOREIGN KEY (Donor) REFERENCES Users(ID),
    FOREIGN KEY (CampaignID) REFERENCES Campaigns(ID)
  );
`;

async function setupDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Creating tables...');
    await conn.query(createUsersTable);
    console.log('Users table created or already exists.');
    await conn.query(createCampaignsTable);
    console.log('Campaigns table created or already exists.');
    await conn.query(createDonationsTable);
    console.log('Donations table created or already exists.');
    
    // Migrate Supplies column from TEXT to JSON if needed
    try {
      const columnInfo = await conn.query('SHOW COLUMNS FROM Donations WHERE Field = ?', ['Supplies']);
      if (columnInfo.length > 0 && columnInfo[0].Type.toUpperCase().includes('TEXT')) {
        console.log('Migrating Supplies column from TEXT to JSON...');
        await conn.query('ALTER TABLE Donations MODIFY Supplies JSON');
        console.log('Supplies column migrated to JSON successfully.');
      }
    } catch (err) {
      // Column might not exist yet or already be JSON type, ignore error
      if (err.code !== 'ER_BAD_FIELD_ERROR' && err.code !== 'ER_INVALID_USE_OF_NULL') {
        console.log('Note: Supplies column migration skipped:', err.message);
      }
    }

    // Add CurrentAmount column to existing Campaigns table if it doesn't exist
    try {
      const columnInfo = await conn.query('SHOW COLUMNS FROM Campaigns WHERE Field = ?', ['CurrentAmount']);
      if (columnInfo.length === 0) {
        console.log('Adding CurrentAmount column to Campaigns table...');
        await conn.query('ALTER TABLE Campaigns ADD COLUMN CurrentAmount DECIMAL(15, 2) DEFAULT 0.00');
        console.log('CurrentAmount column added successfully.');
        
        // Initialize CurrentAmount for existing campaigns by summing donations
        console.log('Initializing CurrentAmount for existing campaigns...');
        await conn.query(`
          UPDATE Campaigns c
          SET c.CurrentAmount = COALESCE((
            SELECT SUM(d.Amount)
            FROM Donations d
            WHERE d.CampaignID = c.ID
          ), 0.00)
        `);
        console.log('CurrentAmount initialized for existing campaigns.');
      }
    } catch (err) {
      if (err.code !== 'ER_BAD_FIELD_ERROR' && err.code !== 'ER_DUP_FIELDNAME') {
        console.log('Note: CurrentAmount column migration skipped:', err.message);
      }
    }

    try {
      console.log('Attempting to update foreign key for cascading deletes...');
      await conn.query(dropForeignKey);
      await conn.query(addForeignKey);
      console.log('Foreign key updated successfully.');
    } catch (err) {
      if (err.code === 'ER_FK_CANNOT_DROP') {
        console.log('Foreign key may not exist, attempting to add it.');
        await conn.query(addForeignKey);
        console.log('Foreign key added successfully.');
      } else if (err.code !== 'ER_DUP_FK_CONSTRAINT_NAME') {
        // Ignore errors if the constraint already exists, otherwise throw
        throw err;
      }
    }
    console.log('Database setup complete.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

setupDatabase();
