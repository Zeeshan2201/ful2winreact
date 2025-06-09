import React, { useState, useEffect } from 'react';

/**
 * CoinflipGameLogic - Handles the game logic for Coinflip
 * This component manages the coin flipping, user prediction, and round tracking
 */
const CoinflipGameLogic = ({ onGameEnd }) => {
  // Game choices
  const CHOICES = {
    HEADS: 'heads',
    TAILS: 'tails'
  };
  
  // Game state tracking
  const [playerChoice, setPlayerChoice] = useState(null);
  const [coinResult, setCoinResult] = useState(null);
  const [roundWinner, setRoundWinner] = useState(null);
  const [roundScore, setRoundScore] = useState({ player: 0, opponent: 0 });
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundMessage, setRoundMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [seconds, setSeconds] = useState(15);
  const [roundInProgress, setRoundInProgress] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Start new round with fresh timer
  const startNextRound = () => {
    setPlayerChoice(null);
    setCoinResult(null);
    setRoundWinner(null);
    setRoundMessage('');
    setRoundNumber(prevRound => prevRound + 1);
    setSeconds(15);
    setRoundInProgress(true);
    setIsFlipping(false);
    setShowResult(false);
  };
  
  // Timer effect for selections
  useEffect(() => {
    let timer;
    if (roundInProgress) {
      timer = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(timer);
            flipCoin();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [roundInProgress]);
  
  // Flip the coin and determine result
  const flipCoin = () => {
    setRoundInProgress(false);
    setIsFlipping(true);
    
    // Simulate coin flip animation for 2 seconds
    setTimeout(() => {
      // Determine coin result (50/50 chance)
      const result = Math.random() < 0.5 ? CHOICES.HEADS : CHOICES.TAILS;
      setCoinResult(result);
      setIsFlipping(false);
      setShowResult(true);
      
      // Evaluate round result
      evaluateRound(result);
    }, 2000);
  };
  
  // Evaluate the round result
  const evaluateRound = (result) => {
    // Determine winner
    const winner = playerChoice === result ? 'player' : 'opponent';
    setRoundWinner(winner);
    
    // Update score and set message
    if (winner === 'player') {
      setRoundMessage('You guessed correctly!');
      setRoundScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setRoundMessage(`Wrong guess! It was ${result}.`);
      setRoundScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
    }
    
    // Check if the game is over (first to 3 points)
    setTimeout(() => {
      if (roundScore.player === 3 || roundScore.opponent === 3) {
        setGameOver(true);
        if (onGameEnd) {
          onGameEnd({
            winner: roundScore.player > roundScore.opponent ? 'player' : 'opponent',
            score: {
              player: roundScore.player,
              opponent: roundScore.opponent
            }
          });
        }
      } else {
        // Start next round
        setTimeout(startNextRound, 2000);
      }
    }, 1500);
  };
  
  // Handle player selection
  const handlePlayerChoice = (choice) => {
    if (!roundInProgress || playerChoice) return;
    
    setPlayerChoice(choice);
  };

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
                Round {roundNumber}
              </div>
              <div className="text-sm font-medium text-yellow-400">
                First to 3 wins
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
      
      {/* Timer or Coin */}
      <div className="mb-6">
        {roundInProgress ? (
          <div className={`
            w-24 h-24 rounded-full flex items-center justify-center 
            text-2xl font-bold border-4
            ${seconds <= 5 ? 'border-red-500 text-red-400' : 'border-white/30 text-white'}
          `}>
            {seconds}
          </div>
        ) : (
          <div className="w-32 h-32 relative">
            {isFlipping ? (
              <div className="animate-flip w-full h-full bg-yellow-500 rounded-full flex items-center justify-center text-lg font-bold">
                Flipping...
              </div>
            ) : showResult && (
              <div className={`
                w-full h-full rounded-full flex items-center justify-center
                text-2xl font-bold border-4 border-yellow-500
                ${coinResult === CHOICES.HEADS ? 'bg-yellow-400' : 'bg-yellow-600'}
              `}>
                {coinResult === CHOICES.HEADS ? 'H' : 'T'}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Player choices */}
      <div className="flex gap-6 mb-6">
        {Object.values(CHOICES).map((choice) => (
          <button
            key={choice}
            onClick={() => handlePlayerChoice(choice)}
            className={`
              w-32 h-16 rounded-lg flex items-center justify-center
              ${playerChoice === choice 
                ? 'bg-blue-500/30 border-2 border-blue-500' 
                : 'bg-white/10 hover:bg-white/20'}
              transition-all uppercase font-bold
              ${!roundInProgress || playerChoice ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!roundInProgress || playerChoice}
          >
            {choice}
          </button>
        ))}
      </div>
      
      {/* Round message */}
      {roundMessage && showResult && (
        <div className={`
          text-xl font-bold mt-4 text-center
          ${roundWinner === 'player' ? 'text-green-400' : 'text-red-400'}
        `}>
          {roundMessage}
        </div>
      )}
      
      {/* Player selection */}
      {playerChoice && roundInProgress && (
        <div className="mt-4 text-center">
          <p className="text-white/70">You selected: <span className="uppercase font-bold">{playerChoice}</span></p>
          <p className="text-white/50 text-sm">Waiting for coin flip in {seconds} seconds...</p>
        </div>
      )}
      
      {/* Instructions */}
      {!playerChoice && roundInProgress && (
        <div className="mt-4 text-center">
          <p className="text-white/70">Select Heads or Tails</p>
          <p className="text-white/50 text-sm">Coin will flip in {seconds} seconds</p>
        </div>
      )}
      
      {/* Style for coin flip animation */}
      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(1800deg); }
        }
        .animate-flip {
          animation: flip 2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CoinflipGameLogic; 