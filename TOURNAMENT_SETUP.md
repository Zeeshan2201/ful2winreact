# Tournament System Setup

## Overview
The tournament system has been successfully implemented for FlappyBall tournaments. Here's what has been added:

## Features Implemented

### 1. Tournament Page (`/tournaments`)
- **Daily FlappyBall Tournaments**: 
  - 12:00 PM (₹2 entry, 2 hours)
  - 2:00 PM (₹5 entry, 2 hours) 
  - 4:00 PM (₹10 entry, 2 hours)
- **Tournament Tabs**: Upcoming, Ongoing, Completed, Registered
- **Prize Distribution**: 1st place (50%), 2nd place (20%), 3rd place (10%)
- **Registration System**: One-time registration, unlimited play during tournament
- **Real-time Updates**: Player count, prize pools, status

### 2. Tournament Play Page (`/tournament/:id/play`)
- **Live Leaderboard**: Real-time score rankings
- **Tournament Info**: Time remaining, player count, current user score
- **Game Access**: Direct link to play FlappyBall in tournament mode
- **Tournament Rules**: Clear explanation of gameplay rules

### 3. FlappyBall Tournament Mode
- **Tournament Integration**: Automatic score submission
- **Unlimited Play**: Players can play multiple times, best score counts
- **Real-time Scoring**: Scores submitted automatically after each game
- **Tournament Navigation**: Easy navigation back to tournament page

### 4. Backend API
- **Tournament Management**: Create, read, update tournaments
- **Registration System**: Player registration with entry fee deduction
- **Score Submission**: Real-time score tracking and leaderboard updates
- **Prize Distribution**: Automatic winner calculation and prize distribution
- **User Management**: Coins system for entry fees

## Database Models

### Tournament Model
```javascript
{
  name: String,
  game: String (flappyball, duckhunt, etc.),
  startTime: Date,
  endTime: Date,
  entryFee: Number,
  maxPlayers: Number (default: 100),
  currentPlayers: Number,
  prizeDistribution: { first: 50, second: 20, third: 10 },
  status: String (upcoming, ongoing, completed),
  registeredPlayers: [{ userId, registeredAt, bestScore, totalGamesPlayed }],
  leaderboard: [{ userId, username, score, rank, achievedAt }],
  winners: [{ userId, username, rank, score, prizeAmount }]
}
```

### User Model Updates
```javascript
{
  // existing fields...
  username: String,
  coins: Number (default: 100),
  role: String (user, admin),
  avatar: String
}
```

## API Endpoints

### Tournament Routes
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get single tournament
- `POST /api/tournaments/:id/register` - Register for tournament
- `POST /api/tournaments/:id/score` - Submit tournament score
- `GET /api/tournaments/:id/leaderboard` - Get tournament leaderboard
- `GET /api/tournaments/user/my-tournaments` - Get user's tournaments
- `POST /api/tournaments` - Create tournament (admin only)
- `POST /api/tournaments/:id/finalize` - Finalize tournament (admin only)

## Setup Instructions

### 1. Backend Setup
```bash
cd Backend
npm install
npm run seed:tournaments  # Seed initial tournaments
npm run dev  # Start development server
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Start development server
```

### 3. Database Setup
Make sure MongoDB is running and the connection string is configured in your environment variables or config file.

### 4. Seed Tournaments
Run the tournament seeding script to create initial tournaments:
```bash
cd Backend
npm run seed:tournaments
```

This will create 6 tournaments (3 for today, 3 for tomorrow) with the specified time slots and entry fees.

## Navigation

The tournament system is accessible through:
1. **Bottom Navigation**: Tournament tab (trophy icon)
2. **Direct URL**: `/tournaments`
3. **Game Mode**: From FlappyBall game selection

## Tournament Flow

1. **User Registration**: User browses tournaments and registers with coins
2. **Tournament Play**: During tournament hours, registered users can play unlimited times
3. **Score Submission**: Best scores are automatically tracked and updated on leaderboard
4. **Prize Distribution**: Winners are determined at tournament end and prizes are distributed

## Technical Details

### Real-time Features
- Tournament status updates (upcoming → ongoing → completed)
- Live leaderboard updates
- Real-time player count updates
- Automatic tournament state management

### Payment System
- Coins-based entry fees
- Automatic deduction on registration
- Prize distribution to winners
- Balance tracking

### Game Integration
- Tournament mode detection via URL parameters
- Automatic score submission after game completion
- Seamless navigation between tournament and game

## Admin Features
- Create new tournaments
- Finalize tournaments and distribute prizes
- Tournament management dashboard (can be extended)

## Future Enhancements
- Multi-game tournaments
- Bracket-style tournaments
- Team tournaments
- Scheduled recurring tournaments
- Tournament history and statistics
- Push notifications for tournament events
- Spectator mode for ongoing tournaments
