const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const connectDB = require("./config/db");
const Complaint = require("./models/Complaint");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/Users"); // ✅ FIXED
const verifyToken = require("./middleware/authMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// ---------------- MULTER ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ---------------- SIGNUP ----------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- CREATE COMPLAINT (TOKEN) ----------------
app.post(
  "/complaints",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const newComplaint = new Complaint({
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        category: req.body.category,

        // AUTO DATE
        date: new Date(),

        status: "Pending",
image: req.file ? req.file.filename : null,
        

        userId: req.user.id,
      });

      await newComplaint.save();

      res.json({
        message: "Complaint created successfully",
        data: newComplaint,
      });

    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);


// ---------------- GET MY COMPLAINTS ----------------
app.get("/mycomplaints", verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    });

    res.json(complaints);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- GET ALL COMPLAINTS ----------------
app.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ---------------- UPDATE STATUS ----------------
app.put("/complaints/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log("Server Started On Port 5000");
});

app.put(
  "/complaints/feedback/:id",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const updated = await Complaint.findByIdAndUpdate(
        req.params.id,
        {
 feedbackImage: req.file
  ? `http://localhost:5000/uploads/${req.file.filename}`
  : null,
        },
        { new: true }
      );

      res.json({
        message: "Feedback submitted successfully",
        data: updated,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);