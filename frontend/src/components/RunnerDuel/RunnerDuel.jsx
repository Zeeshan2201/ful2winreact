import React, { useState, useEffect, useRef } from 'react';

const GAME_DURATION = 60; // seconds
const LANES = 3;
const OBSTACLE_INTERVAL = 1200; // ms
const COIN_INTERVAL = 1500; // ms
const OBSTACLE_SPEED = 3.5; // px/ms
const COIN_SPEED = 3.5; // px/ms
const PLAYER_HEIGHT = 48;
const PLAYER_WIDTH = 36;
const LANE_HEIGHT = 320;
const LANE_WIDTH = 80;
const JUMP_HEIGHT = 60;
const SLIDE_HEIGHT = 24;

const PLAYER_COLORS = [
  'from-blue-400 to-blue-600',
  'from-pink-400 to-pink-600',
];

const PLAYER_KEYS = [
  { jump: 'w', slide: 's', left: 'a', right: 'd' },
  { jump: 'ArrowUp', slide: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' },
];

function getRandomLane() {
  return Math.floor(Math.random() * LANES);
}

function getRandomType() {
  return Math.random() < 0.5 ? 'obstacle' : 'coin';
}

function RunnerDuel() {
  // Player state: lane, jumping, sliding, score, slowed
  const [players, setPlayers] = useState([
    { lane: 1, jumping: false, sliding: false, score: 0, slowed: 0, alive: true },
    { lane: 1, jumping: false, sliding: false, score: 0, slowed: 0, alive: true },
  ]);
  const [obstacles, setObstacles] = useState([[], []]); // [player1Obstacles, player2Obstacles]
  const [coins, setCoins] = useState([[], []]);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [phase, setPhase] = useState('waiting'); // waiting, running, ended
  const [winner, setWinner] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const gameRef = useRef();
  const animationRef = useRef();
  const lastTick = useRef(Date.now());

  // Handle countdown before game starts
  useEffect(() => {
    if (phase === 'waiting') return;
    if (phase === 'running' && countdown > 0) {
      const id = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(id);
    }
    if (phase === 'running' && countdown === 0) {
      setCountdown(-1);
    }
  }, [phase, countdown]);

  // Main game loop
  useEffect(() => {
    if (phase !== 'running' || countdown > 0) return;
    let running = true;
    function tick() {
      const now = Date.now();
      const dt = now - lastTick.current;
      lastTick.current = now;
      // Move obstacles and coins
      setObstacles(prev => prev.map((obsArr, idx) =>
        obsArr
          .map(obs => ({ ...obs, y: obs.y + OBSTACLE_SPEED * dt * (players[idx].slowed ? 0.5 : 1) }))
          .filter(obs => obs.y < LANE_HEIGHT + 40)
      ));
      setCoins(prev => prev.map((coinArr, idx) =>
        coinArr
          .map(coin => ({ ...coin, y: coin.y + COIN_SPEED * dt * (players[idx].slowed ? 0.5 : 1) }))
          .filter(coin => coin.y < LANE_HEIGHT + 40)
      ));
      // Timer
      setTimer(t => {
        if (t <= 0.05) {
          running = false;
          setPhase('ended');
          return 0;
        }
        return t - dt / 1000;
      });
      if (running) animationRef.current = requestAnimationFrame(tick);
    }
    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current);
    // eslint-disable-next-line
  }, [phase, countdown, players]);

  // Obstacle and coin spawners
  useEffect(() => {
    if (phase !== 'running' || countdown > 0) return;
    const obsInts = [
      setInterval(() => {
        setObstacles(prev => prev.map((arr, idx) =>
          [
            ...arr,
            { lane: getRandomLane(), y: -40, id: Math.random(), type: 'obstacle' },
          ]
        ));
      }, OBSTACLE_INTERVAL),
      setInterval(() => {
        setCoins(prev => prev.map((arr, idx) =>
          [
            ...arr,
            { lane: getRandomLane(), y: -40, id: Math.random(), type: 'coin' },
          ]
        ));
      }, COIN_INTERVAL),
    ];
    return () => obsInts.forEach(clearInterval);
  }, [phase, countdown]);

  // Handle controls
  useEffect(() => {
    if (phase !== 'running' || countdown > 0) return;
    function handleKey(e) {
      setPlayers(prev => prev.map((p, idx) => {
        const keys = PLAYER_KEYS[idx];
        if (e.key === keys.jump && !p.jumping && !p.sliding) {
          return { ...p, jumping: true };
        }
        if (e.key === keys.slide && !p.sliding && !p.jumping) {
          return { ...p, sliding: true };
        }
        if (e.key === keys.left && p.lane > 0) {
          return { ...p, lane: p.lane - 1 };
        }
        if (e.key === keys.right && p.lane < LANES - 1) {
          return { ...p, lane: p.lane + 1 };
        }
        return p;
      }));
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, countdown]);

  // Handle jump/slide duration
  useEffect(() => {
    if (phase !== 'running' || countdown > 0) return;
    const timers = [
      setTimeout(() => setPlayers(p => p.map(pl => ({ ...pl, jumping: false }))), 500),
      setTimeout(() => setPlayers(p => p.map(pl => ({ ...pl, sliding: false }))), 500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [players[0].jumping, players[0].sliding, players[1].jumping, players[1].sliding, phase, countdown]);

  // Collision detection
  useEffect(() => {
    if (phase !== 'running' || countdown > 0) return;
    setObstacles(prev => prev.map((obsArr, idx) =>
      obsArr.map(obs => {
        const p = players[idx];
        if (
          obs.lane === p.lane &&
          obs.y > LANE_HEIGHT - PLAYER_HEIGHT - 10 &&
          obs.y < LANE_HEIGHT - 10
        ) {
          if (p.jumping && obs.type === 'obstacle') return { ...obs, hit: false };
          if (p.sliding && obs.type === 'obstacle') return { ...obs, hit: false };
          if (!p.jumping && !p.sliding && obs.type === 'obstacle' && !obs.hit) {
            setPlayers(pls => pls.map((pl, i) => i === idx ? { ...pl, score: Math.max(0, pl.score - 5), slowed: 20 } : pl));
            return { ...obs, hit: true };
          }
        }
        return obs;
      })
    ));
    setCoins(prev => prev.map((coinArr, idx) =>
      coinArr.map(coin => {
        const p = players[idx];
        if (
          coin.lane === p.lane &&
          coin.y > LANE_HEIGHT - PLAYER_HEIGHT - 10 &&
          coin.y < LANE_HEIGHT - 10 &&
          !coin.collected
        ) {
          setPlayers(pls => pls.map((pl, i) => i === idx ? { ...pl, score: pl.score + 10 } : pl));
          return { ...coin, collected: true };
        }
        return coin;
      })
    ));
  }, [obstacles, coins, players, phase, countdown]);

  // Handle slow effect
  useEffect(() => {
    if (phase !== 'running' || countdown > 0) return;
    setPlayers(prev => prev.map(p => p.slowed > 0 ? { ...p, slowed: p.slowed - 1 } : p));
  }, [players, phase, countdown]);

  // End game and determine winner
  useEffect(() => {
    if (phase === 'ended') {
      if (players[0].score > players[1].score) setWinner(1);
      else if (players[1].score > players[0].score) setWinner(2);
      else setWinner(0);
    }
  }, [phase, players]);

  // Reset game
  const resetGame = () => {
    setPlayers([
      { lane: 1, jumping: false, sliding: false, score: 0, slowed: 0, alive: true },
      { lane: 1, jumping: false, sliding: false, score: 0, slowed: 0, alive: true },
    ]);
    setObstacles([[], []]);
    setCoins([[], []]);
    setTimer(GAME_DURATION);
    setPhase('waiting');
    setWinner(null);
    setCountdown(3);
  };

  // Start game
  const startGame = () => {
    setPhase('running');
    setCountdown(3);
    setTimer(GAME_DURATION);
    setPlayers([
      { lane: 1, jumping: false, sliding: false, score: 0, slowed: 0, alive: true },
      { lane: 1, jumping: false, sliding: false, score: 0, slowed: 0, alive: true },
    ]);
    setObstacles([[], []]);
    setCoins([[], []]);
  };

  // Render runner
  const renderRunner = (idx) => {
    const p = players[idx];
    return (
      <div
        className={`absolute left-0 transition-transform duration-100 z-10`}
        style={{
          bottom: 0,
          left: `${p.lane * LANE_WIDTH + 22}px`,
          height: p.sliding ? SLIDE_HEIGHT : PLAYER_HEIGHT,
          width: PLAYER_WIDTH,
          transform: `translateY(${p.jumping ? -JUMP_HEIGHT : 0}px)`,
        }}
      >
        <div
          className={`w-full h-full rounded-lg shadow-lg bg-gradient-to-b ${PLAYER_COLORS[idx]} flex items-end justify-center relative animate-bounce`}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-300 rounded-full border-2 border-yellow-500 shadow" />
          <div className="w-3 h-3 bg-white rounded-full absolute left-2 top-2" />
        </div>
      </div>
    );
  };

  // Render obstacles and coins
  const renderObjects = (arr, type) =>
    arr.map(obj => (
      <div
        key={obj.id}
        className={`absolute transition-transform duration-100 z-0 ${
          type === 'obstacle'
            ? 'bg-red-500 border-2 border-red-700'
            : 'bg-yellow-400 border-2 border-yellow-500'
        } ${type === 'obstacle' ? 'rounded-lg' : 'rounded-full'}`}
        style={{
          left: `${obj.lane * LANE_WIDTH + 30}px`,
          top: `${obj.y}px`,
          width: type === 'obstacle' ? '32px' : '24px',
          height: type === 'obstacle' ? '32px' : '24px',
          opacity: obj.collected || obj.hit ? 0.3 : 1,
        }}
      />
    ));

  // Render lane
  const renderLane = (idx) => (
    <div className="relative w-[240px] h-[340px] bg-gradient-to-b from-gray-100 to-gray-300 rounded-2xl shadow-xl overflow-hidden mx-2 border-4 border-white">
      {/* Lanes */}
      {[...Array(LANES)].map((_, i) => (
        <div
          key={i}
          className={`absolute left-0 top-0 h-full border-r-2 border-dashed border-gray-300 ${i === LANES - 1 ? 'border-none' : ''}`}
          style={{ left: `${i * LANE_WIDTH}px`, width: `${LANE_WIDTH}px` }}
        />
      ))}
      {/* Obstacles & Coins */}
      {renderObjects(obstacles[idx], 'obstacle')}
      {renderObjects(coins[idx], 'coin')}
      {/* Runner */}
      {renderRunner(idx)}
    </div>
  );

  // Render scoreboard
  const renderScoreboard = () => (
    <div className="flex justify-between items-center mb-6">
      <div className="flex-1 text-center">
        <div className="text-lg font-bold text-blue-700">Player 1</div>
        <div className="text-2xl font-bold text-blue-900">{players[0].score}</div>
      </div>
      <div className="flex-1 text-center">
        <div className="text-lg font-bold text-pink-700">Player 2</div>
        <div className="text-2xl font-bold text-pink-900">{players[1].score}</div>
      </div>
      <div className="flex-1 text-center">
        <div className="text-lg font-semibold text-gray-700">Time</div>
        <div className="text-2xl font-bold text-gray-900">{Math.max(0, Math.ceil(timer))}s</div>
      </div>
    </div>
  );

  // Render end screen
  const renderEndScreen = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">Game Over</h2>
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <div className="text-lg font-bold text-blue-700">Player 1</div>
            <div className="text-3xl font-bold text-blue-900">{players[0].score}</div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-pink-700">Player 2</div>
            <div className="text-3xl font-bold text-pink-900">{players[1].score}</div>
          </div>
        </div>
        <div className="text-2xl font-bold mb-4">
          {winner === 0 ? "It's a Draw! 🤝" : `Player ${winner} Wins! 🏆`}
        </div>
        <button
          className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:from-blue-600 hover:to-pink-600 transition transform hover:scale-105"
          onClick={resetGame}
        >
          Play Again
        </button>
      </div>
      <style>{`
        .animate-fade-in { animation: fade-in 0.5s ease; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );

  // Render countdown
  const renderCountdown = () => (
    <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
      <div className="text-7xl font-extrabold text-white drop-shadow-lg animate-fade-in">
        {countdown > 0 ? countdown : 'GO!'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">Runner Duel</h1>
        {renderScoreboard()}
        <div className="flex justify-center gap-8">
          {renderLane(0)}
          {renderLane(1)}
        </div>
        {phase === 'waiting' && (
          <div className="text-center mt-8">
            <button
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-full text-xl font-bold shadow-lg hover:from-blue-600 hover:to-pink-600 transition transform hover:scale-105"
              onClick={startGame}
            >
              Start Game
            </button>
            <div className="mt-4 text-gray-600 text-sm">
              Player 1: W = jump, S = slide, A/D = switch lanes<br />
              Player 2: ↑ = jump, ↓ = slide, ←/→ = switch lanes
            </div>
          </div>
        )}
        {phase === 'running' && countdown >= 0 && renderCountdown()}
        {phase === 'ended' && renderEndScreen()}
      </div>
    </div>
  );
}

export default RunnerDuel; 