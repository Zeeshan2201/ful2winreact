"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function PrivateMode({ onBack, gameTitle = "StonePaper" }) {
  const navigate = useNavigate()
  
  // Private room data for Stone-Paper-Scissors
  const privateOptions = [
    {
      id: 1,
      name: "Create Private Room",
      prize: "Custom",
      entryFee: "₹5",
      players: "2 Players",
      playerCount: "82",
      liveCount: "41",
      winners: "1 Winner",
      xp: 3,
      timeRemaining: "Custom"
    },
    {
      id: 2,
      name: "Premium Room",
      prize: "₹300",
      entryFee: "₹200",
      players: "2 Players",
      playerCount: "38",
      liveCount: "19",
      winners: "1 Winner",
      xp: 10,
      timeRemaining: "Custom"
    },
    {
      id: 3,
      name: "Friend Battle",
      prize: "₹45",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "64",
      liveCount: "32",
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
      logoSrc="/stonepaper-private.jpg"
    />
  )
} 