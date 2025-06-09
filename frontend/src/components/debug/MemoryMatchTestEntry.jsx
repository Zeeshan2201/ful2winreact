import React from 'react';
import EnhancedGameLobby from '../EnhancedGameLobby';
import { BrowserRouter } from 'react-router-dom';

/**
 * Test entry point component for debugging the Memory Match game flow
 */
const MemoryMatchTestEntry = () => {
  return (
    <BrowserRouter>
      <EnhancedGameLobby 
        gameId="memorymatch"
        entryFee={5}
        gameMode="Classic"
      />
    </BrowserRouter>
  );
};

export default MemoryMatchTestEntry; 