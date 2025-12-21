import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { googleProvider } from "./firebase.js";
import { getAuth, signInWithPopup, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { authAPI } from "../utils/api";

const Signup = () => {
  const navigate = useNavigate();
  const darkMode = true;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student",
  });

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
  const githubProvider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (strengthCount < 4) {
      setError("Password must meet all security requirements");
      setLoading(false);
      return;
    }

    try {
      // Map frontend fields to backend expected fields
      const userData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.username,
        last_name: "",
        role: formData.userType,
      };

      console.log('Sending registration request...', userData);
      
      const response = await authAPI.register(userData);
      console.log('Registration response:', response);
      
      if (!response || !response.data) {
        throw new Error('No response received from server');
      }
      
      setSuccess("Account created successfully! Redirecting to dashboard...");
      
      // Store token and user data
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Token and user data stored successfully');
      }
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = "Signup failed. Please try again.";
      
      if (error.response?.data) {
        errorMessage = error.response.data.error || 
                      error.response.data.message || 
                      JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message || "An unknown error occurred";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log('GitHub login success:', result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error("GitHub SignIn Error:", error);
      setError("Failed to sign in with GitHub. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login success:', result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error("Google SignIn Error:", error);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('Facebook login success:', result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error("Facebook SignIn Error:", error);
      setError("Failed to sign in with Facebook. Please try again.");
    }
  };

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-opacity-50 m-0 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        className="w-full max-w-md bg-gray-800/90 text-gray-100 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">SH</span>
          </div>
          <motion.h1 className="text-3xl font-bold text-white mb-2" variants={itemVariants}>
            Join Students Hub
          </motion.h1>
          <motion.p className="text-gray-300" variants={itemVariants}>
            Start your journey to finding the perfect job
          </motion.p>
        </div>

        {error && (
          <motion.div 
            className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-sm"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="mb-4 p-3 bg-green-900/50 border border-green-500/50 text-green-200 rounded-lg text-sm"
            variants={itemVariants}
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div className="space-y-1" variants={itemVariants}>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              I am signing up as:
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4 p-1 rounded-xl bg-gray-700/50">
              <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                formData.userType === 'student' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-gray-600/50'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={formData.userType === 'student'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm font-medium">Student</span>
              </label>
              <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                formData.userType === 'employer' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-gray-600/50'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="employer"
                  checked={formData.userType === 'employer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm font-medium">Employer</span>
              </label>
            </div>
          </motion.div>

          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400 rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200"
                placeholder="Username"
                required
              />
            </div>
          </motion.div>

          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400 rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200"
                placeholder="Email"
                required
              />
              {formData.email && (
                <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </motion.div>

          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400 rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200"
                placeholder="Password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
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
                        : "bg-gray-600 w-0"
                    } transition-all duration-300`}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                  <div className="flex items-center">
                    {strength.lowercase ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className="text-gray-600 mr-1" size={12} />
                    )}
                    <span>Lowercase</span>
                  </div>
                  <div className="flex items-center">
                    {strength.uppercase ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className="text-gray-600 mr-1" size={12} />
                    )}
                    <span>Uppercase</span>
                  </div>
                  <div className="flex items-center">
                    {strength.number ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className="text-gray-600 mr-1" size={12} />
                    )}
                    <span>Number</span>
                  </div>
                  <div className="flex items-center">
                    {strength.special ? (
                      <FaCheckCircle className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaTimesCircle className="text-gray-600 mr-1" size={12} />
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
                <FiLock className="h-5 w-5 text-gray-400" />
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
                    : "border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400"
                } rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200`}
                placeholder="Confirm Password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
          </motion.div>

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
                "Sign Up"
              )}
            </button>
            <p className="mt-3 text-center text-sm text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </form>

        <motion.div className="relative my-6" variants={itemVariants}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800/90 text-gray-400">Or continue with</span>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-3 gap-3 mt-6" variants={itemVariants}>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors"
          >
            <FaGoogle className="text-white" />
          </button>
          <button
            type="button"
            onClick={signInWithGitHub}
            className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors"
          >
            <FaGithub className="text-white" />
          </button>
          <button
            type="button"
            onClick={handleFacebookSignUp}
            className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors"
          >
            <FaFacebook className="text-blue-400" />
          </button>
        </motion.div>

        <motion.div className="mt-6 text-center text-sm" variants={itemVariants}>
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
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