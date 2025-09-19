// src/firebase.js

// Import Firebase core
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth service

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyB3Lm9FlATKU2UEMnP2WoPmUNscXQ4xs",
  authDomain: "maker-recipe.firebaseapp.com",
  projectId: "maker-recipe",
  storageBucket: "maker-recipe.appspot.com",   // ✅ FIXED (not firebasestorage.app)
  messagingSenderId: "306842830980",
  appId: "1:306842830980:web:8b9acd0890e57a04985ad1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth so you can use it in Login/Signup
export const auth = getAuth(app);
