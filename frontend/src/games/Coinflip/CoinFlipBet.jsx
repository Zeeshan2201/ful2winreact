import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, Crown, Sparkles, Coins, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CoinFlipBet() {
  const [players, setPlayers] = useState([
    { id: 1, balance: 100, choice: null },
    { id: 2, balance: 100, choice: null }
  ]);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const [roundWinner, setRoundWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);
  const [showDoubleOrNothing, setShowDoubleOrNothing] = useState(false);
  const [lastWinner, setLastWinner] = useState(null);
  const [flipResult, setFlipResult] = useState(null);
  const [betAmount, setBetAmount] = useState(0);

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

  const handleBet = (amount) => {
    const maxBet = Math.min(players[0].balance, players[1].balance);
    if (amount > maxBet) return;
    setBetAmount(amount);
  };

  const handleChoice = (playerId, choice) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId
        ? { ...player, choice }
        : player
    ));
  };

  const flipCoin = () => {
    if (isFlipping) return;
    if (!betAmount || !players.every(player => player.choice)) return;

    setIsFlipping(true);
    setFlipResult(null);

    // Simulate coin flip animation
    const flipInterval = setInterval(() => {
      setFlipResult(Math.random() < 0.5 ? 'heads' : 'tails');
    }, 100);

    // Stop flipping after 2 seconds
    setTimeout(() => {
      clearInterval(flipInterval);
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      setFlipResult(result);
      setIsFlipping(false);

      // Determine winner
      const player1Correct = players[0].choice === result;
      const player2Correct = players[1].choice === result;
      const totalPot = betAmount * 2;

      if (player1Correct && !player2Correct) {
        setRoundWinner(1);
        updateBalance(1, totalPot);
        setLastWinner(1);
      } else if (player2Correct && !player1Correct) {
        setRoundWinner(2);
        updateBalance(2, totalPot);
        setLastWinner(2);
      } else {
        setRoundWinner(0); // Draw
        // Return bets
        setPlayers(prev => prev.map(player => ({
          ...player,
          balance: player.balance + betAmount,
          choice: null
        })));
      }

      setCurrentRound(prev => prev + 1);
      setBetAmount(0);
      setTimeout(() => {
        setRoundWinner(null);
        if (roundWinner !== 0) {
          setShowDoubleOrNothing(true);
        }
      }, 2000);
    }, 2000);
  };

  const updateBalance = (winnerId, amount) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === winnerId) {
        const newBalance = player.balance + amount;
        if (newBalance >= 200) {
          setGameComplete(true);
          setShowConfetti(true);
          if (gameTime < bestTime) {
            setBestTime(gameTime);
          }
        }
        return { ...player, balance: newBalance, choice: null };
      }
      return { ...player, choice: null };
    }));
  };

  const handleDoubleOrNothing = (accept) => {
    if (accept) {
      const winner = players[lastWinner - 1];
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      const isCorrect = winner.choice === result;

      if (isCorrect) {
        updateBalance(lastWinner, winner.balance);
      } else {
        setPlayers(prev => prev.map(player => 
          player.id === lastWinner
            ? { ...player, balance: 0, choice: null }
            : player
        ));
      }
    }
    setShowDoubleOrNothing(false);
  };

  const resetGame = () => {
    setPlayers([
      { id: 1, balance: 100, choice: null },
      { id: 2, balance: 100, choice: null }
    ]);
    setCurrentRound(1);
    setGameComplete(false);
    setRoundWinner(null);
    setShowConfetti(false);
    setGameTime(0);
    setShowDoubleOrNothing(false);
    setLastWinner(null);
    setFlipResult(null);
    setBetAmount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-fuchsia-500/10 rounded-full blur-[150px] animate-float-slow-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/10 rounded-full blur-[180px] animate-float-slow" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Game Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Coins className="h-8 w-8 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Coin Flip Bet
            </h1>
          </div>
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <span className="text-white/60">Round:</span>
              <span className="font-bold">{currentRound}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60">Time:</span>
              <span className="font-bold">{formatTime(gameTime)}</span>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Player 1 Section */}
          <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
            <div className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Player 1
            </div>
            <div className="space-y-4">
              <button
                onClick={() => handleChoice(1, 'heads')}
                className={`w-full py-4 rounded-xl transition-all duration-300 text-lg font-medium ${
                  players[0].choice === 'heads'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                Heads
              </button>
              <button
                onClick={() => handleChoice(1, 'tails')}
                className={`w-full py-4 rounded-xl transition-all duration-300 text-lg font-medium ${
                  players[0].choice === 'tails'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                Tails
              </button>
            </div>
          </div>

          {/* Center Section - Coin and Bet */}
          <div className="flex flex-col items-center justify-between">
            {/* Coin Display */}
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-md rounded-2xl p-8 mb-6 shadow-xl border border-white/10 text-center">
              <div className="text-9xl mb-4 transform transition-all duration-500">
                {isFlipping ? (
                  <div className="animate-flip">🪙</div>
                ) : flipResult ? (
                  <div>
                    {flipResult === 'heads' ? '🪙' : '🪙'}
                  </div>
                ) : (
                  '🪙'
                )}
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                {flipResult ? `Result: ${flipResult.toUpperCase()}` : 'Ready to Flip'}
              </div>
            </div>

            {/* Bet Input */}
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-md rounded-2xl p-6 w-full shadow-xl border border-white/10">
              <div className="text-xl mb-4 text-center font-medium">Place Your Bet</div>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={Math.min(players[0].balance, players[1].balance)}
                  value={betAmount || ''}
                  onChange={(e) => handleBet(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter bet amount"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                  <Coins className="h-5 w-5" />
                </div>
              </div>
              <div className="text-sm text-white/60 mt-2 text-center">
                Maximum bet: {Math.min(players[0].balance, players[1].balance)}
              </div>
            </div>
          </div>

          {/* Player 2 Section */}
          <div className="bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
            <div className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Player 2
            </div>
            <div className="space-y-4">
              <button
                onClick={() => handleChoice(2, 'heads')}
                className={`w-full py-4 rounded-xl transition-all duration-300 text-lg font-medium ${
                  players[1].choice === 'heads'
                    ? 'bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-lg shadow-fuchsia-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                Heads
              </button>
              <button
                onClick={() => handleChoice(2, 'tails')}
                className={`w-full py-4 rounded-xl transition-all duration-300 text-lg font-medium ${
                  players[1].choice === 'tails'
                    ? 'bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-lg shadow-fuchsia-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                Tails
              </button>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <button
            onClick={flipCoin}
            disabled={isFlipping || !betAmount || !players.every(player => player.choice)}
            className={`group relative flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
              (isFlipping || !betAmount || !players.every(player => player.choice)) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            <Coins className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-500" />
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
          </button>
          <button
            onClick={resetGame}
            className="group relative flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/10"
          >
            <RefreshCw className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-500" />
            Reset Game
          </button>
        </div>

        {/* Round Result */}
        {roundWinner !== null && !gameComplete && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-md rounded-xl p-4 inline-block shadow-xl border border-white/10">
              {roundWinner === 0 ? (
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <Coins className="h-6 w-6" />
                  It's a Draw! Bets Returned
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

        {/* Double or Nothing Modal */}
        {showDoubleOrNothing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-500 scale-100 animate-modal-in shadow-xl border border-white/10">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-yellow-400 animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  Double or Nothing?
                </h2>
                <p className="text-lg mb-8 text-white/90">
                  Player {lastWinner}, you can risk your winnings on another flip!
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <button
                    onClick={() => handleDoubleOrNothing(true)}
                    className="group relative bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Double Up!
                  </button>
                  <button
                    onClick={() => handleDoubleOrNothing(false)}
                    className="group relative bg-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/10"
                  >
                    Keep Winnings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Complete Modal */}
        {gameComplete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-500 scale-100 animate-modal-in shadow-xl border border-white/10">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-yellow-400 animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  Game Complete!
                </h2>
                <div className="text-2xl mb-8">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Crown className="h-8 w-8" />
                    Player {players[0].balance > players[1].balance ? '1' : '2'} Wins!
                  </div>
                </div>
                <div className="text-lg mb-8 bg-white/5 rounded-xl p-6">
                  <div className="font-bold mb-4 text-xl">Game Statistics:</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-sm text-white/60">Time</div>
                      <div className="font-bold text-lg">{formatTime(gameTime)}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-sm text-white/60">Best Time</div>
                      <div className="font-bold text-lg">{bestTime === Infinity ? '-' : formatTime(bestTime)}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetGame}
                  className="group relative bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg w-full md:w-auto"
                >
                  Play Again
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
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
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(720deg); }
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
        .animate-flip {
          animation: flip 2s linear infinite;
        }
      `}</style>
    </div>
  );
} 