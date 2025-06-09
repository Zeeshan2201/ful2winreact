'use client';

import React from "react";
import { ChevronLeft, Info } from "lucide-react";

export default function TDM({ onBack }) {
  return (
    <div className="flex flex-col h-full min-h-screen bg-[#1e0b3b] text-white">
      <div className="p-3 flex items-center justify-between border-b border-purple-900/40 bg-[#1e0b3b]">
        <div className="flex items-center">
          <button className="text-white p-2" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Team Deathmatch (TDM)</h2>
        </div>
        <button className="p-2">
          <Info size={20} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="bg-purple-900/20 border border-purple-700/30 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-bold mb-2">Team Deathmatch - 4v4</h3>
          <p className="text-gray-300 mb-4">
            Engage in fast-paced 4v4 matches. Team up, eliminate opponents, and rack up kills to win!
          </p>
          <div className="mb-4">
            <p className="text-green-400">Entry Fee: ₹20 - ₹100</p>
            <p className="text-gray-400">Prize Pool: Up to ₹5,000</p>
          </div>
          <button className="w-full rounded-lg bg-green-500 text-white font-medium py-3 hover:brightness-110 active:scale-[0.98] transition-all">
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}