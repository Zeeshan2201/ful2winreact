"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function PrivateMode({ onBack, gameTitle = "Ludo" }) {
  const navigate = useNavigate()
  
  // Private room data for Ludo
  const privateOptions = [
    {
      id: 1,
      name: "Create Private Room",
      prize: "Custom",
      entryFee: "₹25",
      players: "2-4 Players",
      playerCount: "75",
      liveCount: "32",
      coinCost: "2.5 Coin",
      winners: "1 Winner",
      xp: 8,
      timeRemaining: "Custom"
    },
    {
      id: 2,
      name: "Premium Room",
      prize: "₹1,000",
      entryFee: "₹100",
      players: "4 Players",
      playerCount: "36",
      liveCount: "18",
      coinCost: "10 Coin",
      winners: "1 Winner",
      xp: 20,
      isQuick: true,
      timeRemaining: "Custom"
    },
    {
      id: 3,
      name: "Friend Battle",
      prize: "₹200",
      entryFee: "Free",
      players: "2-4 Players",
      playerCount: "48",
      liveCount: "24",
      winners: "1 Winner",
      xp: 5,
      timeRemaining: "Custom"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Private"
      gameOptions={privateOptions}
      logoSrc="/ludo-private.jpeg"
    />
  )
}