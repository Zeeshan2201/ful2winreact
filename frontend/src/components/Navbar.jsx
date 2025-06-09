import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, Bell, Wallet, Gift, Trophy, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const navigation = [];

const moreOptions = [
  { name: 'About Us', href: '/about' },
  { name: 'Support', href: '/support' },
  { name: 'Terms & Conditions', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
];

export default function Navbar() {
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const { balance } = useWallet();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <nav className="glass-effect shadow-xl w-full fixed top-0 left-0 z-[1100] rounded-b-3xl py-3 px-2 md:px-8 flex items-center justify-between">
      <div className="flex items-center h-16">
        <img src="/images/logo.jpg" alt="ful2win Logo" className="h-12 w-12 rounded-lg shadow-md bg-white/80" />
        <div className="ml-3 hidden md:block">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">ful2win</h1>
          <p className="text-sm text-gray-600">Play & Win Real Cash</p>
        </div>
      </div>

      {/* Wallet Balance (center) */}
      <Link 
        to="/wallet"
        className="flex items-center bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white px-5 py-2 rounded-xl mx-2 shadow-lg border-2 border-yellow-200/60 cursor-pointer hover:shadow-xl transition-all duration-200"
      >
        <Wallet className="h-5 w-5 mr-2 text-white drop-shadow" />
        <span className="font-bold text-lg drop-shadow">₹{balance}</span>
      </Link>

      {/* Nav Links (Desktop) */}
      <div className="hidden md:flex items-center space-x-6">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-gray-700 hover:text-purple-700 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-purple-100/60 active:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {item.name}
          </a>
        ))}
      </div>

      {/* Right Side: Notification Icon */}
      <div className="flex items-center">
        <button 
          onClick={handleNotificationClick}
          className="relative p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-all duration-200 shadow-lg border border-gray-800"
        >
          <Bell className="h-6 w-6 text-white" />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md border-2 border-gray-900">
              {notifications}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
