// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoeKkaDgEvrkljkbH_CZWBArtOvJ5OGaI",
  authDomain: "burger-shop-aa7bd.firebaseapp.com",
  projectId: "burger-shop-aa7bd",
  storageBucket: "burger-shop-aa7bd.firebasestorage.app",
  messagingSenderId: "585712538475",
  appId: "1:585712538475:web:c645596079b74fbfd4322e",
  measurementId: "G-P8RQ40MB40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db = getFirestore(app);
export default app;