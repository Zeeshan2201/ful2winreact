"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Scissors, FileText, Hand, CloudCog } from "lucide-react"
import socket from '../../socekt'
import axios from 'axios'

export default function RockPaperScissors() {
  // Game choices
  const CHOICES = {
    ROCK: "rock",
    PAPER: "paper",
    SCISSORS: "scissors",
  }

  // Choice icons component
  const ChoiceIcon = ({ choice, size = 24 }) => {
    if (choice === CHOICES.ROCK) return <Hand size={size} className="rotate-90" />
    if (choice === CHOICES.PAPER) return <FileText size={size} />
    if (choice === CHOICES.SCISSORS) return <Scissors size={size} />
    return null
  }

  // Get match data from localStorage
  const matchData = localStorage.getItem("match_found")
  const userData = localStorage.getItem("user")
  const parsedMatchData = JSON.parse(matchData)
  const parsedUserData = JSON.parse(userData)
  const roomId = parsedMatchData?.roomId
  const userId = parsedUserData?._id
  const playerId1 = parsedMatchData?.players[0]?.userId
  const playerId2 = parsedMatchData?.players[1]?.userId

  // Game state
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [player1Choice, setPlayer1Choice] = useState(null)
  const [player2Choice, setPlayer2Choice] = useState(null)
  const [roundResult, setRoundResult] = useState(null)
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [roundNumber, setRoundNumber] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [gameId, setGameId] = useState(null)
  const [isPlayer1, setIsPlayer1] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const timerRef = useRef(null)
  const [isGameInitialized, setIsGameInitialized] = useState(false)
  const [gameWinner, setGameWinner] = useState(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [use, setUse]=useState("0")
  // Add debounce refs
  const lastUpdateRef = useRef(null)
  const updateTimeoutRef = useRef(null)
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false)

  const [game, setGame] = useState(null);
  const [roundResults, setRoundResults] = useState([]);
  // Add new state for current player turn
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(null);

  // Timer effect
  useEffect(() => {
    if (isPlayerTurn && timeLeft > 0 && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimeUp()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlayerTurn, timeLeft, gameOver])

  // Handle time up
  const handleTimeUp = async () => {
    if (isPlayerTurn) {
      // Auto-select a random choice if time runs out
      const randomChoice = Object.values(CHOICES)[Math.floor(Math.random() * 3)]
      await handleChoice(randomChoice)
    }
  }

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      if (!roomId) {
        console.error('No room ID found')
        return
      }

      try {
        // First, check if a game already exists for this room
        const response = await axios.get(`https://ful2win-backend.onrender.com/api/game/room/${roomId}`)
        if (response.data) {
          console.log('Existing game found:', response.data)
          setGameId(response.data._id)
          setIsPlayer1(response.data.player1.playerId === userId)
          setIsPlayerTurn(response.data.player1.playerId === userId)
          setIsGameInitialized(true)
          return
        }

        // If no game exists, create a new one
        const gameData = {
          roomId: roomId,
          gamePrice: 100,
          player1: {
            playerId: playerId1,
            name: 'Player 1'
          },
          player2: {
            playerId: playerId2,
            name: 'Player 2'
          },
          rounds: [],
          status: 'ongoing',
          winner: ''
        }

        console.log('Creating new game with data:', gameData)
        const createResponse = await axios.post('https://ful2win-backend.onrender.com/api/game/create', gameData)
        console.log('Game created successfully:', createResponse.data)
        
        setGameId(createResponse.data._id)
        setIsPlayer1(createResponse.data.player1.playerId === userId)
        setIsPlayerTurn(createResponse.data.player1.playerId === userId)
        setIsGameInitialized(true)
      } catch (error) {
        console.error('Error initializing game:', error)
      }
    }

    if (!isGameInitialized) {
      initializeGame()
    }
  }, [roomId, userId, playerId1, playerId2, isGameInitialized])

  // Add effect to check current player turn
  useEffect(() => {
    const checkCurrentTurn = async () => {
      if (!gameId) return;
      
      try {
        const response = await axios.get(`https://ful2win-backend.onrender.com/api/game/current-turn/${gameId}`);
        const { currentPlayerTurn } = response.data;
        setCurrentPlayerTurn(currentPlayerTurn);
        
        // Update isPlayerTurn based on currentPlayerTurn from database
        if (isPlayer1) {
          setIsPlayerTurn(currentPlayerTurn === 'player1');
        } else {
          setIsPlayerTurn(currentPlayerTurn === 'player2');
        }
      } catch (error) {
        console.error('Error checking current turn:', error);
      }
    };

    // Check turn initially and set up interval
    checkCurrentTurn();
    const interval = setInterval(checkCurrentTurn, 1000);

    return () => clearInterval(interval);
  }, [gameId, isPlayer1]);

  // Update handleRoundUpdate to handle currentPlayerTurn
  const handleRoundUpdate = useCallback((game) => {
    if (isProcessingUpdate) return;

    const now = Date.now();
    if (lastUpdateRef.current && now - lastUpdateRef.current < 1000) {
      return;
    }

    lastUpdateRef.current = now;
    setIsProcessingUpdate(true);

    try {
      const currentRound = game.rounds.find(r => r.roundNumber === game.currentRound);
      if (!currentRound) return;

      setPlayer1Choice(currentRound.player1Move);
      setPlayer2Choice(currentRound.player2Move);
      setCurrentPlayerTurn(game.currentPlayerTurn);

      // Update scores
      setScores({
        player1: game.player1Score,
        player2: game.player2Score
      });

      // Update round number
      setRoundNumber(game.currentRound);

      // Check if it's player's turn based on currentPlayerTurn
      if (isPlayer1) {
        setIsPlayerTurn(game.currentPlayerTurn === 'player1');
      } else {
        setIsPlayerTurn(game.currentPlayerTurn === 'player2');
      }

      // Check if round is complete
      if (currentRound.status === 'completed') {
        evaluateRound(currentRound.player1Move, currentRound.player2Move);
      }

      // Check if game is over
      if (game.status === 'finished') {
        setGameOver(true);
        setWinner(game.winner === userId ? "player1" : "player2");
      }
    } finally {
      setIsProcessingUpdate(false);
    }
  }, [isPlayer1, userId]);

  // Socket event listeners
  useEffect(() => {
    if (!roomId || !isGameInitialized) return

    const handleGameCreated = (game) => {
      console.log('Game created event received:', game)
      if (!gameId) {
        setGameId(game._id)
        setIsPlayer1(game.player1.playerId === userId)
        setIsPlayerTurn(game.player1.playerId === userId)
      }
    }

    socket.on('gameCreated', handleGameCreated)
    socket.on('roundUpdated', handleRoundUpdate)

    return () => {
      socket.off('gameCreated', handleGameCreated)
      socket.off('roundUpdated', handleRoundUpdate)
    }
  }, [roomId, userId, isPlayer1, isGameInitialized, gameId, handleRoundUpdate])

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`https://ful2win-backend.onrender.com/api/game/room/${roomId}`);
        const gameData = response.data;
        setGame(gameData);

        const results = gameData.rounds.map((round) => {
          if (round.winner === 'player1') {
            return `Round ${round.roundNumber}: ${gameData.player1.name} wins`;
          } else if (round.winner === 'player2') {
            return `Round ${round.roundNumber}: ${gameData.player2.name} wins`;
          } else if (round.player1Move === null && round.player2Move === null) {
            return `Round ${round.roundNumber}: No moves made`;
          } else if (round.player1Move != null && round.player2Move === null){
            return `Round ${round.roundNumber}: No moves made`;
          }else {
            return `Round ${round.roundNumber}: Draw`;
          }
        });
        

        setRoundResults(results);
      } catch (err) {
        console.error('Error fetching game data:', err);
      }
    };

    // Fetch initially
    fetchGame();

    // Set interval to fetch every second
    const interval = setInterval(fetchGame, 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [roomId]);
  // Handle player selection
