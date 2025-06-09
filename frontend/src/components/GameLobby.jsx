// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ChevronLeft, Users, Clock, Trophy, Gamepad } from 'lucide-react';

// const GameLobby = () => {
//   const { gameId } = useParams();
//   const navigate = useNavigate();
  
//   const [status, setStatus] = useState('waiting'); // waiting, matching, matched, gaming, results
//   const [timeLeft, setTimeLeft] = useState(3);
//   const [gameBg, setGameBg] = useState('');
//   const [playersInQueue, setPlayersInQueue] = useState(1243);
//   const [score, setScore] = useState({ player: 0, opponent: 0 });
//   const [opponent, setOpponent] = useState(null);
//   const [roomInfo, setRoomInfo] = useState(null);
//   const [entryFee, setEntryFee] = useState(10);
//   const [isActionGame, setIsActionGame] = useState(false);
  
//   // Set up game background and determine if it's an action game
//   useEffect(() => {
//     if (gameId) {
//       setGameBg(`/${gameId.toLowerCase()}.jpg`);
//       setIsActionGame(['bgmi', 'freefire'].includes(gameId.toLowerCase()));
//     }
//   }, [gameId]);

//   // Start matchmaking
//   const findMatch = () => {
//     setStatus('matching');
//     setTimeLeft(3);
//     setPlayersInQueue(Math.floor(Math.random() * 500) + 500);
//   };

//   // Handle action game room creation
//   const handleActionGame = () => {
//     // Generate room info for action games
//     setRoomInfo({
//       roomId: Math.floor(100000 + Math.random() * 900000).toString(),
//       password: Math.floor(1000 + Math.random() * 9000).toString(),
//       expiresIn: '10:00'
//     });
//     setStatus('actionGame');
//   };

//   // Countdown timer and match simulation
//   useEffect(() => {
//     let timer;
//     let queueTimer;

//     if (status === 'matching') {
//       // Update queue count periodically
//       queueTimer = setInterval(() => {
//         setPlayersInQueue(prev => Math.max(1000, prev + Math.floor(Math.random() * 20 - 10)))
//       }, 1500);

//       // Countdown timer
//       timer = setTimeout(() => {
//         if (timeLeft > 0) {
//           setTimeLeft(timeLeft - 1);
//         } else {
//           // Match found
//           setOpponent({
//             name: `Player_${Math.floor(Math.random() * 10000)}`,
//             skill: ['Novice', 'Intermediate', 'Expert'][Math.floor(Math.random() * 3)],
//             avatar: `/avatar${Math.floor(Math.random() * 5) + 1}.jpg`
//           });
          
//           // For action games, show room info
//           if (isActionGame) {
//             handleActionGame();
//           } else {
//             setStatus('matched');
            
//             // Simulate game duration (3s for normal games)
//             setTimeout(() => {
//               setStatus('gaming');
              
//               // Simulate game completion after 2 seconds
//               setTimeout(() => {
//                 // Generate random scores for normal games
//                 setScore({
//                   player: Math.floor(Math.random() * 100),
//                   opponent: Math.floor(Math.random() * 100)
//                 });
//                 setStatus('results');
//               }, 2000);
//             }, 2000);
//           }
//         }
//       }, 1000);

//       return () => {
//         clearTimeout(timer);
//         clearInterval(queueTimer);
//       };
//     }
//   }, [status, timeLeft, isActionGame]);

//   // Handle exit/back navigation
//   const handleExit = () => {
//     navigate(`/game/${gameId}`);
//   };
  
//   // Handle play again
//   const handlePlayAgain = () => {
//     setStatus('waiting');
//     setTimeLeft(3);
//     setScore({ player: 0, opponent: 0 });
//     setOpponent(null);
//     setRoomInfo(null);
//   };

