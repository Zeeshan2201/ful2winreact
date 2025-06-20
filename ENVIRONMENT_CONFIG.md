# Environment Configuration for Full2Win React App

This file explains the environment configuration for both local development and production deployment.

## Environment URLs

### Local Development
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Database**: MongoDB Local (mongodb://localhost:27017/gameDB)

### Production (Deployed)
- **Backend**: https://ful2winreact.onrender.com
- **Frontend**: https://ful2win-u83b.onrender.com
- **Database**: MongoDB Atlas (Cloud)

## How It Works

The application automatically detects the environment using `process.env.NODE_ENV`:

- **Development**: Uses local URLs and local MongoDB
- **Production**: Uses deployed URLs and MongoDB Atlas

## Configuration Files

### Backend
- `config/db.js` - Database configuration
- `server.js` - CORS and Socket.IO configuration

### Frontend
- `src/config/api.js` - Centralized API configuration
- All game components and services use this centralized config

## Running the Application

### Local Development
```bash
# Backend
cd Backend
npm run local

# Frontend
cd frontend
npm run dev
```

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd Backend
npm run production
```

## CORS Configuration

The backend allows requests from:
- http://localhost:3000 (React development server)
- http://localhost:5173 (Vite development server)
- https://ful2win-u83b.onrender.com (Deployed frontend)
- https://ful2winreact.onrender.com (Legacy frontend URL)

## Socket.IO Configuration

Socket.IO connections are configured to work with both local and deployed environments automatically.
