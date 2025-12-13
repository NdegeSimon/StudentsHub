import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/Signup.jsx";
import JobCard from "./components/JobCard.jsx";
import JobsPage from "./pages/JobsPage.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/job" element={<JobCard />} />
        <Route path="/jobs" element={<JobsPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}
