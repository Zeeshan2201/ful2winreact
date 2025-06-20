import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Trophy, RotateCcw, ExternalLink, RefreshCw } from 'lucide-react';

const FlappyBallGame = ({ 
  tournamentId: propTournamentId, 
  tournament, 
  isModal = false, 
  onClose,
  onScoreUpdate 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef(null);
  const [gameState, setGameState] = useState('loading'); // loading, ready, playing, gameOver
  const [currentScore, setCurrentScore] = useState(0);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [lastSubmittedScore, setLastSubmittedScore] = useState(null);
  const [gameUrl, setGameUrl] = useState('');
  
  // Tournament mode detection - prioritize prop over URL
  const searchParams = new URLSearchParams(location.search);
  const urlTournamentId = searchParams.get('tournament');
  const tournamentId = propTournamentId || urlTournamentId;
  const isTournamentMode = !!tournamentId;

  // Get user info from localStorage
  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;
    
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
    
    return { token, user };
  };
  // Build game URL with tournament parameters
  useEffect(() => {
    const { token, user } = getUserInfo();
    
    if (isTournamentMode && tournamentId && user) {
      // Detect environment and use appropriate API URL
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalhost ? 'http://localhost:5000/api' : 'https://ful2winreact.onrender.com/api';
      
      const params = new URLSearchParams({
        tournament_id: tournamentId,
        player_id: user._id || user.id,
        player_name: user.username || 'Unknown Player',
        api_url: apiUrl,
        auth_token: token
      });
      
      setGameUrl(`https://flappyballgame.boostnow.in/?${params.toString()}`);
    } else {
      setGameUrl('https://flappyballgame.boostnow.in/');
    }
    
    setGameState('ready');
  }, [tournamentId, isTournamentMode]);

  // Listen for messages from the hosted game
  useEffect(() => {
    const handleMessage = async (event) => {
      // Only accept messages from the game domain
      if (!event.origin.includes('boostnow.in')) return;
      
      const { type, data } = event.data;
      
      switch (type) {
        case 'TOURNAMENT_SCORE_SUBMITTED':
          console.log('Score submitted from hosted game:', data);
          setCurrentScore(data.score);
          setLastSubmittedScore(data.score);
          setIsSubmittingScore(false);
          
          // Notify parent component about score update
          if (onScoreUpdate) {
            onScoreUpdate(data.score);
          }
          break;
          
        case 'TOURNAMENT_SCORE_ERROR':
          console.error('Score submission error from hosted game:', data);
          setIsSubmittingScore(false);
          break;
          
        case 'GAME_STARTED':
          setGameState('playing');
          break;
          
        case 'GAME_OVER':
          setGameState('gameOver');
          setCurrentScore(data.score || 0);
          if (isTournamentMode) {
            setIsSubmittingScore(true);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onScoreUpdate, isTournamentMode]);

  const handleBackToTournament = () => {
    if (isModal && onClose) {
      onClose();
    } else if (isTournamentMode) {
      navigate(`/tournament/${tournamentId}/play`);
    } else {
      navigate(-1);
    }
  };

  const handleRefreshGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setGameState('loading');
      setTimeout(() => setGameState('ready'), 1000);
    }
  };

  const handleRestartGame = () => {
    if (iframeRef.current) {
      // Send message to hosted game to restart
      iframeRef.current.contentWindow.postMessage({
        type: 'RESTART_GAME'
      }, '*');
    }
  };

  if (gameState === 'loading') {
    return (
      <div className={`${isModal ? 'w-full h-full flex flex-col' : 'min-h-screen'} bg-gradient-to-br from-sky-400 to-blue-600 ${isModal ? '' : 'flex items-center justify-center'} ${isModal ? 'p-1 sm:p-2' : ''}`}>
        <div className={`bg-white/10 backdrop-blur-md ${isModal ? 'rounded-lg sm:rounded-2xl' : 'rounded-2xl'} ${isModal ? 'p-2 sm:p-3 lg:p-6' : 'p-6'} shadow-2xl w-full ${isModal ? 'h-full flex flex-col items-center justify-center' : 'max-w-5xl'}`}>
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Loading FlappyBall Game...</h2>
            <p className="text-white/70">Preparing your tournament experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isModal ? 'w-full h-full flex flex-col' : 'min-h-screen'} bg-gradient-to-br from-sky-400 to-blue-600 ${isModal ? '' : 'flex items-center justify-center'} ${isModal ? 'p-1 sm:p-2' : ''}`}>
      <div className={`bg-white/10 backdrop-blur-md ${isModal ? 'rounded-lg sm:rounded-2xl' : 'rounded-2xl'} ${isModal ? 'p-2 sm:p-3 lg:p-6' : 'p-6'} shadow-2xl w-full ${isModal ? 'h-full flex flex-col' : 'max-w-5xl'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between ${isModal ? 'mb-2 sm:mb-4' : 'mb-4'}`}>
          <button
            onClick={handleBackToTournament}
            className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white transition-colors text-xs sm:text-sm lg:text-base"
          >
            <ArrowLeft size={isModal ? 14 : 20} />
            <span className="hidden sm:inline">{isTournamentMode ? 'Back to Tournament' : 'Back'}</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="text-center">
            <h1 className={`${isModal ? 'text-base sm:text-lg lg:text-2xl' : 'text-2xl'} font-bold text-white`}>FlappyBall</h1>
            {isTournamentMode && tournament && (
              <div className="text-center">
                <div className="flex items-center gap-1 text-yellow-400 justify-center">
                  <Trophy size={isModal ? 10 : 16} />
                  <span className="text-xs sm:text-sm">Tournament Mode</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">{tournament.name}</p>
              </div>
            )}
          </div>
          
          <div className="text-right text-white">
            <div className={`${isModal ? 'text-sm sm:text-base lg:text-lg' : 'text-lg'} font-bold`}>
              Score: {currentScore}
            </div>
            {lastSubmittedScore && (
              <div className="text-xs sm:text-sm text-green-400">
                Last: {lastSubmittedScore}
              </div>
            )}
            {isTournamentMode && tournament && (
              <div className="text-xs text-yellow-400 mt-1">
                Prize: ₹{Math.floor((tournament.entryFee * 100 * tournament.prizeDistribution.first) / 100)}
              </div>
            )}
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleRefreshGame}
            className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
          
          <button
            onClick={handleRestartGame}
            className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
          >
            <RotateCcw size={12} />
            Restart
          </button>
          
          <a
            href={gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
          >
            <ExternalLink size={12} />
            Full Screen
          </a>
          
          {isSubmittingScore && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-blue-400 text-xs">
              <div className="animate-spin rounded-full h-3 w-3 border border-blue-400 border-t-transparent"></div>
              Submitting...
            </div>
          )}
        </div>

        {/* Game Iframe Container */}
        <div className={`${isModal ? 'flex-1' : ''} relative`}>
          <iframe
            ref={iframeRef}
            src={gameUrl}
            className={`w-full ${isModal ? 'h-full min-h-[400px] sm:min-h-[500px]' : 'h-[600px]'} border-2 border-white/20 rounded-lg`}
            title="FlappyBall Game"
            frameBorder="0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
          
          {/* Tournament Status Overlay */}
          {isTournamentMode && (
            <div className="absolute top-2 left-2 right-2 z-10">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>Tournament Active</span>
                  </div>
                  <div className="text-right">
                    {tournament && (
                      <div>
                        <div>Players: {tournament.currentPlayers}/{tournament.maxPlayers}</div>
                        <div>Prize Pool: ₹{tournament.entryFee * tournament.currentPlayers}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className={`${isModal ? 'mt-2 sm:mt-4' : 'mt-4'} text-center text-white/70 ${isModal ? 'text-xs sm:text-sm' : 'text-sm'}`}>
          <span className="hidden sm:inline">Click or press SPACE in the game to jump</span>
          <span className="sm:hidden">Tap in the game to jump</span>
          {isTournamentMode && (
            <span className="block mt-1 text-yellow-400">🏆 Scores automatically submit to tournament</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlappyBallGame;
