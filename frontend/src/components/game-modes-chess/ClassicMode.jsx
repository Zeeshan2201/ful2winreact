"use client"
import React from "react"
import GameModeTemplate from "../GameModeTemplate"
import { useNavigate } from "react-router-dom"

export default function ClassicMode({ onBack, gameTitle = "Chess" }) {
  const navigate = useNavigate()
  
  // Game data for Chess classic mode
  const gameOptions = [
    {
      id: 1,
      name: "Blitz Match",
      prize: "₹35",
      entryFee: "₹10",
      players: "2 Players",
      playerCount: "216",
      liveCount: "98", 
      coinCost: "1 Coin",
      winners: "1 Winner",
      xp: 4,
      timeRemaining: "02m 00s"
    },
    {
      id: 2,
      name: "Rapid Game",
      prize: "₹120",
      entryFee: "₹30",
      players: "2 Players",
      playerCount: "142",
      liveCount: "68",
      coinCost: "3 Coin",
      winners: "1 Winner", 
      xp: 10,
      timeRemaining: "05m 00s"
    },
    {
      id: 3,
      name: "Free Match",
      prize: "₹20",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "358",
      liveCount: "178",
      coinCost: "0",
      winners: "1 Winner", 
      xp: 2,
      timeRemaining: "03m 00s"
    },
    {
      id: 4,
      name: "Master's Challenge",
      prize: "₹550",
      entryFee: "₹100",
      players: "2 Players",
      playerCount: "52",
      liveCount: "28",
      coinCost: "10 Coin",
      winners: "1 Winner", 
      xp: 25,
      timeRemaining: "10m 00s",
      isQuick: true
    }
  ]
  
  return (
    <GameModeTemplate
      onBack={onBack}
      gameTitle={gameTitle}
      modeType="Classic"
      gameOptions={gameOptions}
      logoSrc="/chess.jpg"
    />
  )
}
