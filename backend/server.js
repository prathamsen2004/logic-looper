console.log("Logic Looper Backend Starting 🔥");

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.send("Logic Looper Backend Running 🚀");
});

// ================= CREATE TABLE =================
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        streak INTEGER DEFAULT 0,
        last_solved DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users table ready ✅");
  } catch (err) {
    console.error("Table creation error:", err);
  }
};

createTable();

// ================= CREATE USER =================
app.post("/create-user", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    await pool.query(
      `INSERT INTO users (email)
       VALUES ($1)
       ON CONFLICT (email) DO NOTHING`,
      [email]
    );

    res.json({ message: "User ready ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SOLVE DAILY =================
app.post("/solve-daily", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (user.last_solved !== today) {
      await pool.query(
        "UPDATE users SET streak = streak + 1, last_solved=$1 WHERE email=$2",
        [today, email]
      );
    }

    const updated = await pool.query(
      "SELECT email, streak FROM users WHERE email=$1",
      [email]
    );

    res.json(updated.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET USER =================
app.get("/user/:email", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT email, streak FROM users WHERE email=$1",
      [req.params.email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= LEADERBOARD =================
app.get("/leaderboard", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT email, streak FROM users ORDER BY streak DESC LIMIT 10"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
