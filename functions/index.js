const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_GMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD",
  },
});

exports.sendBookingStatusEmail = functions.firestore
  .document("Bookings/{bookingId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only run if status changed
    if (before.status === after.status) {
      return null;
    }

    const email = after.email;
    const name = after.name;

    let subject = "";
    let message = "";

    if (after.status === "confirmed") {
      subject = "Your Table Reservation is Confirmed 🍽️";
      message = `
        Hello ${name},

        Your table has been CONFIRMED 🎉

        📅 Date: ${after.date}
        ⏰ Time: ${after.time}
        👥 Guests: ${after.guests}

        We look forward to serving you!

        - Burger Hut Team
      `;
    }

    if (after.status === "cancelled") {
      subject = "Your Reservation Has Been Cancelled ❌";
      message = `
        Hello ${name},

        Unfortunately, your reservation has been cancelled.

        📅 Date: ${after.date}
        ⏰ Time: ${after.time}

        Please contact us for more details.

        - Burger Hut Team
      `;
    }

    if (!subject) return null;

    await transporter.sendMail({
      from: "Burger Hut <YOUR_GMAIL@gmail.com>",
      to: email,
      subject: subject,
      text: message,
    });

    console.log("Email sent to:", email);

    return null;
  });
