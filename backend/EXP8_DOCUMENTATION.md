# Experiment 8 — Enable real-time communication via WebSockets

## 1. Experiment Title
Enable real-time communication via WebSockets

## 2. Aim
To implement real-time, bi-directional communication in the Gym Management System using WebSockets (Socket.IO).

## 3. Objective
Demonstrate the usage of WebSockets to create a real-time Live Community Chat feature accessible to both admins and members. The feature should instantly broadcast messages to all connected clients without requiring a page refresh.

## 4. Theory
WebSockets provide a persistent connection between a client and a server that both parties can use to start sending data at any time. This is vastly different from traditional HTTP requests where the client must initiate the communication. Socket.IO is a library that enables low-latency, bidirectional, and event-based communication between a client and a server, gracefully falling back to HTTP long-polling when WebSockets are unavailable.

## 5. Technologies/Tools Used
- **Backend:** Node.js, Express, `socket.io`
- **Frontend:** React, Tailwind CSS, `socket.io-client`

## 6. Implementation Steps
1. **Backend Setup:** Installed the `socket.io` library in the backend directory.
2. **Server Configuration:** Modified `server.js` to create a standard Node `http.Server` and attached the `socket.io` instance to it.
3. **Database Persistence:** Created a new Mongoose model (`backend/models/ChatMessage.js`). The Socket.IO connection middleware extracts JWT tokens to securely authenticate senders. When a message is sent, it is first saved to the `ChatMessage` collection in MongoDB before being broadcasted.
4. **Chat API Route:** Added `backend/routes/chatRoutes.js` and `backend/controllers/chatController.js` to serve a `GET /api/chat/messages` endpoint which loads the most recent chat history from MongoDB.
5. **Frontend Setup:** Installed `socket.io-client` in the main project directory.
6. **Chat Component:** Created a new `LiveChat.jsx` component. On component load, it fetches the chat history from the REST API, then connects to Socket.IO.
7. **Global Integration:** Imported and mounted the `<LiveChat />` component in `App.jsx` outside of the routes (but inside the Router) so it persists across page navigations. Used `AuthContext` to ensure the chat is only visible to logged-in users.

## 7. Files Created/Modified
- **Created:** `src/components/LiveChat.jsx`
- **Created:** `backend/models/ChatMessage.js`
- **Created:** `backend/routes/chatRoutes.js`
- **Created:** `backend/controllers/chatController.js`
- **Modified:** `backend/server.js` (Added HTTP Server, JWT socket auth, Socket.io logic, and chat routes)
- **Modified:** `src/App.jsx` (Imported and rendered `<LiveChat />`)
- **Dependencies Added:** `socket.io` (backend), `socket.io-client` (frontend)

## 8. How to Run
1. Open a terminal and start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. Open another terminal and start the frontend:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## 9. How to Test
1. Log in as an owner/staff in one browser window (or incognito mode).
2. Log in as a member in another browser window.
3. Click the floating green chat button (bottom right) in both windows to open the Live Chat.
4. Send a message from the owner account.
5. Verify that the message instantly appears in the member's chat window, and vice versa.

## 10. Expected Output
A floating chat button will be visible on the bottom right of the screen for logged-in users. Clicking it reveals a chat interface containing the previous conversation loaded from MongoDB. Messages sent from one client will instantly appear on all other connected clients, and will remain visible even if the browser is refreshed.

## 11. Result/Conclusion
Successfully implemented real-time communication in the Gym Management System using WebSockets and Socket.IO, backed by persistent MongoDB storage. The application now supports live community chat without polling or manual refreshing, and securely preserves message history.

## 12. Screenshots that should be taken for the practical record
1. **Chat Window Opened:** A screenshot of the dashboard with the floating Live Chat window opened, displaying historical messages.
2. **Real-time Messaging:** Two side-by-side browser windows (e.g. Owner on the left, Member on the right) showing a conversation appearing instantly in both windows.
3. **Chat Persistence:** A screenshot taken after refreshing the browser page, showing that the chat messages are still present (loaded from MongoDB).
4. **MongoDB Verification:** A screenshot of MongoDB Compass (or Atlas) showing the `chatmessages` collection with stored chat documents.
5. **Backend Terminal Log:** A screenshot of the backend terminal showing `New client connected (User: ...)` logs indicating successful WebSocket connections with authentication.

## 13. Persistent Chat Message Storage
- **Socket.IO** provides real-time communication.
- **MongoDB** provides persistent storage.
- Messages are safely saved to MongoDB *before* broadcasting to other clients.
- Chat history is fetched via REST API when the chat component opens.
- Refreshing the browser does not delete messages, as they are re-loaded from the database.
- Sender identity is secured using JWT authentication at the socket handshake level wherever possible.
