// src/puzzle.js

// Get today's date as YYYY-MM-DD
export function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Generate daily puzzle
export function generatePuzzle() {
  const today = getTodayDate();
  const lastDate = localStorage.getItem("lastPuzzleDate");

  if (lastDate === today) {
    // Return same puzzle as today
    const puzzle = JSON.parse(localStorage.getItem("todayPuzzle"));
    return puzzle;
  } else {
    // Generate new puzzle (example: multiples of random number)
    const start = Math.floor(Math.random() * 10) + 1;
    const sequence = Array.from({ length: 4 }, (_, i) => start * (i + 1));
    const answer = start * 5; // next number
    const puzzle = { sequence, answer };

    // Save to localStorage
    localStorage.setItem("todayPuzzle", JSON.stringify(puzzle));
    localStorage.setItem("lastPuzzleDate", today);

    return puzzle;
  }
}

// Get current streak
export function getStreak() {
  const streak = parseInt(localStorage.getItem("streak")) || 0;
  const lastSolved = localStorage.getItem("lastSolvedDate");
  const today = getTodayDate();

  // Reset streak if last solved was before yesterday
  if (lastSolved && lastSolved !== today && new Date(lastSolved) < new Date(today)) {
    return streak;
  }
  return streak;
}

// Update streak
export function updateStreak(correct) {
  const today = getTodayDate();
  let streak = parseInt(localStorage.getItem("streak")) || 0;

  if (correct) {
    const lastSolved = localStorage.getItem("lastSolvedDate");
    if (lastSolved !== today) {
      streak += 1;
      localStorage.setItem("streak", streak);
      localStorage.setItem("lastSolvedDate", today);
    }
  }
  return streak;
}

// Check if solved today
export function isSolvedToday() {
  return localStorage.getItem("lastSolvedDate") === getTodayDate();
}
