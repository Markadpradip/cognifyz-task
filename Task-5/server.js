const express = require("express");
const path = require("path");

const app = express();
const PORT = 5003;

// ================================
// VIEW ENGINE
// ================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================================
// MIDDLEWARE
// ================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// ================================
// TEMPORARY DATA
// ================================

let users = [
    {
        id: 1,
        name: "Pradip",
        email: "pradip@example.com",
        city: "Nagpur"
    },
    {
        id: 2,
        name: "Rahul",
        email: "rahul@example.com",
        city: "Pune"
    }
];

// ================================
// FRONTEND ROUTE
// ================================

app.get("/", (req, res) => {
    res.render("index");
});

// ================================
// GET - READ ALL USERS
// ================================

app.get("/api/users", (req, res) => {
    res.json({
        success: true,
        data: users
    });
});

// ================================
// GET - READ SINGLE USER
// ================================

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    res.json({
        success: true,
        data: user
    });
});

// ================================
// POST - CREATE USER
// ================================

app.post("/api/users", (req, res) => {
    const { name, email, city } = req.body;

    if (!name || !email || !city) {
        return res.status(400).json({
            success: false,
            message: "Name, email and city are required."
        });
    }

    const newUser = {
        id: users.length > 0
            ? Math.max(...users.map(user => user.id)) + 1
            : 1,
        name: name.trim(),
        email: email.trim(),
        city: city.trim()
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: "User created successfully.",
        data: newUser
    });
});

// ================================
// PUT - UPDATE USER
// ================================

app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    const { name, email, city } = req.body;

    if (!name || !email || !city) {
        return res.status(400).json({
            success: false,
            message: "Name, email and city are required."
        });
    }

    users[userIndex] = {
        id,
        name: name.trim(),
        email: email.trim(),
        city: city.trim()
    };

    res.json({
        success: true,
        message: "User updated successfully.",
        data: users[userIndex]
    });
});

// ================================
// DELETE - DELETE USER
// ================================

app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.json({
        success: true,
        message: "User deleted successfully.",
        data: deletedUser[0]
    });
});

// ================================
// SERVER
// ================================

app.listen(PORT, () => {
    console.log(`Task 5 server running at http://localhost:${PORT}`);
});