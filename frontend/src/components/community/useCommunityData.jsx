import { useState, useEffect } from "react"

// Mock data for the community
const initialUsers = [
  { id: 1, name: "Alex", avatar: "/avatars/alex.jpg", coins: 1500, followers: 120, isOnline: true, xp: 3200 },
  { id: 2, name: "Bella", avatar: "/avatars/bella.jpg", coins: 2200, followers: 200, isOnline: false, xp: 4500 },
  { id: 3, name: "Charlie", avatar: "/avatars/charlie.jpg", coins: 900, followers: 80, isOnline: true, xp: 1800 },
]

const initialPosts = [
  {
    id: 1,
    userId: 1,
    content: "Just won a Chess match! 🏆",
    timestamp: "2025-05-17T10:00:00+05:30",
    likes: [2],
    comments: [{ id: 1, userId: 2, content: "Great job!", timestamp: "2025-05-17T10:05:00+05:30" }],
  },
  {
    id: 2,
    userId: 2,
    content: "Anyone up for a Poker game tonight?",
    timestamp: "2025-05-17T11:30:00+05:30",
    likes: [1, 3],
    comments: [],
  },
]

const initialEvents = [
  {
    id: 1,
    title: "Chess Tournament",
    date: "2025-05-18",
    time: "14:00",
    description: "Join us for a competitive Chess tournament!",
    location: "Online",
    participants: [1, 2],
    timestamp: "2025-05-16T09:00:00+05:30",
  },
]

const initialAnnouncements = [
  {
    id: 1,
    title: "New Feature Released",
    content: "We've added game scheduling! Try it out.",
    timestamp: "2025-05-15T12:00:00+05:30",
  },
]

const initialPlayerStats = {
  1: { wins: 10, losses: 5, gamesPlayed: 15 },
  2: { wins: 15, losses: 3, gamesPlayed: 18 },
  3: { wins: 7, losses: 8, gamesPlayed: 15 },
}

const initialAchievements = [
  { id: 1, name: "Chess Master", category: "Victories", description: "Win 10 Chess games", icon: "🏆" },
  { id: 2, name: "Social Butterfly", category: "Social", description: "Gain 100 followers", icon: "🦋" },
]

const initialUserBadges = {
  1: [1], // Alex has Chess Master badge
  2: [1, 2], // Bella has Chess Master and Social Butterfly badges
  3: [], // Charlie has no badges
}

const initialGameOptions = [
  { id: 1, name: "Chess" },
  { id: 2, name: "Poker" },
  { id: 3, name: "Racing" },
  { id: 4, name: "Puzzle" },
  { id: 5, name: "Shooter" },
]

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://ful2win-backend.onrender.com"
  : "http://localhost:5000"; // Use production URL in production, local in development

