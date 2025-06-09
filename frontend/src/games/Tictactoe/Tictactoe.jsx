import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Trophy, Users, Crown, RefreshCw, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TicTacToe = ({ onBack }) => {
  const [gameState, setGameState] = useState('playing'); // playing, result, gameEnd
  const [board, setBoard] = useState(() => Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('tictactoeScores')) || { player1: 0, player2: 0 };
    return saved;
  });
  const [round, setRound] = useState(1);
  const [gameHistory, setGameHistory] = useState(() =>
    JSON.parse(localStorage.getItem('tictactoeHistory')) || []
  );
  const [gameComplete, setGameComplete] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const clickSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const actionRef = useRef({ isProcessing: false }); // Debounce actions

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const checkWin = useCallback((board) => {
    for (const combination of winningCombinations) {
      if (combination.every((index) => board[index] === currentPlayer)) {
        return currentPlayer === 'X' ? 'player1' : 'player2';
      }
    }
    return null;
  }, [currentPlayer]);

  const handleCellClick = useCallback(
    (index) => {
      if (board[index] !== '' || gameState !== 'playing' || winner || actionRef.current.isProcessing)
        return;
      actionRef.current.isProcessing = true;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setMoveHistory((prev) => [...prev, { index, player: currentPlayer }]);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      clickSoundRef.current?.play().catch(() => {});
      setTimeout(() => {
        actionRef.current.isProcessing = false;
      }, 100); // Debounce
    },
    [board, gameState, winner, currentPlayer]
  );

  const undoMove = useCallback(() => {
    if (
      moveHistory.length === 0 ||
      gameState !== 'playing' ||
      actionRef.current.isProcessing
    )
      return;
    actionRef.current.isProcessing = true;

    const lastMove = moveHistory[moveHistory.length - 1];
    const newBoard = [...board];
    newBoard[lastMove.index] = '';
    setBoard(newBoard);
    setCurrentPlayer(lastMove.player);
    setMoveHistory((prev) => prev.slice(0, -1));
    setTimeout(() => {
      actionRef.current.isProcessing = false;
    }, 100);
  }, [moveHistory, board, gameState]);

  const startNewRound = useCallback(() => {
    if (actionRef.current.isProcessing) return;
    actionRef.current.isProcessing = true;

    setBoard(Array(9).fill(''));
    setWinner(null);
    setCurrentPlayer('X');
    setGameState('playing');
    setRound((prev) => prev + 1);
    setMoveHistory([]);
    setTimeout(() => {
      actionRef.current.isProcessing = false;
    }, 100);
  }, []);

  const resetGame = useCallback(() => {
    if (actionRef.current.isProcessing) return;
    actionRef.current.isProcessing = true;

    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setWinner(null);
    setGameState('playing');
    setRound(1);
    setScores({ player1: 0, player2: 0 });
    setGameHistory([]);
    setGameComplete(false);
    setMoveHistory([]);
    localStorage.removeItem('tictactoeHistory');
    localStorage.removeItem('tictactoeScores');
    setTimeout(() => {
      actionRef.current.isProcessing = false;
    }, 100);
  }, []);

  const getGameEndMessage = useCallback(() => {
    if (scores.player1 > scores.player2) {
      return (
        <div className="flex items-center justify-center gap-2 text-green-400">
          <Crown className="h-6 w-6" />
          Player X Wins the Match!
        </div>
      );
    } else if (scores.player2 > scores.player1) {
      return (
        <div className="flex items-center justify-center gap-2 text-red-400">
          <Crown className="h-6 w-6" />
          Player O Wins the Match!
        </div>
      );
    } else {
      return "Match Ended in a Tie!";
    }
  }, [scores]);

  useEffect(() => {
    clickSoundRef.current = new Audio('https://freesound.org/data/previews/171/171671_2437358-lq.mp3');
    winSoundRef.current = new Audio('https://freesound.org/data/previews/511/511484_5121236-lq.mp3');
    return () => {
      clickSoundRef.current = null;
      winSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tictactoeScores', JSON.stringify(scores));
    if (scores.player1 >= 2 || scores.player2 >= 2) {
      setGameComplete(true);
      setGameState('gameEnd');
      setTimeout(() => {
        resetGame();
      }, 2000); // Brief delay to show game end
    }
  }, [scores, resetGame]);

  useEffect(() => {
    localStorage.setItem('tictactoeHistory', JSON.stringify(gameHistory));
  }, [gameHistory]);

  useEffect(() => {
    if (gameState === 'playing') {
      const result = checkWin(board);
      if (result) {
        setWinner(result);
        setScores((prev) => {
          const newScores = { ...prev, [result]: prev[result] + 1 };
          return newScores;
        });
        setGameHistory((prev) => [
          ...prev,
          { round, board: [...board], winner: result },
        ]);
        winSoundRef.current?.play().catch(() => {});
        setGameState('result');
        setTimeout(() => {
          startNewRound();
        }, 2000); // Brief delay to show result
      } else if (board.every((cell) => cell !== '')) {
        setWinner('draw');
        setGameHistory((prev) => [
          ...prev,
          { round, board: [...board], winner: 'draw' },
        ]);
        setGameState('result');
        setTimeout(() => {
          startNewRound();
        }, 2000); // Brief delay to show result
      }
    }
  }, [board, gameState, round, checkWin, startNewRound]);

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white px-4 py-2 font-inter flex flex-col justify-between">
      <div className="w-full flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label="Back to Dashboard"
            disabled={actionRef.current.isProcessing}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </motion.div>

        {/* Game Info */}
        <motion.div
          className="mb-2 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {/* First Row: Round and Best of 3 */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 gap-4 place-items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 bg-gradient-to-r from-purple-800/20 to-blue-800/20 hover:shadow-glow transition-all duration-300 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            role="region"
            aria-describedby="game-info"
          >
            {[
              {
                icon: <Users className="h-5 w-5 text-blue-400" />,
                title: `Round ${round}`,
                value: `${scores.player1} - ${scores.player2}`,
              },
              {
                icon: <Trophy className="h-5 w-5 text-yellow-400" />,
                title: 'Best of 3',
                value: `${Math.max(scores.player1, scores.player2)} / 3`,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center w-full"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.span whileHover={{ scale: 1.1 }}>{item.icon}</motion.span>
                  <span className="font-semibold text-base tracking-tight">{item.title}</span>
                </div>
                <div className="text-2xl font-bold text-white/90">{item.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second Row: Current Turn */}
          <motion.div
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center bg-gradient-to-r from-purple-800/20 to-blue-800/20 hover:shadow-glow transition-all duration-300 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            role="region"
            aria-describedby="current-turn"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.span whileHover={{ scale: 1.1 }}>
                <Users className="h-5 w-5 text-red-400" />
              </motion.span>
              <span className="font-semibold text-base tracking-tight">CURRENT TEAM PLAYER</span>
            </div>
            <div className="text-2xl font-bold text-white/90">
              {gameState === 'gameEnd' ? 'Game Over' : `Player ${currentPlayer}`}
            </div>
          </motion.div>
        </motion.div>

        {/* Game Board */}
        <motion.div
          className="mb-2 flex-1"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 w-full">
            <div className="text-center mb-2">
              <h3 className="text-lg font-semibold tracking-tight mb-1">GAMEBOARD</h3>
              <div className="grid grid-cols-3 gap-1 bg-gray-800 p-1 mx-auto w-fit">
                {board.map((cell, index) => (
                  <motion.div
                    key={index}
                    role="button"
                    aria-label={`Cell ${index + 1}, ${cell || 'empty'}`}
                    className="w-16 h-16 bg-white flex items-center justify-center text-xl font-bold text-gray-800 cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                    onClick={() => handleCellClick(index)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCellClick(index)}
                    tabIndex={0}
                    whileHover={{ scale: gameState === 'playing' ? 1.05 : 1 }}
                    whileTap={{ scale: gameState === 'playing' ? 0.95 : 1 }}
                    style={{
                      pointerEvents: gameState === 'playing' ? 'auto' : 'none',
                    }}
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          {cell}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        {gameState !== 'gameEnd' && (
          <motion.div
            className="flex justify-center gap-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setIsMultiplayer(!isMultiplayer)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label={isMultiplayer ? 'Switch to Single Player' : 'Switch to Multiplayer'}
              disabled={actionRef.current.isProcessing}
            >
              {isMultiplayer ? 'Single Player' : 'Multiplayer'}
            </button>
            <button
              onClick={undoMove}
              disabled={moveHistory.length === 0 || gameState !== 'playing' || actionRef.current.isProcessing}
              className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              aria-label="Undo Last Move"
            >
              <RotateCcw className="h-4 w-4" />
              Undo
            </button>
          </motion.div>
        )}

        {/* Result Display */}
        <AnimatePresence>
          {gameState === 'result' && !gameComplete && (
            <motion.div
              className="text-center mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-xl font-bold mb-2">
                {winner === 'draw' ? (
                  "It's a Draw!"
                ) : winner === 'player1' ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Crown className="h-5 w-5" />
                    Player X Won!
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-red-400">
                    <Crown className="h-5 w-5" />
                    Player O Won!
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game End Display */}
        <AnimatePresence>
          {gameState === 'gameEnd' && (
            <motion.div
              className="text-center mb-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="text-xl font-bold mb-2">Game Over!</div>
              <div className="text-lg font-bold mb-2">{getGameEndMessage()}</div>
              <div className="text-sm text-gray-300 mb-2">
                Final Score: {scores.player1} - ${scores.player2}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game History */}
        {gameHistory.length > 0 && gameState !== 'gameEnd' && (
          <motion.div
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 max-h-40 overflow-y-auto w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-base font-semibold tracking-tight mb-2">GAME HISTORY</h3>
            <div className="space-y-1">
              {gameHistory.map((record, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-2 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-white/60">Round {record.round}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono">
                      {record.board.slice(0, 3).join('|')}<br />
                      {record.board.slice(3, 6).join('|')}<br />
                      {record.board.slice(6, 9).join('|')}
                    </span>
                  </div>
                  <span
                    className={`${
                      record.winner === 'draw'
                        ? 'text-yellow-400'
                        : record.winner === 'player1'
                        ? 'text-green-400'
                        : 'text-red-400'
                    } font-semibold text-xs`}
                  >
                    {record.winner === 'draw'
                      ? 'Draw'
                      : record.winner === 'player1'
                      ? 'X Won'
                      : 'O Won'}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;