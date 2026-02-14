import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "agrahariumang222005@gmail.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const loggedUser = userCredential.user;

      toast.success("Login Successful!");

      // Redirect based on email
      if (loggedUser.email === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      toast.error("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#000000'
      }}
    >
      {/* Decorative burger icons */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 text-6xl">🍔</div>
        <div className="absolute top-40 right-20 text-5xl">🍟</div>
        <div className="absolute bottom-32 left-20 text-5xl">🥤</div>
        <div className="absolute bottom-20 right-32 text-6xl">🍔</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">🍕</div>
        <div className="absolute top-1/3 right-1/3 text-5xl">🍔</div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-black border border-gray-800 rounded-2xl px-10 py-12 w-full max-w-md shadow-2xl relative z-10"
      >
        <h2 className="text-4xl font-bold text-center text-yellow-500 mb-10">
          Login to Burger Hut
        </h2>

        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-200 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-8">
          <label className="block text-white text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-200 disabled:cursor-not-allowed"
          />
        </div>

        <div className="w-full">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-bold text-lg py-3 rounded-lg transition duration-300 flex items-center justify-center shadow-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <p className="text-sm text-center mt-6 text-gray-400">
          New user?{" "}
          <Link to="/register" className="text-yellow-500 hover:text-yellow-400 font-semibold hover:underline">
            Register Here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;