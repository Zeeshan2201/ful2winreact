

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
const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:5173",  "https://ful2winreact.onrender.com"],  // Your deployed frontend URL
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
  origin: ["http://localhost:3000","http://localhost:5173",  "https://ful2winreact.onrender.com"],
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
app.use('/api/protected', protected); // secured routes
app.use('/api/duckhunt', DuckHunt); // secured routes
app.use('/api/dicegame', diceGameRoutes); // secured routes
app.use('/api/coinflip', coinflipGameRoutes); // secured routes

// Socket.IO Connection

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
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

  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id);
    // Remove from matchmaking queue on disconnect
    await MatchmakingQueue.deleteOne({ socketId: socket.id });
  });
});


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
