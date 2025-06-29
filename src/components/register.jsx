import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("User created:", user);

      // Add user data to Firestore
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
          createdAt: new Date().toISOString(),
        });
      }

      console.log("User Registered Successfully!!");
      
      // Show success toast
      toast.success("User Registered Successfully!! Redirecting to login...", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form after successful registration
      setEmail("");
      setPassword("");
      setFname("");
      setLname("");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.log("Registration error:", error.message);
      
      // Handle specific Firebase errors
      let errorMessage = error.message;
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Already Registered! This email is already in use. Please login to continue.";
        
        // Show specific popup for already registered users
        toast.warning("Already Registered! Please login to continue.", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Optionally redirect to login after showing the message
        setTimeout(() => {
          navigate("/login");
        }, 4000);
        
        return; // Exit early to avoid showing the generic error toast
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password accounts are not enabled. Please contact support.";
      }

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
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
      <div className="floating-burger absolute text-4xl opacity-10 top-1/6 left-1/12 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}>
        🍕
      </div>
      <div className="floating-burger absolute text-4xl opacity-10 top-2/3 right-1/12 animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}>
        🌮
      </div>
      <div className="floating-burger absolute text-4xl opacity-10 bottom-1/6 left-1/6 animate-bounce" style={{ animationDelay: '4s', animationDuration: '6s' }}>
        🍰
      </div>
      <div className="floating-burger absolute text-3xl opacity-10 top-1/3 right-1/5 animate-bounce" style={{ animationDelay: '1s', animationDuration: '6s' }}>
        🥗
      </div>

      <form
        onSubmit={handleRegister}
        className="bg-black/40 backdrop-blur-lg border border-yellow-500/20 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 hover:shadow-yellow-500/20 transition-all duration-300"
      >
        <h3 className="text-3xl font-serif font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Join Burger Hut
        </h3>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2 font-medium">First name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-800/30 disabled:cursor-not-allowed text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2 font-medium">Last name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-800/30 disabled:cursor-not-allowed text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

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
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-800/30 disabled:cursor-not-allowed text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div className="w-full mb-6">
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
                  Signing Up...
                </>
              ) : (
                "Join Now"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </button>
        </div>

        <p className="text-sm text-center text-gray-400">
          Already registered?{" "}
          <a href="/login" className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors duration-300 font-medium">
            Login Here
          </a>
        </p>
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

export default Register;