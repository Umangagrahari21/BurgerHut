import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { useCart } from "../context/CartContext"; // ✅ Added

const Navbar = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  // ✅ Use Global Cart
  const { getTotalItems } = useCart();

  /* ==============================
     🔔 REALTIME NOTIFICATION LISTENER
  ============================== */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "Bookings"),
      where("email", "==", user.email),
      where("notificationRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [user]);

  /* ==============================
     NAVIGATION
  ============================== */
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out!");
        navigate("/login");
      })
      .catch(() => toast.error("Failed to logout"));
  };

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-xl border-b border-yellow-500/20 px-6 py-3 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="font-serif text-3xl font-bold text-yellow-500 flex items-center gap-2"
        >
          🍔 Burger Hut
        </a>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-6">

            {["home", "about", "menu", "reservations", "contact"].map(
              (section) => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    onClick={(e) => handleNavClick(e, section)}
                    className="text-gray-100 hover:text-yellow-500"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              )
            )}

            {/* 🛒 CART ICON */}
            <li>
              <Link to="/cart" className="relative text-yellow-400">
                <ShoppingCart size={22} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </li>

            {/* USER SECTION */}
            <li>
              {user ? (
                <div className="flex items-center gap-4">

                  {/* 🔔 NOTIFICATION */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowNotifications(!showNotifications)
                      }
                      className="text-yellow-400 text-xl relative"
                    >
                      🔔
                      {notifications.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {notifications.length}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-64 bg-gray-800 text-white rounded shadow-lg p-3 z-50">
                        {notifications.length === 0 ? (
                          <p>No new notifications</p>
                        ) : (
                          notifications.map((note) => (
                            <div
                              key={note.id}
                              className="p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                              onClick={async () => {
                                await updateDoc(
                                  doc(db, "Bookings", note.id),
                                  { notificationRead: true }
                                );
                              }}
                            >
                              {note.notification}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-yellow-400 text-sm">
                    {user.email}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="text-red-400 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-100 hover:text-yellow-500"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
