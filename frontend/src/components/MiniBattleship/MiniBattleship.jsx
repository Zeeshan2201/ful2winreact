import React, { useState } from 'react';

const GRID_SIZE = 5;
const SHIPS = 3;
const MAX_BOMBS = 3; // Allow up to 3 bombs for tiebreaker
const MAX_TURNS = 5; // Each player gets 5 turns (or set to GRID_SIZE * GRID_SIZE - SHIPS)

const emptyGrid = () => Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));

function getInitialState() {
  return {
    ships: [[], []],
    guesses: [emptyGrid(), emptyGrid()],
    shipsPlaced: [0, 0],
    bombHits: [0, 0],
    shipsFound: [0, 0],
    turnsTaken: [0, 0],
    currentPlayer: 0,
    phase: 'placement',
    winner: null,
    gameOver: false,
  };
}

function MiniBattleship() {
  const [state, setState] = useState(getInitialState());
  const [viewPlayer, setViewPlayer] = useState(0);
  const [showHowTo, setShowHowTo] = useState(false);

  // Helper to check if a cell is a ship
  const isShip = (player, row, col) =>
    state.ships[player].some(([r, c]) => r === row && c === col);

  // Helper to check if a cell is a hit
  const isHit = (player, row, col) =>
    state.guesses[player][row][col] === 'hit';

  // Helper to check if a cell is a bomb
  const isBomb = (player, row, col) =>
    state.guesses[player][row][col] === 'bomb';

  // Place ship for current player
  const handlePlaceShip = (row, col) => {
    if (state.phase !== 'placement') return;
    const player = state.currentPlayer;
    if (isShip(player, row, col)) return;
    if (state.shipsPlaced[player] >= SHIPS) return;
    const newShips = state.ships.map((arr, idx) =>
      idx === player ? [...arr, [row, col]] : arr
    );
    const newShipsPlaced = [...state.shipsPlaced];
    newShipsPlaced[player]++;
    let nextPlayer = player;
    let nextPhase = 'placement';
    if (newShipsPlaced[player] === SHIPS) {
      if (player === 0 && newShipsPlaced[1] < SHIPS) {
        nextPlayer = 1;
      } else if (player === 1 && newShipsPlaced[0] === SHIPS) {
        nextPhase = 'play';
        nextPlayer = 0;
      }
    }
    setState({
      ...state,
      ships: newShips,
      shipsPlaced: newShipsPlaced,
      currentPlayer: nextPlayer,
      phase: nextPhase,
    });
  };

  // Handle guess
  const handleGuess = (row, col) => {
    if (state.phase !== 'play' || state.gameOver) return;
    const player = state.currentPlayer;
    const opponent = 1 - player;
    if (state.guesses[player][row][col]) return;
    let hit = isShip(opponent, row, col);
    let newGuesses = state.guesses.map((grid, idx) =>
      idx === player
        ? grid.map((r, rIdx) =>
            rIdx === row
              ? r.map((cell, cIdx) => (cIdx === col ? (hit ? 'hit' : 'bomb') : cell))
              : r
          )
        : grid
    );
    let newBombHits = [...state.bombHits];
    let newShipsFound = [...state.shipsFound];
    let newTurnsTaken = [...state.turnsTaken];
    let newShips = state.ships.map((arr, idx) =>
      idx === opponent && hit
        ? arr.filter(([r, c]) => !(r === row && c === col))
        : arr
    );
    if (hit) {
      newShipsFound[player]++;
    } else {
      newBombHits[player]++;
    }
    newTurnsTaken[player]++;
    // Check if both players have finished their turns or found all ships
    let allDone =
      (newTurnsTaken[0] >= MAX_TURNS && newTurnsTaken[1] >= MAX_TURNS) ||
      (newShipsFound[0] === SHIPS && newShipsFound[1] === SHIPS) ||
      (newBombHits[0] >= MAX_BOMBS && newBombHits[1] >= MAX_BOMBS);
    let winner = null;
    if (allDone) {
      if (newShipsFound[0] > newShipsFound[1]) winner = 0;
      else if (newShipsFound[1] > newShipsFound[0]) winner = 1;
      else if (newBombHits[0] < newBombHits[1]) winner = 0;
      else if (newBombHits[1] < newBombHits[0]) winner = 1;
      // else winner stays null (draw)
    }
    setState({
      ...state,
      guesses: newGuesses,
      ships: newShips,
      bombHits: newBombHits,
      shipsFound: newShipsFound,
      turnsTaken: newTurnsTaken,
      currentPlayer: allDone ? player : 1 - player,
      phase: allDone ? 'gameover' : 'play',
      winner,
      gameOver: allDone,
    });
  };

  // Restart game
  const handleRestart = () => {
    setState(getInitialState());
    setViewPlayer(0);
  };

  // Render grid
  const renderGrid = (player, isOwn, isActive) => (
    <div className="grid grid-cols-5 gap-1 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 p-2 rounded-2xl shadow-lg">
      {Array(GRID_SIZE)
        .fill(0)
        .map((_, row) =>
          Array(GRID_SIZE)
            .fill(0)
            .map((_, col) => {
              let cellClass =
                'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg border border-blue-300 text-lg font-bold cursor-pointer select-none transition duration-200 shadow-sm bg-white/70 backdrop-blur-md';
              let content = '';
              if (isOwn && isShip(player, row, col)) {
                cellClass += ' bg-blue-400 text-white shadow-blue-300/40 shadow-md';
                content = '🚢';
              }
              if (isHit(player, row, col)) {
                cellClass += ' bg-green-500 text-white animate-pulse scale-110 shadow-green-300/40 shadow-md';
                content = <span className="animate-bounce">✅</span>;
              } else if (isBomb(player, row, col)) {
                cellClass += ' bg-red-500 text-white animate-pulse scale-110 shadow-red-300/40 shadow-md';
                content = <span className="animate-ping">💣</span>;
              }
              if (state.phase === 'placement' && isOwn && isActive) {
                cellClass += ' hover:bg-blue-200 focus:ring-2 focus:ring-blue-400';
              } else if (state.phase === 'play' && !isOwn && isActive) {
                cellClass += ' hover:bg-blue-200 focus:ring-2 focus:ring-blue-400';
              } else {
                cellClass += ' cursor-default';
              }
              return (
                <div
                  key={col}
                  className={cellClass}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    if (state.phase === 'placement' && isOwn && isActive) handlePlaceShip(row, col);
                    if (state.phase === 'play' && !isOwn && isActive) handleGuess(row, col);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (state.phase === 'placement' && isOwn && isActive) handlePlaceShip(row, col);
                      if (state.phase === 'play' && !isOwn && isActive) handleGuess(row, col);
                    }
                  }}
                >
                  {content}
                </div>
              );
            })
        )}
    </div>
  );

  // Info for how to play
  const howToPlay = (
    <div className="mb-4 p-4 bg-white/90 rounded-xl shadow-xl text-gray-800 max-w-lg mx-auto border border-blue-200">
      <h2 className="text-xl font-bold mb-2 text-blue-900">How to Play Mini Battleship</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Each player has a 5x5 grid and places 3 ships (one cell each).</li>
        <li>Click on your grid to place ships before the game starts.</li>
        <li>After both players place ships, take turns guessing the opponent's ship locations.</li>
        <li>If you click a ship, it's a hit (✅). If not, it's a bomb (💣).</li>
        <li>Each player gets {MAX_TURNS} turns. Whoever finds more ships wins. If tied, fewer bombs wins.</li>
        <li>Use "Restart Game" to play again.</li>
      </ul>
      <button className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded shadow hover:from-blue-600 hover:to-cyan-600 transition" onClick={() => setShowHowTo(false)}>
        Close
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-cyan-100 to-white py-8 px-2">
      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 relative border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 drop-shadow-lg tracking-wide">Mini Battleship</h1>
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-1 rounded bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold shadow hover:from-blue-500 hover:to-cyan-500 transition"
              onClick={() => setShowHowTo(true)}
            >
              <span role="img" aria-label="info">ℹ️</span> How to Play
            </button>
            <button
              className="px-3 py-1 rounded bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow hover:from-blue-700 hover:to-cyan-700 transition"
              onClick={handleRestart}
            >
              <span role="img" aria-label="restart">🔄</span> Restart Game
            </button>
          </div>
        </div>
        {showHowTo && howToPlay}
        <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
          {/* During placement: show only the current player's own grid for ship placement */}
          {state.phase === 'placement' && (
            <div className="flex flex-col items-center w-full">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-bold text-lg text-blue-700 drop-shadow">Player {state.currentPlayer + 1}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded shadow">Placing Ships</span>
              </div>
              {renderGrid(state.currentPlayer, true, true)}
              <div className="mt-2 text-sm text-blue-900">Ships placed: {state.shipsPlaced[state.currentPlayer]}/{SHIPS}</div>
            </div>
          )}
          {/* During play: show only the opponent's grid for the current player */}
          {state.phase === 'play' && (
            <div className="flex flex-col items-center w-full">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-bold text-lg text-blue-700 drop-shadow">Opponent's Grid</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded shadow">Your Turn</span>
              </div>
              {renderGrid(1 - state.currentPlayer, false, true)}
              <div className="mt-2 text-sm flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs shadow">
                  ✅ Ships found: <span className="font-bold">{state.shipsFound[state.currentPlayer]}</span> / {SHIPS}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs shadow">
                  💣 Bombs hit: <span className="font-bold">{state.bombHits[state.currentPlayer]}</span> / {MAX_BOMBS}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shadow">
                  🎯 Turns: <span className="font-bold">{state.turnsTaken[state.currentPlayer]}</span> / {MAX_TURNS}
                </span>
              </div>
            </div>
          )}
          {/* During gameover: show both grids for review */}
          {state.phase === 'gameover' && (
            <>
              <div className="flex flex-col items-center w-full">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-bold text-lg text-blue-700 drop-shadow">Player 1</span>
                </div>
                {renderGrid(0, true, false)}
                <div className="mt-2 text-sm flex flex-wrap gap-2 justify-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs shadow">
                    ✅ Ships found: <span className="font-bold">{state.shipsFound[0]}</span> / {SHIPS}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs shadow">
                    💣 Bombs hit: <span className="font-bold">{state.bombHits[0]}</span> / {MAX_BOMBS}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shadow">
                    🎯 Turns: <span className="font-bold">{state.turnsTaken[0]}</span> / {MAX_TURNS}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-bold text-lg text-blue-700 drop-shadow">Player 2</span>
                </div>
                {renderGrid(1, true, false)}
                <div className="mt-2 text-sm flex flex-wrap gap-2 justify-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs shadow">
                    ✅ Ships found: <span className="font-bold">{state.shipsFound[1]}</span> / {SHIPS}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs shadow">
                    💣 Bombs hit: <span className="font-bold">{state.bombHits[1]}</span> / {MAX_BOMBS}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shadow">
                    🎯 Turns: <span className="font-bold">{state.turnsTaken[1]}</span> / {MAX_TURNS}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Toggle View */}
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow hover:from-blue-600 hover:to-cyan-600 transition"
            onClick={() => setViewPlayer(viewPlayer === 0 ? 1 : 0)}
            disabled={state.phase === 'play'}
          >
            Switch to {viewPlayer === 0 ? 'Player 2' : 'Player 1'} View
          </button>
        </div>
        {/* Game Info */}
        <div className="mt-4 text-center">
          {state.phase === 'placement' && (
            <div className="text-blue-900 font-semibold bg-blue-100 rounded-lg py-2 px-4 shadow inline-block animate-fade-in">
              {state.shipsPlaced[0] < SHIPS || state.shipsPlaced[1] < SHIPS
                ? `Player ${state.currentPlayer + 1}, place your ships (${state.shipsPlaced[state.currentPlayer]}/3)`
                : 'All ships placed!'}
            </div>
          )}
          {state.phase === 'play' && (
            <div className="text-blue-900 font-semibold bg-cyan-100 rounded-lg py-2 px-4 shadow inline-block animate-fade-in">
              Player {state.currentPlayer + 1}'s turn to guess!
            </div>
          )}
          {state.phase === 'gameover' && (
            <div className="text-white text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 rounded-lg py-3 px-6 shadow-lg animate-bounce">
              {state.winner === null
                ? 'It\'s a draw!'
                : `Player ${state.winner + 1} wins! 🎉`}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default MiniBattleship;
