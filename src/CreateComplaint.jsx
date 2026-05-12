import React, { useState } from "react";
import "./CreateComplaint.css";


function CreateComplaint() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("status", "Pending");
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/complaints", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      alert(data.message);

      setTitle("");
      setLocation("");
      setDate("");
      setImage(null);
    } catch (error) {
      console.log(error);
    }
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
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
}

export default CreateComplaint;