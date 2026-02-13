// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBiw83By5Rmur1ldtr5pZZ9mJM4NiSA2Qs",
  authDomain: "logic-looper-82c90.firebaseapp.com",
  projectId: "logic-looper-82c90",
  storageBucket: "logic-looper-82c90.firebasestorage.app",
  messagingSenderId: "515625217518",
  appId: "1:515625217518:web:68ed16b41934deee2532ff",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
