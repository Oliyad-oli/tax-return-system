import { NavLink } from "react-router-dom";

function Sidebar({ isAdmin }) {

  return (

    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-8">
        TAX SYSTEM
      </h1>

      <div className="space-y-3">

        {/* TAXPAYER MENUS (Visible only to non-admin users) */}
        {!isAdmin && (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`
              }
            >
              📊 Dashboard
            </NavLink>

            <NavLink
              to="/daily-return"
              className={({ isActive }) =>
                `block p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`
              }
            >
              📝 Submit Return
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `block p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`
              }
            >
              📜 Return History
            </NavLink>

            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `block p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`
              }
            >
              💬 Messages
            </NavLink>
          </>
        )}

        {/* ADMIN MENUS (Visible only to admin users) */}
        {isAdmin && (
          <>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `block p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`
              }
            >
              🛡️ Admin Dashboard
            </NavLink>

            <NavLink
              to="/manage-taxpayers"
              className={({ isActive }) =>
                `block p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`
              }
            >
              👥 Manage Taxpayers
            </NavLink>

            <NavLink
              to="/all-returns"
              className={({ isActive }) =>
                `block p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`
              }
            >
              📑 All Returns
            </NavLink>

            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `block p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`
              }
            >
              💬 Messages
            </NavLink>
          </>
        )}

        {/* COMMON MENUS (Visible to both Admin and Taxpayer) */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `block p-3 rounded-xl transition ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-gray-800"
            }`
          }
        >
          🔔 Notifications
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `block p-3 rounded-xl transition ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-gray-800"
            }`
          }
        >
          ⚙️ Settings
        </NavLink>

      </div>

    </div>
  );
}

export default Sidebar;