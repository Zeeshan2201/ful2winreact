import React from 'react';
import { Trophy, Shield, Zap, Users, Gift, Star } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Win Real Cash",
      description: "Compete in tournaments and win real money prizes instantly"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Secure Platform",
      description: "Your money and data are protected with bank-grade security"
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "Instant Withdrawals",
      description: "Get your winnings instantly to your bank account"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Large Community",
      description: "Join thousands of players in daily tournaments"
    },
    {
      icon: <Gift className="h-8 w-8 text-red-500" />,
      title: "Daily Rewards",
      description: "Earn rewards just by playing your favorite games"
    },
    {
      icon: <Star className="h-8 w-8 text-amber-500" />,
      title: "Premium Support",
      description: "24/7 customer support for all your queries"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Why Choose ful2win?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the best gaming platform with instant rewards, secure transactions, and a thriving community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/20">
            Start Playing Now
          </button>
        </div>
      </div>
    </section>
  );
} 