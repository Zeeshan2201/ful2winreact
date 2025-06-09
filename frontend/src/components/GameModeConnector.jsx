import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import EnhancedGameLobby from './EnhancedGameLobby';

/**
 * GameModeConnector - Connects game mode selection with the game lobby
 * This handles the transition from mode/price selection to the actual game lobby
 */
const GameModeConnector = () => {
  const { gameId, modeType } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Game lobby states
  const [entryFee, setEntryFee] = useState(10);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showPriceSelection, setShowPriceSelection] = useState(true);
  const [showLobby, setShowLobby] = useState(false);
  const [playAgainMode, setPlayAgainMode] = useState(false);

  // Check for price parameter in URL when component loads
  useEffect(() => {
    const priceParam = searchParams.get('price');
    const playAgain = searchParams.get('playAgain');
    const matchesParam = searchParams.get('matches');
    
    if (priceParam) {
      const parsedPrice = parseInt(priceParam);
      if (!isNaN(parsedPrice)) {
        // If price is provided in URL, skip price selection screen
        setEntryFee(parsedPrice);
        setSelectedPrice(parsedPrice);
        setShowPriceSelection(false);
        setShowLobby(true);
        
        // Check if we're in play again mode - use '1' instead of 'true' in URL
        if (playAgain === '1') {
          setPlayAgainMode(true);
        }
      }
    }
  }, [searchParams]);
  
  // Price options based on mode type
  const getPriceOptions = () => {
    switch(modeType?.toLowerCase()) {
      case 'classic':
        return [5, 10, 25, 50];
      case 'quick':
        return [2, 5, 10, 25];
      case 'tournament':
        // Higher entry fees for tournaments
        return [50, 100, 200, 500];
      case 'private':
        return [10, 20, 50, 100];
      default:
        return [5, 10, 25, 50];
    }
  };

  // Handle price selection and show the game lobby
  const handlePriceSelection = (price) => {
    setEntryFee(price);
    setSelectedPrice(price);
    setShowPriceSelection(false);
    setShowLobby(true);
  };

  // Handle exit from game lobby
  const handleExit = () => {
    navigate(`/games/${gameId}`);
  };

  // Handle play again option
  const handlePlayAgain = () => {
    // Use '1' instead of 'true' to avoid React JSX boolean attribute warnings
    const currentUrl = `/games/${gameId}/play/${modeType}?price=${selectedPrice}&playAgain=1`;
    navigate(currentUrl);
    // This will trigger a component reload with the same price, but in playAgain mode
  };

  // Get formatted mode name
  const getFormattedModeName = () => {
    if (!modeType) return 'Classic';
    return modeType.charAt(0).toUpperCase() + modeType.slice(1).toLowerCase();
  };

  return (
    <div className="h-screen w-screen">
      {showPriceSelection && (
        <div className="fixed inset-0 flex items-center justify-center">
          {/* Background overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={`/${gameId?.toLowerCase()}.jpg`}
              alt={gameId}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/60" />
          </div>
          
          {/* Price selection content */}
          <div className="z-10 w-full max-w-md p-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-medium text-white mb-2 text-center">{getFormattedModeName()} Mode</h2>
              <p className="text-white/70 text-center mb-8">Select your entry fee</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {getPriceOptions().map((price) => (
                  <button
                    key={price}
                    onClick={() => handlePriceSelection(price)}
                    className="bg-white/10 border-2 border-white/20 hover:border-purple-500 rounded-xl p-4 flex flex-col items-center justify-center transition-all h-24 hover:bg-white/20"
                  >
                    <span className="text-xl font-bold text-white mb-1">₹{price}</span>
                    <span className="text-xs text-white/70">Win ₹{price * 1.8}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => navigate(`/games/${gameId}`)}
                className="w-full py-3 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition font-medium"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {showLobby && (
        <EnhancedGameLobby 
          entryFee={selectedPrice}
          gameMode={getFormattedModeName()}
          onPlayAgain={handlePlayAgain}
          onExit={handleExit}
          gameId={gameId}
          // Convert string 'matching' or 'waiting' to actual string values, not boolean
          initialStatus={playAgainMode ? 'matching' : 'waiting'}
          // Convert string from URL to actual number for tournament matches
          tournamentMatches={parseInt(searchParams.get('matches')) || 5}
        />
      )}
    </div>
  );
};

export default GameModeConnector; 