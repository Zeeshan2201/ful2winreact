// TagPeopleModal.jsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TagPeopleModal({ users, setShowTagPeople, className = "" }) {
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [taggedPeople, setTaggedPeople] = useState([]);

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[1000] overflow-y-auto animate-fade-in ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tagPeopleTitle"
    >
      <div className="w-[88%] max-w-[600px] my-5 p-5 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl relative animate-slide-down text-black">
        <div className="flex justify-between items-center mb-4">
          <h3 id="tagPeopleTitle" className="font-bold text-indigo-800">
            Tag People
          </h3>
          <button
            onClick={() => setShowTagPeople(false)}
            className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <div className="mb-4">
            <label
              htmlFor="tagSearch"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Search Users
            </label>
            <textarea
              id="tagSearch"
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 resize-y min-h-[80px]"
              placeholder="Search for users"
              value={tagSearchQuery}
              onChange={(e) => setTagSearchQuery(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Suggested Users
            </label>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-300">
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 px-3 border-b last:border-b-0 hover:bg-blue-50 cursor-pointer transition-all duration-300"
                    onClick={() => {
                      if (!taggedPeople.find((tagged) => tagged.id === user.id)) {
                        setTaggedPeople([...taggedPeople, user]);
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
                    <button className="px-3 py-1 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-400 hover:to-indigo-600  text-white rounded-lg text-xs transition-colors duration-300 transform hover:scale-110">
                      Tag
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tagged People
            </label>
            {taggedPeople.length > 0 ? (
              <div className="space-y-2">
                {taggedPeople.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <h4 className="font-medium">{user.name}</h4>
                    </div>
                    <button
                      onClick={() =>
                        setTaggedPeople(
                          taggedPeople.filter((tagged) => tagged.id !== user.id)
                        )
                      }
                      className="text-red-500 hover:text-red-700 transition-colors duration-300 p-1 rounded-full hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                No one tagged yet
              </p>
            )}
          </div>

          <button
            onClick={() => setShowTagPeople(false)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-800 text-white rounded-lg text-sm hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}