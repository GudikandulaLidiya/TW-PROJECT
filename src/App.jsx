import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserDashboard from "./UserDashboard";
import MyComplaints from "./MyComplaints";
import CreateComplaint from "./CreateComplaint";
import AdminDashboard from "./AdminDashboard";
import AllComplaints from "./AllComplaints";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* USER DASHBOARD */}
        <Route path="/" element={<UserDashboard />} />

        {/* USER FEATURES */}
        <Route path="/mycomplaints" element={<MyComplaints />} />
        <Route path="/create" element={<CreateComplaint />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/complaints" element={<AllComplaints />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;