import React from 'react';
import { FiArrowUpRight, FiArrowDownLeft, FiClock, FiGift, FiDollarSign, FiCreditCard, FiAward } from 'react-icons/fi';
import { ArrowLeft, Wallet as WalletIcon, Plus, Minus, History } from 'lucide-react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

export default function Wallet() {
  const navigate = useNavigate();
  const { balance, transactions } = useWallet();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white pb-6">
        <Navbar />
        
        {/* Wallet summary */}
        <div className="px-4 pt-20">
          <div className="flex justify-between pt-8 items-center mb-4">
            <div className="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center">
              <FiAward className="mr-1" /> VIP POINTS: 4
            </div>
            <button 
              className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full font-medium"
              onClick={() => navigate('/history')}
            >
              Transactions
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <WalletIcon className="h-8 w-8 mr-3 text-white" />
                <span className="text-lg font-medium">Available Balance</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">₹{balance}</div>
            <p className="text-purple-200">Your current balance</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl p-4 flex items-center justify-center transition-colors">
              <Plus className="h-6 w-6 mr-2" />
              Add Money
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl p-4 flex items-center justify-center transition-colors">
              <Minus className="h-6 w-6 mr-2" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: <FiArrowUpRight size={20} />, label: 'Send', onClick: () => {} },
            { icon: <FiArrowDownLeft size={20} />, label: 'Request', onClick: () => {} },
            { 
              icon: <FiClock size={20} />, 
              label: 'History', 
              onClick: () => navigate('/history') 
            },
            { 
              icon: <FiGift size={20} />, 
              label: 'Rewards', 
              onClick: () => navigate('/rewards') 
            }
          ].map((item, index) => (
            <button 
              key={index}
              onClick={item.onClick}
              className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center"
            >
              <div className="bg-purple-100 text-purple-600 p-2 rounded-full mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Sub wallets */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <FiDollarSign className="mr-2 text-purple-600" /> My Wallets
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Unplayed Balance', amount: '₹0.0', color: 'bg-blue-100 text-blue-800' },
              { name: 'Bonus Cash', amount: '₹0.0', color: 'bg-green-100 text-green-800', action: 'Earn' },
              { name: 'Winnings', amount: '₹23.5', color: 'bg-purple-100 text-purple-800', action: 'Withdraw' }
            ].map((wallet, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`${wallet.color} p-2 rounded-full mr-3`}>
                    <FiCreditCard size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{wallet.name}</p>
                    <p className="text-sm text-gray-500">Available balance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{wallet.amount}</p>
                  {wallet.action && (
                    <button className={`text-xs mt-1 px-3 py-1 rounded-full ${
                      wallet.action === 'Withdraw' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {wallet.action}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coin wallet */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <FiGift className="mr-2 text-yellow-600" /> Coin Wallet
          </h3>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-medium">Your Coins</p>
                <p className="text-2xl font-bold text-yellow-600">1,250</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                  onClick={() => navigate('/rewards')}
                >
                  <FiArrowDownLeft className="mr-1" /> Earn
                </button>
                <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <FiArrowUpRight className="mr-1" /> Spend
                </button>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
              <p className="text-sm text-yellow-800 font-medium">Watch ads to earn 50 coins daily!</p>
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg flex items-center">
              <FiClock className="mr-2 text-purple-600" /> Recent Activity
            </h3>
            <button 
              className="text-sm text-purple-600 font-medium"
              onClick={() => navigate('/history')}
            >
              See All
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {[
              { type: 'deposit', amount: '+₹500', description: 'Added to wallet', time: '2 hrs ago', icon: '⬇️' },
              { type: 'withdrawal', amount: '-₹200', description: 'Contest entry', time: 'Yesterday', icon: '⬆️' },
              { type: 'bonus', amount: '+₹50', description: 'Referral bonus', time: '2 days ago', icon: '🎁' }
            ].map((txn, index) => (
              <div key={index} className={`p-4 flex items-center border-b border-gray-100 last:border-0`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  txn.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                  txn.type === 'withdrawal' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {txn.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{txn.description}</p>
                  <p className="text-sm text-gray-500">{txn.time}</p>
                </div>
                <p className={`font-bold ${
                  txn.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Promo banner */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Invite Friends</p>
              <p className="text-sm opacity-90">Earn ₹100 for each referral</p>
            </div>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-bold">
              Share Now
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Fixed) */}
      <BottomNav />
    </div>
  );
}