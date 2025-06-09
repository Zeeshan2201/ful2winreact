"use client"

// import type React from "react"
import React, { useState, useEffect, useRef, useCallback } from "react";
import Button  from "../../components/ui/button"

// interface Duck {
//   id: number,
//   x: number,
//   y: number,
//   speed: number,
//   direction: -1 | 1,
//   hit: boolean,
//   animationFrame: number
// }

export default function DuckHuntGame() {
  const [ducks, setDucks] = useState([])
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [shots, setShots] = useState(0)
  const [hits, setHits] = useState(0)

  // Spawn a new duck
  const spawnDuck = useCallback(() => {
    const newDuck = {
      id: Date.now() + Math.random(),
      x: Math.random() > 0.5 ? -100 : window.innerWidth + 100,
      y: Math.random() * 300 + 100,
      speed: Math.random() * 3 + 2,
      direction: Math.random() > 0.5 ? 1 : -1,
      hit: false,
      animationFrame: 0,
    }
    setDucks((prev) => [...prev, newDuck])
  }, [])

  // Move ducks across screen
  useEffect(() => {
    if (!gameActive) return

    const interval = setInterval(() => {
      setDucks((prev) =>
        prev
          .map((duck) => ({
            ...duck,
            x: duck.x + duck.speed * duck.direction,
            y: duck.y + Math.sin(duck.x * 0.01) * 2, // Add slight vertical movement
          }))
          .filter((duck) => duck.x > -150 && duck.x < window.innerWidth + 150 && !duck.hit),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [gameActive])

  // Spawn ducks periodically
  useEffect(() => {
    if (!gameActive) return

    const spawnInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        spawnDuck()
      }
    }, 2000)

    return () => clearInterval(spawnInterval)
  }, [gameActive, spawnDuck])

  // Game timer
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive, timeLeft])

  // Shoot duck
  const shootDuck = (duckId, event) => {
    event.stopPropagation()
    setShots((prev) => prev + 1)

    setDucks((prev) => prev.map((duck) => (duck.id === duckId ? { ...duck, hit: true } : duck)))

    setScore((prev) => prev + 100)
    setHits((prev) => prev + 1)

    // Remove hit duck after animation
    setTimeout(() => {
      setDucks((prev) => prev.filter((duck) => duck.id !== duckId))
    }, 500)
  }

  // Miss shot (clicked on background)
  const missShot = () => {
    setShots((prev) => prev + 1)
  }

  // Start game
  const startGame = () => {
    setDucks([])
    setScore(0)
    setGameActive(true)
    setTimeLeft(60)
    setGameOver(false)
    setShots(0)
    setHits(0)
  }

  // Reset game
  const resetGame = () => {
    setDucks([])
    setScore(0)
    setGameActive(false)
    setTimeLeft(60)
    setGameOver(false)
    setShots(0)
    setHits(0)
  }

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0

  // Animate duck sprites
  useEffect(() => {
    if (!gameActive) return

    const animationInterval = setInterval(() => {
      setDucks((prev) =>
        prev.map((duck) => ({
          ...duck,
          animationFrame: (duck.animationFrame + 1) % 3,
        })),
      )
    }, 200)

    return () => clearInterval(animationInterval)
  }, [gameActive])

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 overflow-hidden cursor-crosshair">
      {/* Clouds */}
      <div className="absolute top-10 left-20 w-20 h-12 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-16 left-32 w-16 h-8 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-8 right-40 w-24 h-14 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-20 right-20 w-18 h-10 bg-white rounded-full opacity-80"></div>

      {/* Trees/Bushes */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-green-600"></div>
      <div className="absolute bottom-20 left-10 w-16 h-20 bg-green-700 rounded-t-full"></div>
      <div className="absolute bottom-20 right-20 w-20 h-24 bg-green-700 rounded-t-full"></div>
      <div className="absolute bottom-20 left-1/3 w-12 h-16 bg-green-700 rounded-t-full"></div>

      {/* Game UI */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg">
        <div className="text-xl font-bold">Score: {score}</div>
        <div className="text-lg">Time: {timeLeft}s</div>
        <div className="text-sm">Shots: {shots}</div>
        <div className="text-sm">Accuracy: {accuracy}%</div>
      </div>

      {/* Ducks */}
      {ducks.map((duck) => {
        const flyingImages = ["/duck-flying-1.png", "/duck-flying-2.png", "/duck-flying-3.png"]

        return (
          <div
            key={duck.id}
            className={`absolute transition-all duration-300 cursor-pointer ${
              duck.hit ? "animate-pulse scale-110" : "hover:scale-110"
            }`}
            style={{
              left: duck.x,
              top: duck.y,
              transform: `scaleX(${duck.direction === 1 ? -1 : 1})`,
            }}
            onClick={(e) => !duck.hit && shootDuck(duck.id, e)}
          >
            <img
              src={duck.hit ? "/duck-dead.png" : flyingImages[duck.animationFrame]}
              alt={duck.hit ? "Dead duck" : "Flying duck"}
              className="w-16 h-16 object-contain select-none"
              draggable={false}
            />
          </div>
        )
      })}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Game Over!</h2>
            <div className="space-y-2 mb-6 text-gray-700">
              <p className="text-xl">
                Final Score: <span className="font-bold text-green-600">{score}</span>
              </p>
              <p>Ducks Hit: {hits}</p>
              <p>Total Shots: {shots}</p>
              <p>Accuracy: {accuracy}%</p>
            </div>
            <Button onClick={startGame} className="w-full">
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Start Screen */}
      {!gameActive && !gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">🦆 Duck Hunt</h1>
            <p className="text-gray-600 mb-6">
              Click on the ducks to shoot them! You have 60 seconds to score as many points as possible.
            </p>
            <div className="space-y-2 mb-6 text-sm text-gray-500">
              <p>• Each duck is worth 100 points</p>
              <p>• Aim carefully for better accuracy</p>
              <p>• Ducks move faster as time goes on</p>
            </div>
            <Button onClick={startGame} className="w-full text-lg py-3">
              Start Game
            </Button>
          </div>
        </div>
      )}

      {/* Reset button during game */}
      {gameActive && (
        <div className="absolute top-4 right-4">
          <Button onClick={resetGame} variant="outline" className="bg-white/90 hover:bg-white">
            Reset Game
          </Button>
        </div>
      )}

      {/* Click handler for missing shots */}
      <div className="absolute inset-0 -z-10" onClick={gameActive ? missShot : undefined} />
    </div>
  )
}
