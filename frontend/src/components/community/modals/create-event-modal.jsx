"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function CreateEventModal({ users, events, setShowCreateEvent, onEventCreate }) {
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
  })
  const [selectedParticipants, setSelectedParticipants] = useState([])

  // Validate props
  if (!Array.isArray(users) || !Array.isArray(events)) {
    console.error("Invalid props: users or events missing", { users, events })
    return <div className="text-indigo-100">Error: Invalid data</div>
  }

  const handleParticipantToggle = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black  bg-opacity-60 flex items-center justify-center z-50 fade-in">
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
          background: linear-gradient(45deg, rgba(79, 70, 229, 0.8), rgba(37, 99, 235, 0.8));
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-glossy:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
        }

        .btn-glossy::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-glossy:hover::after {
          left: 100%;
        }

        /* Card hover effects */
        .card-hover {
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2);
          border-color: rgba(79, 70, 229, 0.3);
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

        /* Pulse animation for online status */
        .pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Hide scrollbar */
        .scrollbar-hidden {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }

        /* Responsive styles */
        @media (max-width: 640px) {
          .modal-content {
            width: 100% !important;
            padding: 8px !important;
          }
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          .modal-body {
            font-size: 14px !important;
          }
          .btn-glossy {
            padding: 8px 12px !important;
            font-size: 12px !important;
          }
        }
      `}</style>

      <div className="modal-content slide-down  glossy-dark w-full max-w-md mx-auto mt-4  p-4 rounded-lg shadow-lg max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hidden">
        <div className="modal-header flex justify-between items-center p-2 border-b border-indigo-700">
          <h3 className="font-semibold text-lg text-indigo-100">Create New Event</h3>
          <button
            onClick={() => {
              console.log("Close CreateEventModal clicked")
              setShowCreateEvent(false)
            }}
            className="text-indigo-200 hover:text-blue-400 transition-colors duration-300 p-1 rounded-full hover:bg-indigo-800"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body mb-[8rem] bg-gradient-to-b from-indigo-900 to-blue-900 p-4 rounded-b-md">
          <div className="mb-4 card-hover p-2 rounded-lg">
            <label htmlFor="eventTitle" className="block text-indigo-100 text-sm font-bold mb-2">
              Event Title
            </label>
            <input
              type="text"
              id="eventTitle"
              className="shadow appearance-none border border-indigo-700 rounded w-full py-2 px-3 text-indigo-100 bg-indigo-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
              placeholder="Enter event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              aria-label="Event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="card-hover p-2 rounded-lg">
              <label htmlFor="eventDate" className="block text-indigo-100 text-sm font-bold mb-2">
                Date
              </label>
              <input
                type="date"
                id="eventDate"
                className="shadow appearance-none border border-indigo-700 rounded w-full py-2 px-3 text-indigo-100 bg-indigo-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                aria-label="Event date"
              />
            </div>

            <div className="card-hover p-2 rounded-lg">
              <label htmlFor="eventTime" className="block text-indigo-100 text-sm font-bold mb-2">
                Time
              </label>
              <input
                type="time"
                id="eventTime"
                className="shadow appearance-none border border-indigo-700 rounded w-full py-2 px-3 text-indigo-100 bg-indigo-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                aria-label="Event time"
              />
            </div>
          </div>

          <div className="mb-4 card-hover p-2 rounded-lg">
            <label htmlFor="eventLocation" className="block text-indigo-100 text-sm font-bold mb-2">
              Location
            </label>
            <input
              type="text"
              id="eventLocation"
              className="shadow appearance-none border border-indigo-700 rounded w-full py-2 px-3 text-indigo-100 bg-indigo-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
              placeholder="Enter event location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              aria-label="Event location"
            />
          </div>

          <div className="mb-4 card-hover p-2 rounded-lg">
            <label htmlFor="eventDescription" className="block text-indigo-100 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="eventDescription"
              className="shadow appearance-none border border-indigo-700 rounded w-full py-2 px-3 text-indigo-100 bg-indigo-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
              placeholder="Describe your event"
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              aria-label="Event description"
            ></textarea>
          </div>

          <div className="mb-4 card-hover p-2 rounded-lg">
            <label className="block text-indigo-100 text-sm font-bold mb-2">Invite Participants</label>
            <div className="max-h-32 overflow-y-auto scrollbar-hidden border border-indigo-700 rounded-lg">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 hover:bg-indigo-800 border-b border-indigo-700 last:border-b-0 transition-colors duration-300"
                >
                  <input
                    type="checkbox"
                    id={`event-user-${user.id}`}
                    className="mr-2 h-4 w-4 text-indigo-600 transition-colors duration-300"
                    checked={selectedParticipants.includes(user.id)}
                    onChange={() => handleParticipantToggle(user.id)}
                    aria-label={`Invite ${user.name}`}
                  />
                  <label htmlFor={`event-user-${user.id}`} className="flex items-center cursor-pointer flex-1">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={`${user.name}'s avatar`}
                      className="w-6 h-6 rounded-full mr-2 transition-transform duration-300 hover:scale-110"
                    />
                    <span className="text-sm text-indigo-100">{user.name}</span>
                  </label>
                  {user.isOnline && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full pulse"></span>}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              console.log("Create Event clicked", { newEvent, selectedParticipants })
              if (newEvent.title && newEvent.date && newEvent.time) {
                const createdEvent = {
                  id: events.length + 1,
                  ...newEvent,
                  participants: selectedParticipants,
                }
                console.log("Event created:", createdEvent)
                if (onEventCreate) {
                  onEventCreate(createdEvent)
                }
                setNewEvent({
                  title: "",
                  date: "",
                  time: "",
                  description: "",
                  location: "",
                })
                setSelectedParticipants([])
                setShowCreateEvent(false)
                alert("Event created successfully!")
              } else {
                alert("Please fill in all required fields")
              }
            }}
            disabled={!newEvent.title || !newEvent.date || !newEvent.time}
            className="btn-glossy px-4 py-2 text-indigo-100 rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            aria-label="Create event"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  )
}