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
app.get("/", (req, res) => {
  res.send("Backend Running");
});


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
app.post(
  "/login",
  async (req, res) => {

    try {

      const {
        username,
        password,
      } = req.body;

      // FIND USER
      const user =
        await User.findOne({
          name: username,
        });

      if (!user) {

        return res
          .status(400)
          .json({
            message:
              "User not found",
          });

      }

      // CHECK PASSWORD
      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res
          .status(400)
          .json({
            message:
              "Invalid password",
          });

      }

      // TOKEN
      const token =
        jwt.sign(
          {
            id: user._id,
            role:
              user.role,
          },
          "secretkey",
          {
            expiresIn: "7d",
          }
        );

      // RESPONSE
      res.json({
        token,

        user: {
          id: user._id,
          username:
            user.name,
          email:
            user.email,
          role:
            user.role,
        },
      });

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }
  }
);

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

// ---------------- DELETE COMPLAINT ----------------
app.delete("/complaints/:id", verifyToken, async (req, res) => {
  try {

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Complaint deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
app.post(
  "/register",
  async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        role,
      } = req.body;

      // CHECK EXISTING USER
      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message:
              "User already exists",
          });
      }

      // HASH PASSWORD
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // CREATE USER
      const newUser =
        new User({
          name: username,
          email,
          password:
            hashedPassword,
          role,
        });

      // SAVE
      await newUser.save();

      // TOKEN
      const token =
        jwt.sign(
          {
            id: newUser._id,
            role:
              newUser.role,
          },
          "secretkey",
          {
            expiresIn: "7d",
          }
        );

      // RESPONSE
      res.status(201).json({
        token,

        user: {
          id: newUser._id,
          username:
            newUser.name,
          email:
            newUser.email,
          role:
            newUser.role,
        },
      });

    } catch (error) {

      res.status(500).json({
        message:
          "Registration failed",
      });

    }
  }
);
// SERVER MUST BE LAST
app.listen(5000, () => {
  console.log(
    "Server Started On Port 5000"
  );
});