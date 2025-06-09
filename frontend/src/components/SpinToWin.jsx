import React, { useState, useEffect, useRef } from 'react';

const prizes = [
  { id: 1, label: '10', color: '#FFF066' },
  { id: 2, label: '20', color: '#FF9F80' },
  { id: 3, label: '40', color: '#4DEEEA' },
  { id: 4, label: '80', color: '#44F261' },
  { id: 5, label: '20', color: '#FF9F80' },
  { id: 6, label: '100', color: '#FF4F9A' },
  { id: 7, label: '40', color: '#4DEEEA' },
  { id: 8, label: '10', color: '#FFF066' },
];

const DAILY_SPIN_LIMIT = 5;

export default function SpinToWin() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [angle, setAngle] = useState(0);
  const [coinBalance, setCoinBalance] = useState(720); // Initial coin balance
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [remainingSpins, setRemainingSpins] = useState(DAILY_SPIN_LIMIT); // Starting with 5 spins left
  const [lastSpinDate, setLastSpinDate] = useState(null);
  const wheelRef = useRef(null);
  const videoRef = useRef(null);

  // Add video loading effect
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

  // Reset CSS variables for wheel animation
  useEffect(() => {
    if (wheelRef.current && isSpinning) {
      wheelRef.current.style.setProperty('--spin-angle', `${angle}deg`);
    }
  }, [angle, isSpinning]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('spinToWinData');
    
    if (savedData) {
      const { balance, lastDate, spinsLeft } = JSON.parse(savedData);
      
      // Set saved balance
      setCoinBalance(balance || 720);
      
      // Check if it's a new day
      const today = new Date().toDateString();
      const savedDate = lastDate ? new Date(lastDate).toDateString() : null;
      
      if (savedDate !== today) {
        // Reset spins for new day
        setRemainingSpins(DAILY_SPIN_LIMIT);
      } else {
        // Use saved remaining spins
        setRemainingSpins(spinsLeft || 0);
      }
      
      setLastSpinDate(lastDate || null);
    }
  }, []);

  // Save data to localStorage
  const saveGameData = (balance, spinsLeft) => {
    const today = new Date().toISOString();
    
    localStorage.setItem('spinToWinData', JSON.stringify({
      balance,
      lastDate: today,
      spinsLeft
    }));
    
    setLastSpinDate(today);
  };

  const handleSpin = () => {
    // Check if daily spin limit reached
    if (remainingSpins <= 0) {
      alert("You've used all your daily spins! Come back tomorrow.");
      return;
    }
    
    // Deduct from daily spins
    const newRemainingSpins = remainingSpins - 1;
    setRemainingSpins(newRemainingSpins);
    
    // Save updated data
    saveGameData(coinBalance, newRemainingSpins);
    
    setIsSpinning(true);
    setResult(null);
    setShowCoinAnimation(false);
    
    // Get random prize with weighted probabilities
    const idx = Math.floor(Math.random() * prizes.length);
    const prize = prizes[idx];
    
    const segmentAngle = 360 / prizes.length;
    // More spins for more dramatic effect (5-7 full rotations)
    const spinRotations = 5 + Math.random() * 2;
    const newAngle = 360 * spinRotations + (360 - ((idx + 1) * segmentAngle));
    
    setAngle((prev) => prev + newAngle);
    
    // Longer spinning time for better effect
    setTimeout(() => {
      setResult(prize);
      setIsSpinning(false);
      // Add won coins to balance
      const updatedBalance = coinBalance + Number(prize.label);
      setCoinBalance(updatedBalance);
      // Update local storage with new balance
      saveGameData(updatedBalance, newRemainingSpins);
      setShowCoinAnimation(true);
    }, 4000);
  };

  const center = 160;
  const radius = 140;
  const segmentAngle = 360 / prizes.length;

  // Format time until next reset
  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow - now;
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${minutes}m`;
  };

  return (
    <section className="relative min-h-screen py-8 overflow-hidden">
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
            src="bgvideo4.mp4" 
            type="video/mp4"
          />
        </video>
      </div>

      {/* Dark overlay for better content visibility */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-md mx-auto px-4 w-full">
        {/* Header with larger Jackpot Spin */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-purple-700 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">SPIN</span>
            </div>
          </div>
          <h1 className="text-white text-2xl font-bold">Jackpot Spin</h1>
        </div>

        {/* Balance Display */}
        <div className="flex justify-center mb-5">
          <div className="relative px-10 py-3 rounded-full border border-yellow-500/30 w-48">
            <div className="absolute inset-0 rounded-full" style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, transparent 80%)'
            }}></div>
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-yellow-800 font-bold">$</span>
              </div>
              <div>
                <p className="text-xs text-yellow-500 uppercase">BALANCE</p>
                <p className="text-2xl font-bold text-yellow-300">{coinBalance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Spins Display */}
        <div className="flex justify-center mb-8">
          <div className="relative px-10 py-3 rounded-full border border-blue-500/30 bg-blue-900/20 w-48">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V12L16 14" stroke="#A5F3FC" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="#A5F3FC" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-300 uppercase">DAILY SPINS LEFT</p>
                <div className="flex items-center text-blue-200">
                  <p className="text-xl font-bold">{remainingSpins}/{DAILY_SPIN_LIMIT}</p>
                  {remainingSpins === 0 && (
                    <p className="text-xs ml-2">Resets in: {getTimeUntilReset()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {/* Adjust wheel size for better mobile responsiveness */}
          <div className="relative w-full max-w-[320px] aspect-square mb-6">
            {/* Wheel Glow Effect */}
            <div className="absolute inset-0 rounded-full" style={{
              boxShadow: '0 0 50px 10px rgba(255, 215, 0, 0.3)',
              filter: 'blur(8px)'
            }} />

            {/* Pointer Triangle at the bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 z-20">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <polygon 
                  points="12,24 0,0 24,0" 
                  fill="#FFD700"
                  style={{
                    filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))'
                  }}
                />
              </svg>
            </div>

            {/* Gold wheel border */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-yellow-400"
              style={{
                boxShadow: `
                  0 0 20px 5px rgba(255, 215, 0, 0.5),
                  inset 0 0 10px rgba(255, 215, 0, 0.5)
                `
              }}
            />

            {/* Wheel SVG */}
            <svg
              width={center * 2}
              height={center * 2}
              viewBox={`0 0 ${center * 2} ${center * 2}`}
              className="absolute inset-0 transition-all"
              style={{
                transform: `rotate(${angle}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
              }}
              ref={wheelRef}
            >
              {prizes.map((prize, i) => {
                const startAngle = i * segmentAngle;
                const endAngle = (i + 1) * segmentAngle;
                const largeArc = segmentAngle > 180 ? 1 : 0;
                const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
                const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
                const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
                const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
                const d = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
                return (
                  <path 
                    key={i}
                    d={d} 
                    fill={prize.color} 
                    stroke="#fff" 
                    strokeWidth="1"
                    style={{
                      filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))'
                    }}
                  />
                );
              })}
              {/* Prize labels */}
              {prizes.map((prize, i) => {
                const theta = ((i + 0.5) * 2 * Math.PI) / prizes.length;
                const x = center + (radius - 40) * Math.cos(theta);
                const y = center + (radius - 40) * Math.sin(theta);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="28"
                    fontWeight="bold"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth="1"
                    style={{
                      paintOrder: 'stroke fill',
                    }}
                  >
                    {prize.label}
                  </text>
                );
              })}
              
              {/* Center SPIN button */}
              <circle cx={center} cy={center} r="40" fill="#FF4B91" />
              <circle cx={center} cy={center} r="38" fill="#FF4B91" stroke="#fff" strokeWidth="2" />
              <text
                x={center}
                y={center - 5}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="24"
                fontWeight="bold"
                fill="#fff"
              >
                SPIN
              </text>
              <text
                x={center}
                y={center + 15}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="10"
                fill="#fff"
              >
                {isSpinning ? "" : "Tap to spin"}
              </text>
            </svg>

            {/* Clickable overlay for spinning */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || remainingSpins <= 0}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-transparent disabled:cursor-not-allowed z-10"
            />
          </div>

          {/* Result Display */}
          {result && !isSpinning && (
            <div 
              className="mt-6 p-4 bg-gradient-to-r from-yellow-900/30 to-amber-800/30 backdrop-blur-sm rounded-lg text-center border border-yellow-500/20 w-full max-w-[320px]"
            >
              <div className="text-2xl font-bold text-yellow-300 mb-2">
                Congratulations!
              </div>
              <div className="text-3xl text-yellow-100 font-extrabold">
                You won <span className="text-yellow-300">{result.label} coins!</span>
              </div>

              {/* Flying coins animation */}
              {showCoinAnimation && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-6 h-6 rounded-full bg-yellow-400 animate-flying-coin"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                        boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.5)'
                      }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-yellow-800 font-bold text-xs">$</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-blue-900/80 backdrop-blur-md border-t border-blue-800/50 py-2 safe-bottom">
          <div className="max-w-md mx-auto flex justify-around items-center px-2">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-300">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
              <span className="text-[10px] text-blue-300">Home</span>
            </div>
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-300">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
              </svg>
              <span className="text-[10px] text-blue-300">Community</span>
            </div>
            <div className="bg-purple-700 rounded-full p-2 -mt-6 shadow-lg">
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">SPIN</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-300">
                <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] text-blue-300">Games</span>
            </div>
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-300">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] text-blue-300">Profile</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes flying-coin {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(calc(var(--random-x) * 100px), calc(var(--random-y) * -100px)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--random-x) * 150px), calc(var(--random-y) * -150px)) scale(0.5);
          }
        }
        .animate-flying-coin {
          animation: flying-coin 1.5s ease-out forwards;
          --random-x: ${Math.random() * 2 - 1};
          --random-y: ${Math.random() * 0.5 + 0.5};
        }
        
        @supports(padding-bottom: env(safe-area-inset-bottom)) {
          .safe-bottom {
            padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
          }
        }
        
        @media (max-width: 360px) {
          .max-w-[320px] {
            max-width: 280px;
          }
        }
      `}</style>
    </section>
  );
} 