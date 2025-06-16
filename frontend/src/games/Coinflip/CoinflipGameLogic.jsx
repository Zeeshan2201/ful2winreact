import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Confetti from 'react-confetti'; // Assumed import for WinBurst

// Base URL for API
const BASE_URL = 'http://localhost:5000/api';

// Initialize Socket.IO client
const socket = io('http://localhost:5000', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

/**
 * CoinflipGameLogic - Handles the multiplayer coin flip game logic
 * Manages player choices, coin flip, scoring, history, and UI display with win/tie/loss bursts
 */
const CoinflipGameLogic = ({ userId, onGameEnd, prizeAmount = 100 }) => {
  // Get match data from localStorage
  const matchData = localStorage.getItem("match_found");
  const userData = localStorage.getItem("user");
  const parsedMatchData = matchData ? JSON.parse(matchData) : null;
  const parsedUserData = userData ? JSON.parse(userData) : null;
  
  // Initialize room and player IDs
  const [roomId, setRoomId] = useState(parsedMatchData?.roomId || null);
  const [playerId1, setPlayerId1] = useState(parsedMatchData?.players?.[0]?.userId || null);
  const [playerId2, setPlayerId2] = useState(parsedMatchData?.players?.[1]?.userId || null);
  const [isPlayer1, setIsPlayer1] = useState(false);

  // Game choices
  const CHOICES = {
    HEADS: 'heads',
    TAILS: 'tails',
  };

  // Game state tracking
  const [playerChoice, setPlayerChoice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [player1Attempts, setPlayer1Attempts] = useState(0);
  const [player2Attempts, setPlayer2Attempts] = useState(0);
  const [coinResult, setCoinResult] = useState(null);
  const [roundWinner, setRoundWinner] = useState(null);
  const [roundScore, setRoundScore] = useState({ player1: 0, player2: 0 });
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundMessage, setRoundMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameOutcome, setGameOutcome] = useState(null);
  const [seconds, setSeconds] = useState(15);
  const [roundInProgress, setRoundInProgress] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [bothConnected, setBothConnected] = useState(true);
  const [tiebreakerCount, setTiebreakerCount] = useState(0);
  const [gameId, setGameId] = useState(null);

  // Initialize game and player roles
  useEffect(() => {
    if (parsedMatchData && parsedUserData) {
      // Set player roles
      const isPlayer1 = parsedMatchData.players[0].userId === parsedUserData._id;
      setIsPlayer1(isPlayer1);
      
      // Set player IDs
      setPlayerId1(parsedMatchData.players[0].userId);
      setPlayerId2(parsedMatchData.players[1].userId);
      
      // Set room ID
      setRoomId(parsedMatchData.roomId);
    }
  }, [parsedMatchData, parsedUserData]);

  // Join game on mount
  useEffect(() => {
    const joinGame = async () => {
      if (!roomId || !userId) {
        console.error('Missing roomId or userId');
        setRoundMessage('Failed to join game - missing room or user info');
        return;
      }

      try {
        console.log('Joining game with:', { userId, gameId: 'coinflip', roomId });
        const response = await axios.post(
          `${BASE_URL}/coinflip/join`,
          { 
            userId, 
            gameId: 'coinflip', 
            roomId,
            playerId: isPlayer1 ? playerId1 : playerId2
          },
          { withCredentials: true }
        );
        console.log('Join game response:', response.data);
        setGameId(response.data.game._id);
        setHistory(response.data.game.history);
      } catch (error) {
        console.error('Error joining game:', error);
        setRoundMessage('Failed to join game');
      }
    };

    if (roomId && userId && (playerId1 || playerId2)) {
      joinGame();
    }

    // Socket.IO listeners
    socket.on('game_updated', (game) => {
      console.log('Game updated:', game);
      setRoundScore({ player1: game.players[0].score, player2: game.players[1].score });
      setHistory(game.history);
      setRoundNumber(game.roundNumber);
    });

    socket.on('choice_made', ({ userId: emitterId, choice }) => {
      console.log('Choice made:', { emitterId, choice });
      if (emitterId === userId) {
        setPlayerChoice(choice);
      } else {
        setPlayer2Choice(choice);
      }
      setRoundMessage(`Player ${emitterId === userId ? 1 : 2} selected: ${choice}`);
    });

    socket.on('invalid_choice', ({ userId: emitterId, attempts, message }) => {
      console.log('Invalid choice:', { emitterId, attempts, message });
      if (emitterId === userId) {
        setPlayer1Attempts(attempts);
      } else {
        setPlayer2Attempts(attempts);
      }
      setRoundMessage(message);
    });

    socket.on('round_ended', ({ coinResult, winner, scores, history }) => {
      console.log('Round ended:', { coinResult, winner, scores, history });
      setCoinResult(coinResult);
      setRoundWinner(winner);
      setRoundScore(scores);
      setHistory(history);
      setShowResult(true);
      setIsFlipping(false);
      setRoundMessage(
        winner === 'Tie'
          ? `Tie! Both matched ${coinResult}`
          : winner === 'None'
          ? `No one wins! Coin: ${coinResult}`
          : `${winner} wins! Coin: ${coinResult}`
      );
    });

    socket.on('new_round', ({ roundNumber }) => {
      console.log('New round:', roundNumber);
      setPlayerChoice(null);
      setPlayer2Choice(null);
      setPlayer1Attempts(0);
      setPlayer2Attempts(0);
      setCoinResult(null);
      setRoundWinner(null);
      setRoundMessage('');
      setRoundNumber(roundNumber);
      setSeconds(15);
      setRoundInProgress(true);
      setIsFlipping(false);
      setShowResult(false);
    });

    socket.on('game_ended', ({ winner, scores }) => {
      console.log('Game ended:', { winner, scores });
      setGameOver(true);
      setGameOutcome(winner);
      setRoundScore(scores);
      if (onGameEnd) {
        onGameEnd({ winner, scores });
      }
    });

    return () => {
      socket.off('game_updated');
      socket.off('choice_made');
      socket.off('invalid_choice');
      socket.off('round_ended');
      socket.off('new_round');
      socket.off('game_ended');
    };
  }, [userId, roomId, playerId1, playerId2, isPlayer1]);

  // Timer effect for selections
  useEffect(() => {
    let timer;
    if (roundInProgress && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(timer);
            handleTimerEnd();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [roundInProgress, seconds]);

  // Handle player choice
  const handlePlayerChoice = async (playerId, choice) => {
    if (!roundInProgress || (playerId === 1 && playerChoice) || (playerId === 2 && player2Choice)) return;

    try {
      await axios.post(
        `${BASE_URL}/coinflip/choice`,
        { gameId, userId: playerId === 1 ? userId : 'opponent', choice },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error submitting choice:', error);
      setRoundMessage('Error submitting choice');
    }
  };

  // Handle timer end or both players choosing
  const handleTimerEnd = async () => {
    if (!playerChoice || !player2Choice) {
      if (!playerChoice && !player2Choice) {
        setRoundMessage('No choices made, round skipped');
        setTimeout(proceedToNextRound, 1500);
      } else {
        setTimeout(flipCoin, 1000);
      }
    } else {
      flipCoin();
    }
  };

  // Flip the coin (trigger backend round end)
  const flipCoin = async () => {
    setRoundInProgress(false);
    setIsFlipping(true);

    try {
      await axios.post(
        `${BASE_URL}/coinflip/end-round`,
        { gameId },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error ending round:', error);
      setRoundMessage('Error flipping coin');
      setIsFlipping(false);
    }
  };

  // Proceed to next round (for skipped rounds)
  const proceedToNextRound = () => {
    socket.emit('new_round', { gameId });
  };

  // Placeholder components for game end
  const WinBurst = ({ prizeAmount, playerScore, opponentScore }) => (
    <div className="text-center">
      <Confetti />
      <h2 className="text-3xl font-bold text-green-400 mb-2">Congratulations! You Won! 🎉</h2>
      <h3 className="text-xl text-green-300 mb-4">+₹{prizeAmount}</h3>
      <p className="text-lg text-white/90 mb-2">Final Score: {playerScore} - {opponentScore}</p>
      <p className="text-sm text-white/80">Great game! Would you like to play again?</p>
    </div>
  );

  const TieBurst = ({ score }) => (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-yellow-400 mb-2">It's a Tie! 🤝</h2>
      <p className="text-lg text-white/90 mb-2">Final Score: {score} - {score}</p>
      <p className="text-sm text-white/80">So close! Want to break the tie?</p>
    </div>
  );

  const LossBurst = ({ playerScore, opponentScore }) => (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-red-400 mb-2">Game Over - You Lost! 😔</h2>
      <p className="text-lg text-white/90 mb-2">Final Score: {playerScore} - {opponentScore}</p>
      <p className="text-sm text-white/80">Better luck next time! Try again?</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full text-white bg-gray-900">
      {/* Round Indicator */}
      <div className="bg-white/10 rounded-lg px-6 py-3 mb-6">
        <div className="flex justify-between items-center w-80">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{roundScore.player1}</div>
            <div className="text-xs text-white/60">Player 1</div>
          </div>
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className={`text-lg font-medium text-white ${!gameOver ? 'round-highlight' : ''}`}>
                Round {roundNumber}
              </div>
              <div className="text-sm font-medium text-yellow-400">First to 3 wins</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{roundScore.player2}</div>
            <div className="text-xs text-white/60">Player 2</div>
          </div>
        </div>
      </div>

      {/* Game Outcome */}
      {gameOver && gameOutcome === 'win' && (
        <WinBurst
          prizeAmount={prizeAmount}
          playerScore={roundScore.player1}
          opponentScore={roundScore.player2}
        />
      )}
      {gameOver && gameOutcome === 'tie' && <TieBurst score={roundScore.player1} />}
      {gameOver && gameOutcome === 'loss' && (
        <LossBurst playerScore={roundScore.player1} opponentScore={roundScore.player2} />
      )}

      {/* Timer or Coin */}
      {!gameOver && (
        <div className="mb-6">
          {roundInProgress ? (
            <div
              className={`
                w-24 h-24 rounded-full flex items-center justify-center 
                text-2xl font-bold border-4
                ${seconds <= 5 ? 'border-red-500 text-red-400' : 'border-white/30 text-white'}
              `}
            >
              {seconds}
            </div>
          ) : (
            <div className="w-32 h-32 relative">
              {isFlipping ? (
                <div className="animate-flip w-full h-full bg-yellow-500 rounded-full flex items-center justify-center text-lg font-bold">
                  Flipping...
                </div>
              ) : (
                showResult && (
                  <div
                    className={`
                      w-full h-full rounded-full flex items-center justify-center
                      text-2xl font-bold border-4 border-yellow-500
                      ${coinResult === CHOICES.HEADS ? 'bg-yellow-400' : 'bg-yellow-600'}
                    `}
                  >
                    {coinResult === CHOICES.HEADS ? 'H' : 'T'}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Player Choices */}
      {!gameOver && (
        <div className="flex gap-8 mb-6">
          <div>
            <h3 className="text-center text-white/70 mb-2">Player 1</h3>
            {Object.values(CHOICES).map((choice) => (
              <button
                key={`p1-${choice}`}
                onClick={() => handlePlayerChoice(1, choice)}
                className={`
                  coin-flip-btn w-32 h-16 rounded-lg flex items-center justify-center
                  uppercase font-bold text-lg animate-bounce-slow
                  ${playerChoice === choice ? 'border-4 border-blue-500' : ''}
                `}
                disabled={!roundInProgress || playerChoice || player1Attempts >= 3}
              >
                {choice}
              </button>
            ))}
          </div>
          <div>
            <h3 className="text-center text-white/70 mb-2">Player 2</h3>
            {Object.values(CHOICES).map((choice) => (
              <button
                key={`p2-${choice}`}
                onClick={() => handlePlayerChoice(2, choice)}
                className={`
                  coin-flip-btn w-32 h-16 rounded-lg flex items-center justify-center
                  uppercase font-bold text-lg animate-bounce-slow
                  ${player2Choice === choice ? 'border-4 border-red-500' : ''}
                `}
                disabled={!roundInProgress || player2Choice || player2Attempts >= 3}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Round Message */}
      {!gameOver && roundMessage && (
        <div
          className={`
            text-xl font-bold mt-4 text-center
            ${roundWinner === 'Player 1' ? 'text-green-400' : roundWinner === 'Player 2' ? 'text-red-400' : 'text-white'}
          `}
        >
          {roundMessage}
        </div>
      )}

      {/* Player Selections */}
      {!gameOver && (playerChoice || player2Choice) && roundInProgress && (
        <div className="mt-4 text-center">
          <p className="text-white/70">
            Player 1: <span className="uppercase font-bold">{playerChoice || 'None'}</span>
            {player1Attempts > 0 && ` (Attempts: ${player1Attempts})`}
          </p>
          <p className="text-white/70">
            Player 2: <span className="uppercase font-bold">{player2Choice || 'None'}</span>
            {player2Attempts > 0 && ` (Attempts: ${player2Attempts})`}
          </p>
          <p className="text-white/50 text-sm">Waiting for coin flip in {seconds} seconds...</p>
        </div>
      )}

      {/* Instructions */}
      {!gameOver && (!playerChoice || !player2Choice) && roundInProgress && (
        <div className="mt-4 text-center">
          <p className="text-white/70">Select Heads or Tails</p>
          <p className="text-white/50 text-sm">Coin will flip in {seconds} seconds</p>
        </div>
      )}

      {/* Round History */}
      {history.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Round History</h3>
          <table className="w-full text-white/80 border-collapse">
            <thead>
              <tr className="bg-white/10">
                <th className="p-2">Round</th>
                <th className="p-2">P1 Choice</th>
                <th className="p-2">P2 Choice</th>
                <th className="p-2">Coin</th>
                <th className="p-2">Winner</th>
                <th className="p-2">Scores</th>
              </tr>
            </thead>
            <tbody>
              {history.map((round) => (
                <tr key={round.roundNumber} className="border-t border-white/20">
                  <td className="p-2">{round.roundNumber}</td>
                  <td className="p-2">{round.player1Choice}</td>
                  <td className="p-2">{round.player2Choice}</td>
                  <td className="p-2">{round.coinResult}</td>
                  <td className="p-2">{round.winner}</td>
                  <td className="p-2">{`${round.scores.player1}-${round.scores.player2}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .coin-flip-btn {
          box-shadow: 0 4px 32px #fde68a, 0 1.5px 0 #fbbf24;
          background: linear-gradient(90deg, #facc15 0%, #fbbf24 100%);
          border: 4px solid #facc15;
          color: #1e293b;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-shadow: 0 1px 0 #fffbe6, 0 2px 8px #fbbf24;
          transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
        }
        .coin-flip-btn:active {
          box-shadow: 0 2px 16px #fbbf24, 0 1px 0 #facc15;
          background: linear-gradient(90deg, #fde68a 0%, #fbbf24 100%);
          transform: scale(0.97);
        }
        .coin-flip-btn:disabled {
          opacity: 0.6;
          filter: grayscale(0.3);
          cursor: not-allowed;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.2s infinite;
        }
        .round-highlight {
          animation: roundFlash 0.7s;
          background: linear-gradient(90deg, #facc15 0%, #fbbf24 100%);
          color: #1e293b !important;
          border-radius: 0.5rem;
          box-shadow: 0 0 10px #facc15;
        }
        @keyframes roundFlash {
          0% { background: #facc15; color: #1e293b; transform: scale(1.2); }
          60% { background: #fbbf24; color: #1e293b; transform: scale(1.1); }
          100% { background: none; color: inherit; transform: scale(1); }
        }
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