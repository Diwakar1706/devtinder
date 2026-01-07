# Connection Management & Reporting API Documentation

This document provides detailed documentation for the Connection Management and User Reporting APIs in the DevTinder backend.

---

## Table of Contents

1. [Remove Connection API](#remove-connection-api)
2. [Block User API](#block-user-api)
3. [Unblock User API](#unblock-user-api)
4. [Get Blocked Users API](#get-blocked-users-api)
5. [Report User API](#report-user-api)
6. [Get User Reports API](#get-user-reports-api)
7. [WebSocket Events](#websocket-events)
8. [Error Responses](#error-responses)
9. [Status Codes](#status-codes)

---

## Remove Connection API

Removes (unfriends) a connection between two users. This will:
- Delete the connection request document
- Soft-delete all messages in the conversation for both users

### Endpoint

```
DELETE /connection/remove/:otherUserId
```

### Authentication

✅ Required - JWT token in HTTP-only cookie

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `otherUserId` | String (ObjectId) | Yes | The ID of the user to remove connection with |

### Request Example

```javascript
// Using axios
const response = await axios.delete(`${BASE_URL}/connection/remove/${otherUserId}`, {
  withCredentials: true
});
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Connection removed successfully",
  "data": {
    "otherUserId": "507f1f77bcf86cd799439011"
  }
}
```

### Error Responses

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| `401` | Unauthorized | User not authenticated |
| `404` | Connection not found | No accepted connection exists between users |
| `400` | Error message | Server error or validation error |

### Notes

- Only works for connections with status "accepted"
- Messages are soft-deleted (not permanently removed) for both users
- After removal, users can send new connection requests to each other

---

## Block User API

Blocks a user, preventing them from:
- Messaging you
- Seeing you in their feed
- Sending connection requests
- Viewing your profile (if implemented)

### Endpoint

```
POST /connection/block/:otherUserId
```

### Authentication

✅ Required - JWT token in HTTP-only cookie

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `otherUserId` | String (ObjectId) | Yes | The ID of the user to block |

### Request Example

```javascript
// Using axios
const response = await axios.post(
  `${BASE_URL}/connection/block/${otherUserId}`,
  {},
  { withCredentials: true }
);
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "User blocked successfully",
  "data": {
    "otherUserId": "507f1f77bcf86cd799439011",
    "blockedBy": "507f191e810c19729de860ea"
  }
}
```

### Error Responses

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| `401` | Unauthorized | User not authenticated |
| `404` | User not found | The user to block does not exist |
| `400` | Error message | Server error or validation error |

### Notes

- Creates or updates a ConnectionRequest with status "blocked"
- Soft-deletes all existing messages for the blocking user
- Blocked users are automatically removed from your feed
- You can unblock users later using the Unblock API

---

## Unblock User API

Unblocks a previously blocked user, allowing them to interact with you again.

### Endpoint

```
POST /connection/unblock/:otherUserId
```

### Authentication

✅ Required - JWT token in HTTP-only cookie

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `otherUserId` | String (ObjectId) | Yes | The ID of the user to unblock |

### Request Example

```javascript
// Using axios
const response = await axios.post(
  `${BASE_URL}/connection/unblock/${otherUserId}`,
  {},
  { withCredentials: true }
);
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "User unblocked successfully",
  "data": {
    "otherUserId": "507f1f77bcf86cd799439011"
  }
}
```

### Error Responses

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| `401` | Unauthorized | User not authenticated |
| `404` | Blocked connection not found | The user was not blocked by you, or was already unblocked |
| `400` | Error message | Server error or validation error |

### Notes

- Only works if you were the one who blocked the user
- Deletes the blocked ConnectionRequest document
- Messages remain soft-deleted (they won't reappear after unblocking)

---

## Get Blocked Users API

Retrieves a list of all users blocked by the current user.

### Endpoint

```
GET /connections/blocked
```

### Authentication

✅ Required - JWT token in HTTP-only cookie

### Request Example

```javascript
// Using axios
const response = await axios.get(`${BASE_URL}/connections/blocked`, {
  withCredentials: true
});
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Blocked users fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "photourl": "/uploads/profiles/user-photo.jpg"
    },
    {
      "_id": "507f191e810c19729de860ea",
      "firstName": "Jane",
      "lastName": "Smith",
      "photourl": "/uploads/profiles/user-photo2.jpg"
    }
  ]
}
```

### Error Responses

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| `401` | Unauthorized | User not authenticated |
| `400` | Error message | Server error |

### Notes

- Returns empty array if no users are blocked
- Only returns users that you blocked (not users who blocked you)

---

## Report User API

Reports a user for inappropriate behavior or content. Reports are reviewed by administrators.

### Endpoint

```
POST /user/report/:reportedUserId
```

### Authentication

✅ Required - JWT token in HTTP-only cookie

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reportedUserId` | String (ObjectId) | Yes | The ID of the user to report |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | String | Yes | Reason for reporting. Must be one of: `spam`, `harassment`, `inappropriate_content`, `fake_profile`, `scam`, `other` |
| `description` | String | No | Additional details about the report (max 1000 characters) |

### Request Example

```javascript
// Using axios
const response = await axios.post(
  `${BASE_URL}/user/report/${reportedUserId}`,
  {
    reason: "harassment",
    description: "User sent inappropriate messages"
  },
  { withCredentials: true }
);
```

### Success Response

**Status Code:** `201 Created`

```json
{
  "message": "User reported successfully. Our team will review the report.",
  "data": {
    "reportId": "507f1f77bcf86cd799439012",
    "reportedUserId": "507f1f77bcf86cd799439011",
    "reason": "harassment",
    "status": "pending"
  }
}
```

### Error Responses

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| `401` | Unauthorized | User not authenticated |
| `400` | Report reason is required | Missing `reason` field |
| `400` | Invalid reason. Must be one of: ... | Invalid `reason` value |
| `404` | User not found | The reported user does not exist |
| `400` | You cannot report yourself | Attempting to report your own account |
| `400` | You have already reported this user for the same reason recently. Please wait 24 hours before reporting again. | Duplicate report within 24 hours |

### Report Reasons

| Reason | Description |
|--------|-------------|
| `spam` | User is sending spam messages or content |
| `harassment` | User is harassing or bullying |
| `inappropriate_content` | User is sharing inappropriate content |
| `fake_profile` | User profile appears to be fake or impersonating someone |
| `scam` | User is attempting to scam or defraud |
| `other` | Other reason (use description field for details) |

### Notes

- Prevents duplicate reports: Same reporter cannot report the same user for the same reason within 24 hours
- Reports are stored with status "pending" and can be reviewed by administrators
- Reports do not automatically block users (use Block API for that)
- Self-reporting is prevented

---

## Get User Reports API

Retrieves all reports made by the current user.

### Endpoint

```
GET /user/reports
```

### Authentication

✅ Required - JWT token in HTTP-only cookie

### Request Example

```javascript
// Using axios
const response = await axios.get(`${BASE_URL}/user/reports`, {
  withCredentials: true
});
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Reports fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "reporterId": "507f191e810c19729de860ea",
      "reportedUserId": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "photourl": "/uploads/profiles/user-photo.jpg"
      },
      "reason": "harassment",
      "description": "User sent inappropriate messages",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Error Responses

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| `401` | Unauthorized | User not authenticated |
| `400` | Error message | Server error |

### Notes

- Returns reports sorted by creation date (newest first)
- Only shows reports made by the current user
- Includes populated reported user information

---

## WebSocket Events

### Connection Management Events

These events are emitted/received via Socket.io for real-time updates:

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `connection:remove` | `{ otherUserId: string }` | Remove a connection (real-time) |
| `connection:block` | `{ otherUserId: string }` | Block a user (real-time) |
| `connection:unblock` | `{ otherUserId: string }` | Unblock a user (real-time) |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `connection:removed` | `{ byUserId: string, otherUserId: string }` | Connection was removed |
| `connection:blocked` | `{ byUserId: string, otherUserId: string }` | User was blocked |
| `connection:unblocked` | `{ byUserId: string, otherUserId: string }` | User was unblocked |
| `connection:remove:error` | `{ error: string }` | Error removing connection |
| `connection:block:error` | `{ error: string }` | Error blocking user |
| `connection:unblock:error` | `{ error: string }` | Error unblocking user |

### Example: Real-time Block

```javascript
// Client side
const socket = io('http://localhost:8001', {
  withCredentials: true
});

// Emit block event
socket.emit('connection:block', { otherUserId: '507f1f77bcf86cd799439011' });

// Listen for block confirmation
socket.on('connection:blocked', (data) => {
  console.log('User blocked:', data);
  // Update UI accordingly
});

// Listen for errors
socket.on('connection:block:error', (data) => {
  console.error('Block error:', data.error);
});
```

---

## Error Responses

All APIs follow a consistent error response format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common error scenarios:

1. **Authentication Errors (401)**
   - Missing or invalid JWT token
   - Expired session

2. **Not Found Errors (404)**
   - User not found
   - Connection not found
   - Blocked connection not found

3. **Validation Errors (400)**
   - Missing required fields
   - Invalid data format
   - Business logic violations (e.g., self-reporting, duplicate reports)

4. **Server Errors (500)**
   - Database errors
   - Unexpected server errors

---

## Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET, POST (block/unblock), DELETE requests |
| `201` | Created | Successful POST request that created a new resource (report) |
| `400` | Bad Request | Validation errors, missing required fields, business logic violations |
| `401` | Unauthorized | Missing or invalid authentication token |
| `404` | Not Found | Resource (user, connection) not found |
| `500` | Internal Server Error | Unexpected server errors |

---

## Database Models

### ConnectionRequest Model

Stores connection relationships between users:

```javascript
{
  fromUserId: ObjectId (ref: User),
  toUserId: ObjectId (ref: User),
  status: String (enum: ["ignore", "interested", "rejected", "accepted", "blocked"]),
  blockedBy: ObjectId (ref: User) // Required if status is "blocked"
}
```

### Report Model

Stores user reports:

```javascript
{
  reporterId: ObjectId (ref: User),
  reportedUserId: ObjectId (ref: User),
  reason: String (enum: ["spam", "harassment", "inappropriate_content", "fake_profile", "scam", "other"]),
  description: String (optional, max 1000 chars),
  status: String (enum: ["pending", "reviewed", "resolved", "dismissed"], default: "pending"),
  reviewedBy: ObjectId (ref: User, optional),
  reviewedAt: Date (optional)
}
```

### Message Model

Includes `deletedFor` array for soft deletion:

```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  content: String,
  read: Boolean,
  readAt: Date,
  deletedFor: [ObjectId (ref: User)] // Soft delete tracking
}
```

---

## Testing Examples

### cURL Examples

#### Remove Connection
```bash
curl -X DELETE http://localhost:8001/connection/remove/507f1f77bcf86cd799439011 \
  -H "Cookie: token=your_jwt_token"
```

#### Block User
```bash
curl -X POST http://localhost:8001/connection/block/507f1f77bcf86cd799439011 \
  -H "Cookie: token=your_jwt_token" \
  -H "Content-Type: application/json"
```

#### Unblock User
```bash
curl -X POST http://localhost:8001/connection/unblock/507f1f77bcf86cd799439011 \
  -H "Cookie: token=your_jwt_token" \
  -H "Content-Type: application/json"
```

#### Get Blocked Users
```bash
curl -X GET http://localhost:8001/connections/blocked \
  -H "Cookie: token=your_jwt_token"
```

#### Report User
```bash
curl -X POST http://localhost:8001/user/report/507f1f77bcf86cd799439011 \
  -H "Cookie: token=your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "harassment",
    "description": "User sent inappropriate messages"
  }'
```

#### Get User Reports
```bash
curl -X GET http://localhost:8001/user/reports \
  -H "Cookie: token=your_jwt_token"
```

---

## Best Practices

1. **Always handle errors** - Check response status codes and error messages
2. **Use WebSocket events** - For real-time updates, prefer Socket.io events over polling
3. **Validate input** - Ensure required fields are present before making requests
4. **Handle loading states** - Show loading indicators during API calls
5. **Provide user feedback** - Display success/error messages after actions
6. **Respect rate limits** - Don't spam requests (e.g., reporting the same user repeatedly)
7. **Store user preferences** - Cache blocked users list to reduce API calls

---

## Security Considerations

1. **Authentication Required** - All endpoints require valid JWT authentication
2. **Authorization Checks** - Users can only manage their own connections and reports
3. **Input Validation** - All inputs are validated on the server side
4. **Self-Protection** - Prevents users from reporting/blocking themselves
5. **Duplicate Prevention** - Prevents duplicate reports within 24 hours
6. **Soft Deletion** - Messages are soft-deleted, not permanently removed

---

## Support

For issues or questions regarding these APIs, please contact the development team or refer to the main project documentation.

---

**Last Updated:** January 2024  
**API Version:** 1.0.0

