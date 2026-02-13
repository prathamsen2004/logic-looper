import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";
const USER_EMAIL = "pratham@test.com";

/* -------------------- LOCAL STORAGE -------------------- */

const getData = () => {
  const data = localStorage.getItem("logicLooperData");
  if (!data)
    return {
      lastDailyDate: null,
      solved: {},
    };
  return JSON.parse(data);
};

const saveData = (data) => {
  localStorage.setItem("logicLooperData", JSON.stringify(data));
};

/* -------------------- PUZZLES -------------------- */

const generateDailyPuzzle = () => {
  const today = new Date().toISOString().split("T")[0];
  const seed = parseInt(today.replaceAll("-", ""));
  const num = seed % 20;

  return {
    type: "daily",
    question: `${num} + 7 = ?`,
    answer: (num + 7).toString(),
    date: today,
  };
};

const sequencePuzzle = {
  type: "sequence",
  question: "4, 8, 12, 16, ?",
  answer: "20",
};

const patternPuzzle = {
  type: "pattern",
  question: "Red, Blue, Green, ?",
  answer: "Red",
};

const deductionPuzzle = {
  type: "deduction",
  question: `
There are 3 houses: 1, 2, 3.
Each house has a different color: Red, Blue, Green.

Clues:
1. The green house is not the first house.
2. The red house is not next to the green house.
3. The blue house is not last.

Which house number is green?
`,
  answer: "3",
};

const binaryPuzzle = {
  type: "binary",
  question: "1 AND 0 = ?",
  answer: "0",
};

/* -------------------- COMPONENT -------------------- */

export default function Game() {
  const [view, setView] = useState("daily");
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [streak, setStreak] = useState(0);
  const [alreadySolved, setAlreadySolved] = useState(false);

  /* -------------------- FETCH STREAK FROM BACKEND -------------------- */

  const fetchStreak = () => {
    fetch(`${API_BASE}/user/${USER_EMAIL}`)
      .then((res) => res.json())
      .then((user) => {
        if (user.streak !== undefined) {
          setStreak(user.streak);
        }
      })
      .catch((err) => console.log("Fetch streak error:", err));
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  /* -------------------- LOAD PUZZLE -------------------- */

  useEffect(() => {
    const data = getData();

    let puzzle;

    if (view === "daily") puzzle = generateDailyPuzzle();
    if (view === "sequence") puzzle = sequencePuzzle;
    if (view === "pattern") puzzle = patternPuzzle;
    if (view === "deduction") puzzle = deductionPuzzle;
    if (view === "binary") puzzle = binaryPuzzle;

    setCurrentPuzzle(puzzle);
    setAnswer("");
    setResult("");

    if (view === "daily") {
      if (data.lastDailyDate === puzzle.date) {
        setAlreadySolved(true);
        setResult("✅ Daily already solved");
      } else {
        setAlreadySolved(false);
      }
    } else {
      if (data.solved[view]) {
        setAlreadySolved(true);
        setResult("✅ Already solved");
      } else {
        setAlreadySolved(false);
      }
    }
  }, [view]);

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = () => {
    if (!currentPuzzle || alreadySolved) return;

    if (answer.trim() === currentPuzzle.answer) {
      const data = getData();

      if (view === "daily") {
        fetch(`${API_BASE}/solve-daily`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: USER_EMAIL,
          }),
        })
          .then((res) => res.json())
          .then(() => {
            fetchStreak(); // 🔥 Always re-fetch from DB
          })
          .catch((err) => console.log("Daily update error:", err));

        data.lastDailyDate = currentPuzzle.date;
      } else {
        data.solved[view] = true;
      }

      saveData(data);
      setResult("✅ Correct!");
      setAlreadySolved(true);
    } else {
      setResult("❌ Wrong! Try again.");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Logic Looper</h1>

      <div className="mb-4 text-lg font-semibold">
        🔥 Streak: {streak}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {["daily", "sequence", "pattern", "deduction", "binary"].map((p) => (
          <button
            key={p}
            onClick={() => setView(p)}
            className={`px-4 py-2 rounded-lg ${
              view === p ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {currentPuzzle && (
        <div className="bg-gray-800 p-6 rounded-xl mb-4 w-full max-w-xl whitespace-pre-line">
          {currentPuzzle.question}
        </div>
      )}

      {!alreadySolved && (
        <>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="px-4 py-2 rounded-lg text-black mb-4"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </>
      )}

      {result && <div className="mt-4 text-lg">{result}</div>}
    </div>
  );
}
