import React, { useEffect, useState } from "react";
import {
  getComplaints,
  deleteComplaint,
  updateComplaintStatus,
} from "./api";
import { useNavigate ,Link} from "react-router-dom";

import "./adminDashboard.css";

import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaBell,
  FaSignOutAlt,
  FaHeadset,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";

function AdminDashboard() {
  // NAVIGATION
  const navigate = useNavigate();

  
  // STATES
  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // FILTER STATES
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All Categories");

  const [searchTerm, setSearchTerm] =
    useState("");

  // TEMP FILTER STATES
  const [tempStatus, setTempStatus] =
    useState("All Status");

  const [
    tempCategory,
    setTempCategory,
  ] = useState("All Categories");

  const [tempSearch, setTempSearch] =
    useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);
    const [selectedComplaint, setSelectedComplaint] =
  useState(null);

const [showPopup, setShowPopup] =
  useState(false);
  const [activePage, setActivePage] = useState("dashboard");


  // FETCH DATA
  useEffect(() => {
    const fetchComplaints =
      async () => {
        try {
          setLoading(true);

          const data =
            await getComplaints();

          console.log(
            "Complaints API Data:",
            data
          );

          if (
            Array.isArray(data)
          ) {
            setComplaints(data);
          } else if (
            data?.complaints
          ) {
            setComplaints(
              data.complaints
            );
          } else {
            setComplaints([]);
          }
        } catch (error) {
          console.error(
            "Error fetching complaints:",
            error
          );

          setError(
            "Failed to fetch complaints"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchComplaints();
  }, []);

  // APPLY FILTER
  const handleFilter = () => {
    setStatusFilter(tempStatus);
    setCategoryFilter(
      tempCategory
    );
    setSearchTerm(tempSearch);

    setCurrentPage(1);
  };

  // UPDATE STATUS
  const handleUpdate = async (
    id,
    currentStatus
  ) => {
    let newStatus =
      currentStatus;

    if (
      currentStatus ===
      "Pending"
    ) {
      newStatus =
        "In Progress";
    } else if (
      currentStatus ===
      "In Progress"
    ) {
      newStatus =
        "Resolved";
    } else {
      return;
    }

    try {
      await updateComplaintStatus(
        id,
        newStatus
      );

      setComplaints(
        (prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  status:
                    newStatus,
                }
              : item
          )
      );
    } catch (error) {
      console.error(
        "Error updating status:",
        error
      );
    }
  };
  const handleView = (complaint) => {
    console.log(complaint);
  setSelectedComplaint(complaint);
  setShowPopup(true);
};

  // FILTER LOGIC
 const filteredComplaints = (
  Array.isArray(complaints)
    ? complaints
    : []
).filter((item) => {

  const statusMatch =
    statusFilter === "All Status" ||
    item?.status === statusFilter;

  const categoryMatch =
    categoryFilter === "All Categories" ||
    item?.category === categoryFilter;

  const searchMatch =
    (item?.title || "")
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase()) ||

    (item?.username || "")
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase()) ||

    (item?.location || "")
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase());

  return (
    statusMatch &&
    categoryMatch &&
    searchMatch
  );
});
  // PAGINATION
  const complaintsPerPage = 10;

  const indexOfLastComplaint =
    currentPage *
    complaintsPerPage;

  const indexOfFirstComplaint =
    indexOfLastComplaint -
    complaintsPerPage;

  const currentComplaints =
    filteredComplaints.slice(
      indexOfFirstComplaint,
      indexOfLastComplaint
    );

  const totalPages =
    Math.ceil(
      filteredComplaints.length /
        complaintsPerPage
    );

  // COUNTS
  const total =
    complaints.length;

  const pending =
    complaints.filter(
      (i) =>
        i?.status ===
        "Pending"
    ).length;

  const progress =
    complaints.filter(
      (i) =>
        i?.status ===
        "In Progress"
    ).length;

  const resolved =
    complaints.filter(
      (i) =>
        i?.status ===
        "Resolved"
    ).length;

  // LOADING
  if (loading) {
    return (
      <h2
        style={{
          textAlign:
            "center",
        }}
      >
        Loading...
      </h2>
    );
  }

  // ERROR
  if (error) {
    return (
      <h2
        style={{
          textAlign:
            "center",
        }}
      >
        {error}
      </h2>
    );
  }
  const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this complaint?"
    );

  if (!confirmDelete) return;

  try {

    await deleteComplaint(id);

    setComplaints((prev) =>
      prev.filter(
        (item) => item._id !== id
      )
    );

  } catch (error) {

    console.error(
      "Delete failed:",
      error
    );

  }
};

 return (
  <>
    <div className="dashboard">
      {/* SIDEBAR */}
      <div className="sidebar">  
        <div>
          
<h2>CivicTrack</h2>
          <ul>
            <li>
              <Link to="/adminDashboard">
                <FaHome />  <span>
                Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/Complaints">
            <FaClipboardList />    
                       <span>
                  All Complaints
                </span>
              </Link>
            </li>

            <li>
              <Link to="/users">
         <FaUsers />    <span>

                Users
                </span>
              </Link>
            </li>

            <li>
              <Link to="/login">
              <FaSignOutAlt />   <span>
                Logout  </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* HELP BOX */}
        <div className="help-box">
          <FaHeadset size={40} />

          <h3>
            Need Help?
          </h3>

          <Link to="/support">
            Contact Support
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <h1>
            Admin Dashboard
          </h1>

        </div>

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <FaClipboardList
              size={35}
              color="#2563eb"
            />
            <h3>
              Total
              Complaints
            </h3>
            <p>{total}</p>
          </div>

          <div className="card">
            <FaClock
              size={35}
              color="orange"
            />
            <h3>
              Pending
            </h3>
            <p>
              {pending}
            </p>
          </div>

          <div className="card">
            <FaExclamationCircle
              size={35}
              color="#f59e0b"
            />
            <h3>
              In Progress
            </h3>
            <p>
              {progress}
            </p>
          </div>

          <div className="card">
            <FaCheckCircle
              size={35}
              color="green"
            />
            <h3>
              Resolved
            </h3>
            <p>
              {resolved}
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters">
          <select
            value={
              tempStatus
            }
            onChange={(e) =>
              setTempStatus(
                e.target.value
              )
            }
          >
            <option>
              All Status
            </option>
            <option>
              Pending
            </option>
            <option>
              In Progress
            </option>
            <option>
              Resolved
            </option>
          </select>

          <select
            value={
              tempCategory
            }
            onChange={(e) =>
              setTempCategory(
                e.target.value
              )
            }
          >
            <option>
              All Categories
            </option>
            <option>
              Roads
            </option>
            <option>
              Sanitation
            </option>
            <option>
              Water
            </option>
          </select>

          {/* SINGLE DATE FIELD */}
          <div className="date-box">
            <FaCalendarAlt />
            <input type="date" />
          </div>

         <input
  type="text"
  placeholder="Search complaints..."
  className="search"
  value={tempSearch}
  onChange={(e) => {
    const value = e.target.value;

    setTempSearch(value);

    setSearchTerm(value);
  }}
