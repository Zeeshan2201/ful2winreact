// PollCreatorModal.jsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function PollCreatorModal({ setShowPollCreator, className = "" }) {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);

  const addPollToPost = () => {
    if (!pollQuestion.trim() || pollOptions.some((opt) => !opt.trim())) return;

    alert(`Poll "${pollQuestion}" with ${pollOptions.length} options added to your post`);
    setShowPollCreator(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[1000] overflow-y-auto animate-fade-in ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pollCreatorTitle"
    >
      <div className="w-[88%] max-w-[600px] my-5 p-5 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl relative animate-slide-down">
        <div className="flex justify-between items-center mb-4">
          <h3 id="pollCreatorTitle" className="font-bold text-indigo-800">
            Create Poll
          </h3>
          <button
            onClick={() => setShowPollCreator(false)}
            className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <div className="mb-4">
            <label
              htmlFor="pollQuestion"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Question
            </label>
            <textarea
              id="pollQuestion"
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 resize-y min-h-[80px]"
              placeholder="Enter your question"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Options
            </label>
            {pollOptions.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 mr-2"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...pollOptions];
                    newOptions[index] = e.target.value;
                    setPollOptions(newOptions);
                  }}
                />
                {index > 1 && (
                  <button
                    onClick={() => {
                      const newOptions = [...pollOptions];
                      newOptions.splice(index, 1);
                      setPollOptions(newOptions);
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
              <span className="ml-2 text-gray-700 text-sm">
                Allow Multiple Votes
              </span>
            </label>
          </div>

          <button
            onClick={addPollToPost}
            disabled={!pollQuestion.trim() || pollOptions.some((opt) => !opt.trim())}
            className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-lg text-sm hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Add Poll
          </button>
        </div>
      </div>
    </div>
  );
}