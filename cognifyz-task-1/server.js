const express = require("express");
const path = require("path");

const app = express();

const PORT = 5000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

// Register
app.post("/register", (req, res) => {

    console.log("REGISTER REQUEST RECEIVED");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("BODY:", req.body);

    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    const { name, email, age, city } = req.body;

    const user = {
        name,
        email,
        age,
        city
    };

    res.render("profile", { user });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});