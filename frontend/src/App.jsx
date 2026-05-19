import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Taxpayer Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/daily-return" element={
          <ProtectedRoute>
            <DailyReturn />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <ReturnHistory />
          </ProtectedRoute>
        } />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manage-taxpayers" element={
          <ProtectedRoute requiredRole="ADMIN">
            <ManageTaxpayers />
          </ProtectedRoute>
        } />
        <Route path="/all-returns" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AllReturns />
          </ProtectedRoute>
        } />
        
        {/* Protected Common Routes */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;