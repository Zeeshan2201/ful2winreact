"use client"

import React, { useState, useEffect } from "react"
import { X, Star, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function GameDashboard({
    link,
    gameTitle,
    gameImage,
    gameCategory = "Board",
    rating = "4.8",
    playersCount = "4 playing",
    entryFees = {
        classic: "₹10 - ₹50",
        quick: "₹5 - ₹25",
        tournament: "₹20 - ₹100",
        private: "Custom",
    },
    onClose,
}) {
    const [currentView, setCurrentView] = useState("main")
    const [showDashboard, setShowDashboard] = useState(true)
    const navigate = useNavigate()
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        const storedBalance = localStorage.getItem('walletBalance');
        console.log('Stored wallet balance from localStorage:', storedBalance);
        if (storedBalance !== null) {
            const balance = parseInt(storedBalance, 10);
            if (!isNaN(balance)) {
                setWalletBalance(balance);
                console.log('Wallet balance set to:', balance);
            } else {
                console.log('Stored wallet balance is not a valid number.', storedBalance);
            }
        } else {
            console.log('Wallet balance not found in localStorage.');
        }
    }, []);

    const handleClose = () => {
        console.log("Dashboard closed")
        setShowDashboard(false)
        navigate("/games")
        if (onClose) onClose()
    }

    // Ensure entryFees has all required keys to avoid undefined errors
    const safeEntryFees = {
        classic: entryFees.classic || "₹10 - ₹50",
        tournament: entryFees.tournament || "₹20 - ₹100",
    }
    
    // Check if game is in action category
    const isActionGame = gameCategory === "Action";

    // Get game path for redirecting to the actual game page
    const getGamePath = () => {
        if (!gameTitle) return "/games";
        
        // Convert gameTitle to match route pattern
        const gamePath = gameTitle.toLowerCase();
        return `/games/${gamePath}/play`;
    };

    const renderView = () => {
        switch (currentView) {
            case "classicMode":
                navigate(`/games/${gameTitle.toLowerCase()}/select/classic`);
                return null;
            case "tournament":
                navigate(`/games/${gameTitle.toLowerCase()}/select/tournament`);
                return null;
            case "privateRoom":
                navigate(`/games/${gameTitle.toLowerCase()}/select/private`);
                return null;
            case "playNow":
                navigate(getGamePath())
                return null
            case "practice":
                navigate(getGamePath())
                return null
            default:
                return (
                    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={gameImage || "/placeholder.svg"}
                                alt={`${gameTitle || "Game"} Background`}
                                className="w-full h-full object-cover opacity-100 blur-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-transparent" />
                        </div>

                        {/* Foreground Content */}
                        <div className="relative z-10 flex flex-col min-h-screen px-4">
                            {/* Header with Balance and Close Button */}
                            <div className="absolute top-4 right-4 flex items-center">
                                <div className="mr-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-white font-medium">
                                    Balance: ₹{walletBalance}
                                </div>
                                <button
                                    className="text-white hover:text-red-500 transition rounded-full p-2 bg-gray-800/50"
                                    onClick={handleClose}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Back Button */}
                            <div className="absolute top-4 left-4">
                                <button
                                    className="text-white hover:text-blue-400 transition rounded-full p-2 bg-gray-800/50"
                                    onClick={handleClose}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                </button>
                            </div>

                            {/* Spacer to push content down slightly */}
                            <div className="flex-grow" />

                            {/* Game Title Section */}
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 mx-auto rounded-full bg-purple-500 overflow-hidden shadow-lg mb-3 border-2 border-white/20">
                                    <img
                                        src={gameImage || "/placeholder.svg"}
                                        alt={`${gameTitle || "Game"} Logo`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent pointer-events-none"></div>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight">{gameTitle || "Game Dashboard"}</h1>
                                <div className="flex justify-center gap-2 text-base text-gray-300 mt-1">
                                    <span>{gameCategory}</span>
                                    <span>•</span>
                                    <span className="text-green-400 flex items-center">
                                        {rating} <Star size={16} fill="currentColor" className="ml-1" />
                                    </span>
                                    <span>•</span>
                                    <span className="text-base">{playersCount}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 w-full max-w-md mx-auto mb-5">
                                <button
                                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg hover:brightness-110 transition-all active:scale-95"
                                    onClick={(e) => {
                                        // Do nothing - disabled button
                                        e.preventDefault();
                                    }}
                                >
                                    Play Now
                                </button>
                                <button
                                    className="flex-1 py-3 rounded-lg border border-blue-500 text-blue-400 font-medium bg-blue-500/10 shadow-lg hover:bg-blue-500/20 transition-all active:scale-95"
                                    onClick={() => navigate(getGamePath())}
                                >
                                    Practice
                                </button>
                            </div>

                            {/* Game Modes Section */}
                            <div className="w-full max-w-md mx-auto mb-6">
                                <h2 className="text-xl font-bold mb-3 text-white text-left tracking-tight">Game Modes</h2>
                                <div className="flex flex-col gap-3">
                                    {/* Classic Mode - Show for all games */}
                                    <div
                                        className="bg-gray-800/50 rounded-xl shadow-lg p-3 border border-gray-700/50 transition-all hover:shadow-xl hover:bg-gray-800 cursor-pointer"
                                        onClick={() => navigate(`/games/${gameTitle.toLowerCase()}/select/classic`)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-blue-400 font-medium text-lg">Classic Mode</span>
                                                <p className="text-gray-300 text-sm">Play with 2-4 players</p>
                                            </div>
                                            <button
                                                className="w-28 h-[48px] bg-[#009E60] px-2 py-0.5 rounded-lg font-bold text-white shadow-md hover:brightness-110 transition-all active:scale-95"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(`/games/${gameTitle.toLowerCase()}/select/classic`)
                                                }}
                                            >
                                                <div className="flex flex-col items-center justify-center gap-0 h-full">
                                                    <span className="text-white text-sm">Entry</span>
                                                    <span className="text-white text-sm">{safeEntryFees.classic}</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Mode - Only show for Action games */}
                                    {isActionGame && (
                                        <div
                                            className="bg-gray-800/50 rounded-xl shadow-lg p-3 border border-gray-700/50 transition-all hover:shadow-xl hover:bg-gray-800 cursor-pointer"
                                            onClick={() => navigate(`/games/${gameTitle.toLowerCase()}/select/quick`)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-blue-400 font-medium text-lg">Quick Mode</span>
                                                    <p className="text-gray-300 text-sm">Faster gameplay</p>
                                                </div>
                                                <button
                                                    className="w-28 h-[48px] bg-[#009E60] px-2 py-0.5 rounded-lg font-bold text-white shadow-md hover:brightness-110 transition-all active:scale-95"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        navigate(`/games/${gameTitle.toLowerCase()}/select/quick`)
                                                    }}
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-0 h-full">
                                                        <span className="text-white text-sm">Entry</span>
                                                        <span className="text-white text-sm">{entryFees.quick}</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tournament Mode - Show for all games */}
                                    <div
                                        className="bg-gray-800/50 rounded-xl shadow-lg p-3 border border-gray-700/50 transition-all hover:shadow-xl hover:bg-gray-800 cursor-pointer"
                                        onClick={() => navigate(`/games/${gameTitle.toLowerCase()}/select/tournament`)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-blue-400 font-medium text-lg">Tournament</span>
                                                <p className="text-gray-300 text-sm">Compete for big prizes</p>
                                            </div>
                                            <button
                                                className="w-28 h-[48px] bg-[#009E60] px-2 py-0.5 rounded-lg font-bold text-white shadow-md hover:brightness-110 transition-all active:scale-95"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(`/games/${gameTitle.toLowerCase()}/select/tournament`)
                                                }}
                                            >
                                                <div className="flex flex-col items-center justify-center gap-0 h-full">
                                                    <span className="text-white text-sm">Entry</span>
                                                    <span className="text-white text-sm">{safeEntryFees.tournament}</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Private Room - Changed to "Coming Soon" for non-Action games */}
                                    {isActionGame ? (
                                        <div
                                            className="bg-gray-800/50 rounded-xl shadow-lg p-3 border border-gray-700/50 transition-all hover:shadow-xl hover:bg-gray-800 cursor-pointer"
                                            onClick={() => navigate(`/games/${gameTitle.toLowerCase()}/select/private`)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-blue-400 font-medium text-lg">Private Room</span>
                                                    <p className="text-gray-300 text-sm">Invite your friends</p>
                                                </div>
                                                <button
                                                    className="w-28 h-[48px] bg-[#009E60] px-2 py-0.5 rounded-lg font-bold text-white shadow-md hover:brightness-110 transition-all active:scale-95"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        navigate(`/games/${gameTitle.toLowerCase()}/select/private`)
                                                    }}
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-0 h-full">
                                                        <span className="text-white text-sm">Entry</span>
                                                        <span className="text-white text-sm">{entryFees.private}</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-800/50 rounded-xl shadow-lg p-3 border border-gray-700/50 relative">
                                            <div className="flex items-start justify-between opacity-60">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-blue-400 font-medium text-lg">Private Room</span>
                                                    <p className="text-gray-300 text-sm">Invite your friends</p>
                                                </div>
                                                <div className="w-28 h-[48px] bg-gray-700 rounded-lg flex items-center justify-center">
                                                    <Clock size={20} className="text-yellow-300 mr-1" />
                                                </div>
                                            </div>
                                            {/* Coming Soon Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-yellow-500/80 text-black font-bold py-1 px-4 rounded-full transform rotate-12 text-sm">
                                                    Coming Soon
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Spacer to ensure content doesn't touch the bottom */}
                            <div className="flex-grow" />
                        </div>
                    </div>
                )
        }
    }

    return showDashboard ? <div className="fixed inset-0 w-full h-screen overflow-hidden">{renderView()}</div> : null
}