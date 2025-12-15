import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/Signup.jsx";
import JobCard from "./components/JobCard.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";  


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/job" element={<JobCard />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
