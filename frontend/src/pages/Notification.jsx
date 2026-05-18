import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0 });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/notifications/${user.email}`);
      setNotifications(res.data);
      
      const unreadCount = res.data.filter(n => !n.read).length;
      setStats({
        total: res.data.length,
        unread: unreadCount
      });
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/read/${id}`);
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      for (let notification of notifications.filter(n => !n.read)) {
        await axios.put(`http://localhost:8080/api/notifications/read/${notification.id}`);
      }
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">🔔 Notifications</h1>
            <p className="text-gray-600 mt-1">
              Total: {stats.total} | Unread: {stats.unread}
            </p>
          </div>
          {stats.unread > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Mark All as Read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No notifications yet</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-xl shadow border transition ${
                  item.read ? "bg-gray-50" : "bg-blue-50 border-blue-400 cursor-pointer hover:shadow-md"
                }`}
                onClick={() => !item.read && markAsRead(item.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className={`font-bold text-lg ${!item.read ? "text-blue-800" : ""}`}>
                      {item.title}
                    </h2>
                    <p className="mt-2 text-gray-700">{item.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {item.read ? (
                      <span className="text-green-600 font-semibold text-sm">✓ Read</span>
                    ) : (
                      <span className="text-red-600 font-semibold text-sm animate-pulse">● New</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Notification;