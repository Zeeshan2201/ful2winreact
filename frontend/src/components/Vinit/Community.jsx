"use client"

import { useEffect, useState, useRef } from "react"
import {
  Users,
  Coins,
  Award,
  MessageSquare,
  Trophy,
  Heart,
  MessageCircle,
  Home,
  Settings,
  X,
  Search,
  Send,
  PlusCircle,
  Calendar,
  Tag,
  BarChart2,
  Menu,
} from "lucide-react"
import { Music, ImageIcon, Film, Palette, GiftIcon as Gif } from "lucide-react"
import axios from "axios"
import { CalendarIcon, Megaphone, Upload } from "lucide-react"

export default function CommunityPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [comments, setComments] = useState({})
  const [rankingType, setRankingType] = useState("daily")
  const [searchQuery, setSearchQuery] = useState("")
  const [globalSearchQuery, setGlobalSearchQuery] = useState("")
  const [viewingProfile, setViewingProfile] = useState(null)
  const [playerStats, setPlayerStats] = useState({})
  const [activeChatUser, setActiveChatUser] = useState(null)
  const [chatMessages, setChatMessages] = useState({})
  const [currentMessage, setCurrentMessage] = useState("")
  const [posts, setPosts] = useState([])
  const [newPostContent, setNewPostContent] = useState("")
  const [postComments, setPostComments] = useState({})
  const [newPostComment, setNewPostComment] = useState({})
  const chatEndRef = useRef(null)
  const [followedUsers, setFollowedUsers] = useState({})
  const [giftMenuOpen, setGiftMenuOpen] = useState(null)
  const [userGifts, setUserGifts] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [userFiles, setUserFiles] = useState({})
  const [uploadProgress, setUploadProgress] = useState(0)

  const fileInputRef = useRef(null)

  // New state variables for notifications, emails, and game invitations
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [gameInvitations, setGameInvitations] = useState([])
  const [showGameInvite, setShowGameInvite] = useState(false)
  const [inviteUserId, setInviteUserId] = useState(null)
  const [gameOptions, setGameOptions] = useState([
    { id: 1, name: "Chess", icon: "♟️" },
    { id: 2, name: "Poker", icon: "🃏" },
    { id: 3, name: "Racing", icon: "🏎️" },
    { id: 4, name: "Puzzle", icon: "🧩" },
    { id: 5, name: "Shooter", icon: "🎯" },
  ])
  const [selectedGame, setSelectedGame] = useState(null)

  // Add achievement/badge system state variables
  const [achievements, setAchievements] = useState([])
  const [userBadges, setUserBadges] = useState({})
  const [showAchievements, setShowAchievements] = useState(false)
  const [newAchievements, setNewAchievements] = useState(0)
  const [achievementCategories, setAchievementCategories] = useState([
    { id: 1, name: "Victories", icon: "🏆", color: "bg-yellow-500" },
    { id: 2, name: "Social", icon: "👥", color: "bg-blue-500" },
    { id: 3, name: "Skills", icon: "⚔️", color: "bg-purple-500" },
    { id: 4, name: "Events", icon: "🎪", color: "bg-green-500" },
    { id: 5, name: "Collector", icon: "💎", color: "bg-pink-500" },
  ])

  // Active section state
  const [activeSection, setActiveSection] = useState("home")

    // News and blogs sections
  const [showNews, setShowNews] = useState(false)
  const [showBlogs, setShowBlogs] = useState(false)

  // Gift options
  const gifts = [
    { id: 1, name: "Trophy", emoji: "🏆", value: 50 },
    { id: 2, name: "Star", emoji: "⭐", value: 20 },
    { id: 3, name: "Heart", emoji: "❤️", value: 10 },
    { id: 4, name: "Rocket", emoji: "🚀", value: 30 },
    { id: 5, name: "Diamond", emoji: "💎", value: 100 },
  ]

  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [showPollCreator, setShowPollCreator] = useState(false)
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const [hasPoll, setHasPoll] = useState(false)
  const [showTagPeople, setShowTagPeople] = useState(false)
  const [taggedPeople, setTaggedPeople] = useState([])
  const [tagSearchQuery, setTagSearchQuery] = useState("")
  const [showScheduler, setShowScheduler] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserList, setShowUserList] = useState(false)
  const [showEvents, setShowEvents] = useState(false)
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Community Tournament",
      date: "2025-05-20",
      time: "18:00",
      description: "Join our monthly gaming tournament with prizes!",
      participants: [1, 3, 5, 7],
      location: "Virtual Arena",
    },
    {
      id: 2,
      title: "Game Launch Party",
      date: "2025-05-25",
      time: "20:00",
      description: "Celebrating the launch of the new RPG expansion",
      participants: [2, 4, 6],
      location: "Main Lobby",
    },
    {
      id: 3,
      title: "Developer Q&A",
      date: "2025-06-01",
      time: "19:00",
      description: "Ask questions directly to our game developers",
      participants: [1, 8, 10],
      location: "Dev Channel",
    },
  ])
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
  })
  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: "New Battle Royale Game Announced",
      date: "2025-05-15",
      content:
        "A major studio has announced a new battle royale game that promises to revolutionize the genre with innovative mechanics and stunning visuals.",
      imageUrl: "/placeholder.svg?height=300&width=500",
      source: "GameNews",
      youtubeUrl: "https://www.youtube.com/embed/0E44DClsX5Q",
    },
    {
      id: 2,
      title: "Esports Championship Results",
      date: "2025-05-10",
      content:
        "The world championship concluded with an unexpected winner taking home the $1 million prize pool after an intense final match.",
      imageUrl: "/placeholder.svg?height=300&width=500",
      source: "Esports Today",
      youtubeUrl: "",
    },
    {
      id: 3,
      title: "Major Update Coming to Popular MMORPG",
      date: "2025-05-05",
      content:
        "The developers announced a massive content update including new zones, raids, and character classes coming next month.",
      imageUrl: "/placeholder.svg?height=300&width=500",
      source: "MMO Insider",
      youtubeUrl: "https://www.youtube.com/embed/s4gBChg6AII",
    },
  ])

   const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Top 10 Gaming Strategies for Beginners",
      author: "ProGamer123",
      date: "2025-05-12",
      content:
        "If you're new to competitive gaming, these ten strategies will help you improve your skills and climb the ranks faster...",
      imageUrl: "/placeholder.svg?height=300&width=500",
      tags: ["beginner", "tips", "competitive"],
    },
    {
      id: 2,
      title: "The Evolution of RPG Games: From Tabletop to Virtual Reality",
      author: "GameHistorian",
      date: "2025-05-08",
      content:
        "Role-playing games have come a long way from their tabletop origins. This article explores the fascinating evolution of the genre...",
      imageUrl: "/placeholder.svg?height=300&width=500",
      tags: ["rpg", "history", "vr"],
    },
    {
      id: 3,
      title: "Building the Perfect Gaming Setup: A Comprehensive Guide",
      author: "TechWizard",
      date: "2025-05-03",
      content:
        "From selecting the right hardware to optimizing your space, this guide covers everything you need to create your dream gaming setup...",
      imageUrl: "/placeholder.svg?height=300&width=500",
      tags: ["hardware", "setup", "guide"],
    },
  ])


  
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  const [showAnnouncements, setShowAnnouncements] = useState(false)
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Important System Update",
      content: "We'll be performing maintenance on May 21st from 2-4 AM UTC.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      createdBy: 1,
      isPinned: true,
      imageUrl: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 2,
      title: "New Game Features Released",
      content: "Check out the latest features including custom avatars and improved matchmaking!",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      createdBy: 4,
      isPinned: false,
      imageUrl: null,
    },
  ])
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    isPinned: false,
    imageUrl: null,
  })
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false)
  const [announcementImage, setAnnouncementImage] = useState(null)
  const announcementImageRef = useRef(null)

  const [mediaType, setMediaType] = useState(null)
  const [backgroundOptions, setBackgroundOptions] = useState([
    { id: 1, color: "bg-gradient-to-r from-purple-500 to-indigo-500", name: "Purple Haze" },
    { id: 2, color: "bg-gradient-to-r from-pink-500 to-rose-500", name: "Pink Sunset" },
    { id: 3, color: "bg-gradient-to-r from-yellow-400 to-amber-500", name: "Golden Hour" },
    { id: 4, color: "bg-gradient-to-r from-green-400 to-emerald-500", name: "Forest" },
    { id: 5, color: "bg-gradient-to-r from-blue-400 to-cyan-500", name: "Ocean Blue" },
  ])
  const [selectedBackground, setSelectedBackground] = useState(null)
  const [musicUrl, setMusicUrl] = useState("")
  const [gifUrl, setGifUrl] = useState("")
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const musicInputRef = useRef(null)
  const [selectedGif, setSelectedGif] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [gifs, setGifs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const timezoneInputRef = useRef(null)

  // GIF
  useEffect(() => {
    const fetchGifs = async () => {
      const endpoint = searchTerm
        ? `https://api.giphy.com/v1/gifs/search?api_key=O11aOeloY0YJEKSPPXYEuLKLT5Lr1yKW&q=${searchTerm}&limit=12`
        : `https://api.giphy.com/v1/gifs/trending?api_key=O11aOeloY0YJEKSPPXYEuLKLT5Lr1yKW&limit=12`

      try {
        const res = await axios.get(endpoint)
        setGifs(res.data.data)
      } catch (err) {
        console.error("Error fetching GIFs", err)
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchGifs()
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  // Dummy function for toggleLikePost

  const toggleLikePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          if (post.likes.includes(1)) {
            // Assuming user ID 1 is the current user
            return { ...post, likes: post.likes.filter((userId) => userId !== 1) }
          } else {
            return { ...post, likes: [...post.likes, 1] }
          }
        }
        return post
      }),
    )
  }

  // Dummy function for addPostComment
  const addPostComment = (postId) => {
    if (!newPostComment[postId]?.trim()) return

    const newComment = {
      id: (postComments[postId]?.length || 0) + 1,
      userId: 1, // Assuming current user is ID 1
      content: newPostComment[postId],
      timestamp: new Date().toISOString(),
    }

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }))

    setNewPostComment((prev) => ({ ...prev, [postId]: "" }))
  }

  useEffect(() => {
    // Dummy data, replace with real API
    const dummyUsers = [
      { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/100?img=1", followers: 1200, coins: 560, isOnline: true },
      { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/100?img=2", followers: 900, coins: 480, isOnline: false },
      { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/100?img=3", followers: 300, coins: 250, isOnline: true },
      { id: 4, name: "David", avatar: "https://i.pravatar.cc/100?img=4", followers: 2200, coins: 720, isOnline: false },
      { id: 5, name: "Eve", avatar: "https://i.pravatar.cc/100?img=5", followers: 1500, coins: 600, isOnline: true },
      { id: 6, name: "Frank", avatar: "https://i.pravatar.cc/100?img=6", followers: 1100, coins: 450, isOnline: false },
      { id: 7, name: "Grace", avatar: "https://i.pravatar.cc/100?img=7", followers: 1300, coins: 510, isOnline: true },
      {
        id: 8,
        name: "Hannah",
        avatar: "https://i.pravatar.cc/100?img=8",
        followers: 2000,
        coins: 650,
        isOnline: false,
      },
      { id: 9, name: "Isaac", avatar: "https://i.pravatar.cc/100?img=9", followers: 800, coins: 420, isOnline: true },
      {
        id: 10,
        name: "Jack",
        avatar: "https://i.pravatar.cc/100?img=10",
        followers: 1700,
        coins: 580,
        isOnline: false,
      },
    ]

    // Dummy player statistics
    const dummyPlayerStats = {
      1: { matchesPlayed: 120, wins: 78, losses: 42, winRate: "65%", bestScore: 980, rank: "Diamond" },
      2: { matchesPlayed: 95, wins: 52, losses: 43, winRate: "55%", bestScore: 820, rank: "Platinum" },
      3: { matchesPlayed: 65, wins: 30, losses: 35, winRate: "46%", bestScore: 720, rank: "Gold" },
      4: { matchesPlayed: 210, wins: 142, losses: 68, winRate: "68%", bestScore: 1050, rank: "Master" },
      5: { matchesPlayed: 180, wins: 110, losses: 70, winRate: "61%", bestScore: 950, rank: "Diamond" },
      6: { matchesPlayed: 85, wins: 40, losses: 45, winRate: "47%", bestScore: 780, rank: "Gold" },
      7: { matchesPlayed: 150, wins: 89, losses: 61, winRate: "59%", bestScore: 890, rank: "Platinum" },
      8: { matchesPlayed: 190, wins: 125, losses: 65, winRate: "66%", bestScore: 980, rank: "Diamond" },
      9: { matchesPlayed: 70, wins: 32, losses: 38, winRate: "46%", bestScore: 750, rank: "Gold" },
      10: { matchesPlayed: 160, wins: 98, losses: 62, winRate: "61%", bestScore: 920, rank: "Diamond" },
    }

    // Dummy posts
    const dummyPosts = [
      {
        id: 1,
        userId: 1,
        content: "Just won my 100th match! So excited to reach this milestone!",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: [2, 3, 5],
      },
      {
        id: 2,
        userId: 4,
        content: "Looking for teammates for the weekend tournament. Anyone interested?",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: [1, 7, 9],
      },
      {
        id: 3,
        userId: 7,
        content: "Check out my new strategy guide on the blog!",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        likes: [2, 4, 8, 10],
      },
    ]

    // Dummy post comments
    const dummyPostComments = {
      1: [
        {
          id: 1,
          userId: 3,
          content: "Congratulations! That's amazing!",
          timestamp: new Date(Date.now() - 3000000).toISOString(),
        },
        { id: 2, userId: 5, content: "Well deserved!", timestamp: new Date(Date.now() - 2400000).toISOString() },
      ],
      2: [
        {
          id: 1,
          userId: 1,
          content: "I'm in! Send me the details.",
          timestamp: new Date(Date.now() - 6000000).toISOString(),
        },
      ],
      3: [
        {
          id: 1,
          userId: 2,
          content: "Great guide, very helpful!",
          timestamp: new Date(Date.now() - 80000000).toISOString(),
        },
        {
          id: 2,
          userId: 10,
          content: "I tried your strategy and it worked perfectly!",
          timestamp: new Date(Date.now() - 70000000).toISOString(),
        },
      ],
    }

    // Dummy notifications
    const dummyNotifications = [
      {
        id: 1,
        type: "like",
        userId: 3,
        content: "Charlie liked your post",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false,
      },
      {
        id: 2,
        type: "comment",
        userId: 5,
        content: "Eve commented on your post",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      {
        id: 3,
        type: "follow",
        userId: 7,
        content: "Grace started following you",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
      },
      {
        id: 4,
        type: "gift",
        userId: 2,
        content: "Bob sent you a gift",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: true,
      },
    ]

    // Dummy achievements
    const dummyAchievements = [
      {
        id: 1,
        name: "First Victory",
        description: "Win your first game",
        icon: "🏆",
        category: 1,
        rarity: "common",
        xp: 50,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isNew: true,
      },
      {
        id: 2,
        name: "Social Butterfly",
        description: "Follow 5 other players",
        icon: "🦋",
        category: 2,
        rarity: "common",
        xp: 30,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        isNew: true,
      },
      {
        id: 3,
        name: "Sharpshooter",
        description: "Achieve 90% accuracy in a shooting game",
        icon: "🎯",
        category: 3,
        rarity: "rare",
        xp: 100,
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        isNew: false,
      },
      {
        id: 4,
        name: "Tournament Finalist",
        description: "Reach the finals in a tournament",
        icon: "🏅",
        category: 4,
        rarity: "epic",
        xp: 200,
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        isNew: false,
      },
      {
        id: 5,
        name: "Gift Giver",
        description: "Send gifts to 3 different players",
        icon: "🎁",
        category: 5,
        rarity: "uncommon",
        xp: 75,
        timestamp: new Date(Date.now() - 432000000).toISOString(),
        isNew: false,
      },
    ]

    // Dummy user badges
    const dummyUserBadges = {
      1: [1, 2, 3],
      2: [1, 5],
      3: [1, 2],
      4: [1, 3, 4],
      5: [1, 2, 5],
      6: [1],
      7: [1, 2, 3, 5],
      8: [1, 4],
      9: [1, 2],
      10: [1, 3],
    }

    // Dummy game invitations
    const dummyGameInvitations = []

    setPlayerStats(dummyPlayerStats)
    setPosts(dummyPosts)
    setPostComments(dummyPostComments)
    setNotifications(dummyNotifications)
    setUnreadNotifications(dummyNotifications.filter((n) => !n.read).length)
    setGameInvitations(dummyGameInvitations)

    // Add achievement-related setters in useEffect
    setAchievements(dummyAchievements)
    setUserBadges(dummyUserBadges)
    setNewAchievements(dummyAchievements.filter((a) => a.isNew).length)

    // Sort users based on ranking type
    let sortedUsers = [...dummyUsers]

    // In a real app, you would fetch different data based on rankingType
    // For this example, we'll just sort by coins
    sortedUsers = sortedUsers.sort((a, b) => b.coins - a.coins)

    setUsers(sortedUsers)
    setFilteredUsers(sortedUsers)
  }, [rankingType])

  // Apply filtering whenever users or searchQuery changes
  useEffect(() => {
    let result = [...users]

    // Apply search filtering
    if (searchQuery && searchQuery !== "__online__") {
      // If searching for "online", filter by online status
      if (searchQuery.toLowerCase() === "online") {
        result = result.filter((user) => user.isOnline)
      } else {
        // Otherwise filter by name
        result = result.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      }
    }

    // Special case for online users filter
    if (searchQuery === "__online__") {
      result = result.filter((user) => user.isOnline)
    }

    setFilteredUsers(result)
  }, [users, searchQuery])

  // Apply global search filtering
  useEffect(() => {
    if (globalSearchQuery.trim() === "") return

    // Filter users by name
    const matchingUsers = users.filter((user) => user.name.toLowerCase().includes(globalSearchQuery.toLowerCase()))

    // Filter posts by content
    const matchingPosts = posts.filter((post) => {
      const postContent = post.content.toLowerCase()
      const searchTerm = globalSearchQuery.toLowerCase()
      return postContent.includes(searchTerm)
    })

    // If we have matching users, show the first one's profile
    if (matchingUsers.length > 0) {
      setViewingProfile(matchingUsers[0].id)
    }

    // If we have matching posts, scroll to them (in a real app)
    if (matchingPosts.length > 0) {
      // In a real app, you would scroll to the post
      console.log("Found matching posts:", matchingPosts)
    }
  }, [globalSearchQuery])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current && activeChatUser) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, activeChatUser])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest(".notifications-dropdown")) {
        setShowNotifications(false)
      }
      if (showAchievements && !event.target.closest(".achievements-dropdown")) {
        setShowAchievements(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications, showAchievements])

  const handleCommentChange = (e, userId) => {
    setComments({ ...comments, [userId]: e.target.value })
  }

  const handleCommentSubmit = (userId) => {
    if (!comments[userId]?.trim()) return

    alert(`Comment to ${users.find((u) => u.id === userId).name}: ${comments[userId]}`)
    setComments({ ...comments, [userId]: "" })
  }

  const toggleGiftMenu = (userId) => {
    setGiftMenuOpen(giftMenuOpen === userId ? null : userId)
  }

  const sendGift = (userId, gift) => {
    // Update user gifts
    const currentUserGifts = userGifts[userId] || []
    const updatedGifts = [...currentUserGifts, gift]
    setUserGifts({ ...userGifts, [userId]: updatedGifts })
    // Close gift menu
    setGiftMenuOpen(null)
    // Show confirmation
    alert(`You sent a ${gift.name} ${gift.emoji} to ${users.find((u) => u.id === userId).name}!`)

    // Add notification for the gift
    addNotification({
      type: "gift",
      userId: 1, // Current user
      content: `You sent a ${gift.name} to ${users.find((u) => u.id === userId).name}`,
      timestamp: new Date().toISOString(),
      read: true,
    })

    // Check if achievement should be awarded (Gift Giver)
    const sentGiftsToUsers = Object.keys(userGifts).length
    if (sentGiftsToUsers >= 3) {
      awardAchievement(1, 5) // Award "Gift Giver" achievement
    }
  }

  // Calculate total gift value for a user
  const getUserGiftValue = (userId) => {
    const gifts = userGifts[userId] || []
    return gifts.reduce((total, gift) => total + gift.value, 0)
  }

  // Toggle follow status for a user
  const toggleFollow = (userId) => {
    setFollowedUsers((prev) => {
      const newState = { ...prev }
      newState[userId] = !newState[userId]
      // Show confirmation
      const user = users.find((u) => u.id === userId)
      const action = newState[userId] ? "followed" : "unfollowed"
      alert(`You ${action} ${user.name}`)

      // Add notification for follow/unfollow
      if (newState[userId]) {
        addNotification({
          type: "follow",
          userId: userId,
          content: `You started following ${user.name}`,
          timestamp: new Date().toISOString(),
          read: true,
        })

        // Check if achievement should be awarded (Social Butterfly)
        const followCount = Object.values(newState).filter(Boolean).length
        if (followCount >= 5) {
          awardAchievement(1, 2) // Award "Social Butterfly" achievement
        }
      }

      return newState
    })
  }

  // Check if a user is being followed
  const isFollowing = (userId) => {
    return !!followedUsers[userId]
  }

  // Handle profile picture click
  const handleProfileClick = (userId) => {
    setViewingProfile(userId)
  }

  // Close profile modal
  const closeProfileModal = () => {
    setViewingProfile(null)
  }

  // Start chat with user
  const startChat = (userId) => {
    setActiveChatUser(userId)
    // Initialize chat if it doesn't exist
    if (!chatMessages[userId]) {
      setChatMessages({
        ...chatMessages,
        [userId]: [
          {
            id: 1,
            sender: userId,
            content: `Hi there! How can I help you?`,
            timestamp: new Date().toISOString(),
          },
        ],
      })
    }
  }

  // Close chat
  const closeChat = () => {
    setActiveChatUser(null)
    setCurrentMessage("")
  }

  // Send chat message
  const sendChatMessage = () => {
    if (!currentMessage.trim() || !activeChatUser) return

    const newMessage = {
      id: (chatMessages[activeChatUser]?.length || 0) + 1,
      sender: "me",
      content: currentMessage,
      timestamp: new Date().toISOString(),
    }

    setChatMessages({
      ...chatMessages,
      [activeChatUser]: [...(chatMessages[activeChatUser] || []), newMessage],
    })

    setCurrentMessage("")

    // Simulate response after a short delay
    setTimeout(
      () => {
        const responseMessage = {
          id: (chatMessages[activeChatUser]?.length || 0) + 2,
          sender: activeChatUser,
          content: getRandomResponse(),
          timestamp: new Date().toISOString(),
        }

        setChatMessages((prev) => ({
          ...prev,
          [activeChatUser]: [...(prev[activeChatUser] || []), responseMessage],
        }))
      },
      1000 + Math.random() * 2000,
    )
  }

  // Random responses for chat simulation
  const getRandomResponse = () => {
    const responses = [
      "That's interesting!",
      "I see what you mean.",
      "Thanks for sharing that.",
      "I agree with you.",
      "Let me think about that.",
      "Good point!",
      "I'm not sure I understand. Can you explain?",
      "That's a great idea!",
      "I'll keep that in mind.",
      "How's your day going?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "just now"
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHour < 24) return `${diffHour}h ago`
    if (diffDay < 7) return `${diffDay}d ago`

    return date.toLocaleDateString()
  }

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Capture screenshot
  const captureScreenshot = () => {
    // In a real app, this would use the Web API to capture the screen
    // For this demo, we'll simulate it with a placeholder
    setScreenshotPreview("/placeholder.svg?height=400&width=600")
    // Clear file attachment if screenshot is taken
    setSelectedFile(null)
  }

  // Add poll to post
  const addPollToPost = () => {
    if (!pollQuestion.trim() || pollOptions.some((opt) => !opt.trim())) return

    setHasPoll(true)
    setShowPollCreator(false)

    // In a real app, you would store the poll data to be included in the post
    alert(`Poll "${pollQuestion}" with ${pollOptions.length} options added to your post`)
  }

  // Modify createPost function to handle attachments and other features
  const createPost = () => {
    if (
      (!newPostContent.trim() && !selectedFile && !screenshotPreview && !hasPoll && !selectedBackground && !gifUrl) ||
      (isScheduled && (!scheduleDate || !scheduleTime))
    )
      return

    // Create post object with all the new features
    const newPost = {
      id: posts.length + 1,
      userId: 1, // Assuming current user is ID 1
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: [],
      hasAttachment: !!selectedFile,
      attachmentType: selectedFile ? selectedFile.type : null,
      attachmentName: selectedFile ? selectedFile.name : null,
      hasScreenshot: !!screenshotPreview,
      hasPoll: hasPoll,
      pollQuestion: hasPoll ? pollQuestion : null,
      pollOptions: hasPoll ? pollOptions.filter((opt) => opt.trim()) : null,
      allowMultipleVotes: hasPoll ? allowMultipleVotes : null,
      taggedPeople: taggedPeople.length > 0 ? taggedPeople : null,
      isScheduled: isScheduled,
      scheduledFor: isScheduled ? `${scheduleDate} ${scheduleTime}` : null,
      mediaType: mediaType,
      backgroundStyle: selectedBackground ? selectedBackground.color : null,
      musicUrl: musicUrl || null,
      gifUrl: gifUrl || null,
    }

    // If post is scheduled, show a message instead of adding to posts array
    if (isScheduled) {
      alert(`Post scheduled for ${scheduleDate} at ${scheduleTime}`)
    } else {
      setPosts([newPost, ...posts])
    }

    // Reset all states
    setNewPostContent("")
    setSelectedFile(null)
    setScreenshotPreview(null)
    setHasPoll(false)
    setPollQuestion("")
    setPollOptions(["", ""])
    setAllowMultipleVotes(false)
    setTaggedPeople([])
    setIsScheduled(false)
    setScheduleDate("")
    setScheduleTime("")
    setMediaType(null)
    setSelectedBackground(null)
    setMusicUrl("")
    setGifUrl("")
    setShowMediaOptions(false)

    // Add notification for new post
    addNotification({
      type: "post",
      userId: 1,
      content: "You created a new post",
      timestamp: new Date().toISOString(),
      read: true,
    })
  }

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowGameInvite(false)
    setShowAchievements(false)

    // Mark notifications as read when opened
    if (!showNotifications && unreadNotifications > 0) {
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
      setUnreadNotifications(0)
    }
  }

  // Toggle achievements dropdown
  const toggleAchievements = () => {
    setShowAchievements(!showAchievements)
    setShowNotifications(false)

    // Mark achievements as viewed
    if (!showAchievements && newAchievements > 0) {
      setAchievements(achievements.map((achievement) => ({ ...achievement, isNew: false })))
      setNewAchievements(0)
    }
  }

  // Get achievement details by ID
  const getAchievementById = (id) => {
    return achievements.find((a) => a.id === id)
  }

  // Check if user has a specific achievement
  const hasAchievement = (userId, achievementId) => {
    return userBadges[userId]?.includes(achievementId)
  }

  // Award an achievement to a user
  const awardAchievement = (userId, achievementId) => {
    if (hasAchievement(userId, achievementId)) return

    setUserBadges((prev) => ({
      ...prev,
      [userId]: [...(prev[userId] || []), achievementId],
    }))

    const achievement = getAchievementById(achievementId)
    if (achievement) {
      // Add notification
      addNotification({
        type: "achievement",
        userId: userId,
        content: `You earned the "${achievement.name}" achievement!`,
        timestamp: new Date().toISOString(),
        read: false,
        achievementId: achievementId,
      })

      // Update achievement as new
      if (userId === 1) {
        // Current user
        setAchievements(achievements.map((a) => (a.id === achievementId ? { ...a, isNew: true } : a)))
        setNewAchievements((prev) => prev + 1)
      }
    }
  }

  // Get user's total XP from achievements
  const getUserXP = (userId) => {
    const userAchievements = userBadges[userId] || []
    return userAchievements.reduce((total, achievementId) => {
      const achievement = getAchievementById(achievementId)
      return total + (achievement?.xp || 0)
    }, 0)
  }

  // Get user level based on XP
  const getUserLevel = (xp) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: notifications.length + 1,
      ...notification,
    }
    setNotifications([newNotification, ...notifications])
    if (!notification.read) {
      setUnreadNotifications(unreadNotifications + 1)
    }
  }

  // Send a game invitation
  const sendGameInvite = () => {
    if (!inviteUserId || !selectedGame) return

    const user = users.find((u) => u.id === inviteUserId)
    const game = gameOptions.find((g) => g.id === selectedGame)

    if (!user || !game) return

    // Create new invitation
    const newInvitation = {
      id: gameInvitations.length + 1,
      to: inviteUserId,
      from: 1, // Current user
      game: game.name,
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    setGameInvitations([...gameInvitations, newInvitation])

    // Add notification
    addNotification({
      type: "game",
      userId: inviteUserId,
      content: `You invited ${user.name} to play ${game.name}`,
      timestamp: new Date().toISOString(),
      read: true,
    })

    // Close invite modal
    setShowGameInvite(false)
    setInviteUserId(null)
    setSelectedGame(null)

    alert(`Game invitation sent to ${user.name} for ${game.name}!`)
  }

  // Respond to a game invitation
  const respondToGameInvite = (inviteId, accept) => {
    setGameInvitations(
      gameInvitations.map((invite) => {
        if (invite.id === inviteId) {
          return {
            ...invite,
            status: accept ? "accepted" : "declined",
          }
        }
        return invite
      }),
    )

    const invite = gameInvitations.find((i) => i.id === inviteId)
    if (invite) {
      const fromUser = users.find((u) => u.id === invite.from)

      // Add notification
      addNotification({
        type: "game",
        userId: invite.from,
        content: `You ${accept ? "accepted" : "declined"} ${fromUser ? fromUser.name + "'s" : ""} invitation to play ${invite.game}`,
        timestamp: new Date().toISOString(),
        read: true,
      })

      if (accept) {
        alert(`You accepted the invitation to play ${invite.game}! The game will start soon.`)
      }
    }
  }

  // Open game invite modal with pre-filled recipient
  const inviteToGame = (userId) => {
    setInviteUserId(userId)
    setShowGameInvite(true)
  }

  // Handle global search
  const handleGlobalSearch = (e) => {
    if (e.key === "Enter") {
      setGlobalSearchQuery(e.target.value)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-200 to-white transition-all duration-500">
      {/* Animated background particles */}
      {/* <div className="gaming-particles"></div> */}

      {/* Global styles */}
      <style jsx>{`
        /* Animated background */
        .gaming-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #c084fc 0%, #8b5cf6 100%);
          z-index: -1;
          animation: gradientAnimation 15s ease infinite;
          background-size: 400% 400%;
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Card hover effects */
        .card-hover {
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
        }

        /* Button animations */
        .btn-animated {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-animated:after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.5s ease;
        }

        .btn-animated:hover:after {
          left: 100%;
        }

        /* Icon animations */
        .icon-animated {
          transition: all 0.3s ease;
        }
        
        .icon-animated:hover {
          transform: scale(1.2);
          color: #6366f1;
        }

        /* Pulse animation for notifications */
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .pulse {
          animation: pulse 1.5s infinite;
        }

        /* Fade in animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }

        /* Slide down animation for modals */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .slide-down {
          animation: slideDown 0.3s ease forwards;
        }

        /* Responsive styles */
        @media (max-width: 640px) {
          .icon-nav {
            overflow-x: auto;
            padding-bottom: 8px;
          }
          
          .icon-nav::-webkit-scrollbar {
            height: 3px;
          }
          
          .icon-nav::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
          }
          
          .icon-button {
            min-width: 60px;
          }
        }

        /* Shimmer effect for loading states */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        /* Glow effect for important elements */
        .glow {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
          transition: box-shadow 0.3s ease;
        }
        
        .glow:hover {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
        }

        /* Notification dot */
        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 1px solid white;
        }
        
        /* Icon button hover effects */
        .icon-button {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .icon-button::after {
          content: '';
          position: absolute;
          bottom: -4px;
          width: 0;
          height: 2px;
          background-color: #6366f1;
          transition: width 0.3s ease;
        }
        
        .icon-button:hover::after {
          width: 70%;
        }

        /* Glass morphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
        }

        /* Modal styling for all popups */
        .modal-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 50;
          padding-top: 5rem;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 28rem;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 2px solid rgba(139, 92, 246, 0.3);
          animation: slideDown 0.3s ease forwards;
        }

        .modal-header {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          color: white;
        }

        .modal-header h3 {
          color: white !important;
          font-weight: 600;
        }

        .modal-header button {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }

        .modal-header button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .modal-body {
          padding: 1rem;
          overflow-y: auto;
          max-height: calc(85vh - 8rem);
          background-color: #f9fafb;
        }

        .modal-footer {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          background-color: white;
        }

        /* Search bar styling */
        .search-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 9999px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          background-color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #8b5cf6;
        }

        /* Create post styling */
        .create-post-card {
          background: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.9));
          border-radius: 1rem;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.1);
          border: 2px solid rgba(139, 92, 246, 0.2);
          overflow: hidden;
        }

        .create-post-header {
          background: linear-gradient(to right, #1e3a8a, #0f172a); /* from-blue-900 to-slate-800 */
          padding: 0.75rem 1rem;
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .create-post-body {
          padding: 1rem;
        }

        .create-post-textarea {
          width: 100%;
          min-height: 80px;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(139, 92, 246, 0.3);
          background-color: white;
          resize: none;
          transition: all 0.3s ease;
        }

        .create-post-textarea:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }

        .post-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem 0;
          border-top: 1px solid rgba(139, 92, 246, 0.2);
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }

        .post-option {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          background-color: rgba(139, 92, 246, 0.1);
          color: #6366f1;
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .post-option:hover {
          background-color: rgba(139, 92, 246, 0.2);
          transform: translateY(-2px);
        }

        .post-button {
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          color: white;
          font-weight: 500;
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
          transition: all 0.3s ease;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .post-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .post-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Recent posts styling */
        .recent-posts-header {
          background: linear-gradient(to right, #1e3a8a, #0f172a); /* from-blue-900 to-slate-800 */
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem 0.5rem 0 0;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .post-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 1px solid rgba(139, 92, 246, 0.2);
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(99, 102, 241, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
        }

        .post-header {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
          background: linear-gradient(to right, rgba(249, 250, 251, 0.8), white);
        }

        .post-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 9999px;
          margin-right: 0.75rem;
          border: 3px solid rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.15);
        }

        .post-author {
          font-weight: 600;
          color: #000000;
        }

        .post-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .post-content {
          padding: 1rem;
          color: #000000;
          line-height: 1.5;
          font-weight: 500;
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-top: 1px solid rgba(139, 92, 246, 0.1);
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .post-action {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #000000;
          transition: all 0.3s ease;
        }

        .post-action:hover {
          transform: scale(1.1);
        }

        .post-action.liked {
          color: #ef4444;
        }

        .post-comments {
          padding: 1rem;
        }

        .comment-form {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          background: rgba(249, 250, 251, 0.8);
          padding: 0.75rem;
          border-radius: 0.75rem;
        }

        .comment-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .comment-input:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }

        .comment-button {
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          color: white;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }

        .comment-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .comment-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Media elements responsive styling */
        .media-element {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        /* Ensure videos and GIFs are visible on mobile */
        video, img.gif {
          width: 100%;
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }

        /* Audio player styling for all devices */
        audio {
          width: 100%;
          max-width: 100%;
          margin: 10px 0;
        }

        /* Fix for icon navigation on mobile */
        @media (max-width: 640px) {
          .icon-nav {
            width: 100%;
            justify-content: flex-start;
            padding-left: 0;
            padding-right: 0;
          }
          
          .icon-button {
            min-width: 60px;
            margin-left: 0 !important;
          }
        }

        .post-comments h4 {
          color: #000000;
          font-weight: 600;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
          padding-bottom: 0.5rem;
          margin-bottom: 0.75rem;
        }
      `}</style>

      <div className="container max-w-md mx-auto p-4 pb-20 md:pb-4 mt-4 glass rounded-2xl bg-gradient-to-br from-blue-900/80 via-slate-900/80 to-blue-950/80">
        {/* Community Hub Header */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-2xl font-bold text-center text-white px-6 py-2 rounded-lg bg-gradient-to-r from-blue-900 to-slate-800 mx-auto inline-block shadow-md">
            Community Hub
          </h1>

          {/* Search Bar */}
          <div className=" text-black search-container w-full mt-4">
            <input
              type="text"
              className="search-input"
              placeholder="Search for people, posts, games..."
              onKeyDown={handleGlobalSearch}
            />
            <Search className="search-icon h-4 w-4" />
          </div>
        </div>

        {/* Icons below Community header */}
        <div className="flex justify-center  overflow-x-auto  icon-nav">
          <div className="flex space-x-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveSection("home")}
              className={`icon-button  md:ml-36  px-2 rounded-xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 ${
                activeSection === "home"
                  ? "bg-gradient-to-r from-blue-900 to-slate-800 text-white shadow-md transform scale-110"
                  : "text-gray-500 hover:bg-gray-200 hover:text-pink-600"
              }`}
              title="Home"
            >
              <Home size={20} className="transition-transform duration-300" />
              <span className="text-xs mt-1 font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveSection("topCoins")}
              className={`icon-button p-2 rounded-xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 ${
                activeSection === "topCoins"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md transform scale-110"
                  : "text-gray-500 hover:bg-yellow-100 hover:text-yellow-600"
              }`}
              title="Top Coins"
            >
              <Coins size={20} className="transition-transform duration-300 rounded-b-md rounded-t-none" />
              <span className="text-xs mt-1 font-medium">Coins</span>
            </button>

            <button
              onClick={() => setActiveSection("topFollowers")}
              className={`icon-button p-2 rounded-md w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 ${
                activeSection === "topFollowers"
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md transform scale-110"
                  : "text-gray-500 hover:bg-blue-100 hover:text-blue-600"
              }`}
              title="Top Followers"
            >
              <Users size={20} className="transition-transform duration-300" />
              <span className="text-xs mt-1 font-medium">Followers</span>
            </button>

            <button
              onClick={() => setActiveSection("achievements")}
              className={`icon-button p-2 rounded-xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 ${
                activeSection === "achievements"
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md transform scale-110"
                  : "text-gray-500 hover:bg-green-100 hover:text-green-600"
              }`}
              title="Achievements"
            >
              <Award size={20} className="transition-transform duration-300" />
              <span className="text-xs mt-1 font-medium">Awards</span>
            </button>

            <button
              onClick={() => {
                setShowUserList(false)
                setActiveSection("messages")
              }}
              className={`icon-button p-2 rounded-xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 ${
                activeSection === "messages"
                  ? "bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-md transform scale-110"
                  : "text-gray-500 hover:bg-pink-100 hover:text-pink-600"
              }`}
              title="Messages"
            >
              <MessageSquare size={20} className="transition-transform duration-300" />
              <span className="text-xs mt-1 font-medium">Chat</span>
            </button>
            <button
              onClick={() => {
                setShowUserList(false)
                setActiveSection("events")
                setShowEvents(true)
              }}
              className={`icon-button p-2 rounded-xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 ${
                activeSection === "events"
                  ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md transform scale-110"
                  : "text-gray-500 hover:bg-orange-100 hover:text-orange-600"
              }`}
              title="Events"
            >
              <CalendarIcon size={20} className="transition-transform duration-300" />
              <span className="text-xs mt-1 font-medium">Events</span>
            </button>

          

         



            <button
              onClick={() => {
                setActiveSection("users")
                setShowUserList(true)
              }}
              className={`icon-button p-2 rounded-xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 ${
                showUserList
                  ? "bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-md transform scale-110"
                  : "text-gray-500 hover:bg-pink-100 hover:text-pink-600"
              }`}
              title="Users"
            >
              <Users size={20} className="transition-transform duration-300" />
              <span className="text-xs mt-1 font-medium">Players</span>
            </button>

            <button
              onClick={() => {
                setShowUserList(false)
                setActiveSection("settings")
              }}
              className={`icon-button p-2 rounded-xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 ${
                activeSection === "settings"
                  ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md transform scale-110"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              }`}
              title="Settings"
            >
              <Settings size={20} className="transition-transform duration-300" />
              <span className="text-xs mt-1 font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Create Post Section - Always at the top */}
        <div className="create-post-card mb-4 text-black">
          <div className="create-post-header">
            <PlusCircle size={18} />
            <span>Create Post</span>
          </div>
          <div className="create-post-body">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="create-post-textarea"
            />

            {/* Attachment Preview */}
            {selectedFile && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between fade-in">
                <div className="flex items-center">
                  <div className="mr-2 text-indigo-500">
                    {selectedFile.type.includes("image") ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Screenshot Preview */}
            {screenshotPreview && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Screenshot Preview</span>
                  <button
                    onClick={() => setScreenshotPreview(null)}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="bg-black rounded-lg overflow-hidden">
                  <img
                    src={screenshotPreview || "/placeholder.svg"}
                    alt="Screenshot"
                    className="w-full object-contain max-h-[200px]"
                  />
                </div>
              </div>
            )}

            {/* Post Options */}
            <div className="post-options flex flex-wrap justify-center md:justify-start">
              <button
                onClick={() => {
                  setShowMediaOptions(!showMediaOptions)
                  setMediaType(null)
                }}
                className="post-option"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden xs:inline-block">Add Media</span>
              </button>

              <button onClick={() => alert("Live streaming feature coming soon!")} className="post-option">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                  <circle cx="12" cy="15" r="3" fill="currentColor" />
                </svg>
                <span className="hidden xs:inline-block">Go Live</span>
              </button>

              <button onClick={() => setShowPollCreator(!showPollCreator)} className="post-option">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden xs:inline-block">Poll</span>
              </button>

              <button onClick={() => setShowTagPeople(!showTagPeople)} className="post-option">
                <Tag className="h-4 w-4" />
                <span className="hidden xs:inline-block">Tag</span>
              </button>

              <button onClick={() => setShowScheduler(!showScheduler)} className="post-option">
                <Calendar className="h-4 w-4" />
                <span className="hidden xs:inline-block">Schedule</span>
              </button>
            </div>

            {/* Media Options Panel */}
            {showMediaOptions && (
              <div className="bg-white rounded-lg p-3 shadow-md mb-3 fade-in">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => {
                      setMediaType("photo")
                      if (imageInputRef.current) imageInputRef.current.click()
                    }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${mediaType === "photo" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    <ImageIcon size={16} />
                    <span>Photo</span>
                  </button>

                  <button
                    onClick={() => {
                      setMediaType("video")
                      if (videoInputRef.current) videoInputRef.current.click()
                    }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${mediaType === "video" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    <Film size={16} />
                    <span>Video</span>
                  </button>

                  <button
                    onClick={() => {
                      setMediaType("music")
                      if (musicInputRef.current) musicInputRef.current.click()
                    }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${mediaType === "music" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    <Music size={16} />
                    <span>Music</span>
                  </button>

                  <button
                    onClick={() => setMediaType("background")}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${mediaType === "background" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    <Palette size={16} />
                    <span>Background</span>
                  </button>
                  <div className="p-4">
                    <button
                      onClick={() => setMediaType(mediaType === "gif" ? "" : "gif")}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                        mediaType === "gif" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Gif size={16} />
                      <span>GIF</span>
                    </button>

                    {mediaType === "gif" && (
                      <div className="mt-3 p-3 bg-white rounded-lg shadow-md w-[300px]">
                        <input
                          type="text"
                          placeholder="Search GIFs"
                          className="w-full px-2 py-1 mb-2 border rounded"
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                          {gifs.map((gif) => (
                            <img
                              key={gif.id}
                              src={gif.images.fixed_width_small.url || "/placeholder.svg"}
                              alt={gif.title}
                              className="cursor-pointer rounded hover:scale-105 transition"
                              onClick={() => {
                                setSelectedGif(gif.images.original.url)
                                setMediaType("")
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedGif && (
                      <div className="mt-4">
                        <p className="mb-2 font-semibold">Selected GIF:</p>
                        <img
                          src={selectedGif || "/placeholder.svg"}
                          alt="Selected GIF"
                          className="rounded-lg max-w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0])
                      setMediaType("photo")
                    }
                  }}
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0])
                      setMediaType("video")
                    }
                  }}
                />
                <input
                  type="file"
                  ref={musicInputRef}
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0])
                      setMediaType("music")
                      // Create object URL for preview
                      const url = URL.createObjectURL(e.target.files[0])
                      setMusicUrl(url)
                    }
                  }}
                />

                {/* Media type specific options */}
                {mediaType === "background" && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 fade-in">
                    {backgroundOptions.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setSelectedBackground(bg)}
                        className={`h-12 rounded-lg ${bg.color} transition-all hover:scale-105 ${selectedBackground?.id === bg.id ? "ring-2 ring-indigo-600 ring-offset-2" : ""}`}
                        title={bg.name}
                      ></button>
                    ))}
                  </div>
                )}

                {mediaType === "gif" && (
                  <div className="mt-3 fade-in">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste GIF URL here"
                        className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                        value={gifUrl}
                        onChange={(e) => setGifUrl(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          if (gifUrl) {
                            // In a real app, you would validate the URL
                            alert("GIF added to your post!")
                          }
                        }}
                        className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
                        disabled={!gifUrl}
                      >
                        Add
                      </button>
                    </div>
                    {gifUrl && (
                      <div className="mt-2 bg-gray-100 rounded-lg p-2 text-center">
                        <img
                          src={gifUrl || "/placeholder.svg"}
                          alt="GIF preview"
                          className="max-h-40 mx-auto rounded"
                          onError={() => alert("Invalid GIF URL. Please try another.")}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Media Previews */}
            {selectedFile && mediaType === "photo" && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Photo Preview</span>
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setMediaType(null)
                    }}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="bg-black rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                    alt="Photo preview"
                    className="w-full object-contain max-h-[200px]"
                  />
                </div>
              </div>
            )}

            {selectedFile && mediaType === "video" && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Video Preview</span>
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setMediaType(null)
                    }}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    src={URL.createObjectURL(selectedFile)}
                    controls
                    className="w-full max-h-[200px]"
                  />
                </div>
              </div>
            )}

            {selectedFile && mediaType === "music" && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Music: {selectedFile.name}</span>
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setMediaType(null)
                      setMusicUrl("")
                    }}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <audio ref={audioRef} src={musicUrl} controls className="w-full" />
              </div>
            )}

            {selectedBackground && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Background: {selectedBackground.name}</span>
                  <button
                    onClick={() => {
                      setSelectedBackground(null)
                      setMediaType(null)
                    }}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className={`h-12 rounded-lg ${selectedBackground.color}`}></div>
              </div>
            )}

            {gifUrl && mediaType === "gif" && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">GIF</span>
                  <button
                    onClick={() => {
                      setGifUrl("")
                      setMediaType(null)
                    }}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="bg-black rounded-lg overflow-hidden">
                  <img src={gifUrl || "/placeholder.svg"} alt="GIF" className="w-full object-contain max-h-[200px]" />
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex justify-between items-center mt-3">
              {isScheduled && scheduleDate && scheduleTime && (
                <div className="flex items-center text-sm text-indigo-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
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
                  Scheduled for {scheduleDate} at {scheduleTime}
                  <button
                    onClick={() => setIsScheduled(false)}
                    className="ml-1 text-gray-500 hover:text-red-500 transition-colors duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className={isScheduled ? "" : "ml-auto"}>
                <button
                  onClick={createPost}
                  disabled={
                    !newPostContent.trim() &&
                    !selectedFile &&
                    !screenshotPreview &&
                    !hasPoll &&
                    !selectedBackground &&
                    !gifUrl
                  }
                  className="post-button"
                >
                  <Send className="h-3 w-3" />
                  {isScheduled ? "Schedule Post" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Changes based on active section */}
        {activeSection === "home" && (
          <>
            {/* Posts Feed */}
            <div className="space-y-4 mb-6">
              <div className="recent-posts-header">
                <MessageCircle size={18} />
                <span>Recent Posts</span>
                <div className="ml-auto flex items-center ">
                  <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-full">{posts.length}</span>
                </div>
              </div>
              {posts.length > 0 ? (
                posts.map((post) => {
                  const author = users.find((u) => u.id === post.userId) || {
                    name: "Unknown User",
                    avatar: "/placeholder.svg",
                  }
                  return (
                    <div key={post.id} className="post-card mt-4 text-black">
                      {/* Post header */}
                      <div className="post-header">
                        <img
                          src={author.avatar || "/placeholder.svg"}
                          alt={`${author.name}'s avatar`}
                          className="post-avatar"
                          onClick={() => handleProfileClick(author.id)}
                        />
                        <div>
                          <h3 className="post-author">{author.name}</h3>
                          <p className="post-time">{formatDate(post.timestamp)}</p>
                        </div>
                      </div>

                      {/* Post content */}
                      <div
                        className={`post-content ${post.backgroundStyle ? post.backgroundStyle + " text-white p-4 rounded-lg my-2" : ""}`}
                      >
                        <p>{post.content}</p>

                        {/* Render different media types */}
                        {post.mediaType === "photo" && post.hasAttachment && (
                          <div className="mt-3 bg-black rounded-lg overflow-hidden">
                            <img
                              src="/placeholder.svg?height=400&width=600"
                              alt="Photo"
                              className="w-full object-contain max-h-[300px]"
                            />
                          </div>
                        )}

                        {post.mediaType === "video" && post.hasAttachment && (
                          <div className="mt-3 bg-black rounded-lg overflow-hidden">
                            <video
                              src="/placeholder.svg?height=400&width=600"
                              controls
                              className="w-full max-h-[300px]"
                            />
                          </div>
                        )}

                        {post.mediaType === "music" && post.hasAttachment && (
                          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Music className="h-5 w-5 text-indigo-500" />
                              <span className="text-sm font-medium">{post.attachmentName || "Audio Track"}</span>
                            </div>
                            <audio controls className="w-full" />
                          </div>
                        )}

                        {post.mediaType === "gif" && post.gifUrl && (
                          <div className="mt-3 bg-black rounded-lg overflow-hidden">
                            <img
                              src={post.gifUrl || "/placeholder.svg?height=400&width=600"}
                              alt="GIF"
                              className="w-full object-contain max-h-[300px]"
                            />
                          </div>
                        )}
                      </div>

                      {/* Post actions */}
                      <div className="post-actions">
                        <button
                          onClick={() => toggleLikePost(post.id)}
                          className={`post-action ${post.likes.includes(1) ? "liked" : ""}`}
                        >
                          <Heart className="h-5 w-5" fill={post.likes.includes(1) ? "currentColor" : "none"} />
                          <span>{post.likes.length}</span>
                        </button>

                        <button onClick={() => startChat(post.userId)} className="post-action">
                          <MessageCircle className="h-5 w-5" />
                          <span>Chat</span>
                        </button>
                      </div>

                      {/* Comments section */}
                      <div className="post-comments">
                        {/* Comment list */}
                        {postComments[post.id] && postComments[post.id].length > 0 && (
                          <div className="space-y-2 mb-3">
                            <h4 className="text-sm font-medium text-gray-700">
                              {postComments[post.id].length} Comment{postComments[post.id].length !== 1 && "s"}
                            </h4>
                            {postComments[post.id].map((comment) => {
                              const commentAuthor = users.find((u) => u.id === comment.userId) || {
                                name: "Unknown User",
                                avatar: "/placeholder.svg",
                              }
                              return (
                                <div key={comment.id} className="flex space-x-2 fade-in">
                                  <img
                                    src={commentAuthor.avatar || "/placeholder.svg"}
                                    alt=""
                                    className="w-8 h-8 rounded-full transition-transform duration-300 hover:scale-110"
                                    onClick={() => handleProfileClick(commentAuthor.id)}
                                  />
                                  <div className="flex-1 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors duration-300">
                                    <div className="flex justify-between items-start">
                                      <h5 className="text-sm font-medium">{commentAuthor.name}</h5>
                                      <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Add comment */}
                        <div className="comment-form">
                          <input
                            type="text"
                            value={newPostComment[post.id] || ""}
                            onChange={(e) => setNewPostComment({ ...newPostComment, [post.id]: e.target.value })}
                            placeholder="Write a comment..."
                            className="comment-input"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newPostComment[post.id]?.trim()) {
                                addPostComment(post.id)
                              }
                            }}
                          />
                          <button
                            onClick={() => addPostComment(post.id)}
                            disabled={!newPostComment[post.id]?.trim()}
                            className="comment-button"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow card-hover">
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === "topCoins" && (
          <div className="bg-white text-black rounded-md shadow-md overflow-hidden mb-6 card-hover border-2 border-yellow-200">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 border-b">
              <h2 className="font-semibold text-amber-800">Top Coins</h2>
            </div>
            <div className="divide-y">
              {users.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center px-4 py-2 hover:bg-yellow-50 transition-colors duration-300"
                >
                  <div className="w-8 text-center font-bold text-amber-500">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                  </div>
                  <div className="flex items-center flex-1">
                    <div className="relative flex-shrink-0">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt=""
                        className="w-8 h-8 rounded-full mr-3 cursor-pointer transition-transform duration-300 hover:scale-110 border-2 border-transparent hover:border-amber-300"
                        onClick={() => handleProfileClick(user.id)}
                      />
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white pulse"></div>
                      )}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="text-amber-500 font-bold flex items-center">
                    {user.coins.toLocaleString()} <span className="ml-1">🪙</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "topFollowers" && (
          <div className="bg-white rounded-md shadow-md overflow-hidden mb-6 card-hover border-2 border-blue-200">
            <div className="bg-gradient-to-r  rounded-b-md rounded-t-none from-purple-50 to-blue-50 px-4 py-2 border-b">
              <h2 className="font-semibold text-purple-800">Top Followers</h2>
            </div>
            <div className="divide-y">
              {[...users]
                .sort((a, b) => b.followers - a.followers)
                .slice(0, 5)
                .map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center px-4 py-2 hover:bg-purple-50 transition-colors duration-300"
                  >
                    <div className="w-8 text-center font-bold text-purple-500">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt=""
                          className="w-8 h-8 rounded-full mr-3 cursor-pointer transition-transform duration-300 hover:scale-110 border-2 border-transparent hover:border-purple-300"
                          onClick={() => handleProfileClick(user.id)}
                        />
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white pulse"></div>
                        )}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="text-purple-500 font-bold flex items-center">
                      {user.followers.toLocaleString()} <span className="ml-1">👥</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeSection === "achievements" && (
          <div className="bg-white rounded-md shadow-md overflow-hidden mb-6 card-hover border-2 border-green-200">
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-emerald-800">Achievements</h3>
              </div>
            </div>
            <div className="p-4">
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white rounded-lg shadow-md p-3 flex items-center space-x-3 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <div
                        className={`${achievementCategories.find((c) => c.id === achievement.category)?.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-xl`}
                      >
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No achievements yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "messages" && (
          <div className="bg-white rounded-md shadow-md p-4 mb-6 card-hover border-2 border-pink-200">
            <h2 className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 mb-4">
              Messages
            </h2>
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-pink-50 cursor-pointer transition-all duration-300"
                onClick={() => startChat(user.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt=""
                      className="w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110 border-2 border-transparent hover:border-pink-300"
                    />
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white pulse"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">Last message: Hi there!</p>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">2 hours ago</div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "settings" && (
          <div className="bg-white rounded-md shadow-md p-4 mb-6 card-hover border-2 border-gray-200">
            <h2 className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-slate-600 mb-4">
              Settings
            </h2>
            <p className="text-gray-600">Account settings and preferences will be available here.</p>
          </div>
        )}

        {activeSection === "events" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 card-hover border-2 border-orange-200">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 border-b flex justify-between items-center">
              <h2 className="font-semibold text-orange-800">Upcoming Events</h2>
              <button
                onClick={() => setShowCreateEvent(true)}
                className="px-2 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition-colors duration-300 flex items-center"
              >
                <PlusCircle size={14} className="mr-1" /> Create
              </button>
            </div>
            <div className="divide-y">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-orange-50 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-orange-800">{event.title}</h3>
                      <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Location: {event.location}</div>
                      <div className="flex -space-x-2">
                        {event.participants.map((userId) => (
                          <img
                            key={userId}
                            src={users.find((u) => u.id === userId)?.avatar || "/placeholder.svg"}
                            alt="Participant"
                            className="w-6 h-6 rounded-full border border-white"
                          />
                        ))}
                        <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-xs text-orange-800 border border-white">
                          +{event.participants.length}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">No upcoming events. Create one!</div>
              )}
            </div>
          </div>
        )}

        {activeSection === "announcements" && (
          <div className="bg-white rounded-md shadow-md overflow-hidden mb-6 card-hover border-2 border-red-200">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-2 border-b flex justify-between items-center">
              <h2 className="font-semibold text-red-800">Important Announcements</h2>
              <button
                onClick={() => setShowCreateAnnouncement(true)}
                className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors duration-300 flex items-center"
              >
                <PlusCircle size={14} className="mr-1" /> Create
              </button>
            </div>
            <div className="divide-y">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 ${announcement.isPinned ? "bg-red-50" : ""} hover:bg-red-50 transition-colors duration-300`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {announcement.isPinned && (
                          <span className="mr-2 text-red-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                        <h3 className="font-bold text-red-800">{announcement.title}</h3>
                      </div>
                      <div className="text-xs text-gray-500">{formatDate(announcement.createdAt)}</div>
                    </div>
                    <p className="text-gray-600 mb-3">{announcement.content}</p>
                    {announcement.imageUrl && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img
                          src={announcement.imageUrl || "/placeholder.svg"}
                          alt={announcement.title}
                          className="w-full object-cover h-40"
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          src={users.find((u) => u.id === announcement.createdBy)?.avatar || "/placeholder.svg"}
                          alt="Author"
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          Posted by {users.find((u) => u.id === announcement.createdBy)?.name || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">No announcements yet.</div>
              )}
            </div>
          </div>
        )}

        {/* User List */}
        {showUserList && (
          <div className="bg-white rounded-md shadow-md p-4 mb-6 card-hover fade-in border-2 border-purple-200">
            <h2 className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
              User List
            </h2>
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-indigo-50 cursor-pointer transition-all duration-300"
                onClick={() => startChat(user.id)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-indigo-300 transition-all duration-300"
                  />
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">Followers: {user.followers}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFollow(user.id)
                    }}
                    className={`px-2 py-1 rounded-lg text-xs transition-all duration-300 ${
                      isFollowing(user.id)
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:scale-105"
                    }`}
                  >
                    {isFollowing(user.id) ? "Unfollow" : "Follow"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startChat(user.id)
                    }}
                    className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors duration-300 hover:scale-110"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Modal */}
        {activeChatUser && (
          <div className="modal-container fade-in">
            <div className="modal-content glass slide-down">
              <div className="modal-header">
                <div className="flex items-center space-x-3">
                  <img
                    src={users.find((u) => u.id === activeChatUser)?.avatar || "/placeholder.svg"}
                    alt=""
                    className="w-8 h-8 rounded-full transition-transform duration-300 hover:scale-110"
                  />
                  <h3 className="font-semibold text-indigo-800">
                    {users.find((u) => u.id === activeChatUser)?.name || "Unknown User"}
                  </h3>
                </div>
                <button
                  onClick={closeChat}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-body">
                {chatMessages[activeChatUser] &&
                  chatMessages[activeChatUser].map((message) => (
                    <div
                      key={message.id}
                      className={`mb-3 p-2 rounded-lg ${
                        message.sender === "me"
                          ? "bg-gradient-to-r from-indigo-100 to-purple-100 ml-auto text-right transform hover:scale-105"
                          : "bg-gray-100 mr-auto transform hover:scale-105"
                      } transition-all duration-300`}
                      style={{ maxWidth: "80%" }}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(message.timestamp)}</p>
                    </div>
                  ))}
                <div ref={chatEndRef} />
              </div>

              <div className="modal-footer">
                <div className="flex space-x-2 w-full">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && currentMessage.trim()) {
                        sendChatMessage()
                      }
                    }}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!currentMessage.trim()}
                    className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 btn-animated"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {viewingProfile && (
          <div className="modal-container fixed inset-0 bg-black/50 flex items-center justify-center z-50 fade-in">
            <div className="modal-content glass slide-down bg-white/90 backdrop-blur-md rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="modal-header flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold text-indigo-800">Profile</h3>
                <button
                  onClick={closeProfileModal}
                  className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors duration-300"
                  aria-label="Close profile"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-body">
                {/* User Info */}
                <div className="flex items-center space-x-4 mb-6 relative">
                  <img
                    src={users.find((u) => u.id === viewingProfile)?.avatar || "/placeholder.svg"}
                    alt=""
                    className="w-16 h-16 rounded-full border-2 border-indigo-100 glow transition-all duration-300 hover:scale-110"
                  />
                  <div>
                    <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      {users.find((u) => u.id === viewingProfile)?.name || "Unknown User"}
                    </h3>
                    <p className="text-indigo-600 font-medium">Level: {getUserLevel(getUserXP(viewingProfile))}</p>
                  </div>
                </div>

                {/* Player Stats */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-indigo-700 border-b pb-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
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
                  <div className="flex flex-wrap gap-2 justify-between mt-6 border-t pt-4">
                    <button
                      onClick={() => startChat(viewingProfile)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center transform hover:scale-105 btn-animated"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" /> Chat
                    </button>
                    <button
                      onClick={() => toggleFollow(viewingProfile)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center transform hover:scale-105 ${
                        isFollowing(viewingProfile)
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600"
                      }`}
                    >
                      {isFollowing(viewingProfile) ? (
                        <>
                          <X className="h-4 w-4 mr-1" /> Unfollow
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 mr-1" /> Follow
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => inviteToGame(viewingProfile)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center transform hover:scale-105 btn-animated"
                    >
                      <Trophy className="h-4 w-4 mr-1" /> Invite
                    </button>
                  </div>
                </div>
                {playerStats[viewingProfile] ? (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all duration-300 hover:bg-gray-100 transform hover:scale-105">
                      <div className="text-xs text-gray-500 mb-1">Matches Played</div>
                      <div className="font-bold text-lg">{playerStats[viewingProfile].matchesPlayed}</div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg hover:shadow-md transition-all duration-300 hover:bg-green-100 transform hover:scale-105">
                      <div className="text-xs text-gray-500 mb-1">Wins</div>
                      <div className="font-bold text-lg text-green-600">{playerStats[viewingProfile].wins}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg hover:shadow-md transition-all duration-300 hover:bg-red-100 transform hover:scale-105">
                      <div className="text-xs text-gray-500 mb-1">Losses</div>
                      <div className="font-bold text-lg text-red-600">{playerStats[viewingProfile].losses}</div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg hover:shadow-md transition-all duration-300 hover:bg-indigo-100 transform hover:scale-105">
                      <div className="text-xs text-gray-500 mb-1">Win Rate</div>
                      <div className="font-bold text-lg text-indigo-600">{playerStats[viewingProfile].winRate}</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg hover:shadow-md transition-all duration-300 hover:bg-yellow-100 transform hover:scale-105">
                      <div className="text-xs text-gray-500 mb-1">Best Score</div>
                      <div className="font-bold text-lg text-yellow-600">{playerStats[viewingProfile].bestScore}</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg hover:shadow-md transition-all duration-300 hover:bg-purple-100 transform hover:scale-105">
                      <div className="text-xs text-gray-500 mb-1">Rank</div>
                      <div className="font-bold text-lg text-purple-600">{playerStats[viewingProfile].rank}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No stats available</p>
                )}
                {/* Actions */}

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-indigo-700 border-b pb-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
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
                  {userBadges[viewingProfile] && userBadges[viewingProfile].length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {userBadges[viewingProfile].map((achievementId) => {
                        const achievement = getAchievementById(achievementId)
                        return (
                          achievement && (
                            <div
                              key={achievement.id}
                              className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                            >
                              <div
                                className={`text-2xl mb-2 ${achievementCategories.find((c) => c.id === achievement.category)?.color.replace("bg-", "text-")}`}
                              >
                                {achievement.icon}
                              </div>
                              <p className="text-xs font-medium text-center">{achievement.name}</p>
                              <p className="text-xs text-gray-500 text-center mt-1">{achievement.description}</p>
                            </div>
                          )
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No achievements yet</p>
                  )}
                </div>

                {/* Gaming History */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-indigo-700 border-b pb-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
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
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-green-50">
                      <div>
                        <div className="text-sm font-medium">Chess Match</div>
                        <div className="text-xs text-gray-500">
                          vs. {users[Math.floor(Math.random() * users.length)]?.name}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Won</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-amber-50">
                      <div>
                        <div className="text-sm font-medium">Poker Tournament</div>
                        <div className="text-xs text-gray-500">8 players</div>
                      </div>
                      <div className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        3rd Place
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-50">
                      <div>
                        <div className="text-sm font-medium">Racing Challenge</div>
                        <div className="text-xs text-gray-500">Time Trial</div>
                      </div>
                      <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        New Record
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
              </div>
            </div>
          </div>
        )}

        {/* Game Invite Modal */}
        {showGameInvite && (
          <div className="modal-container fade-in">
            <div className="modal-content glass slide-down">
              <div className="modal-header">
                <h3 className="font-semibold text-emerald-800">Invite to Game</h3>
                <button
                  onClick={() => setShowGameInvite(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-body">
                <div className="mb-4">
                  <label htmlFor="game" className="block text-gray-700 text-sm font-bold mb-2">
                    Select Game
                  </label>
                  <div className="relative">
                    <select
                      id="game"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-300"
                      value={selectedGame || ""}
                      onChange={(e) => setSelectedGame(Number.parseInt(e.target.value))}
                    >
                      <option value="" disabled>
                        Select a game
                      </option>
                      {gameOptions.map((game) => (
                        <option key={game.id} value={game.id}>
                          {game.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={sendGameInvite}
                  disabled={!inviteUserId || !selectedGame}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 btn-animated"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Poll Creator Modal */}
        {showPollCreator && (
          <div className="modal-container fade-in">
            <div className="modal-content glass slide-down">
              <div className="modal-header">
                <h3 className="font-semibold text-indigo-800">Create Poll</h3>
                <button
                  onClick={() => setShowPollCreator(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-body">
                <div className="mb-4">
                  <label htmlFor="pollQuestion" className="block text-gray-700 text-sm font-bold mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    id="pollQuestion"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
                    placeholder="Enter your question"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Options</label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 mr-2"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...pollOptions]
                          newOptions[index] = e.target.value
                          setPollOptions(newOptions)
                        }}
                      />
                      {index > 1 && (
                        <button
                          onClick={() => {
                            const newOptions = [...pollOptions]
                            newOptions.splice(index, 1)
                            setPollOptions(newOptions)
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors duration-300 p-1 rounded-full hover:bg-red-50"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setPollOptions([...pollOptions, ""])}
                    className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Option
                  </button>
                </div>

                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-indigo-600 transition-colors duration-300"
                      checked={allowMultipleVotes}
                      onChange={() => setAllowMultipleVotes(!allowMultipleVotes)}
                    />
                    <span className="ml-2 text-gray-700 text-sm">Allow Multiple Votes</span>
                  </label>
                </div>

                <button
                  onClick={addPollToPost}
                  disabled={!pollQuestion.trim() || pollOptions.some((opt) => !opt.trim())}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 btn-animated"
                >
                  Add Poll
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tag People Modal */}
        {showTagPeople && (
          <div className="modal-container fade-in">
            <div className="modal-content glass slide-down text-black">
              <div className="modal-header">
                <h3 className="font-semibold text-blue-800">Tag People</h3>
                <button
                  onClick={() => setShowTagPeople(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-body">
                <div className="mb-4">
                  <label htmlFor="tagSearch" className="block text-gray-700 text-sm font-bold mb-2">
                    Search Users
                  </label>
                  <input
                    type="text"
                    id="tagSearch"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
                    placeholder="Search for users"
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Suggested Users</label>
                  <div className="max-h-40 overflow-y-auto rounded-lg border">
                    {users
                      .filter((user) => user.name.toLowerCase().includes(tagSearchQuery.toLowerCase()))
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between py-2 px-3 border-b last:border-b-0 hover:bg-blue-50 cursor-pointer transition-all duration-300"
                          onClick={() => {
                            if (!taggedPeople.find((tagged) => tagged.id === user.id)) {
                              setTaggedPeople([...taggedPeople, user])
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt=""
                              className="w-8 h-8 rounded-full transition-transform duration-300 hover:scale-110"
                            />
                            <h4 className="font-medium">{user.name}</h4>
                          </div>
                          <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors duration-300 transform hover:scale-110">
                            Tag
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tagged People</label>
                  {taggedPeople.length > 0 ? (
                    <div className="space-y-2">
                      {taggedPeople.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <img src={user.avatar || "/placeholder.svg"} alt="" className="w-8 h-8 rounded-full" />
                            <h4 className="font-medium">{user.name}</h4>
                          </div>
                          <button
                            onClick={() => setTaggedPeople(taggedPeople.filter((tagged) => tagged.id !== user.id))}
                            className="text-red-500 hover:text-red-700 transition-colors duration-300 p-1 rounded-full hover:bg-red-50"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No one tagged yet</p>
                  )}
                </div>

                <button
                  onClick={() => setShowTagPeople(false)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 btn-animated"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Scheduler Modal */}
        {showScheduler && (
          <div className="modal-container fade-in">
            <div className="modal-content glass slide-down">
              <div className="modal-header">
                <h3 className="font-semibold text-purple-800">Schedule Game Session</h3>
                <button
                  onClick={() => setShowScheduler(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-body">
                <div className="mb-4">
                  <label htmlFor="gameSelect" className="block text-gray-700 text-sm font-bold mb-2">
                    Select Game
                  </label>
                  <div className="relative">
                    <select
                      id="gameSelect"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all duration-300"
                      value={selectedGame || ""}
                      onChange={(e) => setSelectedGame(Number.parseInt(e.target.value))}
                    >
                      <option value="" disabled>
                        Select a game
                      </option>
                      {gameOptions.map((game) => (
                        <option key={game.id} value={game.id}>
                          {game.icon} {game.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Invite Players</label>
                  <div className="max-h-32 overflow-y-auto mb-2 border rounded-lg">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center p-2 hover:bg-purple-50 border-b last:border-b-0 transition-colors duration-300"
                      >
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          className="mr-2 h-4 w-4 text-purple-600 transition-colors duration-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTaggedPeople([...taggedPeople, user])
                            } else {
                              setTaggedPeople(taggedPeople.filter((p) => p.id !== user.id))
                            }
                          }}
                          checked={taggedPeople.some((p) => p.id === user.id)}
                        />
                        <label htmlFor={`user-${user.id}`} className="flex items-center cursor-pointer flex-1">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt=""
                            className="w-6 h-6 rounded-full mr-2 transition-transform duration-300 hover:scale-110"
                          />
                          <span className="text-sm">{user.name}</span>
                        </label>
                        {user.isOnline && (
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full pulse"></span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {taggedPeople.length} player{taggedPeople.length !== 1 ? "s" : ""} selected
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="scheduleDate" className="block text-gray-700 text-sm font-bold mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      id="scheduleDate"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all duration-300"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="scheduleTime" className="block text-gray-700 text-sm font-bold mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      id="scheduleTime"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all duration-300"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="sessionNotes" className="block text-gray-700 text-sm font-bold mb-2">
                    Session Notes
                  </label>
                  <textarea
                    id="sessionNotes"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all duration-300"
                    placeholder="Add notes about the game session..."
                    rows={3}
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setShowScheduler(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (taggedPeople.length > 0 && selectedGame && scheduleDate && scheduleTime) {
                        // Create game invitations for all tagged people
                        const game = gameOptions.find((g) => g.id === selectedGame)
                        taggedPeople.forEach((user) => {
                          // Create invitation
                          const newInvitation = {
                            id: gameInvitations.length + 1,
                            to: user.id,
                            from: 1, // Current user
                            game: game?.name || "Unknown Game",
                            timestamp: new Date().toISOString(),
                            scheduledFor: `${scheduleDate} ${scheduleTime}`,
                            status: "pending",
                          }

                          // Add to invitations
                          setGameInvitations((prev) => [...prev, newInvitation])

                          // Add notification
                          addNotification({
                            type: "game",
                            userId: user.id,
                            content: `You scheduled a game of ${game?.name} with ${user.name} on ${scheduleDate} at ${scheduleTime}`,
                            timestamp: new Date().toISOString(),
                            read: true,
                          })
                        })

                        alert(
                          `Game session scheduled with ${taggedPeople.length} player(s) for ${scheduleDate} at ${scheduleTime}`,
                        )
                        setShowScheduler(false)
                        setTaggedPeople([])
                        setSelectedGame(null)
                        setScheduleDate("")
                        setScheduleTime("")
                      } else {
                        alert("Please select a game, at least one player, and set a date and time")
                      }
                    }}
                    disabled={!selectedGame || taggedPeople.length === 0 || !scheduleDate || !scheduleTime}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg text-sm hover:from-pink-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 btn-animated"
                  >
                    Schedule Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="modal-container fade-in">
          <div className="modal-content glass slide-down">
            <div className="modal-header">
              <h3 className="font-semibold text-orange-800">Create New Event</h3>
              <button
                onClick={() => setShowCreateEvent(false)}
                className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="modal-body">
              <div className="mb-4">
                <label htmlFor="eventTitle" className="block text-gray-700 text-sm font-bold mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  id="eventTitle"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-300"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="eventDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-300"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="eventTime" className="block text-gray-700 text-sm font-bold mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-300"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="eventLocation" className="block text-gray-700 text-sm font-bold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-300"
                  placeholder="Enter event location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="eventDescription" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  id="eventDescription"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-300"
                  placeholder="Describe your event"
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Invite Participants</label>
                <div className="max-h-32 overflow-y-auto mb-2 border rounded-lg">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-2 hover:bg-orange-50 border-b last:border-b-0 transition-colors duration-300"
                    >
                      <input
                        type="checkbox"
                        id={`event-user-${user.id}`}
                        className="mr-2 h-4 w-4 text-orange-600 transition-colors duration-300"
                      />
                      <label htmlFor={`event-user-${user.id}`} className="flex items-center cursor-pointer flex-1">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt=""
                          className="w-6 h-6 rounded-full mr-2 transition-transform duration-300 hover:scale-110"
                        />
                        <span className="text-sm">{user.name}</span>
                      </label>
                      {user.isOnline && <span className="inline-block w-2 h-2 bg-green-500 rounded-full pulse"></span>}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (newEvent.title && newEvent.date && newEvent.time) {
                    const createdEvent = {
                      id: events.length + 1,
                      ...newEvent,
                      participants: [1, 2, 3].sort(() => Math.random() - 0.5),
                    }
                    setEvents([...events, createdEvent])
                    setNewEvent({
                      title: "",
                      date: "",
                      time: "",
                      description: "",
                      location: "",
                    })
                    setShowCreateEvent(false)
                    alert("Event created successfully!")
                  } else {
                    alert("Please fill in all required fields")
                  }
                }}
                disabled={!newEvent.title || !newEvent.date || !newEvent.time}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm hover:from-orange-600 hover:to-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 btn-animated"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateAnnouncement && (
        <div className="modal-container fade-in">
          <div className="modal-content glass slide-down">
            <div className="modal-header">
              <h3 className="font-semibold text-red-800">Create Announcement</h3>
              <button
                onClick={() => setShowCreateAnnouncement(false)}
                className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="modal-body">
              <div className="mb-4">
                <label htmlFor="announcementTitle" className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="announcementTitle"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-300"
                  placeholder="Enter announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="announcementContent" className="block text-gray-700 text-sm font-bold mb-2">
                  Content
                </label>
                <textarea
                  id="announcementContent"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-300"
                  placeholder="Write your announcement"
                  rows={4}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Image (Optional)</label>
                <div className="flex items-center">
                  <button
                    onClick={() => announcementImageRef.current?.click()}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-all duration-300"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={announcementImageRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAnnouncementImage(e.target.files[0])
                        setNewAnnouncement({
                          ...newAnnouncement,
                          imageUrl: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                    }}
                  />
                  {announcementImage && (
                    <span className="ml-2 text-sm text-gray-600">
                      {announcementImage.name} ({formatFileSize(announcementImage.size)})
                    </span>
                  )}
                </div>
                {newAnnouncement.imageUrl && (
                  <div className="mt-2 relative">
                    <img
                      src={newAnnouncement.imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setAnnouncementImage(null)
                        setNewAnnouncement({ ...newAnnouncement, imageUrl: null })
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-red-600 transition-colors duration-300"
                    checked={newAnnouncement.isPinned}
                    onChange={() => setNewAnnouncement({ ...newAnnouncement, isPinned: !newAnnouncement.isPinned })}
                  />
                  <span className="ml-2 text-gray-700 text-sm">Pin this announcement</span>
                </label>
              </div>

              <button
                onClick={() => {
                  if (newAnnouncement.title && newAnnouncement.content) {
                    const createdAnnouncement = {
                      id: announcements.length + 1,
                      ...newAnnouncement,
                      createdAt: new Date().toISOString(),
                      createdBy: 1, // Current user
                    }
                    setAnnouncements([createdAnnouncement, ...announcements])
                    setNewAnnouncement({
                      title: "",
                      content: "",
                      isPinned: false,
                      imageUrl: null,
                    })
                    setAnnouncementImage(null)
                    setShowCreateAnnouncement(false)
                    alert("Announcement created successfully!")
                  } else {
                    alert("Please fill in all required fields")
                  }
                }}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm hover:from-red-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 btn-animated"
              >
                Post Announcement
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile menu toggle */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-3 shadow-lg"
      >
        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  )
}
