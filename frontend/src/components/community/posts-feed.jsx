"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Send, PlusCircle, Share, UserPlus } from "lucide-react"

export default function PostsFeed({
  posts,
  users,
  toggleLikePost,
  addPostComment,
  handleProfileClick,
  startChat,
  formatDate,
  toggleFollow,
  isFollowing,
}) {
  const [newPostComment, setNewPostComment] = useState({})
  const [showComments, setShowComments] = useState({}) // Comments hidden by default
  const [currentUser, setCurrentUser] = useState(null)
  const [followingStatus, setFollowingStatus] = useState({}) // Store following status for each user

  // Get current user from localStorage on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  // Update following status when users or isFollowing changes
  useEffect(() => {
    const updateFollowingStatus = async () => {
      if (!currentUser) return;
      
      const statuses = {};
      for (const user of users) {
        if (user._id && user._id !== currentUser._id) {
          try {
            const isUserFollowing = await isFollowing(user._id);
            statuses[user._id] = isUserFollowing;
          } catch (error) {
            console.error('Error checking follow status for user:', user._id, error);
            statuses[user._id] = false;
          }
        }
      }
      setFollowingStatus(statuses);
    };

    updateFollowingStatus();
  }, [users, currentUser, isFollowing]);

  // Toggle comments visibility for a specific post
  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  // Handle like button click
  const handleLikeClick = (postId) => {
    if (!currentUser) {
      // You might want to show a login prompt or redirect to login
      console.log('Please login to like posts');
      return;
    }
    toggleLikePost(postId, currentUser._id);
  }

  // Handle comment submission
  const handleCommentSubmit = (postId, content) => {
    if (!currentUser) {
      // You might want to show a login prompt or redirect to login
      console.log('Please login to comment');
      return;
    }
    if (content.trim()) {
      addPostComment(postId, currentUser._id, content.trim());
      setNewPostComment({ ...newPostComment, [postId]: "" });
    }
  }

  // Add this function near the top of the component, after the state declarations
  const getCommentAuthorName = (comment) => {
    // If the comment has a user field (from backend), use that
    if (comment.user) {
      return comment.user;
    }
    
    // If we have a current user and the comment is from them, use their name
    if (currentUser && comment.userId === currentUser._id) {
      return currentUser.fullName || 'You';
    }
    
    // Fallback to "Unknown User"
    return "Unknown User";
  };

  return (
    <div className="space-y-1 sm:px-0">
      {/* Recent Posts Header */}
      <div className="recent-posts-header flex rounded-md items-center gap-2 bg-gradient-to-r from-white to-white p-2 mt-1 shadow-sm">
        <MessageCircle size={20} className="text-black " />
        <span className="text-base font-semibold text-gray-900">Recent Posts</span>
        <div className="ml-auto flex items-center">
          <span className="bg-blue-600 text-white text-sm font-bold px-2 rounded-md shadow-sm">
            {posts.length}
          </span>
        </div>
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        posts.map((post) => {
          const authorName = post.author || "Unknown User"
          const authorAvatar = "/images/avatars/default-avatar.jpg"
          // Find the user object that matches the author name
          const authorUser = users.find(user => user.name === authorName || user.fullName === authorName)
          const authorId = authorUser?.id || authorUser?._id
          // Get following status from state
          const isUserFollowing = authorId ? followingStatus[authorId] || false : false

          return (
            <div
              key={post._id}
              className="post-card bg-white rounded-lg shadow-md text-gray-900 border border-gray-200 hover:shadow-lg transition-shadow duration-300 animate-fade-in-up overflow-visible"
            >
              {/* Post Header */}
              <div className="post-header flex items-center gap-10 p-1 border-b border-gray-100">
                <img
                  src={authorAvatar}
                  alt={`${authorName}'s avatar`}
                  className="post-avatar w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 object-cover"
                  onClick={() => authorId && handleProfileClick(authorId)}
                />
                <div className="flex flex-row gap-10">
                  <div className="flex items-center gap-8">
                    <h3
                      className="post-author text-sm sm:text-base font-semibold text-gray-900 leading-tight hover:text-blue-600 cursor-pointer transition-colors duration-300"
                      onClick={() => authorId && handleProfileClick(authorId)}
                    >
                      {authorName}
                    </h3>
                    <p className="post-time text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                  {toggleFollow && authorId && authorId !== currentUser?._id && (
                    <button
                      onClick={() => toggleFollow(authorId)}
                      className={`self-start flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-xs font-medium text-white transition-all duration-300 focus:ring-1 focus:ring-blue-600 focus:ring-offset-1 hover:scale-105 transform ${
                        isUserFollowing
                          ? "bg-gray-400 hover:bg-gray-500"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      }`}
                      aria-label={isUserFollowing ? "Unfollow user" : "Follow user"}
                      aria-pressed={isUserFollowing}
                    >
                      <UserPlus size={12} />
                      <span>{isUserFollowing ? "Unfollow" : "Follow"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div
                className={`post-content p-3 ${
                  post.backgroundStyle ? post.backgroundStyle + " text-white" : "text-gray-900"
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>

                {post.mediaType === "photo" && post.hasAttachment && (
                  <div className="mt-2 bg-black rounded-lg overflow-hidden">
                    <img
                      src={`/images/media/photos/photo${post._id}.jpg`}
                      alt="Photo"
                      className="w-full object-contain max-h-[200px] sm:max-h-[300px]"
                      loading="lazy"
                      onError={(e) => (e.target.src = "/images/avatars/default-avatar.jpg")}
                    />
                  </div>
                )}

                {post.mediaType === "video" && post.hasAttachment && (
                  <div className="mt-2 bg-black rounded-lg overflow-hidden">
                    <video
                      src={`/images/media/videos/video${post._id}.mp4`}
                      controls
                      className="w-full max-h-[200px] sm:max-h-[300px]"
                      onError={(e) => (e.target.src = "/images/avatars/default-avatar.jpg")}
                    />
                  </div>
                )}

                {post.mediaType === "music" && post.hasAttachment && (
                  <div className="mt-2 bg-gray-200 rounded-lg shadow-sm p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{post.attachmentName || "Audio Track"}</span>
                    </div>
                    <audio controls className="w-full" />
                  </div>
                )}

                {post.mediaType === "gif" && post.gifUrl && (
                  <div className="mt-2 bg-black rounded-lg overflow-hidden">
                    <img
                      src={post.gifUrl || "/images/media/gifs/gif1.gif"}
                      alt="GIF"
                      className="w-full object-contain max-h-[200px] sm:max-h-[300px]"
                      loading="lazy"
                      onError={(e) => (e.target.src = "/images/avatars/default-avatar.jpg")}
                    />
                  </div>
                )}
              </div>

              <div className="social-actions-row bg-gray-100 p-2 flex justify-between items-center">
                <button
                  onClick={() => handleLikeClick(post._id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors duration-300 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    post.likes && Array.isArray(post.likes) && currentUser && post.likes.includes(currentUser._id) 
                      ? "text-red-500 hover:text-red-600" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  aria-label={
                    post.likes && Array.isArray(post.likes) && currentUser && post.likes.includes(currentUser._id) 
                      ? "Unlike post" 
                      : "Like post"
                  }
                >
                  <Heart
                    className="h-5 w-5"
                    fill={
                      post.likes && Array.isArray(post.likes) && currentUser && post.likes.includes(currentUser._id) 
                        ? "currentColor" 
                        : "none"
                    }
                    stroke="currentColor"
                  />
                  <span className="text-sm">{post.likes?.length || 0}</span>
                </button>

                <button
                  onClick={() => toggleComments(post._id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors duration-300 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    showComments[post._id] ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
                  aria-label={showComments[post._id] ? "Hide comments" : "Show comments"}
                >
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">{post.comments?.length || 0}</span>
                </button>

                <button
                  onClick={() => alert("Share functionality coming soon!")}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-gray-600 hover:text-blue-600 transition-colors duration-300 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  aria-label="Share post"
                >
                  <Share className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Comments Section - Hidden by default */}
              {showComments[post._id] && (
                <div className="comments-section mt-4">
                {post.comments && post.comments.length > 0 && (
                  <div className="p-1 space-y-1">
                    <h4 className="text-sm font-semibold text-blue-700">
                      {post.comments.length} Comment{post.comments.length !== 1 && "s"}
                    </h4>
                    {post.comments.map((comment) => {
                        const commentAuthorName = getCommentAuthorName(comment);
                        const commentAuthorAvatar = "/images/avatars/default-avatar.jpg"
                        // Find the user object that matches the comment author name
                        const commentAuthorUser = users.find(user => user.name === commentAuthorName || user.fullName === commentAuthorName)
                        const commentAuthorId = commentAuthorUser?.id || commentAuthorUser?._id

                      return (
                          <div key={comment._id || comment.id} className="flex space-x-3 fade-in min-h-[40px] items-start">
                          <img
                              src={commentAuthorAvatar}
                              alt={`${commentAuthorName}'s avatar`}
                              className="w-8 h-8 rounded-md cursor-pointer transition-transform duration-300 hover:scale-110 object-cover"
                              onClick={() => commentAuthorId && handleProfileClick(commentAuthorId)}
                          />
                          <div className="flex-1 p-1 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg  hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 transition-colors duration-300">
                            <div className="flex justify-between items-start">
                              <h5
                                className="text-sm font-semibold text-blue-700 hover:text-blue-900 cursor-pointer transition-colors duration-300"
                                onClick={() => commentAuthorId && handleProfileClick(commentAuthorId)}
                              >
                                  {commentAuthorName}
                              </h5>
                                <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                            </div>
                              <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">{comment.comment}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="comment-form flex items-center gap-2 p-1">
                  <input
                    type="text"
                      value={newPostComment[post._id] || ""}
                      onChange={(e) => setNewPostComment({ ...newPostComment, [post._id]: e.target.value })}
                      placeholder={currentUser ? "Write a comment..." : "Please login to comment"}
                    className="comment-input flex-1 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                      disabled={!currentUser}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && newPostComment[post._id]?.trim()) {
                          handleCommentSubmit(post._id, newPostComment[post._id]);
                      }
                    }}
                  />
                  <button
                      onClick={() => handleCommentSubmit(post._id, newPostComment[post._id])}
                      disabled={!currentUser || !newPostComment[post._id]?.trim()}
                    className={`comment-button p-2 rounded-full transition-colors duration-300 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                        currentUser && newPostComment[post._id]?.trim()
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    aria-label="Send comment"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
              )}
            </div>
          )
        })
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <PlusCircle size={24} className="mx-auto mb-2 text-blue-500" />
          <p className="text-gray-600 text-sm font-medium">No posts yet</p>
          <p className="text-gray-500 text-xs mt-1">Be the first to create a post!</p>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  )
}