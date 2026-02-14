import { useEffect, useState } from "react";

export default function Leaderboard({ user }) {
  const [leaderboard,setLeaderboard] = useState([]);
  const BACKEND_URL = "http://localhost:5000";

  useEffect(()=>{
    const fetchLeaderboard = async ()=>{
      const res = await fetch(`${BACKEND_URL}/api/leaderboard`);
      const data = await res.json();
      setLeaderboard(data);
    };
    fetchLeaderboard();
  },[]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <ol className="list-decimal list-inside space-y-2">
        {leaderboard.map((u,idx)=>(
          <li key={idx} className={`p-2 rounded flex justify-between ${u.email===user.email?"bg-green-700":"bg-gray-700"}`}>
            <span>{u.email}</span>
            <span>Score: {u.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
