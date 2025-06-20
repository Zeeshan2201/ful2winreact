const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
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
const diceGameRoutes = require('./routes/diceGameRoutes');
const coinflipGameRoutes = require('./routes/coinflipGameRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:5173", "https://ful2win-u83b.onrender.com", "https://ful2winreact.onrender.com"],  // Local + Deployed URLs
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: "*",
    credentials: true,
  },
});


// Middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cors({
  origin: ["http://localhost:3000","http://localhost:5173", "https://ful2win-u83b.onrender.com", "https://ful2winreact.onrender.com"],
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: "*",
  credentials: true
}));
app.use(express.json());

// Connect MongoDB
require('./config/db')();

// API Routes
app.use('/api/games', gameRoutes);
app.use('/api/post', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tictactoe', ticTacToeGameRoutes);
app.use('/api/game', rockPaperGameRoutes);
app.use('/api/tournaments', tournamentRoutes); // Tournament routes
app.use('/api/protected', protected); // secured routes
app.use('/api/duckhunt', DuckHunt); // secured routes
app.use('/api/dicegame', diceGameRoutes); // secured routes
app.use('/api/coinflip', coinflipGameRoutes); // secured routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
  
  // Default error
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Socket.IO Connection
// Track connected users to prevent duplicate connections
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
    // Handle user identification and prevent duplicate connections
  socket.on('user_identify', (userData) => {
    const { userId } = userData;
    
    // If user is already connected, disconnect the old connection
    if (connectedUsers.has(userId)) {
      const oldSocketId = connectedUsers.get(userId);
      const oldSocket = io.sockets.sockets.get(oldSocketId);
      if (oldSocket) {
        console.log(`Disconnecting old connection for user ${userId}: ${oldSocketId}`);
        oldSocket.disconnect(true);
      }
    }
    
    // Store new connection
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  // Handle user connection (legacy support)
  socket.on('user_connect', (userData) => {
    const { userId } = userData;
    
    // If user is already connected, disconnect the old connection
    if (connectedUsers.has(userId)) {
      const oldSocketId = connectedUsers.get(userId);
      const oldSocket = io.sockets.sockets.get(oldSocketId);
      if (oldSocket) {
        console.log(`Disconnecting old connection for user ${userId}: ${oldSocketId}`);
        oldSocket.disconnect(true);
      }
    }
    
    // Store new connection
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on('join_matchmaking', async ({ userId, gameId, entryAmount }) => {
    try {
      // Check for existing player in queue with same gameId, different userId, and SAME entryAmount
      const opponent = await MatchmakingQueue.findOne({ 
        gameId, 
        userId: { $ne: userId },
        entryAmount: entryAmount // Match players with same entry amount only
      });

      if (opponent) {
        // Match found – remove both from queue
        await MatchmakingQueue.deleteOne({ _id: opponent._id });

        const newRoom = await Room.create({
          gameId,
          entryAmount, // Store entry amount in room
          players: [
            { userId: opponent.userId, socketId: opponent.socketId },
            { userId, socketId: socket.id }
          ],
          status: 'in-progress'
        });

        // Notify both players
        socket.emit('match_found', { roomId: newRoom._id, players: newRoom.players, entryAmount });
        io.to(opponent.socketId).emit('match_found', { roomId: newRoom._id, players: newRoom.players, entryAmount });

      } else {
        // No opponent found yet, add to queue with entryAmount
        await MatchmakingQueue.create({ userId, gameId, entryAmount, socketId: socket.id });
        socket.emit('waiting_for_opponent');
      }
    } catch (err) {
      console.error('Matchmaking error:', err);
      socket.emit('matchmaking_error', 'An error occurred');
    }
  });  socket.on('leave_matchmaking', async ({ userId, gameId, entryAmount }) => {
    try {
      // Remove from matchmaking queue
      const removedPlayer = await MatchmakingQueue.findOneAndDelete({ 
        userId, 
        gameId, 
        entryAmount,
        socketId: socket.id 
      });
      
      if (removedPlayer) {
        console.log(`Player ${userId} left matchmaking for ${gameId} with entry ${entryAmount}`);
        socket.emit('matchmaking_cancelled', { refundAmount: entryAmount });
      }
    } catch (err) {
      console.error('Leave matchmaking error:', err);
    }
  });

  socket.on('matchmaking_timeout', async ({ userId, gameId, entryAmount }) => {
    try {
      // Remove from matchmaking queue on timeout
      const removedPlayer = await MatchmakingQueue.findOneAndDelete({ 
        userId, 
        gameId, 
        entryAmount,
        socketId: socket.id 
      });
      
      if (removedPlayer) {
        console.log(`Player ${userId} matchmaking timeout for ${gameId} with entry ${entryAmount}`);
        socket.emit('matchmaking_cancelled', { refundAmount: entryAmount });
      }
    } catch (err) {
      console.error('Matchmaking timeout error:', err);
    }
  });
  socket.on('disconnect', async (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
    
    // Clean up user from connected users map
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected and cleaned up`);
    }
    
    // Remove from matchmaking queue on disconnect
    try {
      await MatchmakingQueue.deleteOne({ socketId: socket.id });
    } catch (err) {
      console.error('Error cleaning up matchmaking queue:', err);
    }
  });
});


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
