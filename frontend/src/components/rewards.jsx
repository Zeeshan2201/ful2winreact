import React from 'react';
import Navbar from './Navbar';
import { FaCoins, FaGoogle, FaFacebook, FaTwitter, FaUserFriends, FaPlay, FaCheck } from 'react-icons/fa';
import BottomNav from './BottomNav';

const RewardsPage = () => {
  const [coins, setCoins] = React.useState(1250);
  const [completedTasks, setCompletedTasks] = React.useState([]);

  const rewardOptions = [
    {
      id: 1,
      title: "Watch Video Ads",
      description: "Watch a 30-second video to earn coins",
      icon: <FaPlay className="text-white" />,
      reward: 50,
      color: "bg-gradient-to-br from-indigo-500 to-purple-500"
    },
    {
      id: 2,
      title: "Login with Google",
      description: "Connect your Google account",
      icon: <FaGoogle className="text-white" />,
      reward: 100,
      color: "bg-gradient-to-br from-red-500 to-orange-500"
    },
    {
      id: 3,
      title: "Login with Facebook",
      description: "Connect your Facebook account",
      icon: <FaFacebook className="text-white" />,
      reward: 100,
      color: "bg-gradient-to-br from-blue-600 to-indigo-600"
    },
    {
      id: 4,
      title: "Connect Twitter",
      description: "Link your Twitter profile",
      icon: <FaTwitter className="text-white" />,
      reward: 75,
      color: "bg-gradient-to-br from-blue-400 to-cyan-400"
    },
    {
      id: 5,
      title: "Refer Friends",
      description: "Get coins for each friend who joins",
      icon: <FaUserFriends className="text-white" />,
      reward: 200,
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      id: 6,
      title: "Daily Check-in",
      description: "Come back tomorrow for more coins",
      icon: <FaCheck className="text-white" />,
      reward: 30,
      color: "bg-gradient-to-br from-indigo-400 to-purple-400"
    }
  ];

  const claimReward = (id, rewardAmount) => {
    if (!completedTasks.includes(id)) {
      setCoins(coins + rewardAmount);
      setCompletedTasks([...completedTasks, id]);
    }
  };

  return (
     <div className="min-h-screen bg-gray-900 text-white pb-20">
          {/* Header */}
          <Navbar />
          <BottomNav/>
    <div className="max-w-md mx-auto bg-gray-50 pt-20 min-h-screen shadow-lg">
      <div className="p-5 pb-20">
        {/* Header with purple gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-b-2xl p-5 -mx-5 -mt-5 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Rewards Center</h1>
            <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full shadow-md">
              <FaCoins className="text-yellow-300 mr-2" />
              <span className="font-semibold">{coins} coins</span>
            </div>
          </div>
        </div>

        {/* Daily Bonus Section */}
        <div className="mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <span className="bg-purple-100 text-purple-600 p-1 rounded-full mr-2">
              <FaCheck size={16} />
            </span>
            Daily Bonus Streak
          </h2>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${day <= 3 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                  {day}
                </div>
                <span className="text-xs mt-1 text-gray-500">Day {day}</span>
                {day <= 3 && (
                  <span className="text-xs text-purple-600 font-medium">+{day * 10}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reward Options */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="bg-purple-100 text-purple-600 p-1 rounded-full mr-2">
            <FaCoins size={16} />
          </span>
          Earn More Coins
        </h2>
        <div className="space-y-3">
          {rewardOptions.map((task) => (
            <div 
              key={task.id}
              onClick={() => claimReward(task.id, task.reward)}
              className={`flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-transform active:scale-95 ${
                completedTasks.includes(task.id) ? 'opacity-70' : 'cursor-pointer hover:bg-purple-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.color}`}>
                {task.icon}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <p className="text-xs text-gray-500">{task.description}</p>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-purple-600 mr-2">+{task.reward}</span>
                <FaCoins className="text-yellow-500" />
                {completedTasks.includes(task.id) && (
                  <span className="ml-2 text-xs text-green-500">Claimed</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Promo Banner */}
        <div className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Invite Friends</p>
              <p className="text-sm opacity-90">Earn 200 coins for each referral</p>
            </div>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-bold">
              Share Now
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RewardsPage;