require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Firebase Admin Setup
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 🟢 Create Order API
app.post("/create-order", async (req, res) => {
  try {
    const { userId, userEmail, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderRef = await db.collection("Orders").add({
      userId,
      userEmail,
      items,
      totalAmount,
      paymentStatus: "paid",
      orderStatus: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      orderId: orderRef.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
