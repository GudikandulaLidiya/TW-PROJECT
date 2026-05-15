import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import UserDashboard from "./UserDashboard";
import MyComplaints from "./MyComplaints";
import CreateComplaint from "./CreateComplaint";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
       <Route path="/" element={<UserDashboard />} />

        {/* USER DASHBOARD */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* CREATE COMPLAINT */}
        <Route path="/create" element={<CreateComplaint />} />

        {/* MY COMPLAINTS */}
        <Route path="/mycomplaints" element={<MyComplaints />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;