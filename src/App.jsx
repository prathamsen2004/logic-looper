import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Auth from "./pages/auth";
import Game from "./pages/game";
import Leaderboard from "./pages/Leaderboard";
import { auth } from "./firebase";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  if (!user) return <Auth onLogin={setUser} isOnline={isOnline} />;

  const handleLogout = async () => {
    try { if (user?.uid) await auth.signOut(); } catch (err) { console.error(err); }
    localStorage.removeItem("todayPuzzle");
    localStorage.removeItem("lastPuzzleDate");
    localStorage.removeItem("streak");
    localStorage.removeItem("lastSolvedDate");
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="p-4 flex justify-between items-center bg-gray-800">
          <span className="font-bold text-xl">Logic Looper</span>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Game</Link>
            <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Game user={user} />} />
          <Route path="/leaderboard" element={<Leaderboard user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}
