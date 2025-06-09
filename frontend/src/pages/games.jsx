import React from 'react';
import GameCatalog from '../components/GameCatalog';
import BottomNav from '../components/BottomNav';

const Games = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 overflow-hidden">
      <main className="pt-4 pb-20">
        <GameCatalog />
      </main>
      
      <BottomNav />
    </div>
  );
}

export default Games;
