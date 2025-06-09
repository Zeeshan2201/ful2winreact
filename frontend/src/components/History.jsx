import React, { useState } from 'react';
import { FiArrowLeft, FiDownload, FiUpload, FiGift, FiSearch, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import Navbar from './Navbar';

export default function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample transaction data
  const allTransactions = [
    {
      id: 1,
      type: 'deposit',
      amount: '+₹500',
      description: 'Wallet Top-up',
      date: 'Today',
      time: '10:45 AM',
      status: 'Completed',
      icon: <FiDownload className="text-green-500" size={18} />,
      method: 'UPI'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: '-₹200',
      description: 'Contest Entry',
      date: 'Yesterday',
      time: '3:30 PM',
      status: 'Completed',
      icon: <FiUpload className="text-red-500" size={18} />,
      method: 'Game Entry'
    },
    {
      id: 3,
      type: 'bonus',
      amount: '+₹50',
      description: 'Referral Bonus',
      date: 'Mar 15',
      time: '11:20 AM',
      status: 'Completed',
      icon: <FiGift className="text-purple-500" size={18} />,
      method: 'Referral'
    },
    {
      id: 4,
      type: 'deposit',
      amount: '+₹1000',
      description: 'Wallet Top-up',
      date: 'Mar 14',
      time: '9:15 AM',
      status: 'Completed',
      icon: <FiDownload className="text-green-500" size={18} />,
      method: 'Bank Transfer'
    },
    {
      id: 5,
      type: 'withdrawal',
      amount: '-₹150',
      description: 'Contest Entry',
      date: 'Mar 12',
      time: '5:45 PM',
      status: 'Completed',
      icon: <FiUpload className="text-red-500" size={18} />,
      method: 'Game Entry'
    },
    {
      id: 6,
      type: 'bonus',
      amount: '+₹20',
      description: 'Daily Reward',
      date: 'Mar 10',
      time: '8:00 AM',
      status: 'Completed',
      icon: <FiGift className="text-purple-500" size={18} />,
      method: 'Daily Bonus'
    }
  ];

  // Filter transactions based on active tab
  const filteredTransactions = allTransactions.filter(txn => {
    const matchesTab = activeTab === 'all' || txn.type === activeTab;
    const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         txn.amount.includes(searchQuery) ||
                         txn.method.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
          {/* Header */}
          <Navbar />
    <div className="max-w-md mx-auto bg-gray-50 pt-8 min-h-screen shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 pb-6 rounded-b-2xl">
        <div className="flex items-center justify-between pt-12">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white bg-opacity-20"
          >
            <FiArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-xl font-bold">Transaction History</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 pb-24">
        {/* Search and Filter */}
        <div className="flex mb-4">
          <div className="relative flex-1 mr-2">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white rounded-lg border border-gray-200">
            <FiFilter className="text-gray-600" />
          </button>
        </div>

        {/* Transaction Type Tabs */}
        <div className="flex mb-4 bg-white p-1 rounded-xl shadow-sm">
          {[
            { id: 'all', label: 'All' },
            { id: 'deposit', label: 'Deposit' },
            { id: 'withdrawal', label: 'Withdraw' },
            { id: 'bonus', label: 'Bonus' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-2 px-1 rounded-lg text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredTransactions.map((txn) => (
              <div key={txn.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    txn.type === 'deposit' ? 'bg-green-100' : 
                    txn.type === 'withdrawal' ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    {txn.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{txn.method}</p>
                      </div>
                      <p className={`font-semibold ${
                        txn.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.amount}
                      </p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {txn.date} • {txn.time}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        txn.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-gray-400" size={24} />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">No transactions found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'Try a different search' : 'No transactions for this category'}
            </p>
          </div>
        )}

        {/* Transaction Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-4 bg-purple-50 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Total Deposits:</span>
              <span className="text-sm font-medium text-green-600">
                +₹{filteredTransactions
                  .filter(t => t.type === 'deposit')
                  .reduce((sum, t) => sum + parseInt(t.amount.slice(1)), 0)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Total Withdrawals:</span>
              <span className="text-sm font-medium text-red-600">
                -₹{filteredTransactions
                  .filter(t => t.type === 'withdrawal')
                  .reduce((sum, t) => sum + parseInt(t.amount.slice(1)), 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Bonuses:</span>
              <span className="text-sm font-medium text-purple-600">
                +₹{filteredTransactions
                  .filter(t => t.type === 'bonus')
                  .reduce((sum, t) => sum + parseInt(t.amount.slice(1)), 0)}
              </span>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-purple-800 mb-2">Need help with transactions?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Contact our support team for any transaction-related queries.
          </p>
          <button className="text-sm text-purple-600 font-medium">
            Contact Support
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
    </div>
  );
}