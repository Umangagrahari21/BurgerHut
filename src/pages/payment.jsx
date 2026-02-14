import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { auth } from "../components/firebase";
import { db } from "../components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { cartItems, clearCart, getSubtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalAmount = getSubtotal();

  const handlePayment = async () => {
    if (!cartItems.length) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        await addDoc(collection(db, "Orders"), {
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
          items: cartItems,
          totalAmount,
          paymentStatus: "paid",
          orderStatus: "pending",
          paymentMethod: "demo",
          createdAt: serverTimestamp(),
        });

        clearCart();
        navigate("/order-success");
      } catch (error) {
        console.error("Payment Error:", error);
      }

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Top left burger */}
        <div className="absolute top-20 left-10 text-6xl">🍔</div>
        
        {/* Top right chat bubble */}
        <div className="absolute top-40 right-20 text-5xl">💬</div>
        
        {/* Bottom left chat bubble */}
        <div className="absolute bottom-32 left-16 text-5xl">💬</div>
        
        {/* Bottom right burger */}
        <div className="absolute bottom-20 right-16 text-6xl">🍔</div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/3 right-10 text-4xl">🍟</div>
        <div className="absolute bottom-1/2 left-20 text-4xl">🥤</div>
        <div className="absolute top-1/2 left-1/3 text-4xl">🌮</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">
            Payment
          </h1>

          {/* Order Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Order Summary
            </h2>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-5 space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-gray-300">
                  <span>
                    {item.name} <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-yellow-500">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="bg-gray-800 bg-opacity-30 rounded-xl border border-gray-700 p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💳</span>
              <div>
                <p className="text-white font-semibold">Demo Payment</p>
                <p className="text-gray-400 text-sm">Test payment gateway</p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-4 rounded-full font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            ) : (
              `Pay ₹${totalAmount}`
            )}
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            🔒 Safe and secure checkout
          </p>

          {/* Back to Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="w-full mt-4 text-gray-400 hover:text-white transition-colors py-2"
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;