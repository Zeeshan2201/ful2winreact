import { Bell } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 w-full z-[1000] flex items-center justify-between px-4 py-3 bg-gray-900/90 backdrop-blur-xl shadow-xl rounded-b-2xl border-2 border-gray-800 bg-gradient-to-r from-gray-900 via-purple-900/90 to-gray-900">
      {/* Logo Only */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 p-1 rounded-2xl shadow-lg">
          <img src="/images/logo.jpg" alt="ful2win Logo" className="h-12 w-12 rounded-xl bg-white/95 shadow-md" />
        </div>
      </div>
      {/* Notification Icon Only */}
      <button className="bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg hover:from-gray-900 hover:to-gray-900">
        <Bell className="h-6 w-6" />
      </button>
    </div>
  );
}