useEffect(() => {
  if (roomId && roundNumber >= 3 && gameOver === true) {
    updateGameWinner(roomId);
  }
}, [roundNumber, gameOver]);

  // Update handleChoice to check current turn
  const handleChoice = async (choice) => {
    if (!gameId || !isPlayerTurn || isProcessingUpdate) {
      console.log('Cannot make move:', { gameId, isPlayerTurn, isProcessingUpdate });
      return;
    }

    try {
      setIsProcessingUpdate(true);

      // Send move update
      const response = await axios.put(`https://ful2win-backend.onrender.com/api/game/move/${gameId}`, {
        playerId: userId,
        move: choice,
        roundNumber: roundNumber
      });

      // Update local state
      if (isPlayer1) {
        setPlayer1Choice(choice);
      } else {
        setPlayer2Choice(choice);
      }

      setIsPlayerTurn(false);
      clearInterval(timerRef.current);

      console.log('Move updated successfully:', response.data);

      // Check if both players have made their moves
      const updatedGame = await axios.get(`https://ful2win-backend.onrender.com/api/game/room/${roomId}`);
      const currentRound = updatedGame.data.rounds.find(r => r.roundNumber === roundNumber);
      
      if (currentRound && currentRound.player1Move && currentRound.player2Move) {
        // Both players have moved, evaluate the round
        evaluateRound(currentRound.player1Move, currentRound.player2Move);
      }

    } catch (error) {
      console.error('Error updating move:', error);
    } finally {
      setIsProcessingUpdate(false);
    }
  };

  // Determine winner of the round
  const evaluateRound = async (p1Choice, p2Choice) => {
    if (isProcessingUpdate) return

    try {
      setIsProcessingUpdate(true)
      let result
      let roundWinner = null

      if (p1Choice === p2Choice) {
        result = "draw"
      } else if (
        (p1Choice === CHOICES.ROCK && p2Choice === CHOICES.SCISSORS) ||
        (p1Choice === CHOICES.PAPER && p2Choice === CHOICES.ROCK) ||
        (p1Choice === CHOICES.SCISSORS && p2Choice === CHOICES.PAPER)
      ) {
        result = "player1"
        roundWinner = playerId1
        setScores((prev) => ({ ...prev, player1: prev.player1 + 1 }))
      } else {
        result = "player2"
        roundWinner = playerId2
        setScores((prev) => ({ ...prev, player2: prev.player2 + 1 }))
      }

      // Get current game state
      const currentGame = await axios.get(`https://ful2win-backend.onrender.com/api/game/room/${roomId}`)
      const currentRounds = currentGame.data.rounds || []
      const currentRound = currentRounds.find(r => r.round === roundNumber) || { round: roundNumber }

      // Update round winner
      const updatedRound = {
        ...currentRound,
        round: roundNumber,
        player1Move: p1Choice,
        player2Move: p2Choice,
        winner: roundWinner
      }

      await axios.put(`https://ful2win-backend.onrender.com/api/game/round/${gameId}`, {
        round: updatedRound
      })

      // Check if game is over (3 rounds)
      if (roundNumber >= 3) {
        // const gameWinner = scores.player1 > scores.player2 ? playerId1 : 
        //                   scores.player2 > scores.player1 ? playerId2 : null
        console.log("Game Over")
        console.log("updategame")
        setGameOver(true)
        
// Example usage:
        setWinner("player2")
        // setWinner(gameWinner === userId ? "player1" : "player2")

        // Update game status and room status
        await axios.put(`https://ful2win-backend.onrender.com/api/game/round/${gameId}`, {
          status: 'finished',
          winner: gameWinner
        })

        // Update room status
        await axios.put(`https://ful2win-backend.onrender.com/api/room/${roomId}/status`, {
          status: 'finished',
          winner: gameWinner
        })
      } else {
        // Automatically start next round after 1 second
        setTimeout(() => {
          startNextRound()
        }, 1000)
      }
    } catch (error) {
      console.error('Error updating round result:', error)
    } finally {
      setIsProcessingUpdate(false)
    }
  }

  // Start a new round
  const startNextRound = () => {
    setPlayer1Choice(null)
    setPlayer2Choice(null)
    setRoundResult(null)
    setRoundNumber((prev) => prev + 1)
    setTimeLeft(10)
    // First player starts each round
    setIsPlayerTurn(isPlayer1)
  }
