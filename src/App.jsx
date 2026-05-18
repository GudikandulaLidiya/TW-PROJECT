import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./UserDashboard";
import MyComplaints from "./MyComplaints";
import CreateComplaint from "./CreateComplaint";
import AdminDashboard from "./AdminDashboard";
import Users from "./users";
import AllComplaints from "./AllComplaints";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  const isValidToken =
    token && token !== "undefined" && token !== "null";

  if (!isValidToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route
  path="/register"
  element={<Register />}
/>

        {/* USER */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}
        />

        <Route
          path="/mycomplaints"
          element={<ProtectedRoute><MyComplaints /></ProtectedRoute>}
        />

        <Route
          path="/create"
          element={<ProtectedRoute><CreateComplaint /></ProtectedRoute>}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
        />

        <Route
          path="/users"
          element={<ProtectedRoute><Users /></ProtectedRoute>}
        />

        <Route
          path="/complaints"
          element={<ProtectedRoute><AllComplaints /></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;