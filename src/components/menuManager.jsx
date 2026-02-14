import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 🔥 Real-time menu listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Menu"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(data);
    });

    return () => unsubscribe();
  }, []);

  // ➕ Add Item
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      alert("Name and price are required");
      return;
    }

    await addDoc(collection(db, "Menu"), {
      name: newItem.name,
      description: newItem.description,
      price: Number(newItem.price),
      status: "available",
    });

    setNewItem({ name: "", description: "", price: "" });
  };

  // 🔄 Toggle Available / Soldout
  const toggleStatus = async (id, currentStatus) => {
    await updateDoc(doc(db, "Menu", id), {
      status: currentStatus === "available" ? "soldout" : "available",
    });
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "Menu", id));
  };

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const inputClasses = `
    w-full px-4 py-3 bg-white/10 border border-yellow-400/30 rounded-xl 
    text-white text-sm placeholder-gray-400
    transition-all duration-300 ease-out
    focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20
    hover:border-yellow-400/50
  `;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-yellow-400 mb-2 flex items-center gap-2">
          <span>🍔</span> Menu Manager
        </h2>
        <p className="text-gray-300">Add, edit, and manage your restaurant menu items</p>
      </div>

      {/* Add New Item Section */}
      <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 mb-8 hover:border-yellow-400/50 transition-all duration-300">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>➕</span> Add New Item
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) =>
              setNewItem({ ...newItem, name: e.target.value })
            }
            className={inputClasses}
          />

          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            className={inputClasses}
          />

          <input
            type="number"
            placeholder="Price (₹)"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: e.target.value })
            }
            className={inputClasses}
          />
        </div>

        <button
          onClick={handleAddItem}
          className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-400/40 active:scale-95"
        >
          ➕ Add Item to Menu
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-4 md:p-6 shadow-2xl shadow-black/50 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-2xl">📊</span>
            <span className="font-semibold">
              Total Items: <span className="text-yellow-400">{filteredItems.length}</span>
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClasses} w-full sm:w-64 pl-10`}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            
            {/* Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`${inputClasses} cursor-pointer`}
            >
              <option value="all" className="bg-gray-800 text-white">All Items</option>
              <option value="available" className="bg-gray-800 text-white">Available</option>
              <option value="soldout" className="bg-gray-800 text-white">Sold Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 hover:border-yellow-400/50 transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 sticky top-0">
              <tr>
                <th className="p-4 text-left text-gray-300 font-semibold text-sm">Item Name</th>
                <th className="p-4 text-left text-gray-300 font-semibold text-sm">Description</th>
                <th className="p-4 text-left text-gray-300 font-semibold text-sm">Price</th>
                <th className="p-4 text-left text-gray-300 font-semibold text-sm">Status</th>
                <th className="p-4 text-left text-gray-300 font-semibold text-sm">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="border-b border-yellow-400/10 hover:bg-white/5 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4 text-white font-medium">{item.name}</td>
                    <td className="p-4 text-gray-300 text-sm">
                      {item.description || <span className="text-gray-500 italic">No description</span>}
                    </td>
                    <td className="p-4 text-white font-bold">₹ {item.price}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 ${
                          item.status === "available"
                            ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                        }`}
                      >
                        {item.status === "available" ? "✅ AVAILABLE" : "❌ SOLD OUT"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleStatus(item.id, item.status)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-xl font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                        >
                          🔄 Toggle Status
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-xl font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">🍽️</span>
                      <p className="text-lg font-medium">No menu items found</p>
                      <p className="text-sm">Try adjusting your search or add new items</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-white/5 backdrop-blur-2xl border border-green-500/30 p-4 rounded-2xl shadow-lg hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="text-gray-400 text-sm">Available Items</p>
              <p className="text-2xl font-bold text-green-400">
                {menuItems.filter(item => item.status === "available").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-2xl border border-red-500/30 p-4 rounded-2xl shadow-lg hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl">❌</span>
            <div>
              <p className="text-gray-400 text-sm">Sold Out Items</p>
              <p className="text-2xl font-bold text-red-400">
                {menuItems.filter(item => item.status === "soldout").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MenuManager;
