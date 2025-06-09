"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function QuickMode({ onBack, gameTitle = "Ludo" }) {
  const navigate = useNavigate()
  
  // Quick mode data for Ludo
  const quickOptions = [
    {
      id: 1,
      name: "Quick Match",
      prize: "₹30",
      entryFee: "₹10",
      players: "2 Players",
      playerCount: "380",
      liveCount: "195", 
      coinCost: "1 Coin",
      winners: "1 Winner",
      xp: 2,
      timeRemaining: "00m 20s",
      isQuick: true
    },
    {
      id: 2,
      name: "Blitz Game",
      prize: "₹75",
      entryFee: "₹25",
      players: "2 Players",
      playerCount: "156",
      liveCount: "82",
      coinCost: "2.5 Coin",
      winners: "1 Winner", 
      xp: 5,
      isQuick: true,
      timeRemaining: "00m 30s"
    },
    {
      id: 3,
      name: "Free Quick Game",
      prize: "₹15",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "420",
      liveCount: "215",
      coinCost: "0",
      winners: "1 Winner", 
      xp: 1,
      timeRemaining: "00m 15s",
      isQuick: true
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Quick"
      gameOptions={quickOptions}
      logoSrc="/ludo-quick.jpeg"
    />
  )
}