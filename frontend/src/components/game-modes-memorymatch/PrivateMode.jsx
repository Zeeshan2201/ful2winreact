"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function PrivateMode({ onBack, gameTitle = "MemoryMatch" }) {
  const navigate = useNavigate()
  
  // Private room data for MemoryMatch
  const privateOptions = [
    {
      id: 1,
      name: "Create Private Room",
      prize: "Custom",
      entryFee: "₹10",
      players: "2 Players",
      playerCount: "52",
      liveCount: "24",
      winners: "1 Winner",
      xp: 4,
      timeRemaining: "Custom"
    },
    {
      id: 2,
      name: "Premium Room",
      prize: "₹375",
      entryFee: "₹250",
      players: "2 Players",
      playerCount: "28",
      liveCount: "14",
      winners: "1 Winner",
      xp: 12,
      timeRemaining: "Custom"
    },
    {
      id: 3,
      name: "Friend Battle",
      prize: "₹60",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "44",
      liveCount: "22",
      winners: "1 Winner",
      xp: 2,
      timeRemaining: "Custom"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Private"
      gameOptions={privateOptions}
      logoSrc="/memorymatch-private.png"
    />
  )
} 