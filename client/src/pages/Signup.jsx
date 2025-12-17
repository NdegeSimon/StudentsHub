import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaArrowRight, FaSun, FaMoon } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiCopy, FiCheck, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { googleProvider } from "./firebase.js";
import { getAuth, signInWithPopup, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";

// Replace the useTheme import and dark mode toggle with a simple darkMode constant
const Signup = () => {
  const navigate = useNavigate();
  const darkMode = true; // Force dark mode

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student", // Default to student
  });
  // ... rest of your state and functions

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [strength, setStrength] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    length: false
  });
  const [strengthCount, setStrengthCount] = useState(0);

  const auth = getAuth();
  const provider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      return {
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
        length: false
      };
    }

    return {
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      length: password.length >= 8
    };
  };

  // Update strength when password changes
  useEffect(() => {
    const newStrength = checkPasswordStrength(formData.password);
    setStrength(newStrength);
    setStrengthCount(Object.values(newStrength).filter(Boolean).length);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Your signup logic here
      // Example:
      // const response = await signUpUser(formData);
      // handle successful signup
      setSuccess("Account created successfully!");
      // Redirect to login or dashboard
      // navigate('/login');
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // Handle successful GitHub signup
      navigate('/dashboard');
    } catch (error) {
      console.error("GitHub SignIn Error:", error);
      setError("Failed to sign in with GitHub. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Handle successful Google signup
      navigate('/dashboard');
    } catch (error) {
      console.error("Google SignIn Error:", error);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      // Handle successful Facebook signup
      navigate('/dashboard');
    } catch (error) {
      console.error("Facebook SignIn Error:", error);
      setError("Failed to sign in with Facebook. Please try again.");
    }
  };

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
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    } bg-opacity-50 m-0 relative overflow-hidden transition-colors duration-300`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob ${
          darkMode ? 'bg-blue-900' : 'bg-blue-100'
        }`}></div>
        <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000 ${
          darkMode ? 'bg-purple-900' : 'bg-purple-100'
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


        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
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

        {/* Error and Success Messages */}
        {error && (
          <motion.div 
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm"
            variants={itemVariants}
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                I am signing up as:
              </label>
              <div className={`mt-1 grid grid-cols-2 gap-4 p-1 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                  formData.userType === 'student' 
                    ? darkMode 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-blue-600 shadow-md' 
                    : darkMode 
                      ? 'hover:bg-gray-600/50' 
                      : 'hover:bg-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={formData.userType === 'student'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <span className="text-sm font-medium"> Student</span>
                  </div>
                </label>
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                  formData.userType === 'employer' 
                    ? darkMode 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-blue-600 shadow-md' 
                    : darkMode 
                      ? 'hover:bg-gray-600/50' 
                      : 'hover:bg-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="employer"
                    checked={formData.userType === 'employer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <span className="text-sm font-medium"> Employer</span>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Username */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Username"
                required
              />
            </div>
          </motion.div>

          {/* User Type */}
          
          {/* Email */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Email"
                required
              />
              {formData.email && (
                <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </motion.div>

          {/* Password */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className={`h-1.5 w-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                } rounded-full overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${
                      strengthCount === 1
                        ? "bg-red-500 w-1/4"
                        : strengthCount === 2
                        ? "bg-yellow-500 w-1/2"
                        : strengthCount === 3
                        ? "bg-blue-500 w-3/4"
                        : strengthCount >= 4
                        ? "bg-green-500 w-full"
                        : darkMode ? "bg-gray-600 w-0" : "bg-gray-200 w-0"
                    } transition-all duration-300`}
                  ></div>
                </div>
                <div className={`grid grid-cols-2 gap-1 text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex items-center">
                    {strength.lowercase ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} mr-1`} size={12} />
                    )}
                    <span>Lowercase</span>
                  </div>
                  <div className="flex items-center">
                    {strength.uppercase ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} mr-1`} size={12} />
                    )}
                    <span>Uppercase</span>
                  </div>
                  <div className="flex items-center">
                    {strength.number ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} mr-1`} size={12} />
                    )}
                    <span>Number</span>
                  </div>
                  <div className="flex items-center">
                    {strength.special ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} mr-1`} size={12} />
                    )}
                    <span>Special char</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "border-red-400 focus:ring-red-100"
                    : darkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400' 
                      : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Confirm Password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            className="mt-8" 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg 
                bg-gradient-to-r from-blue-500 to-purple-500 
                hover:from-blue-600 hover:to-purple-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-200 transform hover:shadow-lg
                ${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-md'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating your account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  
                       Signup
                </span>
              )}
            </button>
            <p className={`mt-3 text-center text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div className="relative my-6" variants={itemVariants}>
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${
              darkMode ? 'bg-gray-800/90 text-gray-400' : 'bg-white text-gray-500'
            }`}>Or continue with</span>
          </div>
        </motion.div>

        {/* Social Buttons */}
        <motion.div className="grid grid-cols-3 gap-3 mt-6" variants={itemVariants}>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className={`flex items-center justify-center py-2.5 px-4 rounded-xl border ${
              darkMode 
                ? 'border-gray-700 hover:bg-gray-700/50' 
                : 'border-gray-200 hover:bg-gray-50'
            } transition-colors`}
          >
            <FaGoogle className={darkMode ? 'text-white' : 'text-red-500'} />
          </button>
          <button
            type="button"
            onClick={signInWithGitHub}
            className={`flex items-center justify-center py-2.5 px-4 rounded-xl border ${
              darkMode 
                ? 'border-gray-700 hover:bg-gray-700/50' 
                : 'border-gray-200 hover:bg-gray-50'
            } transition-colors`}
          >
            <FaGithub className={darkMode ? 'text-white' : 'text-gray-800'} />
          </button>
          <button
            type="button"
            onClick={handleFacebookSignUp}
            className={`flex items-center justify-center py-2.5 px-4 rounded-xl border ${
              darkMode 
                ? 'border-gray-700 hover:bg-gray-700/50' 
                : 'border-gray-200 hover:bg-gray-50'
            } transition-colors`}
          >
            <FaFacebook className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          </button>
        </motion.div>

        {/* Login Link */}
        <motion.div className="mt-6 text-center text-sm" variants={itemVariants}>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Already have an account?{" "}
            <Link
              to="/login"
              className={`font-medium ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-500'
              } transition-colors`}
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;