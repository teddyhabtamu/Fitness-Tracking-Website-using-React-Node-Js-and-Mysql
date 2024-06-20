// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;
const secretKey = "your_secret_key"; // Replace with your actual secret key

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route for signup
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existingUser] = await db.execute(
      "SELECT user_id, email, password FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "User already exists with that email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
    };

    await db.execute(
      "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)",
      [newUser.name, newUser.email, newUser.password, newUser.created_at]
    );

    res.status(201).json({ message: "User signed up successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for signin
app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Both fields are required" });
  }

  try {
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = existingUser[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token with user id
    const token = jwt.sign({ id: user.user_id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Sign in successful", token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Middleware to extract userId from token for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, secretKey);

      req.userId = decoded.id; // Ensure the decoded token contains an `id` property
      next();
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Authorization header missing" });
  }
};

// Apply authenticateToken middleware to routes that require authentication
app.use("/api/dashboard", authenticateToken);
app.use("/api/todays-workouts", authenticateToken);

// Define the /api/dashboard route
app.get("/api/dashboard", async (req, res) => {
  const userId = req.userId; // Assuming userId is available after authentication

  try {

    const [[dailyStats], [weeklyStats], [workoutStats], workouts] =
      await Promise.all([
        db.query("SELECT * FROM DailyStat WHERE user_id = ?", [userId]),
        db.query("SELECT * FROM WeeklyStat WHERE user_id = ?", [userId]),
        db.query("SELECT * FROM WorkoutStat WHERE user_id = ?", [userId]),
        db.query("SELECT * FROM Workout WHERE user_id = ?", [userId]), // Filter workouts by user_id
      ]);

    res.status(200).json({
      dailyStats,
      weeklyStats,
      workoutStats,
      workouts,
    });
  } catch (error) {
    console.error("Dashboard Data Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example route to fetch today's workouts
app.get("/api/todays-workouts", async (req, res) => {
  const userId = req.userId; // Assuming userId is available after authentication
  const today = new Date().toISOString().split("T")[0]; // Get today's date in yyyy-mm-dd format

  try {
    const [rows] = await db.query(
      "SELECT * FROM Workout WHERE user_id = ? AND DATE(date) = ?",
      [userId, today]
    );

    res.status(200).json(rows); // Ensure rows is sent as JSON response
  } catch (error) {
    console.error("Error fetching today's workouts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new workout
app.post("/api/workouts", authenticateToken, async (req, res) => {
  const { category, workout_name, sets, reps, weight, duration, date } =
    req.body;
  const userId = req.userId;

  try {
    await db.execute(
      "INSERT INTO Workout (user_id, category, workout_name, sets, reps, weight, duration, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, category, workout_name, sets, reps, weight, duration, date]
    );

    res.status(201).json({ message: "Workout added successfully" });
  } catch (error) {
    console.error("Error adding workout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to fetch workouts for a specific date
app.get("/api/workouts/:date", authenticateToken, async (req, res) => {
  const userId = req.userId;
  const { date } = req.params; // Get the date from the request parameters

  try {
    const [workouts] = await db.query(
      "SELECT * FROM Workout WHERE user_id = ? AND DATE(date) = ?",
      [userId, date]
    );

    res.status(200).json(workouts);
  } catch (error) {
    console.error("Error fetching workouts for the date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add routes for blog posts
app.get("/api/blogs", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Blog ORDER BY created_at DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/blogs", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;

  console.log("UserId:", userId); // Debug: Log userId
  console.log("Request body:", req.body); // Debug: Log request body

  try {
    const [result] = await db.execute(
      "INSERT INTO Blog (author_id, title, content) VALUES (?, ?, ?)",
      [userId, title, content]
    );

    console.log("Insert Result:", result); // Debug: Log insert result
    res.status(201).json({ message: "Blog post added successfully" });
  } catch (error) {
    console.error("Error adding blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Tutorial section fetching
// Route for creating a tutorial
app.post("/api/tutorials", async (req, res) => {
  const { title, thumbnail, videourl } = req.body;

  if (!title || !videourl) {
    return res.status(400).json({ message: "Title and video URL are required" });
  }

  try {
    await db.execute(
      "INSERT INTO Tutorial (title, thumbnail, videourl) VALUES (?, ?, ?)",
      [title, thumbnail, videourl]
    );

    res.status(201).json({ message: "Tutorial created successfully" });
  } catch (error) {
    console.error("Create tutorial error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for fetching all tutorials
app.get("/api/tutorials", async (req, res) => {
  try {
    const [tutorials] = await db.execute("SELECT * FROM Tutorial");

    res.status(200).json(tutorials);
  } catch (error) {
    console.error("Fetch tutorials error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for fetching a single tutorial by ID
app.get("/api/tutorials/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [tutorial] = await db.execute("SELECT * FROM Tutorial WHERE tutorial_id = ?", [id]);

    if (tutorial.length === 0) {
      return res.status(404).json({ message: "Tutorial not found" });
    }

    res.status(200).json(tutorial[0]);
  } catch (error) {
    console.error("Fetch tutorial error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for updating a tutorial by ID
app.put("/api/tutorials/:id", async (req, res) => {
  const { id } = req.params;
  const { title, thumbnail, videourl } = req.body;

  try {
    await db.execute(
      "UPDATE Tutorial SET title = ?, thumbnail = ?, videourl = ? WHERE tutorial_id = ?",
      [title, thumbnail, videourl, id]
    );

    res.status(200).json({ message: "Tutorial updated successfully" });
  } catch (error) {
    console.error("Update tutorial error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for deleting a tutorial by ID
app.delete("/api/tutorials/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM Tutorial WHERE tutorial_id = ?", [id]);

    res.status(200).json({ message: "Tutorial deleted successfully" });
  } catch (error) {
    console.error("Delete tutorial error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
