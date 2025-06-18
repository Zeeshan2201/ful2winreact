"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function TournamentMode({ onBack, gameTitle = "FlappyBall" }) {
  const navigate = useNavigate()
  
  // Tournament data for FlappyBall
  const tournamentOptions = [
    {
      id: 1,
      name: "Daily Sky Tournament",
      prize: "₹1,200",
      entryFee: "₹40",
      players: "2 Players",
      playerCount: "198",
      liveCount: "89",
      coinCost: "4 Coin",
      winners: "3 Winners",
      xp: 15,
      startTime: "Daily 8:00 PM",
      timeRemaining: "03h 25m"
    },
    {
      id: 2,
      name: "Weekend Flappy Special",
      prize: "₹5,500",
      entryFee: "₹120",
      players: "2 Players",
      playerCount: "134",
      liveCount: "67",
      coinCost: "12 Coin",
      winners: "5 Winners",
      xp: 30,
      startTime: "Saturday, 7:00 PM",
      timeRemaining: "25h 50m"
    },
    {
      id: 3,
      name: "Free Flight Tournament",
      prize: "₹800",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "445",
      liveCount: "223",
      winners: "8 Winners",
      xp: 8,
      startTime: "Friday, 6:00 PM",
      timeRemaining: "4h 25m",
      isQuick: true
    },
    {
      id: 4,
      name: "Pro Flapper Championship",
      prize: "₹15,000",
      entryFee: "₹300",
      players: "2 Players",
      playerCount: "78",
      liveCount: "39",
      coinCost: "30 Coin",
      winners: "3 Winners",
      xp: 60,
      startTime: "Sunday, 9:00 PM",
      timeRemaining: "48h 20m"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Tournament"
      gameOptions={tournamentOptions}
      logoSrc="/flappyball.svg"
    />
  )
}
