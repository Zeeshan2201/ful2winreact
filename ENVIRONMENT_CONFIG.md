# Environment Configuration for Full2Win React App

This file explains the environment configuration for both local development and production deployment.

## Current Configuration

**Database**: Always uses MongoDB Atlas (Hosted Cloud Database)
**API**: Can be configured to use local or hosted backend

## Environment URLs

### Current Setup (Hosted Database + Configurable Backend)
- **Database**: MongoDB Atlas (Cloud) - Always used
- **Backend**: Configurable in `frontend/src/config/api.js`
- **Frontend**: Local development or deployed

### Available Configurations

#### Option 1: Full Hosted (Current Setting)
- **Backend**: https://ful2winreact.onrender.com
- **Frontend**: https://ful2win-u83b.onrender.com
- **Database**: MongoDB Atlas (Cloud)

#### Option 2: Local Frontend + Hosted Backend & Database
- **Backend**: https://ful2winreact.onrender.com
- **Frontend**: http://localhost:5173 (Local development)
- **Database**: MongoDB Atlas (Cloud)

#### Option 3: Local Backend + Hosted Database
- **Backend**: http://localhost:5000 (Local development)
- **Frontend**: http://localhost:5173 (Local development)  
- **Database**: MongoDB Atlas (Cloud)

## How to Switch Configurations

### To Use Hosted Backend (Current Setting)
In `frontend/src/config/api.js`, set:
```javascript
const FORCE_PRODUCTION = true;
```

### To Use Local Backend
In `frontend/src/config/api.js`, set:
```javascript
const FORCE_PRODUCTION = false;
```

## Database Configuration

The database is always MongoDB Atlas (hosted) as configured in `Backend/config/db.js`:
- **Connection**: `mongodb+srv://boostnowchat:boostnowchat@cluster0.rxw5wva.mongodb.net/gamedb`
- **This ensures data consistency across all environments**

## Configuration Files

### Backend
- `config/db.js` - Always uses MongoDB Atlas
- `server.js` - CORS configured for all frontend URLs

### Frontend  
- `src/config/api.js` - API configuration with FORCE_PRODUCTION flag
- All game components use this centralized config

## Running the Application

### Current Setup (Hosted Backend + Local Frontend)
```bash
# Backend (uses hosted MongoDB Atlas)
cd Backend
npm start

# Frontend (connects to hosted backend)
cd frontend
npm run dev
```

## Benefits of Current Setup

1. **Data Consistency**: All environments use the same hosted database
2. **Reliability**: No dependency on local MongoDB installation
3. **Flexibility**: Easy to switch between local and hosted backend
4. **Scalability**: Database can handle multiple concurrent users
5. **Backup**: Cloud database has automatic backups
