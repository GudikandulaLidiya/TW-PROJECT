import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/complaints")
      .then((res) => res.json())
      .then((data) => setComplaints(data));
  }, []);

  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>CivicTrack</h2>

        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/create">Create Complaint</Link>
          </li>

          <li>
            <Link to="/">My Complaints</Link>
          </li>

          <li>Logout</li>
        </ul>
      </div>

      {/* Main */}
      <div className="main-content">
        <h1>Welcome User 👋</h1>

        <div className="cards">
          <div className="card">
            <h3>Total Complaints</h3>
            <p>{complaints.length}</p>
          </div>

          <div className="card">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>

          <div className="card">
            <h3>Resolved</h3>
            <p>{resolved}</p>
          </div>
        </div>

        <h2>Recent Complaints</h2>

        {complaints.map((item) => (
          <div className="complaint-card" key={item.id}>
            <h3>{item.title}</h3>

            <p>{item.category}</p>

            <p>{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;