import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getSubtotal,
  } = useCart();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements - burgers/food icons */}
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
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Your cart is empty.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-3 rounded-full font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
              >
                Start your order
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 bg-opacity-50 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:bg-opacity-70 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-300 text-lg">
                        ₹ {item.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-700 bg-opacity-50 rounded-lg px-3 py-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="text-white text-xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-600 rounded transition-colors"
                        >
                          -
                        </button>

                        <span className="text-white font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="text-white text-xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-600 rounded transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="text-red-400 hover:text-red-300 font-medium transition-colors ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Total:
                  </h2>
                  <h2 className="text-3xl font-bold text-yellow-500">
                    ₹ {getSubtotal()}
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/payment")}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-4 rounded-full font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Proceed to Payment
                </button>

                <p className="text-center text-gray-400 text-sm mt-4">
                  Safe and secure checkout
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
