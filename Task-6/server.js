const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// ==============================
// Middleware
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==============================
// MongoDB Connection
// ==============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error.message);
    });

// ==============================
// Routes
// ==============================

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

// ==============================
// Server
// ==============================

app.listen(PORT, () => {
    console.log(`Task 6 server running at http://localhost:${PORT}`);
});