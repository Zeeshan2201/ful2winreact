"use client"

import { PlusCircle } from "lucide-react"

export default function EventsSection({ events, users, setShowCreateEvent }) {
  return (
    <div className="bg-white rounded-b-md rounded-t-none shadow-md overflow-hidden mb-6 card-hover border-2 border-orange-200">
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
  )
}
