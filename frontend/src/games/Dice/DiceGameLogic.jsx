"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import socket from "../../socket";
import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import Confetti from "react-confetti";
import API_CONFIG from '../../config/api.js';
import "./roundHighlight.css";
import "./rollDiceBtn.css";

// Placeholder components
const WinBurst = ({ prizeAmount, playerScore, opponentScore }) => (
  <div className="text-center">
    <Confetti />
    <h2 className="text-3xl font-bold text-green-400 mb-2">Congratulations! You Won! 🎉</h2>
    <h3 className="text-xl text-green-300 mb-4">+₹{prizeAmount}</h3>
    <p className="text-lg text-white/90 mb-2">Final Score: {playerScore} - {opponentScore}</p>
    <p className="text-sm text-white/80">Great game! Would you like to play again?</p>
  </div>
);

const TieBurst = ({ score }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-yellow-400 mb-2">It's a Tie! 🤝</h2>
    <p className="text-lg text-white/90 mb-2">Final Score: {score} - {score}</p>
    <p className="text-sm text-white/80">So close! Want to break the tie?</p>
  </div>
);

const LossBurst = ({ playerScore, opponentScore }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-red-400 mb-2">Game Over - You Lost! 😔</h2>
    <p className="text-lg text-white/90 mb-2">Final Score: {playerScore} - {opponentScore}</p>
    <p className="text-sm text-white/80">Better luck next time! Try again?</p>
  </div>
);

const DiceDots = ({ value, size }) => {
  const dotClass = size === "large" ? "w-4 h-4" : "w-2 h-2";
  const dots = {
    1: [[2, 2]],
    2: [[0, 0], [4, 4]],
    3: [[0, 0], [2, 2], [4, 4]],
    4: [[0, 0], [0, 4], [4, 0], [4, 4]],
    5: [[0, 0], [0, 4], [2, 2], [4, 0], [4, 4]],
    6: [[0, 0], [0, 2], [0, 4], [4, 0], [4, 2], [4, 4]],
  };
  return (
    <div className="grid grid-cols-5 gap-1 w-full h-full p-2">
      {value && dots[value] ? (
        dots[value].map(([x, y], i) => (
          <div
            key={i}
            className={`${dotClass} bg-black rounded-full`}
            style={{ gridColumn: x + 1, gridRow: y + 1 }}
          />
        ))
      ) : (
        <div className="text-center text-gray-400"></div>
      )}
    </div>
  );
};

const findMatch = () => {
  if (!userId) {
    setError("User not authenticated");
    return;
  }
  if (balance < entryFee) {
    setError("Insufficient balance to join match");
    return;
  }
  if (!socket.connected) {
    socket.connect();
    setTimeout(() => {
      if (!socket.connected) {
        setError("Not connected to server. Please try again.");
        return;
      }
      proceedWithMatchmaking();
    }, 1000);
    return;
  }
  proceedWithMatchmaking();
};

const proceedWithMatchmaking = () => {
  // Don't deduct balance here - wait for match_found
  setError(null);
  resetGame();
  socket.emit("join_matchmaking", {
    userId,
    gameId: "dice",
    entryAmount: entryFee,
  });
};
const diceToDots = (value) => (typeof value === "number" && value > 0 ? `${value} Dots` : "");
// Round Result Display Component
const RoundResultDisplay = ({ result, roundNumber }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-30"
  >
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/30"
    >
      <motion.h3 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-2"
      >
        Round {roundNumber} Result
      </motion.h3>
      <motion.h3 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold mb-4"
      >
        {result.winner === "You" && (
          <span className="text-green-400 flex items-center justify-center gap-2">
            You Won This Round! 🎉
          </span>
        )}
        {result.winner === "Opponent" && (
          <span className="text-red-400 flex items-center justify-center gap-2">
            Opponent Won This Round 😔
          </span>
        )}
        {result.winner === "Draw" && (
          <span className="text-yellow-400 flex items-center justify-center gap-2">
            It's a Draw! 🤝
          </span>
        )}
      </motion.h3>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-8 mb-4"
      >
        <div className="text-center">
          <p className="text-sm text-white/80">Your Roll</p>
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mt-2"
          >
            <DiceDots value={result.playerRoll} size="small" />
          </motion.div>
          <p className="mt-2 font-bold">{result.playerRoll}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/80">Opponent's Roll</p>
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mt-2"
          >
            <DiceDots value={result.opponentRoll} size="small" />
          </motion.div>
          <p className="mt-2 font-bold">{result.opponentRoll}</p>
        </div>
      </motion.div>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-sm text-white/80"
      >
        <p>Current Score</p>
        <p className="font-bold">You: {result.currentScore.player} - Opponent: {result.currentScore.opponent}</p>
      </motion.div>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-white/80 mt-4"
      >
        Next round starting in 3 seconds...
      </motion.p>
    </motion.div>
  </motion.div>
);

