import React, { useState } from 'react';

const BurgerMenu = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const menuItems = [
    {
      id: 1,
      name: "Classic Cheese Burger",
      description: "Premium beef patty, aged cheddar, crispy lettuce, vine-ripened tomatoes, and our signature crown sauce on a brioche bun.",
      price: 79,
      delay: "delay-100",
      available: true
    },
    {
      id: 2,
      name: "Spicy Aloo Tikki Burger",
      description: "House-made veggie patty with quinoa and black beans, avocado, sprouts, sun-dried tomatoes, and herbed aioli.",
      price: 59,
      delay: "delay-200",
      available: true
    },
    {
      id: 3,
      name: "Double Patty Blast",
      description: "Two grilled patties, double the cheese, and double the fun Loaded with grilled veggies, lettuce, jalapeños!",
      price: 69,
      delay: "delay-300",
      available: true
    },
    {
      id: 4,
      name: "Paneer Makhani Burger",
      description: "Crispy aloo tikki, desi masala, onions, and tangy chutney – full-on desi feel!",
      price: 99,
      delay: "delay-500",
      available: true
    },
    {
      id: 5,
      name: "Chicken Tandoori Burger",
      description: "Juicy grilled chicken marinated in rich tandoori spices, tucked in a soft bun.",
      price: 149,
      delay: "delay-700",
      available: false
    },
    {
      id: 6,
      name: "Veggie Overload Burger",
      description: "Smoky tandoori-marinated aloo patty with mint mayo and onions.",
      price: 89,
      delay: "delay-1000",
      available: false
    }
  ];

  const handleItemSelect = (item) => {
    if (!item.available) return;
    
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    if (existingItem) {
      setSelectedItems(prev => 
        prev.map(selected => 
          selected.id === item.id 
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        )
      );
    } else {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedItems(prev => prev.filter(item => item.id !== id));
    } else {
      setSelectedItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getGST = () => {
    return getSubtotal() * 0.05; // 5% GST
  };

  const getTotalPrice = () => {
    return getSubtotal() + getGST();
  };

  const getTotalItems = () => {
    return selectedItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) {
      alert('Please add items to your cart before placing an order!');
      return;
    }
    
    const orderSummary = selectedItems.map(item => 
      `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const subtotal = getSubtotal();
    const gst = getGST();
    const total = getTotalPrice();
    
    alert(`Order Placed Successfully!\n\n${orderSummary}\n\nSubtotal: ₹${subtotal.toFixed(2)}\nGST (5%): ₹${gst.toFixed(2)}\nTotal: ₹${total.toFixed(2)}\n\nThank you for choosing Apna Burger Hut!`);
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white font-sans">
      <div className="flex">
        {/* Main Menu Section */}
        <div className="flex-1">
          <section className="relative py-20 md:py-32 bg-gray-900 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="container mx-auto px-5 md:px-20 relative z-10">
              {/* Section Title */}
              <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
                <h2 className="font-serif text-4xl md:text-6xl text-yellow-400 mb-5 font-bold drop-shadow-lg">
                  Apna Menu
                </h2>
                <p className="text-lg md:text-xl text-gray-300 font-light">
                  "Not Just Any Burger – It's Apna Burger Hut!"
                </p>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative bg-white/5 backdrop-blur-lg border rounded-3xl p-6 md:p-8 
                      transition-all duration-500 ease-out overflow-hidden animate-slide-in-up ${item.delay}
                      ${item.available 
                        ? 'border-yellow-400/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-400/25 hover:border-yellow-400/40' 
                        : 'border-gray-600/30 opacity-60'
                      }`}
                  >
                    {/* Availability Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
                      ${item.available ? 'bg-green-500/20 text-green-400 border border-green-400/30' : 'bg-red-500/20 text-red-400 border border-red-400/30'}`}>
                      {item.available ? 'Available' : 'Sold Out'}
                    </div>

                    {/* Hover Effect Overlay */}
                    {item.available && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent 
                        transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                    )}
                    
                    <div className="relative z-10">
                      <h3 className={`font-serif text-xl md:text-2xl mb-4 font-semibold transition-colors duration-300
                        ${item.available 
                          ? 'text-yellow-400 group-hover:text-yellow-300' 
                          : 'text-gray-500'
                        }`}>
                        {item.name}
                      </h3>
                      
                      <p className={`leading-relaxed mb-6 text-sm md:text-base transition-colors duration-300
                        ${item.available 
                          ? 'text-gray-300 group-hover:text-gray-200' 
                          : 'text-gray-500'
                        }`}>
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className={`text-xl md:text-2xl font-semibold transition-all duration-300
                          ${item.available 
                            ? 'text-red-500 group-hover:text-red-400 group-hover:scale-105' 
                            : 'text-gray-500'
                          }`}>
                          <span className="text-base opacity-70 mr-1">₹</span>
                          {item.price}
                        </div>
                        
                        {item.available ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemSelect(item);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-600 text-gray-400 px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
                          >
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Cart Section */}
        <div className="w-80 p-4 flex items-center justify-center">
          <div className="bg-gray-800/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-2xl max-h-[600px] overflow-y-auto w-full">
            <div className="mb-4">
              <h3 className="text-xl font-serif text-yellow-400 mb-2 font-bold">Your Cart</h3>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-3">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Your cart is empty</p>
                <p className="text-gray-500 text-xs mt-1">Add some delicious burgers!</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="bg-white/5 rounded-xl p-3 border border-gray-700/30">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-yellow-400 font-semibold text-xs leading-tight">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors duration-200 text-xs"
                          >
                            -
                          </button>
                          <span className="text-white font-semibold w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-black transition-colors duration-200 text-xs"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-red-400 font-semibold text-sm">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-gray-400 text-xs">
                            ₹{item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-700/50 pt-4 space-y-3">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-lg p-3 border border-yellow-400/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Subtotal:</span>
                      <span className="text-white font-semibold text-sm">₹{getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">GST (5%):</span>
                      <span className="text-orange-400 font-semibold text-sm">₹{getGST().toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-600/50 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-400 font-semibold text-sm">Total:</span>
                        <span className="text-yellow-400 font-bold text-lg">₹{getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-400 hover:to-red-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                  >
                    Place Order 🍔
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default BurgerMenu;