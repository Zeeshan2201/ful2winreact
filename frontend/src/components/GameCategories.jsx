import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Users, Clock, Zap, Crown, Target, Sparkles, ArrowRight, Flame, Star } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Battle Royale',
    description: 'Intense multiplayer combat games with massive prize pools',
    icon: <Target className="h-10 w-10" />,
    color: 'from-orange-500 via-pink-500 to-yellow-400',
    games: [
      { name: 'PUBG', hot: true, players: '1-4', time: '20-30 min', prize: '₹15,000' },
      { name: 'Free Fire', hot: true, players: '1-4', time: '15-25 min', prize: '₹10,000' },
    ],
    bgImage: '/images/pubg.jpg',
    stats: { activePlayers: 821, ongoingMatches: 63, totalPrize: '₹2,50,000' }
  },
  {
    id: 2,
    name: 'Strategy & Board',
    description: 'Test your tactical skills in classic board games',
    icon: <Crown className="h-10 w-10" />,
    color: 'from-purple-500 via-blue-500 to-pink-500',
    games: [
      { name: 'Chess', hot: true, players: '2', time: '10-30 min', prize: '₹5,000' },
      { name: 'Ludo', hot: false, players: '2-4', time: '15-45 min', prize: '₹3,000' },
      { name: 'Carrom', hot: false, players: '2-4', time: '20-40 min', prize: '₹4,000' },
    ],
    bgImage: '/images/chess.jpg',
    stats: { activePlayers: 590, ongoingMatches: 55, totalPrize: '₹1,20,000' }
  },
];

export default function GameCategories() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 50%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        if (this.opacity > 0.1) this.opacity -= 0.001;
        else this.reset();
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = Array.from({ length: 50 }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();
        particles.slice(i + 1).forEach(p2 => {
          const dx = particle.x - p2.x;
          const dy = particle.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(162, 89, 255, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Interactive Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
      
      {/* Dynamic Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(162, 89, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(58, 242, 255, 0.12) 0%, transparent 50%),
            linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 52, 96, 0.95) 100%)
          `,
          backgroundBlendMode: 'screen',
          animation: 'gradientShift 15s ease infinite'
        }}
      />

      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-slow-delayed" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              Game Categories
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Choose your favorite game category and start winning real rewards!
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative rounded-3xl overflow-hidden transform transition-all duration-500"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                transform: hoveredCategory === category.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hoveredCategory === category.id 
                  ? '0 0 40px rgba(162, 89, 255, 0.3), 0 0 80px rgba(58, 242, 255, 0.2)'
                  : '0 0 20px rgba(162, 89, 255, 0.1), 0 0 40px rgba(58, 242, 255, 0.1)'
              }}
            >
              {/* Category Background */}
              <div className="absolute inset-0">
                <img 
                  src={category.bgImage} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                  style={{
                    transform: hoveredCategory === category.id ? 'scale(1.1)' : 'scale(1)',
                    filter: 'brightness(0.3)'
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-70 mix-blend-overlay transition-opacity duration-500`}
                  style={{ opacity: hoveredCategory === category.id ? 0.8 : 0.6 }}
                />
              </div>

              {/* Category Content */}
              <div className="relative p-8">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-xl border border-white/20 transition-transform duration-500"
                      style={{ transform: hoveredCategory === category.id ? 'scale(1.1) rotate(5deg)' : 'scale(1)' }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">{category.name}</h3>
                      <p className="text-white/80">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Category Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Active Players', value: category.stats.activePlayers, icon: Users },
                    { label: 'Ongoing Matches', value: category.stats.ongoingMatches, icon: Gamepad2 },
                    { label: 'Total Prize', value: category.stats.totalPrize, icon: Trophy }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <stat.icon className="h-5 w-5 text-white/80 mx-auto mb-2" />
                      <div className="text-white font-bold text-lg">{stat.value}</div>
                      <div className="text-white/60 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Games List */}
                <div className="space-y-4">
                  {category.games.map((game, index) => (
                    <div
                      key={index}
                      className="group/game relative bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Gamepad2 className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold text-lg">{game.name}</span>
                              {game.hot && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-xs font-bold text-white">
                                  <Flame className="h-3 w-3 mr-1" />HOT
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm mt-1 flex-wrap">
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {game.players}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {game.time}
                              </span>
                              <span className="flex items-center">
                                <Trophy className="h-3 w-3 mr-1" />
                                {game.prize}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="group/button flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 overflow-hidden"
                          style={{
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <span className="whitespace-nowrap">Play Now</span>
                          <ArrowRight className="h-4 w-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes float-slow-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s linear infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-slow-delayed {
          animation: float-slow-delayed 8s ease-in-out infinite 2s;
        }

        @media (max-width: 640px) {
          .group\/game {
            flex-direction: column;
            gap: 1rem;
          }
          
          .group\/game button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
} 