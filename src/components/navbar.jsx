import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, X, Bell, CheckCheck } from "lucide-react";
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
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useCart } from "../context/CartContext";

const Navbar = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellAnimate, setBellAnimate] = useState(false);
  const prevCountRef = useRef(0);
  const notifRef = useRef(null);

  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  const displayName = user?.displayName || user?.email;

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "Bookings"),
      where("email", "==", user.email),
      where("notificationRead", "==", false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (data.length > prevCountRef.current) {
        setBellAnimate(true);
        setTimeout(() => setBellAnimate(false), 800);
      }
      prevCountRef.current = data.length;
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(sectionId);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => { toast.success("Logged out!"); navigate("/login"); setMenuOpen(false); })
      .catch(() => toast.error("Failed to logout"));
  };

  const markAsRead = async (noteId) => {
    await updateDoc(doc(db, "Bookings", noteId), { notificationRead: true });
  };

  const markAllAsRead = async () => {
    await Promise.all(notifications.map((n) => updateDoc(doc(db, "Bookings", n.id), { notificationRead: true })));
    toast.success("All notifications marked as read");
  };

  const navSections = ["home", "about", "menu", "reservations", "contact"];

  const NotificationBell = () => (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={`relative p-2 rounded-full transition-all duration-200 ${
          showNotifications ? "bg-yellow-500/20 text-yellow-300" : "text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} style={bellAnimate ? { animation: "wiggle 0.6s ease-in-out" } : {}} />
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 shadow-lg shadow-red-500/40 animate-pulse">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-yellow-500/20 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60 bg-gray-800/80">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-yellow-400" />
              <span className="text-white text-sm font-semibold">Notifications</span>
              {notifications.length > 0 && (
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full font-medium">
                  {notifications.length} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 transition-colors">
                <CheckCheck size={13} /> All read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-500">
                <Bell size={28} className="opacity-30" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((note, idx) => (
                <div
                  key={note.id}
                  className={`group flex items-start gap-3 px-4 py-3 border-b border-gray-700/40 hover:bg-gray-800/70 transition-all duration-150 cursor-pointer ${idx === 0 ? "bg-yellow-500/5" : ""}`}
                  onClick={() => markAsRead(note.id)}
                >
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 shadow-sm shadow-yellow-400/50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 leading-snug">{note.notification}</p>
                    {note.createdAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.createdAt?.toDate?.() || note.createdAt).toLocaleString([], {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); markAsRead(note.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400 flex-shrink-0 mt-0.5"
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700/40">
              <p className="text-xs text-gray-500 text-center">Click a notification to dismiss it</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="fixed top-0 w-full bg-black/95 backdrop-blur-xl border-b border-yellow-500/20 px-4 md:px-6 py-3 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <a href="#home" onClick={(e) => handleNavClick(e, "home")}
            className="font-serif text-2xl md:text-3xl font-bold text-yellow-500 flex items-center gap-2">
            🍔 Burger Hut
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              {navSections.map((section) => (
                <li key={section}>
                  <a href={`#${section}`} onClick={(e) => handleNavClick(e, section)}
                    className="text-gray-100 hover:text-yellow-500 transition-colors">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/cart" className="relative inline-flex p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-full transition-all">
                  <ShoppingCart size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                {user ? (
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <span className="text-yellow-400 text-sm truncate max-w-[120px]">{displayName}</span>
                    <button onClick={handleLogout} className="text-red-400 text-sm hover:text-red-300 transition-colors ml-1">Logout</button>
                  </div>
                ) : (
                  <Link to="/login" className="text-gray-100 hover:text-yellow-500 transition-colors">Login</Link>
                )}
              </li>
            </ul>
          </nav>

          {/* Mobile Icons */}
          <div className="flex items-center gap-1 md:hidden">
            <Link to="/cart" className="relative inline-flex p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-full transition-all">
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {user && <NotificationBell />}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-full transition-all focus:outline-none"
              aria-label="Toggle menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/98 border-t border-yellow-500/20 px-4 py-4" style={{ animation: "slideDown 0.2s ease-out" }}>
            <ul className="flex flex-col gap-1">
              {navSections.map((section) => (
                <li key={section}>
                  <a href={`#${section}`} onClick={(e) => handleNavClick(e, section)}
                    className="block text-gray-100 hover:text-yellow-500 hover:bg-yellow-500/5 transition-colors text-base py-2.5 px-3 rounded-lg">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              ))}
              <li className="border-t border-yellow-500/20 mt-2 pt-3">
                {user ? (
                  <div className="flex flex-col gap-2 px-3">
                    <span className="text-yellow-400 text-sm truncate">{displayName}</span>
                    <button onClick={handleLogout} className="text-red-400 text-sm text-left hover:text-red-300 transition-colors">Logout</button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="block text-gray-100 hover:text-yellow-500 hover:bg-yellow-500/5 py-2.5 px-3 rounded-lg transition-colors">
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
