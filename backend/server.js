// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => res.send("Logic Looper Backend Running!"));

// Solve daily + submit score in one call
app.post("/api/solve-and-submit", async (req, res) => {
  const { email, score } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const today = new Date().toISOString().split("T")[0];

    // Check user
    let { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    let streak = 1;
    if (rows.length === 0) {
      await pool.query(
        "INSERT INTO users(email, streak_count, last_played, total_points) VALUES($1,$2,$3,$4)",
        [email, 1, today, score || 0]
      );
    } else {
      const lastPlayed = rows[0].last_played?.toISOString().split("T")[0];
      streak = lastPlayed === today
        ? rows[0].streak_count
        : lastPlayed === new Date(Date.now() - 86400000).toISOString().split("T")[0]
        ? rows[0].streak_count + 1
        : 1;

      const totalPoints = (rows[0].total_points || 0) + (score || 0);
      await pool.query(
        "UPDATE users SET streak_count=$1, last_played=$2, total_points=$3 WHERE email=$4",
        [streak, today, totalPoints, email]
      );
    }

    // Insert daily score
    const userIdRow = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    const userId = userIdRow.rows[0].id;
    if (score != null) {
      await pool.query(
        "INSERT INTO daily_scores(user_id,date,puzzle_id,score,time_taken) VALUES($1,$2,$3,$4,$5)",
        [userId, today, 1, score, 0]
      );
    }

    // Leaderboard
    const lb = await pool.query(
      "SELECT email,total_points as score FROM users ORDER BY total_points DESC LIMIT 10"
    );

    res.json({ streak, leaderboard: lb.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT email,total_points as score FROM users ORDER BY total_points DESC LIMIT 10"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