//   // Get game title with proper capitalization
//   const getGameTitle = () => {
//     if (!gameId) return 'Game';
//     if (gameId.toLowerCase() === 'bgmi') return 'BGMI';
//     if (gameId.toLowerCase() === 'tictactoe') return 'Tic-Tac-Toe';
//     return gameId.charAt(0).toUpperCase() + gameId.slice(1);
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center">
//       {/* Dynamic Game Background */}
//       <div className="absolute inset-0 z-0">
//         <img 
//           src={gameBg || '/placeholder.jpg'} 
//           alt="Game Background" 
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
//       </div>

//       {/* Header (shown on all screens) */}
//       <div className="absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-center">
//         <button
//           onClick={handleExit}
//           className="text-white bg-gray-800/50 p-2 rounded-full hover:bg-gray-700/50 transition-all"
//         >
//           <ChevronLeft size={20} />
//         </button>
//         <div className="text-white font-medium">{getGameTitle()}</div>
//         <div className="w-8"></div> {/* Empty space for alignment */}
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-md p-6">
//         {/* Waiting to Start */}
//         {status === 'waiting' && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center"
//           >
//             <h1 className="text-3xl font-light text-white mb-2">{getGameTitle()} {isActionGame ? 'Battle' : 'Match'}</h1>
//             <p className="text-white/80 mb-8">{isActionGame ? 'Join the battlefield and emerge victorious' : 'Play and win real rewards'}</p>
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               onClick={findMatch}
//               className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:brightness-110 transition-all"
//             >
//               Find Match
//             </motion.button>
            
//             <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
//               <div className="flex justify-between items-center text-sm text-white/70 mb-2">
//                 <div className="flex items-center">
//                   <Trophy className="h-4 w-4 mr-1 text-yellow-400" />
//                   <span>Prize Pool:</span>
//                 </div>
//                 <span className="text-yellow-400 font-medium">₹{entryFee * 1.8}</span>
//               </div>
//               <div className="flex justify-between items-center text-sm text-white/70">
//                 <div className="flex items-center">
//                   <Users className="h-4 w-4 mr-1 text-blue-400" />
//                   <span>Players:</span>
//                 </div>
//                 <span className="text-white">{isActionGame ? '100' : '2'}</span>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Matching in Progress */}
//         {status === 'matching' && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center"
//           >
//             <div className="flex justify-center space-x-12 mb-10">
//               <div className="text-center">
//                 <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 overflow-hidden">
//                   <img src="/avatar0.jpg" alt="You" className="w-full h-full object-cover" />
//                 </div>
//                 <span className="text-white">You</span>
//               </div>
              
//               <div className="text-center">
//                 <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2">
//                   <span className="text-white/50">?</span>
//                 </div>
//                 <span className="text-white/50">Opponent</span>
//               </div>
//             </div>

//             <div className="text-4xl font-light text-white mb-6">{timeLeft}</div>
            
//             <div className="h-1 bg-white/20 mb-6">
//               <motion.div
//                 initial={{ width: '0%' }}
//                 animate={{ width: '100%' }}
//                 transition={{ duration: 3 }}
//                 className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div className="bg-white/5 rounded-lg p-3">
//                 <p className="text-white/80 text-sm">Search Time</p>
//                 <p className="text-white font-medium">00:{timeLeft.toString().padStart(2, '0')}</p>
//               </div>
//               <div className="bg-white/5 rounded-lg p-3">
//                 <p className="text-white/80 text-sm">In Queue</p>
//                 <p className="text-white font-medium">{playersInQueue.toLocaleString()}</p>
//               </div>
//             </div>

//             <p className="text-white/60 mb-2">Finding opponent...</p>
//             <p className="text-white/40 text-sm">Matching with similar skill players</p>

//             <button
//               onClick={handleExit}
//               className="mt-6 w-full py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
//             >
//               Cancel Search
//             </button>
//           </motion.div>
//         )}

