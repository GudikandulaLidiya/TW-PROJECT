const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const connectDB = require("./config/db");
const Complaint = require("./models/Complaint");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// GET ALL COMPLAINTS
app.get("/complaints", async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});


// POST COMPLAINT
app.post("/complaints", upload.single("image"), async (req, res) => {
  try {
    const newComplaint = new Complaint({
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      date: req.body.date,
      status: req.body.status,
      image: req.file ? req.file.filename : null,
    });

    await newComplaint.save();

    res.json({
      message: "Complaint saved successfully",
      data: newComplaint,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// START SERVER
app.listen(5000, () => {
  console.log("Server Started");
});