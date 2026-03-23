console.log("Server file loaded");

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================= MONGODB CONNECTION =================
mongoose.connect("mongodb://127.0.0.1:27017/eventDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ================= USER SCHEMA =================
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

// ================= BOOKING SCHEMA =================
const BookingSchema = new mongoose.Schema({
    username: String,
    eventName: String,
    tickets: Number,
    totalAmount: Number,
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", BookingSchema);

// ================= REGISTER =================
app.post("/register", async (req, res) => {
    console.log("Register API called");
    console.log(req.body);

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        password: hashedPassword
    });

    await newUser.save();
    res.json({ message: "User Registered Successfully" });
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong Password" });

    res.json({ message: "Login Successful" });
});

// ================= BOOK EVENT =================
app.post("/book", async (req, res) => {
    console.log("Booking API called");
    console.log(req.body);

    const { username, eventName, tickets, totalAmount } = req.body;

    const newBooking = new Booking({
        username,
        eventName,
        tickets,
        totalAmount
    });

    await newBooking.save();

    res.json({ message: "Event Booked Successfully 🎉" });
});

// ================= START SERVER =================
app.listen(5000, () => {
    console.log("Server running on port 5000");
});