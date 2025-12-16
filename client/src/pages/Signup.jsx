import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaArrowRight, FaSun, FaMoon } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiCopy, FiCheck, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { googleProvider } from "./firebase.js";
import { getAuth, signInWithPopup, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";

const Signup = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const auth = getAuth();
  const provider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
    } catch (error) {
      console.error("GitHub SignIn Error:", error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save token or user info
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      navigate("/main");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("User:", result.user);
    } catch (error) {
      console.error("Facebook SignUp Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully! Redirecting...");

      // Store tokens if they exist
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/Login";
      }, 1500);
    } catch (err) {
      setError("Network error: " + err.message);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (pwd) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*]/.test(pwd),
    };
  };

  const strength = checkPasswordStrength(formData.password);
  const strengthCount = Object.values(strength).filter(Boolean).length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-green-50 via-white to-orange-50'
    } bg-opacity-50 m-0 relative overflow-hidden transition-colors duration-300`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob ${
          darkMode ? 'bg-green-900' : 'bg-green-100'
        }`}></div>
        <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000 ${
          darkMode ? 'bg-orange-900' : 'bg-orange-100'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000 ${
          darkMode ? 'bg-yellow-900' : 'bg-yellow-100'
        }`}></div>
      </div>

      <motion.div
        className={`w-full max-w-md ${
          darkMode ? 'bg-gray-800/90 text-gray-100' : 'bg-white/90 text-gray-900'
        } backdrop-blur-sm p-8 rounded-2xl shadow-2xl border ${
          darkMode ? 'border-gray-700/50' : 'border-white/20'
        } relative z-10`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">SH</span>
          </div>
          <motion.h1 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          } mb-2`} variants={itemVariants}>
            Join Students Hub
          </motion.h1>
          <motion.p className={darkMode ? 'text-gray-300' : 'text-gray-600'} variants={itemVariants}>
            Start your journey to finding the perfect job
          </motion.p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Social Buttons */}
        <motion.div className="space-y-4 mb-8" variants={itemVariants}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}></div>
            </div>
            <div className={`relative flex justify-center text-sm ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <span className={`px-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleGoogleSignUp}
              className={`w-full flex items-center justify-center px-4 py-2.5 border ${
                darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
              } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-green-400' : 'focus:ring-green-500'
              } transition-colors duration-200`}
            >
              <FaGoogle className={`w-5 h-5 ${
                darkMode ? 'text-red-400' : 'text-red-500'
              } mr-2`} />
              Google
            </button>
            <button
              onClick={signInWithGitHub}
              className={`w-full flex items-center justify-center px-4 py-2.5 border ${
                darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
              } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-green-400' : 'focus:ring-green-500'
              } transition-colors duration-200`}
            >
              <FaGithub className={`w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } mr-2`} />
              GitHub
            </button>
            <button
              onClick={handleFacebookSignUp}
              className={`w-full flex items-center justify-center px-4 py-2.5 border ${
                darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
              } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-green-400' : 'focus:ring-green-500'
              } transition-colors duration-200`}
            >
              <FaFacebook className={`w-5 h-5 ${
                darkMode ? 'text-blue-400' : 'text-blue-500'
              } mr-2`} />
              Facebook
            </button>
          </div>
        </motion.div>

        <p className="text-gray-500 text-center text-sm mb-6">
          — or create account with email —
        </p>

        {/* Form */}
        <div className="space-y-5">
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-green-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500 focus:ring-green-500'
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Username"
                required
              />
            </div>
          </motion.div>

          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-green-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500 focus:ring-green-500'
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Email"
                required
              />
            </div>
          </motion.div>

          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-green-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500 focus:ring-green-500'
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } hover:text-gray-600 transition-colors`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      strengthCount === 1
                        ? "bg-red-500 w-1/4"
                        : strengthCount === 2
                        ? "bg-yellow-500 w-1/2"
                        : strengthCount === 3
                        ? "bg-blue-500 w-3/4"
                        : strengthCount === 4
                        ? "bg-green-500 w-full"
                        : "bg-gray-200 w-0"
                    } transition-all duration-300`}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    {strength.lowercase ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className="text-gray-300 mr-1" size={12} />
                    )}
                    <span>Lowercase</span>
                  </div>
                  <div className="flex items-center">
                    {strength.uppercase ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className="text-gray-300 mr-1" size={12} />
                    )}
                    <span>Uppercase</span>
                  </div>
                  <div className="flex items-center">
                    {strength.number ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className="text-gray-300 mr-1" size={12} />
                    )}
                    <span>Number</span>
                  </div>
                  <div className="flex items-center">
                    {strength.special ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className="text-gray-300 mr-1" size={12} />
                    )}
                    <span>Special char</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-green-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500 focus:ring-green-500'
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } hover:text-gray-600 transition-colors`}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" /> Passwords don't match
                </p>
              )}
          </motion.div>

          <motion.div className="flex items-start gap-3 mb-6" variants={itemVariants}>
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-green-400 cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            } cursor-pointer`}>
              I agree to the{" "}
              <a href="#" className={`text-green-600 font-medium hover:underline ${
                darkMode ? 'text-green-400' : 'text-green-500'
              }`}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className={`text-green-600 font-medium hover:underline ${
                darkMode ? 'text-green-400' : 'text-green-500'
              }`}>
                Privacy Policy
              </a>
            </label>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <button
              onClick={handleSignup}
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 shadow-lg hover:shadow-green-200/50 hover:scale-[1.02] transform transition-all duration-200'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </motion.div>
        </div>

        <motion.p 
          className={`mt-6 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
          variants={itemVariants}
        >
          Already have an account?{' '}
          <Link 
            to="/login" 
            className={`font-medium hover:underline transition-colors ${
              darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
            }`}
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;