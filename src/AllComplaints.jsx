import React, { useEffect, useState } from "react";
import "./AllComplaints.css";
import { getComplaints, updateComplaintStatus } from "./api";

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredComplaints = complaints.filter((item) => {
    const statusMatch =
      statusFilter === "All Status" || item.status === statusFilter;

    const categoryMatch =
      categoryFilter === "All Categories" || item.category === categoryFilter;

    const searchMatch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && categoryMatch && searchMatch;
  });

  return (
    <div className="all-complaints-container">
      <h1 className="all-complaints-title">
        All Complaints
      </h1>

      <div className="filters-section">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All Categories</option>
          <option>Roads</option>
          <option>Sanitation</option>
          <option>Water</option>
        </select>

        <input
          type="text"
          placeholder="Search complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
      </div>
       
        <div className="table-container"> 
        <table className="complaints-table">
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
            {filteredComplaints.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
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
                 <button className="update-btn" onClick={() => handleUpdate(item._id, item.status)}
>
                 Update
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllComplaints;