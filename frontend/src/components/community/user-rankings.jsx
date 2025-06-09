"use client"

import { useState, useEffect } from "react"

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://ful2win-backend.onrender.com"
  : "http://localhost:5000"; // Use production URL in production, local in development

export default function UserRankings({ users, rankingType, handleProfileClick }) {
  const [currentUserData, setCurrentUserData] = useState(null)
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'))

  // Fetch complete user data including followers
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      if (!currentUser?._id) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${currentUser._id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData = await response.json()
        setCurrentUserData(userData)
      } catch (error) {
        // Silently handle error
      }
    }

    fetchCurrentUserData()
  }, [currentUser?._id])
  
  // For followers section, use the complete user data
  const displayUsers = rankingType === "followers" 
    ? currentUserData ? [currentUserData] : [] // Use complete user data for followers section
    : [...users]    // Show all users for coins section
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 3)

  const getStyles = () => {
    if (rankingType === "coins") {
      return {
        container: "bg-white rounded-md shadow-md overflow-hidden mb-6 card-hover border-2 border-yellow-200",
        header: "bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 border-b",
        title: "font-semibold text-amber-800",
        row: "hover:bg-yellow-50",
        value: "text-amber-500 font-bold flex items-center",
        icon: "💰",
        rankColors: {
          0: "text-yellow-500", // Gold
          1: "text-gray-400",   // Silver
          2: "text-amber-700",  // Bronze
        }
      }
    } else {
      return {
        container: "bg-white rounded-md shadow-md overflow-hidden mb-6 card-hover border-2 border-blue-200",
        header: "bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 border-b",
        title: "font-semibold text-purple-800",
        row: "hover:bg-purple-50",
        value: "text-purple-500 font-bold flex items-center",
        icon: "👥",
      }
    }
  }

  const styles = getStyles()

  // Helper function to get follower details
  const getFollowerDetails = (user) => {
    if (!user || !Array.isArray(user.followers)) {
      return []
    }
    
    // Get the details of followers by matching their IDs with the users array
    return user.followers.map(followerId => {
      const follower = users.find(u => u._id === followerId)
      if (follower) {
        return {
          id: follower._id,
          name: follower.fullName || follower.name,
          phoneNumber: follower.phoneNumber,
          avatar: follower.avatar
        }
      }
      return null
    }).filter(Boolean) // Remove any null entries
  }

  // Helper function to safely get followers count
  const getFollowersCount = (user) => {
    if (!user || !Array.isArray(user.followers)) {
      return 0
    }
    return user.followers.length
  }

  if (rankingType === "followers" && !currentUserData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>User Followers</h2>
        </div>
        <div className="p-4 text-center text-gray-500">
          Loading followers...
        </div>
      </div>
    )
  }

  if (rankingType === "followers" && displayUsers.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>User Followers</h2>
        </div>
        <div className="p-4 text-center text-gray-500">
          Please log in to view your followers
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {rankingType === "coins" ? "Top Balance Holders" : "My Followers"}
        </h2>
      </div>
      <div className="divide-y">
        {displayUsers.map((user, index) => (
          <div key={user._id} className={`flex flex-col px-4 py-3 ${styles.row} transition-colors duration-300`}>
            {rankingType === "followers" ? (
              // Followers section layout
              <>
                <div className="flex items-center mb-2">
                  <div className="flex items-center flex-1">
                    <div className="relative flex-shrink-0">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt=""
                        className="w-10 h-10 rounded-full mr-3 cursor-pointer transition-transform duration-300 hover:scale-110 border-2 border-transparent hover:border-amber-300"
                        onClick={() => handleProfileClick(user._id)}
                      />
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white pulse"></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-black">{user.fullName || user.name}</span>
                      <span className="text-sm text-gray-500">@{user.fullName?.toLowerCase().replace(/\s+/g, '') || user.name?.toLowerCase().replace(/\s+/g, '')}</span>
                    </div>
                  </div>
                  <div className={`${styles.value} text-lg`}>
                    {getFollowersCount(user)} followers
                    <span className="ml-1">{styles.icon}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-2">Your Followers:</div>
                  <div className="space-y-2">
                    {getFollowerDetails(user).length > 0 ? (
                      getFollowerDetails(user).map((follower, idx) => (
                        <div 
                          key={follower.id}
                          className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200 cursor-pointer hover:shadow-md"
                          onClick={() => handleProfileClick(follower.id)}
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={follower.avatar || "/placeholder.svg"}
                              alt=""
                              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                            />
                            {follower.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-medium text-gray-900">{follower.name}</div>
                            <div className="text-sm text-gray-500">@{follower.name.toLowerCase().replace(/\s+/g, '')}</div>
                          </div>
                          <div className="text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-500">No followers yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Coins section layout (unchanged)
              <div className="flex items-center">
                <div className={`w-8 text-center font-bold ${styles.rankColors[index]}`}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>
                <div className="flex items-center flex-1">
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt=""
                      className="w-10 h-10 rounded-full mr-3 cursor-pointer transition-transform duration-300 hover:scale-110 border-2 border-transparent hover:border-amber-300"
                      onClick={() => handleProfileClick(user._id)}
                    />
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white pulse"></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-black">{user.fullName || user.name}</span>
                    <span className="text-sm text-gray-500">@{user.fullName?.toLowerCase().replace(/\s+/g, '') || user.name?.toLowerCase().replace(/\s+/g, '')}</span>
                  </div>
                </div>
                <div className={`${styles.value} text-lg`}>
                  ₹{(user.coins || 0).toLocaleString()}
                  <span className="ml-1">{styles.icon}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
