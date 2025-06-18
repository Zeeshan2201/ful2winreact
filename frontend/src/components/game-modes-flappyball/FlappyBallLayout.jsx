"use client"

import { ChevronLeft } from "lucide-react"

export default function FlappyBallLayout({ title, children, onBack }) {
  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400">
      <div className="p-3 flex items-center border-b border-blue-700/40 bg-gradient-to-r from-blue-600 to-cyan-500">
        <button className="mr-3 text-white p-2" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      <div className="flex-grow p-4 bg-gradient-to-br from-blue-500 to-sky-400 text-white overflow-hidden">{children}</div>
    </div>
  )
}
