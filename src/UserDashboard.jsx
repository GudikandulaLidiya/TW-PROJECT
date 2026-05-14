import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css";
import { getComplaints } from "./api";

function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);

    getComplaints()
      .then((data) => {
        setComplaints(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
        setComplaints([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const processing = complaints.filter(
  (item) =>
    item.status === "In Progress" ||
    item.status === "Processing"
).length;

  const recent = [...complaints]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>CivicTrack</h2>

        <ul>

  <li>
    <Link to="/">Dashboard</Link>
  </li>

  <li>
    <Link to="/create">
      Create Complaint
    </Link>
  </li>

  <li>
    <Link to="/mycomplaints">
      My Complaints
    </Link>
  </li>

 

  <li>
    <Link to="/admin">
      Admin Dashboard
    </Link>
  </li>

  <li>
    <button onClick={() => alert("Logged out")}>
      Logout
    </button>
  </li>

</ul>
      </div>

      {/* MAIN */}
      <div className="main-content">

        <div className="welcome-section">
          <h1>Welcome User 👋</h1>
          <p>Here’s what’s happening in your community</p>
        </div>

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="cards">

              <div className="card total">
                <h3>Total Complaints</h3>
                <p>{complaints.length}</p>
              </div>

              <div className="card pending-card">
                <h3>Pending</h3>
                <p>{pending}</p>
              </div>

              <div className="card resolved-card">
                <h3>Resolved</h3>
                <p>{resolved}</p>
              </div>

              <div className="card progress-card">
  <h3>Processing</h3>
  <p>{processing}</p>
</div>

            </div>

            {/* RECENT */}
            <div className="recent-section">
              <h2>Recent Complaints</h2>

              {recent.length === 0 ? (
                <div className="empty-box">
                  No complaints yet
                </div>
              ) : (
                recent.map((item, index) => (
                  <div
                    className="complaint-card"
                    key={item.id || item._id || index}
                  >

                    <div className="complaint-card-info">
  <h3>{item.title}</h3>

  <p>
    📍 {item.location || "Unknown Location"}
  </p>

  <p>
    📅 {item.date || "No Date"}
  </p>
</div>

                    <div
                      className={`status-badge ${
                        item.status === "Resolved"
                          ? "resolved-status"
                          : item.status === "Pending"
                          ? "pending-status"
                          : "progress-status"
                      }`}
                    >
                      {item.status}
                    </div>

                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;