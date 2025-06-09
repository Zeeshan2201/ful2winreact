// SchedulerModal.jsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SchedulerModal({ users, gameOptions, setShowScheduler, className = "" }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [taggedPeople, setTaggedPeople] = useState([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[1000] overflow-y-auto animate-fade-in ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedulerTitle"
    >
      <div className="w-[88%] max-w-[600px] my-5 p-5 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl relative animate-slide-down">
        <div className="flex justify-between items-center mb-4">
          <h3 id="schedulerTitle" className="font-bold text-indigo-700">
            Schedule Game Session
          </h3>
          <button
            onClick={() => setShowScheduler(false)}
            className="text-gray-800 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <div className="mb-4">
            <label
              htmlFor="gameSelect"
              className="block text-gray-800 text-sm font-bold mb-2"
            >
              Select Game
            </label>
            <div className="relative">
              <select
                id="gameSelect"
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 text-sm font-bold mb-2">
              Invite Players
            </label>
            <div className="max-h-32 overflow-y-auto mb-2 border border-gray-300 rounded-lg">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 hover:bg-blue-50 border-b last:border-b-0 transition-colors duration-300"
                >
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    className="mr-2 h-4 w-4 text-blue-600 transition-colors duration-300 focus:ring-blue-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTaggedPeople([...taggedPeople, user]);
                      } else {
                        setTaggedPeople(taggedPeople.filter((p) => p.id !== user.id));
                      }
                    }}
                    checked={taggedPeople.some((p) => p.id === user.id)}
                  />
                  <label
                    htmlFor={`user-${user.id}`}
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt=""
                      className="w-6 h-6 rounded-full mr-2 transition-transform duration-300 hover:scale-110"
                    />
                    <span className="text-sm">{user.name}</span>
                  </label>
                  {user.isOnline && (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-800">
              {taggedPeople.length} player{taggedPeople.length !== 1 ? "s" : ""} selected
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="scheduleDate"
                className="block text-gray-800 text-sm font-bold mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="scheduleDate"
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="scheduleTime"
                className="block text-gray-800 text-sm font-bold mb-2"
              >
                Time
              </label>
              <input
                type="time"
                id="scheduleTime"
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="sessionNotes"
              className="block text-gray-800 text-sm font-bold mb-2"
            >
              Session Notes
            </label>
            <textarea
              id="sessionNotes"
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 resize-y min-h-[80px]"
              placeholder="Add notes about the game session..."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setShowScheduler(false)}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg text-sm hover:bg-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (taggedPeople.length > 0 && selectedGame && scheduleDate && scheduleTime) {
                  alert(
                    `Game session scheduled with ${taggedPeople.length} player(s) for ${scheduleDate} at ${scheduleTime}`
                  );
                  setShowScheduler(false);
                } else {
                  alert("Please select a game, at least one player, and set a date and time");
                }
              }}
              disabled={!selectedGame || taggedPeople.length === 0 || !scheduleDate || !scheduleTime}
              className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-800  hover:from-blue-400 hover:to-indigo-600 text-gray-100 rounded-lg text-sm transition-all duration-300  disabled:cursor-not-allowed transform hover:scale-105"
            >
              Schedule Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}