"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function TournamentMode({ onBack, gameTitle = "StonePaper" }) {
  const navigate = useNavigate()
  
  // Tournament data for Stone-Paper-Scissors
  const tournamentOptions = [
    {
      id: 1,
      name: "Daily Tournament",
      prize: "₹1,000",
      entryFee: "₹30",
      players: "2 Players",
      playerCount: "245",
      liveCount: "120",
      winners: "5 Winners",
      xp: 10,
      startTime: "Daily 7:30 PM",
      timeRemaining: "03h 30m"
    },
    {
      id: 2,
      name: "Weekend Special",
      prize: "₹3,500",
      entryFee: "₹80",
      players: "2 Players",
      playerCount: "186",
      liveCount: "92",
      winners: "4 Winners",
      xp: 20,
      startTime: "Saturday, 3:00 PM",
      timeRemaining: "21h 15m",
      isQuick: true
    },
    {
      id: 3,
      name: "Free Tournament",
      prize: "₹350",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "318",
      liveCount: "156",
      winners: "10 Winners",
      xp: 5,
      startTime: "Friday, 9:00 PM",
      timeRemaining: "6h 15m"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Tournament"
      gameOptions={tournamentOptions}
      logoSrc="/stonepaper-tournament-hero.jpg"
    />
  )
} 