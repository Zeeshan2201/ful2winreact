"use client"

import { useState, useCallback } from "react"
import { Search, X } from "lucide-react"

export default function CommunityHeader({ search }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] })

  const handleSearchToggle = useCallback(() => {
    console.log("handleSearchToggle called, current isSearchOpen:", isSearchOpen)
    setIsSearchOpen((prev) => {
      const newState = !prev
      console.log("New isSearchOpen state:", newState)
      return newState
    })
    setSearchQuery("")
    setSearchResults({ users: [], posts: [] })
  }, [isSearchOpen])

  const handleSearch = useCallback(
    (e) => {
      const query = e.target.value
      console.log("handleSearch called, query:", query)
      setSearchQuery(query)
      try {
        const results = search(query)
        console.log("Search results:", results)
        setSearchResults(results)
      } catch (error) {
        console.error("Error in search function:", error)
        setSearchResults({ users: [], posts: [] })
      }
    },
    [search]
  )

  return (
    <header className="relative bg-gradient-to-r from-gray-900 to-indigo-900 ">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        .glossy {
          position: relative;
          overflow: hidden;
        }
        .glossy::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }
        .glossy:hover::after {
          left: 100%;
        }
        /* Hide scrollbar for search results */
        .scrollbar-hidden {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>

      {/* Header Title and Icons */}
      <div className="flex items-center justify-between glossy p-1">
        <h1 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">Community Hub</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSearchToggle}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-all duration-300"
            aria-label={isSearchOpen ? "Close search" : "Open search"}
          >
            {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Search Input and Results */}
      {isSearchOpen && (
        <div className="mt-1 w-full p-1 bg-gradient-to-r from-gray-800 to-indigo-800 glossy animate-fade-in">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search users or posts..."
            className="w-full p-1 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
            aria-label="Search community"
            autoFocus
          />

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-1 max-h-60 scrollbar-hidden">
              {/* Users */}
              {searchResults.users.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-indigo-200 mb-1">Users</h3>
                  {searchResults.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-1 rounded-md hover:bg-indigo-900/30 transition-all duration-200 cursor-pointer"
                    >
                      <img
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                        className="h-10 w-10 rounded-full mr-3 border border-white/20"
                        onError={(e) => (e.target.src = "/avatars/default.jpg")}
                      />
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts */}
              {searchResults.posts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-indigo-200 mb-1">Posts</h3>
                  {searchResults.posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-md hover:bg-indigo-900/30 transition-all duration-200 cursor-pointer"
                    >
                      <p className="text-white line-clamp-2 text-sm">{post.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchResults.users.length === 0 && searchResults.posts.length === 0 && (
                <p className="text-gray-400 text-center mt-4 text-sm">No results found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}