import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { auth } from "./components/firebase";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/register";
import HeroSection from "./pages/HeroSection";
import BurgerHutAbout from "./pages/BurgerHutAbout";
import ReservationForm from "./pages/ReservationForm";
import BurgerMenu from "./pages/BurgerMenu";
import BurgerHutContact from "./pages/Contact";
import AdminDashboard from "./pages/adminDashboard";
import AdminRoute from "./components/AdminRoute";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";



import { CartProvider } from "./context/CartContext"; // ✅ Cart Provider

// ✅ Home Page
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <CartProvider>   {/* ✅ Wrap Entire App */}
      <Router>
        <ToastContainer
          limit={1}
          position="top-center"
          autoClose={3000}
        />

        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />



          <Route
            path="/admin"
            element={
              <AdminRoute user={user}>
                <AdminDashboard user={user} />
              </AdminRoute>
            }
          />
        </Routes>

      </Router>
    </CartProvider>
  );
}

export default App;
