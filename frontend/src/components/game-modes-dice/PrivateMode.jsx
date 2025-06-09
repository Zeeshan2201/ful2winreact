"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function PrivateMode({ onBack, gameTitle = "Dice" }) {
  const navigate = useNavigate()
  
  // Private room data for Dice
  const privateOptions = [
    {
      id: 1,
      name: "Create Private Room",
      prize: "Custom",
      entryFee: "₹15",
      players: "2 Players",
      playerCount: "68",
      liveCount: "32",
      winners: "1 Winner",
      xp: 6,
      timeRemaining: "Custom"
    },
    {
      id: 2,
      name: "Premium Room",
      prize: "₹600",
      entryFee: "₹300",
      players: "2 Players",
      playerCount: "24",
      liveCount: "12",
      winners: "1 Winner",
      xp: 15,
      timeRemaining: "Custom"
    },
    {
      id: 3,
      name: "Friend Battle",
      prize: "₹75",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "42",
      liveCount: "18",
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
      logoSrc="/dice-private.png"
    />
  )
} 