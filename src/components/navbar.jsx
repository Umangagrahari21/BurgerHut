import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";

const Navbar = ({ selectedItems, setSelectedItems, user }) => {
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out!");
        navigate("/login");
      })
      .catch(() => toast.error("Failed to logout"));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setSelectedItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return selectedItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  const getTotalItems = () => {
    return selectedItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const handlePlaceOrder = () => {
    if (!selectedItems || selectedItems.length === 0) return;
    
    const orderDetails = selectedItems.map(item => 
      `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`Order Placed Successfully! 🎉\n\nTotal: $${getTotalPrice().toFixed(2)}\n\nItems:\n${orderDetails}\n\nThank you for choosing Burger Hut!`);
    
    setSelectedItems([]);
    setShowCart(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-black/95 backdrop-blur-xl border-b border-yellow-500/20 px-0 py-4 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="font-serif text-3xl font-bold text-yellow-500 no-underline flex items-center gap-2.5 group"
          >
            <span className="text-2xl animate-bounce">🍔</span>
            Burger Hut
          </a>

          {/* Navigation */}
          <nav>
            <ul className="flex list-none gap-8">
              {["home", "about", "menu", "reservations", "contact"].map(section => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    onClick={(e) => handleNavClick(e, section)}
                    className="text-gray-100 no-underline font-medium relative py-1 transition-colors duration-300 hover:text-yellow-500 group"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}

              <li>
                {user ? (
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-sm text-yellow-400">{user.displayName || user.email}</span>
                    <button onClick={handleLogout} className="text-red-400 text-sm hover:underline">Logout</button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-gray-100 no-underline font-medium relative py-1 transition-colors duration-300 hover:text-yellow-500 group"
                  >
                    Login
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </li>

              <li>
                {/* <button
                  onClick={() => setShowCart(!showCart)}
                  className="text-gray-100 no-underline font-medium relative py-1 transition-colors duration-300 hover:text-yellow-500 group flex items-center gap-2"
                >
                  <div className="relative">
                    <ShoppingCart size={18} />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                        {getTotalItems()}
                      </span>
                    )}
                  </div>
                  Cart
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                </button> */}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Cart Dropdown */}
      {showCart && (
        <div className="fixed top-20 right-5 bg-gray-900/95 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 z-50 w-96 max-h-96 overflow-y-auto shadow-2xl animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-yellow-400">Your Cart</h3>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {!selectedItems || selectedItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-2">Add some delicious burgers!</p>
            </div>
          ) : (
            <>
              {selectedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full text-xs flex items-center justify-center transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-6 text-center text-white font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-green-500 hover:bg-green-400 rounded-full text-xs flex items-center justify-center transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-yellow-400">Total:</span>
                  <span className="text-lg font-bold text-yellow-400">${getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Place Order ({getTotalItems()} items)
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
