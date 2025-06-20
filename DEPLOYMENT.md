# FlappyBall Game Deployment Instructions

## Production URLs
- **Frontend**: https://ful2win-u83b.onrender.com
- **Backend API**: https://ful2winreact.onrender.com/api
- **Hosted Game**: https://flappyballgame.boostnow.in

## Files to Deploy

### 1. Replace the script.js on flappyballgame.boostnow.in
Replace the existing script.js file on your hosted game with the content from:
`d:\Main project\ful2winreact\frontend\public\modified-script.js`

This script now includes:
- ✅ Environment detection (local vs production)
- ✅ Automatic API URL selection
- ✅ Tournament parameter handling
- ✅ Score submission to correct backend
- ✅ Cross-origin message handling
- ✅ Error handling and user feedback

### 2. Environment Configuration

The script automatically detects the environment:

**Local Development:**
- Game: https://flappyballgame.boostnow.in
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

**Production:**
- Game: https://flappyballgame.boostnow.in
- Frontend: https://ful2win-u83b.onrender.com
- Backend: https://ful2winreact.onrender.com/api

## Deployment Steps

1. **Upload Modified Script:**
   - Copy the content from `modified-script.js`
   - Replace the existing `script.js` on flappyballgame.boostnow.in
   - Ensure the file is accessible at: https://flappyballgame.boostnow.in/script.js

2. **Test Local Environment:**
   ```bash
   # Start backend
   cd "d:\Main project\ful2winreact\Backend"
   npm start

   # Start frontend
   cd "d:\Main project\ful2winreact\frontend"
   npm run dev
   ```

3. **Test Production Environment:**
   - Visit: https://ful2win-u83b.onrender.com
   - Register/login to the platform
   - Navigate to tournaments
   - Join a FlappyBall tournament
   - Verify game loads and scores submit correctly

## Key Features

### Tournament Integration
- Game receives tournament parameters via URL
- Automatic score submission to backend
- Real-time leaderboard updates
- Tournament status display

### Cross-Environment Support
- Detects localhost vs production automatically
- Uses correct API endpoints
- Handles authentication tokens
- Error handling for network issues

### User Experience
- Tournament banner in game
- Score submission feedback
- Game restart functionality
- Full-screen mode support

## Testing Checklist

### Local Testing
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Game loads in tournament modal
- [ ] Score submission works
- [ ] Leaderboard updates

### Production Testing
- [ ] Frontend loads at https://ful2win-u83b.onrender.com
- [ ] Backend API responds at https://ful2winreact.onrender.com/api
- [ ] Tournament registration works
- [ ] Game loads with tournament parameters
- [ ] Scores submit to production backend
- [ ] Leaderboard shows correct data

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows requests from game domain
2. **API URL Issues**: Check environment detection in browser console
3. **Authentication**: Verify tokens are passed correctly
4. **Score Submission**: Check network tab for API call status

### Debug Information
The script logs detailed information to browser console:
- Environment detection
- API URL selection
- Tournament parameters
- Score submission attempts
- Error messages

## API Endpoints

### Tournament Endpoints
- `GET /tournaments` - List all tournaments
- `POST /tournaments/:id/register` - Register for tournament
- `POST /tournaments/:id/score` - Submit score
- `GET /tournaments/:id/leaderboard` - Get leaderboard

### Authentication
All tournament API calls require Bearer token authentication:
```
Authorization: Bearer <token>
```

## Security Notes

- Authentication tokens are passed securely via URL parameters
- Cross-origin messaging is restricted to trusted domains
- API calls use HTTPS in production
- User data is validated on both client and server

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify API endpoints are accessible
3. Test with different browsers/devices
4. Check network connectivity

---

**Deployment Ready!** 🚀

The integration now supports both local development and production hosting seamlessly.
