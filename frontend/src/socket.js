// src/socket.js
import { io } from 'socket.io-client';
import API_CONFIG from './config/api.js';

// Create socket instance with proper configuration to prevent multiple connections
let socket;

const getSocket = () => {
  if (!socket) {
    socket = io(API_CONFIG.SOCKET_URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      forceNew: false, // Prevent creating new connections
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
      timeout: 20000,
      // Prevent multiple connections from same client
      autoConnect: true,
    });    // Add connection event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      
      // Send user identification if user is logged in
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          socket.emit('user_identify', { userId: user._id, username: user.username });
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });
  }
  return socket;
};

// Export singleton socket instance
export default getSocket();
