"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, Users, Clock } from 'lucide-react'
import MemoryMatchLayout from './MemoryMatchLayout'

export default function TournamentMode({ onBack }) {
  const navigate = useNavigate()
  
  // Tournament options with higher stakes
  const tournamentOptions = [
    {
      id: 1,
      players: "4 Players",
      winner: "1 Winner",
      winAmount: "Best of 5",
      entryFee: "₹50",
      playersCount: "16 playing",
      timeLimit: "10m 00s",
      matches: 5
    },
    {
      id: 2,
      players: "8 Players",
      winner: "1 Winner",
      winAmount: "Best of 7",
      entryFee: "₹100",
      playersCount: "24 playing",
      timeLimit: "15m 00s",
      matches: 7
    },
    {
      id: 3,
      players: "16 Players",
      winner: "1 Winner",
      winAmount: "Best of 9",
      entryFee: "₹200",
      playersCount: "48 playing",
      timeLimit: "25m 00s",
      matches: 9
    }
  ]

  // Handle play button click to go directly to game lobby in tournament mode
  const handlePlay = (tournament) => {
    // Extract numeric value from entry fee string (e.g., "₹50" -> 50)
    const entryFee = parseInt(tournament.entryFee.replace(/[^\d]/g, ''))
    const matches = tournament.matches
    
    // Navigate to tournament mode with proper parameters
    navigate(`/games/memorymatch/play/tournament?price=${entryFee}&matches=${matches}`)
  }

  return (
    <MemoryMatchLayout title="Tournament Mode" onBack={onBack}>
      <div className="mb-4">
        <div className="bg-purple-800/20 rounded-lg p-3 border border-purple-500/30">
          <h3 className="text-center text-lg text-white mb-2">Tournament Rules</h3>
          <ul className="text-sm text-white/80 space-y-1 list-disc pl-5">
            <li>Pay once to enter the tournament</li>
            <li>Play multiple matches against different opponents</li>
            <li>Winner gets all prize pool at the end</li>
          </ul>
        </div>
      </div>
      
      <div className="space-y-4">
        {tournamentOptions.map((option) => (
          <div 
            key={option.id}
            className="bg-white rounded-lg p-4 shadow-md"
          >
            <div className="flex justify-between mb-2">
              <div className="text-gray-800">{option.players}</div>
              <div className="flex items-center text-amber-600">
                <Trophy size={16} className="mr-1" />
                <span>{option.winner}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-xl font-bold text-gray-800">
                <span className="text-purple-600">{option.winAmount}</span>
              </div>
              <button 
                onClick={() => handlePlay(option)}
                className="bg-purple-600 text-white px-4 py-1 rounded-full font-medium hover:bg-purple-700"
              >
                Enter {option.entryFee}
              </button>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center">
                <Users size={12} className="mr-1" />
                <span>{option.playersCount}</span>
              </div>
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{option.timeLimit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MemoryMatchLayout>
  )
} 