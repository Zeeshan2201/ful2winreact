import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Trophy, Users, Zap } from 'lucide-react';

const Flappyball = () => {
  const navigate = useNavigate();

  const gameModes = [
    {
      id: 'classic',
      title: 'Classic Mode',
      description: 'Traditional FlappyBall gameplay',
      icon: Play,
      color: 'from-blue-500 to-blue-600',
      path: '/games/flappyball/classic'
    },
    {
      id: 'tournament',
      title: 'Tournament',
      description: 'Compete in organized tournaments',
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      path: '/games/flappyball/tournament'
    },
    {
      id: 'quick',
      title: 'Quick Match',
      description: 'Jump into a quick game',
      icon: Zap,
      color: 'from-green-500 to-green-600',
      path: '/games/flappyball/quick'
    },
    {
      id: 'private',
      title: 'Private Room',
      description: 'Play with friends',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      path: '/games/flappyball/private'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-white">FlappyBall</h1>
          <div className="w-16"></div>
        </div>

        {/* Game Preview */}
        <div className="bg-gradient-to-br from-blue-600 to-sky-400 rounded-2xl p-8 mb-8 text-center">
          <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-4 animate-bounce shadow-lg"></div>
          <h2 className="text-2xl font-bold text-white mb-2">FlappyBall</h2>
          <p className="text-white/90 max-w-md mx-auto">
            Navigate through pipes and achieve the highest score in this challenging arcade game!
          </p>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameModes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={() => navigate(mode.path)}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group border border-white/10"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{mode.title}</h3>
                <p className="text-white/70">{mode.description}</p>
              </div>
            );
          })}
        </div>

        {/* Game Stats */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Game Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">0</div>
              <div className="text-white/70 text-sm">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-white/70 text-sm">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">0</div>
              <div className="text-white/70 text-sm">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">0%</div>
              <div className="text-white/70 text-sm">Win Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flappyball;
