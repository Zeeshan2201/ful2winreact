"use client"

import { useState } from "react"
import { Zap } from "lucide-react"
import GameModeLayout from "./GameModeLayout"

export default function QuickMode({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = ["All", "Cash", "Registered"]

  const games = [
    {
      id: 1,
      name: "Quick 2 Player",
      image: "quick2",
      prize: "₹90",
      entryFee: "₹50",
      startTime: "Starting now",
      playerCount: "4,000+",
      winnerCount: "1 Winner",
      buttonColor: "bg-gradient-to-r from-green-500 to-green-600",
      isRegistered: false,
    },
    {
      id: 2,
      name: "Quick 4 Player",
      image: "quick4",
      prize: "₹100",
      entryFee: "₹30",
      startTime: "Starting in 1 min",
      playerCount: "2,500+",
      winnerCount: "1 Winner",
      buttonColor: "bg-gradient-to-r from-green-500 to-green-600",
      isRegistered: true,
    },
  ]

  const filteredGames = games.filter((game) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Cash") return game.entryFee !== "FREE" && !game.isRegistered
    if (activeFilter === "Registered") return game.isRegistered
    return true
  })

  return (
    <GameModeLayout title="Quick Mode" onBack={onBack}>
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700 pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`relative min-w-[100px] px-4 py-2 text-lg font-base rounded-s-md transition-all duration-200 text-center ${
              activeFilter === filter
                ? "text-white"
                : "text-gray-200 hover:text-gray-200 hover:bg-gray-700/50"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
            {activeFilter === filter && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-md" />
            )}
          </button>
        ))}
      </div>

     
      <div
        className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-1"
      >
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-gray-800/80 rounded-xl shadow-lg p-4 border border-gray-700/50 transition-all hover:shadow-xl hover:bg-gray-800 min-h-[188px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-500 mr-1" />
                  <span className="text-blue-500 font-semibold">{game.name}</span>
                </div>
                <span className="ml-3 text-blue-500 text-base">{game.startTime}</span>
              </div>

              <div className="flex items-center h-24">
                <div className="w-24 h-24 bg-transparent rounded-lg flex justify-center items-center p-2 shadow-md">
                  <div className="w-20 h-20 bg-gray-600 rounded-lg border border-gray-500 flex items-center justify-center">
                    <span className="text-gray-200 text-sm">Image</span>
                  </div>
                </div>

                <div className="mx-4">
                  <span className="text-xl font-bold text-yellow-400">{game.prize}</span>
                </div>

                <div className="ml-auto">
                  <button
                    className={`${
                      game.isRegistered
                        ? "bg-gradient-to-r from-blue-600 to-blue-800"
                        : game.buttonColor
                    } w-28 px-6 py-2 rounded-lg font-bold text-white shadow-md hover:brightness-110 transition-all active:scale-95 flex items-center justify-center`}
                  >
                    {game.isRegistered ? "REGISTERED" : game.entryFee}
                  </button>
                </div>
              </div>

              <div className="flex items-center mt-3 text-sm gap-7">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-1 shadow-sm"></div>
                  <span className="text-gray-200">Unlimited</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center mr-1 shadow-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-200">{game.playerCount}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-1 shadow-sm"></div>
                  <span className="text-gray-200">{game.winnerCount}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-200 text-lg">No games found for this filter.</p>
          </div>
        )}
      </div>
    </GameModeLayout>
  )
}