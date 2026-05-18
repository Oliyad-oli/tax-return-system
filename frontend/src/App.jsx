import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DailyReturn from "./pages/DailyReturn";
import ReturnHistory from "./pages/ReturnHistory";
import AdminDashboard from "./pages/AdminDashboard";
import Notification from "./pages/Notification";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ManageTaxpayers from "./pages/ManageTaxpayers";
import AllReturns from "./pages/AllReturns";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daily-return" element={<DailyReturn />} />
        <Route path="/history" element={<ReturnHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manage-taxpayers" element={<ManageTaxpayers />} />
        <Route path="/all-returns" element={<AllReturns />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;