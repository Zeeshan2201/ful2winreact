import React from 'react';
import { Home, Gamepad2, Users, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Games', icon: Gamepad2, href: '/games' },
  { name: 'Community', icon: Users, href: '/community' },
  { name: 'Profile', icon: User, href: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999]">
      <div className="mx-auto max-w-2xl">
        <div className="glass-effect bg-gradient-to-tr from-gray-900/95 via-purple-900/90 to-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl rounded-t-2xl flex justify-around items-center h-20 px-2">
          
          {/* Left Navigation Items */}
          <div className="flex-1 flex justify-around">
            {navigation.slice(0, 2).map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  to={item.href}
                  key={item.name}
                  className={`flex flex-col items-center justify-center w-full h-full group transition-all duration-200 ${
                    isActive ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg scale-110'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <item.icon className={`h-6 w-6 transition-all duration-200 text-white ${isActive ? 'scale-110' : ''}`} />
                  </span>
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center px-4 -mt-10">
            <Link
              to="/"
              className="bg-gradient-to-br from-purple-600 to-blue-600 p-1 rounded-2xl shadow-xl hover:scale-105 transition"
            >
              <img
                src="/images/logo.jpg"
                alt="ful2win Logo"
                className="h-14 w-14 rounded-2xl bg-white/90 shadow-md"
              />
            </Link>
          </div>

          {/* Right Navigation Items */}
          <div className="flex-1 flex justify-around">
            {navigation.slice(2).map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  to={item.href}
                  key={item.name}
                  className={`flex flex-col items-center justify-center w-full h-full group transition-all duration-200 ${
                    isActive ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg scale-110'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <item.icon className={`h-6 w-6 transition-all duration-200 text-white ${isActive ? 'scale-110' : ''}`} />
                  </span>
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
