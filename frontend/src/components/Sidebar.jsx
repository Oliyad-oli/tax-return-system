import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ isAdmin }) {
  const [flaggedCount, setFlaggedCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (isAdmin && user) {
      fetchFlaggedCount();
    }
  }, [isAdmin, user]);

  const fetchFlaggedCount = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/flagged-count");
      setFlaggedCount(res.data.count);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-8">TAX SYSTEM</h1>

      <div className="space-y-3">
        {/* TAXPAYER MENUS */}
        {!isAdmin && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/daily-return" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              📝 Submit Return
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              📜 Return History
            </NavLink>
            <NavLink to="/messages" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              💬 Messages
            </NavLink>
          </>
        )}

        {/* ADMIN MENUS */}
        {isAdmin && (
          <>
            <NavLink to="/admin" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              🛡️ Admin Dashboard
            </NavLink>
            <NavLink to="/manage-taxpayers" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              👥 Manage Taxpayers
            </NavLink>
            <NavLink to="/all-returns" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              📑 All Returns
              {flaggedCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {flaggedCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/messages" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              💬 Messages
            </NavLink>
          </>
        )}

        {/* COMMON MENUS */}
        <NavLink to="/notifications" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
          🔔 Notifications
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `block p-3 rounded-xl transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}>
          ⚙️ Settings
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;