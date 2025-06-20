import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Users, Clock, Target, ArrowLeft, Crown } from 'lucide-react';
import { tournamentApi } from '../utils/tournamentApi';

const TournamentPlayPage = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournamentDetails();
    fetchLeaderboard();
    
    // Timer for tournament end
    const timer = setInterval(() => {
      if (tournament) {
        const now = new Date().getTime();
        const endTime = new Date(tournament.endTime).getTime();
        const difference = endTime - now;
        
        if (difference > 0) {
          setTimeLeft(difference);
        } else {
          setTimeLeft(0);
          setGameActive(false);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tournamentId, tournament]);
  const fetchTournamentDetails = async () => {
    try {
      const data = await tournamentApi.getTournament(tournamentId);
      setTournament(data);
      setGameActive(data.status === 'ongoing');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const data = await tournamentApi.getLeaderboard(tournamentId);
      setLeaderboard(data);
        // Set user's current score
      const currentUserId = JSON.parse(localStorage.getItem('user'))?._id || localStorage.getItem('userId');
      const userEntry = data.find(p => p.userId._id === currentUserId);
      if (userEntry) {
        setUserScore(userEntry.score);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayGame = () => {
    // Navigate to the actual FlappyBall game with tournament mode
    navigate(`/games/flappyball?tournament=${tournamentId}`);
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-white';
    }
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <Crown className={`w-5 h-5 ${getRankColor(rank)}`} />;
    }
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Tournament Not Found</h2>
          <button
            onClick={() => navigate('/tournaments')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/tournaments')}
            className="flex items-center text-white hover:text-purple-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tournaments
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {tournament.name}
            </h1>
            
            {/* Tournament Status */}
            <div className="flex items-center justify-center space-x-8 text-white">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>{tournament.currentPlayers} Players</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{timeLeft ? formatTime(timeLeft) : 'Tournament Ended'}</span>
              </div>
              <div className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                <span>Your Best: {userScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">FlappyBall Tournament</h2>
                
                {gameActive ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8">
                      <img 
                        src="/flappyball.svg" 
                        alt="FlappyBall" 
                        className="w-24 h-24 mx-auto mb-4"
                      />
                      <h3 className="text-xl font-bold text-white mb-2">Ready to Play?</h3>
                      <p className="text-purple-100 mb-4">
                        Beat your high score and climb the leaderboard!
                        You can play unlimited times during the tournament.
                      </p>
                      <button
                        onClick={handlePlayGame}
                        className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-100 transition-colors"
                      >
                        Play FlappyBall
                      </button>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Tournament Rules</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Play as many times as you want during the tournament</li>
                        <li>• Only your highest score counts</li>
                        <li>• Tournament ends when the timer reaches zero</li>
                        <li>• Winners are determined by final leaderboard positions</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Tournament Ended</h3>
                    <p className="text-gray-400">Check the final leaderboard for results!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Live Leaderboard
              </h2>                <div className="space-y-3 max-h-96 overflow-y-auto">
                {leaderboard.map((player, index) => {
                  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id || localStorage.getItem('userId');
                  const isCurrentUser = player.userId?._id === currentUserId;
                  return (
                    <div
                      key={player.userId?._id || player.userId}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isCurrentUser
                          ? 'bg-purple-600/50 border border-purple-400' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getRankIcon(player.rank || index + 1)}
                      </div>
                      
                      <div className="flex-shrink-0">                        <img
                          src={player.userId?.avatar || `https://ui-avatars.com/api/?name=${player.userId?.username || player.username || 'Player'}&background=6366f1&color=fff`}
                          alt={player.userId?.username || player.username}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${player.userId?.username || player.username || 'Player'}&background=6366f1&color=fff`;
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          isCurrentUser ? 'text-white' : 'text-gray-300'
                        }`}>
                          {player.userId?.username || player.username}
                          {isCurrentUser && <span className="text-purple-300 ml-1">(You)</span>}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <span className={`font-bold ${getRankColor(player.rank || index + 1)}`}>
                          {player.score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="text-center text-sm text-gray-400">
                  Leaderboard updates in real-time
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentPlayPage;
