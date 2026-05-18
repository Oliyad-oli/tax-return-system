import { useNavigate } from "react-router-dom";
import NotificationBadge from "./NotificationBadge";
import MessageBadge from "./MessageBadge";

function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">
        Welcome, {user?.fullName || user?.email}
      </h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="text-gray-600 hover:text-gray-800 text-2xl">
            🔔
          </button>
          <NotificationBadge />
        </div>
        <div className="relative">
          <button className="text-gray-600 hover:text-gray-800 text-2xl">
            💬
          </button>
          <MessageBadge />
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;