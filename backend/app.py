from flask import Flask, request, jsonify
import psycopg2
from datetime import date

app = Flask(__name__)

# --------------------------
# Neon PostgreSQL credentials
# --------------------------
conn = psycopg2.connect(
    dbname="neondb",                                   # database name
    user="neondb_owner",                               # username
    password="npg_KflGciP1X6kD",                      # password
    host="ep-muddy-leaf-a1u482lt-pooler.ap-southeast-1.aws.neon.tech",  # host
    port="5432"                                        # port
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
        "INSERT INTO users (email, streak, last_solved_date) VALUES (%s, 0, NULL) ON CONFLICT (email) DO NOTHING RETURNING *",
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

    cur.execute("SELECT streak, last_solved_date FROM users WHERE email=%s", (email,))
    user = cur.fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404

    streak, last_solved = user
    today = date.today()

    if last_solved != today:
        streak += 1
        cur.execute(
            "UPDATE users SET streak=%s, last_solved_date=%s WHERE email=%s",
            (streak, today, email)
        )
        conn.commit()

    return jsonify({"email": email, "streak": streak})

# --------------------------
# Leaderboard endpoint
# --------------------------
@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    cur.execute("SELECT email, streak FROM users ORDER BY streak DESC")
    users = cur.fetchall()
    result = [{"email": u[0], "streak": u[1]} for u in users]
    return jsonify(result)

# --------------------------
if __name__ == "__main__":
    app.run(port=5000)
