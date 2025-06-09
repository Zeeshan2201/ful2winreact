"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function TournamentMode({ onBack, gameTitle = "Ludo" }) {
  const navigate = useNavigate()
  
  // Tournament data for Ludo
  const tournamentOptions = [
    {
      id: 1,
      name: "Daily Tournament",
      prize: "₹2,000",
      entryFee: "₹50",
      players: "4 Players",
      playerCount: "324",
      liveCount: "162",
      coinCost: "5 Coin",
      winners: "3 Winners",
      xp: 15,
      startTime: "Daily 7:00 PM",
      timeRemaining: "02h 45m"
    },
    {
      id: 2,
      name: "Weekend Special",
      prize: "₹10,000",
      entryFee: "₹100",
      players: "4 Players",
      playerCount: "256",
      liveCount: "128",
      coinCost: "10 Coin",
      winners: "5 Winners",
      xp: 30,
      startTime: "Saturday, 8:00 PM",
      timeRemaining: "26h 15m"
    },
    {
      id: 3,
      name: "Free Tournament",
      prize: "₹800",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "620",
      liveCount: "320",
      winners: "10 Winners",
      xp: 8,
      startTime: "Friday, 6:00 PM",
      timeRemaining: "4h 15m",
      isQuick: true
    },
    {
      id: 4,
      name: "Premium Tournament",
      prize: "₹25,000",
      entryFee: "₹500",
      players: "4 Players",
      playerCount: "156",
      liveCount: "78",
      coinCost: "50 Coin",
      winners: "3 Winners",
      xp: 50,
      startTime: "Sunday, 4:00 PM",
      timeRemaining: "50h 30m"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Tournament"
      gameOptions={tournamentOptions}
      logoSrc="/ludo-tournament.jpeg"
    />
  )
} 