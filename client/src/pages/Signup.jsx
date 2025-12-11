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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-orange-50 bg-opacity-50 m-0 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
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
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Sign up with Google"
            >
              <FaGoogle className="text-red-500" />
            </button>
            <button
              onClick={signInWithGitHub}
              className="w-full flex items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Continue with GitHub"
            >
              <FaGithub className="text-gray-800" />
            </button>
            <button
              onClick={handleFacebookSignUp}
              className="w-full flex items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Continue with Facebook"
            >
              <FaFacebook className="text-blue-600" />
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
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="peer w-full px-4 py-3 pl-11 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                placeholder=" "
              />
              <label
                htmlFor="username"
                className="absolute left-3 -top-2.5 px-1 bg-white text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600"
              >
                Username
              </label>
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-green-500 transition-colors" />
              {formData.username && (
                <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </motion.div>

          <motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full px-4 py-3 pl-11 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2.5 px-1 bg-white text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600"
              >
                Email address
              </label>
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-green-500 transition-colors" />
              {formData.email && (
                <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </motion.div>

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
              />
              <label
                htmlFor="confirmPassword"
                className={`absolute left-3 -top-2.5 px-1 bg-white text-xs transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs ${
                  formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500"
                    : "text-gray-500 peer-placeholder-shown:text-gray-400 peer-focus:text-green-600"
                }`}
              >
                Confirm Password
              </label>
              <FiLock
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "text-red-400"
                    : "text-gray-400 peer-focus:text-green-500"
                } transition-colors`}
              />

              {formData.confirmPassword && (
                <>
                  {formData.password === formData.confirmPassword ? (
                    <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                  ) : (
                    <FiAlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                  )}
                </>
              )}

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-green-600 font-medium hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-600 font-medium hover:underline">
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
              className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 p-4 rounded-xl text-lg font-semibold text-white shadow-lg shadow-green-100 hover:shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Creating account...
                </>
              ) : (
                <>
                  <span>Create account</span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        <motion.p
          className="text-center text-gray-600 mt-6 text-sm"
          variants={itemVariants}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline hover:text-green-700 transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;