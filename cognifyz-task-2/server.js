const express = require("express");
const path = require("path");

const app = express();

const PORT = 5001;

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

// Register user
app.post("/register", (req, res) => {

    console.log("REGISTER REQUEST RECEIVED");
    console.log("BODY:", req.body);

    const { name, email, age, city, password } = req.body;

    // Server-side validation
    if (!name || name.trim().length < 3) {
        return res.status(400).send("Name must contain at least 3 characters.");
    }

    if (!email || !email.includes("@")) {
        return res.status(400).send("Please enter a valid email.");
    }

    const userAge = Number(age);

    if (!age || userAge < 18 || userAge > 60) {
        return res.status(400).send("Age must be between 18 and 60.");
    }

    if (!city || city.trim().length < 2) {
        return res.status(400).send("Please enter a valid city.");
    }

    if (!password || password.length < 6) {
        return res.status(400).send("Password must contain at least 6 characters.");
    }

    // Validated user
    const user = {
        name: name.trim(),
        email: email.trim(),
        age: userAge,
        city: city.trim()
    };

    // Temporary server-side storage
    users.push(user);

    console.log("Validated User:", user);
    console.log("Temporary Users:", users);

    // Send data to EJS
    res.render("success", { user });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});