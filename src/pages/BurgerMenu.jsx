import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../components/firebase";

const BurgerMenu = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  // 🔥 Firestore Connection + Auto Default Items
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Menu"),
      async (snapshot) => {
        if (snapshot.empty) {
          const defaultItems = [
            {
              name: "Classic Cheese Burger",
              description:
                "Premium beef patty, aged cheddar, crispy lettuce and tomatoes.",
              price: 79,
              status: "available",
            },
            {
              name: "Spicy Aloo Tikki Burger",
              description:
                "House-made aloo tikki with desi masala and mint mayo.",
              price: 59,
              status: "available",
            },
            {
              name: "Chicken Tandoori Burger",
              description:
                "Juicy grilled chicken marinated in rich tandoori spices.",
              price: 149,
              status: "soldout",
            },
          ];

          for (const item of defaultItems) {
            await addDoc(collection(db, "Menu"), item);
          }
        } else {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setMenuItems(data);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // ❌ DO NOT CHANGE THIS (Your Original Cart Logic)
  const handleItemSelect = (item) => {
    if (item.status !== "available") return;

    const existingItem = selectedItems.find(
      (selected) => selected.id === item.id
    );

    if (existingItem) {
      setSelectedItems((prev) =>
        prev.map((selected) =>
          selected.id === item.id
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        )
      );
    } else {
      setSelectedItems((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedItems((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } else {
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const getSubtotal = () =>
    selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

  const getGST = () => getSubtotal() * 0.05;
  const getTotalPrice = () => getSubtotal() + getGST();
  const getTotalItems = () =>
    selectedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) {
      alert("Please add items to your cart before placing an order!");
      return;
    }

    const orderSummary = selectedItems
      .map(
        (item) =>
          `${item.name} x${item.quantity} - ₹${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const subtotal = getSubtotal();
    const gst = getGST();
    const total = getTotalPrice();

    alert(
      `Order Placed Successfully!\n\n${orderSummary}\n\nSubtotal: ₹${subtotal.toFixed(
        2
      )}\nGST (5%): ₹${gst.toFixed(
        2
      )}\nTotal: ₹${total.toFixed(
        2
      )}\n\nThank you for choosing Apna Burger Hut!`
    );

    setSelectedItems([]);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white font-sans">
      <div className="flex flex-col">

        {/* MENU SECTION */}
        <div className="flex-1">
          <section className="relative py-12 sm:py-16 md:py-20 lg:py-32 bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 relative z-10">

              <div className="text-center mb-12 sm:mb-16 md:mb-20">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-yellow-400 mb-3 sm:mb-5 font-bold drop-shadow-lg">
                  Apna Menu
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light px-4">
                  "Not Just Any Burger – It's Apna Burger Hut!"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative bg-white/5 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-500 overflow-hidden ${
                      item.status === "available"
                        ? "border-yellow-400/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-400/25 hover:border-yellow-400/40"
                        : "border-gray-600/30 opacity-60"
                    }`}
                  >
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "available"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.status === "available"
                        ? "Available"
                        : "Sold Out"}
                    </div>

                    <h3 className="text-2xl text-yellow-400 font-semibold mb-3">
                      {item.name}
                    </h3>

                    <p className="text-gray-300 mb-4">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xl text-red-400 font-bold">
                        ₹ {item.price}
                      </span>

                      {item.status === "available" ? (
                        <button
                          onClick={() => handleItemSelect(item)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-600 text-gray-400 px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                        >
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default BurgerMenu;
