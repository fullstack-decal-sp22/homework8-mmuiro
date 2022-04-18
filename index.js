import mongoose from "mongoose";
import express from "express";
import userRouter from "./routes/user.js";
import shopRouter from "./routes/shop.js";

const app = express();
mongoose.connect("mongodb://localhost:27018/auth-hw"); // port I use for my docker mongo instance
const db = mongoose.connection;
const port = 4000;

db.once("open", () => console.log("MongoDB connection established."));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/shop", shopRouter);

app.listen(port, () => {
    console.log(`Shopping app active on port ${port}`);
});
