"use client"
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { useState, useEffect } from "react"
// import {Link} from "react-router-dom";
import {
  Bell,
  ChevronRight,
  Copy,
  CreditCard,
  ExternalLink,
  Gift,
  Gamepad2,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  User,
  ChevronDown,
  Trophy,
  Coins,
  Wallet,
  BarChart2,
  Users,
  ShieldCheck,
  MessageSquare,
  Mail,
  Lock,
  Edit,
  Check,
  X,
  ArrowRight
} from "lucide-react"
import { Link } from "react-router-dom"
import { useWallet } from '../context/WalletContext';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [openAccordion, setOpenAccordion] = useState(null)
const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [userData, setUserData] = useState(null);

  const { balance } = useWallet();

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!user);
    setUserData(user);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
  };
  const toggleAccordion = (id

  ) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  const handleEditUsernameClick = () => {
    setIsEditingUsername(!isEditingUsername);
  };

  const handleUsernameChange = (event) => {
    setUserData({...userData, fullName: event.target.value});
  };

  // Add a function to save the username (placeholder for actual save logic)
  const saveUsername = () => {
    console.log("Saving username:", userData); // Replace with API call to save username
    setIsEditingUsername(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <Navbar />
      
      {/* Profile Header */}
      <div className="relative pt-24 px-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-purple-500 overflow-hidden bg-gray-700 flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <Trophy className="h-3 w-3 mr-1" /> PRO
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{userData?.fullName || "Guest User"}</h1>
            <p className="text-purple-400 text-sm">Level 24 • 12,450 XP</p>
            
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" 
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Adjusted for mobile view */}
        <div className="grid grid-cols-4 gap-2 mb-6 overflow-x-auto no-scrollbar">
          <div className="min-w-[80px] bg-gray-800 border border-gray-700 rounded-xl p-2 text-center">
            <Coins className="h-5 w-5 mx-auto text-yellow-400 mb-1" />
            <p className="text-xs text-gray-300">Balance</p>
            <p className="text-sm font-bold">₹{balance}</p>
          </div>
          
          <div className="min-w-[80px] bg-gray-800 border border-gray-700 rounded-xl p-2 text-center">
            <Trophy className="h-5 w-5 mx-auto text-green-400 mb-1" />
            <p className="text-xs text-gray-300">Wins</p>
            <p className="text-sm font-bold">156</p>
          </div>
          
          <div className="min-w-[80px] bg-gray-800 border border-gray-700 rounded-xl p-2 text-center">
            <Gamepad2 className="h-5 w-5 mx-auto text-blue-400 mb-1" />
            <p className="text-xs text-gray-300">Games</p>
            <p className="text-sm font-bold">248</p>
          </div>
          
          <div className="min-w-[80px] bg-gray-800 border border-gray-700 rounded-xl p-2 text-center">
            <ShieldCheck className="h-5 w-5 mx-auto text-purple-400 mb-1" />
            <p className="text-xs text-gray-300">KYC</p>
            <p className="text-sm font-bold">Verified</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4">
        {/* Tab Navigation - Adjusted for mobile view */}
        <div className="flex overflow-x-auto pb-2 gap-2 mb-4 no-scrollbar">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
              activeTab === "profile" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
              activeTab === "games" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            My Games
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
              activeTab === "wallet" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab("refer")}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
              activeTab === "refer" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            Refer & Earn
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-4">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {/* Account Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <User className="text-purple-400" /> Account
                  </h3>
                  <button onClick={handleEditUsernameClick} className="text-purple-400 text-sm">{isEditingUsername ? 'Cancel' : 'Edit'}</button>
                </div>
                <div className="divide-y divide-gray-700">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Username</p>
                      {isEditingUsername ? (
                        <input
                          type="text"
                          value={userData?.fullName || ""}
                          onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                          className="bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      ) : (
                        <p>{userData?.fullName || "Guest User"}</p>
                      )}
                    </div>
                    {isEditingUsername ? (
                      <button onClick={saveUsername} className="text-green-400">
                         <Check className="h-5 w-5" />
                      </button>
                    ) : (
                    <Edit className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p>{userData?.phoneNumber ? `+91 ${userData.phoneNumber}` : "Not available"}</p>
                    </div>
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-bold flex items-center gap-2">
                    <Shield className="text-purple-400" /> Security
                  </h3>
                </div>
                <div className="divide-y divide-gray-700">
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p>Change Password</p>
                        <p className="text-sm text-gray-400">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-gray-400" />
                      <div>
                        <p>Two-Factor Authentication</p>
                        <p className="text-sm text-gray-400">Disabled</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-bold flex items-center gap-2">
                    <Settings className="text-purple-400" /> Settings
                  </h3>
                </div>
                <div className="divide-y divide-gray-700">
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <p>Notifications</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <p>Payment Methods</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-gray-400" />
                      <p>Help & Support</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Support Section with Full FAQs */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-bold flex items-center gap-2">
                    <HelpCircle className="text-purple-400" /> Support
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center justify-center gap-2">
                    <MessageSquare className="h-5 w-5" /> Live Chat
                  </button>
                  <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5" /> Email Support
                  </button>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-3">FAQs</h4>
                    <div className="space-y-4">
                      {[
                        {
                          question: "How do I withdraw my winnings?",
                          answer: "To withdraw your winnings, go to the Withdrawals tab in your profile, enter the amount you wish to withdraw, select your preferred payment method, and follow the instructions. Withdrawals are typically processed within 24-48 hours."
                        },
                        {
                          question: "What is KYC verification and why is it required?",
                          answer: "KYC (Know Your Customer) verification is a process that verifies your identity. It's required by regulations to prevent fraud and ensure the platform is used legally. You'll need to provide valid ID proof and address verification to complete KYC."
                        },
                        {
                          question: "How does the referral program work?",
                          answer: "Our referral program allows you to earn ₹100 for each friend who joins using your referral code and plays their first game. There's no limit to how many friends you can refer, and the rewards are credited directly to your account balance."
                        },
                        {
                          question: "Is it safe to play games on this platform?",
                          answer: "Yes, our platform uses advanced security measures to protect your data and ensure fair gameplay. All games are regularly audited by independent agencies to verify their fairness and randomness. Your financial transactions are secured with industry-standard encryption."
                        },
                        {
                          question: "What payment methods are accepted?",
                          answer: "We accept various payment methods including UPI, credit/debit cards, net banking, and popular e-wallets. For withdrawals, you can use UPI, bank transfers, or select e-wallets depending on your location."
                        }
                      ].map((faq, index) => (
                        <div key={index} className="border-b border-gray-700 last:border-0 pb-4">
                          <button
                            onClick={() => toggleAccordion(`faq-${index}`)}
                            className="flex w-full items-center justify-between text-left font-medium hover:text-purple-400 transition-colors"
                          >
                            {faq.question}
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${
                                openAccordion === `faq-${index}` ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {openAccordion === `faq-${index}` && (
                            <div className="pt-2 text-gray-300 text-sm">{faq.answer}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {/* <button className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center justify-center gap-2">
                <LogOut className="h-5 w-5" /> Logout
              </button> */}

              {/* <button className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center justify-center gap-2">
                
              </button> */}
 {isLoggedIn ? <button onClick={handleLogout} className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center justify-center gap-2" >
      Logout
    </button> : <button className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center justify-center gap-2" >
      {/* {isLoggedIn ? "Logout" : "Login"} */}
      <Link to = "/login" className="h-full w-full" > Login </Link>
    </button>}

    {/* <button className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center justify-center gap-2" >
      <Link to = "/login" className="h-5 w-5" > Login </Link>
    </button> */}
            </div>
          )}

          {/* Games Tab */}
          {activeTab === "games" && (
            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                {[
                  { game: "Ludo King", time: "Today, 2:30 PM", result: "Won", amount: "+₹120", status: "win" },
                  { game: "Carrom Pool", time: "Today, 12:15 PM", result: "Lost", amount: "-₹50", status: "loss" },
                  { game: "Rummy", time: "Yesterday, 8:45 PM", result: "Won", amount: "+₹200", status: "win" },
                  { game: "Poker Tournament", time: "Yesterday, 6:20 PM", result: "Lost", amount: "-₹100", status: "loss" },
                ].map((game, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 border-b border-gray-700 last:border-0`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <Gamepad2 className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">{game.game}</p>
                        <p className="text-sm text-gray-400">{game.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${game.status === "win" ? "text-green-400" : "text-red-400"}`}>
                        {game.result}
                      </p>
                      <p className={`text-sm ${game.status === "win" ? "text-green-400" : "text-red-400"}`}>
                        {game.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-purple-400 font-medium">
                View All Games
              </button>
            </div>
          )}

          {/* Wallet Tab - Updated as per request */}
          {activeTab === "wallet" && (
            <div className="space-y-4">
              {/* Wallet Summary Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Wallet className="text-purple-400" /> Wallet Summary
                  </h3>
                  <Link to="/wallet" className="text-purple-400 text-sm flex items-center">
                    Go to Wallet <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Total Balance</p>
                    <p className="text-xl font-bold">₹{balance}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Available to Withdraw</p>
                    <p className="text-xl font-bold">₹{balance}</p>
                  </div>
                </div>
                
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="font-medium">KYC Verified</p>
                      <p className="text-xs text-gray-400">Full access enabled</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Withdrawal History */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-bold">Withdrawal History</h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {[
                    {
                      id: "wd-001",
                      amount: "₹1,000",
                      date: "May 8, 2023",
                      method: "UPI",
                      status: "Completed",
                      statusColor: "text-green-400"
                    },
                    {
                      id: "wd-002",
                      amount: "₹500",
                      date: "April 25, 2023",
                      method: "Bank Transfer",
                      status: "Completed",
                      statusColor: "text-green-400"
                    },
                    {
                      id: "wd-003",
                      amount: "₹2,000",
                      date: "April 12, 2023",
                      method: "UPI",
                      status: "Completed",
                      statusColor: "text-green-400"
                    },
                    {
                      id: "wd-004",
                      amount: "₹750",
                      date: "March 30, 2023",
                      method: "Bank Transfer",
                      status: "Failed",
                      statusColor: "text-red-400"
                    },
                  ].map((withdrawal) => (
                    <div key={withdrawal.id} className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">{withdrawal.amount}</p>
                          <p className="text-sm text-gray-400">{withdrawal.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">{withdrawal.method}</p>
                        <p className={`text-sm ${withdrawal.statusColor}`}>{withdrawal.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-purple-400 font-medium">
                View All Transactions
              </button>
            </div>
          )}

          {/* Refer Tab */}
          {activeTab === "refer" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6 text-center">
                <Gift className="h-12 w-12 mx-auto text-yellow-400 mb-3" />
                <h2 className="text-xl font-bold mb-2">Invite Friends & Earn ₹100</h2>
                <p className="text-gray-300 mb-4">
                  Get ₹100 for each friend who joins and plays their first game
                </p>
                
                <div className="bg-gray-900/50 rounded-lg p-3 flex items-center justify-between mb-4">
                  <code className="text-yellow-400 font-mono">GAMERX123FRIEND</code>
                  <button className="p-1 text-gray-300 hover:text-white">
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white">
                    Share Link
                  </button>
                  <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                    Invite Friends
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-3">Your Referrals</h3>
                
                <div className="space-y-3">
                  {[
                    { name: "Rahul S.", date: "May 10", reward: "₹100", status: "Completed" },
                    { name: "Priya M.", date: "May 8", reward: "₹100", status: "Completed" },
                    { name: "Amit K.", date: "May 5", reward: "Pending", status: "In Progress" },
                  ].map((ref, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">{ref.name}</p>
                          <p className="text-sm text-gray-400">{ref.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={ref.status === "Completed" ? "text-green-400" : "text-yellow-400"}>
                          {ref.status}
                        </p>
                        <p className="text-sm text-gray-300">{ref.reward}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}