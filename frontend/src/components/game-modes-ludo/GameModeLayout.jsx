"use client"

import { ChevronLeft } from "lucide-react"

export default function GameModeLayout({ title, children, onBack }) {
  return (
    <div className="flex flex-col h-full min-h-screen bg-[#1e0b3b]">
      <div className="p-3 flex items-center border-b border-purple-900/40 bg-[#1e0b3b]">
        <button className="mr-3 text-white p-2" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      <div className="flex-grow p-4 bg-[#1e0b3b] text-white">{children}</div>
    </div>
  )
}