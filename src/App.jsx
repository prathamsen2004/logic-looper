import {
  generatePuzzle,
  checkAnswer,
  updateStreak,
  getStreak,
  isSolvedToday
} from "./puzzle";
import { useState } from "react";


function App() {
  const puzzle = generatePuzzle();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(getStreak());
  const [solved, setSolved] = useState(isSolvedToday());



  const handleSubmit = () => {
    const isCorrect = checkAnswer(input, puzzle.answer);
    setResult(isCorrect);
    if (isCorrect)

      {
        const newStreak = updateStreak(true);
        setStreak(newStreak);
        setSolved(true);

}




  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Logic Looper 🧠</h1>

      <h3>Today's Puzzle</h3>
      <p>🔥 Current Streak: {streak} day(s)</p>

      <p style={{ fontSize: "20px" }}>
        {puzzle.sequence.join(" , ")}
      </p>

      <input
        type="number"
        value={input}
        disabled={solved}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Your answer"
      />

     <button
  onClick={handleSubmit}
  disabled={solved}
  style={{ marginLeft: "10px" }}
>
  Submit
</button>


      {result === true && <p style={{ color: "green" }}>Correct! 🎉</p>}
      {result === false && <p style={{ color: "red" }}>Wrong, try again ❌</p>}

      {solved && (
  <p style={{ color: "blue", marginTop: "10px" }}>
    ✅ Solved! Come back tomorrow 🔁
  </p>
)}



    </div>
  );
}

export default App;


