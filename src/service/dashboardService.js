import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";

export const listenToDashboardData = (callback) => {
  const bookingsRef = ref(db, "bookings");

  onValue(bookingsRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback({
        totalBookings: 0,
        totalRevenue: 0,
        activeReservations: 0,
        bookings: []
      });
      return;
    }

    const bookings = Object.values(data);

    const totalBookings = bookings.length;

    const totalRevenue = bookings
      .filter(b => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    const activeReservations = bookings.filter(
      b => b.status === "confirmed"
    ).length;

    callback({
      totalBookings,
      totalRevenue,
      activeReservations,
      bookings
    });
  });
};
