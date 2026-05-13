import React, { useState } from "react";
import "./CreateComplaint.css";
import { createComplaint } from "./api";

function CreateComplaint() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("location", form.location);
    formData.append("date", form.date);
    formData.append("status", "Pending");
    formData.append("image", form.image);

    try {
      const response = await createComplaint(formData);

      setMessage(response.message || "Complaint submitted successfully ✅");

      setForm({
        title: "",
        location: "",
        date: "",
        image: null,
      });
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong ❌ Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h1>Create Complaint</h1>

      <form onSubmit={handleSubmit} className="complaint-form">
        <input
          type="text"
          name="title"
          placeholder="Complaint Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      {/* MESSAGE DISPLAY */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default CreateComplaint;