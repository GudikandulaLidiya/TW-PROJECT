const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
  },

  description: {
    type: String,
  },

  location: {
    type: String,
  },

  category: {
    type: String,
  },

  status: {
    type: String,
    default: "Pending",
  },

  image: {
    type: String,
  },

  userId: {
    type: String,
  },

  // DATE FIELD
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);