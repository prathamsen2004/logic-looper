// Get today's date as seed
export function getTodaySeed() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Generate a simple sequence puzzle
export function generatePuzzle() {
  const seed = getTodaySeed();

  // Simple deterministic numbers based on date
  const base = seed.charCodeAt(seed.length - 1) % 5 + 2;

  const sequence = [
    base * 1,
    base * 2,
    base * 3,
    base * 4,
    "?"
  ];

  const answer = base * 5;

  return { sequence, answer };
}

// Validate user answer
export function checkAnswer(userAnswer, correctAnswer) {
  return Number(userAnswer) === correctAnswer;
}



export function updateStreak(isCorrect) {
  if (!isCorrect) return getStreak();

  const today = getTodaySeed();
  const lastDate = localStorage.getItem("lastSolvedDate");
  let streak = Number(localStorage.getItem("streak") || 0);

  if (lastDate === today) {
    return streak; // already solved today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().slice(0, 10);

  if (lastDate === yDate) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastSolvedDate", today);

  return streak;
}

export function getStreak() {
  return Number(localStorage.getItem("streak") || 0);
}


export function isSolvedToday() {
  const today = getTodaySeed();
  const lastSolvedDate = localStorage.getItem("lastSolvedDate");
  return lastSolvedDate === today;
}
