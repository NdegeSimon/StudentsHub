import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", "true");

        navigate("/main");
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Ensure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-yellow-400 bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/back.png')" }}
    >
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl">

        <h2 className="text-3xl font-bold mb-9 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label className="font-bold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-black"
            placeholder="you@example.com"
            required
          />

          <label className="font-bold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-black"
            placeholder="Min. 8 characters"
            required
          />

          <div className="flex items-center mb-4">
            <input type="checkbox" className="mr-2 rounded-md" />
            <span className="text-sm">
              I agree to the <strong>terms and conditions</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white w-full py-3 rounded-3xl hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          <strong>Don't have an account?</strong>
          <span
            onClick={() => navigate("/SignUp")}
            className="font-bold ml-1 text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}
