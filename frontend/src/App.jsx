import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';

// Pages
import Home from './pages/home';
import GamesPage from './pages/games';

// Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PopularGames from './components/PopularGames';
import FeaturedTournaments from './components/FeaturedTournaments';
import GameStats from './components/GameStats';
import SpinToWin from './components/SpinToWin';
import BottomNav from './components/BottomNav';
import GameCatalog from './components/GameCatalog';
import GameDetailPage from './components/GameDetailPage';
import GameLobby from './components/GameLobby';
import ComingSoonPage from './components/ComingSoonPage';
import Wallet from './components/Wallet';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/notifications';
import Rewards from './components/rewards';
import History from './components/History';
import CommunityWrapper from './pages/community';
import GameDashboard from './components/GameDashboard';
import GameModeRouter from './components/GameModeRouter';
import GameConnector from './components/GameConnector';
import EnhancedGameLobby from './components/EnhancedGameLobby';
import MemoryMatchTestEntry from './components/debug/MemoryMatchTestEntry';
import WalletTest from './components/debug/WalletTest';

// Games
import SPS from './games/Stone-Paper/SPS';
import MemoryMatchGame from './games/Memory/MemoryMatchGame';
import DiceDuel from './games/Dice/DiceDuel';
import CoinFlipBet from './games/Coinflip/CoinFlipBet';
import TicTacToe from './games/Tictactoe/Tictactoe';
import GamingLoginMobile from './components/login_signup/GamingLoginMobile';
import GameResultLobby from './components/GameResultLobby';
import TictactoeGameLogic from './games/Tictactoe/TictactoeGameLogic';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import DuckHuntGame from './games/DuckHunt/logic';

