const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const User = require("../models/User");

        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Get User Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

module.exports = router;