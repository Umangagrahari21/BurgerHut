import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

const MenuOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const q = query(
      collection(db, "Orders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Confirm Order
  const confirmOrder = async (id) => {
    await updateDoc(doc(db, "Orders", id), {
      orderStatus: "confirmed",
    });
  };

  // ✅ Archive Order (Soft Delete)
  const archiveOrder = async (id) => {
    await updateDoc(doc(db, "Orders", id), {
      orderStatus: "archived",
    });
  };

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending"
  );

  const confirmedOrders = orders.filter(
    (order) => order.orderStatus === "confirmed"
  );

  // Filter orders based on search
  const filterOrders = (ordersList) => {
    return ordersList.filter((order) => {
      const matchesSearch = order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.totalAmount.toString().includes(searchTerm);
      return matchesSearch;
    });
  };

  const filteredPendingOrders = filterOrders(pendingOrders);
  const filteredConfirmedOrders = filterOrders(confirmedOrders);

  const displayOrders = filterStatus === "all" 
    ? [...filteredPendingOrders, ...filteredConfirmedOrders]
    : filterStatus === "pending" 
    ? filteredPendingOrders 
    : filteredConfirmedOrders;

  const inputClasses = `
    px-4 py-2 bg-white/10 border border-yellow-400/30 rounded-xl 
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
          <span>🍔</span> Menu Orders
        </h2>
        <p className="text-gray-300">Manage and track all customer orders</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 p-4 rounded-2xl shadow-lg hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-yellow-500/30 p-4 rounded-2xl shadow-lg hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏳</span>
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-green-500/30 p-4 rounded-2xl shadow-lg hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="text-gray-400 text-sm">Confirmed Orders</p>
              <p className="text-2xl font-bold text-green-400">{confirmedOrders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-4 md:p-6 shadow-2xl shadow-black/50 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by email or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClasses} w-full pl-10`}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          
          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`${inputClasses} cursor-pointer w-full sm:w-48`}
          >
            <option value="all" className="bg-gray-800 text-white">All Orders</option>
            <option value="pending" className="bg-gray-800 text-white">Pending Only</option>
            <option value="confirmed" className="bg-gray-800 text-white">Confirmed Only</option>
          </select>
        </div>
      </div>

      {/* Orders Display */}
      {filterStatus === "all" || filterStatus === "pending" ? (
        <>
          {/* 🔸 Pending Orders */}
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span>⏳</span> Pending Orders
              <span className="text-sm font-normal text-gray-400 ml-2">({filteredPendingOrders.length})</span>
            </h3>

            {filteredPendingOrders.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-8 text-center shadow-2xl shadow-black/50">
                <span className="text-4xl mb-3 block">📭</span>
                <p className="text-gray-400">No pending orders at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPendingOrders.map((order, index) => (
                  <div 
                    key={order.id} 
                    className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-6 shadow-2xl shadow-black/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-[1.01] animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">👤</span>
                          <div>
                            <p className="text-white font-semibold">{order.userEmail}</p>
                            <p className="text-gray-400 text-sm">Order ID: {order.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-3 mt-3">
                          <p className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
                            <span>🍽️</span> Order Items:
                          </p>
                          <ul className="space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index} className="text-gray-400 text-sm flex items-center gap-2">
                                <span className="text-yellow-400">•</span>
                                <span className="text-white font-medium">{item.name}</span>
                                <span className="text-gray-500">×</span>
                                <span className="text-yellow-400 font-bold">{item.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-2xl">💰</span>
                          <span className="text-gray-400">Total:</span>
                          <span className="text-2xl font-bold text-green-400">₹{order.totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => confirmOrder(order.id)}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                        >
                          ✅ Confirm Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}

      {filterStatus === "all" || filterStatus === "confirmed" ? (
        <>
          {/* 🔸 Confirmed Orders */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>✅</span> Confirmed Orders
              <span className="text-sm font-normal text-gray-400 ml-2">({filteredConfirmedOrders.length})</span>
            </h3>

            {filteredConfirmedOrders.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-2xl border border-green-400/30 rounded-3xl p-8 text-center shadow-2xl shadow-black/50">
                <span className="text-4xl mb-3 block">✨</span>
                <p className="text-gray-400">No confirmed orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConfirmedOrders.map((order, index) => (
                  <div 
                    key={order.id} 
                    className="bg-white/5 backdrop-blur-2xl border border-green-400/30 rounded-3xl p-6 shadow-2xl shadow-black/50 hover:border-green-400/50 transition-all duration-300 hover:scale-[1.01] animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">👤</span>
                          <div>
                            <p className="text-white font-semibold">{order.userEmail}</p>
                            <p className="text-gray-400 text-sm">Order ID: {order.id.slice(0, 8)}...</p>
                            <span className="inline-block mt-1 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/40 rounded-lg text-xs font-bold">
                              ✅ CONFIRMED
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-3 mt-3">
                          <p className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
                            <span>🍽️</span> Order Items:
                          </p>
                          <ul className="space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index} className="text-gray-400 text-sm flex items-center gap-2">
                                <span className="text-green-400">•</span>
                                <span className="text-white font-medium">{item.name}</span>
                                <span className="text-gray-500">×</span>
                                <span className="text-green-400 font-bold">{item.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-2xl">💰</span>
                          <span className="text-gray-400">Total:</span>
                          <span className="text-2xl font-bold text-green-400">₹{order.totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => archiveOrder(order.id)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                        >
                          🗑️ Remove from Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}

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

export default MenuOrders;
