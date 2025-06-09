import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Users, Crown, Sparkles, Dice1, Info, Clock, Target, Brain, HelpCircle } from 'lucide-react';

interface Player {
  id: number;
  wins: number;
  dice1: number;
  dice2: number;
  isRolling: boolean;
  moves: number;
  matches: number;
  hasRolled: boolean;
}

export default function DiceDuel() {
  const [players, setPlayers] = useState([
    { id: 1, wins: 0, dice1: 1, dice2: 1, isRolling: false, moves: 0, matches: 0, hasRolled: false },
    { id: 2, wins: 0, dice1: 1, dice2: 1, isRolling: false, moves: 0, matches: 0, hasRolled: false }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const [roundWinner, setRoundWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);

  useEffect(() => {
    let timer;
    if (!gameComplete && !showInstructions) {
      timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameComplete, showInstructions]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const rollDice = (playerId) => {
    if (isRolling || players[playerId - 1].hasRolled) return;
    setIsRolling(true);

    // Update moves for the current player
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, moves: player.moves + 1, isRolling: true }
        : player
    ));

    // Simulate dice rolling animation
    const rollInterval = setInterval(() => {
      setPlayers(prev => prev.map(player => 
        player.id === playerId
          ? {
              ...player,
              dice1: Math.floor(Math.random() * 6) + 1,
              dice2: Math.floor(Math.random() * 6) + 1
            }
          : player
      ));
    }, 100);

    // Stop rolling after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      setPlayers(prev => prev.map(player => 
        player.id === playerId
          ? {
              ...player,
              dice1: Math.floor(Math.random() * 6) + 1,
              dice2: Math.floor(Math.random() * 6) + 1,
              isRolling: false,
              hasRolled: true
            }
          : player
      ));
      setIsRolling(false);

      // Check if both players have rolled
      const updatedPlayers = players.map(player => 
        player.id === playerId
          ? { ...player, hasRolled: true }
          : player
      );

      if (updatedPlayers.every(player => player.hasRolled)) {
        // Determine round winner
        const player1Total = updatedPlayers[0].dice1 + updatedPlayers[0].dice2;
        const player2Total = updatedPlayers[1].dice1 + updatedPlayers[1].dice2;

        if (player1Total > player2Total) {
          setRoundWinner(1);
          updateWins(1);
        } else if (player2Total > player1Total) {
          setRoundWinner(2);
          updateWins(2);
        } else {
          setRoundWinner(0); // Draw
        }

        setCurrentRound(prev => prev + 1);
        // Reset hasRolled for next round
        setTimeout(() => {
          setPlayers(prev => prev.map(player => ({ ...player, hasRolled: false })));
          setRoundWinner(null);
        }, 2000);
      } else {
        // Switch to next player
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }, 1000);
  };

  const updateWins = (winnerId) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === winnerId) {
        const newWins = player.wins + 1;
        if (newWins >= 3) {
          setGameComplete(true);
          setShowConfetti(true);
          if (gameTime < bestTime) {
            setBestTime(gameTime);
          }
        }
        return { ...player, wins: newWins, matches: player.matches + 1 };
      }
      return player;
    }));
  };

  const resetGame = () => {
    setPlayers([
      { id: 1, wins: 0, dice1: 1, dice2: 1, isRolling: false, moves: 0, matches: 0, hasRolled: false },
      { id: 2, wins: 0, dice1: 1, dice2: 1, isRolling: false, moves: 0, matches: 0, hasRolled: false }
    ]);
    setCurrentRound(1);
    setGameComplete(false);
    setRoundWinner(null);
    setShowConfetti(false);
    setGameTime(0);
    setCurrentPlayer(1);
  };

  const getDiceEmoji = (value) => {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[value - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-pink-500/15 rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-blue-500/15 rounded-full blur-[150px] animate-float-slow-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-purple-500/15 rounded-full blur-[180px] animate-float-slow" />
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {['🎲', '🎯', '🎮', '🎪', '🎨'][Math.floor(Math.random() * 5)]}
        </div>
      ))}

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Game Header */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Player 1 Score */}
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 ${
            currentPlayer === 1 ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''
          } ${roundWinner === 1 ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/30' : ''}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="font-bold">Player 1</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {players[0].wins}
            </div>
            <div className="text-sm text-white/60 mt-1">
              Moves: {players[0].moves}
            </div>
          </div>

          {/* Game Status */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="font-bold">Dice Duel</span>
            </div>
            <div className="text-sm text-white/80">
              Round {currentRound}
            </div>
            <div className="text-sm text-white/60 mt-1">
              Time: {formatTime(gameTime)}
            </div>
          </div>

          {/* Player 2 Score */}
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 ${
            currentPlayer === 2 ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''
          } ${roundWinner === 2 ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/30' : ''}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="font-bold">Player 2</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {players[1].wins}
            </div>
            <div className="text-sm text-white/60 mt-1">
              Moves: {players[1].moves}
            </div>
          </div>
        </div>

        {/* Game Info Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowInstructions(true)}
            className="group relative flex items-center gap-2 bg-white/10 text-white font-bold py-2 px-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <HelpCircle className="h-5 w-5" />
            How to Play
          </button>
        </div>

        {/* Dice Display */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Player 1 Dice */}
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 ${
            currentPlayer === 1 ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''
          }`}>
            <div className="text-lg mb-4">Player 1's Roll</div>
            <div className="flex justify-center gap-4">
              <div className={`text-6xl transform transition-all duration-300 ${players[0].isRolling ? 'animate-bounce' : ''}`}>
                {getDiceEmoji(players[0].dice1)}
              </div>
              <div className={`text-6xl transform transition-all duration-300 ${players[0].isRolling ? 'animate-bounce' : ''}`}>
                {getDiceEmoji(players[0].dice2)}
              </div>
            </div>
            <div className="mt-4 text-xl font-bold">
              Total: {players[0].dice1 + players[0].dice2}
            </div>
            <button
              onClick={() => rollDice(1)}
              disabled={isRolling || players[0].hasRolled || currentPlayer !== 1 || gameComplete}
              className={`mt-4 group relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-full ${
                (isRolling || players[0].hasRolled || currentPlayer !== 1 || gameComplete) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              <Dice1 className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-500" />
              {players[0].isRolling ? 'Rolling...' : 'Roll Dice'}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
            </button>
          </div>

          {/* Player 2 Dice */}
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 ${
            currentPlayer === 2 ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''
          }`}>
            <div className="text-lg mb-4">Player 2's Roll</div>
            <div className="flex justify-center gap-4">
              <div className={`text-6xl transform transition-all duration-300 ${players[1].isRolling ? 'animate-bounce' : ''}`}>
                {getDiceEmoji(players[1].dice1)}
              </div>
              <div className={`text-6xl transform transition-all duration-300 ${players[1].isRolling ? 'animate-bounce' : ''}`}>
                {getDiceEmoji(players[1].dice2)}
              </div>
            </div>
            <div className="mt-4 text-xl font-bold">
              Total: {players[1].dice1 + players[1].dice2}
            </div>
            <button
              onClick={() => rollDice(2)}
              disabled={isRolling || players[1].hasRolled || currentPlayer !== 2 || gameComplete}
              className={`mt-4 group relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-full ${
                (isRolling || players[1].hasRolled || currentPlayer !== 2 || gameComplete) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              <Dice1 className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-500" />
              {players[1].isRolling ? 'Rolling...' : 'Roll Dice'}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
            </button>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="group relative flex items-center gap-2 bg-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-500" />
            Reset Game
          </button>
        </div>

        {/* Current Player Indicator */}
        {!gameComplete && !roundWinner && (
          <div className="mt-8 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 inline-block">
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <Users className="h-6 w-6" />
                Player {currentPlayer}'s Turn
              </div>
            </div>
          </div>
        )}

        {/* Round Result */}
        {roundWinner !== null && !gameComplete && (
          <div className="mt-8 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 inline-block">
              {roundWinner === 0 ? (
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <Trophy className="h-6 w-6" />
                  It's a Draw!
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Crown className="h-6 w-6" />
                  Player {roundWinner} Wins the Round!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Complete Modal */}
        {gameComplete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 scale-100 animate-modal-in">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-yellow-400 animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Game Complete!
                </h2>
                <div className="text-xl mb-6">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Crown className="h-8 w-8" />
                    Player {players[0].wins > players[1].wins ? 1 : 2} Wins!
                  </div>
                </div>
                <div className="text-lg mb-8 bg-white/5 rounded-xl p-4">
                  <div className="font-bold mb-2">Game Statistics:</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-sm text-white/60">Time</div>
                      <div className="font-bold">{formatTime(gameTime)}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-sm text-white/60">Best Time</div>
                      <div className="font-bold">{bestTime === Infinity ? '-' : formatTime(bestTime)}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-sm text-white/60">Player 1 Moves</div>
                      <div className="font-bold">{players[0].moves}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-sm text-white/60">Player 2 Moves</div>
                      <div className="font-bold">{players[1].moves}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetGame}
                  className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Play Again
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 scale-100 animate-modal-in">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Info className="h-12 w-12 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  How to Play
                </h2>
                <div className="text-left space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 rounded-lg p-2">
                      <Target className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Objective</h3>
                      <p className="text-white/80">Be the first player to win 3 rounds by rolling higher dice totals.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 rounded-lg p-2">
                      <Dice1 className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Gameplay</h3>
                      <p className="text-white/80">Each round, both players roll two dice. The player with the higher total wins the round.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 rounded-lg p-2">
                      <Clock className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Time Challenge</h3>
                      <p className="text-white/80">Try to complete the game as quickly as possible to set a new best time!</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Got it!
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-35px) scale(1.12); }
        }
        @keyframes float-slow-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-35px) scale(1.12); }
        }
        @keyframes modal-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
          50% { transform: translateY(0) translateX(20px) rotate(180deg); }
          75% { transform: translateY(20px) translateX(10px) rotate(270deg); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-slow-delayed {
          animation: float-slow-delayed 12s ease-in-out infinite 2s;
        }
        .animate-modal-in {
          animation: modal-in 0.5s ease-out forwards;
        }
        .animate-confetti {
          animation: confetti 5s linear forwards;
        }
        .animate-float-particle {
          animation: float-particle 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 