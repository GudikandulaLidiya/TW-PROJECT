const BASE_URL = "http://localhost:5000/complaints";

export const getComplaints = async () => {
  const res = await fetch(BASE_URL);
  return await res.json();
};

export const createComplaint = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};