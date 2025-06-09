import React, { useState, useEffect } from 'react';
import HeroSection from "../components/HeroSection";
import PopularGames from "../components/PopularGames";
import GameStats from "../components/GameStats";
import SpinToWin from "../components/SpinToWin";
import BottomNav from "../components/BottomNav";
import { Wallet as WalletIcon, Bell } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useWallet } from '../context/WalletContext';

export default function HomePage() {
  const [showWallet, setShowWallet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { balance } = useWallet();

  useEffect(() => {
    // Check if user is logged in (exists in localStorage)
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      // Not logged in, redirect to login
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 overflow-hidden">
      {/* Header with wallet and notifications */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <img 
              src="/images/logo.jpg" 
              alt="ful2win" 
              className="h-10 w-10 rounded-lg mr-2" 
            />
            <span className="font-bold text-white text-lg">BoostNow</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <Bell className="h-6 w-6 text-white" />
              <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white font-bold">3</span>
            </button>

            <button 
              onClick={() => setShowWallet(!showWallet)}
              className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <WalletIcon className="h-4 w-4" />
              ₹{balance}
            </button>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="absolute right-4 top-16 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-80 z-50 backdrop-blur-md bg-opacity-90 animate-fade-in">
            <div className="p-3 border-b border-gray-700">
              <h3 className="font-bold text-white">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {[
                {id: 1, title: "New Tournament", message: "Chess championship starting tomorrow!", time: "5 mins ago", type: "event"},
                {id: 2, title: "Bonus Credited", message: "₹50 bonus added to your wallet!", time: "2 hours ago", type: "wallet"},
                {id: 3, title: "Friend Request", message: "Alex sent you a friend request", time: "Yesterday", type: "social"}
              ].map(notification => (
                <div key={notification.id} className="p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-white">{notification.title}</h4>
                    <span className="text-xs text-gray-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{notification.message}</p>
                </div>
              ))}
            </div>
            <div className="p-2 text-center">
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
            </div>
          </div>
        )}

        {/* Wallet Panel */}
        {showWallet && (
          <div className="absolute right-4 top-16 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-80 z-50 backdrop-blur-md bg-opacity-90 animate-fade-in">
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-purple-600/30 to-blue-600/30">
              <h3 className="font-bold text-white">My Wallet</h3>
              <div className="mt-2 text-3xl font-bold text-white">₹2,500</div>
              <div className="text-xs text-green-400 mt-1">+₹500 last week</div>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg transition-all">
                Add Money
              </button>
              <button className="w-full py-2.5 px-4 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all">
                Withdraw
              </button>
              <div className="text-sm text-white">
                <div className="flex justify-between py-1.5 border-b border-gray-700">
                  <span>Winnings</span>
                  <span className="font-semibold">₹1,200</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-700">
                  <span>Bonus</span>
                  <span className="font-semibold">₹500</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Deposits</span>
                  <span className="font-semibold">₹800</span>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-700 text-center">
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Transaction History</button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20 pb-20">
        <HeroSection />
        <PopularGames />
        <GameStats />
        <SpinToWin />
      </main>

      {/* Animation Style */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>

      <BottomNav />
    </div>
  );
} 