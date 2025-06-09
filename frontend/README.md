# 🎮 Online Game Platform (Real-Time)

This is a full-stack web application for a real-time online game using:

- **Backend**: Node.js, Express.js, MongoDB, Socket.IO
- **Frontend**: React.js, Socket.IO Client

---

## 📁 Project Structure

```

project-root/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── models/
│   └── routes/
└── frontend/
└── src/

````

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js and npm
- MongoDB (local or cloud via MongoDB Atlas)
- Git

---

## 📦 Backend Setup (Node.js + Express + MongoDB)

### 1. Navigate to backend

```bash
cd backend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Make sure MongoDB is running locally on `mongodb://localhost:27017/gameDB`
or update the MongoDB URL in `config/db.js`.

### 4. Start the server

```bash
# With node
node server.js

# OR with nodemon (if installed)
npx nodemon server.js
```

You should see:

```
MongoDB connected
Server is running on port 5000
```

---

## 💻 Frontend Setup (React.js)

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start React app

```bash
npm start
```

Your app will run on [http://localhost:5173](http://localhost:5173)

---

## 🔌 Real-Time Updates using Socket.IO

* The app uses `socket.io` to emit and receive real-time game moves.
* Example event:

  ```js
  socket.emit('move', 'A1');
  socket.on('updateMove', (data) => { /* handle move */ });
  ```

---

## 🛠 Example API Endpoints

* `GET /api/games` – Fetch all games
* `POST /api/games` – Create a new game

Use tools like **Postman** to test APIs.

---

## ✅ Tech Stack

| Layer     | Technology                 |
| --------- | -------------------------- |
| Frontend  | React.js, Socket.IO Client |
| Backend   | Node.js, Express.js        |
| Database  | MongoDB                    |
| Real-Time | Socket.IO                  |

---

## 📸 Screenshots

*(Add screenshots of your UI/game here)*

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Author

**Pratik Paliwal**
*Real-time Online Game Developer*

## Wallet Integration for Games

### Overview
The wallet system has been integrated across all games to provide a consistent betting and winning experience. Players can:
- Select entry fees for different game modes
- Have their balance checked before entering a game
- Win prizes based on game outcomes
- Track their transaction history

### Components Updated
1. **WalletContext.jsx**: Provides wallet functionality across the app
   - Manages user balance stored in localStorage
   - Provides addMoney and deductMoney functions
   - Tracks transaction history

2. **ClassicMode Components**: Updated for all games
   - TicTacToe
   - CoinFlip
   - Dice
   - StonePaper
   - MemoryMatch

3. **TournamentMode Components**: Updated for games with tournament support
   - TicTacToe

4. **UnifiedGameLobby.jsx**: A universal game lobby that:
   - Works with all game types
   - Handles matchmaking UI
   - Manages game state
   - Awards prizes based on game outcomes
   - Supports both Classic and Tournament modes

5. **GameModeConnector.jsx**: Updated to use UnifiedGameLobby

### Game Flow
1. User selects a game from the catalog
2. User chooses a game mode (Classic, Tournament, etc.)
3. User selects an entry fee
4. Wallet balance is checked
5. If sufficient funds, entry fee is deducted
6. User enters the game lobby
7. Matchmaking animation is shown
8. Game is played
9. Results are shown and prizes are awarded
10. User can play again or exit

### Backend Integration
The system is ready for backend integration:
- All game state is managed in localStorage for now
- Transaction data is structured for easy API integration
- Game results can be sent to a server for verification
- Entry fees and prizes can be validated server-side

To connect to a backend:
1. Replace localStorage calls with API calls
2. Add authentication to secure transactions
3. Implement server-side validation for game results
4. Add real-time features for multiplayer games
