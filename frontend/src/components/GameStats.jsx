import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Users, Clock, Zap, Crown, Gamepad2, TrendingUp, IndianRupee, ChevronRight } from 'lucide-react';

const games = [
  {
    id: 1,
    name: 'Chess',
    activePlayers: 245,
    ongoingMatches: 18,
    topPrize: '₹5,000',
    color: 'from-blue-500 to-blue-700',
    icon: '♞',
  },
  {
    id: 2,
    name: 'Ludo',
    activePlayers: 189,
    ongoingMatches: 25,
    topPrize: '₹3,000',
    color: 'from-purple-500 to-purple-700',
    icon: '🎲',
  },
  {
    id: 3,
    name: 'Carrom',
    activePlayers: 156,
    ongoingMatches: 12,
    topPrize: '₹4,000',
    color: 'from-green-500 to-green-700',
    icon: '/carromicon.png',
  },
  {
    id: 4,
    name: 'Free Fire',
    activePlayers: 432,
    ongoingMatches: 35,
    topPrize: '₹10,000',
    color: 'from-yellow-500 to-orange-700',
    icon: '/freefireicon.png',
  },
  {
    id: 5,
    name: 'PUBG',
    activePlayers: 389,
    ongoingMatches: 28,
    topPrize: '₹15,000',
    color: 'from-red-500 to-red-700',
    icon: '/pubgicon.png',
  },
  {
    id: 6,
    name: 'Tic-Tac-Toe',
    activePlayers: 98,
    ongoingMatches: 15,
    topPrize: '₹2,000',
    color: 'from-pink-500 to-pink-700',
    icon: '⭕',
  },
];

const topPlayers = [
  {
    id: 1,
    name: 'Rahul K.',
    game: 'Chess',
    wins: 45,
    earnings: '₹25,000',
    streak: 8,
    avatar: '/images/avatars/player1.jpg',
  },
  {
    id: 2,
    name: 'Priya M.',
    game: 'Free Fire',
    wins: 38,
    earnings: '₹18,000',
    streak: 5,
    avatar: '/images/avatars/player2.jpg',
  },
  {
    id: 3,
    name: 'Amit S.',
    game: 'PUBG',
    wins: 42,
    earnings: '₹22,000',
    streak: 7,
    avatar: '/images/avatars/player3.jpg',
  },
];

const activeMatches = [
  {
    id: 1,
    game: 'Chess',
    players: ['Vikram K.', 'Rahul S.'],
    prize: '₹1,000',
    timeLeft: '15:00',
    status: 'Live',
  },
  {
    id: 2,
    game: 'Free Fire',
    players: ['Squad Alpha', 'Team Beta'],
    prize: '₹5,000',
    timeLeft: '20:00',
    status: 'Starting',
  },
  {
    id: 3,
    game: 'Ludo',
    players: ['Amit P.', 'Neha R.', 'Raj K.', 'Priya M.'],
    prize: '₹2,000',
    timeLeft: '08:00',
    status: 'Live',
  },
];

export default function GameStats() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activeMatches: 0,
    totalPrizePool: 0,
    dailyWinners: 0,
  });
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loadVideo = async () => {
      try {
        await video.load();
        await video.play();
        console.log("Video started playing");
      } catch (error) {
        console.error("Video error:", error);
      }
    };

    loadVideo();
  }, []);

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats({
        totalPlayers: Math.floor(Math.random() * 1000) + 1500,
        activeMatches: Math.floor(Math.random() * 50) + 100,
        totalPrizePool: Math.floor(Math.random() * 500000) + 1000000,
        dailyWinners: Math.floor(Math.random() * 100) + 200,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return `₹${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source 
            src="bgvideo3.mp4" 
            type="video/mp4"
          />
        </video>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              Live Game Stats
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Real-time statistics, active matches, and top players across all games
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Players', value: stats.totalPlayers, icon: Users, color: 'from-blue-500 to-blue-600' },
            { label: 'Active Matches', value: stats.activeMatches, icon: Gamepad2, color: 'from-purple-500 to-purple-600' },
            { label: 'Total Prize Pool', value: formatNumber(stats.totalPrizePool), icon: Trophy, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Daily Winners', value: stats.dailyWinners, icon: Crown, color: 'from-pink-500 to-pink-600' },
          ].map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'matches', label: 'Active Matches' },
            { id: 'leaderboard', label: 'Top Players' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Game Stats Grid */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                          {game.icon.startsWith('/') ? (
                            <img src={game.icon} alt={game.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <span className="text-2xl">{game.icon}</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white">{game.name}</h3>
                      </div>
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${game.color} text-white text-sm font-medium`}>
                        Live
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-white/60 text-sm mb-1">Active Players</div>
                        <div className="text-white font-bold">{game.activePlayers}</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-white/60 text-sm mb-1">Ongoing Matches</div>
                        <div className="text-white font-bold">{game.ongoingMatches}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white/60 text-sm">Top Prize</div>
                      <div className="text-white font-bold">{game.topPrize}</div>
                    </div>
                    <button className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                      Join Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Matches */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              {activeMatches.map((match) => (
                <div
                  key={match.id}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${
                          match.game === 'Chess' ? 'from-blue-500 to-blue-600' :
                          match.game === 'Free Fire' ? 'from-yellow-500 to-orange-600' :
                          'from-purple-500 to-purple-600'
                        } text-white text-sm font-medium mr-3`}>
                          {match.game}
                        </div>
                        <div className={`px-3 py-1 rounded-full ${
                          match.status === 'Live' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        } text-sm font-medium`}>
                          {match.status}
                        </div>
                      </div>
                      <div className="flex items-center text-white/60">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{match.timeLeft}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-white/60 text-sm mb-1">Players</div>
                        <div className="text-white">
                          {match.players.join(' vs ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-sm mb-1">Prize Pool</div>
                        <div className="text-white font-bold">{match.prize}</div>
                      </div>
                    </div>
                    <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      Join Match
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              {topPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white">{player.name}</h3>
                          <div className="flex items-center text-yellow-400">
                            <Crown className="h-5 w-5 mr-1" />
                            <span className="font-medium">{player.streak} Streak</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white/60">
                            <Gamepad2 className="h-4 w-4 mr-1" />
                            <span>{player.game}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-white/60">
                              <Trophy className="h-4 w-4 mr-1" />
                              <span>{player.wins} Wins</span>
                            </div>
                            <div className="flex items-center text-green-400">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              <span>{player.earnings}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .group:hover .absolute {
          transform: scale(1.02);
          transition: transform 0.3s ease;
        }
      `}</style>
    </section>
  );
} 