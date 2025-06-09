import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Users, Clock, Trophy, Gamepad, Star, ArrowRight } from "lucide-react";
import { useWallet } from "../context/WalletContext";

// Import all game components with their game logic wrappers
import MemoryMatchGameLogic from "../games/Memory/MemoryMatchGameLogic";
import TictactoeGameLogic from "../games/Tictactoe/TictactoeGameLogic";
import CoinflipGameLogic from "../games/Coinflip/CoinflipGameLogic";
import DiceGameLogic from "../games/Dice/DiceGameLogic";
import StoneGameLogic from "../games/Stone-Paper/StoneGameLogic";
import DuckHuntGame from "../games/DuckHunt/logic";
import socket from '../socekt';
const EnhancedGameLobby = ({
  entryFee = 10,
  gameMode = "Classic",
  gameImg="/"+gameImg+".jpg",
  onPlayAgain = null,
  onExit = null,
  gameId: propGameId = null,
  initialStatus = "waiting",
  tournamentMatches = 5 // Default to 5 matches if not specified
}) => {
  const params = useParams();
  const routeGameId = params.gameId;
  const gameId = propGameId || routeGameId || "memorymatch";
  // const gameId = '6650c2b234def789abc00001';
  const navigate = useNavigate();
  const { addMoney } = useWallet();
  
  // Reference to track if prize was already awarded
  const prizeAwarded = useRef(false);
  
  // Game states
  const [roomId, setRoomId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(initialStatus);
  const [timeLeft, setTimeLeft] = useState(15);
  const [matchFoundTimeLeft, setMatchFoundTimeLeft] = useState(3);
  const [gameBg, setGameBg] = useState("");
  const [playersInQueue, setPlayersInQueue] = useState(1243);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [opponent, setOpponent] = useState(null);
  const [isActionGame, setIsActionGame] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  
  // Play again countdown timer
  const [playAgainCountdown, setPlayAgainCountdown] = useState(10);
  const playAgainTimerRef = useRef(null);
  
  // For Classic mode, match the exact prize amounts
  const getPrizeFromEntry = (entry) => {
    if (entry === 5) return 8;
    if (entry === 10) return 15; 
    if (entry === 15) return 23;
    return Math.round(entry * 1.8);
  };

  const [prizeAmount, setPrizeAmount] = useState(getPrizeFromEntry(entryFee));
  const [isTournament, setIsTournament] = useState(gameMode?.toLowerCase() === "tournament");
  const [tournamentWins, setTournamentWins] = useState({ player: 0, opponent: 0 });
  const [currentTournamentMatch, setCurrentTournamentMatch] = useState(0);
  const [maxTournamentMatches, setMaxTournamentMatches] = useState(tournamentMatches || 5);
  const [winner, setWinner] = useState(null)
  const [player1Score, setPlayer1Score] = useState(null)
  const [player2Score, setPlayer2Score] = useState(null)
  // Set up game background and determine if it's an action game
  // uncommented code
  // useEffect(() => {
    // if (gameId) {
    //   setGameBg(`/${gameId.toLowerCase()}.jpg`);
    //   setIsActionGame(["bgmi", "freefire"].includes(gameId.toLowerCase()));
    // }
    
  //   const isTournamentMode = gameMode?.toLowerCase() === "tournament";
  //   setIsTournament(isTournamentMode);
    
  //   if (isTournamentMode) {
  //     setMaxTournamentMatches(tournamentMatches || 5);
  //     setCurrentTournamentMatch(0);
  //   } else {
  //     setPrizeAmount(getPrizeFromEntry(entryFee));
  //     console.log(entryFee)
  //   }
  // }, [gameId, gameMode, entryFee, tournamentMatches]);
useEffect(() => {
    // Get userId from localStorage
    localStorage.removeItem("match_found");

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    } else {
      setStatus('User not logged in.');
    }

    // Add connection status logging
    console.log("Socket connection status:", socket.connected);

    socket.on('connect', () => {
      console.log("Socket connected");
    });

    socket.on('disconnect', () => {
      console.log("Socket disconnected");
    });

    socket.on('waiting_for_opponent', () => {
      console.log("Received waiting_for_opponent event");
      setStatus('matching');
      setTimeLeft(15);
    });

    socket.on('match_found', ({ roomId, players }) => {
      console.log("Received match_found event", { roomId, players });
      deductEntryFee(entryFee);
      console.log("entryfees"+entryFee)
      localStorage.setItem("match_found", JSON.stringify({ roomId, players }));
      setStatus('matched');
      setRoomId(roomId);
      setMatchFoundTimeLeft(3); // Reset match found timer
      
      // Add a delay before starting the game
      setTimeout(() => {
        console.log("Starting game after match found");
        setStatus('gaming');
      }, 3000);
    });

    socket.on('matchmaking_error', (msg) => {
      console.log("Received matchmaking_error event", msg);
      setStatus(`Error: ${msg}`);
    });

    socket.on('game_start', () => {
      console.log("Received game_start event");
      setStatus('gaming');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('waiting_for_opponent');
      socket.off('match_found');
      socket.off('matchmaking_error');
      socket.off('game_start');
    };
  }, []);

  function deductEntryFee(entryFee) {
    let walletBalance = localStorage.getItem('walletBalance');
    walletBalance = walletBalance ? parseInt(walletBalance, 10) : 0;

    if (walletBalance >= entryFee) {
        walletBalance -= entryFee;
        localStorage.setItem('walletBalance', walletBalance.toString());
        console.log(`Entry fee deducted. New balance: ₹${walletBalance}`);
localStorage.setItem('prizeAmount', prizeAmount.toString());

    } else {
        console.log('Insufficient balance to deduct entry fee.');
    }
}


  // Start matchmaking
  const findMatch = () => {
    if (!userId) {
      setStatus('User not logged in.');
      return;
    }

    setStatus("matching");
    setTimeLeft(15);
    
    setTimeout(() => {
      socket.emit('join_matchmaking', { userId, gameId });
    }, 100);
  };

  // Handle action game room creation
  const handleActionGame = () => {
    setRoomInfo({
      roomId: Math.floor(100000 + Math.random() * 900000).toString(),
      password: Math.floor(1000 + Math.random() * 9000).toString(),
      expiresIn: "10:00"
    });
    setStatus("actionGame");
  };

  // Countdown timer and match simulation
  useEffect(() => {
    let timer;
    let queueTimer;

    if (status === "matching") {
      queueTimer = setInterval(() => {
        setPlayersInQueue(prev => Math.max(1000, prev + Math.floor(Math.random() * 20 - 10)));
      }, 1500);

      timer = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          // If no match found after 15 seconds, go back to waiting
          setStatus("waiting");
          setTimeLeft(15);
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(queueTimer);
      };
    } else if (status === "matched") {
      timer = setTimeout(() => {
        if (matchFoundTimeLeft > 0) {
          setMatchFoundTimeLeft(matchFoundTimeLeft - 1);
        } else {
          setStatus("gaming");
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [status, timeLeft, matchFoundTimeLeft]);

  // Play Again countdown timer
  const startPlayAgainCountdown = () => {
    setPlayAgainCountdown(10);
    
    if (playAgainTimerRef.current) {
      clearInterval(playAgainTimerRef.current);
      playAgainTimerRef.current = null;
    }
    
    playAgainTimerRef.current = setInterval(() => {
      setPlayAgainCountdown(prev => {
        if (prev <= 1) {
          clearInterval(playAgainTimerRef.current);
          playAgainTimerRef.current = null;
          setTimeout(handlePlayAgain, 10);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (playAgainTimerRef.current) {
        clearInterval(playAgainTimerRef.current);
      }
    };
  }, []);

  // Handle exit/back navigation
  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate(`/games/${gameId}`);
    }
  };
  
  // Handle play again
  const handlePlayAgain = () => {
    setScore({ player: 0, opponent: 0 });
    
    setOpponent({
      name: `Player_${Math.floor(Math.random() * 10000)}`,
      skill: ["Novice", "Intermediate", "Expert"][Math.floor(Math.random() * 3)],
      avatar: `/avatar${Math.floor(Math.random() * 5) + 1}.jpg`
    });
    
    setStatus("matched");
    setTimeLeft(15);
    
    if (playAgainTimerRef.current) {
      clearInterval(playAgainTimerRef.current);
      playAgainTimerRef.current = null;
    }
    
    setTimeout(() => {
      setStatus("gaming");
    }, 3000);
  };

  // Get game title with proper capitalization
  const getGameTitle = () => {
    if (!gameId) return "Game";
    if (gameId.toLowerCase() === "bgmi") return "BGMI";
    if (gameId.toLowerCase() === "tictactoe") return "Tic-Tac-Toe";
    return gameId.charAt(0).toUpperCase() + gameId.slice(1);
  };

  // Add a function to handle tournament progress
  const handleTournamentProgress = (playerWon) => {
    setCurrentTournamentMatch(prev => prev + 1);
    setTournamentWins(prev => {
      if (playerWon) {
        return { ...prev, player: prev.player + 1 };
      } else {
        return { ...prev, opponent: prev.opponent + 1 };
      }
    });
  };

  // Handle game completion based on game type
  const handleGameCompletion = (result) => {
    console.log("Game ended with result:", result);
    console.log("result"+result.winner)
    console.log("result"+result.score.player)
    console.log("result"+result.score.opponent)
    console.log("result"+result.player1Score)
    console.log("result"+result.player2Score)
    setWinner(result.winner)
    setPlayer1Score(result.player1Score)
    setPlayer2Score(result.player2Score)
    // Use the actual scores from game result
    setScore({
      player: result.score.player,
      opponent: result.score.opponent
    });
    
    // Check if player won and add prize to wallet in classic mode
    const playerWon = result.winner === "player";
    if (!isTournament && playerWon && !prizeAwarded.current) {
      // Get game info from localStorage or use default values
      let gameInfo = { winAmount: prizeAmount };
      try {
        const savedInfo = localStorage.getItem("currentGameInfo");
        if (savedInfo) {
          gameInfo = JSON.parse(savedInfo);
        }
      } catch (err) {
        console.error("Error parsing game info:", err);
      }
      
      // Add prize to wallet
      if (addMoney) {
        addMoney(gameInfo.winAmount || prizeAmount, `${getGameTitle()} ${gameMode} prize`);
        // Mark prize as awarded to prevent duplicate credits on replay
        prizeAwarded.current = true;
      }
    }
    
    // If tournament mode, update tournament progress
    if (isTournament) {
      handleTournamentProgress(playerWon);
    }
    
    setStatus("results");
    startPlayAgainCountdown();
  };
  
  // Render the appropriate game component based on gameId
  const renderGameComponent = () => {
    console.log("Rendering game component for gameId:", gameId);
    console.log("Current status:", status);
    
    // Try to dynamically import and render game component based on gameId
    if(localStorage.getItem("match_found")){
    try {
      // Map of game IDs to their corresponding logic components
      const gameComponents = {
        "memorymatch": MemoryMatchGameLogic,
        "tictactoe": TictactoeGameLogic,
        "coinflip": CoinflipGameLogic,
        "dice": DiceGameLogic,
        "stonepaper": StoneGameLogic,
        "duckhuntgame": DuckHuntGame
      };
      
      // Get the component from the map or use a fallback
      const GameComponent = gameComponents[gameId.toLowerCase()];
      
      if (GameComponent) {
        console.log("Found game component:", GameComponent.name);
        return (
          <div className="w-full h-full">
            <GameComponent 
              onGameEnd={handleGameCompletion} 
              roomId={roomId}
              userId={userId}
            />
          </div>
        );
      } else {
        console.warn(`No component found for game: ${gameId}. Using fallback.`);
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <Gamepad size={48} className="text-white mb-4" />
            <h2 className="text-2xl font-light text-white mb-2">Game Loading...</h2>
            <p className="text-white/70">This game will be available soon!</p>
          </div>
        );
      }
    } catch (error) {
      console.error(`Error loading game component for ${gameId}:`, error);
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Gamepad size={48} className="text-white mb-4" />
          <h2 className="text-2xl font-light text-white mb-2">Something went wrong</h2>
          <p className="text-white/70">Unable to load game. Please try again.</p>
          <button 
            onClick={handleExit} 
            className="mt-4 px-4 py-2 bg-red-500 rounded-lg text-white"
          >
            Return to Menu
          </button>
        </div>
      );
    }
    }else{
      console.log("nothing")
    }

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Dynamic Game Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={"/"+gameImg+".jpg" || "/placeholder.jpg"} 
          alt="Game Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Header (shown on all screens) */}
      <div className="absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-center">
        <button
          onClick={handleExit}
          className="text-white bg-gray-800/50 p-2 rounded-full hover:bg-gray-700/50 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-white font-medium">
          {getGameTitle()} - {gameMode} Mode
        </div>
        <div className="bg-gray-800/50 px-3 py-1 rounded-full text-xs text-white">
          Entry: ₹{entryFee}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md p-6">
        {/* Waiting to Start */}
        {status === "waiting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-3xl font-light text-white mb-2">{getGameTitle()} {isActionGame ? 'Battle' : 'Match'}</h1>
            <p className="text-white/80 mb-8">{isActionGame ? 'Join the battlefield and emerge victorious' : 'Play and win real rewards'}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={findMatch}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:brightness-110 transition-all"
            >
              Find Match
            </motion.button>
            
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center text-sm text-white/70 mb-2">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>{isTournament ? "Tournament:" : "Prize Pool:"}</span>
                </div>
                {isTournament ? (
                  <span className="text-yellow-400 font-medium">Best of {maxTournamentMatches}</span>
                ) : (
                  <span className="text-yellow-400 font-medium">₹{prizeAmount}</span>
                )}
              </div>
              <div className="flex justify-between items-center text-sm text-white/70">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-blue-400" />
                  <span>Players:</span>
                </div>
                <span className="text-white">{isActionGame ? '100' : '2'}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Matching in Progress */}
        {status === "matching" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="flex justify-center space-x-12 mb-10">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                  <img src="/avatar0.jpg" alt="You" className="w-full h-full object-cover" />
                </div>
                <span className="text-white">You</span>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-white/50">?</span>
                </div>
                <span className="text-white/50">Opponent</span>
              </div>
            </div>

            <div className="text-4xl font-light text-white mb-6">{timeLeft}</div>
            
            <div className="h-1 bg-white/20 mb-6">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3 }}
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/80 text-sm">Search Time</p>
                <p className="text-white font-medium">00:{timeLeft.toString().padStart(2, '0')}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/80 text-sm">In Queue</p>
                <p className="text-white font-medium">{playersInQueue.toLocaleString()}</p>
              </div>
            </div>

            {/* Show either prize or tournament info */}
            {isTournament ? (
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <p className="text-white/80 text-sm">Tournament</p>
                <p className="text-white font-medium">Best of {maxTournamentMatches}</p>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <p className="text-white/80 text-sm">Prize Pool</p>
                <p className="text-white font-medium">₹{prizeAmount}</p>
              </div>
            )}

            <p className="text-white/60 mb-2">Finding opponent...</p>
            <p className="text-white/40 text-sm">Matching with similar skill players</p>

            <button
              onClick={handleExit}
              className="mt-6 w-full py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
            >
              Cancel Search
            </button>
          </motion.div>
        )}

        {/* Match Found (for normal games) */}
        {status === "matched" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-5xl mb-8"
            >
              🎮
            </motion.div>
            <h2 className="text-2xl font-light text-white mb-2">Match Found!</h2>
            <p className="text-white/70">Playing against {opponent?.name}</p>
            
            <div className="flex justify-center mt-8 space-x-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                  <img src="/avatar0.jpg" alt="You" className="w-full h-full object-cover" />
                </div>
                <span className="text-white text-sm">You</span>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                  <img src={opponent?.avatar || "/avatar1.jpg"} alt="Opponent" className="w-full h-full object-cover" />
                </div>
                <span className="text-white text-sm">{opponent?.name}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-white/50 text-sm mb-2">Game starting in:</p>
              <div className="flex justify-center items-center">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                  key={matchFoundTimeLeft}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1 }}
                >
                  <span className="text-2xl font-light text-white">{matchFoundTimeLeft}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Gaming Status */}
        {status === "gaming" && (
          <div className="fixed inset-0 z-20 bg-black/80">
            <div className="w-full h-full flex items-center justify-center">
              {renderGameComponent()}
            </div>
          </div>
        )}
        
        {/* Action Game Room Info */}
        {status === "actionGame" && roomInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-medium text-white mb-6 text-center">Room Details</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <p className="text-white/50 text-sm mb-1">Room ID</p>
                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold text-white bg-white/10 rounded px-3 py-1.5 w-full text-center">
                    {roomInfo.roomId}
                  </div>
                  <button className="ml-2 bg-blue-500/20 text-blue-400 p-1.5 rounded hover:bg-blue-500/30 text-xs">
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-white/50 text-sm mb-1">Password</p>
                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold text-white bg-white/10 rounded px-3 py-1.5 w-full text-center">
                    {roomInfo.password}
                  </div>
                  <button className="ml-2 bg-blue-500/20 text-blue-400 p-1.5 rounded hover:bg-blue-500/30 text-xs">
                    Copy
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Expires in:</span>
                <span className="text-white font-medium">{roomInfo.expiresIn} minutes</span>
              </div>
            </div>
            
            <div className="text-white/70 text-sm mb-8">
              <p className="mb-1">Instructions:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Open {getGameTitle()} app on your device</li>
                <li>Go to custom room section</li>
                <li>Enter Room ID and Password</li>
                <li>Wait for all players to join</li>
              </ol>
            </div>
            
            <button
              onClick={handleExit}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:brightness-110 transition-all"
            >
              Back to Game Selection
            </button>
          </motion.div>
        )}

        {/* Results Status */}
        {status === "results" && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6">
              {winner === "player" ? (
                <span className="text-green-400">You Won!</span>
              ) : (
                <span className="text-red-400">Better luck next time!</span>
              )}
              {/* {score.player > score.opponent ? (
                <span className="text-green-400">You Won!</span>
              ) : (
                <span className="text-red-400">Better luck next time!</span>
              )} */}
            </h2>
            
            {/* <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden ${
                  score.player > score.opponent ? "bg-green-500/20 border-2 border-green-500/50" : "bg-white/10 border border-white/30"
                }`}>
                  <img src="/avatar0.jpg" alt="You" className="w-full h-full object-cover" />
                </div>
                {winner === "player" ? <div className="text-2xl font-medium text-white">{player1Score>player2Score?player2Score:player1Score}</div>:
                <div className="text-2xl font-medium text-white">{player1Score>player2Score?player2Score:player1Score}</div>}
                {score.player > score.opponent && (
                  <div className="text-xs text-green-400 mt-1">WINNER</div>
                )}
              </div>
              
              <div className="text-xl text-white/50">vs</div>
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden ${
                  score.player < score.opponent ? "bg-green-500/20 border-2 border-green-500/50" : "bg-white/10 border border-white/30"
                }`}>
                  <img src={opponent?.avatar || "/avatar1.jpg"} alt="Opponent" className="w-full h-full object-cover" />
                </div>
                <div className="text-2xl font-medium text-white">{score.opponent}</div>
                {score.player < score.opponent && (
                  <div className="text-xs text-green-400 mt-1">WINNER</div>
                )}
              </div>
            </div> */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden ${
                  score.player > score.opponent ? "bg-green-500/20 border-2 border-green-500/50" : "bg-white/10 border border-white/30"
                }`}>
                  <img src="/avatar0.jpg" alt="You" className="w-full h-full object-cover" />
                </div>
                <div className="text-2xl font-medium text-white">{score.player}</div>
                {score.player > score.opponent && (
                  <div className="text-xs text-green-400 mt-1">WINNER</div>
                )}
              </div>
              
              <div className="text-xl text-white/50">vs</div>
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden ${
                  score.player < score.opponent ? "bg-green-500/20 border-2 border-green-500/50" : "bg-white/10 border border-white/30"
                }`}>
                  <img src={opponent?.avatar || "/avatar1.jpg"} alt="Opponent" className="w-full h-full object-cover" />
                </div>
                <div className="text-2xl font-medium text-white">{score.opponent}</div>
                {score.player < score.opponent && (
                  <div className="text-xs text-green-400 mt-1">WINNER</div>
                )}
              </div>
            </div>

            {/* Show different reward info based on mode */}
            {isTournament ? (
              <div className="bg-white/10 rounded-lg p-3 mb-6">
                <div className="text-white font-medium text-center mb-2">Tournament Progress</div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Your Wins:</span>
                  <span className="text-yellow-400 font-medium">
                    {tournamentWins.player} of {maxTournamentMatches}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-white/70">Opponent Wins:</span>
                  <span className="text-white/70 font-medium">
                    {tournamentWins.opponent} of {maxTournamentMatches}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full mt-3">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ 
                      width: `${(tournamentWins.player / maxTournamentMatches) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-lg p-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Prize Won:</span>
                  <span className="text-yellow-400 font-medium">
                    ₹{score.player > score.opponent ? prizeAmount : 0}
                  </span>
                </div>
              </div>
            )}

            {/* Play Again and Quit buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Play Again button with animation */}
              <div className="relative" style={{ minHeight: "46px" }}>
                <div 
                  className="absolute inset-0 rounded-lg overflow-hidden border-2 border-white/20"
                  style={{ pointerEvents: "none" }}
                >
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-white/30 h-full"
                    style={{ 
                      width: `${playAgainCountdown * 10}%`,
                      transition: "width 1s linear"
                    }}
                  />
                </div>
                
                <button
                  onClick={handlePlayAgain}
                  className="relative w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:brightness-110 transition-all font-medium z-10"
                >
                  Play Again
                </button>
              </div>
              
              <button
                onClick={handleExit}
                className="py-3 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition font-medium"
              >
                Quit Game
              </button>
            </div>
            
            <div className="mt-4 text-center text-white/60 text-sm">
              Auto-restart in {playAgainCountdown}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGameLobby;