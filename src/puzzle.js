export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function generatePuzzle() {
  const today = getTodayDate();
  const lastDate = localStorage.getItem("lastPuzzleDate");

  if (lastDate === today) return JSON.parse(localStorage.getItem("todayPuzzle"));

  const type = ["sequence","pattern"][Math.floor(Math.random()*2)];
  let puzzle;

  if (type === "sequence") {
    const s = Math.floor(Math.random()*5)+1;
    puzzle = { type, sequence:[s,s*2,s*4], answer: s*8 };
  } else {
    const a = Math.floor(Math.random()*10);
    puzzle = { type, pattern:[a,a+2,a+4], answer: a+6 };
  }

  localStorage.setItem("todayPuzzle", JSON.stringify(puzzle));
  localStorage.setItem("lastPuzzleDate", today);
  return puzzle;
}
