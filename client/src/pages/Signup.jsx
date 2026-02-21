import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiCheck, FiBriefcase } from "react-icons/fi";
import { motion } from "framer-motion";
import { googleProvider } from "./firebase.js";
import { getAuth, signInWithPopup, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { authAPI } from "../utils/api";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    companyName: "",
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

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type,
      companyName: type === 'employer' ? prev.companyName : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate username
    const trimmedUsername = formData.username.trim();
    if (!trimmedUsername) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (trimmedUsername.length < 2) {
      setError("Name must be at least 2 characters long");
      setLoading(false);
      return;
    }

    if (!formData.email) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

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

    if (formData.userType === 'employer' && !formData.companyName.trim()) {
      setError("Company name is required for employer accounts");
      setLoading(false);
      return;
    }

    try {
      // Map frontend userType to backend role
      const role = formData.userType === 'employer' ? 'employer' : 'student';
      
      const userData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.username,
        last_name: "",
        role: role,
      };

      // Add company name for employers
      if (formData.userType === 'employer' && formData.companyName) {
        userData.company_name = formData.companyName;
      }

      console.log('Sending registration request...', userData);
      
      const response = await authAPI.register(userData);
      console.log('Registration response:', response);
      
      if (!response || !response.data) {
        throw new Error('No response received from server');
      }
      
      const successMessage = formData.userType === 'employer' 
        ? "Employer account created successfully! Redirecting to employer dashboard..."
        : "Account created successfully! Redirecting to login...";
      
      setSuccess(successMessage);
      toast.success(successMessage);
      
      // Store token and user data
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Token and user data stored successfully');
      }
      
      // Redirect based on user type
      setTimeout(() => {
        if (formData.userType === 'employer') {
          window.location.href = '/employer/dashboard';
        } else {
          navigate('/login');
        }
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
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [socialUser, setSocialUser] = useState(null);
  const [companyName, setCompanyName] = useState('');

  const handleSocialRegistration = async (userType) => {
    try {
      setLoading(true);
      
      const userData = {
        email: socialUser.email,
        first_name: socialUser.displayName || socialUser.email.split('@')[0],
        last_name: "",
        role: userType,
      };

      // Add company name for employers
      if (userType === 'employer') {
        userData.company_name = companyName;
      }

      // Check if user exists
      const checkResponse = await authAPI.checkUserExists({ email: socialUser.email });
      
      if (checkResponse.data.exists) {
        // User exists, log them in
        const loginResponse = await authAPI.login({
          email: socialUser.email,
          social_login: true,
          provider: 'google'
        });
        
        // Store token and user data
        localStorage.setItem('token', loginResponse.data.access_token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        
        // Redirect based on role
        const redirectPath = loginResponse.data.user.role === 'employer' ? '/employer/dashboard' : '/dashboard';
        window.location.href = redirectPath;
      } else {
        // New user, register them
        const registerResponse = await authAPI.register(userData);
        
        // Store token and user data
        localStorage.setItem('token', registerResponse.data.access_token);
        localStorage.setItem('user', JSON.stringify(registerResponse.data.user));
        
        // Redirect based on role
        const redirectPath = userType === 'employer' ? '/employer/dashboard' : '/dashboard';
        window.location.href = redirectPath;
      }
      
    } catch (error) {
      console.error('Social registration error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to complete registration. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowCompanyModal(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login success:', result.user);
      
      // Store the social user data
      const userData = {
        email: result.user.email,
        displayName: result.user.displayName,
        uid: result.user.uid
      };
      
      setSocialUser(userData);
      
      // Check if user exists
      const checkResponse = await authAPI.checkUserExists({ email: userData.email });
      
      if (checkResponse.data.exists) {
        // User exists, log them in
        const loginResponse = await authAPI.login({
          email: userData.email,
          social_login: true,
          provider: 'google'
        });
        
        // Store token and user data
        localStorage.setItem('token', loginResponse.data.access_token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        
        // Redirect based on role
        const redirectPath = loginResponse.data.user.role === 'employer' ? '/employer/dashboard' : '/dashboard';
        window.location.href = redirectPath;
      } else {
        // Show company modal for new users to select account type
        setShowCompanyModal(true);
      }
      
    } catch (error) {
      console.error("Google SignIn Error:", error);
      const errorMessage = error.response?.data?.error || "Failed to sign in with Google. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log('GitHub login success:', result.user);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error("GitHub SignIn Error:", error);
      setError("Failed to sign in with GitHub. Please try again.");
      toast.error("Failed to sign in with GitHub");
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('Facebook login success:', result.user);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error("Facebook SignIn Error:", error);
      setError("Failed to sign in with Facebook. Please try again.");
      toast.error("Failed to sign in with Facebook");
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
            Start your journey to finding the perfect job or talent
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
          {/* User Type Selector */}
          <motion.div className="space-y-1" variants={itemVariants}>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              I am signing up as:
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4 p-1 rounded-xl bg-gray-700/50">
              <button
                type="button"
                onClick={() => handleUserTypeChange('student')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                  formData.userType === 'student' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                    : 'hover:bg-gray-600/50'
                }`}
              >
                <FiUser className="h-5 w-5 mb-1" />
                <span className="text-sm font-medium">Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('employer')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                  formData.userType === 'employer' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                    : 'hover:bg-gray-600/50'
                }`}
              >
                <FiBriefcase className="h-5 w-5 mb-1" />
                <span className="text-sm font-medium">Employer</span>
              </button>
            </div>
          </motion.div>

          {/* Company Name Field (Only for Employers) */}
          {formData.userType === 'employer' && (
            <motion.div className="space-y-1" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-400 rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition duration-200"
                  placeholder="Company Name"
                  required={formData.userType === 'employer'}
                />
              </div>
            </motion.div>
          )}

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
                placeholder={formData.userType === 'employer' ? "Contact Person Name" : "Username"}
                minLength={2}
                maxLength={50}
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
                placeholder={formData.userType === 'employer' ? "Company Email" : "Email"}
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
                `Sign Up as ${formData.userType === 'employer' ? 'Employer' : 'Student'}`
              )}
            </button>
            <p className="mt-3 text-center text-sm text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </form>

        {/* Company Info Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gray-800 rounded-2xl p-6 w-full max-w-md relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Complete Your Registration</h3>
            <p className="text-gray-300 mb-6">Please select your account type and provide the required information.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  I am signing up as:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'student' }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.userType === 'student'
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'employer' }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.userType === 'employer'
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    Employer
                  </button>
                </div>
              </div>

              {formData.userType === 'employer' && (
                <div>
                  <label htmlFor="modal-company-name" className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="modal-company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your company name"
                    required={formData.userType === 'employer'}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompanyModal(false);
                    setCompanyName('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialRegistration(formData.userType)}
                  disabled={loading || (formData.userType === 'employer' && !companyName.trim())}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    loading || (formData.userType === 'employer' && !companyName.trim())
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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