//         {/* Match Found (for normal games) */}
//         {status === 'matched' && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center"
//           >
//             <motion.div
//               animate={{ 
//                 scale: [1, 1.1, 1],
//                 opacity: [0.8, 1, 0.8]
//               }}
//               transition={{ repeat: Infinity, duration: 1.5 }}
//               className="text-5xl mb-8"
//             >
//               🎮
//             </motion.div>
//             <h2 className="text-2xl font-light text-white mb-2">Match Found!</h2>
//             <p className="text-white/70">Playing against {opponent?.name}</p>
            
//             <div className="flex justify-center mt-8 space-x-8">
//               <div className="text-center">
//                 <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 overflow-hidden">
//                   <img src="/avatar0.jpg" alt="You" className="w-full h-full object-cover" />
//                 </div>
//                 <span className="text-white text-sm">You</span>
//               </div>
              
//               <div className="text-center">
//                 <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 overflow-hidden">
//                   <img src={opponent?.avatar || "/avatar1.jpg"} alt="Opponent" className="w-full h-full object-cover" />
//                 </div>
//                 <span className="text-white text-sm">{opponent?.name}</span>
//               </div>
//             </div>
            
//             <p className="text-white/50 text-sm mt-8">Game starting in 2 seconds...</p>
//           </motion.div>
//         )}
        
//         {/* Gaming Status (brief animation) */}
//         {status === 'gaming' && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center"
//           >
//             <div className="w-24 h-24 mx-auto mb-6">
//               <motion.div 
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
//               >
//                 <Gamepad size={96} className="text-white" />
//               </motion.div>
//             </div>
//             <h2 className="text-2xl font-light text-white mb-2">Game in Progress</h2>
//             <p className="text-white/70">Calculating results...</p>
//           </motion.div>
//         )}
        
//         {/* Action Game Room Info */}
//         {status === 'actionGame' && roomInfo && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10"
//           >
//             <h2 className="text-2xl font-medium text-white mb-6 text-center">Room Details</h2>
            
//             <div className="space-y-6 mb-8">
//               <div>
//                 <p className="text-white/50 text-sm mb-1">Room ID</p>
//                 <div className="flex justify-between items-center">
//                   <div className="text-xl font-bold text-white bg-white/10 rounded px-3 py-1.5 w-full text-center">
//                     {roomInfo.roomId}
//                   </div>
//                   <button className="ml-2 bg-blue-500/20 text-blue-400 p-1.5 rounded hover:bg-blue-500/30 text-xs">
//                     Copy
//                   </button>
//                 </div>
//               </div>
              
//               <div>
//                 <p className="text-white/50 text-sm mb-1">Password</p>
//                 <div className="flex justify-between items-center">
//                   <div className="text-xl font-bold text-white bg-white/10 rounded px-3 py-1.5 w-full text-center">
//                     {roomInfo.password}
//                   </div>
//                   <button className="ml-2 bg-blue-500/20 text-blue-400 p-1.5 rounded hover:bg-blue-500/30 text-xs">
//                     Copy
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white/10 rounded-lg p-4 mb-6">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-white/70">Expires in:</span>
//                 <span className="text-white font-medium">{roomInfo.expiresIn} minutes</span>
//               </div>
//             </div>
            
//             <div className="text-white/70 text-sm mb-8">
//               <p className="mb-1">Instructions:</p>
//               <ol className="list-decimal pl-5 space-y-1">
//                 <li>Open {getGameTitle()} app on your device</li>
//                 <li>Go to custom room section</li>
//                 <li>Enter Room ID and Password</li>
//                 <li>Wait for all players to join</li>
//               </ol>
//             </div>
            
//             <button
//               onClick={handleExit}
//               className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:brightness-110 transition-all"
//             >
//               Back to Game Selection
//             </button>
//           </motion.div>
//         )}

