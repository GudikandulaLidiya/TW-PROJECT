import React, { useEffect, useState } from "react";
import "./users.css";
import { getUsers, getComplaints } from "./api";

import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
  FaHeadset,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  // GET USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(Array.isArray(data) ? data : data?.users || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  // GET ALL COMPLAINTS
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints();
        setComplaints(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComplaints();
  }, []);

  // CLICK USER → OPEN POPUP
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  // FILTER USER COMPLAINTS
  const userComplaints = selectedUser
    ? complaints.filter((c) => c.userId === selectedUser._id)
    : [];

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div>
          <h2>CivicTrack</h2>

          <ul>
            <li>
              <Link to="/adminDashboard">
                <FaHome /> <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/allComplaints">
                <FaClipboardList /> <span>All Complaints</span>
              </Link>
            </li>

            <li>
              <Link to="/users">
                <FaUsers /> <span>Users</span>
              </Link>
            </li>

            <li>
              <Link to="/login">
                <FaSignOutAlt /> <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="help-box">
          <FaHeadset size={40} />
          <h3>Need Help?</h3>
          <Link to="/support">Contact Support</Link>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        <h1>Users Management</h1>

        {/* USERS CARDS */}
        <div className="users-grid">
          {users.map((user) => (
            <div
              className="user-card"
              key={user._id}
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer" }}
            >
              <div className="user-avatar">
                {(user.username || user.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2>{user.username || user.name}</h2>
              <p>{user.email}</p>

              <span>{user.role || "Citizen"}</span>
            </div>
          ))}
        </div>

      </div>

      {/* POPUP MODAL */}
      {showPopup && selectedUser && (
        <div
          className="popup-overlay"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="popup-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              {selectedUser.username || selectedUser.name}'s Complaints
            </h2>
          <div className="popup-header">

  <h2 className="popup-title">All Complaints</h2>

<div className="popup-summary-icons">

  <div
    className="icon-box pending"
    onClick={() => setStatusFilter("Pending")}
  >
    ⏳ <b>{userComplaints.filter(c => c.status === "Pending").length}</b>
  </div>

  <div
    className="icon-box progress"
    onClick={() => setStatusFilter("In Progress")}
  >
    🔄 <b>{userComplaints.filter(c => c.status === "In Progress").length}</b>
  </div>

  <div
    className="icon-box resolved"
    onClick={() => setStatusFilter("Resolved")}
  >
    ✅ <b>{userComplaints.filter(c => c.status === "Resolved").length}</b>
  </div>

  <div
    className="icon-box all"
    onClick={() => setStatusFilter("All")}
  >
    📋 <b>{userComplaints.length}</b>
  </div>

</div>

</div>
            {userComplaints.length > 0 ? (
            <div className="complaint-grid">

{userComplaints
  .filter((c) => {
    if (statusFilter === "All") return true;
    return c.status === statusFilter;
  })
  .map((c) => (
    <div className="complaint-card" key={c._id}>

      {/* IMAGE */}
      {c.image && (
        <img
          src={`http://localhost:5000/uploads/${c.image}`}
          alt="complaint"
          className="complaint-img"
        />
      )}

      {/* TITLE */}
      <h3>{c.title}</h3>

      {/* STATUS */}
<p className={`status ${c.status?.replace(" ", "-").toLowerCase()}`}>
  {c.status}
</p>

      {/* VIEW ARROW */}
      <button
        className="view-arrow"
        onClick={() => setSelectedComplaint(c)}
      >
        ➜
      </button>

    </div>
  ))}

</div>
            ) : (
              <p>No complaints found for this user</p>
            )}

            <button
              className="close-btn"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
     
{/* COMPLAINT DETAILS POPUP (SECOND POPUP) */}
{selectedComplaint && (
  <div
    className="popup-overlay"
    onClick={() => setSelectedComplaint(null)}
  >
    <div
      className="popup-box"
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "500px",
        margin: "auto",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "absolute",
      }}
    >
      <h2>Complaint Details</h2>

      {/* ✅ IMAGE FIRST */}
      {selectedComplaint.image && (
        <img
          src={`http://localhost:5000/uploads/${selectedComplaint.image}`}
          alt="complaint"
          style={{
            width: "100%",
            borderRadius: "10px",
            marginBottom: "15px",
            objectFit: "cover"
          }}
        />
      )}

      {/* ✅ DETAILS BELOW */}
      <p><b>Title:</b> {selectedComplaint.title}</p>
      <p><b>Description:</b> {selectedComplaint.description}</p>
      <p><b>Location:</b> {selectedComplaint.location}</p>
      <p><b>Status:</b> {selectedComplaint.status}</p>
      <p><b>Category:</b> {selectedComplaint.category}</p>

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

export default Users;