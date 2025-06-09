import React, { useState, useEffect, useCallback } from 'react';
import socket from '../../socekt'
import axios from 'axios'
/**
 * TictactoeGameLogic - Handles the game logic for Tic Tac Toe
 * This component manages the board state, tracks rounds, and determines the winner
 */
const TictactoeGameLogic = ({ onGameEnd }) => {
  // Game board state (3x3 grid)
  const [board, setBoard] = useState(Array(9).fill(null));
  

   const matchData = localStorage.getItem("match_found")
  const userData = localStorage.getItem("user")
  const parsedMatchData = JSON.parse(matchData)
  const parsedUserData = JSON.parse(userData)
  const roomId = parsedMatchData?.roomId
  const userId = parsedUserData?._id
  const playerId1 = parsedMatchData?.players[0]?.userId
  const playerId2 = parsedMatchData?.players[1]?.userId
  // Game state tracking
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [roundWinner, setRoundWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundScore, setRoundScore] = useState({ player1: 0, player2: 0 });
  const [gameId, setGameId] = useState(null);
  const [isPlayer1, setIsPlayer1] = useState(null);
  const [gameStatus, setGameStatus] = useState('waiting'); // 'waiting', 'playing', 'finished'
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [playerSymbols, setPlayerSymbols] = useState({ player1: 'X', player2: 'O' });
  const [roundResults, setRoundResults] = useState([]);

  // Winning combinations (rows, columns, diagonals)
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  // Initialize or reset the game board
  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setRoundWinner(null);
    setIsPlayerTurn(false);
  };

  // Start a new round
  const startNextRound = () => {
    resetBoard();
    setRoundNumber(prev => prev + 1);
  };

  // Check if the game has a winner based on the current board state
  const checkWinner = (currentBoard) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] && 
        currentBoard[a] === currentBoard[b] && 
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a]; // Return 'X' (player) or 'O' (opponent)
      }
    }
    
    // Check for draw (all cells filled)
    if (currentBoard.every(cell => cell !== null)) {
      return 'draw';
    }
    
    return null; // No winner yet
  };

  // Update game state
  const updateGameState = useCallback((game) => {
    if (!game) return;
    
    setBoard(game.rounds[game.currentRound - 1].board.flat());
    setIsPlayerTurn(game.currentTurn === userId);
    setRoundNumber(game.currentRound);
    console.log(game.currentRound)
    setRoundScore({
      player1: game.player1Score,
      player2: game.player2Score
    });
    setGameStatus(game.status);

    // Set player symbols based on game data
    if (game.player1 && game.player2) {
      setPlayerSymbols({
        player1: game.player1.symbol || 'X',
        player2: game.player2.symbol || 'O'
      });
    }

    // Update round results
    if (game.rounds && game.rounds.length > 0) {
      const completedRounds = game.rounds.filter(round => round.winner);
      setRoundResults(completedRounds.map(round => ({
        roundNumber: round.roundNumber,
        winner: round.winner === playerId1 ? 'player1' : round.winner === playerId2 ? 'player2' : 'draw',
        board: round.board
      })));
    }

    if (game.status === 'finished') {
      console.log(game.winner)
      setGameOver(true);
      if (onGameEnd) {
        console.log(userId)
        console.log("game.player1Score"+game.player1Score)
        console.log("game.player2Score"+game.player2Score)
        onGameEnd({
          winner: game.winner === userId ? 'player' : 'opponent',
          score: {
            player: game.winner === userId ? game.player1Score : game.player2Score,
            opponent: game.winner === userId ? game.player2Score : game.player1Score,
            player1Score:game.player1Score,
            player2Score:game.player2Score
          }
        // onGameEnd({
        //   winner: game.winner === userId ? 'player' : 'opponent',
        //   score: {
        //     player: game.winner === userId ? game.player1Score : game.player2Score,
        //     opponent: game.winner === userId ? game.player2Score : game.player1Score
        //   }
        });
      }
    }
  }, [userId, onGameEnd, playerId1, playerId2]);

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setError(null);
        const response = await axios.get(`https://ful2win-backend.onrender.com/api/tictactoe/room/${roomId}`);
        const game = response.data;
        console.log("getting data")
        if (!game) {
          setError('Failed to initialize game');
          return;
        }

        setGameId(game._id);
        setIsPlayer1(game.player1?.playerId === userId);
        updateGameState(game);

      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to initialize game');
      }
    };

    if (roomId) {
      initializeGame();
    }
  }, [roomId, userId, updateGameState]);

  // Assign players
  useEffect(() => {
    const assignPlayers = async () => {
      if (!gameId || !playerId1 || !playerId2) return;

      try {
        const response = await axios.put(`https://ful2win-backend.onrender.com/api/tictactoe/assignPlayers/${gameId}`, {
          player1: {
            playerId: playerId1,
            name: 'Player 1',
            symbol: 'X'
          },
          player2: {
            playerId: playerId2,
            name: 'Player 2',
            symbol: 'O'
          }
        });

        updateGameState(response.data);
      } catch (error) {
        console.error('Failed to assign players:', error);
        setError('Failed to assign players');
      }
    };

    assignPlayers();
  }, [gameId, playerId1, playerId2, updateGameState]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !gameId) return;

    const handleMoveMade = (game) => {
      if (game._id === gameId && !isUpdating) {
        updateGameState(game);
      }
    };

    const handlePlayersAssigned = (game) => {
      if (game._id === gameId) {
        updateGameState(game);
      }
    };

    socket.on('moveMade', handleMoveMade);
    socket.on('playersAssigned', handlePlayersAssigned);

    return () => {
      socket.off('moveMade', handleMoveMade);
      socket.off('playersAssigned', handlePlayersAssigned);
    };
  }, [socket, gameId, updateGameState, isUpdating]);

  // Handle player's move
  const handleCellClick = async (index) => {
    if (!isPlayerTurn || board[index] || gameOver || gameStatus !== 'ongoing' || !gameId || isUpdating) return;

    const row = Math.floor(index / 3);
    const col = index % 3;
    // Get the correct symbol based on player ID
    const symbol = userId === playerId1 ? playerSymbols.player1 : playerSymbols.player2;

    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await axios.put(`https://ful2win-backend.onrender.com/api/tictactoe/move/${gameId}`, {
        row,
        col,
        playerId: userId,
        symbol,
        moveNumber: board.filter(cell => cell !== null).length + 1,
        roundNumber: roundNumber
      });

      if (response.data) {
        updateGameState(response.data);
      }
    } catch (error) {
      console.error('Error making move:', error);
      setError(error.response?.data?.error || 'Invalid move. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusMessage = () => {
    if (error) return error;
    if (gameStatus === 'waiting') return 'Waiting for opponent...';
    if (gameOver) return 'Game Over';
    if (!isPlayerTurn) return "Opponent's turn";
    return 'Your turn';
  };

  const getPlayerLabel = (isPlayer1) => {
    const symbol = isPlayer1 ? playerSymbols.player1 : playerSymbols.player2;
    return `Player ${isPlayer1 ? '1' : '2'} (${symbol})`;
  };

  return (
       <div className="flex relative w-full flex-col items-center justify-center h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/games/tictactoe-logo.jpg')" }}>
     <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    {/* <div className="flex  flex-col items-center justify-center h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/games/tictactoe-logo.jpg')" }}> */}
    {/* <div className="flex flex-col items-center bg-red-400 justify-center h-full"> */}
    {/* <div className='h-full w-full items-center bg-black/40'> */}
      {/* Round indicator */}
      <div className="bg-black/40   rounded-lg px-4 py-2 mb-6">
        <div className="flex justify-between items-center w-64">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {roundScore.player1}
            </div>
            <div className="text-xs text-black text-white/60">{getPlayerLabel(true)}</div>
            {/* <div className="text-xs text-black text-white/60">{getPlayerLabel(true)}</div> */}
          </div>
          
          <div className="text-center">
            <div className="text-lg font-medium text-white">
              Round {roundNumber}/3
            </div>
            <div className="text-xs text-white/60">
              {getStatusMessage()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {roundScore.player2}
            </div>
            <div className="text-xs text-white/60">{getPlayerLabel(false)}</div>
          </div>
        </div>
      </div>
      
      {/* Game board */}
      <div className="bg-black/40 rounded-lg p-4 shadow-lg">
        <div className="grid grid-cols-3 gap-2 w-64 h-64">
          {board.map((cell, index) => (
            <button
              key={index}
              className={`
                flex items-center justify-center z-20
                w-20 h-20 text-4xl font-bold rounded-md
                ${cell ? 'cursor-default' : 'cursor-pointer'}
                ${cell === null ? 'bg-white/20 hover:bg-white/10' : 
                  cell === playerSymbols.player1 ? 'bg-blue-500/20 text-blue-400' : 
                  'bg-red-500/20 text-red-400'}
                transition-all
              `}
              onClick={() => handleCellClick(index)}
              disabled={!isPlayerTurn || cell !== null || gameOver || gameStatus !== 'ongoing' || isUpdating}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>
      
      {/* Game status */}
      <div className="mt-6 text-center">
        <div className="text-lg text-white">
          {getStatusMessage()}
        </div>
      </div>

      {/* Round Results History */}
      {roundResults.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-white mb-2">Round History</h3>
          <div className="space-y-2">
            {roundResults.map((result, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Round {result.roundNumber}</span>
                  <span className={`font-semibold ${
                    result.winner === 'draw' ? 'text-yellow-400' :
                    result.winner === 'player1' ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    {result.winner === 'draw' ? 'Draw' :
                     result.winner === 'player1' ? 'Player 1 Won' : 'Player 2 Won'}
                  </span>
                </div>
                {/* <div className="mt-2 grid grid-cols-3 gap-1">
                  {result.board.flat().map((cell, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={`aspect-square flex items-center justify-center text-sm
                        ${cell === null ? 'bg-white/5' :
                          cell === playerSymbols.player1 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'}`}
                    >
                      {cell}
                    </div>
                  ))}
                </div> */}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* </div> */}
    </div>
  );
};

export default TictactoeGameLogic; 