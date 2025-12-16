import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import JobCard from "./components/JobCard.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";
import Settings from "./pages/Settings.jsx";
import Messages from "./pages/messages.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProfileProvider>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/job" element={<JobCard />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myapplications" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/messages" element={<Messages />} />
        
        <Route path="*" element={<NotFound />} />
        </Routes>
      </ProfileProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}
