import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiCopy, FiCheck, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { googleProvider } from "./firebase.js";
import { getAuth, signInWithPopup, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";

const Signup = () => {
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-orange-50 bg-opacity-50">
      <motion.div
        className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">SH</span>
          </div>
          <motion.h1 className="text-3xl font-bold text-gray-900 mb-2" variants={itemVariants}>
            Join Students Hub
          </motion.h1>
          <motion.p className="text-gray-600" variants={itemVariants}>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="peer w-full px-4 py-3 pl-11 pr-4 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                placeholder=" "
                required
              />
              <label
                htmlFor="username"
                className="absolute left-3 -top-2.5 px-1 bg-white text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600"
              >
                Username
              </label>
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-green-500 transition-colors" />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full px-4 py-3 pl-11 pr-10 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2.5 px-1 bg-white text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600"
              >
                Email
              </label>
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-green-500 transition-colors" />
              {formData.email && (
                <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </motion.div>

          {/* Password */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="peer w-full px-4 py-3 pl-11 pr-10 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                placeholder=" "
                required
                minLength={8}
              />
              <label
                htmlFor="password"
                className="absolute left-3 -top-2.5 px-1 bg-white text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600"
              >
                Password
              </label>
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-green-500 transition-colors" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Strength Indicator */}
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
                        : strengthCount >= 4
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

          {/* Confirm Password */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 pl-11 pr-10 rounded-lg border ${
                  formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-green-400 focus:ring-green-100"
                } focus:ring-2 outline-none transition-all duration-200`}
                placeholder=" "
                required
                minLength={8}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-3 -top-2.5 px-1 bg-white text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600"
              >
                Confirm Password
              </label>
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-green-500 transition-colors" />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div className="relative my-6" variants={itemVariants}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </motion.div>

        {/* Social Buttons */}
        <motion.div className="grid grid-cols-3 gap-3" variants={itemVariants}>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Sign up with Google"
          >
            <FaGoogle className="text-red-500" />
          </button>
          <button
            type="button"
            onClick={signInWithGitHub}
            className="flex items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Continue with GitHub"
          >
            <FaGithub className="text-gray-800" />
          </button>
          <button
            type="button"
            onClick={handleFacebookSignUp}
            className="flex items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Continue with Facebook"
          >
            <FaFacebook className="text-blue-600" />
          </button>
        </motion.div>

        {/* Login Link */}
        <motion.div className="text-center mt-6" variants={itemVariants}>
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
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