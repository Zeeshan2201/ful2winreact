import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  
  // Get game title with proper capitalization
  const getGameTitle = () => {
    if (!gameId) return 'Game';
    if (gameId.toLowerCase() === 'bgmi') return 'BGMI';
    if (gameId.toLowerCase() === 'tictactoe') return 'Tic-Tac-Toe';
    return gameId.charAt(0).toUpperCase() + gameId.slice(1);
  };
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={`/${gameId?.toLowerCase()}.jpg`}
          alt={`${getGameTitle()} Background`}
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            e.target.src = "/placeholder.svg" // Fallback image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/50 backdrop-blur-sm" />
      </div>
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate('/games')}
          className="text-white hover:text-blue-500 transition rounded-full p-2 bg-gray-800/50"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 max-w-md text-center">
        <div className="bg-indigo-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">{getGameTitle()} Coming Soon</h2>
        <p className="text-gray-300 mb-8">
          We're working hard to bring you an exciting {getGameTitle()} gaming experience. 
          Stay tuned for updates!
        </p>
        
        <div className="bg-white/10 rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Expected Release:</span>
            <span className="text-yellow-400 font-medium">Coming Soon</span>
          </div>
        </div>
        
        <button 
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:brightness-110 transition-all"
          onClick={() => navigate('/games')}
        >
          Back to Game Collection
        </button>
      </div>
    </div>
  );
};

export default ComingSoonPage; 