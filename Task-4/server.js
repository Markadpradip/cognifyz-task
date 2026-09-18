const express = require("express");
const path = require("path");

const app = express();
const PORT = 5002;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Temporary server-side storage
const users = [];

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

// Registration API
app.post("/register", (req, res) => {
    const {
        name,
        email,
        age,
        city,
        password
    } = req.body;

    // Name validation
    if (!name || name.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: "Name must contain at least 3 characters."
        });
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    // Check duplicate email
    const existingUser = users.find(
        user => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Email is already registered."
        });
    }

    // Age validation
    const userAge = Number(age);

    if (!age || !Number.isInteger(userAge) || userAge < 18 || userAge > 60) {
        return res.status(400).json({
            success: false,
            message: "Age must be between 18 and 60."
        });
    }

    // City validation
    if (!city || city.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid city."
        });
    }

    // Strong password validation
    const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!password || !strongPassword.test(password)) {
        return res.status(400).json({
            success: false,
            message:
                "Password must contain 8+ characters, uppercase, lowercase, number and special character."
        });
    }

    // Create user
    const user = {
        id: users.length + 1,
        name: name.trim(),
        email: email.trim(),
        age: userAge,
        city: city.trim()
    };

    // Temporary storage
    users.push(user);

    console.log("Registered User:", user);
    console.log("Temporary Users:", users);

    // Send response
    res.render("success", {
    user: user
});
});

// Start server
app.listen(PORT, () => {
    console.log(
        `Task 4 server running at http://localhost:5002`
    );
});