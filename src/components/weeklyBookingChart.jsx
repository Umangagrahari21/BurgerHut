import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const WeeklyBookingChart = ({ bookings }) => {
  const weeklyData = useMemo(() => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const formatted = d.toISOString().split("T")[0];

      const dayBookings = bookings.filter(
        (b) => b.date === formatted
      );

      last7Days.push({
        date: formatted.slice(5), // show only MM-DD
        confirmed: dayBookings.filter(
          (b) => b.status === "confirmed"
        ).length,
        cancelled: dayBookings.filter(
          (b) => b.status === "cancelled"
        ).length,
        pending: dayBookings.filter(
          (b) => b.status === "pending"
        ).length,
      });
    }

    return last7Days;
  }, [bookings]);

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Weekly Booking Analysis
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="confirmed" fill="#16a34a" />
          <Bar dataKey="pending" fill="#eab308" />
          <Bar dataKey="cancelled" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyBookingChart;
