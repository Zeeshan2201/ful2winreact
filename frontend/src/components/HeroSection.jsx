import { useEffect, useState } from 'react';
import { Trophy, Users, Clock, Gift, Shield, Zap, Headphones, Play, ChevronLeft, ChevronRight, TrendingUp, Star, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const gameSlides = [
  {
    name: 'Ludo Championship',
    image: '/images/ludo.jpg',
    subtitle: 'Roll the dice and win big',
    path: '/games/ludo'
  },
  {
    name: 'Chess Masters',
    image: '/images/chess.jpg',
    subtitle: 'Outsmart your opponent',
    path: '/games/chess'
  },
  {
    name: 'Carrom Clash',
    image: '/images/carrom.jpg',
    subtitle: 'Strike and pocket to victory',
    path: '/games/carrom'
  },
  {
    name: 'PUBG Showdown',
    image: '/images/pubg.jpg',
    subtitle: 'Battle for survival',
    path: '/games/bgmi'
  },
  {
    name: 'Free Fire Frenzy',
    image: '/images/freefire.jpg',
    subtitle: 'Fast-paced action',
    path: '/games/freefire'
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [stats, setStats] = useState({
    totalWinnings: 0,
    activePlayers: 0,
    dailyWinners: 0,
    jackpotAmount: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % gameSlides.length);
    }, 4000);

    // Animate stats counting up
    const finalStats = {
      totalWinnings: 25000000,
      activePlayers: 50000,
      dailyWinners: 1200,
      jackpotAmount: 1000000
    };

    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const statsInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        totalWinnings: Math.floor(finalStats.totalWinnings * progress),
        activePlayers: Math.floor(finalStats.activePlayers * progress),
        dailyWinners: Math.floor(finalStats.dailyWinners * progress),
        jackpotAmount: Math.floor(finalStats.jackpotAmount * progress)
      });

      if (currentStep === steps) clearInterval(statsInterval);
    }, stepDuration);

    return () => {
      clearInterval(interval);
      clearInterval(statsInterval);
    };
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return `₹${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  };

  const goTo = (idx) => setCurrent((idx + gameSlides.length) % gameSlides.length);

  const slide = gameSlides[current];

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-center overflow-hidden pt-24">
      {/* Background Image */}
      <img
        src={slide.image}
        alt={slide.name}
        className="absolute top-0 left-0 w-full h-[96vh] object-cover object-center z-10"
        style={{ opacity: 0.9 }}
        draggable={false}
      />
      
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-[96vh] z-20 backdrop-blur-md" 
        style={{ background: 'linear-gradient(135deg, rgba(24,24,40,0.6) 0%, rgba(35,35,77,0.65) 60%, rgba(16,16,26,0.7) 100%)' }} 
      />

      {/* Main Content */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center gap-8 px-4">
        {/* Game Carousel */}
        <div className="relative flex flex-col items-center justify-center min-h-[350px] w-full max-w-lg mx-auto">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 shadow-lg backdrop-blur-md transition-all duration-200"
            onClick={() => goTo(current - 1)}
            aria-label="Previous Game"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 shadow-lg backdrop-blur-md transition-all duration-200"
            onClick={() => goTo(current + 1)}
            aria-label="Next Game"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 tracking-tight text-white drop-shadow-lg animate-fade-in-up">
              {slide.name}
            </h1>
            <p className="text-lg md:text-xl text-center text-white/80 mb-6 animate-fade-in-up delay-100">
              {slide.subtitle}
            </p>
            <button 
              className="px-10 py-4 rounded-2xl font-extrabold text-lg md:text-2xl flex items-center gap-3 bg-white/90 text-purple-600 shadow-xl hover:scale-105 transition-all duration-200 animate-pulse-glow"
              onClick={() => navigate(slide.path)}
            >
              <Play className="h-6 w-6" />
              Play Now
            </button>
          </div>
        </div>

        {/* Winning Stats */}
        <div className="relative z-20 w-full max-w-4xl mx-auto mt-8 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Winnings */}
            <div className="glass-effect rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                  <Coins className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-sm font-medium text-white/80">Total Winnings</h3>
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                {formatNumber(stats.totalWinnings)}
              </p>
            </div>

            {/* Active Players */}
            <div className="glass-effect rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-white/80">Active Players</h3>
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                {formatNumber(stats.activePlayers)}
              </p>
            </div>

            {/* Daily Winners */}
            <div className="glass-effect rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 group-hover:from-pink-500/30 group-hover:to-rose-500/30 transition-all duration-300">
                  <Trophy className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-sm font-medium text-white/80">Daily Winners</h3>
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors duration-300">
                {formatNumber(stats.dailyWinners)}
              </p>
            </div>

            {/* Current Jackpot */}
            <div className="glass-effect rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all duration-300">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-sm font-medium text-white/80">Current Jackpot</h3>
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 animate-pulse">
                {formatNumber(stats.jackpotAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(162, 89, 255, 0.5); }
          50% { box-shadow: 0 0 30px rgba(162, 89, 255, 0.8); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </section>
  );
}