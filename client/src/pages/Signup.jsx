import React, { useState } from "react";
import { FaGoogle, FaDiscord, FaFacebook, FaGithub } from "react-icons/fa";
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff, FiCopy } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
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
 const handleFacebookLogin = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log("User:", result.user);
  } catch (error) {
    console.error("Facebook Login Error:", error);
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

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">
        
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Join Students Hub</h1>
        <p className="text-gray-600 text-center mb-8">
          Create your account and get your first Job
        </p>

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
        <div className="space-y-3 mb-8">
          <button 
                 onClick={handleGoogleSignUp}
                   className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-800 transition p-3 rounded-lg text-white font-medium">
               <FaGoogle className="text-red" /> Sign up with Google
          </button>


          <button 
                   onClick={signInWithGitHub}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-400 to-orange-400 hover:bg-green-800 transition p-3 rounded-lg text-white font-medium">
            <FaGithub className="text-indigo-400" /> Continue with GitHub
          </button>

          <button
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-800 transition p-3 rounded-lg text-white font-medium">
            <FaFacebook className="text-orange-400" /> Continue with Facebook
          </button>
        </div>

        <p className="text-gray-500 text-center text-sm mb-6">
          — or create account with email —
        </p>

        {/* Form */}
        <div className="space-y-5">

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Username</label>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
              <FiUser className="text-gray-400" />
              <input
                type="text"
                placeholder="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Email address</label>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
              <FiMail className="text-gray-400" />
              <input
                type="email"
                placeholder="username@gmail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              />
              <FiCopy className="text-gray-400 cursor-pointer hover:text-gray-300" />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Password</label>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border-2 border-yellow-400">
              <FiLock className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Password Strength Checker */}
            {formData.password && (
              <div className="mt-4 space-y-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition ${
                        i < strengthCount
                          ? strengthCount <= 2
                            ? "bg-red-500"
                            : strengthCount <= 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={strength.length ? "text-green-500" : "text-gray-400"}>✓</span>
                    <span className={strength.length ? "text-green-600" : "text-gray-500"}>8+ characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={strength.uppercase ? "text-green-500" : "text-gray-400"}>✓</span>
                    <span className={strength.uppercase ? "text-green-600" : "text-gray-500"}>Uppercase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={strength.lowercase ? "text-green-500" : "text-gray-400"}>✓</span>
                    <span className={strength.lowercase ? "text-green-600" : "text-gray-500"}>Lowercase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={strength.number ? "text-green-500" : "text-gray-400"}>✓</span>
                    <span className={strength.number ? "text-green-600" : "text-gray-500"}>Number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={strength.special ? "text-green-500" : "text-gray-400"}>✓</span>
                    <span className={strength.special ? "text-green-600" : "text-gray-500"}>Special char</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Confirm Password</label>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
              <FiLock className="text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-gray-300"
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" className="accent-yellow-400 w-4 h-4" />
            <p className="text-gray-600 text-sm">
              I agree to the{" "}
              <span className="text-yellow-600 cursor-pointer font-medium hover:underline">Terms of Service</span> and{" "}
              <span className="text-yellow-600 cursor-pointer font-medium hover:underline">Privacy Policy</span>
            </p>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 transition p-3 rounded-lg text-lg font-bold text-gray-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <button
  className="text-yellow-600 hover:underline cursor-pointer font-medium"
  onClick={() => navigate("/Login")}
>
  Log in
</button>

        </p>
      </div>
    </div>
  );
};

export default Signup;