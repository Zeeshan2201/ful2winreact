// src/socket.js
import { io } from 'socket.io-client';

// Use the deployed backend URL here
const socket = io('http://ful2winreact.onrender.com');
// const socket = io('http://localhost:5000');
export default socket;
