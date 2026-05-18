import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { getMyComplaints } from "./api";

function UserDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const complaintsPerPage = 5;

  // feedback state (persistent)
  const [uploadedFeedback, setUploadedFeedback] = useState(() => {
    const saved = localStorage.getItem("uploadedFeedback");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

const username =
  localStorage.getItem(
    "username"
  );

  // FETCH DATA
  const fetchData = async () => {
    setLoading(true);

    try {
      const data = await getMyComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FEEDBACK UPLOAD
const handleFeedbackUpload = async (file, complaintId) => {
  if (!file) return;

  try {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(
      `http://localhost:5000/complaints/feedback/${complaintId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    alert("Feedback uploaded successfully ✅");

    // update complaints instantly
    setComplaints((prev) =>
      prev.map((item) =>
        item._id === complaintId
          ? {
              ...item,
              feedbackImage: data.data.feedbackImage,
            }
          : item
      )
    );

    setUploadedFeedback((prev) => {
      const updated = new Set(prev);

      updated.add(complaintId);

      localStorage.setItem(
        "uploadedFeedback",
        JSON.stringify([...updated])
      );

      return updated;
    });

  } catch (err) {
    console.log(err);
    alert("Upload failed ❌");
  }
};

  // COUNTS
  const pending = complaints.filter((item) => item.status === "Pending").length;
  const resolved = complaints.filter((item) => item.status === "Resolved").length;

  const processing = complaints.filter(
    (item) => item.status === "In Progress" || item.status === "Processing"
  ).length;

  // FILTER
  let filteredComplaints = complaints;

  if (filter === "Pending") {
    filteredComplaints = complaints.filter((item) => item.status === "Pending");
  }

  if (filter === "Resolved") {
    filteredComplaints = complaints.filter((item) => item.status === "Resolved");
  }

  if (filter === "Processing") {
    filteredComplaints = complaints.filter(
      (item) => item.status === "In Progress" || item.status === "Processing"
    );
  }

  // SORT
  filteredComplaints = [...filteredComplaints].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // PAGINATION
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;

  const currentComplaints = filteredComplaints.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">

  <h2>CivicTrack</h2>

  <ul>

    <li>
      <Link to="/dashboard">
        Dashboard
      </Link>
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
      <button
        onClick={() => {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/");

        }}
      >
        Logout
      </button>
    </li>

  </ul>

  {/* HELP SECTION */}
  <div className="sidebar-help">

    <h3>Need Help?</h3>

    <p>
      Contact support for assistance
    </p>

    <button>
      Support
    </button>

  </div>

</div>
      {/* MAIN */}
      <div className="main-content">

        <div className="welcome-section">
          <h1>Welcome, {username || "User"} 👋</h1>
          <p>Here’s what’s happening in your community</p>
        </div>
        

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : (
          <>
            {/* CARDS */}
            <div className="cards">

              <div className="card total" onClick={() => { setFilter("All"); setCurrentPage(1); }}>
                📋 <h3>Total Complaints</h3>
                <p>{complaints.length}</p>
              </div>

              <div className="card pending-card" onClick={() => { setFilter("Pending"); setCurrentPage(1); }}>
                🕒 <h3>Pending</h3>
                <p>{pending}</p>
              </div>

              <div className="card progress-card" onClick={() => { setFilter("Processing"); setCurrentPage(1); }}>
                ⏳ <h3>In Progress</h3>
                <p>{processing}</p>
              </div>

              <div className="card resolved-card" onClick={() => { setFilter("Resolved"); setCurrentPage(1); }}>
                ✔ <h3>Resolved</h3>
                <p>{resolved}</p>
              </div>

            </div>

            {/* TABLE */}
            <div className="table-section">
              <div className="table-header">
                <h2>Recent Complaints</h2>
                <span className="filter-text">{filter}</span>
              </div>

              {currentComplaints.length === 0 ? (
                <div className="empty-box">No complaints found</div>
              ) : (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th className="action-column">Action</th>
                        <th className="view-column">View</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentComplaints.map((item, index) => {
                        const isUploaded = uploadedFeedback.has(item._id);

                        return (
                          <tr key={item._id || index}>
                            <td>{item.title}</td>

                            <td>
                              <span className={`status-badge ${
                                item.status === "Resolved"
                                  ? "resolved-status"
                                  : item.status === "Pending"
                                  ? "pending-status"
                                  : "progress-status"
                              }`}>
                                {item.status}
                              </span>
                            </td>

                            <td>{item.location}</td>

                            <td>
                              {item.date
                                ? new Date(item.date).toLocaleDateString()
                                : "No Date"}
                            </td>

                            {/* FEEDBACK */}
                            <td className="action-column">
                              <label htmlFor={`feedback-${index}`}>
                                <div
                                  className="feedback-btn"
                                  style={{
                                    opacity: isUploaded ? 0.5 : 1,
                                    pointerEvents: isUploaded ? "none" : "auto",
                                    cursor: isUploaded ? "not-allowed" : "pointer",
                                  }}
                                >
                                  {isUploaded ? "✔ Uploaded" : "📤 Feedback"}
                                </div>
                              </label>

                              <input
                                id={`feedback-${index}`}
                                type="file"
                                hidden
                                disabled={isUploaded}
                                onChange={(e) =>
                                  handleFeedbackUpload(
                                    e.target.files[0],
                                    item._id
                                  )
                                }
                              />
                            </td>

                            {/* VIEW */}
                            <td className="view-column">
                              <button
                                className="view-btn"
                                onClick={() => setSelectedComplaint(item)}
                              >
                                →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* PAGINATION */}
                  <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Prev
                    </button>

                    <span>
                      {totalPages === 0 ? 0 : currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={currentPage >= totalPages || totalPages === 0}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {selectedComplaint && (
        <div className="modal-overlay">
                {selectedComplaint && console.log(selectedComplaint.image)}

          <div className="modal-box">
            <h2>{selectedComplaint.title}</h2>
                  
          {/* SHOW ONLY ONE IMAGE */}
{selectedComplaint.feedbackImage ? (

  <>
    <h3 style={{ marginTop: "15px" }}>
      Feedback Image
    </h3>

    <img
      src={
        selectedComplaint.feedbackImage.startsWith("http")
          ? selectedComplaint.feedbackImage
          : `http://localhost:5000/uploads/${selectedComplaint.feedbackImage}`
      }
      alt="feedback"
      style={{
        width: "250px",
        maxHeight: "180px",
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "15px",
      }}
    />
  </>

) : selectedComplaint.image && (

  <>
    <h3 style={{ marginTop: "15px" }}>
      Complaint Image
    </h3>

    <img
      src={
        selectedComplaint.image.startsWith("http")
          ? selectedComplaint.image
          : `http://localhost:5000/uploads/${selectedComplaint.image}`
      }
      alt="complaint"
      style={{
        width: "250px",
        maxHeight: "180px",
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "15px",
      }}
    />
  </>
)}


<p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p><strong>Location:</strong> {selectedComplaint.location}</p>

            <button
              className="close-btn"
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserDashboard;