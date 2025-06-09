import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Users, Crown, Sparkles, Star, Heart, Zap, Info, Clock, Target, Brain } from 'lucide-react';

// Card emojis for the game
const cardEmojis = [
  '🎮', '🎲', '🎯', '🎨',
  '🎭', '🎪', '🎢', '🎡',
  '🎮', '🎲', '🎯', '🎨',
  '🎭', '🎪', '🎢', '🎡'
];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Player {
  id: number;
  score: number;
  isActive: boolean;
  matches: number;
  moves: number;
}

interface MemoryMatchGameProps {
  onGameEnd?: (result: { winner: string; score: { player: number; opponent: number } }) => void;
  isMultiplayer?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack?: () => void;
}

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ 
  onGameEnd, 
  isMultiplayer = false, 
  difficulty = 'medium',
  onBack
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [players, setPlayers] = useState([
    { id: 1, score: 0, isActive: true, matches: 0, moves: 0 },
    { id: 2, score: 0, isActive: false, matches: 0, moves: 0 }
  ]);
  const [gameComplete, setGameComplete] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showInstructions, setShowInstructions] = useState(!isMultiplayer);
  const [gameTime, setGameTime] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!gameComplete && !showInstructions) {
      timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameComplete, showInstructions]);

  // Effect to handle game completion and trigger the onGameEnd callback
  useEffect(() => {
    if (gameComplete) {
      if (onGameEnd) {
        // For multiplayer mode, call the onGameEnd callback
        const winner = getWinner();
        onGameEnd({
          winner: winner === 1 ? 'player' : winner === 2 ? 'opponent' : 'draw',
          score: {
            player: players[0].score,
            opponent: players[1].score
          }
        });
      }
      // In single player mode, show confetti
      if (!isMultiplayer) {
        setShowConfetti(true);
      }
    }
  }, [gameComplete, players, onGameEnd, isMultiplayer]);

  const initializeGame = () => {
    // Get card set based on difficulty
    let gameCards = [...cardEmojis];
    
    if (difficulty === 'easy') {
      gameCards = gameCards.slice(0, 12); // 6 pairs
    } else if (difficulty === 'hard') {
      // Add more cards for hard difficulty
      const extraCards = ['🍎', '🍊', '🍇', '🍓', '🍎', '🍊', '🍇', '🍓'];
      gameCards = [...gameCards, ...extraCards];
    }
    
    // Shuffle cards
    const shuffledCards = [...gameCards]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setPlayers([
      { id: 1, score: 0, isActive: true, matches: 0, moves: 0 },
      { id: 2, score: 0, isActive: false, matches: 0, moves: 0 }
    ]);
    setGameComplete(false);
    setIsLocked(false);
    setShowConfetti(false);
    setGameTime(0);
  };

  const handleCardClick = (cardId: number) => {
    if (isLocked || flippedCards.length >= 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    // Update moves for current player
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.isActive) {
          return { ...player, moves: player.moves + 1 };
        }
        return player;
      });
    });

    // If two cards are flipped, check for a match
    if (flippedCards.length === 1) {
      setIsLocked(true);
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[cardId];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          const updatedCards = cards.map(card => {
            if (card.id === firstCard.id || card.id === secondCard.id) {
              return { ...card, isMatched: true };
            }
            return card;
          });
          setCards(updatedCards);
          setFlippedCards([]);
          setIsLocked(false);

          // Update score and matches for current player
          setPlayers(prevPlayers => {
            const updatedPlayers = prevPlayers.map(player => {
              if (player.isActive) {
                return { 
                  ...player, 
                  score: player.score + 1,
                  matches: player.matches + 1
                };
              }
              return player;
            });
            return updatedPlayers;
          });

          // Check if game is complete
          const allMatched = updatedCards.every(card => card.isMatched);
          if (allMatched) {
            setGameComplete(true);
            setShowConfetti(true);
            if (gameTime < bestTime) {
              setBestTime(gameTime);
            }
            
            // In multiplayer mode, trigger game end immediately 
            if (isMultiplayer) {
              // The onGameEnd will be called by the useEffect we added
            }
          }
        }, isMultiplayer ? 500 : 1000); // Faster animations for multiplayer
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = cards.map(card => {
            if (card.id === firstCard.id || card.id === secondCard.id) {
              return { ...card, isFlipped: false };
            }
            return card;
          });
          setCards(updatedCards);
          setFlippedCards([]);
          setIsLocked(false);

          // Switch player
          setPlayers(prevPlayers => {
            return prevPlayers.map(player => ({
              ...player,
              isActive: !player.isActive
            }));
          });
        }, isMultiplayer ? 800 : 1500); // Faster animations for multiplayer
      }
    }
  };

  const getWinner = () => {
    if (players[0].score === players[1].score) return 'draw';
    return players[0].score > players[1].score ? 1 : 2;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-pink-500/15 rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-blue-500/15 rounded-full blur-[150px] animate-float-slow-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-purple-500/15 rounded-full blur-[180px] animate-float-slow" />
      </div>

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

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10 pt-16">
        {/* Game Header */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Player 1 Score */}
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 ${
            players[0].isActive ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30 animate-pulse' : ''
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="font-bold">You</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {players[0].score}
            </div>
            <div className="text-sm text-white/60 mt-1">
              Moves: {players[0].moves}
            </div>
          </div>

          {/* Game Status */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="font-bold">Memory Match</span>
            </div>
            <div className="text-sm text-white/80">
              {gameComplete ? 'Game Complete!' : 'Find matching pairs'}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-white/60">
              <Clock className="h-4 w-4" />
              {formatTime(gameTime)}
            </div>
          </div>

          {/* Player 2 Score */}
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 ${
            players[1].isActive ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30 animate-pulse' : ''
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="font-bold">Opponent</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {players[1].score}
            </div>
            <div className="text-sm text-white/60 mt-1">
              Moves: {players[1].moves}
            </div>
          </div>
        </div>

        {/* Game Board - Centered and responsive */}
        <div className="grid grid-cols-4 gap-3 mx-auto max-w-md mb-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square cursor-pointer perspective-1000 transform hover:scale-105 transition-all duration-300 ${
                card.isMatched ? 'opacity-50' : ''
              }`}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                  card.isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Card Back */}
                <div className="absolute w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl backface-hidden flex items-center justify-center text-4xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <span className="animate-pulse">?</span>
                </div>
                {/* Card Front */}
                <div className="absolute w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-xl backface-hidden rotate-y-180 flex items-center justify-center text-4xl shadow-lg">
                  {card.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Only show game controls for non-multiplayer mode */}
        {!isMultiplayer && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowInstructions(true)}
              className="group relative flex items-center gap-2 bg-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Info className="h-5 w-5" />
              How to Play
            </button>
            <button
              onClick={initializeGame}
              className="group relative flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <RefreshCw className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-500" />
              {gameComplete ? 'Play Again' : 'Restart Game'}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
            </button>
          </div>
        )}

        {/* Instructions Modal */}
        {showInstructions && !isMultiplayer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 scale-100 animate-modal-in">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Brain className="h-12 w-12 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  How to Play
                </h2>
                <div className="text-left space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <p>Find matching pairs of cards by flipping them over.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <p>Players take turns flipping two cards at a time.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <p>If you find a match, you score a point and get another turn.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <p>Try to complete the game in the shortest time possible!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Playing
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Complete Modal */}
        {gameComplete && !isMultiplayer && (
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
                  {getWinner() === 'draw' ? (
                    <div className="flex items-center justify-center gap-2 text-yellow-400">
                      <Trophy className="h-8 w-8" />
                      It's a Draw!
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Crown className="h-8 w-8" />
                      Player {getWinner()} Wins!
                    </div>
                  )}
                </div>
                <div className="text-lg mb-8 bg-white/5 rounded-xl p-4">
                  <div className="font-bold mb-2">Game Statistics:</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-sm text-white/60">Player 1</div>
                      <div className="text-lg">Score: {players[0].score}</div>
                      <div className="text-sm text-white/60">Moves: {players[0].moves}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-sm text-white/60">Player 2</div>
                      <div className="text-lg">Score: {players[1].score}</div>
                      <div className="text-sm text-white/60">Moves: {players[1].moves}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-white/60">
                    Time: {formatTime(gameTime)}
                  </div>
                </div>
                <button
                  onClick={initializeGame}
                  className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Play Again
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

      <style>
        {`
          .perspective-1000 {
            perspective: 1000px;
          }
          .transform-style-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
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
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-40px) translateX(-10px); }
            75% { transform: translateY(-20px) translateX(10px); }
          }
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
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
          .animate-float-particle {
            animation: float-particle 5s ease-in-out infinite;
          }
          .animate-confetti {
            animation: confetti 5s linear forwards;
          }
        `}
      </style>
    </div>
  );
}

export default MemoryMatchGame;