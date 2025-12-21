import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiMail, FiLock } from "react-icons/fi";
import { motion as Motion } from "framer-motion";
import { googleProvider } from "./firebase.js";
import { getAuth, signInWithPopup, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { authAPI } from "../utils/api";
import { toast } from "react-toastify";

export default function Login() {
  const darkMode = true; // Force dark mode
  const auth = getAuth();
  const githubProvider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // FIXED: Redirect if already logged in - added empty dependency array
  // NEW - FIXED
useEffect(() => {
  const token = localStorage.getItem('token');
  const hasNavigated = sessionStorage.getItem('hasNavigated');
  
  if (token && !hasNavigated) {
    sessionStorage.setItem('hasNavigated', 'true');
    navigate('/dashboard', { replace: true });
  }
  
  return () => {
    sessionStorage.removeItem('hasNavigated');
  };
}, []); // Empty array - runs once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({
        email: email,
        password: password,
      });

      // Store the token and user data
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Show success message
      toast.success('Login successful! Redirecting...');
      
      // Redirect to the intended page or dashboard
      navigate(location.state?.from || '/dashboard', { replace: true });
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
        duration: 0.5,
      },
    },
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      // Send Google auth data to your backend
      const response = await authAPI.login({
        email: user.email,
        name: user.displayName,
        provider: 'google',
        providerId: user.uid,
        profilePicture: user.photoURL
      });

      // Store the token and user data
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Google login successful!');
      navigate(location.state?.from || '/dashboard', { replace: true });
      
    } catch (error) {
      console.error("Google Sign In Error:", error);
      toast.error(error.message || 'Google login failed');
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const { user } = result;
      
      // Send GitHub auth data to your backend
      const response = await authAPI.login({
        email: user.email || `${user.uid}@github.com`,
        username: user.displayName || user.reloadUserInfo.screenName,
        provider: 'github',
        providerId: user.uid,
        profilePicture: user.photoURL
      });

      // Store the token and user data
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('GitHub login successful!');
      navigate(location.state?.from || '/dashboard', { replace: true });
      
    } catch (error) {
      console.error("GitHub Sign In Error:", error);
      toast.error(error.message || 'GitHub login failed');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const { user } = result;
      
      // Send Facebook auth data to your backend
      const response = await authAPI.login({
        email: user.email || `${user.uid}@facebook.com`,
        name: user.displayName,
        provider: 'facebook',
        providerId: user.uid,
        profilePicture: user.photoURL
      });

      // Store the token and user data
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Facebook login successful!');
      navigate(location.state?.from || '/dashboard', { replace: true });
      
    } catch (error) {
      console.error("Facebook Sign In Error:", error);
      toast.error(error.message || 'Facebook login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-opacity-50 m-0 relative overflow-hidden transition-colors duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <Motion.div
        className="w-full max-w-md bg-gray-800/90 text-gray-100 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">SH</span>
          </div>
          <Motion.h1 className="text-3xl font-bold text-white mb-2" variants={itemVariants}>
            Welcome Back
          </Motion.h1>
          <Motion.p className="text-gray-300" variants={itemVariants}>
            Sign in to your account
          </Motion.p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400 rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200"
                placeholder="Email"
                required
              />
            </div>
          </Motion.div>

          <Motion.div className="space-y-1" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400 rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200"
                placeholder="Password"
                required
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
          </Motion.div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-400 focus:ring-blue-400"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>
          </div>

          <Motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-blue-200/50 hover:scale-[1.02] transform transition-all duration-200'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </Motion.div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm bg-gray-800">
              <span className="px-2 text-gray-300">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors duration-200"
            >
              <FaGoogle className="w-5 h-5 text-red-400" />
            </button>
            <button
              onClick={handleGitHubSignIn}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors duration-200"
            >
              <FaGithub className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={handleFacebookSignIn}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors duration-200"
            >
              <FaFacebook className="w-5 h-5 text-blue-400" />
            </button>
          </div>
        </div>

        <Motion.p 
          className="mt-6 text-center text-sm text-gray-400"
          variants={itemVariants}
        >
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="font-medium hover:underline transition-colors text-blue-400 hover:text-blue-300"
          >
            Sign up
          </Link>
        </Motion.p>
      </Motion.div>
    </div>
  );
}