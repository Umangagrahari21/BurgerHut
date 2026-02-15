🔧 Backend Tech Stack

Node.js

Express.js

Firebase Admin SDK

Firebase Cloud Firestore

Render (Deployment Platform)

dotenv (Environment Variable Management)

CORS Middleware

🛠 How the Backend Tech Stack Helps This Project
1️⃣ Node.js

Node.js provides a fast and scalable runtime environment for building the backend server. Since the frontend is built using JavaScript (React), using Node.js keeps the entire stack in JavaScript, making development smoother and more consistent.

It handles asynchronous operations efficiently, which is important when:

Writing orders to Firestore

Processing multiple user requests

Managing real-time data updates

2️⃣ Express.js

Express.js is used to create REST APIs for handling business logic securely.

It helps in:

Creating routes like /create-order

Validating incoming request data

Handling errors properly

Structuring backend logic cleanly

Without Express, the frontend would directly access Firestore, which is less secure. Express acts as a secure middle layer.

3️⃣ Firebase Admin SDK

Firebase Admin SDK allows secure server-side access to Firestore.

It helps in:

Writing orders securely to the database

Preventing client-side tampering

Using server timestamps

Managing privileged database operations

Unlike frontend Firebase SDK, Admin SDK bypasses security rules safely from the backend.

4️⃣ Firebase Cloud Firestore

Firestore is used as the primary database.

It provides:

Real-time data updates

Scalable NoSQL structure

Easy integration with Firebase ecosystem

Automatic syncing for admin dashboard

Collections used:

Orders

Bookings

5️⃣ Render (Backend Deployment)

Render is used to deploy the backend server online.

Benefits:

Free deployment tier

Automatic HTTPS

Environment variable support

Easy GitHub integration

Auto-redeploy on push

It allows your backend API to be accessible publicly and securely.

6️⃣ dotenv (Environment Variables)

dotenv helps manage sensitive information securely.

Used for:

Firebase service account key

Port configuration

Prevents sensitive data from being pushed to GitHub.

7️⃣ CORS Middleware

CORS allows secure communication between:
Frontend (Firebase hosted) → Backend (Render hosted)

Without CORS, browser requests would be blocked.

🔹 Frontend (Firebase Hosted)

https://burger-shop-aa7bd.web.app/

🔹 Backend API (Render)

https://burgerhut-2ro5.onrender.com/
