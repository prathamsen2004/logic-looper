// src/App.jsx
import { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import Game from "./pages/Game";

export default function App() {
  const [user, setUser] = useState(null); // logged in user or guest
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for online/offline changes
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Simulate a small loading state (optional)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  // If user is logged in or guest → show Game
  return user ? (
    <Game user={user} />
  ) : (
    <Auth onLogin={setUser} isOnline={isOnline} />
  );
}
