const BASE_URL = "http://localhost:5000/complaints";


// GET

export const getComplaints = async () => {
  const res = await fetch(BASE_URL);

  return await res.json();
};


// CREATE

export const createComplaint = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};


// UPDATE STATUS

export const updateComplaintStatus = async (
  id,
  status
) => {

  const res = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  return await res.json();
};