//         {/* Results Screen */}
//         {status === 'results' && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10"
//           >
//             <h2 className="text-2xl font-light text-white mb-8 text-center">
//               {score.player > score.opponent ? (
//                 <span className="text-green-400">Victory!</span>
//               ) : score.player < score.opponent ? (
//                 <span className="text-red-400">Defeat</span>
//               ) : (
//                 <span className="text-yellow-400">Draw!</span>
//               )}
//             </h2>
            
//             <div className="flex justify-between items-center mb-10">
//               <div className="text-center">
//                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden ${
//                   score.player > score.opponent ? 'bg-green-500/30 border border-green-500/50' : 
//                   'bg-blue-500/30 border border-blue-500/50'
//                 }`}>
//                   <img src="/avatar0.jpg" alt="You" className="w-full h-full object-cover" />
//                 </div>
//                 <div className={`text-3xl font-medium ${
//                   score.player > score.opponent ? 'text-green-400' : 'text-blue-400'
//                 }`}>
//                   {score.player}
//                 </div>
//                 {score.player > score.opponent && (
//                   <div className="text-xs text-green-400 mt-1">WINNER</div>
//                 )}
//               </div>
              
//               <div className="text-xl text-white/50">vs</div>
              
//               <div className="text-center">
//                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden ${
//                   score.opponent > score.player ? 'bg-green-500/30 border border-green-500/50' : 
//                   'bg-red-500/30 border border-red-500/50'
//                 }`}>
//                   <img src={opponent?.avatar || "/avatar1.jpg"} alt="Opponent" className="w-full h-full object-cover" />
//                 </div>
//                 <div className={`text-3xl font-medium ${
//                   score.opponent > score.player ? 'text-green-400' : 'text-red-400'
//                 }`}>
//                   {score.opponent}
//                 </div>
//                 {score.opponent > score.player && (
//                   <div className="text-xs text-green-400 mt-1">WINNER</div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white/10 rounded-lg p-4 mb-8">
//               <div className="flex justify-between items-center">
//                 <span className="text-white/70">Prize Won:</span>
//                 <span className="text-yellow-400 font-medium">
//                   ₹{score.player > score.opponent ? entryFee * 1.8 : score.player === score.opponent ? entryFee : 0}
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handlePlayAgain}
//                 className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:brightness-110 transition-all font-medium"
//               >
//                 Play Again
//               </motion.button>
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleExit}
//                 className="py-3 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition font-medium"
//               >
//                 Quit Game
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GameLobby; 
// src/components/FindMatchButton.jsx
import React, { useEffect, useState } from 'react';
import socket from '../socekt';
const userId = '6650b1a123abc456def00001'; // Replace with logged-in user ID
  const gameId = '6650c2b234def789abc00001';
const FindMatchButton = ({ userId, gameId }) => {
  const [status, setStatus] = useState('Click "Find Match"');
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    socket.on('waiting_for_opponent', () => {
      setStatus('Waiting for opponent...');
    });

    socket.on('match_found', ({ roomId, players }) => {
      setStatus('Match found! Joining...');
      setRoomId(roomId);
      // TODO: redirect or navigate to the game room
      console.log('Players:', players);
    });

    socket.on('matchmaking_error', (msg) => {
      setStatus(`Error: ${msg}`);
    });

    return () => {
      socket.off('waiting_for_opponent');
      socket.off('match_found');
      socket.off('matchmaking_error');
    };
  }, []);

  const handleFindMatch = () => {
    setStatus('Searching...');
    socket.emit('join_matchmaking', { userId, gameId });
  };
console.log("i am good")
  return (
    <div className="p-4 border rounded-xl max-w-md mx-auto text-center shadow">
      <h2 className="text-lg mb-2">Online Matchmaking</h2>
      <button
        onClick={handleFindMatch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
      >
        Find Match
      </button>
      <p className="mt-4">{status}</p>
      {roomId && (
        <div className="mt-2 text-green-600 font-semibold">
          ✅ Joined Room: {roomId}
        </div>
      )}
    </div>
  );
};

export default FindMatchButton;
