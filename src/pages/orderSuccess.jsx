import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

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
        <div className="absolute top-1/2 left-1/4 text-4xl">🌮</div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl">🍕</div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-2xl border border-gray-800 p-10 shadow-2xl text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 bg-opacity-20 rounded-full border-4 border-green-500 mb-4">
              <span className="text-6xl">✓</span>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-green-500 mb-4">
            Order Placed Successfully!
          </h1>

          <div className="text-5xl mb-6">🎉</div>

          <p className="text-gray-300 text-lg mb-8">
            Your order is being prepared and will be delivered soon.
          </p>

          {/* Order Details Card */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6 mb-8">
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="text-gray-400 text-sm">Order Status</p>
                  <p className="text-white font-semibold">Processing</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* <span className="text-2xl">🚚</span> */}
                {/* <div>
                  <p className="text-gray-400 text-sm">Estimated Delivery</p>
                  <p className="text-white font-semibold">30-45 minutes</p>
                </div> */}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-gray-400 text-sm">Confirmation</p>
                  <p className="text-white font-semibold">Sent to your email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-4 rounded-full font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Back to Home
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Thank you for ordering from Burger Hut! 🍔
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;