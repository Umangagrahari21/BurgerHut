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
        onSubmit={handleRegister}
        className="bg-black border border-gray-800 rounded-2xl px-10 py-12 w-full max-w-md shadow-2xl relative z-10"
      >
        <h3 className="text-4xl font-bold text-center text-yellow-500 mb-10">
          Join Burger Hut
        </h3>
        
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">First name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Last name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed"
          />
        </div>

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
                Joining...
              </>
            ) : (
              "Join Now"
            )}
          </button>
        </div>

        <p className="text-sm text-center mt-6 text-gray-400">
          Already registered?{" "}
          <a href="/login" className="text-yellow-500 hover:text-yellow-400 font-semibold hover:underline">
            Login Here
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;