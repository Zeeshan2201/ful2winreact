import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Users, Clock, Coins, IndianRupee, Trophy, Zap, Star, Crown, Target, ArrowRight, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const games = [
  {
    id: 1,
    name: 'Chess',
    description: 'Challenge players worldwide in the ultimate game of strategy and skill. Win up to 5x your entry fee!',
    image: '/images/chess.jpg',
    players: '2',
    time: '10-30 min',
    color: 'from-blue-600 to-indigo-800',
    entryFee: { real: 50, practice: 100 },
    winnings: { real: 250, practice: 0 },
    features: ['5x Winnings', '24/7 Tournaments', 'Ranked Matches'],
    popularity: 98,
    activePlayers: 245,
    ongoingMatches: 18,
    topPrize: '₹5,000',
    icon: '♞',
    path: '/games/chess'
  },
  {
    id: 2,
    name: 'Ludo',
    description: 'Roll the dice and race your tokens to victory in this classic board game. Perfect for family fun!',
    image: '/images/ludo.jpg',
    players: '2-4',
    time: '15-45 min',
    color: 'from-purple-600 to-pink-700',
    entryFee: { real: 30, practice: 50 },
    winnings: { real: 150, practice: 0 },
    features: ['4x Winnings', 'Team Play', 'Daily Rewards'],
    popularity: 95,
    activePlayers: 189,
    ongoingMatches: 25,
    topPrize: '₹3,000',
    icon: '🎲',
    path: '/games/ludo'
  },
  {
    id: 3,
    name: 'Carrom',
    description: 'Test your precision and control in this popular tabletop game. Master the art of striking!',
    image: '/images/carrom.jpg',
    players: '2-4',
    time: '20-40 min',
    color: 'from-green-600 to-emerald-800',
    entryFee: { real: 40, practice: 75 },
    winnings: { real: 200, practice: 0 },
    features: ['5x Winnings', 'Tournaments', 'Practice Mode'],
    popularity: 92,
    activePlayers: 156,
    ongoingMatches: 12,
    topPrize: '₹4,000',
    icon: '/carromicon.png',
    path: '/games/carrom'
  },
  {
    id: 4,
    name: 'PUBG',
    description: 'Battle Royale action with intense combat and strategic gameplay. Squad up and dominate!',
    image: '/images/pubg.jpg',
    players: '1-4',
    time: '20-30 min',
    color: 'from-orange-600 to-red-800',
    entryFee: { real: 100, practice: 200 },
    winnings: { real: 1000, practice: 0 },
    features: ['10x Winnings', 'Squad Matches', 'Daily Tournaments'],
    popularity: 99,
    activePlayers: 432,
    ongoingMatches: 35,
    topPrize: '₹15,000',
    icon: '/pubgicon.png',
    path: '/games/bgmi'
  },
  {
    id: 5,
    name: 'Free Fire',
    description: 'Fast-paced battle royale with unique characters and abilities. Show your skills!',
    image: '/images/freefire.jpg',
    players: '1-4',
    time: '15-25 min',
    color: 'from-yellow-600 to-orange-700',
    entryFee: { real: 80, practice: 150 },
    winnings: { real: 800, practice: 0 },
    features: ['10x Winnings', 'Squad Play', 'Weekly Events'],
    popularity: 97,
    activePlayers: 389,
    ongoingMatches: 28,
    topPrize: '₹10,000',
    icon: '/freefireicon.png',
    path: '/games/freefire'
  },
];

