const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  status: {
    type: String,
    default: "Pending",
  },
  image: String,


  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);