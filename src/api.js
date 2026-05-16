const BASE_URL = "http://localhost:5000/complaints";

// ---------------- GET ALL COMPLAINTS ----------------
export const getComplaints = async () => {
  const res = await fetch(BASE_URL);
  return await res.json();
};

// ---------------- CREATE COMPLAINT (WITH TOKEN) ----------------
export const createComplaint = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return await res.json();
};

// ---------------- UPDATE STATUS ----------------
export const updateComplaintStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return await res.json();
};

// ---------------- LOGIN ----------------
export const loginUser = async (data) => {
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};

export const getMyComplaints = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/mycomplaints", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};
export const submitFeedback = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/complaints/feedback/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return await res.json();
};
export const deleteComplaint = async (id) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/complaints/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};