const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let complaints = [
  {
    id: 1,
    title: "Pothole on MG Road",
    location: "Bengaluru",
    date: "20 May 2024",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1581091215367-59ab6dcef10d?q=80&w=400",
  },
];

// GET complaints
app.get("/complaints", (req, res) => {
  res.json(complaints);
});

// POST complaint
app.post("/complaints", (req, res) => {
  const newComplaint = {
    id: complaints.length + 1,
    ...req.body,
  };

  complaints.push(newComplaint);

  console.log("New Complaint Added:");
  console.log(newComplaint);

  res.json({
    message: "Complaint added successfully",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});