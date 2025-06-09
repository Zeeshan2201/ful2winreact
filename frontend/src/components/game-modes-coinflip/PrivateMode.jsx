"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function PrivateMode({ onBack, gameTitle = "CoinFlip" }) {
  const navigate = useNavigate()
  
  // Private room data
  const privateOptions = [
    {
      id: 1,
      name: "Create Private Room",
      prize: "Custom",
      entryFee: "₹10",
      players: "2 Players",
      playerCount: "58",
      liveCount: "12",
      coinCost: "1 Coin",
      winners: "1 Winner",
      xp: 5,
      timeRemaining: "Custom"
    },
    {
      id: 2,
      name: "Premium Room",
      prize: "₹500",
      entryFee: "₹50",
      players: "2 Players",
      playerCount: "22",
      liveCount: "8",
      coinCost: "5 Coin",
      winners: "1 Winner",
      xp: 15,
      isQuick: true,
      timeRemaining: "Custom"
    },
    {
      id: 3,
      name: "Friend Battle",
      prize: "₹100",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "34",
      liveCount: "14",
      winners: "1 Winner",
      xp: 3,
      timeRemaining: "Custom"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Private"
      gameOptions={privateOptions}
      logoSrc="/coinflip-private.png"
    />
  )
} 