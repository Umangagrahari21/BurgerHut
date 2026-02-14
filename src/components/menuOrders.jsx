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

  return (
    <div className="bg-slate-900 text-white p-6 rounded-lg">

      <h2 className="text-2xl font-bold mb-6">
        🍔 Menu Orders
      </h2>

      {/* 🔸 Pending Orders */}
      <h3 className="text-yellow-400 text-xl mb-3">
        Pending Orders
      </h3>

      {pendingOrders.length === 0 && (
        <p className="mb-6">No pending orders.</p>
      )}

      {pendingOrders.map((order) => (
        <div key={order.id} className="bg-slate-800 p-4 mb-4 rounded-lg">
          <p><strong>User:</strong> {order.userEmail}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>

          <ul className="mt-2">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>

          <button
            onClick={() => confirmOrder(order.id)}
            className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            Confirm Order
          </button>
        </div>
      ))}

      {/* 🔸 Confirmed Orders */}
      <h3 className="text-green-400 text-xl mt-8 mb-3">
        Confirmed Orders
      </h3>

      {confirmedOrders.length === 0 && (
        <p>No confirmed orders.</p>
      )}

      {confirmedOrders.map((order) => (
        <div key={order.id} className="bg-slate-800 p-4 mb-4 rounded-lg">
          <p><strong>User:</strong> {order.userEmail}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>

          <ul className="mt-2">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>

          <div className="mt-4 space-x-3">
            <button
              onClick={() => archiveOrder(order.id)}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Remove from Dashboard
            </button>
          </div>
        </div>
      ))}

    </div>
  );
};

export default MenuOrders;
