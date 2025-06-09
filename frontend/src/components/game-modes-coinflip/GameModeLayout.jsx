"use client"

import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function GameModeLayout({ title, children, onBack, gameMode = "Classic Mode" }) {
  return (
    <div className="flex flex-col h-full min-h-screen bg-[#31036e]">
      {/* Header */}
      <div className="p-3 flex items-center justify-between bg-[#1c0146] text-white">
        <div className="flex items-center">
          <button className="mr-3 text-white p-1" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-medium">{title}</h1>
        </div>
        <div className="flex items-center">
          <div className="px-3 py-1 bg-[#1c0146] rounded-full flex items-center border border-purple-700/30">
            <span className="text-sm font-medium text-white">₹1240</span>
          </div>
        </div>
      </div>
      
      {/* Game logo */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <div className="w-14 h-14 bg-purple-800/50 rounded-lg border border-purple-700/50 flex items-center justify-center mb-1">
          <img 
            src="/coinflip.png" 
            alt="Coinflip Logo" 
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </div>
        <h2 className="text-xl text-white font-medium">Coinflip</h2>
        <p className="text-sm text-white/70">{gameMode}</p>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 bg-[#31036e] text-white overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 