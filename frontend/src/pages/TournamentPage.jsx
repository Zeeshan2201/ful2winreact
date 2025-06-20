import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Users, Coins, Star, ChevronRight, X, Crown, Medal, Award } from 'lucide-react';
import { tournamentApi } from '../utils/tournamentApi';
import HostedFlappyBallGame from '../games/Flappyball/HostedFlappyBallGame';

const TournamentPage = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTournaments();
    if (activeTab !== 'registered') {
      fetchUserRegistrations();
    }
  }, [activeTab]);const fetchTournaments = async () => {
    try {
      let data;
      if (activeTab === 'registered') {
        // For registered tab, get all user tournaments regardless of date
        data = await tournamentApi.getUserTournaments();
      } else {
        // For other tabs, get tournaments filtered by status
        data = await tournamentApi.getAllTournaments(activeTab);
      }
      setTournaments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const userTournaments = await tournamentApi.getUserTournaments();
      const registeredIds = userTournaments.map(t => t._id);
      setUserRegistrations(registeredIds);
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    }
  };
  const handleRegister = async (tournamentId) => {
    try {
      await tournamentApi.registerForTournament(tournamentId);
      setUserRegistrations([...userRegistrations, tournamentId]);
      
      // Update current players count
      setTournaments(tournaments.map(t => 
        t._id === tournamentId 
          ? { ...t, currentPlayers: t.currentPlayers + 1 }
          : t
      ));
    } catch (error) {
      console.error('Error registering for tournament:', error);
      alert(error.message);
    }
  };  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handlePlayTournament = (tournamentId) => {
    const tournament = tournaments.find(t => t._id === tournamentId);
    setSelectedTournamentId(tournamentId);
    setSelectedTournament(tournament);
    setGameModalOpen(true);
    
    // Fetch leaderboard for this tournament
    fetchLeaderboard(tournamentId);
  };

  const fetchLeaderboard = async (tournamentId) => {
    try {
      const data = await tournamentApi.getLeaderboard(tournamentId);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleScoreUpdate = (newScore) => {
    // Refresh leaderboard when score is updated
    if (selectedTournamentId) {
      fetchLeaderboard(selectedTournamentId);
    }
  };
  const calculatePrize = (tournament, position) => {
    const totalPrize = tournament.currentPlayers * tournament.entryFee;
    const percentage = tournament.prizeDistribution[position];
    return Math.floor((totalPrize * percentage) / 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };  const filteredTournaments = tournaments.filter(t => {
    if (activeTab === 'registered') {
      return true; // Show all registered tournaments
    }
    return t.status === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-24">
      {/* Header */}
      <div className="pt-16 sm:pt-20 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
              FlappyBall <span className="text-yellow-400">Tournaments</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Compete with players worldwide in exciting FlappyBall tournaments. Win prizes and climb the leaderboard!
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mb-6 sm:mb-8">
        <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-lg p-1 overflow-x-auto">
          {['upcoming', 'ongoing', 'completed', 'registered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[80px] py-2 px-2 sm:px-4 rounded-md font-medium text-sm sm:text-base transition-all ${
                activeTab === tab
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament._id}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300"
            >
              {/* Tournament Header */}
              <div className="p-3 sm:p-4 lg:p-6 border-b border-white/20">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(tournament.status)}`}>
                    {tournament.status.toUpperCase()}
                  </div>
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">{tournament.name}</h3>
                <div className="flex items-center text-gray-300 text-xs sm:text-sm space-x-3 sm:space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="truncate">
                      {new Date(tournament.startTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="whitespace-nowrap">
                      {tournament.currentPlayers}/{tournament.maxPlayers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tournament Details */}
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Entry Fee */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm sm:text-base">Entry Fee</span>
                    <div className="flex items-center text-yellow-400 font-bold">
                      <Coins className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-sm sm:text-base">₹{tournament.entryFee}</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm sm:text-base">Duration</span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {Math.round((new Date(tournament.endTime) - new Date(tournament.startTime)) / (1000 * 60 * 60))} hours
                    </span>
                  </div>

                  {/* Prize Distribution */}
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <h4 className="text-white font-medium mb-2 text-sm sm:text-base">Prize Distribution</h4>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">1st Place:</span>
                        <span className="text-yellow-400 font-bold">
                          ₹{Math.floor((100 * tournament.entryFee * tournament.prizeDistribution.first) / 100)} (upto)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">2nd Place:</span>
                        <span className="text-silver-400 font-bold">
                          ₹{Math.floor((100 * tournament.entryFee * tournament.prizeDistribution.second) / 100)} (upto)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">3rd Place:</span>
                        <span className="text-bronze-400 font-bold">
                          ₹{Math.floor((100 * tournament.entryFee * tournament.prizeDistribution.third) / 100)} (upto)
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      *Prize amounts may vary based on total entries
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {userRegistrations.includes(tournament._id) ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center text-green-400 text-sm font-medium">
                          <Star className="w-4 h-4 mr-1" />
                          Registered
                        </div>
                        {tournament.status === 'ongoing' && (
                          <button
                            onClick={() => handlePlayTournament(tournament._id)}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center text-sm sm:text-base"
                          >
                            Play Now
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegister(tournament._id)}
                        disabled={tournament.currentPlayers >= tournament.maxPlayers}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                          tournament.currentPlayers >= tournament.maxPlayers
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                        }`}
                      >
                        {tournament.currentPlayers >= tournament.maxPlayers ? 'Full' : 'Register Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No tournaments found</h3>
            <p className="text-gray-400 px-4">
              {activeTab === 'registered' 
                ? "You haven't registered for any tournaments yet."
                : `No ${activeTab} tournaments at the moment.`
              }
            </p>
          </div>
        )}
      </div>      {/* Game Modal */}
      {gameModalOpen && selectedTournamentId && selectedTournament && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-0 sm:p-2 lg:p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-none sm:rounded-xl border-none sm:border sm:border-white/20 w-full h-full sm:max-w-7xl sm:max-h-[95vh] sm:h-auto overflow-hidden flex flex-col lg:flex-row">
            
            {/* Game Section */}
            <div className="flex-1 flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/20 bg-black/20">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{selectedTournament.name}</h2>
                  <p className="text-sm text-gray-300">Tournament Game</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="lg:hidden text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  >
                    <Trophy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setGameModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
                {/* Game Content */}
              <div className="flex-1 p-0 sm:p-2 lg:p-4 overflow-auto">
                <div className="w-full h-full min-h-[calc(100vh-120px)] sm:min-h-[500px] lg:min-h-[600px]">
                  <HostedFlappyBallGame 
                    tournamentId={selectedTournamentId}
                    tournament={selectedTournament}
                    isModal={true}
                    onClose={() => setGameModalOpen(false)}
                    onScoreUpdate={handleScoreUpdate}
                  />
                </div>
              </div>
            </div>            {/* Leaderboard Section - Desktop: Always visible, Mobile: Toggle */}
            {(showLeaderboard || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
              <div className={`${showLeaderboard ? 'absolute inset-0 lg:relative lg:inset-auto' : ''} w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-white/20 bg-black/20 lg:bg-black/20 flex flex-col z-50 lg:z-auto`}>
                {/* Leaderboard Header */}
                <div className="p-4 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-lg font-bold text-white">Leaderboard</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchLeaderboard(selectedTournamentId)}
                        className="text-xs text-white/60 hover:text-white/80 transition-colors"
                      >
                        Refresh
                      </button>
                      {/* Close button for mobile */}
                      <button
                        onClick={() => setShowLeaderboard(false)}
                        className="lg:hidden text-white/60 hover:text-white/80 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Leaderboard Content */}
                <div className="flex-1 p-4 overflow-auto">
                  {leaderboard.length > 0 ? (
                    <div className="space-y-2">
                      {leaderboard.map((player, index) => (
                        <div
                          key={player._id || index}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                            index === 2 ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border border-orange-600/30' :
                            'bg-white/5 hover:bg-white/10'
                          } transition-all`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                              {index === 0 && <Crown className="w-4 h-4 text-yellow-400" />}
                              {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                              {index === 2 && <Award className="w-4 h-4 text-orange-600" />}
                              {index > 2 && <span className="text-sm font-bold text-white">{index + 1}</span>}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {player.username || player.playerId || 'Anonymous'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(player.submittedAt || Date.now()).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{player.score}</p>
                            {index < 3 && (
                              <p className="text-xs text-yellow-400">
                                ₹{Math.floor((selectedTournament.entryFee * 100 * 
                                  (index === 0 ? selectedTournament.prizeDistribution.first :
                                   index === 1 ? selectedTournament.prizeDistribution.second :
                                   selectedTournament.prizeDistribution.third)) / 100)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-white/60 text-sm">No scores yet</p>
                      <p className="text-white/40 text-xs">Be the first to play!</p>
                    </div>
                  )}
                </div>

                {/* Tournament Info */}
                <div className="p-4 border-t border-white/20 bg-black/10">
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Players:</span>
                      <span className="text-white">{selectedTournament.currentPlayers}/{selectedTournament.maxPlayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entry Fee:</span>
                      <span className="text-yellow-400">₹{selectedTournament.entryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        selectedTournament.status === 'ongoing' ? 'text-green-400' :
                        selectedTournament.status === 'upcoming' ? 'text-blue-400' :
                        'text-gray-400'
                      }`}>
                        {selectedTournament.status.charAt(0).toUpperCase() + selectedTournament.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentPage;
