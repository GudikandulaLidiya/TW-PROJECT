import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyComplaints from "./MyComplaints";
import CreateComplaint from "./CreateComplaint";
import UserDashboard from "./UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyComplaints />} />

        <Route path="/create" element={<CreateComplaint />} />

        <Route path="/admin" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;