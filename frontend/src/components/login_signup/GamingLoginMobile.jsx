"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import {
  FaGoogle,
  FaPhoneAlt,
  FaChevronRight,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

// Form validation functions
const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/
  return re.test(String(phone))
}

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const hasLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const strength = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

  return {
    isValid: strength >= 4,
    strength: strength, // 0-5 scale
    checks: {
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
    },
  }
}

// Custom Checkbox Component
const GlowCheckbox = ({ id, label, required, ...props }) => {
  return (
    <div className="flex items-start gap-2 mt-1">
      <div className="relative flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          className="appearance-none h-5 w-5 border border-white/20 rounded bg-black/30 checked:bg-purple-600 checked:border-0 transition-colors cursor-pointer"
          required={required}
          {...props}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
          <FaCheck size={12} />
        </div>
      </div>
      <label htmlFor={id} className="text-xs text-white/70 cursor-pointer">
        {label}
      </label>
    </div>
  )
}

// Custom Button Component with hover effects
const GlowButton = ({ children, gradient, className, ...props }) => (
  <motion.button
    className={`relative overflow-hidden rounded-xl py-3.5 px-6 font-bold text-white ${className}`}
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

// Custom Input Component with validation
const GlowInput = ({ icon, error, touched, valid, label, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-xs font-medium text-white/70 pl-1">{label}</label>}
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">{icon}</div>
      <input
        className={`w-full bg-black/30 border ${
          touched
            ? error
              ? "border-red-500 focus:ring-red-500/30"
              : valid
                ? "border-green-500 focus:ring-green-500/30"
                : "border-white/10 focus:ring-purple-500/50"
            : "border-white/10 focus:ring-purple-500/50"
        } text-white placeholder:text-white/40 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-2 transition-all duration-300`}
        {...props}
      />
      {touched && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {error ? (
            <FaTimes className="text-red-500" size={14} />
          ) : valid ? (
            <FaCheck className="text-green-500" size={14} />
          ) : null}
        </div>
      )}
    </div>
    {touched && error && <p className="text-xs text-red-500 pl-1">{error}</p>}
  </div>
)

// Password Input with toggle and strength indicator
const PasswordInput = ({ value, onChange, error, touched, valid, label, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)
  const passwordValidation = validatePassword(value || "")

  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-medium text-white/70 pl-1">{label}</label>}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">
          <FaLock size={14} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full bg-black/30 border ${
            touched
              ? error
                ? "border-red-500 focus:ring-red-500/30"
                : valid
                  ? "border-green-500 focus:ring-green-500/30"
                  : "border-white/10 focus:ring-purple-500/50"
              : "border-white/10 focus:ring-purple-500/50"
          } text-white placeholder:text-white/40 rounded-xl py-3.5 pl-10 pr-10 focus:outline-none focus:ring-2 transition-all duration-300`}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
        </button>
      </div>

      {touched && error && <p className="text-xs text-red-500 pl-1">{error}</p>}

      {value && value.length > 0 && (
        <div className="space-y-1 mt-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full ${
                  passwordValidation.strength >= level
                    ? level <= 2
                      ? "bg-red-500"
                      : level <= 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div
              className={`text-xs flex items-center gap-1 ${passwordValidation.checks.hasLength ? "text-green-500" : "text-white/40"}`}
            >
              <div className="w-3 h-3">{passwordValidation.checks.hasLength ? "✓" : "·"}</div>
              <span>8+ characters</span>
            </div>
            <div
              className={`text-xs flex items-center gap-1 ${passwordValidation.checks.hasUpper ? "text-green-500" : "text-white/40"}`}
            >
              <div className="w-3 h-3">{passwordValidation.checks.hasUpper ? "✓" : "·"}</div>
              <span>Uppercase</span>
            </div>
            <div
              className={`text-xs flex items-center gap-1 ${passwordValidation.checks.hasLower ? "text-green-500" : "text-white/40"}`}
            >
              <div className="w-3 h-3">{passwordValidation.checks.hasLower ? "✓" : "·"}</div>
              <span>Lowercase</span>
            </div>
            <div
              className={`text-xs flex items-center gap-1 ${passwordValidation.checks.hasNumber ? "text-green-500" : "text-white/40"}`}
            >
              <div className="w-3 h-3">{passwordValidation.checks.hasNumber ? "✓" : "·"}</div>
              <span>Number</span>
            </div>
            <div
              className={`text-xs flex items-center gap-1 ${passwordValidation.checks.hasSpecial ? "text-green-500" : "text-white/40"}`}
            >
              <div className="w-3 h-3">{passwordValidation.checks.hasSpecial ? "✓" : "·"}</div>
              <span>Special char</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Component
const GamingLoginMobile = () => {
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const canvasRef = useRef(null)
const navigate = useNavigate();
  // Form states
  const [loginForm, setLoginForm] = useState({
    phone: "",
    password: "",
    touched: {
      phone: false,
      password: false,
    },
    errors: {
      phone: "",
      password: "",
    },
  })

  const [signupForm, setSignupForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    touched: {
      name: false,
      phone: false,
      password: false,
      confirmPassword: false,
    },
    errors: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }))
  }

  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target

    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }))
  }

  // Validate login form
  useEffect(() => {
    if (loginForm.touched.phone) {
      if (!loginForm.phone) {
        setLoginForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            phone: "Phone number is required",
          },
        }))
      } else if (!validatePhone(loginForm.phone)) {
        setLoginForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            phone: "Invalid phone number (10 digits starting with 6-9)",
          },
        }))
      } else {
        setLoginForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            phone: "",
          },
        }))
      }
    }

    if (loginForm.touched.password) {
      if (!loginForm.password) {
        setLoginForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            password: "Password is required",
          },
        }))
      } else {
        setLoginForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            password: "",
          },
        }))
      }
    }
  }, [loginForm.phone, loginForm.password, loginForm.touched])

  // Validate signup form
  useEffect(() => {
    if (signupForm.touched.name) {
      if (!signupForm.name) {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            name: "Name is required",
          },
        }))
      } else if (signupForm.name.length < 3) {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            name: "Name must be at least 3 characters",
          },
        }))
      } else {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            name: "",
          },
        }))
      }
    }

    if (signupForm.touched.phone) {
      if (!signupForm.phone) {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            phone: "Phone number is required",
          },
        }))
      } else if (!validatePhone(signupForm.phone)) {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            phone: "Invalid phone number (10 digits starting with 6-9)",
          },
        }))
      } else {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            phone: "",
          },
        }))
      }
    }

    if (signupForm.touched.password) {
      if (!signupForm.password) {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            password: "Password is required",
          },
        }))
      } else if (!validatePassword(signupForm.password).isValid) {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            password: "Password doesn't meet requirements",
          },
        }))
      } else {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            password: "",
          },
        }))
      }
    }

    if (signupForm.touched.confirmPassword) {
      if (!signupForm.confirmPassword) {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            confirmPassword: "Confirm password is required",
          },
        }))
      } else if (signupForm.password !== signupForm.confirmPassword) {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            confirmPassword: "Passwords do not match",
          },
        }))
      } else {
        setSignupForm((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            confirmPassword: "",
          },
        }))
      }
    }
  }, [signupForm.name, signupForm.phone, signupForm.password, signupForm.confirmPassword, signupForm.touched])

  // Check if login form is valid
  const isLoginFormValid = () => {
    return (
      loginForm.phone && loginForm.password && !loginForm.errors.phone && !loginForm.errors.password && termsAccepted
    )
  }

  // Check if signup form is valid
  const isSignupFormValid = () => {
    return (
      signupForm.name &&
      signupForm.phone &&
      signupForm.password &&
      signupForm.confirmPassword &&
      !signupForm.errors.name &&
      !signupForm.errors.phone &&
      !signupForm.errors.password &&
      !signupForm.errors.confirmPassword &&
      termsAccepted
    )
  }

  // Canvas animation for background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create gradient particles
    const particles = []
    const particleCount = 30
    const colors = ["#8b5cf6", "#3b82f6", "#ec4899", "#10b981"]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: 0.1 + Math.random() * 0.2,
        pulse: Math.random() * 0.1,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        angle: Math.random() * 360,
        angleSpeed: 0.2 + Math.random() * 0.5,
        distance: 50 + Math.random() * 100,
      })
    }

    // Create floating light effects
    const lightSpots = []
    const lightCount = 5

    for (let i = 0; i < lightCount; i++) {
      lightSpots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 50 + Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.05 + Math.random() * 0.05,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        pulse: 0,
        pulseSpeed: 0.005 + Math.random() * 0.01,
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw light spots
      lightSpots.forEach((spot) => {
        spot.x += spot.speedX
        spot.y += spot.speedY

        // Bounce off edges
        if (spot.x < -spot.radius) spot.x = canvas.width + spot.radius
        if (spot.x > canvas.width + spot.radius) spot.x = -spot.radius
        if (spot.y < -spot.radius) spot.y = canvas.height + spot.radius
        if (spot.y > canvas.height + spot.radius) spot.y = -spot.radius

        // Pulse effect
        spot.pulse += spot.pulseSpeed
        const pulseOpacity = spot.opacity + Math.sin(spot.pulse) * 0.03
        const pulseSize = spot.radius + Math.sin(spot.pulse) * 10

        // Draw gradient circle
        const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, pulseSize)
        gradient.addColorStop(
          0,
          `${spot.color}${Math.floor(pulseOpacity * 100)
            .toString(16)
            .padStart(2, "0")}`,
        )
        gradient.addColorStop(1, `${spot.color}00`)

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(spot.x, spot.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw particles
      particles.forEach((particle) => {
        // Orbital movement
        particle.angle += particle.angleSpeed
        const radian = (particle.angle * Math.PI) / 180

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        const orbitX = centerX + Math.cos(radian) * particle.distance
        const orbitY = centerY + Math.sin(radian) * particle.distance

        // Add some random movement
        particle.x = orbitX + Math.sin(Date.now() * 0.001 + particle.angle) * 20
        particle.y = orbitY + Math.cos(Date.now() * 0.002 + particle.angle) * 20

        // Pulse opacity
        particle.pulse += particle.pulseSpeed
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.floor(pulseOpacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.fill()

        // Draw connecting lines between nearby particles
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `${particle.color}${Math.floor((1 - distance / 100) * pulseOpacity * 100)
              .toString(16)
              .padStart(2, "0")}`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })
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
const handleLogin = async (e) => {
  e.preventDefault();

  // Mark all fields touched
  setLoginForm((prev) => ({
    ...prev,
    touched: {
      phone: true,
      password: true,
    },
  }));

  if (!isLoginFormValid()) return;

  setIsLoading(true);
  try {
    const response = await fetch('https://ful2win-backend.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      
      body: JSON.stringify({
        phoneNumber: loginForm.phone,
        password: loginForm.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    // Save token & user in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to home page
    navigate('/');
  } catch (error) {
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};



  // Mock signup function
  const handleSignup = async (e) => {
  e.preventDefault();

  // Mark all fields as touched to trigger validation
  setSignupForm((prev) => ({
    ...prev,
    touched: {
      name: true,
      phone: true,
      password: true,
      confirmPassword: true,
    },
  }));

  if (!isSignupFormValid()) return;

  // Ensure passwords match
  if (signupForm.password !== signupForm.confirmPassword) {
    setSignupForm((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        confirmPassword: 'Passwords do not match',
      },
    }));
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('https://ful2win-backend.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: signupForm.name,
        phoneNumber: signupForm.phone,
        password: signupForm.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
// setSignupForm((prev) => ({
//   ...prev,
//    touched: {
//       name: "",
//       phone: "",
//       password: "",
//       confirmPassword: "",
//    },
//   }));
    // alert(`✅ Account created successfully for ${signupForm.name}!`);
    // You can also redirect or clear form here
  } catch (error) {
    alert(`❌ Signup Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden font-sans">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1e] via-[#1a1a3a] to-[#0f0f1e] z-0" />

      {/* Canvas background */}
      {/* <canvas ref={canvasRef} className="absolute inset-0 z-0" /> */}

      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden z-0"> */}
        {/* Glowing orbs - positioned for mobile */}
        {/* <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-purple-600/20 blur-[80px]" />
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 rounded-full bg-blue-600/20 blur-[80px]" />
        <div className="absolute top-3/4 left-1/3 w-40 h-40 rounded-full bg-red-600/20 blur-[80px]" /> */}
      {/* </div> */}

      {/* Main content - optimized for mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-full mx-auto px-10 py-6"
      >
        {/* Logo and tagline */}
        <motion.div
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 animate-gradient">
              FUL2WIN
            </span>
          </h1>
          <motion.div
            className="mt-2 text-sm text-white/80 font-medium tracking-widest"
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
          transition={{ duration: 0.3 }}
        >
          {/* Tabs */}
          <div className="flex">
            <motion.button
              className={`w-1/2 py-4 text-center font-bold relative ${
                activeTab === "login" ? "text-white" : "text-white/50"
              }`}
              onClick={() => setActiveTab("login")}
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
              className={`w-1/2 py-4 text-center font-bold relative ${
                activeTab === "signup" ? "text-white" : "text-white/50"
              }`}
              onClick={() => setActiveTab("signup")}
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

          <div className="p-5">
            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                  onSubmit={handleLogin}
                >
                  <div className="space-y-3">
                    <GlowInput
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      icon={<FaPhoneAlt size={14} />}
                      value={loginForm.phone}
                      onChange={handleLoginChange}
                      error={loginForm.errors.phone}
                      touched={loginForm.touched.phone}
                      valid={loginForm.touched.phone && !loginForm.errors.phone && loginForm.phone}
                      label="Phone Number"
                      required
                    />

                    <PasswordInput
                      name="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      error={loginForm.errors.password}
                      touched={loginForm.touched.password}
                      valid={loginForm.touched.password && !loginForm.errors.password && loginForm.password}
                      label="Password"
                      required
                    />
                  </div>

                  <div className="text-right">
                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Terms checkbox */}
                  <GlowCheckbox
                    id="terms-login"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    label={
                      <>
                        I agree to the{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                          Privacy Policy
                        </a>
                      </>
                    }
                  />

                  <GlowButton
                    gradient="bg-gradient-to-r from-blue-600 to-purple-600"
                    className="w-full"
                    type="submit"
                    disabled={isLoading || !isLoginFormValid()}
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
                        LOGIN <FaChevronRight size={14} />
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
                  className="space-y-4"
                  onSubmit={handleSignup}
                >
                  <div className="space-y-3">
                    <GlowInput
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      icon={<FaUser size={14} />}
                      value={signupForm.name}
                      onChange={handleSignupChange}
                      error={signupForm.errors.name}
                      touched={signupForm.touched.name}
                      valid={signupForm.touched.name && !signupForm.errors.name && signupForm.name}
                      label="Full Name"
                      required
                    />

                    <GlowInput
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      icon={<FaPhoneAlt size={14} />}
                      value={signupForm.phone}
                      onChange={handleSignupChange}
                      error={signupForm.errors.phone}
                      touched={signupForm.touched.phone}
                      valid={signupForm.touched.phone && !signupForm.errors.phone && signupForm.phone}
                      label="Phone Number"
                      required
                    />

                    <PasswordInput
                      name="password"
                      placeholder="Create Password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      error={signupForm.errors.password}
                      touched={signupForm.touched.password}
                      valid={signupForm.touched.password && !signupForm.errors.password && signupForm.password}
                      label="Create Password"
                      required
                    />

                    <PasswordInput
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                      error={signupForm.errors.confirmPassword}
                      touched={signupForm.touched.confirmPassword}
                      valid={
                        signupForm.touched.confirmPassword &&
                        !signupForm.errors.confirmPassword &&
                        signupForm.confirmPassword
                      }
                      label="Confirm Password"
                      required
                    />
                  </div>

                  {/* Terms checkbox */}
                  <GlowCheckbox
                    id="terms-signup"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    label={
                      <>
                        I agree to the{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                          Privacy Policy
                        </a>
                      </>
                    }
                  />

                  <GlowButton
                    gradient="bg-gradient-to-r from-purple-600 to-red-500"
                    className="w-full"
                    type="submit"
                    disabled={isLoading || !isSignupFormValid()}
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
                        CREATE ACCOUNT <FaChevronRight size={14} />
                      </>
                    )}
                  </GlowButton>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social login options */}
            {/* <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-xs text-center text-white/60 mb-4">OR CONTINUE WITH</div>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-black/30 border border-white/10 text-white hover:bg-black/40 transition-colors"
                >
                  <FaGoogle className="text-red-400" size={14} />
                  <span className="text-sm font-medium">Google</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-black/30 border border-white/10 text-white hover:bg-black/40 transition-colors"
                >
                  <FaPhoneAlt className="text-blue-400" size={14} />
                  <span className="text-sm font-medium">Phone</span>
                </motion.button>
              </div>
            </div> */}
          </div>
        </motion.div>

        {/* Footer text */}
        <motion.div
          className="mt-6 text-center text-[10px] text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          © 2023 Ful2win. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GamingLoginMobile