export default function useCommunityData() {
  const [users, setUsers] = useState([]) // Initialize with empty array
  const [filteredUsers, setFilteredUsers] = useState(null) // For filtering users (e.g., by online status)
  const [posts, setPosts] = useState([]) // Initialize posts as an empty array
  const [playerStats] = useState(initialPlayerStats)
  const [achievements] = useState(initialAchievements)
  const [events, setEvents] = useState(initialEvents)
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [userBadges] = useState(initialUserBadges)
  const [gameOptions] = useState(initialGameOptions)
  const [follows, setFollows] = useState({}) // e.g., { userId: [followedUserIds] }
  const [chats, setChats] = useState({}) // e.g., { userId: [{ senderId, message, timestamp }] }
  const [notifications, setNotifications] = useState([]) // Add notifications state
  const [currentUser, setCurrentUser] = useState(null) // Add currentUser state

  // Initialize currentUser from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          // Add a unique temporary ID if _id is not available, for frontend keying
          const usersWithId = data.map(user => ({ 
            ...user,
            id: user._id || `temp-${Math.random()}`,
            name: user.fullName || user.name || 'Unknown User', // Use fullName as name, fallback to name or Unknown
            coins: user.Balance || 0, // Map Balance to coins for rankings
            followers: user.followers || [], // Ensure followers is an array
            following: user.following || [], // Ensure following is an array
          }));
          // Sort users by balance (coins) in descending order
          const sortedUsers = usersWithId.sort((a, b) => b.coins - a.coins);
          setUsers(sortedUsers);
        } else {
          console.error("Fetched user data is not an array:", data);
          setUsers([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]); // Set to empty array on error
        // You might want to set an error state here to display a message in the UI
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/post/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setPosts([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]); // Set to empty array on error
        // You might want to set an error state here to display a message in the UI
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  // Add a comment to a post
  const addPostComment = async (postId, userId, content) => {
    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const userName = user?.fullName || 'Anonymous';

      const response = await fetch(`${API_BASE_URL}/api/post/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userName, // Send the user's full name instead of ID
          userId: userId, // Keep the userId for reference
          comment: content
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const updatedPost = await response.json();
      
      // Update the posts state with the updated post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === updatedPost._id ? updatedPost : post
        )
      );

    } catch (error) {
      console.error('Error adding comment:', error);
      // You might want to set an error state here to display a message in the UI
    }
  };

  // Toggle like on a post (Modified to call backend)
  const toggleLikePost = async (postId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/post/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if your backend requires it
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({ userId }), // Send userId in the body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle like on backend');
      }

      const updatedPost = await response.json();
      console.log('Like toggled successfully:', updatedPost);

      // Update the posts state with the updated post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === updatedPost._id ? updatedPost : post
        )
      );

    } catch (error) {
      console.error('Error toggling like:', error);
      // You might want to set an error state here to display a message in the UI
    }
  };

  // Create a new post (Modified to call backend and refetch)
  const createPost = async (postData) => {
    try {
       // Get author name from local storage
      const user = JSON.parse(localStorage.getItem('user'));
      const authorName = user && user.fullName ? user.fullName : 'Anonymous'; // Use fullName or fallback

      const postToSend = {
        title: postData.content.trim().substring(0, 20) || "New Post", // Using content for title, adjust as needed
        content: postData.content,
        author: authorName, // Use author name from local storage
        // Note: File, screenshot, poll, tags, schedule, media type, background, music, gif
        // are not included in this basic backend integration based on postRoutes.js structure.
        // You would need to modify the backend to handle these.
      };

      const response = await fetch(`${API_BASE_URL}/api/post/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if your backend requires it
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(postToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post on backend');
      }

      const newPost = await response.json();
      console.log('Post created successfully on backend:', newPost);

      // Refetch posts after creating a new one to update the list
      const fetchResponse = await fetch(`${API_BASE_URL}/api/post/posts`);
       if (!fetchResponse.ok) {
          throw new Error('Failed to refetch posts after creation');
        }
       const updatedPosts = await fetchResponse.json();
        if (Array.isArray(updatedPosts)) {
          setPosts(updatedPosts);
        } else {
           console.error("Refetched data is not an array:", updatedPosts);
        }

      // You might still want to return the new post or a success indicator
      return newPost; 

    } catch (error) {
      console.error('Error creating post or refetching:', error);
       // You might want to set an error state here to display a message in the UI
      throw error; // Re-throw the error so the calling component can handle it
    }
  }

  // Send a game invite (simulated)
  const sendGameInvite = (userId, gameId) => {
    console.log(`Game invite sent to user ${userId} for game ${gameId}`)
    return Promise.resolve() // Simulate async operation
  }

  // Toggle follow/unfollow
  const toggleFollow = async (followeeId) => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    const followerId = currentUser._id;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/follow/${followeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle follow status');
      }

      const data = await response.json();
      console.log('Follow status updated:', data);

      // Update local state with the new follow status
      setFollows((prevFollows) => {
        const followerList = prevFollows[followerId] || [];
        const isCurrentlyFollowing = followerList.includes(followeeId);
        const updatedList = isCurrentlyFollowing
          ? followerList.filter((id) => id !== followeeId)
          : [...followerList, followeeId];

        return {
          ...prevFollows,
          [followerId]: updatedList,
        };
      });

      // Update users state with new follower counts
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user._id === followeeId) {
            return {
              ...user,
              followers: data.followee.followers.length,
            };
          }
          if (user._id === followerId) {
            return {
              ...user,
              following: data.follower.following.length,
            };
          }
          return user;
        })
      );

      // Add notification for follow
      if (!data.follower.following.includes(followeeId)) {
        const followee = users.find(u => u._id === followeeId);
        if (followee) {
          addNotification({
            type: "follow",
            userId: followeeId,
            content: `You started following ${followee.fullName || followee.name}`,
            timestamp: new Date().toISOString(),
            read: true,
          });
        }
      }

    } catch (error) {
      console.error('Error toggling follow status:', error);
      // You might want to set an error state here to display a message in the UI
    }
  };

  // Check if a user is following another user
  const isFollowing = async (followeeId) => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      return false;
    }
    const followerId = currentUser._id;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/follow-status/${followeeId}?followerId=${followerId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get follow status');
      }

      const { isFollowing } = await response.json();
      return isFollowing;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  };

  // Start a chat (initialize if not exists)
  const startChat = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start chat');
      }

      const chat = await response.json();
      setChats(prevChats => ({
        ...prevChats,
        [userId]: chat.messages
      }));

      // Mark messages as read
      await fetch(`${API_BASE_URL}/api/chat/${userId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return userId;
    } catch (error) {
      console.error('Error starting chat:', error);
      alert(error.message || 'Failed to start chat');
      throw error;
    }
  };

  // Send a chat message
  const sendChatMessage = async (userId, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/${userId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: message })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      const chat = await response.json();
      setChats(prevChats => ({
        ...prevChats,
        [userId]: chat.messages
      }));

      return chat;
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message');
      throw error;
    }
  };

  // Load all chats for current user
  const loadChats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to load chats');
      }

      const chats = await response.json();
      const chatMap = {};
      chats.forEach(chat => {
        const otherParticipant = chat.participants.find(p => p._id !== currentUser._id);
        if (otherParticipant) {
          chatMap[otherParticipant._id] = chat.messages;
        }
      });
      setChats(chatMap);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  // Load chats when component mounts
  useEffect(() => {
    if (currentUser) {
      loadChats();
    }
  }, [currentUser]);

  // Format a date relative to the current date (01:36 PM IST, May 17, 2025)
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date() // 2025-05-17T01:36:00+05:30
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
  }

  // Get user level based on XP
  const getUserLevel = (userId) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return 1
    return Math.floor(user.xp / 1000) + 1 // 1000 XP per level
  }

  // Get user XP
  const getUserXP = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.xp : 0
  }

  // Add notification function
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };

  return {
    users,
    filteredUsers,
    posts,
    playerStats,
    achievements,
    events,
    announcements,
    userBadges,
    gameOptions,
    notifications,
    currentUser,
    addPostComment,
    toggleLikePost,
    createPost,
    sendGameInvite,
    toggleFollow,
    isFollowing,
    startChat,
    sendChatMessage,
    formatDate,
    getUserLevel,
    getUserXP,
    chats,
  }
}