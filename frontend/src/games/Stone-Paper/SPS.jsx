import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Timer, Users, Crown, RefreshCw } from 'lucide-react';

const choices = ['✊', '✋', '✌️'];
const choiceNames = {
  '✊': 'Stone',
  '✋': 'Paper',
  '✌️': 'Scissors'
};

const getWinner = (player1, player2) => {
  if (player1 === player2) return 'draw';
  if (
    (player1 === '✊' && player2 === '✌️') ||
    (player1 === '✋' && player2 === '✊') ||
    (player1 === '✌️' && player2 === '✋')
  ) {
    return 'player1';
  }
  return 'player2';
};

export default function SPS() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, result
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(3);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [round, setRound] = useState(1);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (gameState === 'playing' && timer === 0) {
      // Simulate player 2's choice
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];
      setPlayer2Choice(randomChoice);
      
      // Determine winner
      const result = getWinner(player1Choice, randomChoice);
      setWinner(result);
      
      // Update scores
      if (result !== 'draw') {
        setScores(prev => {
          const newScores = {
            ...prev,
            [result]: prev[result] + 1
          };
          
          // Check if game is complete (someone reached 2 wins)
          if (newScores.player1 === 2 || newScores.player2 === 2) {
            setGameComplete(true);
          }
          
          return newScores;
        });
      }
      
      // Add to game history
      setGameHistory(prev => [...prev, {
        round,
        player1: player1Choice,
        player2: randomChoice,
        winner: result
      }]);
      
      setGameState('result');
    }
  }, [gameState, timer, player1Choice, round]);

  const resetGame = () => {
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setWinner(null);
    setTimer(3);
    setGameState('waiting');
    setRound(1);
    setScores({ player1: 0, player2: 0 });
    setGameHistory([]);
    setGameComplete(false);
  };

  const startNewRound = () => {
    if (gameComplete) {
      resetGame();
      return;
    }
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setWinner(null);
    setTimer(3);
    setGameState('waiting');
    setRound(prev => prev + 1);
  };

  const handleChoice = (choice) => {
    setPlayer1Choice(choice);
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Game Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="font-bold">Round {round}</span>
            </div>
            <div className="text-2xl font-bold">
              {scores.player1} - {scores.player2}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="font-bold">Best of 3</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.max(scores.player1, scores.player2)} / 3
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-5 w-5 text-red-400" />
              <span className="font-bold">Time Left</span>
            </div>
            <div className="text-2xl font-bold">
              {gameState === 'playing' ? timer : '--'}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Player 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">You</h3>
              <div className="text-6xl mb-4">
                {player1Choice || '❓'}
              </div>
              <div className="text-sm text-white/60">
                {player1Choice ? choiceNames[player1Choice] : 'Choose your move'}
              </div>
            </div>
          </div>

          {/* Player 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">Opponent</h3>
              <div className="text-6xl mb-4">
                {player2Choice || '❓'}
              </div>
              <div className="text-sm text-white/60">
                {player2Choice ? choiceNames[player2Choice] : 'Waiting...'}
              </div>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        {gameState === 'waiting' && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-6 text-4xl transform hover:scale-105 transition-all duration-300"
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {/* Result Display */}
        {gameState === 'result' && (
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-4">
              {winner === 'draw' ? (
                "It's a Draw!"
              ) : winner === 'player1' ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Crown className="h-6 w-6" />
                  You Won!
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-400">
                  <Crown className="h-6 w-6" />
                  Opponent Won!
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={startNewRound}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
              >
                {gameComplete ? 'Play Again' : 'Next Round'}
              </button>
              {gameComplete && (
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                >
                  <RefreshCw className="h-5 w-5" />
                  Reset Game
                </button>
              )}
            </div>
          </div>
        )}

        {/* Game History */}
        {gameHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Game History</h3>
            <div className="space-y-2">
              {gameHistory.map((round, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                >
                  <span className="text-white/60">Round {round.round}</span>
                  <div className="flex items-center gap-4">
                    <span>{round.player1}</span>
                    <span className="text-white/40">vs</span>
                    <span>{round.player2}</span>
                  </div>
                  <span className={`
                    ${round.winner === 'draw' ? 'text-yellow-400' : 
                      round.winner === 'player1' ? 'text-green-400' : 'text-red-400'}
                  `}>
                    {round.winner === 'draw' ? 'Draw' :
                     round.winner === 'player1' ? 'You Won' : 'Opponent Won'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 