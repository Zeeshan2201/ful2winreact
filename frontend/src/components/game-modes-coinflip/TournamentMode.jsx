"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function TournamentMode({ onBack, gameTitle = "CoinFlip" }) {
  const navigate = useNavigate()
  
  // Tournament data
  const tournamentOptions = [
    {
      id: 1,
      name: "Daily Tournament",
      prize: "₹1,000",
      entryFee: "₹50",
      players: "2 Players",
      playerCount: "184",
      liveCount: "86",
      coinCost: "5 Coin",
      winners: "1 Winner",
      xp: 12,
      startTime: "Daily 6:00 PM",
      timeRemaining: "02h 15m"
    },
    {
      id: 2,
      name: "Weekend Special",
      prize: "₹3,000",
      entryFee: "₹100",
      players: "2 Players",
      playerCount: "156",
      liveCount: "42",
      coinCost: "10 Coin",
      winners: "3 Winners",
      xp: 20,
      startTime: "Sunday, 5:00 PM",
      timeRemaining: "24h 30m"
    },
    {
      id: 3,
      name: "Free Tournament",
      prize: "₹500",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "350",
      liveCount: "120",
      winners: "2 Winners",
      xp: 8,
      startTime: "Saturday, 2:00 PM",
      isQuick: true
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Tournament"
      gameOptions={tournamentOptions}
      logoSrc="/coinflip-tournament.png"
    />
  )
} 