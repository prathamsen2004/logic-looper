import { useState, useEffect } from "react";
import { generatePuzzle } from "../utils/puzzle.js"; // ✅ Note .js extension

export default function Game({ user }) {
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  const BACKEND_URL = "http://localhost:5000"; // Change for deployment
  const isGuest = user?.guest;

  useEffect(() => { setPuzzle(generatePuzzle()); }, []);

  const fetchLeaderboard = async () => {
    if (isGuest) return;
    const res = await fetch(`${BACKEND_URL}/api/leaderboard`);
    const data = await res.json();
    setLeaderboard(data);
  };
  useEffect(fetchLeaderboard, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const correct = answer.trim() == puzzle.answer;
    setMessage(correct ? "Correct! ✅" : "Incorrect ❌");

    if (!isGuest && correct) {
      try {
        await fetch(`${BACKEND_URL}/api/solve-and-submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, score: 10 }),
        }).then(res => res.json()).then(data => setLeaderboard(data.leaderboard));
      } catch (err) { console.error(err); }
    }

    setAnswer("");
  };

  if (!puzzle) return <p className="mt-10 text-center">Loading puzzle...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <div className="mb-6 p-4 border rounded shadow bg-gray-800">
        <h2 className="text-xl font-bold mb-2">Today's Puzzle</h2>
        <p className="mb-4">{puzzle.sequence?.join?.(", ") || puzzle.pattern || puzzle.question} → ?</p>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)}
            placeholder="Your answer" className="flex-1 p-2 rounded text-black"/>
          <button type="submit" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Submit</button>
        </form>
        {message && <p className="mt-2">{message}</p>}
      </div>

      {!isGuest && (
        <div className="p-4 border rounded shadow bg-gray-800">
          <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
          {leaderboard.length === 0 ? <p>No data yet.</p> :
            <ol className="list-decimal list-inside space-y-2">
              {leaderboard.map((u, idx) => (
                <li key={idx} className={`p-2 rounded flex justify-between ${u.email===user.email?"bg-green-700":"bg-gray-700"}`}>
                  <span>{u.email}</span>
                  <span>Score: {u.score}</span>
                </li>
              ))}
            </ol>
          }
        </div>
      )}
    </div>
  );
}
