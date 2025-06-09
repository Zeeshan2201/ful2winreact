import React, { useState, useEffect } from 'react';

/**
 * DiceGameLogic - Handles the game logic for the Dice game
 * This component manages dice rolling, turn tracking, and winner determination
 */
const DiceGameLogic = ({ onGameEnd }) => {
  // Game state tracking
  const [currentPlayer, setCurrentPlayer] = useState('player'); // 'player' or 'opponent'
  const [playerDice, setPlayerDice] = useState(null);
  const [opponentDice, setOpponentDice] = useState(null);
  const [lastRolledDice, setLastRolledDice] = useState(null);
  const [roundScore, setRoundScore] = useState({ player: 0, opponent: 0 });
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundMessage, setRoundMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [turnEnded, setTurnEnded] = useState(false);
  const [canRoll, setCanRoll] = useState(true);
  
  // Reset for new round
  const startNextRound = () => {
    setPlayerDice(null);
    setOpponentDice(null);
    setLastRolledDice(null);
    setRoundMessage('');
    setRoundNumber(prevRound => prevRound + 1);
    setCurrentPlayer('player');
    setIsRolling(false);
    setTurnEnded(false);
    setCanRoll(true);
  };
  
  // Handle dice roll for current player
  const rollDice = () => {
    if (!canRoll || isRolling) return;
    
    setIsRolling(true);
    setCanRoll(false);
    
    // Simulate dice roll animation
    const rollInterval = setInterval(() => {
      const randomDice = Math.floor(Math.random() * 6) + 1;
      setLastRolledDice(randomDice);
    }, 100);
    
    // Stop rolling after 1 second and set final value
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDice = Math.floor(Math.random() * 6) + 1;
      setLastRolledDice(finalDice);
      
      if (currentPlayer === 'player') {
        setPlayerDice(finalDice);
        setCurrentPlayer('opponent');
        
        // Opponent will roll after a delay
        setTimeout(() => {
          handleOpponentTurn();
        }, 1000);
      } else {
        setOpponentDice(finalDice);
        setTurnEnded(true);
        evaluateRound(playerDice, finalDice);
      }
      
      setIsRolling(false);
    }, 1000);
  };
  
  // Handle opponent's automatic turn
  const handleOpponentTurn = () => {
    setIsRolling(true);
    
    // Simulate dice roll animation
    const rollInterval = setInterval(() => {
      const randomDice = Math.floor(Math.random() * 6) + 1;
      setLastRolledDice(randomDice);
    }, 100);
    
    // Stop rolling after 1 second and set final value
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDice = Math.floor(Math.random() * 6) + 1;
      setLastRolledDice(finalDice);
      setOpponentDice(finalDice);
      setIsRolling(false);
      setTurnEnded(true);
      
      evaluateRound(playerDice, finalDice);
    }, 1000);
  };
  
  // Evaluate the round result
  const evaluateRound = (playerValue, opponentValue) => {
    let winner;
    
    if (playerValue > opponentValue) {
      winner = 'player';
      setRoundMessage('You won this round!');
      setRoundScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (opponentValue > playerValue) {
      winner = 'opponent';
      setRoundMessage('Opponent won this round!');
      setRoundScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
    } else {
      winner = 'draw';
      setRoundMessage('This round is a draw!');
    }
    
    // Check if the game is over (best of 5 rounds)
    setTimeout(() => {
      if (roundScore.player === 3 || roundScore.opponent === 3 || roundNumber >= 5) {
        setGameOver(true);
        if (onGameEnd) {
          onGameEnd({
            winner: roundScore.player > roundScore.opponent ? 'player' : 'opponent',
            score: {
              player: roundScore.player,
              opponent: roundScore.opponent
            },
            lastDice: {
              player: playerValue,
              opponent: opponentValue
            }
          });
        }
      } else {
        // Start next round after a delay
        setTimeout(startNextRound, 2000);
      }
    }, 1500);
  };
  
  // Reset canRoll when it's player's turn again
  useEffect(() => {
    if (currentPlayer === 'player' && !isRolling && !turnEnded) {
      setCanRoll(true);
    }
  }, [currentPlayer, isRolling, turnEnded]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Round indicator */}
      <div className="bg-white/10 rounded-lg px-6 py-3 mb-6">
        <div className="flex justify-between items-center w-72">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {roundScore.player}
            </div>
            <div className="text-xs text-white/60">You</div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="text-lg font-medium text-white">
                Round {roundNumber}/5
              </div>
              <div className="text-sm font-medium text-yellow-400">
                Best of 5
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {roundScore.opponent}
            </div>
            <div className="text-xs text-white/60">Opponent</div>
          </div>
        </div>
      </div>
      
      {/* Dice display area */}
      <div className="flex justify-center items-center gap-16 mb-8">
        {/* Player dice */}
        <div className="flex flex-col items-center">
          <div className={`
            w-24 h-24 rounded-lg border-2
            ${currentPlayer === 'player' && !turnEnded ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 bg-white/10'}
            flex items-center justify-center text-4xl font-bold
          `}>
            {playerDice || '-'}
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm text-white/70">Your dice</div>
          </div>
        </div>
        
        {/* VS */}
        <div className="text-2xl font-bold text-white/60">VS</div>
        
        {/* Opponent dice */}
        <div className="flex flex-col items-center">
          <div className={`
            w-24 h-24 rounded-lg border-2
            ${currentPlayer === 'opponent' && !turnEnded ? 'border-red-500 bg-red-500/20' : 'border-gray-600 bg-white/10'}
            flex items-center justify-center text-4xl font-bold
          `}>
            {opponentDice || '-'}
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm text-white/70">Opponent dice</div>
          </div>
        </div>
      </div>
      
      {/* Last rolled dice */}
      {lastRolledDice && (
        <div className="mb-6 text-center">
          <div className="text-sm text-white/70">Last rolled</div>
          <div className={`
            w-16 h-16 mx-auto rounded-lg border-2 border-yellow-500 bg-yellow-500/20
            flex items-center justify-center text-3xl font-bold text-yellow-400
            ${isRolling ? 'animate-pulse' : ''}
          `}>
            {lastRolledDice}
          </div>
        </div>
      )}
      
      {/* Roll button */}
      {currentPlayer === 'player' && !turnEnded && (
        <button
          onClick={rollDice}
          disabled={!canRoll || isRolling}
          className={`
            px-8 py-3 rounded-lg font-bold text-lg
            ${canRoll && !isRolling ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}
            transition-all
          `}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      )}
      
      {/* Opponent rolling message */}
      {currentPlayer === 'opponent' && !turnEnded && (
        <div className="text-center text-white/70">
          <p>Opponent is rolling{isRolling ? '...' : ''}</p>
        </div>
      )}
      
      {/* Round message */}
      {roundMessage && turnEnded && (
        <div className={`
          text-xl font-bold mt-4 text-center
          ${roundMessage.includes('You won') ? 'text-green-400' : 
           roundMessage.includes('Opponent won') ? 'text-red-400' : 
           'text-yellow-400'}
        `}>
          {roundMessage}
        </div>
      )}
      
      {/* Turn indicator */}
      {!turnEnded && (
        <div className="mt-4 text-center">
          <p className="text-white/70">
            {currentPlayer === 'player' 
              ? 'Your turn to roll' 
              : "Opponent's turn to roll"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiceGameLogic; 