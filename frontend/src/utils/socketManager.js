// Socket connection manager to handle user identification and prevent duplicate connections
import socket from '../socket.js';

class SocketManager {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
  }

  // Initialize socket connection with user identification
  initializeSocket() {
    if (this.isInitialized) return;

    // Get user from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
      
      // Emit user identification to prevent duplicate connections
      socket.emit('user_connect', {
        userId: this.currentUser._id || this.currentUser.id,
        username: this.currentUser.username,
        email: this.currentUser.email
      });

      this.isInitialized = true;
      console.log('Socket initialized for user:', this.currentUser.username);
    }
  }

  // Reinitialize if user changes
  updateUser() {
    const user = localStorage.getItem('user');
    if (user) {
      const newUser = JSON.parse(user);
      if (!this.currentUser || this.currentUser._id !== newUser._id) {
        this.currentUser = newUser;
        this.isInitialized = false;
        this.initializeSocket();
      }
    }
  }

  // Get current user ID
  getCurrentUserId() {
    if (!this.currentUser) {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUser = JSON.parse(user);
      }
    }
    return this.currentUser?._id || this.currentUser?.id;
  }

  // Disconnect socket
  disconnect() {
    if (socket) {
      socket.disconnect();
      this.isInitialized = false;
      this.currentUser = null;
    }
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;
