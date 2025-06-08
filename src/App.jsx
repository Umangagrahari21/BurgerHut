import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './App.css';
import { auth } from './components/firebase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/register';
import HeroSection from './pages/HeroSection';
import BurgerHutAbout from './pages/BurgerHutAbout';
import ReservationForm from './pages/ReservationForm';
import BurgerMenu from './pages/BurgerMenu';
import BurgerHutContact from './pages/Contact';

function HomePage({ user }) {
  return (
    <>
      <Navbar user={user} />

      <section id="home"><HeroSection /></section>
      <section id="about"><BurgerHutAbout /></section>
      <section id="menu"><BurgerMenu /></section>
      <section id="reservations"><ReservationForm /></section>
      <section id="contact"><BurgerHutContact /></section>

      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  return (
    <Router>
      <ToastContainer limit={1} position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
