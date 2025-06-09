"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export default function MessagesSection({ users, startChat, chats, formatDate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setCurrentUser(null);
          return;
        }
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading user:', error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    if (!currentUser || !chats) return;

    // Create a list of chats with the other participant's info
    const chatList = Object.entries(chats).map(([userId, messages]) => {
      const otherUser = users.find(u => u._id === userId || u.id === userId);
      const lastMessage = messages[messages.length - 1];
      
      return {
        userId,
        user: otherUser,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
          isCurrentUser: lastMessage.sender._id === currentUser._id
        } : null,
        unreadCount: messages.filter(m => 
          m.sender._id !== currentUser._id && !m.read
        ).length
      };
    });

    // Sort by last message timestamp
    chatList.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });

    setChatList(chatList);
  }, [chats, users, currentUser]);

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-b-md rounded-t-none shadow-md p-2 mb-6 card-hover border-2 border-pink-200">
      <h2 className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 mb-4">
        Messages
      </h2>
      {chatList.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No messages yet. Start a conversation!</p>
      ) : (
        chatList.map((chat) => (
          <div
            key={chat.userId}
            className="flex items-center justify-between py-3 px-2 border-b last:border-b-0 bg-gray-50 hover:bg-pink-100 cursor-pointer transition-all duration-300 rounded-md mb-1"
            onClick={() => startChat(chat.userId)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={chat.user?.avatar || "/placeholder.svg"}
                  alt=""
                  className="w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110 border-2 border-transparent hover:border-pink-300"
                />
                {chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{chat.user?.fullName || chat.user?.name}</h3>
                {chat.lastMessage ? (
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">
                    {chat.lastMessage.isCurrentUser ? "You: " : ""}
                    {chat.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">No messages yet</p>
                )}
              </div>
            </div>
            {chat.lastMessage && (
              <div className="text-gray-500 text-xs">
                {formatDate(chat.lastMessage.timestamp)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
