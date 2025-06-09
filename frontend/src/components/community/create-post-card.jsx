"use client"

import { useState, useRef, useEffect } from "react"
import { PlusCircle, X, Send, Calendar, Tag, BarChart2, ImageIcon, Film, Music, Palette, UserPlus } from "lucide-react"

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://ful2win-backend.onrender.com"
  : "http://localhost:5000"; // Use production URL in production, local in development

export default function CreatePostCard({
  createPost,
  setShowPollCreator,
  setShowTagPeople,
  setShowScheduler,
  toggleFollow,
  isFollowing,
  currentUserId,
  isVisible,
  toggleVisibility,
}) {
  const [newPostContent, setNewPostContent] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState(null)
  const [musicUrl, setMusicUrl] = useState("")
  const [gifUrl, setGifUrl] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [hasPoll, setHasPoll] = useState(false)
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const [taggedPeople, setTaggedPeople] = useState([])

  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const musicInputRef = useRef(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const textareaRef = useRef(null)

  const backgroundOptions = [
    { id: 1, color: "bg-gradient-to-r from-purple-500 to-indigo-500", name: "Purple Haze" },
    { id: 2, color: "bg-gradient-to-r from-pink-500 to-rose-500", name: "Pink Sunset" },
    { id: 3, color: "bg-gradient-to-r from-yellow-400 to-amber-500", name: "Golden Hour" },
    { id: 4, color: "bg-gradient-to-r from-green-400 to-emerald-500", name: "Forest" },
    { id: 5, color: "bg-gradient-to-r from-blue-400 to-cyan-500", name: "Ocean Blue" },
  ]

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Capture screenshot (simulated)
  const captureScreenshot = () => {
    setScreenshotPreview("/placeholder.svg?height=400&width=600")
    setSelectedFile(null)
    setMediaType(null)
  }

  // Handle post creation
  const handleCreatePost = async () => {
    if (
      (!newPostContent.trim() && !selectedFile && !screenshotPreview && !hasPoll && !selectedBackground && !gifUrl) ||
      (isScheduled && (!scheduleDate || !scheduleTime))
    ) {
      return
    }

    // Get author name from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const authorName = user && user.fullName ? user.fullName : 'Anonymous'; // Use fullName or fallback

    // Prepare post data for backend
    const postData = {
      title: newPostContent.trim().substring(0, 20) || "New Post", // Using content for title, adjust as needed
      content: newPostContent,
      author: authorName, // Use author name from local storage
      // Note: File, screenshot, poll, tags, schedule, media type, background, music, gif
      // are not included in this basic backend integration based on postRoutes.js structure.
      // You would need to modify the backend to handle these.
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/post/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if your backend requires it
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      const createdPost = await response.json();
      console.log('Post created successfully:', createdPost);

      // You might want to call a function passed from parent to update the UI with the new post
      // if (createPost) {
      //   createPost(createdPost);
      // }

      // Reset all states on successful post
    setNewPostContent("")
    setSelectedFile(null)
    setScreenshotPreview(null)
    setHasPoll(false)
    setPollQuestion("")
    setPollOptions(["", ""])
      setAllowMultipleVotes(false) // Assuming this state exists for poll options
    setTaggedPeople([])
      setIsScheduled(false) // Assuming this state exists for scheduling
      setScheduleDate("") // Assuming this state exists for scheduling
      setScheduleTime("") // Assuming this state exists for scheduling
    setMediaType(null)
    setSelectedBackground(null)
      setMusicUrl("") // Assuming this state exists for music
      setGifUrl("") // Assuming this state exists for gifs
    setShowMediaOptions(false)
    if (imageInputRef.current) imageInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
    if (musicInputRef.current) musicInputRef.current.value = ""

    // Hide the create post card after posting
    if (toggleVisibility) {
      toggleVisibility()
      }

    } catch (error) {
      console.error('Error creating post:', error);
      // Display an error message to the user (you'll need state for this)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const adjustHeight = () => {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
    textarea.addEventListener("input", adjustHeight)
    adjustHeight()
    return () => textarea.removeEventListener("input", adjustHeight)
  }, [isVisible])

  // Check if the current user is following
  const isUserFollowing = toggleFollow && isFollowing && currentUserId ? isFollowing(currentUserId) : false

  if (!isVisible) return null

  return (
    <div
      className="w-full bg-gradient-to-b from-white to-gray-50 rounded-b-md  shadow-lg p-1 mb-1 transition-all duration-300"
      style={{
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>

      {/* Header, Follow Button, and Textarea */}
      <div className="flex items-start gap-2 mb-1">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={5000}
          className="flex-1 p-2 border mb-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-normal text-gray-900 placeholder-gray-400 min-h-[60px] resize-none"
          aria-label="Create a new post"
        />
      </div>

      {/* Body */}
      <div>
        {selectedFile && !mediaType && (
          <div className="mb-3 bg-gray-100 border border-gray-200 shadow-sm fade-in p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pl-1 sm:pl-1">
                <div className="text-blue-900">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-xs text-gray-600">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  if (imageInputRef.current) imageInputRef.current.value = ""
                  if (videoInputRef.current) videoInputRef.current.value = ""
                  if (musicInputRef.current) musicInputRef.current.value = ""
                }}
                className="text-gray-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-300"
                aria-label="Remove attachment"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {screenshotPreview && (
          <div className="mb-3 p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-sm fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Screenshot Preview</span>
              <button
                onClick={() => setScreenshotPreview(null)}
                className="text-gray-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-300"
                aria-label="Remove screenshot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black rounded-lg overflow-hidden">
              <img
                src={screenshotPreview || "/placeholder.svg"}
                alt="Screenshot preview"
                className="w-full object-contain max-h-[150px] sm:max-h-[200px]"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {isScheduled && scheduleDate && scheduleTime && (
          <div className="flex items-center gap-1 text-sm text-blue-600 mb-2">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs text-gray-600">
              Scheduled for {scheduleDate} at {scheduleTime}
            </span>
            <button
              onClick={() => {
                setIsScheduled(false)
                setScheduleDate("")
                setScheduleTime("")
              }}
              className="text-gray-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-300"
              aria-label="Cancel schedule"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
          <button
            onClick={() => {
              setShowMediaOptions(!showMediaOptions)
              setMediaType(null)
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300 touch-action-manipulation"
            aria-label={showMediaOptions ? "Hide media options" : "Show media options"}
          >
            <PlusCircle className="h-4 w-4 text-blue-500 hover:text-blue-700" />
            <span className="hidden sm:inline-block">Add Media</span>
          </button>

          <button
            onClick={() => alert("Live streaming feature coming soon!")}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300 touch-action-manipulation"
            aria-label="Go live (coming soon)"
          >
            <svg
              className="h-4 w-4 text-blue-500 hover:text-blue-700"
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
            <span className="hidden sm:inline-block">Go Live</span>
          </button>

          <button
            onClick={() => setShowPollCreator(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300 touch-action-manipulation"
            aria-label="Create poll"
          >
            <BarChart2 className="h-4 w-4 text-blue-500 hover:text-blue-700" />
            <span className="hidden sm:inline-block">Poll</span>
          </button>

          <button
            onClick={() => setShowTagPeople(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300 touch-action-manipulation"
            aria-label="Tag people"
          >
            <Tag className="h-4 w-4 text-blue-500 hover:text-blue-700" />
            <span className="hidden sm:inline-block">Tag</span>
          </button>

          <button
            onClick={() => setShowScheduler(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300 touch-action-manipulation"
            aria-label="Schedule post"
          >
            <Calendar className="h-4 w-4 text-blue-500 hover:text-blue-700" />
            <span className="hidden sm:inline-block">Schedule</span>
          </button>

          <button
            onClick={handleCreatePost}
            disabled={
              !newPostContent.trim() &&
              !selectedFile &&
              !screenshotPreview &&
              !hasPoll &&
              !selectedBackground &&
              !gifUrl
            }
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 touch-action-manipulation sm:ml-auto ${
              !newPostContent.trim() &&
              !selectedFile &&
              !screenshotPreview &&
              !hasPoll &&
              !selectedBackground &&
              !gifUrl
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
            aria-label={isScheduled ? "Schedule post" : "Create post"}
          >
            <Send className="h-3 w-3" />
            <span>{isScheduled ? "Schedule Post" : "Post"}</span>
          </button>
        </div>

        {showMediaOptions && (
          <div className="bg-white rounded-lg pb-1 shadow-md border border-gray-200 fade-in">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  setMediaType("photo")
                  if (imageInputRef.current) imageInputRef.current.click()
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-300 touch-action-manipulation ${
                  mediaType === "photo"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                } text-sm font-medium`}
                aria-label="Add photo"
              >
                <ImageIcon size={16} className={`text-blue-500 hover:text-blue-700 ${mediaType === "photo" ? "text-blue-700" : ""}`} />
                <span>Photo</span>
              </button>

              <button
                onClick={() => {
                  setMediaType("video")
                  if (videoInputRef.current) videoInputRef.current.click()
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-300 touch-action-manipulation ${
                  mediaType === "video"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                } text-sm font-medium`}
                aria-label="Add video"
              >
                <Film size={16} className={`text-blue-500 hover:text-blue-700 ${mediaType === "video" ? "text-blue-700" : ""}`} />
                <span>Video</span>
              </button>

              <button
                onClick={() => {
                  setMediaType("music")
                  if (musicInputRef.current) musicInputRef.current.click()
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-300 touch-action-manipulation ${
                  mediaType === "music"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                } text-sm font-medium`}
                aria-label="Add music"
              >
                <Music size={16} className={`text-blue-500 hover:text-blue-700 ${mediaType === "music" ? "text-blue-700" : ""}`} />
                <span>Music</span>
              </button>

              <button
                onClick={() => setMediaType("background")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-300 touch-action-manipulation ${
                  mediaType === "background"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                } text-sm font-medium`}
                aria-label="Add background"
              >
                <Palette size={16} className={`text-blue-500 hover:text-blue-700 ${mediaType === "background" ? "text-blue-700" : ""}`} />
                <span>Background</span>
              </button>
            </div>

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
              aria-label="Upload photo"
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
              aria-label="Upload video"
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
                  const url = URL.createObjectURL(e.target.files[0])
                  setMusicUrl(url)
                }
              }}
              aria-label="Upload music"
            />

            {mediaType === "background" && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 fade-in">
                {backgroundOptions.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg)}
                    className={`h-12 rounded-lg ${bg.color} transition-transform duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-action-manipulation ${
                      selectedBackground?.id === bg.id ? "ring-2 ring-blue-600 ring-offset-2" : ""
                    }`}
                    title={bg.name}
                    aria-label={`Select ${bg.name} background`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {selectedFile && mediaType === "photo" && (
          <div className="mb-3 p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-sm fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Photo Preview</span>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setMediaType(null)
                  if (imageInputRef.current) imageInputRef.current.value = ""
                }}
                className="text-gray-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-300"
                aria-label="Remove photo"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                alt="Photo preview"
                className="w-full object-contain max-h-[150px] sm:max-h-[200px]"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {selectedFile && mediaType === "video" && (
          <div className="mb-3 p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-sm fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Video Preview</span>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setMediaType(null)
                  if (videoInputRef.current) videoInputRef.current.value = ""
                }}
                className="text-gray-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-300"
                aria-label="Remove video"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={URL.createObjectURL(selectedFile)}
                controls
                className="w-full max-h-[150px] sm:max-h-[200px]"
                aria-label="Video preview"
              />
            </div>
          </div>
        )}

        {selectedFile && mediaType === "music" && (
          <div className="mb-3 p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-sm fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                Music: {selectedFile.name}
              </span>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setMediaType(null)
                  setMusicUrl("")
                  if (musicInputRef.current) musicInputRef.current.value = ""
                }}
                className="text-gray-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-300"
                aria-label="Remove music"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <audio ref={audioRef} src={musicUrl} controls className="w-full" aria-label="Music preview" />
          </div>
        )}

        {selectedBackground && (
          <div className="mb-3 p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-sm fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Background: {selectedBackground.name}</span>
              <button
                onClick={() => {
                  setSelectedBackground(null)
                  setMediaType(null)
                }}
                className="text-gray-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-300"
                aria-label="Remove background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className={`h-12 rounded-lg ${selectedBackground.color}`} />
          </div>
        )}
      </div>
    </div>
  )
}