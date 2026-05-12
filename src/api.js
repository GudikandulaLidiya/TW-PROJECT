export const addComplaint = async (formData) => {
  const response = await fetch("http://localhost:5000/complaints", {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export const getComplaints = async () => {
  const response = await fetch("http://localhost:5000/complaints");

  return response.json();
};