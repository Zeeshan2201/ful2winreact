"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

export default function CreateAnnouncementModal({ users, announcements, setShowCreateAnnouncement }) {
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    isPinned: false,
    imageUrl: null,
  })
  const [announcementImage, setAnnouncementImage] = useState(null)
  const announcementImageRef = useRef(null)

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
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
                // In a real app, you would add this announcement to your state
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
  )
}
