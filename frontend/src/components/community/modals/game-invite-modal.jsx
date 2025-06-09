"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function GameInviteModal({ inviteUserId, gameOptions, sendGameInvite, setShowGameInvite }) {
  const [selectedGame, setSelectedGame] = useState(null)

  return (
    <div className="modal-container fade-in">
      <div className="modal-content glass slide-down">
        <div className="modal-header">
          <h3 className="font-semibold text-emerald-800">Invite to Game</h3>
          <button
            onClick={() => setShowGameInvite(false)}
            className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <label htmlFor="game" className="block text-gray-700 text-sm font-bold mb-2">
              Select Game
            </label>
            <div className="relative">
              <select
                id="game"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-300"
                value={selectedGame || ""}
                onChange={(e) => setSelectedGame(Number.parseInt(e.target.value))}
              >
                <option value="" disabled>
                  Select a game
                </option>
                {gameOptions.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={() => sendGameInvite(inviteUserId, selectedGame)}
            disabled={!inviteUserId || !selectedGame}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 btn-animated"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  )
}
