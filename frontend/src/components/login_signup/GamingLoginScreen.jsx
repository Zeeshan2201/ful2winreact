"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaGoogle,
  FaPhoneAlt,
  FaChevronRight,
  FaLock,
  FaEnvelope,
  FaUser,
  FaDice,
  FaChess,
  FaGamepad,
  FaTrophy,
  FaCoins,
} from "react-icons/fa"

// Custom Button Component with hover effects
const GlowButton = ({ children, gradient, className, ...props }) => (
  <motion.button
    className={`relative overflow-hidden rounded-xl py-3 px-6 font-bold text-white ${className}`}
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    <div className={`absolute inset-0 ${gradient}`} />
    <div className="absolute inset-0 opacity-0 hover:opacity-20 bg-white transition-opacity duration-300" />
    <div className="absolute -inset-px rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
      <div className={`h-full w-full rounded-xl ${gradient} blur-sm`} />
    </div>
    <span className="relative flex items-center justify-center gap-2">{children}</span>
  </motion.button>
)

// Custom Input Component
const GlowInput = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">{icon}</div>
    <input
      className="w-full bg-black/30 border border-white/10 text-white placeholder:text-white/40 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
      {...props}
    />
  </div>
)

// Main Component
const GamingLoginScreen = () => {
  const [activeTab, setActiveTab] = useState("login")
  const [sparkles, setSparkles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef(null)

  // Generate random sparkles
  useEffect(() => {
    const newSparkles = Array.from({ length: 25 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.5,
    }))
    setSparkles(newSparkles)
  }, [])

  // Canvas animation for background particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(
          Math.random() * 100 + 100,
        )}, ${Math.floor(Math.random() * 200 + 55)}, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      })
    }

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(130, 100, 255, ${0.15 - distance / 1000})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      connectParticles()
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Mock login function
  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("Login successful!")
    }, 1500)
  }

  // Mock signup function
  const handleSignup = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("Account created successfully!")
    }, 1500)
  }

  // Game icons for floating elements
  const gameIcons = [
    { Icon: FaDice, position: { top: "15%", left: "10%" }, rotation: -15, color: "#8b5cf6" },
    { Icon: FaChess, position: { top: "65%", left: "15%" }, rotation: 10, color: "#ec4899" },
    { Icon: FaGamepad, position: { top: "25%", right: "12%" }, rotation: 15, color: "#3b82f6" },
    { Icon: FaTrophy, position: { bottom: "20%", right: "18%" }, rotation: -10, color: "#f59e0b" },
    { Icon: FaCoins, position: { top: "45%", left: "5%" }, rotation: 5, color: "#10b981" },
  ]

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden font-sans">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1e] via-[#1a1a3a] to-[#0f0f1e] z-0" />

      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-3/4 left-1/3 w-60 h-60 rounded-full bg-red-600/20 blur-[100px]" />

        {/* Game icons in background */}
        {gameIcons.map((game, index) => (
          <motion.div
            key={index}
            className="absolute opacity-20"
            style={game.position}
            animate={{
              y: [0, 15, 0],
              rotate: [game.rotation, game.rotation + 5, game.rotation],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5 + index,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-24 h-24 rounded-xl backdrop-blur-sm flex items-center justify-center"
              style={{ backgroundColor: `${game.color}20` }}
            >
              <game.Icon size={32} color={game.color} />
            </div>
          </motion.div>
        ))}

        {/* Animated sparkles */}
        {sparkles.map((sparkle, index) => (
          <motion.div
            key={`sparkle-${index}`}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
              opacity: sparkle.opacity,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [sparkle.opacity, sparkle.opacity * 2, sparkle.opacity],
            }}
            transition={{
              duration: 3 / sparkle.speed,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          />
        ))}

        {/* Floating coins */}
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={`coin-${index}`}
            className="absolute"
            style={{
              left: `${10 + index * 10}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, index % 2 === 0 ? 50 : -50, 0],
              rotateY: [0, 360],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-yellow-800 font-bold text-xs">
                ₹
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo and tagline */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 animate-gradient">
              FUL2WIN
            </span>
          </h1>
          <motion.div
            className="mt-3 text-sm text-white/80 font-medium tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="text-blue-400">Entertainment.</span> <span className="text-purple-400">Earning.</span>{" "}
            <span className="text-red-400">Fame.</span>
          </motion.div>
        </motion.div>

        {/* Glassmorphic login/signup container */}
        <motion.div
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(123,67,230,0.3)] overflow-hidden"
          whileHover={{ boxShadow: "0 0 35px rgba(123,67,230,0.5)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Tabs */}
          <div className="flex">
            <motion.button
              className={`w-1/2 py-5 text-center font-bold relative ${
                activeTab === "login" ? "text-white" : "text-white/50"
              }`}
              onClick={() => setActiveTab("login")}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              LOGIN
              {activeTab === "login" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  layoutId="activeTab"
                />
              )}
            </motion.button>
            <motion.button
              className={`w-1/2 py-5 text-center font-bold relative ${
                activeTab === "signup" ? "text-white" : "text-white/50"
              }`}
              onClick={() => setActiveTab("signup")}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              SIGN UP
              {activeTab === "signup" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-red-500"
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                  onSubmit={handleLogin}
                >
                  <div className="space-y-4">
                    <GlowInput type="email" placeholder="Email or Phone Number" icon={<FaEnvelope />} required />
                    <GlowInput type="password" placeholder="Password" icon={<FaLock />} required />
                  </div>

                  <div className="text-right">
                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot Password?
                    </a>
                  </div>

                  <GlowButton
                    gradient="bg-gradient-to-r from-blue-600 to-purple-600"
                    className="w-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        LOGIN <FaChevronRight />
                      </>
                    )}
                  </GlowButton>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                  onSubmit={handleSignup}
                >
                  <div className="space-y-4">
                    <GlowInput type="text" placeholder="Full Name" icon={<FaUser />} required />
                    <GlowInput type="email" placeholder="Email Address" icon={<FaEnvelope />} required />
                    <GlowInput type="tel" placeholder="Phone Number" icon={<FaPhoneAlt />} required />
                    <GlowInput type="password" placeholder="Create Password" icon={<FaLock />} required />
                  </div>

                  <GlowButton
                    gradient="bg-gradient-to-r from-purple-600 to-red-500"
                    className="w-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        CREATE ACCOUNT <FaChevronRight />
                      </>
                    )}
                  </GlowButton>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social login options */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs text-center text-white/60 mb-5">OR CONTINUE WITH</div>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black/30 border border-white/10 text-white hover:bg-black/40 transition-colors"
                >
                  <FaGoogle className="text-red-400" />
                  <span className="font-medium">Google</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black/30 border border-white/10 text-white hover:bg-black/40 transition-colors"
                >
                  <FaPhoneAlt className="text-blue-400" />
                  <span className="font-medium">Phone</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Terms text */}
        <motion.div
          className="mt-6 text-center text-xs text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GamingLoginScreen
