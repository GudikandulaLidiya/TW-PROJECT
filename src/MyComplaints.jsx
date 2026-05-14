import React, { useEffect, useState } from "react";
import "./MyComplaints.css";
import { Link } from "react-router-dom";
import { getComplaints } from "./api";

function MyComplaints() {
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

  const handleDelete = async (id) => {
  try {
    await fetch(`http://localhost:5000/complaints/${id}`, {
      method: "DELETE",
    });

    setComplaints((prev) => prev.filter((c) => c.id !== id));
  } catch (error) {
    console.log(error);
  }
};

  return (
  <div className="complaints-container">
      {/* Sidebar */}
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

      {/* Main Content */}
    <div className="complaints-main">
        <h1>My Complaints</h1>
        <p>Track your complaints status</p>

        {/* LOADING STATE */}
        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found</p>
        ) : (
          complaints.map((item, index) => (
<div className="complaint-card" key={item._id || item.id || index}>
              <img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1581091215367-59ab6dcef10d?q=80&w=400"
                }
                alt="complaint"
              />

<div className="complaint-content">
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
                  onClick={() => alert("Complaint Details")}
                >
                  ➜
                </button>
                <button
  className="delete-btn"
  onClick={() => handleDelete(item.id)}
>
  🗑
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