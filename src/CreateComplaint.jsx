import React, { useState } from "react";
import "./CreateComplaint.css";
import { addComplaint } from "./api";

function CreateComplaint() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComplaint = {
      title,
      location,
      date,
      status: "Pending",
      image:
        image ||
        "https://images.unsplash.com/photo-1581091215367-59ab6dcef10d?q=80&w=400",
    };

    addComplaint(newComplaint)
      .then((data) => {
        alert(data.message);

        setTitle("");
        setLocation("");
        setDate("");
        setImage("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="create-container">
      <h1>Create Complaint</h1>

      <form onSubmit={handleSubmit} className="complaint-form">
        <input
          type="text"
          placeholder="Complaint Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field"
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
          required
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="input-field"
        />

        <button type="submit" className="submit-btn">
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default CreateComplaint;