const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

let complaints = []; // ADD THIS

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET complaints
app.get("/complaints", (req, res) => {
  res.json(complaints);
});

app.delete("/complaints/:id", (req, res) => {
  const id = parseInt(req.params.id);

  complaints = complaints.filter((c) => c.id !== id);

  res.json({ message: "Deleted successfully" });
});

// POST complaint
app.post("/complaints", upload.single("image"), (req, res) => {
  const newComplaint = {
    id: Date.now(),
    title: req.body.title,
    location: req.body.location,
    date: req.body.date,
    status: req.body.status,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  };

  complaints.push(newComplaint);

  res.json({
    message: "Complaint Added Successfully",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});