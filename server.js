const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// Get user profile
app.get("/api/users/:id", (req, res) => {
  // Replace with user authentication and access control
  const userId = req.params.id;
  db.query(
    "SELECT id, username, email FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.json(result[0]);
      }
    }
  );
});

// Get user's game library
app.get("/api/users/:id/library", (req, res) => {
  // Replace with user authentication and access control
  const userId = req.params.id;
  db.query(
    "SELECT game_id FROM game_library WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.json(result);
      }
    }
  );
});

// Add game to user's library
app.post("/api/users/:id/library", (req, res) => {
  // Replace with user authentication and access control
  const userId = req.params.id;
  const { gameId } = req.body;
  db.query(
    "INSERT INTO game_library (user_id, game_id) VALUES (?, ?)",
    [userId, gameId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.json({ message: "Game added to library" });
      }
    }
  );
});

// Remove game from user's library
app.delete("/api/users/:id/library/:gameId", (req, res) => {
  // Replace with user authentication and access control
  const userId = req.params.id;
  const gameId = req.params.gameId;
  db.query(
    "DELETE FROM game_library WHERE user_id = ? AND game_id = ?",
    [userId, gameId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.json({ message: "Game removed from library" });
      }
    }
  );
});

// Create a new user
app.post("/api/users", (req, res) => {
  const { username, email, password } = req.body;
  // Encrypt the password before storing it in the database (use a library like bcrypt)
  // Add validation and error handling as needed
  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.json({ message: "User created" });
      }
    }
  );
});

// Delete a user
app.delete("/api/users/:id", (req, res) => {
  // Replace with user authentication and access control
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Server error" });
    } else {
      res.json({ message: "User deleted" });
    }
  });
});

// Login user
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT id, username, email, password FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        if (result.length === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          const user = result[0];
          if (user.password === password) {
            // User is authenticated; you can send back user data or a token for further requests
            res.json({ message: "User logged in", user });
          } else {
            res.status(401).json({ error: "Invalid password" });
          }
        }
      }
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
