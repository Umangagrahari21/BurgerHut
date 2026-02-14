import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../components/firebase";
import { useNavigate } from "react-router-dom";
import WeeklyBookingChart from "../components/WeeklyBookingChart";
import MenuManager from "../components/menuManager";
import MenuOrders from "../components/MenuOrders";


const AdminDashboard = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeReservations: 0,
    pendingReservations: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [hiddenBookings, setHiddenBookings] = useState([]);

  // 🔥 Real-time listener (sorted latest first)
  useEffect(() => {
    const q = query(
      collection(db, "Bookings"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(bookingData);

      // 📊 Stats calculation
      const totalBookings = bookingData.length;

      const totalRevenue = bookingData
        .filter((b) => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + Number(b.amount || 0), 0);

      const activeReservations = bookingData.filter(
        (b) => b.status === "confirmed"
      ).length;

      const pendingReservations = bookingData.filter(
        (b) => b.status === "pending"
      ).length;

      setStats({
        totalBookings,
        totalRevenue,
        activeReservations,
        pendingReservations,
      });
    });

    return () => unsubscribe();
  }, []);

  // ✅ Update booking status
  const updateStatus = async (id, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
        notification:
          newStatus === "confirmed"
            ? "Your table has been confirmed 🎉"
            : "Your reservation has been cancelled ❌",
        notificationRead: false,
      };

      // 🔥 Store confirmation timestamp
      if (newStatus === "confirmed") {
        updateData.confirmedAt = serverTimestamp();
      }

      await updateDoc(doc(db, "Bookings", id), updateData);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ✅ Update payment
  const updatePayment = async (id) => {
    try {
      await updateDoc(doc(db, "Bookings", id), {
        paymentStatus: "paid",
      });
    } catch (error) {
      console.error("Payment update failed:", error);
    }
  };

  // 🗑️ Hide booking from dashboard (doesn't delete from database)
  const hideBooking = (id) => {
    setHiddenBookings([...hiddenBookings, id]);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    // Exclude hidden bookings
    if (hiddenBookings.includes(booking.id)) return false;
    
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.date.includes(searchTerm) ||
                         booking.time.includes(searchTerm);
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const inputClasses = `
    px-4 py-2 bg-white/10 border border-yellow-400/30 rounded-xl 
    text-white text-sm placeholder-gray-400
    transition-all duration-300 ease-out
    focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20
    hover:border-yellow-400/50
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">

      {/* 🔙 Go Home Button - Animated */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <button
          onClick={() => navigate("/")}
          className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-400/40 active:scale-95"
        >
          <span className="inline-flex items-center gap-2">
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Go to Home Page
          </span>
        </button>
        
        {/* Live indicator */}
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-yellow-400/30 px-4 py-2 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">Live Updates</span>
        </div>
      </div>

      {/* Header with animation */}
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-yellow-400 mb-2 font-bold">
          Admin Dashboard
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Manage your restaurant reservations and orders
        </p>
      </div>

      {/* 📊 Stats Section - Interactive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <div className="group bg-white/5 backdrop-blur-2xl border border-yellow-400/30 p-6 rounded-3xl shadow-2xl shadow-black/50 hover:border-yellow-400/50 hover:shadow-yellow-400/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-medium">Total Bookings</h3>
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">📅</div>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-white">{stats.totalBookings}</p>
          <div className="mt-2 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>

        <div className="group bg-white/5 backdrop-blur-2xl border border-yellow-400/30 p-6 rounded-3xl shadow-2xl shadow-black/50 hover:border-green-500/50 hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-medium">Total Revenue</h3>
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">💰</div>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-green-400">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <div className="mt-2 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>

        <div className="group bg-white/5 backdrop-blur-2xl border border-yellow-400/30 p-6 rounded-3xl shadow-2xl shadow-black/50 hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-medium">Confirmed</h3>
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">✅</div>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-blue-400">
            {stats.activeReservations}
          </p>
          <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>

        <div className="group bg-white/5 backdrop-blur-2xl border border-yellow-400/30 p-6 rounded-3xl shadow-2xl shadow-black/50 hover:border-yellow-500/50 hover:shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-medium">Pending</h3>
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">⏳</div>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-yellow-400">
            {stats.pendingReservations}
          </p>
          <div className="mt-2 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>
      </div>

      {/* 📈 Weekly Chart - Animated Container */}
      <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-4 md:p-6 shadow-2xl shadow-black/50 mb-10 hover:border-yellow-400/50 transition-all duration-300">
        <WeeklyBookingChart bookings={bookings} />
      </div>

      {/* 📋 Bookings Table - Enhanced Interactive */}
      <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 hover:border-yellow-400/50 transition-all duration-300">
        {/* Header with Search and Filter */}
        <div className="bg-white/5 backdrop-blur-xl px-4 md:px-6 py-4 border-b border-yellow-400/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-yellow-400 flex items-center gap-2">
              <span>🎫</span> Reservations
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredBookings.length})
              </span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, date, time..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${inputClasses} w-full sm:w-64 pl-10`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
              
              {/* Filter Dropdown */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`${inputClasses} cursor-pointer`}
              >
                <option value="all" className="bg-gray-800 text-white">All Status</option>
                <option value="pending" className="bg-gray-800 text-white">Pending</option>
                <option value="confirmed" className="bg-gray-800 text-white">Confirmed</option>
                <option value="cancelled" className="bg-gray-800 text-white">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 sticky top-0">
              <tr>
                <th className="p-3 md:p-4 text-left text-gray-300 font-semibold text-sm">Name</th>
                <th className="p-3 md:p-4 text-left text-gray-300 font-semibold text-sm">Date</th>
                <th className="p-3 md:p-4 text-left text-gray-300 font-semibold text-sm">Time</th>
                <th className="p-3 md:p-4 text-left text-gray-300 font-semibold text-sm">Guests</th>
                <th className="p-3 md:p-4 text-left text-gray-300 font-semibold text-sm">Status</th>
                <th className="p-3 md:p-4 text-left text-gray-300 font-semibold text-sm">Payment</th>
                <th className="p-3 md:p-4 text-left text-gray-300 font-semibold text-sm">Amount</th>
                <th className="p-3 md:p-4 text-left text-gray-300 font-semibold text-sm">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr 
                    key={booking.id} 
                    className={`border-b border-yellow-400/10 hover:bg-white/5 transition-all duration-200 animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-3 md:p-4 text-white font-medium">{booking.name}</td>
                    <td className="p-3 md:p-4 text-gray-300 text-sm">{booking.date}</td>
                    <td className="p-3 md:p-4 text-gray-300 text-sm">{booking.time}</td>
                    <td className="p-3 md:p-4 text-gray-300 text-sm">
                      <span className="inline-flex items-center gap-1 bg-white/10 border border-yellow-400/20 px-2 py-1 rounded-lg">
                        <span>👥</span>
                        {booking.guests}
                      </span>
                    </td>

                    <td className="p-3 md:p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 ${
                          booking.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/30"
                            : booking.status === "confirmed"
                            ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                        }`}
                      >
                        {booking.status === "pending" && "⏳ "}
                        {booking.status === "confirmed" && "✅ "}
                        {booking.status === "cancelled" && "❌ "}
                        {booking.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 md:p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
                            : "bg-gray-600/30 text-gray-400 border border-gray-600/40 hover:bg-gray-600/40"
                        }`}
                      >
                        {booking.paymentStatus === "paid" ? "💰 PAID" : "⏳ PENDING"}
                      </span>
                    </td>

                    <td className="p-3 md:p-4 font-bold text-white text-sm">₹{booking.amount}</td>

                    <td className="p-3 md:p-4">
                      <div className="flex flex-wrap gap-2">
                        {booking.status === "pending" && (
                          <button
                            onClick={() => updateStatus(booking.id, "confirmed")}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                          >
                            ✅ Confirm
                          </button>
                        )}

                        {booking.paymentStatus !== "paid" &&
                          booking.status === "confirmed" && (
                            <button
                              onClick={() => updatePayment(booking.id)}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                            >
                              💵 Mark Paid
                            </button>
                          )}

                        {(booking.status === "pending" ||
                          booking.status === "confirmed") && (
                          <button
                            onClick={() => updateStatus(booking.id, "cancelled")}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                          >
                            ❌ Cancel
                          </button>
                        )}

                        <button
                          onClick={() => hideBooking(booking.id)}
                          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                          title="Remove from dashboard view"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">🔍</span>
                      <p className="text-lg font-medium">No bookings found</p>
                      <p className="text-sm">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🍽️ Menu Manager - Interactive Container */}
      <div className="mt-12 bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-4 md:p-6 shadow-2xl shadow-black/50 hover:border-yellow-400/50 transition-all duration-300">
        <MenuManager />
      </div>

      {/* 🍽️ Menu Order - Interactive Container */}
      <div className="mt-12 bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-4 md:p-6 shadow-2xl shadow-black/50 hover:border-yellow-400/50 transition-all duration-300 mb-8">
        <MenuOrders />
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>

    </div>
  );
};

export default AdminDashboard;
