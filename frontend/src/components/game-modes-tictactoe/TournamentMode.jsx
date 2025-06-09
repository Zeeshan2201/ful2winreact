"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, Users, Clock, Calendar } from 'lucide-react';
import GameModeLayout from './GameModeLayout';
import { useWallet } from '../../context/WalletContext';

export default function TournamentMode({ onBack, gameTitle = "TicTacToe" }) {
  const navigate = useNavigate();
  const { balance, deductMoney } = useWallet();
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  
  // Tournament data
  const tournamentOptions = [
    {
      id: 1,
      name: "Daily Battle",
      prize: "₹500",
      entryFee: "₹25",
      players: "2 Players",
      playerCount: "236",
      liveCount: "98",
      winners: "3 Winners",
      startTime: "Daily 8:00 PM",
      timeRemaining: "03h 45m"
    },
    {
      id: 2,
      name: "Weekend Special",
      prize: "₹2,500",
      entryFee: "₹100",
      players: "2 Players",
      playerCount: "152",
      liveCount: "65",
      winners: "2 Winners",
      startTime: "Saturday, 8:00 PM",
      timeRemaining: "28h 15m",
      isQuick: true
    },
    {
      id: 3,
      name: "Free Tournament",
      prize: "₹300",
      entryFee: "Free",
      players: "2 Players",
      playerCount: "450",
      liveCount: "220",
      winners: "5 Winners",
      startTime: "Friday, 7:00 PM",
      timeRemaining: "4h 30m"
    }
  ];
  
  // Handle play button click to go directly to game lobby
  const handlePlay = (entry, winAmount, tournamentName) => {
    // Reset insufficient funds message
    setInsufficientFunds(false);
    
    // Handle free tournaments
    if (entry === "Free") {
      localStorage.setItem('currentGameInfo', JSON.stringify({
        entryFee: 0,
        winAmount: parseInt(winAmount.replace(/[^\d,]/g, '').replace(',', '')),
        gameType: 'TicTacToe',
        mode: 'Tournament',
        tournamentName: tournamentName
      }));
      
      // Navigate to the tournament lobby
      navigate(`/games/tictactoe/play/tournament?price=0&name=${encodeURIComponent(tournamentName)}`);
      return;
    }
    
    // Extract numeric value from entry fee string (e.g., "₹25" -> 25)
    const entryFee = parseInt(entry.replace(/[^\d]/g, ''));
    
    // Check if user has enough balance
    if (balance < entryFee) {
      setInsufficientFunds(true);
      // Show insufficient funds message for 3 seconds
      setTimeout(() => setInsufficientFunds(false), 3000);
      return;
    }
    
    // Deduct money from wallet
    const deducted = deductMoney(entryFee, `TicTacToe Tournament Entry Fee: ${tournamentName} (₹${entryFee})`);
    
    if (deducted) {
      // Store tournament info in localStorage to retrieve later
      localStorage.setItem('currentGameInfo', JSON.stringify({
        entryFee: entryFee,
        winAmount: parseInt(winAmount.replace(/[^\d,]/g, '').replace(',', '')),
        gameType: 'TicTacToe',
        mode: 'Tournament',
        tournamentName: tournamentName
      }));
      
      // Navigate to the tournament lobby with the proper parameters
      navigate(`/games/tictactoe/play/tournament?price=${entryFee}&name=${encodeURIComponent(tournamentName)}`);
    }
  };

  return (
    <GameModeLayout title={`${gameTitle} Tournament`} onBack={onBack}>
      {/* Display wallet balance */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 mb-4 flex justify-between items-center">
        <span className="text-sm text-white/80">Your Balance:</span>
        <span className="text-white font-bold">₹{balance.toFixed(2)}</span>
      </div>
      
      {/* Insufficient funds message */}
      {insufficientFunds && (
        <div className="bg-red-500/80 text-white rounded-lg p-3 mb-4 text-center text-sm">
          Insufficient balance. Please add money to your wallet.
        </div>
      )}
      
      <div className="space-y-4">
        {tournamentOptions.map((option) => (
          <div 
            key={option.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md border border-amber-500/20"
          >
            <div className="flex justify-between mb-2">
              <div className="text-amber-400 font-medium">{option.name}</div>
              {option.isQuick && (
                <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">QUICK</div>
              )}
            </div>
            
            <div className="flex justify-between mb-2">
              <div className="text-white/90">{option.players}</div>
              <div className="flex items-center text-amber-400">
                <Trophy size={16} className="mr-1" />
                <span>{option.winners}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-xl font-bold text-white">Prize {option.prize}</div>
              <button 
                onClick={() => handlePlay(option.entryFee, option.prize, option.name)}
                className={`${option.entryFee !== "Free" && balance < parseInt(option.entryFee.replace(/[^\d]/g, '')) 
                  ? 'bg-gray-600/50' 
                  : 'bg-amber-500'} text-white px-4 py-1 rounded-full font-medium`}
                disabled={option.entryFee !== "Free" && balance < parseInt(option.entryFee.replace(/[^\d]/g, ''))}
              >
                {option.entryFee === "Free" ? "Join Free" : `Join ${option.entryFee}`}
              </button>
            </div>
            
            <div className="flex justify-between items-center text-xs text-white/60">
              <div className="flex items-center">
                <Users size={12} className="mr-1" />
                <span>{option.liveCount} joined</span>
              </div>
              <div className="flex items-center">
                <Calendar size={12} className="mr-1" />
                <span>{option.startTime}</span>
              </div>
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{option.timeRemaining}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GameModeLayout>
  );
}