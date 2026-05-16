import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateComplaint.css";
import { createComplaint } from "./api";

function CreateComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
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
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("status", "Pending");
    formData.append("image", form.image);

    try {
      const response = await createComplaint(formData);

      setMessage(response.message || "Complaint submitted successfully ✅");

      setForm({
        title: "",
        location: "",
        description: "",
        date: "",
        image: null,
      });

      // ✅ IMPORTANT FIX: go back to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="create-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>CivicTrack</h2>

        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/create">Create Complaint</Link></li>
          <li><Link to="/mycomplaints">My Complaints</Link></li>
          <li><Link to="/admin">Admin Dashboard</Link></li>
<div className="sidebar-help">

  <h3>Need Help?</h3>

  <p>
    Contact support for assistance
  </p>

  <button>
    Support
  </button>

</div>
          <li>
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* FORM SECTION */}
      <div className="form-section">

        <form onSubmit={handleSubmit} className="complaint-form">

          <h1>Create Complaint</h1>

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

          <textarea
            name="description"
            placeholder="Describe the issue in detail..."
            value={form.description}
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

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default CreateComplaint;