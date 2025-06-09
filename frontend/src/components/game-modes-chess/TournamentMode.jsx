"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function TournamentMode({ onBack, gameTitle = "Chess" }) {
  const navigate = useNavigate()
  
  // Tournament data for Chess
  const tournamentOptions = [
    {
      id: 1,
      name: "Daily Tournament",
      prize: "₹1,500",
      entryFee: "₹40",
      players: "2 Players",
      playerCount: "186",
      liveCount: "94",
      coinCost: "4 Coin",
      winners: "3 Winners",
      xp: 12,
      startTime: "Daily 8:00 PM",
      timeRemaining: "03h 15m"
    },
    {
      id: 2,
      name: "Weekend Special",
      prize: "₹8,000",
      entryFee: "₹80",
      players: "2 Players",
      playerCount: "142",
      liveCount: "68",
      coinCost: "8 Coin",
      winners: "5 Winners",
      xp: 25,
      startTime: "Saturday, 7:00 PM",
      timeRemaining: "25h 45m"
    },
    {
      id: 3,
      name: "Free Tournament",
      prize: "₹600",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "320",
      liveCount: "186",
      winners: "8 Winners",
      xp: 6,
      startTime: "Friday, 5:00 PM",
      timeRemaining: "3h 45m",
      isQuick: true
    },
    {
      id: 4,
      name: "Grand Master Tournament",
      prize: "₹20,000",
      entryFee: "₹400",
      players: "2 Players",
      playerCount: "86",
      liveCount: "42",
      coinCost: "40 Coin",
      winners: "3 Winners",
      xp: 45,
      startTime: "Sunday, 3:00 PM",
      timeRemaining: "49h 15m"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Tournament"
      gameOptions={tournamentOptions}
      logoSrc="/chess-tournament.jpg"
    />
  )
}