const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  date: String,
  status: String,
  image: String,
});

module.exports = mongoose.model("Complaint", complaintSchema);