"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function TournamentMode({ onBack, gameTitle = "Dice" }) {
  const navigate = useNavigate()
  
  // Tournament data for Dice with enhanced prize pools
  const tournamentOptions = [
    {
      id: 1,
      name: "Daily Tournament",
      prize: "₹10,000",
      prizePool: "₹10,000",
      entryFee: "₹50",
      players: "2 Players",
      playerCount: "186",
      liveCount: "92",
      winners: "5 Winners",
      startTime: "Daily 9:00 PM",
      timeRemaining: "03h 30m"
    },
    {
      id: 2,
      name: "Weekend Special",
      prize: "₹25,000",
      prizePool: "₹25,000",
      entryFee: "₹100",
      players: "2 Players",
      playerCount: "124",
      liveCount: "68",
      winners: "10 Winners",
      startTime: "Saturday, 8:00 PM",
      timeRemaining: "24h 15m",
      isQuick: true
    },
    {
      id: 3,
      name: "Free Tournament",
      prize: "₹5,000",
      prizePool: "₹5,000",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "280",
      liveCount: "145",
      winners: "10 Winners",
      startTime: "Friday, 7:00 PM",
      timeRemaining: "5h 45m"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Tournament"
      gameOptions={tournamentOptions}
      logoSrc="/images/games/dice-logo.jpg"
    />
  )
} 