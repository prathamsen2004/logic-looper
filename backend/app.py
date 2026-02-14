from flask import Flask, request, jsonify
import psycopg2
from datetime import date

app = Flask(__name__)

# --------------------------
# Neon PostgreSQL credentials
# --------------------------
conn = psycopg2.connect(
    dbname="neondb",
    user="neondb_owner",
    password="npg_KflGciP1X6kD",
    host="ep-muddy-leaf-a1u482lt-pooler.ap-southeast-1.aws.neon.tech",
    port="5432"
)
cur = conn.cursor()

# --------------------------
# Create user endpoint
# --------------------------
@app.route("/create-user", methods=["POST"])
def create_user():
    data = request.get_json()
    email = data.get("email")
    cur.execute(
        "INSERT INTO users (email, streak_count, last_played) VALUES (%s, 0, NULL) ON CONFLICT (email) DO NOTHING RETURNING *",
        (email,)
    )
    conn.commit()
    return jsonify({"status": "success", "email": email})

# --------------------------
# Solve daily endpoint
# --------------------------
@app.route("/solve-daily", methods=["POST"])
def solve_daily():
    data = request.get_json()
    email = data.get("email")

    cur.execute("SELECT streak_count, last_played FROM users WHERE email=%s", (email,))
    user = cur.fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404

    streak, last_solved = user
    today = date.today()

    if last_solved != today:
        streak += 1
        cur.execute(
            "UPDATE users SET streak_count=%s, last_played=%s WHERE email=%s",
            (streak, today, email)
        )
        conn.commit()

    # Return top 10 leaderboard
    cur.execute("SELECT email, streak_count FROM users ORDER BY streak_count DESC LIMIT 10")
    users = cur.fetchall()
    leaderboard = [{"email": u[0], "streak": u[1]} for u in users]

    return jsonify({"email": email, "streak": streak, "leaderboard": leaderboard})

# --------------------------
# Leaderboard endpoint
# --------------------------
@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    cur.execute("SELECT email, streak_count FROM users ORDER BY streak_count DESC LIMIT 10")
    users = cur.fetchall()
    leaderboard = [{"email": u[0], "streak": u[1]} for u in users]
    return jsonify(leaderboard)

# --------------------------
if __name__ == "__main__":
    app.run(port=5000)
