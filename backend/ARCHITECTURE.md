# DevTinder Backend Architecture

## System Design Overview

### Architecture Pattern
- **Layered Architecture**: Separation of concerns with Models, Routes, Services, and Middleware
- **RESTful API**: HTTP endpoints for standard CRUD operations
- **WebSocket**: Real-time bidirectional communication for messaging
- **Optional Redis**: For pub/sub pattern (scales horizontally)

## Technology Stack

### Core Technologies
- **Node.js** + **Express.js**: REST API server
- **Socket.io**: WebSocket server for real-time messaging
- **MongoDB** + **Mongoose**: Database and ODM
- **Redis** (Optional): Pub/Sub for horizontal scaling
- **JWT**: Authentication via cookies

## Project Structure

```
backend/src/
├── app.js                 # Main application entry point
├── config/
│   ├── database.js       # MongoDB connection
│   └── redis.js          # Redis connection (optional)
├── models/
│   ├── user.js           # User schema
│   ├── connectionRequest.js  # Connection requests schema
│   └── message.js        # Message schema
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── profile.js        # Profile management routes
│   ├── requests.js       # Connection request routes
│   ├── user.js           # User/feed routes
│   └── message.js        # Message REST routes
├── middlewares/
│   ├── auth.js           # HTTP authentication middleware
│   └── socketAuth.js     # WebSocket authentication middleware
├── services/
│   └── socketService.js  # Business logic for messaging
└── socket/
    └── socketHandler.js  # WebSocket event handlers
```

## Database Schema

### User Model
- Basic user information (name, email, password, profile)
- Indexed fields: firstName, lastName, gender

### ConnectionRequest Model
- Tracks connection status between users
- Status: "ignore", "interested", "rejected", "accepted"
- Unique index on (fromUserId, toUserId)

### Message Model
- Stores chat messages between connected users
- Fields: senderId, receiverId, content, read, readAt
- Indexed for efficient querying

## API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login (sets JWT cookie)
- `POST /logout` - User logout

### Profile
- `GET /profile/view` - Get current user profile
- `PATCH /profile/edit` - Update profile

### Connections
- `POST /request/send/:status/:toUserId` - Send connection request
- `POST /request/review/:status/:requestId` - Accept/reject request
- `GET /requests/received` - Get pending requests
- `GET /user/connections` - Get accepted connections
- `GET /feed?page=1&limit=20` - Get feed with pagination

### Messaging (REST)
- `GET /conversations` - Get all conversations
- `GET /conversation/:otherUserId` - Get conversation with user
- `GET /unread-count` - Get unread message count

## WebSocket Events

### Client → Server
- `message:send` - Send a message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `conversation:fetch` - Fetch conversation
- `messages:read` - Mark messages as read

### Server → Client
- `message:new` - New message received
- `message:sent` - Message sent confirmation
- `message:error` - Message error
- `typing:start` - Other user typing
- `typing:stop` - Other user stopped typing
- `conversation:data` - Conversation data
- `messages:read` - Messages marked as read
- `user:online` - User came online
- `user:offline` - User went offline

## Security Features

### Authentication
- JWT tokens stored in HTTP-only cookies
- Socket.io authentication via middleware
- Token validation on every request

### Authorization
- Users can only message connected users (status: "accepted")
- Connection verification before message sending
- User can only view their own conversations

## Scalability Considerations

### Current Setup
- Single server instance
- In-memory active users map
- Direct Socket.io connections

### With Redis (Optional)
- Pub/Sub pattern for multi-server deployment
- Shared state across server instances
- Horizontal scaling capability

## Message Flow

1. **User A sends message to User B**
   - Client emits `message:send` via Socket.io
   - Server verifies connection between A and B
   - Server saves message to MongoDB
   - Server emits `message:new` to User B (if online)
   - Server emits `message:sent` to User A

2. **Real-time Delivery**
   - If receiver is online: Instant delivery via WebSocket
   - If receiver is offline: Message stored, delivered on next login

3. **Typing Indicators**
   - Client emits `typing:start` when user types
   - Server broadcasts to receiver
   - Auto-stop after 1 second of inactivity

## Error Handling

- Try-catch blocks in all async operations
- Proper error responses with status codes
- Socket error events for client-side handling
- Graceful degradation if Redis unavailable

## Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for feed and messages
- Efficient aggregation queries for conversations
- Connection pooling for MongoDB

## Future Enhancements

- Message read receipts
- File/image sharing
- Group messaging
- Push notifications
- Message search
- Message reactions

