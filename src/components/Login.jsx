import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast.success("User logged in Successfully! Redirecting to home...", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear form
      setEmail("");
      setPassword("");

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.log("Login error:", error.message);
      
      // Handle specific Firebase errors
      let errorMessage = error.message;
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "Incorrect email! No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password! Please check your password and try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format! Please enter a valid email address.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled. Please contact support.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Incorrect email or password! Please check your credentials.";
      } else {
        errorMessage = "Login failed! Please check your email and password.";
      }

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-500/10 to-transparent animate-pulse"></div>
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
            `,
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
      </div>

      {/* Floating Food Icons */}
      <div className="floating-burger absolute text-4xl opacity-10 top-1/5 left-1/12 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}>
        🍔
      </div>
      <div className="floating-burger absolute text-4xl opacity-10 top-3/5 right-1/12 animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}>
        🍟
      </div>
      <div className="floating-burger absolute text-4xl opacity-10 bottom-1/5 left-1/5 animate-bounce" style={{ animationDelay: '4s', animationDuration: '6s' }}>
        🥤
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-black/40 backdrop-blur-lg border border-yellow-500/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm relative z-10 hover:shadow-yellow-500/20 transition-all duration-300"
      >
        <h3 className="text-3xl font-serif font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Welcome Back
        </h3>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2 font-medium">Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-800/30 disabled:cursor-not-allowed text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-800/30 disabled:cursor-not-allowed text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40 relative overflow-hidden group"
          >
            <span className="relative z-10">
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
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </button>
        </div>

        <p className="text-sm text-center text-gray-400">
          New user?{" "}
          <a href="/register" className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors duration-300 font-medium">
            Register Here
          </a>
        </p>

        {/* <SignInwithGoogle /> */}
      </form>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .floating-burger {
          animation: floatBurger 6s ease-in-out infinite;
        }
        
        @keyframes floatBurger {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;