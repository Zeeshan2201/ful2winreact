import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
export const WalletContext = createContext();

// Custom hook for using the wallet
export const useWallet = () => useContext(WalletContext);

// Provider component
export const WalletProvider = ({ children }) => {
  // Get initial balance from localStorage or use default
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('walletBalance');
    return savedBalance ? parseFloat(savedBalance) : 2500;
  });
  
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('walletTransactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('walletBalance', balance.toString());
  }, [balance]);
  
  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('walletTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // Add money to wallet
  const addMoney = (amount, description) => {
    if (amount <= 0) return false;
    
    setBalance(prevBalance => prevBalance + amount);
    
    // Add transaction record
    const newTransaction = {
      id: Date.now(),
      type: 'deposit',
      amount: amount,
      description: description || 'Added to wallet',
      timestamp: new Date().toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev].slice(0, 50)); // Keep last 50 transactions
    return true;
  };

  // Deduct money from wallet
  const deductMoney = (amount, description) => {
    if (amount <= 0) return false;
    if (balance < amount) return false; // Insufficient funds
    
    setBalance(prevBalance => prevBalance - amount);
    
    // Add transaction record
    const newTransaction = {
      id: Date.now(),
      type: 'withdrawal',
      amount: amount,
      description: description || 'Deducted from wallet',
      timestamp: new Date().toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev].slice(0, 50)); // Keep last 50 transactions
    return true;
  };

  return (
    <WalletContext.Provider value={{ 
      balance, 
      transactions,
      addMoney,
      deductMoney
    }}>
      {children}
    </WalletContext.Provider>
  );
}; 