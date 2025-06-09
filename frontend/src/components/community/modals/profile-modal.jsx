"use client"

import { useState } from "react"
import { Heart, MessageCircle, Trophy, X, UserPlus } from "lucide-react"

export default function ProfileModal({
  userId,
  users,
  playerStats,
  userBadges,
  achievements,
  closeProfileModal,
  startChat,
  toggleFollow,
  isFollowing,
  inviteToGame,
  getUserLevel,
  getUserXP,
}) {
  // Validate props
  if (!userId || !Array.isArray(users)) {
    console.error("Invalid props: userId or users missing", { userId, users })
    return <div className="text-white">Error: Invalid user data</div>
  }

  const user = users.find((u) => u.id === userId) || { name: "Unknown User", avatar: "/placeholder.svg" }
  console.log("ProfileModal rendered for userId:", userId, "user:", user)

  const [showChatPopup, setShowChatPopup] = useState(false)
  const [showInvitePopup, setShowInvitePopup] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [selectedGame, setSelectedGame] = useState("Chess")

  const achievementCategories = [
    { id: 1, name: "Victories", icon: "🏆", color: "bg-yellow-500" },
    { id: 2, name: "Social", icon: "👥", color: "bg-blue-500" },
    { id: 3, name: "Skills", icon: "⚔️", color: "bg-purple-500" },
    { id: 4, name: "Events", icon: "🎪", color: "bg-green-500" },
    { id: 5, name: "Collector", icon: "💎", color: "bg-pink-500" },
  ]

  // Get achievement by ID
  const getAchievementById = (id) => {
    if (!Array.isArray(achievements)) {
      console.error("Achievements is not an array:", achievements)
      return null
    }
    return achievements.find((a) => a.id === id)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 fade-in">
      {/* Global styles */}
      <style jsx>{`
        /* Glossy dark glassmorphism */
        .glossy-dark {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(49, 46, 129, 0.8));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* Button glossy effect */
        .btn-glossy {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          background: linear-gradient(45deg, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8));
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-glossy:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }

        .btn-glossy::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.5s ease;
        }

        .btn-glossy:hover::after {
          left: 100%;
        }

        /* Popup button glossy effect */
        .popup-btn-glossy {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          background: linear-gradient(45deg, rgba(79, 70, 229, 0.8), rgba(37, 99, 235, 0.8));
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .popup-btn-glossy:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
        }

        .popup-btn-glossy::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .popup-btn-glossy:hover::after {
          left: 100%;
        }

        /* Card hover effects */
        .card-hover {
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.3);
        }

        /* Fade-in animation */
        .fade-in {
          animation: fadeIn 0.3s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Slide-down animation */
        .slide-down {
          animation: slideDown 0.3s ease forwards;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hide scrollbar */
        .scrollbar-hidden {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .scrollbar-hidden::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }

        /* Responsive styles */
        @media (max-width: 640px) {
          .modal-content {
            width: 100% !important;
            padding: 8px !important;
          }

          .modal-body {
            font-size: 14px !important;
          }

          .btn-glossy {
            padding: 8px 12px !important;
            font-size: 12px !important;
          }

          .card-hover {
            padding: 2px !important;
          }

          .grid-cols-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .popup-content {
            width: 100% !important;
            padding: 8px !important;
          }

          .popup-body {
            font-size: 14px !important;
          }
        }
      `}</style>

      <div className="modal-content slide-down glossy-dark w-full max-w-md mx-auto mt-2 mb-2 p-2 flex flex-col">
        <div className="modal-header flex justify-between items-center p-2 border-b border-indigo-900">
          <h3 className="font-bold text-indigo-100 text-lg">Profile</h3>
          <button
            onClick={() => {
              console.log("closeProfileModal clicked for userId:", userId)
              closeProfileModal()
            }}
            className="text-indigo-100 hover:text-pink-400 p-1 rounded-full hover:bg-indigo-900 transition-colors duration-300"
            aria-label="Close profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body  pb-[7rem] overflow-y-auto scrollbar-hidden p-2 bg-gradient-to-b from-gray-800 to-indigo-900 rounded-lg shadow-lg max-h-[calc(100vh-4rem)]">
          {/* User Info */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={user.avatar || "/bgmi.jpg"}
              alt={`${user.name}'s avatar`}
              className="w-12 h-12 rounded-full border-2 border-indigo-200 glow transition-all duration-300 hover:scale-110"
            />
            <div className="flex flex-row gap-40">
              <h3 className="font-bold text-base text-indigo-100">{user.name}</h3>
              <p className="text-indigo-100 font-medium text-sm pt-1">
                Level: {getUserLevel ? getUserLevel(getUserXP ? getUserXP(userId) : 0) : "N/A"}
              </p>
            </div>
          </div>

          {/* Player Stats */}
          <div className="mb-4">
            <h4 className="font-medium mb-2 text-indigo-100 border-b border-indigo-900 pb-1 flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-indigo-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Player Statistics
            </h4>
            {playerStats && playerStats[userId] ? (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="card-hover bg-indigo-900 p-4 rounded-lg">
                  <div className="text-xs text-indigo-100 mb-1">Matches Played</div>
                  <div className="font-bold text-sm text-indigo-100">{playerStats[userId].matchesPlayed || 0}</div>
                </div>
                <div className="card-hover bg-green-900 p-2 rounded-lg">
                  <div className="text-xs text-indigo-100 mb-1">Wins</div>
                  <div className="font-bold text-sm text-green-400">{playerStats[userId].wins || 0}</div>
                </div>
                <div className="card-hover bg-red-900 p-2 rounded-lg">
                  <div className="text-xs text-indigo-100 mb-1">Losses</div>
                  <div className="font-bold text-sm text-red-400">{playerStats[userId].losses || 0}</div>
                </div>
                <div className="card-hover bg-indigo-900 p-2 rounded-lg">
                  <div className="text-xs text-indigo-100 mb-1">Win Rate</div>
                  <div className="font-bold text-sm text-indigo-200">{playerStats[userId].winRate || "0%"}</div>
                </div>
                <div className="card-hover bg-yellow-900 p-2 rounded-lg">
                  <div className="text-xs text-indigo-100 mb-1">Best Score</div>
                  <div className="font-bold text-sm text-yellow-400">{playerStats[userId].bestScore || 0}</div>
                </div>
                <div className="card-hover bg-purple-900 p-2 rounded-lg">
                  <div className="text-xs text-indigo-100 mb-1">Rank</div>
                  <div className="font-bold text-sm text-purple-400">{playerStats[userId].rank || "Unranked"}</div>
                </div>
              </div>
            ) : (
              <p className="text-indigo-100 text-sm">No stats available</p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-center mt-4 border-t border-indigo-900 pt-2">
              <button
                onClick={() => {
                  console.log("Chat button clicked for userId:", userId)
                  setShowChatPopup(true)
                }}
                className="btn-glossy px-8 py-1 text-indigo-100 rounded-lg text-xs transition-all duration-300 flex items-center"
                aria-label="Open chat popup"
              >
                <MessageCircle className="h-3 w-3 mr-1" /> Chat
              </button>
              {toggleFollow && (
                <button
                  onClick={() => {
                    console.log("toggleFollow clicked for userId:", userId, "isFollowing:", isFollowing(userId))
                    toggleFollow(userId)
                  }}
                  className="btn-glossy flex items-center gap-1 px-8 py-1 rounded-lg text-xs font-medium text-indigo-100 transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500"
                  aria-label={isFollowing(userId) ? "Unfollow user" : "Follow user"}
                  aria-pressed={isFollowing(userId)}
                >
                  <UserPlus size={12} />
                  <span>{isFollowing(userId) ? "Unfollow" : "Follow"}</span>
                </button>
              )}
              <button
                onClick={() => {
                  console.log("Invite button clicked for userId:", userId)
                  setShowInvitePopup(true)
                }}
                className="btn-glossy px-8 py-1 text-indigo-100 rounded-lg text-xs transition-all duration-300 flex items-center"
                aria-label="Open invite popup"
              >
                <Trophy className="h-3 w-3 mr-1" /> Invite
              </button>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-2">
            <h4 className="font-medium mb-2 text-indigo-100 border-b border-indigo-900 p-1 flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-indigo-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Achievements
            </h4>
            {userBadges && userBadges[userId] && userBadges[userId].length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {userBadges[userId].slice(0, 6).map((achievementId) => {
                  const achievement = getAchievementById(achievementId)
                  return (
                    achievement && (
                      <div
                        key={achievement.id}
                        className="card-hover bg-indigo-900 rounded-lg p-2 flex flex-col items-center justify-center"
                      >
                        <div
                          className={`text-lg mb-1 ${achievementCategories.find((c) => c.id === achievement.category)?.color.replace("bg-", "text-")}`}
                        >
                          {achievement.icon}
                        </div>
                        <p className="text-xs font-medium text-indigo-100 text-center">{achievement.name}</p>
                        <p className="text-[10px] text-indigo-200 text-center mt-1">{achievement.description}</p>
                      </div>
                    )
                  )
                })}
              </div>
            ) : (
              <p className="text-indigo-100 text-sm">No achievements yet</p>
            )}
          </div>

          {/* Gaming History */}
          <div className="mb-4">
            <h4 className="font-medium mb-2 text-indigo-100 border-b border-indigo-900 pb-1 flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-indigo-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recent Activity
            </h4>
            <div className="space-y-2">
              <div className="card-hover bg-indigo-900 p-2 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-indigo-100">Chess Match</div>
                  <div className="text-[10px] text-indigo-200">
                    vs. {users && users.length > 0 ? users[Math.floor(Math.random() * users.length)]?.name : "Unknown"}
                  </div>
                </div>
                <div className="text-xs font-bold text-green-400 bg-green-900 px-2 py-0.5 rounded-full">Won</div>
              </div>
              <div className="card-hover bg-indigo-900 p-2 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-indigo-100">Poker Tournament</div>
                  <div className="text-[10px] text-indigo-200">8 players</div>
                </div>
                <div className="text-xs font-bold text-amber-400 bg-amber-900 px-2 py-0.5 rounded-full">3rd Place</div>
              </div>
              <div className="card-hover bg-indigo-900 p-2 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-indigo-100">Poker Tournament</div>
                  <div className="text-[10px] text-indigo-200">8 players</div>
                </div>
                <div className="text-xs font-bold text-amber-400 bg-amber-900 px-2 py-0.5 rounded-full">3rd Place</div>
              </div>
              <div className="card-hover bg-indigo-900 p-2 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-indigo-100">Poker Tournament</div>
                  <div className="text-[10px] text-indigo-200">8 players</div>
                </div>
                <div className="text-xs font-bold text-amber-400 bg-amber-900 px-2 py-0.5 rounded-full">3rd Place</div>
              </div>
              <div className="card-hover bg-indigo-900 p-2 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-indigo-100">Poker Tournament</div>
                  <div className="text-[10px] text-indigo-200">8 players</div>
                </div>
                <div className="text-xs font-bold text-amber-400 bg-amber-900 px-2 py-0.5 rounded-full">3rd Place</div>
              </div>
              <div className="card-hover bg-indigo-900 p-2 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-indigo-100">Poker Tournament</div>
                  <div className="text-[10px] text-indigo-200">8 players</div>
                </div>
                <div className="text-xs font-bold text-amber-400 bg-amber-900 px-2 py-0.5 rounded-full">3rd Place</div>
              </div>
              <div className="card-hover bg-indigo-900 p-2 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-indigo-100">Racing Challenge</div>
                  <div className="text-[10px] text-indigo-200">Time Trial</div>
                </div>
                <div className="text-xs font-bold text-blue-400 bg-blue-900 px-2 py-0.5 rounded-full">New Record</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Popup */}
      {showChatPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 fade-in">
          <div className="popup-content slide-down glossy-dark w-full max-w-sm mx-auto p-4 rounded-lg shadow-lg">
            <div className="popup-header flex justify-between items-center p-2 border-b border-indigo-700">
              <h3 className="font-semibold text-indigo-100 text-base">Chat with {user.name}</h3>
              <button
                onClick={() => {
                  console.log("Close chat popup for userId:", userId)
                  setShowChatPopup(false)
                  setChatMessage("")
                }}
                className="text-indigo-200 hover:text-blue-400 p-1 rounded-full hover:bg-indigo-800 transition-colors duration-300"
                aria-label="Close chat popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="popup-body bg-gradient-to-b from-indigo-900 to-blue-900 p-4 rounded-b-md">
              <div className="mb-4 card-hover p-2 rounded-lg">
                <label htmlFor="chatMessage" className="block text-indigo-100 text-sm font-bold mb-2">
                  Message
                </label>
                <textarea
                  id="chatMessage"
                  className="shadow appearance-none border border-indigo-700 rounded w-full py-2 px-3 text-indigo-100 bg-indigo-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
                  placeholder="Type your message..."
                  rows={3}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  aria-label="Chat message"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    console.log("Cancel chat popup for userId:", userId)
                    setShowChatPopup(false)
                    setChatMessage("")
                  }}
                  className="px-4 py-1 text-indigo-100 bg-indigo-800 rounded-lg text-sm hover:bg-indigo-700 transition-all duration-300"
                  aria-label="Cancel chat"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Send chat message for userId:", userId, "message:", chatMessage)
                    if (chatMessage.trim()) {
                      startChat(userId, chatMessage)
                      setShowChatPopup(false)
                      setChatMessage("")
                    } else {
                      alert("Please enter a message")
                    }
                  }}
                  className="popup-btn-glossy px-4 py-1 text-indigo-100 rounded-lg text-sm transition-all duration-300"
                  aria-label="Send chat message"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Popup */}
      {showInvitePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 fade-in">
          <div className="popup-content slide-down glossy-dark w-full max-w-sm mx-auto p-4 rounded-lg shadow-lg">
            <div className="popup-header flex justify-between items-center p-2 border-b border-indigo-700">
              <h3 className="font-semibold text-indigo-100 text-base">Invite {user.name} to Game</h3>
              <button
                onClick={() => {
                  console.log("Close invite popup for userId:", userId)
                  setShowInvitePopup(false)
                }}
                className="text-indigo-200 hover:text-blue-400 p-1 rounded-full hover:bg-indigo-800 transition-colors duration-300"
                aria-label="Close invite popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="popup-body bg-gradient-to-b from-indigo-900 to-blue-900 p-4 rounded-b-md">
              <div className="mb-4 card-hover p-2 rounded-lg">
                <label htmlFor="gameType" className="block text-indigo-100 text-sm font-bold mb-2">
                  Game Type
                </label>
                <select
                  id="gameType"
                  className="shadow appearance-none border border-indigo-700 rounded w-full py-2 px-3 text-indigo-100 bg-indigo-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  aria-label="Select game type"
                >
                  <option value="Chess">Chess</option>
                  <option value="Poker">Poker</option>
                  <option value="Racing">Racing</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    console.log("Cancel invite popup for userId:", userId)
                    setShowInvitePopup(false)
                  }}
                  className="px-4 py-1 text-indigo-100 bg-indigo-800 rounded-lg text-sm hover:bg-indigo-700 transition-all duration-300"
                  aria-label="Cancel invite"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Send invite for userId:", userId, "game:", selectedGame)
                    inviteToGame(userId, selectedGame)
                    setShowInvitePopup(false)
                  }}
                  className="popup-btn-glossy px-4 py-1 text-indigo-100 rounded-lg text-sm transition-all duration-300"
                  aria-label="Send game invite"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}