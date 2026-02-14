import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import { useCart } from "../context/CartContext";

const BurgerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart } = useCart(); // ✅ Global Cart

  // 🔥 Firestore Connection
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white font-sans">
      <div className="flex flex-col">

        {/* MENU SECTION */}
        <div className="flex-1">
          <section className="relative py-12 md:py-20 bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-20 relative z-10">

              <div className="text-center mb-16">
                <h2 className="text-5xl text-yellow-400 font-bold mb-4">
                  Apna Menu
                </h2>
                <p className="text-gray-300">
                  "Not Just Any Burger – It's Apna Burger Hut!"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white/5 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-500 ${
                      item.status === "available"
                        ? "border-yellow-400/20 hover:-translate-y-2 hover:shadow-2xl"
                        : "border-gray-600/30 opacity-60"
                    }`}
                  >
                    {/* Status Badge */}
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
                          onClick={() => addToCart(item)} // ✅ GLOBAL CART
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
