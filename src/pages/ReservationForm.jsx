import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";
import { getAuth } from "firebase/auth";
import { CheckCircle, X } from "lucide-react";

/* ==============================
   🍞 CUSTOM TOAST COMPONENT
============================== */
const Toast = ({ message, subMessage, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .toast-enter { animation: slideInRight 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .toast-bar   { animation: shrink 4s linear forwards; }
      `}</style>

      <div className="toast-enter fixed top-6 right-6 z-[9999] flex items-start gap-3 bg-gray-900 border border-yellow-400/30 rounded-2xl shadow-2xl shadow-black/60 px-5 py-4 max-w-sm w-full">
        {/* Icon */}
        <div className="mt-0.5 flex-shrink-0 bg-green-500/15 rounded-full p-1.5">
          <CheckCircle size={20} className="text-green-400" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{message}</p>
          {subMessage && (
            <p className="text-gray-400 text-xs mt-0.5">{subMessage}</p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors mt-0.5"
        >
          <X size={16} />
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-[3px] bg-yellow-400/60 rounded-b-2xl toast-bar" />
      </div>
    </>
  );
};

/* ==============================
   📋 RESERVATION FORM
============================== */
const ReservationForm = () => {
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: auth.currentUser?.email || "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const user = auth.currentUser;

      if (!user) {
        setToast({ message: "Please login first", subMessage: "You must be logged in to make a reservation.", type: "error" });
        return;
      }

      const guests = formData.guests === "6" ? 6 : Number(formData.guests);
      const amount = guests * 400;

      await addDoc(collection(db, "Bookings"), {
        ...formData,
        email: user.email,
        guests,
        amount,
        status: "pending",
        paymentStatus: "pending",
        notification: "Your table reservation has been submitted successfully!",
        notificationRead: false,
        createdAt: serverTimestamp(),
      });

      setToast({
        message: "Reservation Confirmed! 🎉",
        subMessage: `Table for ${guests} on ${formData.date} at ${formData.time}`,
      });

      setFormData({
        name: "",
        email: user.email,
        phone: "",
        date: "",
        time: "",
        guests: "",
        message: "",
      });

    } catch (error) {
      console.error("Error adding booking:", error);
      setToast({ message: "Something went wrong!", subMessage: "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `
    w-full px-5 py-4 bg-white/10 border border-yellow-400/30 rounded-xl 
    text-white text-base placeholder-gray-400 font-sans
    transition-all duration-300 ease-out
    focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20
    hover:border-yellow-400/50
  `;

  const guestOptions = [
    { value: "", label: "Number of Guests" },
    { value: "1", label: "1 Guest" },
    { value: "2", label: "2 Guests" },
    { value: "3", label: "3 Guests" },
    { value: "4", label: "4 Guests" },
    { value: "5", label: "5 Guests" },
    { value: "6", label: "6+ Guests" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          subMessage={toast.subMessage}
          onClose={() => setToast(null)}
        />
      )}

      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-5 md:px-20 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-yellow-400 mb-5 font-bold">
              Reserve Your Table
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Reserve your seat and enjoy a special meal with us
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/50">
              <form onSubmit={handleSubmit} className="space-y-6">

                <input type="text" name="name" value={formData.name}
                  onChange={handleInputChange} placeholder="Your Name"
                  required className={inputClasses} />

                <input type="email" name="email" value={formData.email}
                  onChange={handleInputChange} placeholder="Email Address"
                  required className={inputClasses} />

                <input type="tel" name="phone" value={formData.phone}
                  onChange={handleInputChange} placeholder="Phone Number"
                  required className={inputClasses} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="date" name="date" value={formData.date}
                    onChange={handleInputChange} min={minDate}
                    required className={inputClasses} />

                  <input type="time" name="time" value={formData.time}
                    onChange={handleInputChange} required className={inputClasses} />
                </div>

                <select name="guests" value={formData.guests}
                  onChange={handleInputChange} required
                  className={`${inputClasses} cursor-pointer`}>
                  {guestOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>

                <textarea name="message" value={formData.message}
                  onChange={handleInputChange} placeholder="Special requests"
                  rows="4" className={`${inputClasses} resize-none`} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-5 px-8 rounded-xl font-semibold text-lg uppercase tracking-wider transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-400/40"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Reserve Now"}
                </button>

              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReservationForm;
