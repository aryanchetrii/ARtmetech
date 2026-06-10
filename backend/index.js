const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Database setup
const db = new Database(path.join(__dirname, "database.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    interest TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// POST - submit form
app.post("/api/submit", (req, res) => {
  const submissions = req.body;

  if (!Array.isArray(submissions) || submissions.length === 0) {
    return res.status(400).json({
      error: "Request body must be a non-empty array",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  try {
    const stmt = db.prepare(
      "INSERT INTO submissions (name, phone, email, interest) VALUES (?, ?, ?, ?)"
    );

    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        const { name, phone, email, interest } = row;

        if (!name || !phone || !email || !interest) {
          throw new Error("All fields are required");
        }

        if (!Array.isArray(interest) || interest.length === 0) {
          throw new Error("Interest must be a non-empty array");
        }

        if (!emailRegex.test(email)) {
          throw new Error(`Invalid email format: ${email}`);
        }

        if (!phoneRegex.test(phone)) {
          throw new Error(`Invalid phone number: ${phone}`);
        }

        stmt.run(
          name,
          phone,
          email,
          interest.join(",")
        );
      }
    });

    insertMany(submissions);

    res.status(201).json({
      message: "Submissions saved successfully",
      count: submissions.length,
    });
  } catch (err) {
    console.error("Database error:", err.message);

    res.status(400).json({
      error: err.message,
    });
  }
});

// SAMPLE PAYLOAD:
// [
//   {
//     "name": "Joe",
//     "phone": "9876543210",
//     "email": "joe@test.com",
//     "interest": ["NodeJS", "React"]
//   },
//   {
//     "name": "John",
//     "phone": "9123456789",
//     "email": "john@test.com",
//     "interest": ["Python", "AI"]
//   }
// ]

// GET - fetch all submissions
app.get("/api/submissions", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM submissions ORDER BY created_at DESC").all();
    const data = rows.map((row) => ({
      ...row,
      interest: row.interest.split(","),
    }));
    res.json(data);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
