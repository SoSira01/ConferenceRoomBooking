// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBP64Ja17_GgoOyWcwIAJnZQUYkMIWvzUQ",
  authDomain: "booking-conference-room.firebaseapp.com",
  projectId: "booking-conference-room",
  databaseURL: "https://booking-conference-room-default-rtdb.asia-southeast1.firebasedatabase.app", // Updated URL
  storageBucket: "booking-conference-room.appspot.com",
  messagingSenderId: "461189927227",
  appId: "1:461189927227:web:caa0b52c1576c64cffe71e",
  measurementId: "G-R3G3V846LC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
