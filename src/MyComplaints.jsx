import React, { useEffect, useState } from "react";
import "./MyComplaints.css";
import { Link } from "react-router-dom";
import { getComplaints } from "./api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getComplaints()
      .then((data) => {
        console.log(data);
        setComplaints(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>CivicTrack</h2>

        <ul>
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>

          <li>
            <Link to="/create">Create Complaint</Link>
          </li>

          <li className="active">
            <Link to="/">My Complaints</Link>
          </li>

          <li>
            <button
              className="logout-btn"
              onClick={() => {
                alert("Logged out successfully");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">
        <h1>My Complaints</h1>
        <p>Track your complaints status</p>

        {complaints.length === 0 ? (
          <p>No complaints found</p>
        ) : (
          complaints.map((item, index) => (
            <div className="card" key={item._id || item.id || index}>
              <img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1581091215367-59ab6dcef10d?q=80&w=400"
                }
                alt="complaint"
              />

              <div className="card-content">
                <h3>{item.title}</h3>

                <p>📍 {item.location}</p>

                <p>📅 {item.date}</p>
              </div>

              <div className="right-section">
                <span
                  className={
                    item.status === "Resolved"
                      ? "resolved"
                      : item.status === "Pending"
                      ? "pending"
                      : "progress"
                  }
                >
                  {item.status}
                </span>

                <button
                  className="arrow-btn"
                  onClick={() => {
                    alert("Complaint Details");
                  }}
                >
                  ➜
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyComplaints;