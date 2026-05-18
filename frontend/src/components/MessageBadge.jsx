import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MessageBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/unread/${user.email}`);
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  if (unreadCount === 0) return null;

  return (
    <Link to="/messages" className="relative">
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    </Link>
  );
}

export default MessageBadge;