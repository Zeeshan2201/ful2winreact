"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function QuickMode({ onBack, gameTitle = "Chess" }) {
  const navigate = useNavigate()
  
  // Quick mode data for Chess
  const quickOptions = [
    {
      id: 1,
      name: "Bullet Match",
      prize: "₹25",
      entryFee: "₹10",
      players: "2 Players",
      playerCount: "246",
      liveCount: "128", 
      coinCost: "1 Coin",
      winners: "1 Winner",
      xp: 2,
      timeRemaining: "00m 30s",
      isQuick: true
    },
    {
      id: 2,
      name: "Lightning Game",
      prize: "₹60",
      entryFee: "₹20",
      players: "2 Players",
      playerCount: "124",
      liveCount: "62",
      coinCost: "2 Coin",
      winners: "1 Winner", 
      xp: 4,
      isQuick: true,
      timeRemaining: "00m 45s"
    },
    {
      id: 3,
      name: "Free Quick Game",
      prize: "₹10",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "320",
      liveCount: "165",
      coinCost: "0",
      winners: "1 Winner", 
      xp: 1,
      timeRemaining: "00m 20s",
      isQuick: true
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Quick"
      gameOptions={quickOptions}
      logoSrc="/chess-quick.jpg"
    />
  )
}