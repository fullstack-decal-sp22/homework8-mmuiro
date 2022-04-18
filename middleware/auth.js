import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = "pwY2d5GBV%3$S5ka%!j58z1CfPHsbxKq"; // yes, I am storing the JWT secret in plain sight :^)
const auth = async (req, res, next) => {
    const token = req.header("token");
    if (!token) return res.status(401).json({ msg: "Not logged in!" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findOne({ username: decoded.username });
        next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "An error occurred." });
    }
};

export { auth, JWT_SECRET };
