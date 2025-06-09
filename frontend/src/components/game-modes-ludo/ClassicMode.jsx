"use client"

import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function ClassicMode({ onBack, gameTitle = "Ludo" }) {
  const navigate = useNavigate()
  
  // Game data for Ludo classic mode
  const gameOptions = [
    {
      id: 1,
      name: "2 Player Battle",
      prize: "₹25",
      entryFee: "₹10",
      players: "2 Players",
      playerCount: "438",
      liveCount: "215", 
      coinCost: "1 Coin",
      winners: "1 Winner",
      xp: 3,
      timeRemaining: "00m 45s"
    },
    {
      id: 2,
      name: "4 Player Match",
      prize: "₹100",
      entryFee: "₹25",
      players: "4 Players",
      playerCount: "256",
      liveCount: "102",
      coinCost: "2.5 Coin",
      winners: "1 Winner", 
      xp: 8,
      isQuick: true,
      timeRemaining: "01m 30s"
    },
    {
      id: 3,
      name: "Free Match",
      prize: "₹15",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "520",
      liveCount: "245",
      coinCost: "0",
      winners: "1 Winner", 
      xp: 1,
      timeRemaining: "00m 30s"
    },
    {
      id: 4,
      name: "Premium Game",
      prize: "₹500",
      entryFee: "₹100",
      players: "4 Players",
      playerCount: "86",
      liveCount: "34",
      coinCost: "10 Coin",
      winners: "1 Winner", 
      xp: 15,
      timeRemaining: "02m 00s"
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Classic"
      gameOptions={gameOptions}
      logoSrc="/ludo.jpeg"
    />
  )
}