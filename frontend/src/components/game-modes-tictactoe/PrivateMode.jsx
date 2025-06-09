"use client"

import { useState } from "react"
import { Lock, Users } from "lucide-react"
import GameModeLayout from "./GameModeLayout"

export default function PrivateMode({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = ["All", "Registered", "Free"]

  const rooms = [
    {
      id: 1,
      name: "Create Private Room",
      image: "create",
      buttonText: "CREATE",
      buttonColor: "bg-gradient-to-r from-purple-500 to-purple-600",
      isRegistered: false,
    },
    {
      id: 2,
      name: "Join with Code",
      image: "join",
      buttonText: "JOIN",
      buttonColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      isRegistered: false,
    },
    {
      id: 3,
      name: "Friend's Room",
      image: "friends",
      description: "Join room",
      buttonText: "VIEW",
      buttonColor: "bg-gradient-to-r from-green-500 to-green-600",
      isRegistered: true,
    },
  ]

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Registered") return room.isRegistered
    if (activeFilter === "Free") return true
    return true
  })

  return (
    <GameModeLayout title="Private Room" onBack={onBack}>
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-purple-900/40 pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`relative min-w-[100px] px-4 py-2 text-lg font-medium rounded-md transition-all duration-200 text-center ${
              activeFilter === filter
                ? "text-white"
                : "text-gray-400 hover:text-gray-200 hover:bg-purple-900/30"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
            {activeFilter === filter && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 rounded-t-md" />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Room List Container */}
      <div
        className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2"
      >
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-purple-900/20 rounded-xl shadow-lg p-4 border border-purple-700/30 transition-all hover:shadow-xl hover:bg-purple-900/30 min-h-[188px]"
            >
              <div className="flex items-center mb-3">
                <Lock className="h-5 w-5 text-purple-400 mr-2" />
                <span className="text-blue-400 font-medium">{room.name}</span>
                {room.isRegistered && (
                  <span className="ml-2 text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-px rounded-md shadow-sm">
                    JOINED
                  </span>
                )}
              </div>

              <div className="flex items-center h-24">
                <div className="w-24 h-24 bg-transparent rounded-lg flex justify-center items-center p-2 shadow-md">
                  <div className="w-20 h-20 bg-purple-800/50 rounded-lg border border-purple-700/50 flex items-center justify-center">
                    <span className="text-gray-300 text-sm">Image</span>
                  </div>
                </div>

                {room.id === 1 && (
                  <div className="mx-4 flex-1">
                    <span className="text-gray-300">{room.description}</span>
                  </div>
                )}

                <div className={room.id === 1 ? "ml-auto" : "mx-4 ml-auto"}>
                  <button
                    className={`${
                      room.isRegistered
                        ? "bg-gradient-to-r from-blue-600 to-blue-800"
                        : room.buttonColor
                    } w-28 px-6 py-2 rounded-lg font-bold text-white shadow-md hover:brightness-110 transition-all active:scale-95 flex items-center justify-center`}
                  >
                    {room.isRegistered ? "ENTER" : room.buttonText}
                  </button>
                </div>
              </div>

              {room.id === 1 && (
                <div className="flex items-center mt-3 text-sm gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-1 shadow-sm"></div>
                    <span className="text-gray-200">Customizable rules</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-1 shadow-sm"></div>
                    <span className="text-gray-200">Invite friends</span>
                  </div>
                </div>
              )}

              {room.id === 2 && (
                <div className="mt-3 w-full">
                  <input
                    type="text"
                    placeholder="Enter code to join"
                    className="w-full px-4 py-2 bg-purple-900/30 text-white placeholder-gray-400 rounded-lg border border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              )}

              {room.id === 3 && (
                <div className="mt-3 w-full">
                  <span className="text-gray-300">{room.description}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-200 text-lg">No rooms found for this filter.</p>
          </div>
        )}
      </div>
    </GameModeLayout>
  )
}