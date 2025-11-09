# HTTP Response Codes Reference

## Status Codes

| Code | Status | Meaning | When Used | Example Response |
|------|--------|---------|-----------|------------------|
| **200** | OK | Request succeeded | GET requests, login, logout, updates, deletions | `{ "loggedIn": true, "user": {...} }` |
| **201** | Created | Resource created successfully | User registration, campaign/donation creation | `{ "id": 1, "Username": "user123" }` |
| **400** | Bad Request | Invalid request data | Missing/invalid required fields | `{ "error": "Amount is required and must be greater than 0." }` |
| **401** | Unauthorized | Authentication required/failed | Missing session, invalid credentials | `{ "error": "Authentication required. Please log in." }` |
| **403** | Forbidden | Access denied | Admin-only endpoints, reserved username | `{ "error": "Forbidden. Administrator access required." }` |
| **404** | Not Found | Resource not found | Invalid campaign/donation ID | `{ "error": "Campaign not found." }` |
| **409** | Conflict | Duplicate entry | Username already exists | `{ "error": "Username already exists." }` |
| **500** | Internal Server Error | Server/database error | Connection failures, query errors, transaction failures | `{ "error": "Error message" }` |

## Response Format

**Success Responses**:
- `200 OK`: Returns requested data or `{ "message": "..." }`
- `201 Created`: Returns created resource with ID

**Error Responses**:
All errors return: `{ "error": "Error message description" }`

## Authentication & Authorization

### Login Required
- `POST /api/campaigns` - Create campaign
- `POST /api/donations` - Create donation

### Admin Required
- `POST /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Session-Based Auth
All authenticated endpoints use cookie-based sessions. Include `credentials: 'include'` in fetch requests to send session cookies.

## Common Error Scenarios

- **401 Unauthorized**: User not logged in or session expired
- **403 Forbidden**: User lacks admin privileges for admin-only operations
- **404 Not Found**: Campaign/Donation ID doesn't exist in database
- **409 Conflict**: Attempting to register with existing username
- **500 Internal Server Error**: Database connection issues, SQL errors, or transaction failures
