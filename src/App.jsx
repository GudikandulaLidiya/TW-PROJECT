import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserDashboard from "./UserDashboard";
import MyComplaints from "./MyComplaints";
import CreateComplaint from "./CreateComplaint";

import AdminDashboard from "./AdminDashboard";
import Users from "./users";
import AllComplaints from "./AllComplaints";

function ProtectedRoute({
  children,
}) {

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        {/* RESET PASSWORD */}
        <Route
          path="/reset-password/:token"
          element={
            <ResetPassword />
          }
        />
        <Route
  path="/register"
  element={<Register />}
/>

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mycomplaints"
          element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <AllComplaints />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;