// src/pages/Auth.jsx
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBiw83By5Rmur1ldtr5pZZ9mJM4NiSA2Qs",
  authDomain: "logic-looper-82c90.firebaseapp.com",
  projectId: "logic-looper-82c90",
  storageBucket: "logic-looper-82c90.firebasestorage.app",
  messagingSenderId: "515625217518",
  appId: "1:515625217518:web:68ed16b41934deee2532ff",
  measurementId: "G-V2NGQG5NE4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default function Auth({ onLogin }) {
  const [user, setUser] = useState(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Listen for online/offline
    const handleOnlineStatus = () => setOffline(!navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        onLogin && onLogin(currentUser);
      }
    });

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      setUser(currentUser);
      onLogin && onLogin(currentUser);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check your internet connection.");
    }
  };

  const continueAsGuest = () => {
    const guestUser = { displayName: "Guest", guest: true };
    setUser(guestUser);
    onLogin && onLogin(guestUser);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="text-yellow-400 font-extrabold text-5xl">🧠</div>
        <div className="text-2xl font-bold mt-2 tracking-widest">
          LOGIC LOOPER
        </div>
      </div>

      {/* Google Login */}
      {!offline && !user && (
        <button
          onClick={loginWithGoogle}
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition mb-4"
        >
          Login with Google
        </button>
      )}

      {/* Guest Button */}
      <button
        onClick={continueAsGuest}
        disabled={!offline}
        className={`px-6 py-3 rounded-lg font-bold mb-2 transition
          ${offline ? "bg-green-600 text-black" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Continue as Guest
      </button>

      {!offline && (
        <p className="text-gray-300 text-sm mt-2">
          Guest mode available only when offline
        </p>
      )}

      {/* Welcome message */}
      {user && (
        <div className="text-center mt-4">
          Welcome, <span className="font-semibold">{user.displayName}</span>!
        </div>
      )}
    </div>
  );
}
