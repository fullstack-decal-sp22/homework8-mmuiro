import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../middleware/auth.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ msg: "Invalid signup parameters." });
    }
    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username, password });
            // yes, I am storing the password as plaintext :^)
        } else {
            return res.status(400).json({ msg: "User already exists." });
        }
        await user.save();
        const token = jwt.sign(
            {
                username,
            },
            JWT_SECRET,
            {
                expiresIn: 3600,
            }
        );
        return res.status(200).json({ msg: "Successfully registered.", token });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "Invalid signup parameters." });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (typeof username !== "string" || typeof password !== "string")
        return res.status(400).json({ msg: "Invalid login parameters." });
    try {
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: "No such user." });
        if (password !== user.password)
            return res.status(401).json({ msg: "Wrong password." });
        const token = jwt.sign(
            {
                username,
            },
            JWT_SECRET,
            {
                expiresIn: 3600,
            }
        );
        return res.json({ msg: "Logged in successfully.", token });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "An error occurred." });
    }
});

export default router;
