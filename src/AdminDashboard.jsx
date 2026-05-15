import React, { useEffect, useState } from "react";
import { getComplaints, updateComplaintStatus } from "./api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaHeadset,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  
  FaExclamationCircle,
} from "react-icons/fa";

function AdminDashboard() {

  // NAVIGATION  
  const navigate = useNavigate();

  const handleDashboard = () => navigate("/dashboard");
  const handleComplaints = () => navigate("/complaints");
  const handleUsers = () => navigate("/users");
  const handleReports = () => navigate("/reports");
  const handleSettings = () => navigate("/settings");
  const handleNotifications = () => navigate("/notifications");
  const handleSupport = () => navigate("/support");
  const handleLogout = () => navigate("/dashboard");

  // COMPLAINTS DATA

  const [complaints, setComplaints] = useState([]);

  // FILTER STATES

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");

    // TEMP FILTER STATES

  const [tempStatus, setTempStatus] = useState("All Status");
  const [tempCategory, setTempCategory] = useState("All Categories");
  const [tempSearch, setTempSearch] = useState("");

      // PAGINATION STATE

  const [currentPage, setCurrentPage] = useState(1);

// FETCH DATA FROM BACKEND

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints();
        setComplaints(data);
      } catch (error) {
        console.log("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

    // APPLY FILTER BUTTON


  const handleFilter = () => {
    setStatusFilter(tempStatus);
    setCategoryFilter(tempCategory);
    setSearchTerm(tempSearch);

 // Reset to first page

    setCurrentPage(1);
  };

    // UPDATE STATUS

  const handleUpdate = async (id, currentStatus) => {
    let newStatus = currentStatus;

    if (currentStatus === "Pending") newStatus = "In Progress";
    else if (currentStatus === "In Progress") newStatus = "Resolved";

    try {
      await updateComplaintStatus(id, newStatus);

      setComplaints((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

    // FILTER LOGIC

const filteredComplaints = complaints.filter((item) => {

  const statusMatch =
    statusFilter === "All Status" ||
    item.status === statusFilter;

  const categoryMatch =
    categoryFilter === "All Categories" ||
    item.category === categoryFilter;

  const title = item.title || "";
  const user = item.user || "";
  const location = item.location || "";

  const searchMatch =
    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.toLowerCase().includes(searchTerm.toLowerCase());

  return statusMatch && categoryMatch && searchMatch;
});

  // PAGINATION LOGIC

  const complaintsPerPage = 10;
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;

  const currentComplaints = filteredComplaints.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

   // COUNTS

  const total = complaints.length;
  const pending = complaints.filter((i) => i.status === "Pending").length;
  const progress = complaints.filter((i) => i.status === "In Progress").length;
  const resolved = complaints.filter((i) => i.status === "Resolved").length;

  return (
    <div className="dashboard">

     {/*SIDEBAR */}
       
      <div className="sidebar">
        <div>
          <div className="logo-section">
            <FaCheckCircle size={35} color="#3b82f6" />
            <h2>CivicTrack</h2>
          </div>

          <div className="menu">
            <div className="menu-item active" onClick={handleDashboard}>
              <FaHome /> Dashboard
            </div>

            <div className="menu-item" onClick={handleComplaints}>
              <FaClipboardList /> All Complaints
            </div>

            <div className="menu-item" onClick={handleUsers}>
              <FaUsers /> Users
            </div>

            <div className="menu-item" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </div>
          </div>
        </div>

        <div className="help-box">
          <FaHeadset size={40} />
          <h3>Need Help?</h3>
          <button onClick={handleSupport}>Contact Support</button>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="main">

      {/* TOPBAR */}

        <div className="topbar">
          <h1>Admin Dashboard</h1>

          <div className="topbar-right">

            {/* NOTIFICATIONS */}

            <div className="notification-wrapper">
              <FaBell className="top-icon" onClick={handleNotifications} />

              <span className="notification-count">{pending}</span>
            </div>

            {/* ADMIN PROFILE */}

            <div className="admin-profile">
              <div className="admin-avatar">A</div>
              <div>
                <h4>Admin</h4>
                <p>Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD CARDS */}

        <div className="cards">
          <div className="card">
            <FaClipboardList size={35} color="#2563eb" />
            <h3>Total Complaints</h3>
            <p>{total}</p>
          </div>

          <div className="card">
            <FaClock size={35} color="orange" />
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>

        <div className="card">
  <FaSpinner size={35} color="#2563eb" />
  <h3>In Progress</h3>
  <p>{progress}</p>
</div>

          <div className="card">
            <FaCheckCircle size={35} color="green" />
            <h3>Resolved</h3>
            <p>{resolved}</p>
          </div>
        </div>

        <div className="filters">
          <select
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <select
            value={tempCategory}
            onChange={(e) => setTempCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Roads</option>
            <option>Sanitation</option>
            <option>Water</option>
          </select>

         <div className="date-box">
  <FaCalendarAlt />
  <input type="date" />
</div>
<input
  type="text"
  placeholder="Search complaints..."
  className="search"
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setTempSearch(e.target.value);
  }}
/>

          <button className="filter-btn" onClick={handleFilter}>
            <FaFilter /> Filter
          </button>
        </div>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Complaint</th>
                <th>User</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentComplaints.map((item, index) => (
                <tr key={item._id}>
                  <td>{indexOfFirstComplaint + index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.user}</td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>
                    <span
                      className={
                        item.status === "Pending"
                          ? "pending"
                          : item.status === "In Progress"
                          ? "progress"
                          : "resolved"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdate(item._id, item.status)}
                    >
                      update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <span>
              Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;