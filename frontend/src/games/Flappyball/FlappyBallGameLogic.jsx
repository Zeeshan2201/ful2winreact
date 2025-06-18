import React, { useState, useEffect } from 'react';

const FlappyBallGameLogic = ({ onGameEnd, roomId, userId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate game initialization
    const timer = setTimeout(() => {
      setGameStarted(true);
      setLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (gameStarted && !gameEnded) {
      // Simulate game duration (30-60 seconds)
      const gameDuration = Math.random() * 30000 + 30000;
      
      const gameTimer = setTimeout(() => {
        // Generate random scores
        const playerScore = Math.floor(Math.random() * 100);
        const opponentScore = Math.floor(Math.random() * 100);
        
        setScore({ player: playerScore, opponent: opponentScore });
        setGameEnded(true);
        
        // Determine winner
        const winner = playerScore > opponentScore ? 'player' : 
                      playerScore < opponentScore ? 'opponent' : 'draw';
        
        // Call the game end callback
        if (onGameEnd) {
          onGameEnd({
            winner,
            score: { player: playerScore, opponent: opponentScore }
          });
        }
      }, gameDuration);
      
      return () => clearTimeout(gameTimer);
    }
  }, [gameStarted, gameEnded, onGameEnd]);

  // Handle unexpected errors during game
  const handleGameError = (error) => {
    console.error("FlappyBall game error:", error);
    setError("An unexpected error occurred during gameplay");
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-900/50">
        <div className="text-center p-6 bg-gray-900/80 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Game Error</h2>
          <p className="text-white mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white"
          >
            Restart Game
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-sky-400">
        <div className="text-center p-6">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading FlappyBall</h2>
          <p className="text-white/80">Preparing your flight...</p>
        </div>
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-sky-400">
        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-white text-lg">Your Score: {score.player}</p>
            <p className="text-white text-lg">Opponent Score: {score.opponent}</p>
          </div>
          <div className="text-2xl font-bold mb-4">
            {score.player > score.opponent ? (
              <span className="text-green-400">You Won! 🎉</span>
            ) : score.player < score.opponent ? (
              <span className="text-red-400">You Lost 😔</span>
            ) : (
              <span className="text-yellow-400">It's a Draw! 🤝</span>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Game UI */}
      <div className="absolute inset-0">
        <iframe 
          src="https://flappyballgame.boostnow.in?match_id=SSF123&player_id=Zeeshan" 
          className="w-full h-full border-0"
          title="FlappyBall Game"
        />
      </div>
    </div>
  );
};

export default FlappyBallGameLogic;
