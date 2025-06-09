import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react';

/**
 * GameResultLobby - A reusable component to show game results across all games
 * This displays the game outcome, score, and options to play again or exit
 */
const GameResultLobby = ({
  gameType,
  gameMode = 'Classic',
  winner,
  score,
  winAmount,
  entryFee,
  gameDetails = {},
  onPlayAgain,
  onExit
}) => {
  const navigate = useNavigate();
  const isWinner = winner === 'player';
  
  // Handle play again button
  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    }
  };
  
  // Handle exit button
  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      // Default behavior - navigate to home
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen bg-[#31036e] text-white p-4">
      {/* Result header */}
      <div className="w-full max-w-md bg-white/10 rounded-lg p-6 mb-6 text-center">
        <div className={`text-3xl font-bold mb-2 ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
          {isWinner ? 'You Won!' : 'You Lost!'}
        </div>
        <div className="text-lg text-white/80">
          {gameType} - {gameMode} Mode
        </div>
      </div>
      
      {/* Score display */}
      <div className="w-full max-w-md bg-white/10 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{score?.player || 0}</div>
            <div className="text-sm text-white/60">You</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-1">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-sm text-white/60">Final Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{score?.opponent || 0}</div>
            <div className="text-sm text-white/60">Opponent</div>
          </div>
        </div>
      </div>
      
      {/* Game specific details */}
      {gameDetails && Object.keys(gameDetails).length > 0 && (
        <div className="w-full max-w-md bg-white/10 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-3">Game Details</h3>
          <div className="space-y-2">
            {Object.entries(gameDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Prize information */}
      <div className="w-full max-w-md bg-white/10 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-white/70">Entry Fee</div>
            <div className="text-xl font-medium">₹{entryFee}</div>
          </div>
          
          <div className="text-center">
            {isWinner ? (
              <div className="text-green-400 font-bold">+₹{winAmount}</div>
            ) : (
              <div className="text-red-400 font-bold">-₹{entryFee}</div>
            )}
          </div>
          
          <div>
            <div className="text-white/70 text-right">Prize</div>
            <div className="text-xl font-medium">₹{winAmount}</div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="w-full max-w-md flex gap-4">
        <button
          onClick={handleExit}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit</span>
        </button>
        
        <button
          onClick={handlePlayAgain}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
};

export default GameResultLobby; 