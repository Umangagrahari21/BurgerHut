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

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow mt-12">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        🍔 Menu Manager
      </h2>

      {/* Add New Item */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) =>
            setNewItem({ ...newItem, name: e.target.value })
          }
          className="p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          className="p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) =>
            setNewItem({ ...newItem, price: e.target.value })
          }
          className="p-2 rounded bg-gray-700 text-white"
        />
      </div>

      <button
        onClick={handleAddItem}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold mb-6"
      >
        ➕ Add Item
      </button>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="p-3">{item.name}</td>
                <td className="p-3">₹ {item.price}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "available"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      toggleStatus(item.id, item.status)
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {menuItems.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManager;
