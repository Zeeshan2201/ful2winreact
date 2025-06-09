import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Users, IndianRupee, Clock, Trophy, Flame, ArrowRight, Target, Crown, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tournaments = [
  {
    id: 1,
    name: 'PUBG Mobile Championship',
    game: 'PUBG Mobile',
    prize: '₹1,00,000',
    date: '2024-04-15T10:00:00',
    endDate: '2024-04-15T18:00:00', // 8 hours tournament
    participants: 256,
    entryFee: '₹500',
    color: 'from-orange-600 to-red-700',
    icon: '/pubgicon.png',
    path: '/games/bgmi'
  },
  {
    id: 2,
    name: 'Free Fire Masters',
    game: 'Free Fire',
    prize: '₹75,000',
    date: '2024-04-20T15:00:00',
    endDate: '2024-04-20T21:00:00', // 6 hours tournament
    participants: 128,
    entryFee: '₹300',
    color: 'from-yellow-600 to-orange-700',
    icon: '/freefireicon.png',
    path: '/games/freefire'
  },
  {
    id: 3,
    name: 'Chess Grandmaster Cup',
    game: 'Chess',
    prize: '₹50,000',
    date: '2024-04-25T12:00:00',
    endDate: '2024-04-27T18:00:00', // 2.5 days tournament
    participants: 64,
    entryFee: '₹200',
    color: 'from-blue-600 to-blue-800',
    icon: '♞',
    path: '/games/chess'
  },
];

function CountdownTimer({ date, endDate }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  const [isLive, setIsLive] = useState(false);

  function calculateTimeLeft() {
    const now = new Date();
    const startDate = new Date(date);
    const tournamentEndDate = new Date(endDate);
    let timeLeft = {};
    
    // Check if tournament has started
    if (now >= startDate) {
      setHasStarted(true);
      
      // Check if tournament is still ongoing
      if (now < tournamentEndDate) {
        setIsLive(true);
        // Calculate time left until end
        const difference = tournamentEndDate - now;
        
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
      } else {
        // Tournament has ended
        setIsLive(false);
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    } else {
      // Tournament hasn't started yet
      setHasStarted(false);
      setIsLive(false);
      
      // Calculate time until start
      const difference = startDate - now;
      
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [date, endDate]);

  const timeUnits = Object.entries(timeLeft).length > 0 
    ? Object.entries(timeLeft) 
    : [['days', 0], ['hours', 0], ['minutes', 0], ['seconds', 0]];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} mr-2`}></div>
          <span className="text-white text-xs font-medium">
            {!hasStarted ? "Tournament starts in:" : isLive ? "Tournament ends in:" : "Tournament ended"}
          </span>
        </div>
        <div className="flex space-x-1">
          {timeUnits.map(([unit, value]) => (
            <div 
              key={unit} 
              className="bg-white/10 rounded-md px-1 py-0.5 min-w-[36px] text-center"
            >
              <span className="text-white text-sm font-bold block">{String(value).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedTournaments() {
  const [currentTime] = useState(new Date());
  const navigate = useNavigate();
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

  // For demo purposes, set one past tournament
  const pastTournament = {
    ...tournaments[0], 
    date: new Date(currentTime.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    endDate: new Date(currentTime.getTime() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
  };
  
  // Create a demo array with one live tournament
  const demoTournaments = [
    pastTournament,
    tournaments[1],
    tournaments[2]
  ];

  return (
    <section className="relative py-12 px-4 overflow-hidden min-h-screen">
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
            src="bgvideo2.mp4" 
            type="video/mp4"
          />
        </video>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Featured Tournaments
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Join our biggest tournaments and win massive prizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="relative rounded-2xl overflow-hidden transition-all duration-300 bg-black/30 backdrop-blur-sm border border-white/5 hover:shadow-lg hover:shadow-purple-900/20"
            >
              {/* Tournament Header */}
              <div className={`h-1.5 bg-gradient-to-r ${tournament.color}`} />
              
              <div className="p-6">
                {/* Tournament Icon and Game */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                      {tournament.icon.startsWith('/') ? (
                        <img src={tournament.icon} alt={tournament.game} className="w-8 h-8 object-contain" />
                      ) : (
                      <span className="text-2xl">{tournament.icon}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Target className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-white/80">{tournament.game}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Date & Countdown */}
                <div className="mb-5">
                  <div className="flex items-center text-white/70 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                    <span>
                      {new Date(tournament.date) <= currentTime ? (
                        <>Started: {new Date(tournament.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</>
                      ) : (
                        <>Starts: {new Date(tournament.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</>
                      )}
                    </span>
                  </div>
                  <CountdownTimer date={tournament.date} endDate={tournament.endDate} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors duration-300">
                    <div className="inline-flex items-center justify-center w-8 h-8 mb-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-700">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-lg font-bold text-white mb-0.5">
                      {tournament.participants}
                    </div>
                    <div className="text-xs text-white/70">
                      Players
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors duration-300">
                    <div className="inline-flex items-center justify-center w-8 h-8 mb-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-700">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-lg font-bold text-white mb-0.5">
                      {tournament.prize}
                    </div>
                    <div className="text-xs text-white/70">
                      Prize Pool
                    </div>
                  </div>
                </div>

                {/* Entry Fee */}
                <div className="mb-5 flex items-center bg-white/10 px-3 py-2 rounded-xl">
                  <IndianRupee className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-white font-bold text-sm">Entry Fee: {tournament.entryFee}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    className={`flex-1 ${new Date(tournament.date) <= currentTime ? 'bg-gradient-to-r from-green-600 to-teal-700' : 'bg-gradient-to-r from-blue-600 to-purple-700'} text-white font-bold py-3 px-5 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                    onClick={() => navigate(tournament.path)}
                  >
                    {new Date(tournament.date) <= currentTime ? (
                      <>
                        <Play className="h-4 w-4" fill="white" />
                        <span>Play Now</span>
                      </>
                    ) : (
                      <>
                        <span>Register Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button 
                    className="flex-1 bg-white/10 text-white font-bold py-3 px-5 rounded-xl hover:bg-white/15 transition-all duration-300 border border-white/10"
                  >
                    Details
                  </button>
                </div>
              </div>

              {/* Badges - Live, MEGA PRIZE, and Featured */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                {new Date(tournament.date) <= currentTime && new Date(tournament.endDate) > currentTime && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5"></div>
                    LIVE
                  </div>
                )}
                
                {parseInt(tournament.prize.replace(/[^0-9]/g, '')) >= 75000 && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
                    <Flame className="h-3 w-3 mr-1" />
                    MEGA PRIZE
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-2.5 py-1 rounded-full shadow-md flex items-center">
                  <Crown className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                  <span className="text-white text-xs font-bold">Featured</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
} 