export const addComplaint = async (complaintData) => {
  const response = await fetch("http://localhost:5000/complaints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(complaintData),
  });

  return response.json();
};

export const getComplaints = async () => {
  const response = await fetch("http://localhost:5000/complaints");

  return response.json();
};