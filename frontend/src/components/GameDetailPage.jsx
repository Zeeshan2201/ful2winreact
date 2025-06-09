"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { X, Star, ChevronLeft, Users } from "lucide-react"

export default function GameDetailPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState("main")
  const [selectedMode, setSelectedMode] = useState(null)
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [wallet, setWallet] = useState(1000) // Example wallet balance

  // Game data based on the game ID
  const gameData = {
    title: capitalizeFirstLetter(gameId || ""),
    image: `/${gameId?.toLowerCase()}.jpg`,
    category: getGameCategory(gameId),
    rating: "4.8",
    playersCount: "4 playing",
    entryFees: getEntryFees(gameId),
  }

  // Price options for game modes
  const priceOptions = [2, 5, 10, 25, 50, 100].map(price => `₹${price}`)

  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : ""
  }

  // Get game category based on game ID
  function getGameCategory(gameId) {
    const categories = {
      tictactoe: "Board",
      ludo: "Board",
      carrom: "Board",
      chess: "Board",
      bgmi: "Action",
      freefire: "Action",
      uno: "Card",
      coinflip: "Casino",
      dice: "Casino",
      memorymatch: "Casino",
      stonepaper: "Casino",
    }
    
    return categories[gameId?.toLowerCase()] || "Game"
  }

  // Get entry fees for the game
  function getEntryFees(gameId) {
    const actionGames = ["bgmi", "freefire"]
    
    if (actionGames.includes(gameId?.toLowerCase())) {
      return {
        classic: "₹15 - ₹75",
        tdm: "₹10 - ₹30",
        tournament: "₹50 - ₹200",
        private: "Custom",
      }
    }
    
    return {
      classic: "₹10 - ₹50",
      quick: "₹5 - ₹25",
      tournament: "₹20 - ₹100",
      private: "Custom",
    }
  }

  // Get game modes based on game ID
  function getGameModes(gameId) {
    const actionGames = ["bgmi", "freefire"]
    
    if (actionGames.includes(gameId?.toLowerCase())) {
      return [
        { id: "classic", name: "Classic Mode", description: "Battle Royale" },
        { id: "tdm", name: "TDM", description: "Team Deathmatch" }
      ]
    }
    
    return [
      { id: "classic", name: "Classic Mode", description: "Play with 2-4 players" },
      { id: "quick", name: "Quick Mode", description: "Faster gameplay" },
      { id: "tournament", name: "Tournament", description: "Compete for big prizes" },
      { id: "private", name: "Private Room", description: "Invite your friends" }
    ]
  }

  // Check if the game is an action game
  const isActionGame = ["bgmi", "freefire"].includes(gameId?.toLowerCase())

  // Handle mode selection
  const handleModeClick = (mode) => {
    setSelectedMode(mode)
    setCurrentView("priceSelection")
  }

  // Handle price selection
  const handlePriceClick = (price) => {
    setSelectedPrice(price)
    setCurrentView("confirmation")
  }

  // Handle game registration
  const handleRegister = () => {
    const priceValue = parseInt(selectedPrice.replace('₹', ''))
    
    if (wallet >= priceValue) {
      setWallet(wallet - priceValue)
      // Navigate to game lobby
      navigate(`/game/${gameId}/lobby`)
    } else {
      alert("Insufficient balance")
    }
  }

  // Handle back button
  const handleBack = () => {
    if (currentView === "priceSelection") {
      setCurrentView("main")
      setSelectedMode(null)
    } else if (currentView === "confirmation") {
      setCurrentView("priceSelection")
      setSelectedPrice(null)
    } else {
      navigate("/")
    }
  }

  // If the game doesn't exist, show a "Coming Soon" message
  if (!gameId) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
          <p className="text-gray-300 mb-6">This game is currently in development.</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => navigate("/")}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden">
      {currentView === "main" && (
        <div className="relative w-full h-screen bg-black text-white overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={gameData.image}
              alt={`${gameData.title} Background`}
              className="w-full h-full object-cover opacity-100 blur-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-transparent" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col min-h-screen px-4">
            {/* Header with Back Button */}
            <div className="pt-4 flex justify-between items-center">
              <button
                className="text-white hover:text-blue-500 transition rounded-full p-2 bg-gray-800/50"
                onClick={handleBack}
              >
                <ChevronLeft size={24} />
              </button>
              <div className="bg-gray-800/50 px-4 py-1 rounded-full text-sm">
                Balance: ₹{wallet}
              </div>
            </div>

            {/* Game Title Section */}
            <div className="text-center mt-8 mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-purple-500 overflow-hidden shadow-lg mb-4">
                <img
                  src={gameData.image}
                  alt={`${gameData.title} Logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{gameData.title}</h1>
              <div className="flex justify-center gap-2 text-base text-gray-300 mt-2">
                <span>{gameData.category}</span>
                <span>•</span>
                <span className="text-green-400 flex items-center">
                  {gameData.rating} <Star size={16} fill="currentColor" className="ml-1" />
                </span>
                <span>•</span>
                <span className="text-base">{gameData.playersCount}</span>
              </div>
            </div>

            {/* Game Modes Section */}
            <div className="w-full max-w-md mx-auto mb-4">
              <h2 className="text-xl font-bold mb-4 text-white text-left tracking-tight">
                Game Modes
              </h2>
              <div className="flex flex-col gap-3">
                {getGameModes(gameId).map((mode) => (
                  <div
                    key={mode.id}
                    className="bg-gray-800/50 rounded-xl shadow-lg p-3 border border-gray-700/50 transition-all hover:shadow-xl hover:bg-gray-800 active:scale-98"
                    onClick={() => handleModeClick(mode)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-blue-400 font-medium text-lg">
                          {mode.name}
                        </span>
                        <p className="text-gray-300 text-base">
                          {mode.description}
                        </p>
                      </div>
                      <div className="bg-[#009E60] px-3 py-1.5 rounded-lg text-white text-center">
                        <div className="text-xs">Entry</div>
                        <div className="text-sm font-medium">
                          {gameData.entryFees[mode.id]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "priceSelection" && selectedMode && (
        <div className="relative w-full h-screen bg-black text-white overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={gameData.image}
              alt={`${gameData.title} Background`}
              className="w-full h-full object-cover opacity-100 blur-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/40" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col min-h-screen px-4">
            {/* Header with Back Button */}
            <div className="pt-4 flex justify-between items-center">
              <button
                className="text-white hover:text-blue-500 transition rounded-full p-2 bg-gray-800/50"
                onClick={handleBack}
              >
                <ChevronLeft size={24} />
              </button>
              <div className="bg-gray-800/50 px-4 py-1 rounded-full text-sm">
                Balance: ₹{wallet}
              </div>
            </div>

            {/* Price Selection Section */}
            <div className="w-full max-w-md mx-auto mt-8">
              <h2 className="text-xl font-bold mb-2 text-white text-center">
                {selectedMode.name}
              </h2>
              <p className="text-center text-gray-300 mb-8">
                Select entry fee to continue
              </p>
              
              {/* Price Options */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {priceOptions.map((price) => (
                  <button
                    key={price}
                    onClick={() => handlePriceClick(price)}
                    className={`bg-gray-800/80 border-2 border-gray-700 hover:border-blue-500 rounded-lg p-4 flex items-center justify-center transition-all h-24`}
                  >
                    <span className="text-xl font-bold text-white">{price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "confirmation" && selectedMode && selectedPrice && (
        <div className="relative w-full h-screen bg-black text-white overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={gameData.image}
              alt={`${gameData.title} Background`}
              className="w-full h-full object-cover opacity-100 blur-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/40" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col min-h-screen px-4">
            {/* Header with Back Button */}
            <div className="pt-4 flex justify-between items-center">
              <button
                className="text-white hover:text-blue-500 transition rounded-full p-2 bg-gray-800/50"
                onClick={handleBack}
              >
                <ChevronLeft size={24} />
              </button>
              <div className="bg-gray-800/50 px-4 py-1 rounded-full text-sm">
                Balance: ₹{wallet}
              </div>
            </div>

            {/* Confirmation Card */}
            <div className="w-full max-w-md mx-auto mt-8 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
              <h2 className="text-xl font-bold mb-6 text-center">{gameData.title} - {selectedMode.name}</h2>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-gray-300">Entry Fee:</div>
                <div className="text-xl font-bold">{selectedPrice}</div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-gray-300">Potential Winning:</div>
                <div className="text-xl font-bold text-green-400">
                  {isActionGame ? 
                    `Room ID & Password` : 
                    `₹${parseInt(selectedPrice.replace('₹', '')) * 1.8}`
                  }
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div className="text-gray-300 flex items-center">
                  <Users size={16} className="mr-1" /> Players:
                </div>
                <div className="font-medium">{isActionGame ? '100 Players' : '2 Players'}</div>
              </div>
              
              <button
                onClick={handleRegister}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:brightness-110 transition-all"
              >
                Register & Play
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 