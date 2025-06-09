"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function GameCatalog() {
  const [activeTab, setActiveTab] = useState("All")
  const navigate = useNavigate()

  const games = {
    All: ["TicTacToe","StonePaper", "Ludo", "Carrom", "Chess", "BGMI", "Freefire","Uno", "CoinFlip", "Dice", "MemoryMatch", "DuckHuntGame"],
    Board: ["TicTacToe", "Ludo", "Carrom", "Chess", "DuckHuntGame"],
    Action: ["Freefire", "BGMI"],
    Card: ["Uno"],
    Casino: ["StonePaper", "CoinFlip", "Dice", "MemoryMatch"]
  }

  const gameLinks = {
    TicTacToe: "/games/tictactoe",
    Uno: "/games/uno",
    Ludo: "/games/ludo",
    Carrom: "/games/carrom",
    Chess: "/games/chess",
    BGMI: "/games/bgmi",
    Freefire: "/games/freefire",
    CoinFlip: "/games/coinflip",
    Dice: "/games/dice",
    MemoryMatch: "/games/memorymatch",
    StonePaper: "/games/stonepaper",
    DuckHuntGame:"/games/DuckHuntGame",
  }

  // Track which games have actual implementations
  const implementedGames = [
    "TicTacToe",
    "CoinFlip",
    "Dice",
    "MemoryMatch",
    "StonePaper"
  ]

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
    StonePaper: "/stonepaper.jpg",
    DuckHuntGame:"/DuckHuntGame.jpg",
  }

  const gameCategories = {
    TicTacToe: "Board",
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

  const handleGameClick = (game) => {
    if (!games.All.includes(game)) return;
    
    // Only navigate if clicking on the game card, not the Play Now button
    // The Play Now button will be handled separately
    navigate(gameLinks[game]);
  }
  
  // This function will do nothing - to make the Play Now button non-functional
  const handlePlayNowClick = (e) => {
    // Stop event propagation to prevent navigating
    e.stopPropagation();
    // Do nothing
  }

  return (
    <div className="px-4 py-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-center mb-6">
        Game Collection
      </h1>
      
      {/* Game Category Tabs - Horizontally Scrollable */}
      <div className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar">
        <div className="flex space-x-2">
          {Object.keys(games).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-white bg-white/10 hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid - 2 Column for Mobile */}
      <div className="grid grid-cols-2 gap-4">
        {games[activeTab].map((game) => (
          <div
            key={game}
            className="bg-white/8 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 shadow-lg border border-white/15"
            onClick={() => handleGameClick(game)}
          >
            {/* Game Image - Changed aspect ratio for better visibility */}
            <div className="aspect-square relative overflow-hidden">
              <img
                src={gameImages[game] || "/placeholder.svg"}
                alt={game}
                className="w-full h-full object-contain bg-gradient-to-b from-black/20 to-black/40"
                onError={(e) => {
                  e.target.src = "/fallback.jpg" // Fallback image
                }}
              />
              
              {/* Category Badge */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-xs font-medium text-white px-2 py-1 rounded-full">
                {gameCategories[game] || "Game"}
              </div>

              {/* Implementation Badge */}
              {implementedGames.includes(game) && (
                <div className="absolute top-2 left-2 bg-green-500/80 backdrop-blur-md text-xs font-medium text-white px-2 py-1 rounded-full">
                  Live
                </div>
              )}
              
              {/* Overlay Gradient Always Present */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none flex items-end justify-center">
                <div className="w-full p-3">
                  {/* Game name moved inside image for better visibility */}
                  <h3 className="font-bold text-white text-lg text-center shadow-text">
                    {game}
                  </h3>
                </div>
              </div>
            </div>
            
            {/* Play Button Always Visible - Now non-functional */}
            <button 
              onClick={handlePlayNowClick}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play Now
            </button>
          </div>
        ))}
      </div>

      {/* Style for hiding scrollbar but keeping functionality */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Add shadow effect to text inside images */
        .shadow-text {
          text-shadow: 0px 2px 4px rgba(0,0,0,0.8), 0px 1px 2px rgba(0,0,0,0.9);
        }
      `}</style>
    </div>
  )
} 