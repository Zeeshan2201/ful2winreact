# Full2Win React App - Local Development Setup

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation)
- npm or yarn

### 1. Install MongoDB (if not already installed)

**Windows:**
```bash
# Download MongoDB Community Server from https://www.mongodb.com/try/download/community
# Or use chocolatey
choco install mongodb

# Start MongoDB service
net start mongodb
```

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start the Application

**Option A: Using the batch script (Windows)**
```bash
# From the root directory
start-local.bat
```

**Option B: Using the bash script (macOS/Linux)**
```bash
# From the root directory
chmod +x start-local.sh
./start-local.sh
```

**Option C: Manual startup**
```bash
# Terminal 1 - Start Backend
cd Backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017/gameDB

## 🔧 Configuration

All configurations have been set to use local development:

### Backend (`/Backend/config/db.js`)
```javascript
// Local MongoDB connection
await mongoose.connect('mongodb://localhost:27017/gameDB');
```

### Frontend
- Socket.IO: `http://localhost:5000`
- API calls: `http://localhost:5000`
- Authentication: `http://localhost:5000`

## 🎮 Features Running Locally

### ✅ Working Features:
- User Authentication (Signup/Login)
- Socket.IO real-time communication
- Game matchmaking
- Community features
- Chat system
- Wallet system
- All game modes (TicTacToe, Dice, Coin Flip, etc.)

### 🔧 Local Development Notes:
- Database: Uses local MongoDB instance
- All API calls route to localhost:5000
- Socket connections use localhost:5000
- No external dependencies on remote services

## 🛠️ Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
tasklist | findstr mongod

# macOS/Linux
ps aux | grep mongod

# Start MongoDB if not running
# Windows
net start mongodb

# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 5173
- MongoDB runs on port 27017

If any port is in use, you can change them in:
- Backend: `server.js` (PORT variable)
- Frontend: `vite.config.js`
- MongoDB: Use `--port` flag when starting mongod

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear browser cache and localStorage
# Go to browser dev tools > Application > Storage > Clear All
```

## 📝 Development Workflow

1. **Start MongoDB** (if not already running)
2. **Start Backend** (`cd Backend && npm start`)
3. **Start Frontend** (`cd frontend && npm run dev`)
4. **Open browser** to `http://localhost:5173`
5. **Create account** or login
6. **Start gaming!**

## 🔒 Security Note

This local setup uses:
- JWT tokens for authentication
- Local MongoDB without authentication (for development)
- CORS enabled for localhost origins

For production deployment, ensure to:
- Enable MongoDB authentication
- Use environment variables for sensitive data
- Update CORS settings
- Use HTTPS

## 📊 Database Schema

The local MongoDB will automatically create the `gameDB` database with collections:
- users
- posts
- chats
- games (various game types)
- matchmaking queues
- rooms

## 🎯 Next Steps

Once everything is running locally:
1. Test user registration/login
2. Try creating posts in community
3. Start a game and test matchmaking
4. Test real-time chat
5. Check wallet functionality

Happy Gaming! 🎮
