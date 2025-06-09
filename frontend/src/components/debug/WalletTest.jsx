import React from 'react';
import { useWallet } from '../../context/WalletContext';

const WalletTest = () => {
  const { balance, addMoney, deductMoney } = useWallet();
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Wallet Test</h2>
      
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p className="text-lg font-medium">Current Balance: ₹{balance.toFixed(2)}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button 
          onClick={() => addMoney(100, "Test deposit")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add ₹100
        </button>
        
        <button 
          onClick={() => deductMoney(50, "Test withdrawal")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Deduct ₹50
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => addMoney(5, "Small win")}
          className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Win ₹5
        </button>
        
        <button 
          onClick={() => addMoney(15, "Medium win")}
          className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Win ₹15
        </button>
        
        <button 
          onClick={() => addMoney(25, "Large win")}
          className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Win ₹25
        </button>
      </div>
    </div>
  );
};

export default WalletTest; 