async function updateGameWinner(roomId) {
  try {
    const response = await fetch(`https://ful2win-backend.onrender.com/api/game/update-winner/${roomId}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error updating winner:", data.message);
      return;
    }

    // Update scores in state
    setPlayer1Score(data.player1Score);
    setPlayer2Score(data.player2Score);

if (data.player1Score > data.player2Score) {
  setWinner('player1');
} else if (data.player2Score > data.player1Score) {
  setWinner('player2');
} else {
  setWinner('draw');
}

    // Set winner state (null for draw)
    if (data.winnerId) {
      setGameWinner(data.winnerId); // use playerId like '6829af25...'
    } else {
      setGameWinner('draw');
    }

  } catch (error) {
    console.error("Error fetching winner:", error);
  }
}

  // Reset the game
  const resetGame = () => {
    setPlayer1Choice(null)
    setPlayer2Choice(null)
    setRoundResult(null)
    setScores({ player1: 0, player2: 0 })
    setRoundNumber(1)
    setTimeLeft(10)
    setIsPlayerTurn(false)
    setGameOver(false)
    setWinner(null)
  }

  // Get result message
  const getResultMessage = () => {
    if (roundResult === "draw") return "It's a draw!"
    if (roundResult === "player1") return "Player 1 wins this round!"
    if (roundResult === "player2") return "Player 2 wins this round!"
    return ""
  }

  return (
    <div style={{ backgroundImage: "url('/stonepaper.jpg')" }} className="h-full bg-cover bg-center flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <h1 className="text-3xl font-bold text-white mb-6 relative z-20">Rock Paper Scissors</h1>

      {/* Game info */}
      <div className="bg-white/10 rounded-lg px-6 py-3 mb-6 w-full max-w-md relative z-20">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{scores.player1}</div>
            <div className="text-xs text-white/60">Player 1</div>
          </div>

          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="text-lg font-medium text-white">Round {roundNumber}/3</div>
              <div className="text-sm font-medium text-yellow-400">Best of 3</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{scores.player2}</div>
            <div className="text-xs text-white/60">Player 2</div>
          </div>
        </div>
      </div>

      {/* Timer */}
      {!gameOver && (
        <div className="mb-4 text-center relative z-20">
          <div className="text-xl font-bold text-white mb-2">
            {isPlayerTurn ? `Your Turn - ${timeLeft}s` : "Opponent's Turn"}
          </div>
        </div>
      )}

      {/* Current player indicator */}
      {!gameOver && !roundResult && (
        <div className="mb-4 text-center relative z-20">
          <div className="text-xl font-bold text-white mb-2">
            {isPlayerTurn ? "Your Turn" : "Waiting for opponent..."}
          </div>
          <div className="text-sm text-white/70">Select Rock, Paper, or Scissors</div>
        </div>
      )}

      {/* Choices display */}
      {roundResult && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6 relative z-20">
          <div
            className={`w-40 bg-white rounded-lg p-6 ${roundResult === "player1" ? "border-2 border-green-500" : ""}`}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm text-slate-500 mb-2">Player 1</div>
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <ChoiceIcon choice={player1Choice} size={40} />
              </div>
              <div className="text-lg font-medium capitalize">{player1Choice}</div>
            </div>
          </div>

          <div className="text-2xl font-bold text-white/60">VS</div>

          <div
            className={`w-40 bg-white rounded-lg p-6 ${roundResult === "player2" ? "border-2 border-green-500" : ""}`}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm text-slate-500 mb-2">Player 2</div>
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <ChoiceIcon choice={player2Choice} size={40} />
              </div>
              <div className="text-lg font-medium capitalize">{player2Choice}</div>
            </div>
          </div>
        </div>
      )}

      {/* Round result message */}
      {roundResult && !gameOver && (
        <div className="mb-6 text-center relative z-20">
          <div
            className={`text-xl font-bold ${
              roundResult === "draw" ? "text-yellow-400" : roundResult === "player1" ? "text-blue-400" : "text-red-400"
            }`}
          >
            {getResultMessage()}
          </div>
        </div>
      )}

      {/* Game over message */}
      {gameOver && (
        <div className="mb-6 text-center relative z-20">
          <div
            className={`text-2xl font-bold mb-2 ${
              winner === "draw" ? "text-yellow-400" : winner === "player1" ? "text-blue-400" : "text-red-400"
            }`}
          >
            {winner === "draw" ? "It's a tie!" : `Player ${winner === "player1" ? "1" : "2"} wins the game!`}
          </div>
          <div className="text-white/70">
            Final Score: {scores.player1} - {scores.player2}
          </div>
        </div>
      )}

      {/* Choice buttons */}
      {!gameOver && (
        <div className="grid grid-cols-3 gap-4 mb-6 relative z-20">
          {Object.values(CHOICES).map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoice(choice)}
              className="w-24 h-24 flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <ChoiceIcon choice={choice} size={32} />
              <span className="capitalize">{choice}</span>
            </button>
          ))}
        </div>
      )}

      {/* Play again button */}
      {gameOver && (
        <button onClick={resetGame} className=" relative z-20 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
          Play Again
        </button>
      )}
      <div>
      <h2 className="relative z-20">Round Results</h2>
      {roundResults.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {roundResults && roundResults.map((result, index) => (
            <li className="relative z-20" key={index}>{result}</li>
          ))}
        </ul>
      )}
    </div>
    </div>
    
  )
}