/>

          <button
            className="filter-btn"
            onClick={
              handleFilter
            }
          >
            <FaFilter />
            Filter
          </button>
        </div>

        {/* TABLE */}
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>
                  Complaint
                </th>
                <th>User</th>
                <th>
                  Category
                </th>
                <th>
                  Location
                </th>
                <th>
                  Status
                </th>
                <th>Date</th>
                <th>
                  Action
                </th>
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>

   <tbody>
  {currentComplaints.length > 0 ? (
    currentComplaints.map((item, index) => (
      <tr
        key={item?._id || index}
      >
        <td>
          {indexOfFirstComplaint +
            index +
            1}
        </td>

        <td>
          {item?.title || "N/A"}
        </td>

        <td>
          {item?.username ||
            "Unknown"}
        </td>

        <td>
          {item?.category || "N/A"}
        </td>

        <td>
          {item?.location || "N/A"}
        </td>

        <td>
          <span
            className={
              item?.status ===
              "Pending"
                ? "pending"
                : item?.status ===
                  "In Progress"
                ? "progress"
                : "resolved"
            }
          >
            {item?.status}
          </span>
        </td>

        <td>
          {item?.date
            ? new Date(
                item.date
              ).toLocaleDateString(
                "en-IN"
              )
            : "N/A"}
        </td>

        <td>
          <button
            className="update-btn"
            disabled={
              item?.status ===
              "Resolved"
            }
            onClick={() =>
              handleUpdate(
                item._id,
                item.status
              )
            }
          >
            {item?.status ===
            "Resolved"
              ? "Done"
              : "Update"}
          </button>
        </td>

        <td>
          <button
            className="view-btn"
            onClick={() =>
              handleView(item)
            }
          >
            ➜
          </button>
        </td>

        <td>
          <button
            className="delete-btn"
            onClick={() =>
              handleDelete(item._id)
            }
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="10"
        style={{
          textAlign: "center",
        }}
      >
        No complaints found
      </td>
    </tr>
  )}
</tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination">
            <button
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (
                    prev
                  ) =>
                    prev -
                    1
                )
              }
            >
              Previous
            </button>

            <span>
              Page{" "}
              {totalPages ===
              0
                ? 0
                : currentPage}{" "}
              of{" "}
              {
                totalPages
              }
            </span>

            <button
              disabled={
                currentPage ===
                  totalPages ||
                totalPages ===
                  0
              }
              onClick={() =>
                setCurrentPage(
                  (
                    prev
                  ) =>
                    prev +
                    1
                )
              }
            >
              Next
            </button>
          </div>
         </div>
      </div>
    </div>

    {showPopup && selectedComplaint && (
      <div
        className="popup-overlay"
        onClick={() =>
          setShowPopup(false)
        }
      >
     <div
  className="popup-box"
  onClick={(e) =>
    e.stopPropagation()
  }
>

  <h2>Complaint Details</h2>

  {/* IMAGE FIRST */}
  {selectedComplaint.image && (
    <img
src={`http://localhost:5000/uploads/${selectedComplaint.image}`}
      alt="Complaint"
      className="popup-image"
    />
  )}

  <p>
    <strong>Title:</strong>{" "}
    {selectedComplaint.title}
  </p>

  <p>
    <strong>Description:</strong>{" "}
    {selectedComplaint.description}
  </p>

  <p>
    <strong>Category:</strong>{" "}
    {selectedComplaint.category}
  </p>

  <p>
    <strong>Location:</strong>{" "}
    {selectedComplaint.location}
  </p>

  <p>
    <strong>Status:</strong>{" "}
    {selectedComplaint.status}
  </p>

  <button
    className="close-btn"
    onClick={() =>
      setShowPopup(false)
    }
  >
    Close
  </button>

</div>
      </div>
    )}
  </>
);
}

export default AdminDashboard;

