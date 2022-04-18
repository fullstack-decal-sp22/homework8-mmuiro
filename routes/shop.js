import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/list", auth, async (req, res) => {
    const user = req.user;
    try {
        const list = user.shoppingList;
        if (!list) list = [];
        return res
            .status(200)
            .json({ msg: "Successfully retrieved shopping list.", list });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "An error occurred." });
    }
});

router.post("/add", auth, async (req, res) => {
    // needs middleware
    const item = req.body.item;
    if (typeof item !== "string")
        return res.status(400).json({ msg: "Invalid item." });
    try {
        const user = req.user;
        if (!user.shoppingList) user.shoppingList = [];
        user.shoppingList.push(item);
        await user.save();
        return res.status(200).json({
            msg: "Added your item successfully.",
            list: user.shoppingList,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "An error occurred." });
    }
});

router.delete("/delete", auth, async (req, res) => {
    const user = req.user;
    const item = req.body.item;
    if (typeof item !== "string")
        return res.status(400).json({ msg: "Invalid item." });
    try {
        const list = user.shoppingList;
        if (list.includes(item)) {
            const i = list.indexOf(item);
            list.splice(i, 1);
            await user.save();
            return res.status(200).json({ msg: "Removed your item.", list });
        } else {
            return res
                .status(200)
                .json({ msg: "Couldn't find that item.", list });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "An error occurred." });
    }
});

export default router;