// Final Result Display (replace WinBurst, LossBurst, TieBurst)
const FinalResult = ({ isPlayer1, scores, prizeAmount }) => {
  let resultText = "";
  let colorClass = "";
  let showConfetti = false;

  // Calculate player and opponent score based on isPlayer1
  const playerScore = isPlayer1 ? scores.player1 : scores.player2;
  const opponentScore = isPlayer1 ? scores.player2 : scores.player1;

  if (playerScore > opponentScore) {
    resultText = "Congratulations! You Won! 🎉";
    colorClass = "text-green-400";
    showConfetti = true;
  } else if (playerScore < opponentScore) {
    resultText = "Game Over - You Lost! 😔";
    colorClass = "text-red-400";
  } else {
    resultText = "It's a Tie! 🤝";
    colorClass = "text-yellow-400";
  }

  return (
    <div className="text-center">
      {showConfetti && <Confetti />}
      <h2 className={`text-3xl font-bold mb-2 ${colorClass}`}>{resultText}</h2>
      {playerScore > opponentScore && (
        <h3 className="text-xl text-green-300 mb-4">+₹{prizeAmount}</h3>
      )}
      <p className="text-lg text-white/90 mb-2">
        Final Score: {playerScore} - {opponentScore}
      </p>
      <p className="text-sm text-white/80">
        {playerScore > opponentScore
          ? "Great game! Would you like to play again?"
          : playerScore < opponentScore
          ? "Better luck next time! Try again?"
          : "So close! Want to break the tie?"}
      </p>
    </div>
  );
};

export default function DiceGameLogic() {
  const matchData = localStorage.getItem("match_found");
  const userData = localStorage.getItem("user");
  const parsedMatchData = matchData ? JSON.parse(matchData) : null;
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const [roomId, setRoomId] = useState(parsedMatchData?.roomId || null);
  const userId = parsedUserData?._id || null;
  const playerId1 = parsedMatchData?.players?.[0]?.userId || null;
  const playerId2 = parsedMatchData?.players?.[1]?.userId || null;

  const [gameId, setGameId] = useState(null);
  const [isPlayer1, setIsPlayer1] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [player1Roll, setPlayer1Roll] = useState(null);
  const [player2Roll, setPlayer2Roll] = useState(null);
  const [lastRolledDice, setLastRolledDice] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [roundNumber, setRoundNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameInitialized, setIsGameInitialized] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [error, setError] = useState(null);
  const [entryFee] = useState(10);
  const [prizeAmount] = useState(15);
  const [balance, setBalance] = useState(parsedUserData?.Balance || 100);
  const [roundHistory, setRoundHistory] = useState([]);  const [status, setStatus] = useState("waiting");
  const [matchingTimeLeft, setMatchingTimeLeft] = useState(15);
  const [turnMessage, setTurnMessage] = useState("");
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [showOpponentPoints, setShowOpponentPoints] = useState(false);
  const [opponentPoints, setOpponentPoints] = useState(null);

  const timerRef = useRef(null);
  const lastUpdateRef = useRef(null);
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);
  const initializationAttemptedRef = useRef(false);
  const hasLeftRoomsRef = useRef(false);
  const retryCountRef = useRef(0);

