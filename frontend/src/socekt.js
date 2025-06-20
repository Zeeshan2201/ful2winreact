// src/socket.js
import { io } from 'socket.io-client';
import API_CONFIG from './config/api.js';

// Automatically use the correct URL based on environment
const socket = io(API_CONFIG.SOCKET_URL);
export default socket;
