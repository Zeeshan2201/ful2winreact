"use client"

import React, { useState } from "react"
import { ChevronLeft, Clock, Info, Users, Trophy, Wallet, History as HistoryIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function GameModeTemplate({ 
  onBack, 
  gameTitle = "Game",
  modeType = "Classic", // "Classic" or "Tournament"
  gameOptions = [],
  logoSrc = "/game-logo.jpg"
}) {
  const navigate = useNavigate()
  const [showHistory, setShowHistory] = useState(false)
  const [walletBalance] = useState(1240) // Mock balance - replace with real balance from your state management
  
  // Mock history data - replace with real history from API/state
  const gameHistory = [
    { id: 1, gameName: "TicTacToe", date: "Today, 3:30 PM", result: "Won", amount: "₹15" },
    { id: 2, gameName: "CoinFlip", date: "Today, 2:15 PM", result: "Lost", amount: "₹5" },
    { id: 3, gameName: "MemoryMatch", date: "Yesterday", result: "Won", amount: "₹20" }
  ]

  // Different color themes for different mode types
  const themeColors = {
    Classic: {
      primary: "#1e0b3b",
      secondary: "#2a1252",
      accent: "#8b5cf6",
      gradient: "from-purple-900 to-indigo-900",
      cardGradient: "from-white to-purple-50",
      buttonGradient: "from-green-500 to-green-600",
      heroGradient: "from-purple-800 via-purple-900 to-indigo-900"
    },
    Tournament: {
      primary: "#1e0b3b",
      secondary: "#2a1252",
      accent: "#f59e0b",
      gradient: "from-purple-900 to-yellow-900",
      cardGradient: "from-white to-amber-50",
      buttonGradient: "from-amber-500 to-yellow-600",
      heroGradient: "from-purple-900 via-yellow-900 to-purple-900"
    },
    Private: {
      primary: "#1e0b3b",
      secondary: "#2a1252",
      accent: "#3b82f6",
      gradient: "from-purple-900 to-blue-900",
      cardGradient: "from-white to-blue-50",
      buttonGradient: "from-green-500 to-green-600",
      heroGradient: "from-purple-800 via-blue-900 to-indigo-900"
    }
  }

  // Default to Classic theme if mode not found
  const theme = themeColors[modeType] || themeColors.Classic

  const handlePlayClick = (game) => {
    // Navigate to the actual game with the selected mode
    navigate(`/games/${gameTitle.toLowerCase()}/${modeType.toLowerCase()}`);
  };

  const showGameInfo = () => {
    alert(`How to play ${gameTitle} ${modeType}:\n\nChoose your entry amount and compete against other players to win prizes. ${modeType === "Tournament" ? "Join tournaments to win bigger prizes!" : "Play classic mode for quick games!"}`);
  };
  
  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-b from-[#1e0b3b] to-[#2a1252] text-white">
      {/* Header */}
      <div className="p-3 flex items-center justify-between bg-[#1e0b3b]/90 backdrop-blur-sm border-b border-purple-900/40 shadow-md">
        <div className="flex items-center">
          <button className="text-white p-2 hover:bg-purple-800/50 rounded-full transition-colors" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center">
            <span className="text-lg font-medium">{gameTitle}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-purple-900/60 px-3 py-1.5 rounded-full shadow-inner">
            <Wallet size={14} className="text-green-400" />
            <span className="text-white font-medium">₹{walletBalance}</span>
          </div>
          <button 
            className="p-2 bg-purple-900/60 rounded-full hover:bg-purple-800/70 transition-colors"
            onClick={() => setShowHistory(!showHistory)}
          >
            <HistoryIcon size={16} className="text-gray-300" />
          </button>
          <button 
            className="p-2 bg-purple-900/60 rounded-full hover:bg-purple-800/70 transition-colors"
            onClick={showGameInfo}
          >
            <Info size={16} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* History Popup */}
      {showHistory && (
        <div className="absolute top-16 right-3 z-10 bg-[#2a1252] shadow-lg rounded-lg w-64 p-3 border border-purple-700/50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Recent Games</h3>
            <button 
              className="hover:bg-purple-800/40 p-1 rounded-full transition-colors" 
              onClick={() => setShowHistory(false)}
            >
              ×
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {gameHistory.map(item => (
              <div key={item.id} className="flex justify-between text-xs border-b border-purple-800/30 pb-1">
                <div>
                  <div className="font-medium">{item.gameName}</div>
                  <div className="text-gray-400">{item.date}</div>
                </div>
                <div className={item.result === "Won" ? "text-green-400" : "text-red-400"}>
                  {item.result === "Won" ? "+" : "-"}{item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Hero Section with Game Title */}
      <div className={`bg-gradient-to-br ${theme.heroGradient} pt-5 pb-4 px-4 relative overflow-hidden`}>
        {/* Abstract background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="flex items-center justify-center mb-4 relative">
          <div className={`w-24 h-24 rounded-xl bg-gradient-to-r ${theme.gradient} flex items-center justify-center shadow-lg shadow-purple-900/50 overflow-hidden border-2 border-${theme.accent}/30`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <img 
              src={logoSrc}
              alt={gameTitle}
              className="w-18 h-18 object-contain relative z-10"
              onError={(e) => {
                e.target.src = "/fallback.jpg"
                console.log("Failed to load image:", logoSrc)
              }}
            />
            
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg opacity-30 blur group-hover:opacity-50 animate-pulse"></div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-1 relative">{gameTitle}</h1>
        <h2 className={`text-lg font-semibold text-center mb-2 text-${modeType === 'Tournament' ? 'amber' : 'purple'}-300`}>{modeType} Mode</h2>
        
        <div className={`w-24 h-0.5 mx-auto rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-100/5 backdrop-blur-sm overflow-y-auto">
        {gameOptions.map((game) => (
          <div key={game.id} className="mb-2 px-3 pt-1">
            <div className={`p-3 relative overflow-hidden rounded-xl bg-white shadow-md border border-${theme.accent}/10`}>
              {/* Game Card */}
              <div className="relative z-10">
                {/* Players and Winners Info */}
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Users className={`w-4 h-4 text-${theme.primary} mr-1`} />
                    <span className="text-gray-700">{game.players}</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-gray-700">{game.winners}</span>
                  </div>
                </div>

                {/* Winning amount - Now more prominent */}
                <div className="flex justify-between items-center mb-3">
                  <div className={`text-xl font-bold text-black px-4 py-1 rounded-lg bg-${theme.accent}/20`}>
                    Win {game.prize}
                  </div>
                  
                  {/* Play button - Right aligned on same line */}
                  <button
                    className={`h-10 px-5 bg-green-500 text-white font-medium rounded-full text-center shadow-md hover:bg-green-600 transition-all transform active:scale-95 active:bg-white active:text-${theme.accent}`}
                    onClick={() => handlePlayClick(game)}
                  >
                    {game.entryFee === "Free" ? "Free" : `Play ${game.entryFee}`}
                  </button>
                </div>

                {/* Live Count and Time */}
                <div className="flex justify-between items-center text-xs mt-1.5">
                  <div className="flex items-center text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                    <span>{game.liveCount} playing</span>
                  </div>
                  
                  {game.timeRemaining && (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{game.timeRemaining}</span>
                    </div>
                  )}
                  
                  {modeType === "Tournament" && game.startTime && (
                    <div className="flex items-center text-amber-500">
                      <span>{game.startTime}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick Badge - Show only if applicable and not in Classic mode */}
              {game.isQuick && modeType !== "Classic" && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                  QUICK
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add shine animation */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          20% { transform: translateX(100%) skewX(-12deg); }
          100% { transform: translateX(100%) skewX(-12deg); }
        }
      `}</style>
    </div>
  )
} 