const BASE_URL = API_CONFIG.BASE_URL;

  const [gameState, setGameState] = useState({
    isInitialized: false,
    lastUpdate: null,
    connectionStatus: 'disconnected',
    errorCount: 0,
    roundTransitionInProgress: false
  });

  // Add debug logging function
  const logGameState = (message, data = {}) => {
    console.log(`[Dice Game Debug] ${message}`, {
      ...data,
      gameState,
      isPlayerTurn,
      isRolling,
      hasRolled,
      roundNumber,
      timeLeft,
      status
    });
  };

  // Initialize socket with userId
  useEffect(() => {
    if (userId && !socket.hasListeners("connect")) {
      socket.io.opts.query = { userId };
      socket.connect();
    }
    return () => {
      socket.off("match_found");
      socket.off("waiting_for_opponent");
      socket.off("matchmaking_error");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("diceGameCreated");
      socket.off("diceGameUpdated");
      socket.disconnect();
    };
  }, [userId]);

  // Prevent back navigation
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);    const handlePopstate = () => {
      window.history.pushState(null, null, window.location.href);
      
      // If user is in matching state, cancel matchmaking and refund
      if (status === "matching") {
        console.log("User going back while matching - cancelling matchmaking");
        socket.emit('leave_matchmaking', { userId, gameId: "dice", entryAmount: entryFee });
      }
      
      setError("Game session ended. Please start a new match.");
      if (!hasLeftRoomsRef.current) {
        socket.emit("leave_all_rooms");
        hasLeftRoomsRef.current = true;
      }
      resetGame();
    };
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  // Handle matchmaking events
  useEffect(() => {    const onMatchFound = ({ roomId, players }) => {
      console.log("Match found:", { roomId, players });
      // Deduct balance only when match is found
      setBalance((prev) => prev - entryFee);
      localStorage.setItem("match_found", JSON.stringify({ roomId, players }));
      setRoomId(roomId);
      setStatus("matched");
      setIsGameInitialized(false);
      initializationAttemptedRef.current = false;
      hasLeftRoomsRef.current = false;
      retryCountRef.current = 0;
    };    const onWaitingForOpponent = () => {
      console.log("Waiting for opponent");
      setStatus("matching");
      setMatchingTimeLeft(15);
    };

    const onMatchmakingError = ({ message, error }) => {
      console.error("Matchmaking error:", message, error);
      setError(`${message}: ${error?.message || error}`);
      setStatus("waiting");
    };    const onMatchmakingCancelled = ({ refundAmount }) => {
      console.log("Matchmaking cancelled, refunding:", refundAmount);
      // Refund the entry fee
      setBalance((prev) => prev + refundAmount);
      setStatus("waiting");
      setMatchingTimeLeft(15);
    };

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
      if (status === "waiting" && !roomId && userId) {
        socket.emit("join_matchmaking", { userId, gameId: "dice", entryAmount: entryFee });
      }
    };

    const onConnectError = (err) => {
      console.error("Socket connection error:", err.message);
      setError("Failed to connect to server. Please try again.");
      setStatus("waiting");
    };    socket.on("match_found", onMatchFound);
    socket.on("waiting_for_opponent", onWaitingForOpponent);
    socket.on("matchmaking_error", onMatchmakingError);
    socket.on("matchmaking_cancelled", onMatchmakingCancelled);
    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("match_found", onMatchFound);
      socket.off("waiting_for_opponent", onWaitingForOpponent);
      socket.off("matchmaking_error", onMatchmakingError);
      socket.off("matchmaking_cancelled", onMatchmakingCancelled);
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
    };  }, [status, roomId, userId, entryFee]);

  // Matchmaking timeout effect
  useEffect(() => {
    let matchingTimer;
    
    if (status === "matching") {
      setMatchingTimeLeft(15);
      matchingTimer = setInterval(() => {
        setMatchingTimeLeft(prev => {
          if (prev <= 1) {
            // Timeout reached - cancel matchmaking
            console.log("Matching timeout - removing from queue");
            socket.emit('matchmaking_timeout', { userId, gameId: "dice", entryAmount: entryFee });
            setStatus("waiting");
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (matchingTimer) {
        clearInterval(matchingTimer);
      }
    };
  }, [status, userId, entryFee]);

  // Timer effect
  useEffect(() => {
    if (isPlayerTurn && timeLeft > 0 && !gameOver && !isRolling) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlayerTurn, timeLeft, gameOver, isRolling]);

  // Initialize game
  const initializeGame = async () => {
    if (!roomId || !userId || !playerId1 || !playerId2) {
      console.error("Missing required data for initialization:", {
        roomId,
        userId,
        playerId1,
        playerId2,
      });
      setError("Invalid match data. Please try finding a new match.");
      setStatus("waiting");
      resetGame();
      return;
    }

    if (initializationAttemptedRef.current && retryCountRef.current >= 3) {
      console.error("Max initialization retries reached for roomId:", roomId);
      setError("Failed to start game after multiple attempts. Please try again.");
      setStatus("waiting");
      resetGame();
      return;
    }

    initializationAttemptedRef.current = true;
    retryCountRef.current += 1;

    try {
      const gameData = {
        roomId: String(roomId),
        gamePrice: entryFee,
        player1: { playerId: playerId1, name: parsedMatchData?.players[0]?.name || "Player 1" },
        player2: { playerId: playerId2, name: parsedMatchData?.players[1]?.name || "Player 2" },
        rounds: [
          { roundNumber: 1, status: "pending" },
          { roundNumber: 2, status: "pending" },
          { roundNumber: 3, status: "pending" },
          { roundNumber: 4, status: "pending" },
          { roundNumber: 5, status: "pending" },
        ],
        status: "ongoing",
        winner: null,
        player1Score: 0,
        player2Score: 0,
        currentRound: 1,
      };

      console.log("Creating game with data:", gameData);
      
      // First try to get existing game
      try {
        const response = await axios.get(`${BASE_URL}/api/dicegame/room/${roomId}`, {
          timeout: 5000,
        });
        if (response.data) {
          console.log("Existing game found:", response.data);
          updateGameState(response.data);
          return;
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching game:", error);
          throw error;
        }
        console.log("No existing game found, proceeding with creation");
      }

      // Create new game with retry mechanism
      const createGame = async (retryCount = 0) => {
        try {
          const createResponse = await axios.post(
            `${BASE_URL}/api/dicegame/create`,
            gameData,
            { timeout: 5000 }
          );
          console.log("Game created successfully:", createResponse.data);
          updateGameState(createResponse.data);
        } catch (error) {
          if (error.response?.status === 409 && retryCount < 3) {
            console.log(`Retry ${retryCount + 1} after 409 conflict`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return createGame(retryCount + 1);
          }
          throw error;
        }
      };

      await createGame();
      
    } catch (error) {
      console.error("Error in game initialization:", error);
      setError(`Failed to initialize game: ${error.response?.data?.error || error.message}`);
      
      if (retryCountRef.current < 3) {
        setTimeout(() => {
          initializationAttemptedRef.current = false;
          initializeGame();
        }, 2000);
      } else {
        setStatus("waiting");
        resetGame();
      }
    }
  };

  // Helper function to update game state
  const updateGameState = (gameData) => {
    setGameId(gameData._id);
    setIsPlayer1(gameData.player1.playerId === userId);
    setIsPlayerTurn(gameData.player1.playerId === userId);
    setScores({
      player1: gameData.player1Score || 0,
      player2: gameData.player2Score || 0,
    });
    setRoundNumber(gameData.currentRound || 1);
    setIsGameInitialized(true);
    setStatus("done");
    retryCountRef.current = 0;
    console.log("Game state updated successfully");
  };

  useEffect(() => {
    if (roomId && !isGameInitialized && !initializationAttemptedRef.current && socket.connected) {
      console.log("Triggering initializeGame for roomId:", roomId);
      initializeGame();
    }
  }, [roomId, isGameInitialized]);

  // Enhanced round transition handling
  const startNextRound = () => {
    logGameState('Starting next round');
    if (gameState.roundTransitionInProgress) {
      logGameState('Round transition already in progress');
      return;
    }

    setGameState(prev => ({ ...prev, roundTransitionInProgress: true }));
    
    try {
      // Reset all game states for the new round
      setPlayer1Roll(null);
      setPlayer2Roll(null);
      setLastRolledDice(null);
      setHasRolled(false);
      setIsRolling(false);
      setIsPlayerTurn(isPlayer1);
      setTurnMessage(isPlayer1 ? "Your turn!" : "Opponent's turn...");
      setShowRoundResult(false);
      setRoundResult(null);
      setTimeLeft(10);
      
      // Update round number after state reset
      setRoundNumber(prev => prev + 1);
      
      logGameState('Round transition completed');
    } catch (error) {
      logGameState('Error during round transition', { error: error.message });
      setError('Failed to start next round. Please try again.');
    } finally {
      setGameState(prev => ({ ...prev, roundTransitionInProgress: false }));
    }
  };

  // Enhanced socket event handler for round updates
  const handleRoundUpdate = useCallback(
    (game) => {
      logGameState('Received round update', { game });
      if (isProcessingUpdate) {
        logGameState('Update already in progress, skipping');
        return;
      }

      const now = Date.now();
      if (lastUpdateRef.current && now - lastUpdateRef.current < 1000) {
        logGameState('Update too soon, skipping');
        return;
      }

      lastUpdateRef.current = now;
      setIsProcessingUpdate(true);

      try {
        const currentRound = game.rounds?.find((r) => r.roundNumber === game.currentRound);
        if (!currentRound) {
          logGameState('No current round found');
          return;
        }

        // Update rolls and scores
        setPlayer1Roll(currentRound.player1Roll);
        setPlayer2Roll(currentRound.player2Roll);
        const newScores = {
          player1: game.player1Score || 0,
          player2: game.player2Score || 0,
        };
        setScores(newScores);
        setRoundNumber(game.currentRound);

        // Improved turn management
        const isCurrentPlayerTurn = isPlayer1 ? !currentRound.player1Roll : !currentRound.player2Roll;
        setIsPlayerTurn(isCurrentPlayerTurn);
        setHasRolled(isPlayer1 ? !!currentRound.player1Roll : !!currentRound.player2Roll);

        // Update turn message
        if (isCurrentPlayerTurn) {
          setTurnMessage("Your turn!");
          setTimeLeft(10);
        } else {
          setTurnMessage("Waiting for opponent...");
        }

        // Check if both players have rolled
        if (currentRound.player1Roll && currentRound.player2Roll && !gameOver && !showRoundResult) {
          // Determine round winner
          let winner = null;
          if (currentRound.player1Roll > currentRound.player2Roll) {
            winner = isPlayer1 ? "You" : "Opponent";
          } else if (currentRound.player2Roll > currentRound.player1Roll) {
            winner = isPlayer1 ? "Opponent" : "You";
          } else {
            winner = "Draw";
          }

          // Show opponent points first
          setOpponentPoints(isPlayer1 ? currentRound.player2Roll : currentRound.player1Roll);
          setShowOpponentPoints(true);

          setTimeout(() => {
            setShowOpponentPoints(false);
            setOpponentPoints(null);

            // Show round result
            setRoundResult({
              winner,
              playerRoll: isPlayer1 ? currentRound.player1Roll : currentRound.player2Roll,
              opponentRoll: isPlayer1 ? currentRound.player2Roll : currentRound.player1Roll,
              currentScore: {
                player: isPlayer1 ? newScores.player1 : newScores.player2,
                opponent: isPlayer1 ? newScores.player2 : newScores.player1,
              },
            });
            setShowRoundResult(true);

            // Add to round history
            const newHistoryEntry = `Round ${game.currentRound}: ${winner === "You" ? "Won" : winner === "Opponent" ? "Lost" : "Draw"} (${isPlayer1 ? currentRound.player1Roll : currentRound.player2Roll} vs ${isPlayer1 ? currentRound.player2Roll : currentRound.player1Roll})`;
            setRoundHistory((prev) => {
              const updatedHistory = [...prev];
              updatedHistory[game.currentRound - 1] = newHistoryEntry;
              return updatedHistory;
            });

            // Wait for round result display before starting next round
            setTimeout(() => {
              setShowRoundResult(false);
              setRoundResult(null);

              // Continue with next round or game end
              if (game.currentRound < 5) {
                logGameState('Starting next round after result');
                startNextRound();
              } else {
                logGameState('Game complete, updating winner');
                updateGameWinner();
              }
            }, 3000);
          }, 3000);
        }

        // Handle game over
        if (game.status === "finished") {
          setGameOver(true);
          if (game.winner === userId) {
            const updatedBalance = balance + prizeAmount;
            setBalance(updatedBalance);
            localStorage.setItem("user", JSON.stringify({ ...parsedUserData, Balance: updatedBalance }));
            setWinner("player");
          } else if (game.winner) {
            setWinner("opponent");
          } else {
            setWinner("draw");
          }
        }
      } catch (err) {
        logGameState('Error processing round update', { error: err.message });
        setError("Failed to process game update");
      } finally {
        setIsProcessingUpdate(false);
      }
    },
    [isPlayer1, gameId, userId, balance, prizeAmount, parsedUserData, gameOver, showRoundResult]
  );

  // Add round transition validation
  useEffect(() => {
    const validateRoundTransition = () => {
      if (gameState.roundTransitionInProgress && Date.now() - gameState.lastUpdate > 5000) {
        logGameState('Round transition stuck - resetting state');
        setGameState(prev => ({ ...prev, roundTransitionInProgress: false }));
        setError('Round transition failed. Please try again.');
      }
    };

    const interval = setInterval(validateRoundTransition, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Socket event listeners for game updates
  useEffect(() => {
    if (!roomId || !isGameInitialized) return;

    const handleGameCreated = (game) => {
      console.log("Received diceGameCreated:", game);
      if (!gameId || game._id === gameId) {
        setGameId(game._id);
        setIsPlayer1(game.player1.playerId === userId);
        setIsPlayerTurn(game.player1.playerId === userId);
        setScores({
          player1: game.player1Score || 0,
          player2: game.player2Score || 0,
        });
        setRoundNumber(game.currentRound || 1);
        setIsGameInitialized(true);
        setStatus("done");
        setHasRolled(false);
        setTurnMessage(game.player1.playerId === userId ? "Your turn!" : "Opponent's turn...");
        retryCountRef.current = 0;
        console.log("Game initialized via diceGameCreated event");
      }
    };

    socket.on("diceGameCreated", handleGameCreated);
    socket.on("diceGameUpdated", handleRoundUpdate);

    return () => {
      socket.off("diceGameCreated", handleGameCreated);
      socket.off("diceGameUpdated", handleRoundUpdate);
    };
  }, [roomId, userId, isGameInitialized, gameId, handleRoundUpdate]);

  // Fetch game data and update round history
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/dicegame/room/${roomId}`);
        const gameData = response.data;
        console.log("[DEBUG] Fetched game data:", gameData);
        const results = gameData.rounds.map((round) => {
          const isPlayerWinner =
            (isPlayer1 && round.winner === gameData.player1.playerId) ||
            (!isPlayer1 && round.winner === gameData.player2.playerId);
          const isOpponentWinner =
            (isPlayer1 && round.winner === gameData.player2.playerId) ||
            (!isPlayer1 && round.winner === gameData.player1.playerId);

          if (!round.player1Roll || !round.player2Roll) {
            return `Round ${round.roundNumber}: Waiting...`;
          } else if (isPlayerWinner) {
            return `Round ${round.roundNumber}: Won (${diceToDots(isPlayer1 ? round.player1Roll : round.player2Roll)} vs ${diceToDots(isPlayer1 ? round.player2Roll : round.player1Roll)})`;
          } else if (isOpponentWinner) {
            return `Round ${round.roundNumber}: Lost (${diceToDots(isPlayer1 ? round.player1Roll : round.player2Roll)} vs ${diceToDots(isPlayer1 ? round.player2Roll : round.player1Roll)})`;
          } else {
            return `Round ${round.roundNumber}: Draw (${diceToDots(isPlayer1 ? round.player1Roll : round.player2Roll)} vs ${diceToDots(isPlayer1 ? round.player2Roll : round.player1Roll)})`;
          }
        });
        setRoundHistory(results);
        // Update scores to ensure consistency
        setScores({
          player1: gameData.player1Score || 0,
          player2: gameData.player2Score || 0,
        });
      } catch (err) {
        console.error("Error fetching game data:", err.message);
        setError("Failed to fetch game history");
      }
    };

    if (gameId && isGameInitialized) {
      fetchGameData();
      const intervalId = setInterval(fetchGameData, 1000);
      return () => clearInterval(intervalId);
    }
  }, [gameId, isGameInitialized, isPlayer1]);

  const handleTimeUp = async () => {
    if (isPlayerTurn && !isRolling && !hasRolled) {
      await rollDice();
    }
  };

  const rollDice = async () => {
    if (!gameId || !isPlayerTurn || isProcessingUpdate || isRolling || hasRolled) {
      console.log("Cannot roll:", { gameId, isPlayerTurn, isProcessingUpdate, isRolling, hasRolled });
      return;
    }

    setIsRolling(true);
    setHasRolled(true);
    setError(null); // Clear any previous errors

    const rollInterval = setInterval(() => {
      setLastRolledDice(Math.floor(Math.random() * 6) + 1);
    }, 100);

    try {
      setIsProcessingUpdate(true);
      const finalRoll = Math.floor(Math.random() * 6) + 1;

      // Add retry logic for the API call
      let retryCount = 0;
      const maxRetries = 3;
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          const response = await axios.put(`${BASE_URL}/api/dicegame/move/${gameId}`, {
            playerId: userId,
            roll: finalRoll,
          }, {
            timeout: 5000 // 5 second timeout
          });

          if (response.data) {
            success = true;
            console.log("Roll successful:", response.data);
          }
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) {
            throw error;
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      clearInterval(rollInterval);
      setLastRolledDice(finalRoll);

      if (isPlayer1) {
        setPlayer1Roll(finalRoll);
      } else {
        setPlayer2Roll(finalRoll);
      }

      setIsPlayerTurn(false);
      setTurnMessage("Waiting for opponent...");
      setIsRolling(false);

      // Force update game state after successful roll
      try {
        const gameResponse = await axios.get(`${BASE_URL}/api/dicegame/room/${roomId}`);
        if (gameResponse.data) {
          handleRoundUpdate(gameResponse.data);
        }
      } catch (error) {
        console.error("Error fetching game state after roll:", error);
      }

    } catch (error) {
      console.error("Error updating roll:", error.response?.data || error.message);
      setError(`Failed to update roll: ${error.response?.data?.error || error.message}`);
      clearInterval(rollInterval);
      setIsRolling(false);
      setHasRolled(false);
      setIsPlayerTurn(true); // Reset turn if roll failed
    } finally {
      setIsProcessingUpdate(false);
    }
  };

  const updateGameWinner = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/dicegame/update-winner/${gameId}`);
      const { winner: winnerId, player1Score, player2Score } = response.data;
      console.log("[DEBUG] updateGameWinner response:", { winnerId, player1Score, player2Score });

      const newScores = {
        player1: player1Score || 0,
        player2: player2Score || 0,
      };
      setScores(newScores);

      // Client-side validation
      let computedWinner = null;
      if (newScores.player1 > newScores.player2) {
        computedWinner = isPlayer1 ? "player" : "opponent";
      } else if (newScores.player2 > newScores.player1) {
        computedWinner = isPlayer1 ? "opponent" : "player";
      } else {
        computedWinner = "draw";
      }

      if (winnerId) {
        setWinner(winnerId === userId ? "player" : "opponent");
      } else {
        setWinner("draw");
      }

      if (computedWinner !== (winnerId === userId ? "player" : winnerId ? "opponent" : "draw")) {
        console.warn("Winner mismatch between server and client:", {
          serverWinner: winnerId,
          computedWinner,
        });
      }

      setGameOver(true);
    } catch (error) {
      console.error("Error updating winner:", error.response?.data || error.message);
      setError(`Failed to update winner: ${error.response?.data?.error || error.message}`);
    }
  };

  const resetGame = () => {
    console.log("[DEBUG] resetGame called");
    setGameId(null);
    setPlayer1Roll(null);
    setPlayer2Roll(null);
    setLastRolledDice(null);
    setScores({ player1: 0, player2: 0 });
    setRoundNumber(1);
    setTimeLeft(10);
    setIsPlayer1(false);
    setIsPlayerTurn(false);
    setHasRolled(false);
    setGameOver(false);
    setWinner(null);
    setIsRolling(false);
    setRoundHistory([]);
    setStatus("waiting");
    setRoomId(null);
    setIsGameInitialized(false);
    initializationAttemptedRef.current = false;
    retryCountRef.current = 0;
    setTurnMessage("");
    setShowRoundResult(false);
    setRoundResult(null);
    setShowOpponentPoints(false);
    setOpponentPoints(null);
    localStorage.removeItem("diceGameData");
    localStorage.removeItem("match_found");
    socket.off("diceGameCreated");
    socket.off("diceGameUpdated");
    if (!hasLeftRoomsRef.current) {
      socket.emit("leave_all_rooms");
      hasLeftRoomsRef.current = true;
    }
    socket.disconnect();
    socket.connect();
  };

  const findMatch = () => {
    if (!userId) {
      setError("User not authenticated");
      return;
    }
    if (balance < entryFee) {
      setError("Insufficient balance to join match");
      return;
    }
    if (!socket.connected) {
      socket.connect();
      setTimeout(() => {
        if (!socket.connected) {
          setError("Not connected to server. Please try again.");
          return;
        }
        proceedWithMatchmaking();
      }, 1000);
      return;
    }
    proceedWithMatchmaking();
  };

  const proceedWithMatchmaking = () => {
    setBalance((prev) => prev - entryFee);
    setError(null);
    resetGame();
    socket.emit("join_matchmaking", {
      userId,
      gameId: "dice",
      entryAmount: entryFee,
    });
  };

  const [roundHighlight, setRoundHighlight] = useState(false);

  // Highlight round number when it changes
  useEffect(() => {
    if (status === "done" && !gameOver) {
      setRoundHighlight(true);
      const timeout = setTimeout(() => setRoundHighlight(false), 700);
      return () => clearTimeout(timeout);
    }
  }, [roundNumber, status, gameOver]);

  // Track number of rolls per round
  const [playerRollCount, setPlayerRollCount] = useState(0);

  // Increment roll count only when a player successfully rolls
  useEffect(() => {
    if (hasRolled) {
      setPlayerRollCount((prev) => prev + 1);
    }
  }, [hasRolled]);

  // Reset roll count on new round or game
  useEffect(() => {
    if (roundNumber > 1 || status === "waiting" || gameOver) {
      setPlayerRollCount(0);
    }
  }, [roundNumber, status, gameOver]);

  const canRollDice = isPlayerTurn && !isRolling && !hasRolled;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#334155] text-white p-2 sm:p-4">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center px-2 pt-2 pb-1">
        <span className="text-xs font-semibold text-[#38bdf8] bg-[#0ea5e9]/10 px-3 py-1 rounded-full shadow-sm">
          Balance: ₹{balance}
        </span>
        <span className="text-xs font-semibold text-[#fbbf24] bg-[#f59e42]/10 px-3 py-1 rounded-full shadow-sm">
          Entry: ₹{entryFee}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/90 text-white rounded-lg p-2 mb-2 max-w-xs w-full text-center z-20 text-sm shadow-lg">
          {error}
        </div>
      )}      {/* Matchmaking */}
      {status === "matching" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center z-20 mt-10">
          <h2 className="text-lg font-bold mb-2 tracking-wide text-[#38bdf8]">Finding Opponent...</h2>
          <div className="text-white/80 mb-2">Time remaining: {matchingTimeLeft}s</div>
          <div className="h-1 bg-white/20 mb-4 w-40 mx-auto rounded-full overflow-hidden">
            <motion.div
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#38bdf8] to-[#fbbf24]"
            />
          </div>
        </motion.div>
      )}

      {/* Main Game UI */}
      {status === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0f172a]/80 rounded-2xl p-2 sm:p-4 z-20 shadow-2xl border border-[#334155]/60"
        >
          {/* Round & Score */}
          <div className="flex justify-between items-center mb-2">
            <h2
              className={`text-base sm:text-lg font-bold transition-all duration-300 tracking-wider ${roundHighlight ? "round-highlight" : ""}`}
              key={roundNumber}
            >
              Round <span className="text-[#fbbf24]">{roundNumber}/5</span>
            </h2>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#38bdf8]" />
              <span className="text-xs sm:text-sm">
                <span className="text-[#38bdf8]">You</span> {isPlayer1 ? scores.player1 : scores.player2}
                <span className="mx-1 text-[#64748b]">-</span>
                <span className="text-[#fbbf24]">Opponent</span> {isPlayer1 ? scores.player2 : scores.player1}
              </span>
            </div>
          </div>

          {/* Game Over */}
          {gameOver ? (
            <div className="text-center mt-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#fbbf24] drop-shadow">Game Over!</h2>
              <FinalResult
                isPlayer1={isPlayer1}
                scores={scores}
                prizeAmount={prizeAmount}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={findMatch}
                className={`
                  w-full mt-4 px-6 py-3
                  bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#fbbf24]
                  rounded-xl text-white font-bold text-lg shadow-lg
                  transition-all duration-300
                  ${balance < entryFee ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}
                `}
                disabled={balance < entryFee}
              >
                {balance < entryFee ? (
                  "Insufficient Balance"
                ) : (
                  "Play Again (₹" + entryFee + ")"
                )}
              </motion.button>
              {balance < entryFee && (
                <p className="text-red-400 text-xs mt-2">
                  You need ₹{entryFee} to play another game
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Dice Display */}
              <div className="flex justify-between items-center gap-2 sm:gap-6 mt-2 mb-4">
                {/* Opponent */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-xs font-semibold text-[#fbbf24] mb-1">Opponent</span>
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner border-2 border-[#fbbf24]/30">
                    <div className="w-full h-3/4 flex items-center justify-center">
                      {isPlayer1
                        ? player2Roll !== null && player2Roll !== undefined && player2Roll > 0
                          ? <DiceDots value={player2Roll} size="large" />
                          : null
                        : player1Roll !== null && player1Roll !== undefined && player1Roll > 0
                          ? <DiceDots value={player1Roll} size="large" />
                          : null}
                    </div>
                    <span className="mt-1 text-sm text-[#fbbf24] font-bold">
                      {isPlayer1
                        ? player2Roll !== null && player2Roll !== undefined && player2Roll > 0
                          ? diceToDots(player2Roll)
                          : ""
                        : player1Roll !== null && player1Roll !== undefined && player1Roll > 0
                        ? diceToDots(player1Roll)
                        : ""}
                    </span>
                  </div>
                </div>
                {/* You */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-xs font-semibold text-[#38bdf8] mb-1">You</span>
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner border-2 border-[#38bdf8]/30">
                    <div className="w-full h-3/4 flex items-center justify-center">
                      {isPlayer1
                        ? player1Roll !== null && player1Roll !== undefined && player1Roll > 0
                          ? <DiceDots value={player1Roll} size="large" />
                          : null
                        : player2Roll !== null && player2Roll !== undefined && player2Roll > 0
                          ? <DiceDots value={player2Roll} size="large" />
                          : null}
                    </div>
                    <span className="mt-1 text-sm text-[#38bdf8] font-bold">
                      {isPlayer1
                        ? player1Roll !== null && player1Roll !== undefined && player1Roll > 0
                          ? diceToDots(player1Roll)
                          : ""
                        : player2Roll !== null && player2Roll !== undefined && player2Roll > 0
                        ? diceToDots(player2Roll)
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timer & Roll Button */}
              <div className="flex flex-col items-center mb-2">
                {canRollDice && (
                  <div className="mb-1 text-base font-bold text-[#fbbf24] animate-pulse">
                    Time left: {timeLeft}s
                  </div>
                )}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 24px #fbbf24, 0 0 8px #fff" }}
                  onClick={rollDice}
                  className={`
                    roll-dice-btn
                    w-full max-w-xs px-6 py-3
                    bg-gradient-to-r from-[#fbbf24] via-[#38bdf8] to-[#6366f1]
                    text-[#0f172a] font-extrabold text-lg shadow-xl
                    rounded-xl border-2 border-[#fbbf24]/60
                    transition-all duration-200
                    relative overflow-hidden
                    ${!canRollDice ? "opacity-60 cursor-not-allowed grayscale" : "hover:shadow-2xl hover:scale-105"}
                  `}
                  aria-label="Roll dice"
                  disabled={!canRollDice}
                  style={{
                    filter: canRollDice ? "drop-shadow(0 0 12px #fde68a)" : "none",
                    pointerEvents: !canRollDice ? "none" : "auto",
                  }}
                >
                  {isRolling ? "Rolling..." : "Roll Dice"}
                </motion.button>
              </div>
            </>
          )}

          {/* Round Result Modal */}
          {showOpponentPoints && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-30"
            >
              <div className="bg-[#1e293b]/90 backdrop-blur-lg rounded-2xl p-8 text-center border border-[#38bdf8]/30 shadow-2xl">
                <h3 className="text-xl font-bold mb-4 text-[#fbbf24]">Opponent's Roll</h3>
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mx-auto shadow-lg">
                  <DiceDots value={opponentPoints} size="large" />
                </div>
                <p className="mt-4 text-lg font-bold text-[#fbbf24]">{opponentPoints}</p>
                <p className="text-white/80 mt-2">Round result in 3 seconds...</p>
              </div>
            </motion.div>
          )}
          {showRoundResult && roundResult && <RoundResultDisplay result={roundResult} roundNumber={roundNumber} />}

          {/* Round History */}
          <div className="mt-4 bg-[#334155]/60 rounded-xl p-3 w-full max-w-xs mx-auto shadow-inner">
            <h3 className="text-base font-bold mb-2 text-[#38bdf8]">Round History</h3>
            <div className="space-y-1">
              {roundHistory.map((history, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-xs font-semibold ${
                    history.includes("Won")
                      ? "bg-[#38bdf8]/20 text-[#38bdf8]"
                      : history.includes("Lost")
                      ? "bg-[#fbbf24]/20 text-[#fbbf24]"
                      : history.includes("Draw")
                      ? "bg-[#64748b]/20 text-[#64748b]"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {history}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}



