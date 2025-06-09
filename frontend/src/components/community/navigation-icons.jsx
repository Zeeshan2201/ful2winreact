"use client"

import { Award, Calendar, Coins, Home, MessageSquare, Settings, Users } from "lucide-react"
import { useEffect, useRef } from "react"

export default function NavigationIcons({ activeSection, setActiveSection, setShowUserList, showUserList }) {
  const navContainerRef = useRef(null)

  useEffect(() => {
    // Ensure the container scrolls to the leftmost position on mount
    if (navContainerRef.current) {
      navContainerRef.current.scrollLeft = 0
    }
  }, [])

  return (
    <div
      className="w-full  flex justify-center overflow-x-auto nav-container rounded-xl "
      ref={navContainerRef}
    >
      <div className="flex space-x-3.5 sm:space-x-1 rounded-b-md rounded-t-none bg-gradient-to-b from-white to-gray-50 p-1.5 sm:p-2 px-4 sm:px-2 pr-3 sm:pr-2 shadow-xl">
        <style jsx>{`
          /* Standardize scrollbar */
          .nav-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
            scroll-behavior: smooth; /* Smooth scrolling */
            scroll-snap-type: x proximity; /* Snap scrolling */
            overscroll-behavior-x: contain; /* Prevent over-scrolling on iOS */
            padding-left: 8rem; /* Respect safe area on iOS */
            padding-right: 2rem; /* Respect safe area on iOS */
          }
          
          .nav-container::-webkit-scrollbar {
            height: 5px; /* Thicker scrollbar */
          }
          
          .nav-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05); /* Subtle track */
            border-radius: 10px;
          }
          
          .nav-container::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #6366f1, #a855f7); /* Gradient thumb */
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          
          .nav-container::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, #4f46e5, #9333ea);
          }

          /* Pulse animation for active icons */
          @keyframes iconPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
          
          .icon-pulse {
            animation: iconPulse 1.5s infinite;
          }

          /* Glow effects for active icons */
          .icon-glow-home {
            filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));
          }
          .icon-glow-coins {
            filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.8));
          }
          .icon-glow-followers {
            filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.8));
          }
          .icon-glow-achievements {
            filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.8));
          }
          .icon-glow-messages {
            filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.8));
          }
          .icon-glow-events {
            filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.8));
          }
          .icon-glow-users {
            filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.8));
          }
          .icon-glow-settings {
            filter: drop-shadow(0 0 10px rgba(107, 114, 128, 0.8));
          }

          /* Subtle gradient background for active icons */
          .icon-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .icon-wrapper::before {
            content: '';
            position: absolute;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .icon-wrapper.active::before {
            opacity: 0.3;
          }
          .icon-wrapper-home.active::before {
            background: radial-gradient(circle, rgba(59, 130, 246, 0.5), transparent);
          }
          .icon-wrapper-coins.active::before {
            background: radial-gradient(circle, rgba(234, 179, 8, 0.5), transparent);
          }
          .icon-wrapper-followers.active::before {
            background: radial-gradient(circle, rgba(6, 182, 212, 0.5), transparent);
          }
          .icon-wrapper-achievements.active::before {
            background: radial-gradient(circle, rgba(16, 185, 129, 0.5), transparent);
          }
          .icon-wrapper-messages.active::before {
            background: radial-gradient(circle, rgba(244, 114, 182, 0.5), transparent);
          }
          .icon-wrapper-events.active::before {
            background: radial-gradient(circle, rgba(249, 115, 22, 0.5), transparent);
          }
          .icon-wrapper-users.active::before {
            background: radial-gradient(circle, rgba(244, 114, 182, 0.5), transparent);
          }
          .icon-wrapper-settings.active::before {
            background: radial-gradient(circle, rgba(107, 114, 128, 0.5), transparent);
          }

          /* Scroll snap for navigation items */
          .nav-item {
            scroll-snap-align: center;
          }
          .nav-item-first {
            scroll-snap-align: start; /* Ensure the first item (Home) aligns to the left edge */
          }
        `}</style>

        <button
          onClick={() => setActiveSection("home")}
          className={`nav-item nav-item-first p-3  rounded-xl w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center transition-all duration-300 ${
            activeSection === "home"
              ? "bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-md transform scale-110"
              : "text-gray-500 hover:bg-gray-200 hover:text-blue-600"
          }`}
          title="Home"
          aria-label="Navigate to Home section"
        >
          <div
            className={`icon-wrapper icon-wrapper-home ${
              activeSection === "home" ? "active" : ""
            }`}
          >
            <Home
              size={20}
              className={`sm:size-18 transition-transform duration-300 ${
                activeSection === "home"
                  ? "scale-120 icon-pulse icon-glow-home"
                  : ""
              }`}
            />
          </div>
          <span
            className={`text-xs mt-1 font-light ${
              activeSection !== "home" ? "opacity-70" : ""
            }`}
          >
            Home
          </span>
        </button>

        <button
          onClick={() => setActiveSection("topCoins")}
          className={`nav-item p-3 sm:p-2 rounded-xl w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center transition-all duration-300 ${
            activeSection === "topCoins"
              ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md transform scale-110"
              : "text-gray-500 hover:bg-yellow-100 hover:text-yellow-600"
          }`}
          title="Top Coins"
          aria-label="Navigate to Top Coins section"
        >
          <div
            className={`icon-wrapper icon-wrapper-coins ${
              activeSection === "topCoins" ? "active" : ""
            }`}
          >
            <Coins
              size={20}
              className={`sm:size-18 transition-transform duration-300 ${
                activeSection === "topCoins"
                  ? "scale-120 icon-pulse icon-glow-coins"
                  : ""
              }`}
            />
          </div>
          <span
            className={`text-xs mt-1 font-light ${
              activeSection !== "topCoins" ? "opacity-70" : ""
            }`}
          >
            Coins
          </span>
        </button>

        <button
          onClick={() => setActiveSection("topFollowers")}
          className={`nav-item p-3 sm:p-2 rounded-md w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center transition-all duration-300 ${
            activeSection === "topFollowers"
              ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md transform scale-110"
              : "text-gray-500 hover:bg-blue-100 hover:text-blue-600"
          }`}
          title="Top Followers"
          aria-label="Navigate to Top Followers section"
        >
          <div
            className={`icon-wrapper icon-wrapper-followers ${
              activeSection === "topFollowers" ? "active" : ""
            }`}
          >
            <Users
              size={20}
              className={`sm:size-18 transition-transform duration-300  ${
                activeSection === "topFollowers"
                  ? "scale-120 icon-pulse icon-glow-followers"
                  : ""
              }`}
            />
          </div>
          <span
            className={`text-xs mt-1 font-light ${
              activeSection !== "topFollowers" ? "opacity-70" : ""
            }`}
          >
            Followers
          </span>
        </button>

        {/* <button
          onClick={() => setActiveSection("achievements")}
          className={`nav-item p-3 sm:p-2 rounded-xl w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center transition-all duration-300 ${
            activeSection === "achievements"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md transform scale-110"
              : "text-gray-500 hover:bg-green-100 hover:text-green-600"
          }`}
          title="Achievements"
          aria-label="Navigate to Achievements section"
        >
          <div
            className={`icon-wrapper icon-wrapper-achievements ${
              activeSection === "achievements" ? "active" : ""
            }`}
          >
            <Award
              size={20}
              className={`sm:size-18 transition-transform duration-300 ${
                activeSection === "achievements"
                  ? "scale-120 icon-pulse icon-glow-achievements"
                  : ""
              }`}
            />
          </div>
          <span
            className={`text-xs mt-1 font-light ${
              activeSection !== "achievements" ? "opacity-70" : ""
            }`}
          >
            Awards
          </span>
        </button> */}

        <button
          onClick={() => {
            setShowUserList(false)
            setActiveSection("messages")
          }}
          className={`nav-item p-3 sm:p-2 rounded-xl w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center transition-all duration-300 ${
            activeSection === "messages"
              ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md transform scale-110"
              : "text-gray-500 hover:bg-pink-100 hover:text-pink-600"
          }`}
          title="Messages"
          aria-label="Navigate to Messages section"
        >
          <div
            className={`icon-wrapper icon-wrapper-messages ${
              activeSection === "messages" ? "active" : ""
            }`}
          >
            <MessageSquare
              size={20}
              className={`sm:size-18 transition-transform duration-300 ${
                activeSection === "messages"
                  ? "scale-120 icon-pulse icon-glow-messages"
                  : ""
              }`}
            />
          </div>
          <span
            className={`text-xs mt-1 font-light ${
              activeSection !== "messages" ? "opacity-70" : ""
            }`}
          >
            Chat
          </span>
        </button>

        <button
          onClick={() => {
            setShowUserList(false)
            setActiveSection("events")
          }}
          className={`nav-item p-3 sm:p-2 rounded-xl w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center transition-all duration-300 ${
            activeSection === "events"
              ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md transform scale-110"
              : "text-gray-500 hover:bg-orange-100 hover:text-orange-600"
          }`}
          title="Events"
          aria-label="Navigate to Events section"
        >
          <div
            className={`icon-wrapper icon-wrapper-events ${
              activeSection === "events" ? "active" : ""
            }`}
          >
            <Calendar
              size={20}
              className={`sm:size-18 transition-transform duration-300 ${
                activeSection === "events"
                  ? "scale-120 icon-pulse icon-glow-events"
                  : ""
              }`}
            />
          </div>
          <span
            className={`text-xs mt-1 font-light ${
              activeSection !== "events" ? "opacity-70" : ""
            }`}
          >
            Events
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSection("users")
            setShowUserList(true)
          }}
          className={`nav-item p-3 sm:p-2 rounded-xl w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center transition-all duration-300 relative ${
            showUserList
              ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md transform scale-110"
              : "text-gray-500 hover:bg-pink-100 hover:text-pink-600"
          }`}
          title="Users"
          aria-label="Show user list"
        >
          <div
            className={`icon-wrapper icon-wrapper-users ${
              showUserList ? "active" : ""
            }`}
          >
            <Users
              size={20}
              className={`sm:size-18 transition-transform duration-300 ${
                showUserList ? "scale-120 icon-pulse icon-glow-users" : ""
              }`}
            />
          </div>
          <span
            className={`text-xs mt-1 font-light ${
              !showUserList ? "opacity-70" : ""
            }`}
          >
            Players
          </span>
          {showUserList && (
            <span className="absolute top-1 right-1 w-3 h-3 sm:w-2 sm:h-2 bg-green-500 rounded-full border-2 border-white" />
          )}
        </button>

        <button
          onClick={() => {
            setShowUserList(false)
            setActiveSection("settings")
          }}
          className={`nav-item p-3 sm:p-2 rounded-xl w-14 h-14 sm:w-12 sm:h-12 flex flex-col items-center justify-center transition-all duration-300 ${
            activeSection === "settings"
              ? "bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-md transform scale-110"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-600"
          }`}
          title="Settings"
          aria-label="Navigate to Settings section"
        >
          <div
            className={`icon-wrapper icon-wrapper-settings ${
              activeSection === "settings" ? "active" : ""
            }`}
          >
            <Settings
              size={20}
              className={`sm:size-18 transition-transform duration-300 ${
                activeSection === "settings"
                  ? "scale-120 icon-pulse icon-glow-settings"
                  : ""
              }`}
            />
          </div>
          <span
            className={`text-xs mt-1 font-light ${
              activeSection !== "settings" ? "opacity-70" : ""
            }`}
          >
            Settings
          </span>
        </button>
      </div>
    </div>
  )
}