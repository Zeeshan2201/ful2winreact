"use client"

import { useState } from "react"
import GameDashboard from "./GameDashboard"
import CarromDashboard from "./CarromDashboard"

export default function GameSection() {
  const [activeTab, setActiveTab] = useState("All")
  const [activeDashboard, setActiveDashboard] = useState(null)

  const games = {
    All: ["Ludo", "Carrom", "Chess", "BGMI", "Freefire", "TicTacToe", "Uno", "CoinFlip", "Dice", "MemoryMatch", "StonePaper","DuckHuntGame"],
    Board: ["Ludo", "Carrom", "Chess", "TicTacToe", "DuckHuntGame"],
    Action: ["BGMI", "Freefire"],
    Card: ["Uno"],
    Casino: ["CoinFlip", "Dice", "StonePaper"]
  }

  const gameLinks = {
    TicTacToe: "/games/tictactoe",
    Uno: "/games/uno",
    Ludo: "/games/ludo",
    Carrom: "/games/carrom",
    Chess: "/games/chess",
    BGMI: "/games/bgmi",
    Freefire: "/games/freefire",
    CoinFlip: "/games/coinFlip",
    Dice: "/games/dice",
    MemoryMatch: "/games/memorymatch",
    StonePaper:"/games/stonePaper",
    DuckHuntGame:"/games/DuckHuntGame",
  }

  const gameImages = {
    TicTacToe: "/tictactoe.jpg",
    Uno: "/uno.jpg",
    Ludo: "/ludo.jpeg",
    Carrom: "/carrom.jpg",
    Chess: "/chess.jpg",
    BGMI: "/bgmi.jpg",
    Freefire: "/freefire.jpg",
    CoinFlip: "/coinflip.jpg",
    Dice: "/dice.png",
    MemoryMatch: "/memorymatch.png",
    DuckHuntGame:"/DuckHuntGame.jpg",
  }

  const gameCategories = {
    TicTacToe: "Board",
    RockPaperScissor: "Casino",
    Uno: "Card",
    Ludo: "Board",
    Carrom: "Board",
    Chess: "Board",
    BGMI: "Action",
    Freefire: "Action",
    CoinFlip: "Casino",
    Dice: "Casino",
    MemoryMatch: "Casino",
    StonePaper: "Casino",
    DuckHuntGame: "Board",
  }

  // Default entry fees for all games (can be customized per game if needed)
  const defaultEntryFees = {
    classic: "₹10 - ₹50",
    quick: "₹5 - ₹25",
    tournament: "₹20 - ₹100",
    private: "Custom",
  }

  // Custom entry fees for specific games (if needed)
  const gameEntryFees = {
    BGMI: {
      classic: "₹15 - ₹75",
      quick: "₹10 - ₹30",
      tournament: "₹50 - ₹200",
      private: "Custom",
    },
    Freefire: {
      classic: "₹15 - ₹75",
      quick: "₹10 - ₹30",
      tournament: "₹50 - ₹200",
      private: "Custom",
    },
    // Add other custom entry fees as needed
  }

  const handleGameClick = (game) => {
    // Check if the game is implemented
    if (games.All.includes(game)) {
      setActiveDashboard(game)
    } else {
      console.log(`${game} dashboard not implemented yet`)
    }
  }

  const getEntryFees = (game) => {
    return gameEntryFees[game] || defaultEntryFees
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 min-h-screen overflow-hidden pb-20">
      {/* Subtle animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600/15 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-600/15 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Page Title */}
        <div className="text-center py-6 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Game Collection
          </h1>
          <p className="text-gray-300 mt-2">Choose from our wide selection of exciting games</p>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.keys(games).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 transform scale-105"
                    : "text-white bg-white/10 hover:bg-white/20 hover:shadow-md hover:shadow-purple-500/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {games[activeTab].map((game) => (
              <div
                key={game}
                className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:shadow-purple-500/10 border border-white/5 hover:border-purple-500/20"
                onClick={() => handleGameClick(game)}
              >
                {/* Image Section */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={gameImages[game] || "/placeholder.svg"}
                    alt={game}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/fallback.jpg" // Fallback image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Game category badge */}
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-xs font-medium text-white px-2 py-1 rounded-full">
                    {gameCategories[game] || "Game"}
                  </div>
                  
                  {/* Play button (visible on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full font-medium transform scale-0 group-hover:scale-100 transition-transform duration-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Play
                    </button>
                  </div>
                </div>
                
                {/* Game Name */}
                <div className="p-3 text-center">
                  <h3 className="font-bold text-white text-lg truncate">{game}</h3>
                  
                  {/* Entry fee - could be shown in a simplified format */}
                  <p className="text-xs text-gray-300 mt-1">
                    Entry: {gameEntryFees[game]?.classic.split(' - ')[0] || defaultEntryFees.classic.split(' - ')[0]}+
                  </p>
                  
                  {/* Popular badge or other status indicators */}
                  {["Ludo", "Chess", "BGMI"].includes(game) && (
                    <span className="inline-block mt-2 text-xs font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 px-2 py-0.5 rounded-full">
                      {game === "Ludo" ? "Most Popular" : "Popular"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Dashboard Modal */}
      {activeDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setActiveDashboard(null)}></div>
          <div className="relative w-full max-w-4xl px-4 animate-fade-in">
            <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <GameDashboard
                gameTitle={activeDashboard}
                gameImage={gameImages[activeDashboard]}
                gameCategory={gameCategories[activeDashboard]}
                entryFees={getEntryFees(activeDashboard)}
                onClose={() => setActiveDashboard(null)}
                link={gameLinks[activeDashboard] || "#"}
              />
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
