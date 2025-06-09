import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import GameResultLobby from './GameResultLobby';
import EnhancedGameLobby from './EnhancedGameLobby';

// Import game components
import TictactoeGameLogic from '../games/Tictactoe/TictactoeGameLogic';
import StoneGameLogic from '../games/Stone-Paper/StoneGameLogic';
import CoinflipGameLogic from '../games/Coinflip/CoinflipGameLogic';
import DiceGameLogic from '../games/Dice/DiceGameLogic';
import MemoryMatchGameLogic from '../games/Memory/MemoryMatchGameLogic';

// Game mode layouts
import TictactoeLayout from './game-modes-tictactoe/GameModeLayout';
import StonePaperLayout from './game-modes-stonepaper/GameModeLayout';
import CoinflipLayout from './game-modes-coinflip/GameModeLayout';
import DiceLayout from './game-modes-dice/GameModeLayout';
import MemoryMatchLayout from './game-modes-memorymatch/MemoryMatchLayout';

/**
 * GameConnector - Handles the connection to different games and manages game flow
 * This component loads the appropriate game based on URL parameters and handles game completion
 */
const GameConnector = () => {
  const { gameId, modeType } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addMoney } = useWallet();
  
  // Game state
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [gameInfo, setGameInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get price from URL params
  const price = searchParams.get('price') ? parseInt(searchParams.get('price')) : 0;
  
  // Load game info from localStorage on mount
  useEffect(() => {
    try {
      const storedGameInfo = localStorage.getItem('currentGameInfo');
      if (storedGameInfo) {
        setGameInfo(JSON.parse(storedGameInfo));
      } else {
        // Set default game info if none found in storage
        const defaultInfo = {
          entryFee: price,
          winAmount: Math.round(price * 1.8),
          gameType: getGameName(),
          mode: getFormattedModeType()
        };
        setGameInfo(defaultInfo);
        localStorage.setItem('currentGameInfo', JSON.stringify(defaultInfo));
      }
    } catch (error) {
      console.error("Error loading game info:", error);
      setError("Failed to load game settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [gameId, modeType, price]);
  
  // Handle game completion
  const handleGameEnd = (result) => {
    setGameResult(result);
    setGameEnded(true);
    
    try {
      // Add winnings to wallet if player won
      if (result.winner === 'player' && gameInfo) {
        addMoney(gameInfo.winAmount, `${gameInfo.gameType} ${modeType} Mode Winnings`);
      }
    } catch (error) {
      console.error("Error processing game results:", error);
      setError("There was a problem processing your winnings. Please contact support.");
    }
  };
  
  // Handle play again button
  const handlePlayAgain = () => {
    // Reset game state
    setGameEnded(false);
    setGameResult(null);
    setError(null);
    
    // Reload the game by refreshing the page
    window.location.reload();
  };
  
  // Handle exit button
  const handleExit = () => {
    // Navigate back to game lobby
    navigate(`/games/${gameId}`);
  };
  
  // Get formatted game name
  const getGameName = () => {
    switch (gameId) {
      case 'tictactoe':
        return 'Tic-Tac-Toe';
      case 'stonepaper':
        return 'Stone Paper Scissors';
      case 'coinflip':
        return 'Coinflip';
      case 'dice':
        return 'Dice';
      case 'memorymatch':
        return 'Memory Match';
      case 'DuckHuntGame':
        return 'DuckHuntGame';
      default:
        return gameId ? gameId.charAt(0).toUpperCase() + gameId.slice(1) : 'Game';
    }
  };
  
  // Format mode type for display
  const getFormattedModeType = () => {
    return modeType ? modeType.charAt(0).toUpperCase() + modeType.slice(1) : 'Classic';
  };
  
  // Show error state if there's an error
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="bg-red-900/20 backdrop-blur-md p-8 rounded-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handlePlayAgain} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Try Again
            </button>
            <button 
              onClick={handleExit} 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show loading state if still loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading game...</p>
        </div>
      </div>
    );
  }
  
  // If game has ended, show result lobby
  if (gameEnded && gameResult && gameInfo) {
    return (
      <GameResultLobby
        gameType={getGameName()}
        gameMode={getFormattedModeType()}
        winner={gameResult.winner}
        score={gameResult.score}
        winAmount={gameInfo.winAmount}
        entryFee={gameInfo.entryFee}
        gameDetails={gameResult.lastDice ? {
          'Last Roll': `You: ${gameResult.lastDice.player}, Opponent: ${gameResult.lastDice.opponent}`
        } : {}}
        onPlayAgain={handlePlayAgain}
        onExit={handleExit}
      />
    );
  }
  
  // Use EnhancedGameLobby instead of directly rendering the game
  return (
    <EnhancedGameLobby 
      gameId={gameId}
      gameImg={gameId}
      gameMode={getFormattedModeType()}
      entryFee={price}
      onExit={handleExit}
      initialStatus="waiting"
    />
  );
};

export default GameConnector; 