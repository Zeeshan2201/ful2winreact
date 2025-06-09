"use client"

import { useState, useEffect } from "react"
import CommunityHeader from "./community-header"
import NavigationIcons from "./navigation-icons"
import CreatePostCard from "./create-post-card"
import PostsFeed from "./posts-feed"
import UserRankings from "./user-rankings"
import AchievementsSection from "./achievements-section"
import MessagesSection from "./messages-section"
import SettingsSection from "./settings-section"
import EventsSection from "./events-section"
import UserListSection from "./user-list-section"
import ProfileModal from "./modals/profile-modal"
import ChatModal from "./modals/chat-modal"
import GameInviteModal from "./modals/game-invite-modal"
import PollCreatorModal from "./modals/poll-creator-modal"
import TagPeopleModal from "./modals/tag-people-modal"
import SchedulerModal from "./modals/scheduler-modal"
import CreateEventModal from "./modals/create-event-modal"
import CreateAnnouncementModal from "./modals/create-annoucement-modals"
import { X, PlusCircle } from "lucide-react"
import useCommunityData from "./useCommunityData"

export default function CommunityPage() {
  const {
    users = [],
    filteredUsers = [],
    posts = [],
    playerStats = [],
    achievements = [],
    events = [],
    announcements = [],
    userBadges = [],
    gameOptions = [],
    chats = [],
    search = () => {},
    addPostComment = () => {},
    toggleLikePost = () => {},
    createPost = () => {},
    sendGameInvite = () => {},
    toggleFollow = () => {},
    isFollowing = () => false,
    startChat = () => {},
    sendChatMessage = () => {},
    formatDate = (date) => new Date(date).toLocaleString(),
    getUserLevel = () => 1,
    getUserXP = () => 0,
  } = useCommunityData() || {}

  // UI state
  const [activeSection, setActiveSection] = useState("home")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserList, setShowUserList] = useState(false)
  const [isHubVisible, setIsHubVisible] = useState(true)
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false)

  // Modal states
  const [viewingProfile, setViewingProfile] = useState(null)
  const [activeChatUser, setActiveChatUser] = useState(null)
  const [showGameInvite, setShowGameInvite] = useState(false)
  const [inviteUserId, setInviteUserId] = useState(null)
  const [showPollCreator, setShowPollCreator] = useState(false)
  const [showTagPeople, setShowTagPeople] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false)
  const [pollData, setPollData] = useState({ question: "", options: ["", ""], allowMultipleVotes: false })

  const currentUser = users.find((u) => u.isCurrentUser || u.id === 1)
  const currentUserId = currentUser?._id

  // Toggle create post visibility
  const toggleCreatePostVisibility = () => {
    setIsCreatePostVisible(!isCreatePostVisible)
  }

  // Inactivity timer
  useEffect(() => {
    const currentUser = users.find((u) => u.isCurrentUser || u.id === 1)
    if (!currentUser?.isOnline) {
      setIsHubVisible(true)
      return
    }

    let inactivityTimeout

    const resetTimer = () => {
      setIsHubVisible(true)
      clearTimeout(inactivityTimeout)
      inactivityTimeout = setTimeout(() => {
        setIsHubVisible(false)
      }, 5 * 60 * 1000)
    }

    const events = ["mousemove", "click", "keypress"]
    events.forEach((event) => window.addEventListener(event, resetTimer))

    resetTimer()

    return () => {
      clearTimeout(inactivityTimeout)
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [users])

  // Handle profile click
  const handleProfileClick = (userId) => {
    setViewingProfile(userId)
  }

  // Close profile modal
  const closeProfileModal = () => {
    setViewingProfile(null)
  }

  // Handle starting a chat from the user list
  const handleStartChatFromList = async (userId) => {
    try {
      const chatId = await startChat(userId)
      setActiveChatUser(chatId)
    } catch (error) {
      console.error("Error starting chat from list:", error)
      alert("Failed to start chat. Please try again.")
    }
  }

  // Close chat
  const closeChat = () => {
    setActiveChatUser(null)
  }

  // Invite to game
  const inviteToGame = (userId) => {
    setInviteUserId(userId)
    setShowGameInvite(true)
  }

  // Wrapper for createPost with error handling
  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData)
      setIsCreatePostVisible(false)
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Failed to create post. Please try again.")
    }
  }

  // Wrapper for sendGameInvite with error handling
  const handleSendGameInvite = async (userId, gameId) => {
    try {
      await sendGameInvite(userId, gameId)
      setShowGameInvite(false)
    } catch (error) {
      console.error("Error sending game invite:", error)
      alert("Failed to send game invite. Please try again.")
    }
  }

  // Wrapper for sendChatMessage with error handling
  const handleSendChatMessage = async (userId, message) => {
    try {
      await sendChatMessage(userId, message)
    } catch (error) {
      console.error("Error sending chat message:", error)
      alert("Failed to send message. Please try again.")
    }
  }

  return (
    <div className="h-full min-h-screen mb-[3rem] rounded-md galaxy-background transition-all duration-500">
      {/* Global styles */}
      <style jsx>{`
        /* Galaxy Background */
        .galaxy-background {
          background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 30%, #2a2a72 60%, #3c096c 100%);
          position: relative;
          overflow: hidden;
        }

        /* Starry overlay effect */
        .galaxy-background::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0.1%, transparent 0.3%),
            radial-gradient(circle at 50% 60%, rgba(255, 255, 255, 0.1) 0.15%, transparent 0.4%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.12) 0.1%, transparent 0.3%),
            radial-gradient(circle at 30% 80%, rgba(255, 255, 255, 0.08) 0.1%, transparent 0.3%),
            radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.1) 0.12%, transparent 0.35%);
          background-size: 100% 100%;
          animation: twinkle 10s infinite ease-in-out;
        }

        /* Twinkle animation for stars */
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* Card hover effects */
        .card-hover {
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
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
          color: #3b82f6;
        }

        /* Fade in animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }

        /* Fade out animation */
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; display: none; }
        }

        .fade-out {
          animation: fadeOut 0.5s ease forwards;
        }

        /* Slide down animation for modals */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .slide-down {
          animation: slideDown 0.3s ease forwards;
        }

        /* Responsive styles for navigation icons */
        @media (max-width: 640px) {
          .icon-nav {
            overflow-x: auto;
            padding-bottom: 8px;
            -webkit-overflow-scrolling: touch;
          }

          .icon-nav::-webkit-scrollbar {
            height: 3px;
          }

          .icon-nav::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
          }

          .icon-button {
            min-width: 50px;
          }
        }

        /* Responsive styles for modals */
        @media (max-width: 640px) {
          .modal-container {
            width: 100% !important;
            padding: 12px !important;
            font-size: 14px !important;
          }

          .modal-content {
            padding: 8px !important;
          }

          .modal-header {
            font-size: 16px !important;
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
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
          transition: box-shadow 0.3s ease;
        }

        .glow:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
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
          background-color: #3b82f6;
          transition: width 0.3s ease;
        }

        .icon-button:hover::after {
          width: 70%;
        }

        /* Glass morphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        /* Responsive adjustments for galaxy background */
        @media (max-width: 640px) {
          .galaxy-background {
            background-size: 150% 150%;
          }
          .galaxy-background::after {
            background-size: 150% 150%;
          }
        }
      `}</style>

      {/* Community Hub (Main Container) */}
      <div
        className={`h-auto max-w-md mx-auto p-3 mb-16 sm:pb-2 md:pb-4 mt-3 sm:mt-2  rounded-2xl transition-opacity duration-500 ${
          isHubVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Community Hub Header with Search */}
        <CommunityHeader search={search} />

        {/* Navigation Icons */}
        <NavigationIcons
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setShowUserList={setShowUserList}
          showUserList={showUserList}
        />

        {/* Create Post Toggle Button */}
        <div className="flex justify-start">
          <button
            onClick={toggleCreatePostVisibility}
            className="w-full create-post-toggle rounded-t-md rounded-b-none flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-white to-white text-black shadow-md "
            aria-label={isCreatePostVisible ? "Hide post creation" : "Create a new post"}
          >
            {isCreatePostVisible ? <X className="rounded-b-full" size={16} /> : <PlusCircle size={18} />}
            <span className="font-medium">{isCreatePostVisible ? "Create Post" : "Create Post"}</span>
          </button>
        </div>

        {/* Create Post Section - Conditionally rendered */}
        <CreatePostCard
          createPost={handleCreatePost}
          setShowPollCreator={setShowPollCreator}
          setShowTagPeople={setShowTagPeople}
          setShowScheduler={setShowScheduler}
          toggleFollow={toggleFollow}
          isFollowing={isFollowing}
          currentUserId={currentUserId}
          isVisible={isCreatePostVisible}
          toggleVisibility={toggleCreatePostVisibility}
          setPollData={setPollData}
        />

        {/* Main Content Area - Changes based on active section */}
        {activeSection === "home" && (
          <PostsFeed
            posts={posts}
            users={users}
            toggleLikePost={toggleLikePost}
            addPostComment={addPostComment}
            handleProfileClick={handleProfileClick}
            startChat={startChat}
            formatDate={formatDate}
            toggleFollow={toggleFollow}
            isFollowing={isFollowing}
          />
        )}

        {activeSection === "topCoins" && (
          <UserRankings users={users} rankingType="coins" handleProfileClick={handleProfileClick} />
        )}

        {activeSection === "topFollowers" && (
          <UserRankings users={users} rankingType="followers" handleProfileClick={handleProfileClick} />
        )}

        {activeSection === "achievements" && <AchievementsSection achievements={achievements} />}

        {activeSection === "messages" && (
          <MessagesSection 
            users={users} 
            startChat={handleStartChatFromList}
            chats={chats}
            formatDate={formatDate}
          />
        )}

        {activeSection === "settings" && <SettingsSection />}

        {activeSection === "events" && (
          <EventsSection events={events} users={users} setShowCreateEvent={setShowCreateEvent} />
        )}

        {/* User List */}
        {showUserList && (
          <UserListSection
            users={filteredUsers || users}
            startChat={handleStartChatFromList}
            toggleFollow={toggleFollow}
            isFollowing={isFollowing}
            handleProfileClick={handleProfileClick}
          />
        )}

        {/* Modals */}
        {viewingProfile && (
          <ProfileModal
            userId={viewingProfile}
            users={users}
            playerStats={playerStats}
            userBadges={userBadges}
            achievements={achievements}
            closeProfileModal={closeProfileModal}
            startChat={startChat}
            toggleFollow={toggleFollow}
            isFollowing={isFollowing}
            inviteToGame={inviteToGame}
            getUserLevel={getUserLevel}
            getUserXP={getUserXP}
          />
        )}

        {activeChatUser && (
          <ChatModal
            activeChatUser={activeChatUser}
            users={users}
            chats={chats}
            closeChat={closeChat}
            sendChatMessage={handleSendChatMessage}
            formatDate={formatDate}
            className="modal-container"
          />
        )}

        {showGameInvite && (
          <GameInviteModal
            inviteUserId={inviteUserId}
            gameOptions={gameOptions}
            sendGameInvite={handleSendGameInvite}
            setShowGameInvite={setShowGameInvite}
            className="modal-container"
          />
        )}

        {showPollCreator && (
          <PollCreatorModal
            setShowPollCreator={setShowPollCreator}
            pollData={pollData}
            setPollData={(data) => {
              setPollData(data)
              // Update CreatePostCard's poll states
              setHasPoll(true)
              setPollQuestion(data.question)
              setPollOptions(data.options)
              setAllowMultipleVotes(data.allowMultipleVotes)
            }}
            className="modal-container"
          />
        )}

        {showTagPeople && (
          <TagPeopleModal users={users} setShowTagPeople={setShowTagPeople} className="modal-container" />
        )}

        {showScheduler && (
          <SchedulerModal
            users={users}
            gameOptions={gameOptions}
            setShowScheduler={setShowScheduler}
            setScheduleData={({ date, time }) => {
              setIsScheduled(true)
              setScheduleDate(date)
              setScheduleTime(time)
            }}
            className="modal-container"
          />
        )}

        {showCreateEvent && (
          <CreateEventModal
            users={users}
            events={events}
            setShowCreateEvent={setShowCreateEvent}
            className="modal-container"
          />
        )}

        {showCreateAnnouncement && (
          <CreateAnnouncementModal
            users={users}
            announcements={announcements}
            setShowCreateAnnouncement={setShowCreateAnnouncement}
            className="modal-container"
          />
        )}
      </div>
    </div>
  )
}