function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => {
      document.documentElement.style.scrollBehavior = '';
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

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
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 50%)`;
        this.originalSize = this.size;
      }
      update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 150;
          this.speedX -= Math.cos(angle) * force * 0.2;
          this.speedY -= Math.sin(angle) * force * 0.2;
          this.size = this.originalSize * (1 + force);
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -0.8;
          this.x = Math.max(0, Math.min(this.x, canvas.width));
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY *= -0.8;
          this.y = Math.max(0, Math.min(this.y, canvas.height));
        }

        this.speedX *= 0.99;
        this.speedY *= 0.99;

        if (this.opacity > 0.1) this.opacity -= 0.001;
        else this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = Array.from({ length: 150 }, () => new Particle());
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
            const opacity = 0.2 * (1 - dist / 100);
            ctx.strokeStyle = `rgba(162, 89, 255, ${opacity})`;
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
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0"
        style={{ opacity: 0.7 }}
      />
      <div
        className="fixed inset-0 z-0"
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
      <div className="relative z-10">
        {showSplash ? (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center justify-center">
              <img
                src="/images/logo.jpg"
                alt="ful2win Logo"
                className="h-24 w-24 mb-6 rounded-2xl shadow-2xl animate-float"
              />
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-wide animate-pulse-glow">
                ful2win
              </h1>
            </div>
          </div>
        ) : (
          <>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">
              <HeroSection />
              <PopularGames />
              <FeaturedTournaments />
              <GameStats />
              <SpinToWin />
            </main>
            <BottomNav />
          </>
        )}
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
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(162, 89, 255, 0.5); }
          50% { text-shadow: 0 0 30px rgba(162, 89, 255, 0.8); }
        }
        .animate-float {
          animation: float-slow 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
        <Route path="/"  element={<PrivateRoute><HomePage/></PrivateRoute> } />
        <Route path="/games" element={<PrivateRoute><GamesPage /></PrivateRoute>} />
        
        {/* Game Detail and Lobby */}
        <Route path="/game/:gameId" element={<PrivateRoute><GameDetailPage /></PrivateRoute>} />
        <Route path="/game/:gameId/lobby" element={<PrivateRoute><GameLobby /></PrivateRoute>} />
        
        {/* Game Dashboard Routes for all implemented games */}
        <Route path="/games/tictactoe" element={<PrivateRoute>
          <GameDashboard 
            gameTitle="TicTacToe" 
            gameImage="/tictactoe.jpg"
            gameCategory="Board"
          /></PrivateRoute>
        } />
        <Route path="/games/stonepaper" element={<PrivateRoute>
          <GameDashboard 
            gameTitle="StonePaper" 
            gameImage="/stonepaper.jpg"
            gameCategory="Casino"
          /></PrivateRoute>
        } />
        <Route path="/games/memorymatch" element={<PrivateRoute>
          <GameDashboard 
            gameTitle="MemoryMatch" 
            gameImage="/memorymatch.png"
            gameCategory="Casino"
          />
          </PrivateRoute>
        } />
        <Route path="/games/dice" element={<PrivateRoute>
          <GameDashboard 
            gameTitle="Dice" 
            gameImage="/dice.png"
            gameCategory="Casino"
          /></PrivateRoute>
        } />
        <Route path="/games/coinflip" element={<PrivateRoute>
          <GameDashboard 
            gameTitle="CoinFlip" 
            gameImage="/coinflip.jpg"
            gameCategory="Casino"
          /></PrivateRoute>
        } />
        <Route path="/games/DuckHuntGame" element={<PrivateRoute>
          <GameDashboard 
            gameTitle="DuckHuntGame" 
            gameImage="/DuckHuntGame.jpg"
            gameCategory="Board"
          /></PrivateRoute>
        } />
        
        {/* Direct game routes (accessible after selecting mode in dashboard) */}
        <Route path="/games/tictactoe/play" element={<PrivateRoute><TicTacToe /></PrivateRoute>} />
        <Route path="/games/stonepaper/play" element={<PrivateRoute><SPS /></PrivateRoute>} />
        <Route path="/games/memorymatch/play" element={<PrivateRoute><MemoryMatchGame /></PrivateRoute>} />
        <Route path="/games/dice/play" element={<PrivateRoute><DiceDuel /></PrivateRoute>} />
        <Route path="/games/coinflip/play" element={<PrivateRoute><CoinFlipBet /></PrivateRoute>} />
        <Route path="/games/DuckHuntGame/play" element={<PrivateRoute><DuckHuntGame /></PrivateRoute>} />
        
        {/* Coming Soon Games */}
        <Route path="/games/ludo" element={<PrivateRoute><ComingSoonPage /></PrivateRoute>} />
        <Route path="/games/carrom" element={<PrivateRoute><ComingSoonPage /></PrivateRoute>} />
        <Route path="/games/chess" element={<PrivateRoute><ComingSoonPage /></PrivateRoute>} />
        <Route path="/games/uno" element={<PrivateRoute><ComingSoonPage /></PrivateRoute>} />
        <Route path="/games/bgmi" element={<PrivateRoute><ComingSoonPage /></PrivateRoute>} />
        <Route path="/games/freefire" element={<PrivateRoute><ComingSoonPage /></PrivateRoute>} />
        
        {/* Other App Routes */}
        <Route path="/community" element={<PrivateRoute><CommunityWrapper /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
        <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
        <Route path="/rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        
        {/* Game Modes */}
        <Route 
          path="/games/tictactoe/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} /></PrivateRoute>} 
        />
        <Route 
          path="/games/memorymatch/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="memorymatch" /></PrivateRoute>} 
        />
        <Route 
          path="/games/carrom/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="carrom" /></PrivateRoute>} 
        />
        <Route 
          path="/games/chess/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="chess" /></PrivateRoute>} 
        />
        <Route 
          path="/games/ludo/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="ludo" /></PrivateRoute>} 
        />
        <Route 
          path="/games/coinflip/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="coinflip" /></PrivateRoute>} 
        />
        <Route 
          path="/games/dice/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="dice" /></PrivateRoute>} 
        />
        <Route 
          path="/games/stonepaper/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="stonepaper" /></PrivateRoute>} 
        />
        <Route 
          path="/games/DuckHuntGame/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="DuckHuntGame" /></PrivateRoute>} 
        />
        <Route 
          path="/games/bgmi/*" 
          element={<PrivateRoute><GameModeRouter onBack={() => window.history.back()} gameType="bgmi" /></PrivateRoute>} 
        />
        
        {/* Game Connector for all games */}
        <Route 
          path="/games/:gameId/play/:modeType" 
          element={<PrivateRoute><GameConnector /></PrivateRoute>} 
        />
        
        {/* Direct game lobby route (for testing) */}
        <Route 
          path="/lobby/:gameId" 
          element={<PrivateRoute><EnhancedGameLobby /></PrivateRoute>} 
        />
        
        {/* Debug Routes */}
        <Route path="/debug/memory-game" element={<PrivateRoute><MemoryMatchTestEntry /></PrivateRoute>} />
        <Route path="/debug/wallet-test" element={<PrivateRoute><WalletTest /></PrivateRoute>} />
        
        <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
        <Route path="/login" element={<GamingLoginMobile />} />
        <Route path="/DuckHuntGame" element={<DuckHuntGame />} />
        {/* <Route path="/g" element={<PrivateRoute><TictactoeGameLogic /></PrivateRoute>} /> */}
        
      </Routes>
    </Router>
    </WalletProvider>
  );
}

export default App;
