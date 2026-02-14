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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      {/* 🔙 Go Home Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold"
        >
          ← Go to Home Page
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* 📊 Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-gray-400">Total Bookings</h3>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </div>

        <div className="bg-green-800/30 p-6 rounded-xl shadow">
          <h3 className="text-gray-400">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-400">
            ₹{stats.totalRevenue}
          </p>
        </div>

        <div className="bg-blue-800/30 p-6 rounded-xl shadow">
          <h3 className="text-gray-400">Confirmed</h3>
          <p className="text-2xl font-bold text-blue-400">
            {stats.activeReservations}
          </p>
        </div>

        <div className="bg-yellow-800/30 p-6 rounded-xl shadow">
          <h3 className="text-gray-400">Pending</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {stats.pendingReservations}
          </p>
        </div>
      </div>

      {/* 📈 Weekly Chart */}
      <WeeklyBookingChart bookings={bookings} />

      {/* 📋 Bookings Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow mt-10">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Guests</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-700">
                <td className="p-3">{booking.name}</td>
                <td className="p-3">{booking.date}</td>
                <td className="p-3">{booking.time}</td>
                <td className="p-3">{booking.guests}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : booking.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.paymentStatus === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>

                <td className="p-3">₹{booking.amount}</td>

                <td className="p-3 space-x-2">
                  {booking.status === "pending" && (
                    <button
                      onClick={() =>
                        updateStatus(booking.id, "confirmed")
                      }
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      Confirm
                    </button>
                  )}

                  {booking.paymentStatus !== "paid" &&
                    booking.status === "confirmed" && (
                      <button
                        onClick={() =>
                          updatePayment(booking.id)
                        }
                        className="bg-blue-600 px-3 py-1 rounded"
                      >
                        Mark Paid
                      </button>
                    )}

                  {(booking.status === "pending" ||
                    booking.status === "confirmed") && (
                    <button
                      onClick={() =>
                        updateStatus(booking.id, "cancelled")
                      }
                      className="bg-red-600 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🍽️ Menu Manager */}
      <div className="mt-12">
        <MenuManager />
      </div>

      {/* 🍽️ Menu Order */}
      <div className="mt-12">
        <MenuOrders />
      </div>

    </div>
  );
};

export default AdminDashboard;