export default function PopularGames() {
  const [activeTab, setActiveTab] = useState('real');
  const [hoveredGame, setHoveredGame] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    console.log("Component mounted, attempting to load video");
    const video = videoRef.current;
    
    if (video) {
      console.log("Video element found");
      
      // Add event listeners for debugging
      video.addEventListener('loadeddata', () => {
        console.log("Video data loaded");
      });

      video.addEventListener('error', (e) => {
        console.error("Video error:", e);
      });

      video.addEventListener('playing', () => {
        console.log("Video started playing");
      });

      // Try to play the video
      video.play()
        .then(() => {
          console.log("Video playback started successfully");
        })
        .catch((error) => {
          console.error("Video playback failed:", error);
        });
    } else {
      console.log("Video element not found");
    }
  }, []);

  return (
    <section className="relative py-12 px-4 overflow-hidden min-h-screen bg-gradient-to-b from-[#121b2f] to-[#1e0b43]">
      {/* Video Background */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{ pointerEvents: 'none' }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.7
          }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source 
            src="/bgvideo.mp4" 
            type="video/mp4"
            onError={(e) => console.error("Source error:", e)}
          />
        </video>
      </div>

      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-[#121b2f]/80 to-[#1e0b43]/80 z-[1]"
      />

      {/* Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.05] z-[2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Popular Games
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Choose from our selection of exciting multiplayer games and win real cash prizes
          </p>
        </div>

        {/* Game Type Tabs */}
        <div className="flex gap-3 mb-10 w-full">
  {[
    { id: 'real', label: 'Real Money Games', icon: Crown },
    { id: 'practice', label: 'Practice Games', icon: Target }
  ].map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex-1 min-w-0 px-3 py-2 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
        activeTab === tab.id
          ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg shadow-purple-800/30'
          : 'bg-white/10 text-white/80 hover:bg-white/15'
      }`}
    >
      <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="whitespace-nowrap">{tab.label}</span>
    </button>
  ))}
</div>

        {/* Games Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 bg-black/30 backdrop-blur-sm border border-white/5"
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              style={{
                transform: hoveredGame === game.id ? 'scale(1.01)' : 'scale(1)',
                boxShadow: hoveredGame === game.id 
                  ? '0 0 20px rgba(139, 92, 246, 0.2)'
                  : '0 0 10px rgba(139, 92, 246, 0.1)'
              }}
            >
              {/* Game Background */}
              <div className="absolute inset-0">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                  style={{
                    transform: hoveredGame === game.id ? 'scale(1.05)' : 'scale(1)',
                    filter: 'brightness(0.3)'
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${game.color} opacity-60 mix-blend-overlay`} />
              </div>

              {/* Game Content */}
              <div className="relative p-6">
                {/* Game Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/10"
                      style={{ transform: hoveredGame === game.id ? 'scale(1.05)' : 'scale(1)' }}
                    >
                      {game.icon.startsWith('/') ? (
                        <img src={game.icon} alt={game.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-2xl">{game.icon}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{game.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-blue-400" />
                          <span className="text-white/80">{game.players}</span>
                        </div>
                        <span className="text-white/40">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-blue-400" />
                          <span className="text-white/80">{game.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Popularity Badge */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center">
                    <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                    <span className="text-white text-xs font-bold">{game.popularity}%</span>
                  </div>
                </div>

                {/* Game Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Active Players', value: game.activePlayers, icon: Users },
                    { label: 'Ongoing', value: game.ongoingMatches, icon: Gamepad2 },
                    { label: 'Top Prize', value: game.topPrize, icon: Trophy }
                  ].map((stat, index) => (
                    <div 
                      key={index} 
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center transition-all duration-300 hover:bg-white/10"
                    >
                      {/* Icon Container */}
                      <div className="inline-flex items-center justify-center w-8 h-8 mb-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-700">
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>

                      {/* Value */}
                      <div className="text-lg font-bold text-white mb-0.5">
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/70">
                        {stat.label}
                      </div>
                    </div>
                  ))}
              </div>
              
                {/* Game Description */}
                <p className="text-white/80 text-sm mb-5 line-clamp-2">{game.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {game.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white"
                    >
                      <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Entry Fee & Winnings */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center bg-white/10 px-3 py-2 rounded-xl">
                    {activeTab === 'real' ? (
                      <>
                        <IndianRupee className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-white font-bold text-sm">Entry: {game.entryFee.real}</span>
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-white font-bold text-sm">Entry: {game.entryFee.practice}</span>
                      </>
                    )}
                  </div>
                  {activeTab === 'real' && (
                    <div className="flex items-center bg-green-900/20 px-3 py-2 rounded-xl">
                      <Trophy className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white font-bold text-sm">Win: {game.winnings.real}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold py-3 px-5 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => navigate(game.path)}
                  >
                    <span>
                    {activeTab === 'real' ? 'Play Now' : 'Practice'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button 
                    className="flex-1 bg-white/10 text-white font-bold py-3 px-5 rounded-xl hover:bg-white/15 transition-all duration-300 border border-white/10"
                  >
                    Rules
                  </button>
                </div>
              </div>

              {/* Hot Badge */}
              {game.popularity >= 95 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
                  <Flame className="h-3 w-3 mr-1" />
                  HOT
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 15s ease infinite;
        }
        
        @media (max-width: 480px) {
          .flex-wrap {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
} 