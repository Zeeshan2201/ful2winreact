import React, { useState } from 'react';
import { Bell, Calendar, Wallet, Users, Award, MessageCircle, Filter, CheckCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1, 
      title: "New Tournament", 
      message: "Chess championship starting tomorrow! Join now to compete for a prize pool of ₹10,000.", 
      time: "5 mins ago", 
      type: "event",
      read: false,
      icon: <Calendar className="w-7 h-7 text-blue-400" />
    },
    {
      id: 2, 
      title: "Bonus Credited", 
      message: "₹50 bonus added to your wallet! Valid for 7 days.", 
      time: "2 hours ago", 
      type: "wallet",
      read: false,
      icon: <Wallet className="w-7 h-7 text-green-400" />
    },
    {
      id: 3, 
      title: "Friend Request", 
      message: "Alex sent you a friend request", 
      time: "Yesterday", 
      type: "social",
      read: true,
      icon: <Users className="w-7 h-7 text-purple-400" />
    },
    {
      id: 4, 
      title: "Achievement Unlocked", 
      message: "Congratulations! You've reached Level 10 in Poker. Claim your reward now.", 
      time: "2 days ago", 
      type: "achievement",
      read: true,
      icon: <Award className="w-7 h-7 text-yellow-400" />
    },
    {
      id: 5, 
      title: "Game Invitation", 
      message: "Ravi invited you to play Ludo. Click to join now!", 
      time: "3 days ago", 
      type: "invitation",
      read: true,
      icon: <MessageCircle className="w-7 h-7 text-pink-400" />
    }
  ]);

  const filterNotifications = (filter) => {
    setActiveFilter(filter);
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({...notif, read: true}))
    );
  };

  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter(notif => notif.type === activeFilter);
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };
  
  const filters = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'event', name: 'Events', count: notifications.filter(n => n.type === 'event').length },
    { id: 'wallet', name: 'Wallet', count: notifications.filter(n => n.type === 'wallet').length },
    { id: 'social', name: 'Social', count: notifications.filter(n => n.type === 'social').length },
    { id: 'achievement', name: 'Rewards', count: notifications.filter(n => n.type === 'achievement').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <Navbar />
      
      {/* Main container with padding for the navbar */}
      <div className="pt-24 pb-24">
        {/* Header */}
        <div className="px-4 md:px-8 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="mr-3 p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={markAllAsRead} 
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-blue-400"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            </div>
          </div>
          
          {getUnreadCount() > 0 && (
            <div className="mt-2 text-sm text-blue-400">
              You have {getUnreadCount()} unread {getUnreadCount() === 1 ? 'notification' : 'notifications'}
            </div>
          )}
        </div>
        
        {/* Filter tabs */}
        <div className="mb-4 overflow-x-auto hide-scrollbar">
          <div className="flex px-4 md:px-8 space-x-2 pb-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => filterNotifications(filter.id)}
                className={`py-2 px-4 rounded-full whitespace-nowrap flex items-center ${
                  activeFilter === filter.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter.name}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-700'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Notifications list */}
        <div className="divide-y divide-gray-800">
          {getFilteredNotifications().length > 0 ? (
            getFilteredNotifications().map(notification => (
              <div 
                key={notification.id} 
                className={`px-4 md:px-8 py-4 hover:bg-gray-800/30 transition-colors ${!notification.read ? 'bg-gray-800/40' : ''}`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-2.5 bg-gray-800 rounded-xl">
                    {notification.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white flex items-center">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 h-2 w-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{notification.time}</span>
                    </div>
                    <div className="mt-2.5">
                      <button className="py-1.5 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-blue-400 transition-colors">
                        {notification.type === 'invitation' ? 'Accept' : 
                         notification.type === 'social' ? 'Respond' : 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-800/50 rounded-full p-4 mb-4">
                <Bell className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300">No notifications</h3>
              <p className="text-gray-500 mt-2 max-w-xs">
                {activeFilter !== 'all' ? 
                  `You don't have any ${activeFilter} notifications` :
                  "You're all caught up!"}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <BottomNav />
    </div>
  );
} 