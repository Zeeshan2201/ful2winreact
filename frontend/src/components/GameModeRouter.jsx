import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GameModeConnector from './GameModeConnector';

/**
 * GameModeRouter - Handles routing for game modes across all games
 * Routes to either mode selection screens or directly to the game lobby with the selected mode
 */
const GameModeRouter = ({ onBack, gameType = "tictactoe" }) => {
  const [loadErrors, setLoadErrors] = useState({});

  // Generic error fallback component
  const ErrorFallback = ({ componentName, gameTypeName }) => (
    <div className="bg-red-900/20 backdrop-blur-md rounded-xl p-6 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Component Not Available</h2>
      <p className="text-white/80 mb-6">
        {`The ${componentName} for ${gameTypeName} is not yet available or couldn't be loaded.`}
      </p>
      <button
        onClick={onBack}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  );

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white text-lg">Loading mode...</p>
    </div>
  );

  // Dynamic imports based on game type
  const getComponent = (mode) => {
    // Create a unique key for this game type and mode
    const componentKey = `${gameType}-${mode}`;
    
    // Try to import the component dynamically
    try {
      // If we've already tried and failed to load this component before, don't try again
      if (loadErrors[componentKey]) {
        return <ErrorFallback componentName={mode} gameTypeName={gameType} />;
      }

      // Import from the game-specific folder with proper extension
      const Component = lazy(() => 
        import(`./game-modes-${gameType}/${mode}.jsx`)
          .catch(error => {
            console.error(`Failed to load ${mode} for ${gameType}:`, error);
            // Record this error so we don't try to load it again
            setLoadErrors(prev => ({ ...prev, [componentKey]: true }));
            // Throw error to be caught by error boundary
            throw error;
          })
      );
      
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Component onBack={onBack} gameId={gameType} />
        </Suspense>
      );
    } catch (error) {
      console.error(`Failed to load ${mode} for ${gameType}:`, error);
      // Record this error so we don't try to load it again
      setLoadErrors(prev => ({ ...prev, [componentKey]: true }));
      return <ErrorFallback componentName={mode} gameTypeName={gameType} />;
    }
  };

  return (
    <Routes>
      {/* Mode selection screens */}
      <Route path="/" element={<Navigate to="select/classic" />} />
      <Route path="select/classic" element={getComponent('ClassicMode')} />
      <Route path="select/tournament" element={getComponent('TournamentMode')} />
      <Route path="select/private" element={getComponent('PrivateMode')} />
      <Route path="select/quick" element={getComponent('QuickMode')} />
      
      {/* Game lobby routes with the selected mode and price */}
      <Route path="play/:modeType" element={<GameModeConnector />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="select/classic" />} />
    </Routes>
  );
};

export default GameModeRouter; 