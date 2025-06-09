"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function PrivateMode({ onBack, gameTitle = "Chess" }) {
  const navigate = useNavigate()
  
  // Private room data for Chess
  const privateOptions = [
    {
      id: 1,
      name: "Create Private Room",
      prize: "Custom",
      entryFee: "₹15",
      players: "2 Players",
      playerCount: "62",
      liveCount: "28",
      coinCost: "1.5 Coin",
      winners: "1 Winner",
      xp: 6,
      timeRemaining: "Custom"
    },
    {
      id: 2,
      name: "Premium Room",
      prize: "₹750",
      entryFee: "₹75",
      players: "2 Players",
      playerCount: "42",
      liveCount: "22",
      coinCost: "7.5 Coin",
      winners: "1 Winner",
      xp: 18,
      isQuick: true,
      timeRemaining: "Custom"
    },
    {
      id: 3,
      name: "Friend Battle",
      prize: "₹150",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "56",
      liveCount: "32",
      winners: "1 Winner",
      xp: 4,
      timeRemaining: "Custom"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Private"
      gameOptions={privateOptions}
      logoSrc="/chess-private.jpg"
    />
  )
}