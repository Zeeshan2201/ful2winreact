"use client"

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, Clock } from 'lucide-react';
import FlappyBallLayout from './FlappyBallLayout';
import { useWallet } from '../../context/WalletContext';

export default function ClassicMode({ onBack, gameTitle = "FlappyBall" }) {
  const navigate = useNavigate();
  const { balance, deductMoney } = useWallet();
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  
  // Game data for FlappyBall classic mode precisely matching the screenshot
  const gameOptions = [
    {
      id: 1,
      name: "Quick Flight",
      prize: "₹8",
      entryFee: "₹5",
      players: "2 Players",
      playerCount: "87",
      liveCount: "32", 
      winners: "1 Winner",
      timeRemaining: "00m 30s"
    },
    {
      id: 2,
      name: "Sky Race",
      prize: "₹15",
      entryFee: "₹10",
      players: "2 Players",
      playerCount: "54",
      liveCount: "28",
      winners: "1 Winner", 
      timeRemaining: "01m 30s"
    },
    {
      id: 3,
      name: "Expert Flight",
      prize: "₹23",
      entryFee: "₹15",
      players: "2 Players",
      playerCount: "31",
      liveCount: "15",
      winners: "1 Winner", 
      timeRemaining: "02m 00s"
    }
  ];

  // Handle play button click to go directly to game lobby
  const handlePlay = (entry, winAmount) => {
    // Reset insufficient funds message
    setInsufficientFunds(false);
    
    // Extract numeric value from entry fee string (e.g., "₹5" -> 5)
    const entryFee = parseInt(entry.replace(/[^\d]/g, ''));
    
    // Check if user has enough balance
    if (balance < entryFee) {
      setInsufficientFunds(true);
      // Show insufficient funds message for 3 seconds
      setTimeout(() => setInsufficientFunds(false), 3000);
      return;
    }
    
    // Deduct money from wallet
    const deducted = deductMoney(entryFee, `FlappyBall Classic Mode Entry Fee (₹${entryFee})`);
    
    if (deducted) {
      // Store win amount in localStorage to retrieve later
      localStorage.setItem('currentGameInfo', JSON.stringify({
        entryFee: entryFee,
        winAmount: parseInt(winAmount.replace(/[^\d]/g, '')),
        gameType: 'FlappyBall',
        mode: 'Classic'
      }));
      
      // Navigate to the game lobby with the proper parameters
      navigate(`/games/flappyball/play/classic?price=${entryFee}`);
    }
  };

  return (
    <FlappyBallLayout title="FlappyBall Classic" onBack={onBack}>
      {/* Display wallet balance */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-3 mb-4 flex justify-between items-center">
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
        {gameOptions.map((option) => (
          <div 
            key={option.id}
            className="bg-white rounded-lg p-4 shadow-md"
          >
            <div className="flex justify-between mb-2">
              <div className="text-gray-800">{option.players}</div>
              <div className="flex items-center text-amber-600">
                <Trophy size={16} className="mr-1" />
                <span>{option.winners}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-xl font-bold text-gray-800">Win {option.prize}</div>
              <button 
                onClick={() => handlePlay(option.entryFee, option.prize)}
                className={`${balance < parseInt(option.entryFee.replace(/[^\d]/g, '')) 
                  ? 'bg-gray-400' 
                  : 'bg-green-500'} text-white px-4 py-1 rounded-full font-medium`}
                disabled={balance < parseInt(option.entryFee.replace(/[^\d]/g, ''))}
              >
                Play {option.entryFee}
              </button>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center">
                <Users size={12} className="mr-1" />
                <span>{option.playerCount} playing</span>
              </div>
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{option.timeRemaining}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </FlappyBallLayout>
  );
}
