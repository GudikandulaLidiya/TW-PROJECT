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

  const recent = [...complaints].slice(-3).reverse();

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

          <li>
            <button onClick={() => alert("Logged out")}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="main-content">
        <h1>Welcome User 👋</h1>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            {/* CARDS */}
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
            </div>

            {/* RECENT */}
        

            {recent.length === 0 ? (
              <p>No complaints yet</p>
            ) : (
              recent.map((item, index) => (
                <div
                  className="complaint-card"
                  key={item.id || item._id || index}
                >
                  <h3>{item.title}</h3>
                  <p>{item.location}</p>
                  <p>{item.status}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;