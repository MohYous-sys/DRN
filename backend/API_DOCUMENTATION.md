# DRN Backend API Documentation

**Base URL**: `http://localhost:3001/api`

> **Note**: All requests require `credentials: 'include'` for cookie-based session authentication. See [RESPONSE_CODES.md](./RESPONSE_CODES.md) for error codes.

---

## Campaigns API (`/api/campaigns`)

### `GET /` - Get All Campaigns
Returns all campaigns with current fundraising amounts and number of donators.

**Response**: `200 OK`
```json
[
  {
    "ID": 1,
    "Title": "Flood Relief",
    "Location": "Coastal Region",
    "Urgency": "Critical",
    "Description": "Emergency flood relief efforts",
    "Image": "https://example.com/image.jpg",
    "Goal": 100000.00,
    "CurrentAmount": 45000.00,
    "Due": "2025-12-31",
    "numberOfDonators": 15
  }
]
```

**Fields**:
- `ID` (number): Campaign ID
- `Title`, `Location`, `Urgency`, `Description`, `Image` (strings)
- `Goal` (number): Fundraising target
- `CurrentAmount` (number): Amount raised (auto-updated from donations)
- `Due` (string): Deadline date (YYYY-MM-DD)
- `numberOfDonators` (number): Count of unique users who have donated to this campaign

### `POST /` - Create Campaign (Auth Required)
Creates a new campaign. `CurrentAmount` starts at 0.00.

**Request Body**:
```json
{
  "Title": "string",
  "Location": "string",
  "Urgency": "string",
  "Description": "string",
  "Image": "string (URL)",
  "Goal": number,
  "Due": "2025-12-31"
}
```

**Response**: `201 Created` - Returns created campaign with `CurrentAmount: 0.00`  
**Errors**: `401 Unauthorized` | `500 Internal Server Error`

### `POST /:id` - Update Campaign (Admin Only)
Updates campaign details. `CurrentAmount` cannot be modified (auto-managed by donations).

**Request Body**: Same as create  
**Response**: `200 OK` - `{ "message": "Campaign updated successfully." }`  
**Errors**: `403 Forbidden` | `404 Not Found` | `401 Unauthorized`

### `DELETE /:id` - Delete Campaign (Admin Only)
Deletes a campaign and all associated donations (cascade).

**Response**: `200 OK` - `{ "message": "Campaign deleted successfully." }`  
**Errors**: `403 Forbidden` | `404 Not Found` | `401 Unauthorized`

---

## Users API (`/api/users`)

### `POST /register` - Register User
Creates a new user account. Password is hashed with bcrypt.

**Request Body**:
```json
{
  "Username": "string",
  "Password": "string"
}
```

**Response**: `201 Created` - `{ "id": 1, "Username": "testuser" }`  
**Errors**: 
- `409 Conflict` - Username already exists
- `403 Forbidden` - Username 'admin' is reserved

### `POST /login` - Login
Authenticates user and creates a session cookie.

**Request Body**: Same as register  
**Response**: `200 OK`
```json
{
  "message": "Login successful.",
  "user": {
    "id": 1,
    "username": "testuser",
    "isAdmin": false
  }
}
```
**Errors**: `401 Unauthorized` - Invalid credentials

### `GET /status` - Check Session Status
Returns current login status and user info if logged in.

**Response**: `200 OK`
- Logged in: `{ "loggedIn": true, "user": { "id", "username", "isAdmin" } }`
- Not logged in: `{ "loggedIn": false }`

### `POST /logout` - Logout
Destroys the current session and clears session cookie.

**Response**: `200 OK` - `{ "message": "Logout successful." }`  
**Errors**: `500 Internal Server Error`

---

## Donations API (`/api/donations`)

### `GET /` - Get All Donations
Returns all donations ordered by ID DESC (newest first). Includes donor username via JOIN.

**Response**: `200 OK`
```json
[
  {
    "ID": 1,
    "Amount": 100.00,
    "Supplies": ["Water bottles", "blankets"],
    "Donor": 1,
    "DonorUsername": "testuser",
    "CampaignID": 1
  }
]
```

**Fields**:
- `ID` (number): Donation ID
- `Amount` (number): Donation amount
- `Supplies` (array): Supply names as strings
- `Donor` (number): User ID of donor
- `DonorUsername` (string): Username from Users table JOIN
- `CampaignID` (number): Associated campaign ID

### `POST /` - Create Donation (Auth Required)
Creates a donation and automatically increments the campaign's `CurrentAmount`. Uses a database transaction to ensure consistency.

**Request Body**:
```json
{
  "Amount": number,
  "Supplies": ["string"],  // Optional array
  "CampaignID": number
}
```

> **Important**: The `Donor` field is **NOT** sent in the request. The donor ID is automatically retrieved from the authenticated user's session.

**Response**: `201 Created`
```json
{
  "id": 1,
  "Amount": 100.00,
  "Supplies": ["Water bottles"],
  "Donor": 1,
  "CampaignID": 1
}
```

**Errors**:
- `400 Bad Request` - Invalid amount (≤0) or missing CampaignID
- `401 Unauthorized` - Not logged in
- `404 Not Found` - Campaign doesn't exist
- `500 Internal Server Error` - Database/transaction error

### `GET /top-donators` - Get Top Donators
Returns a list of donators with their total donation amounts, ordered by total amount (highest first). Only includes users who have made at least one donation.

**Response**: `200 OK`
```json
[
  {
    "donatorName": "john_doe",
    "totalAmount": 5000.00
  },
  {
    "donatorName": "jane_smith",
    "totalAmount": 3500.00
  },
  {
    "donatorName": "testuser",
    "totalAmount": 1200.00
  }
]
```

**Fields**:
- `donatorName` (string): Username of the donor
- `totalAmount` (number): Sum of all donation amounts made by this donor

**Notes**:
- Only users who have made at least one donation are included
- Results are ordered by `totalAmount` in descending order (highest first)
- Returns empty array `[]` if no donations exist

**Errors**: `500 Internal Server Error`

---

## Stats API (`/api/stats`)

### `GET /` - Get Statistics
Returns aggregate statistics about the platform.

**Response**: `200 OK`
```json
{
  "totalDonations": 5000.00,
  "numberOfSupplies": 150,
  "donors": 25,
  "activeCampaigns": 10
}
```

**Fields**:
- `totalDonations` (number): Sum of all donation amounts
- `numberOfSupplies` (number): Total count of supplies across all donations
- `donors` (number): Number of unique users who have donated
- `activeCampaigns` (number): Total campaigns in database

**Errors**: `500 Internal Server Error`

---

For detailed response codes, see [RESPONSE_CODES.md](./RESPONSE_CODES.md)
