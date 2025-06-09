import React, { useState, useEffect, useCallback } from 'react';
import MemoryMatchGame from './MemoryMatchGame';

const MemoryMatchGameLogic = ({ onGameEnd }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Safely handle game completion
  const handleGameComplete = useCallback((result) => {
    try {
      // Format the result for the GameConnector
      const formattedResult = {
        winner: result.playerWon ? 'player' : 'opponent',
        score: {
          player: result.playerScore || 0,
          opponent: result.opponentScore || 0
        }
      };
      
      // Pass the result to the parent component
      if (onGameEnd) {
        onGameEnd(formattedResult);
      }
    } catch (err) {
      console.error("Error handling game completion:", err);
      setError("Failed to process game results");
    }
  }, [onGameEnd]);

  useEffect(() => {
    // Start the game after a short delay
    const timer = setTimeout(() => {
      setGameStarted(true);
      setLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle unexpected errors during game
  const handleGameError = (error) => {
    console.error("Game error:", error);
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
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading Memory Match Game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MemoryMatchGame 
        onGameComplete={handleGameComplete}
        onError={handleGameError}
        gameMode="classic"
        difficulty="medium"
      />
    </div>
  );
};

export default MemoryMatchGameLogic; 