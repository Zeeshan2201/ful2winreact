const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

// Route Imports
const gameRoutes = require('./routes/gameRoutes');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/auth');
const protected = require('./routes/protected');
const MatchmakingQueue = require('./models/MatchmakingQueue');
const Room = require('./models/Room');
const chatRoutes = require('./routes/chat');
const ticTacToeGameRoutes = require('./routes/ticTacToeGame');
const rockPaperGameRoutes = require('./routes/rockPaperGameRoutes');
const userRoutes = require('./routes/userRoutes');
const DuckHunt = require('./models/DuckHunt');

// Init Express
const app = express();
const server = http.createServer(app);

// ✅ CORS config
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://ful2win-u83b.onrender.com"
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));           // Apply CORS
app.options("*", cors(corsOptions));  // Preflight requests

// JSON body parsing
app.use(express.json());

// ✅ Attach Socket.IO to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Setup Socket.IO server with CORS
const io = new Server(server, {
  cors: corsOptions
});

// ✅ Connect to MongoDB
require('./config/db')();

// ✅ Register API routes
app.use('/api/games', gameRoutes);
app.use('/api/post', postRoutes);
app.use('/api/auth', authRoutes);       // Login is under /api/auth/login
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tictactoe', ticTacToeGameRoutes);
app.use('/api/game', rockPaperGameRoutes);
app.use('/api/protected', protected);
app.use('/api/duckhunt', DuckHunt);

// ✅ Socket.IO matchmaking
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_matchmaking', async ({ userId, gameId }) => {
    try {
      const opponent = await MatchmakingQueue.findOne({ gameId, userId: { $ne: userId } });

      if (opponent) {
        await MatchmakingQueue.deleteOne({ _id: opponent._id });

        const newRoom = await Room.create({
          gameId,
          players: [
            { userId: opponent.userId, socketId: opponent.socketId },
            { userId, socketId: socket.id }
          ],
          status: 'in-progress'
        });

        socket.emit('match_found', { roomId: newRoom._id, players: newRoom.players });
        io.to(opponent.socketId).emit('match_found', { roomId: newRoom._id, players: newRoom.players });

      } else {
        await MatchmakingQueue.create({ userId, gameId, socketId: socket.id });
        socket.emit('waiting_for_opponent');
      }
    } catch (err) {
      console.error('Matchmaking error:', err);
      socket.emit('matchmaking_error', 'An error occurred');
    }
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id);
    await MatchmakingQueue.deleteOne({ socketId: socket.id });
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
