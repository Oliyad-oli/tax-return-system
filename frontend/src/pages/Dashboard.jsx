import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalSubmitted: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
    totalAmount: 0,
    recentReturns: [],
    unreadNotifications: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/taxpayer-stats/${user.email}`);
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="text-xl text-gray-600">Loading your dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Taxpayer specific styling */}
      <div className="taxpayer-dashboard">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Taxpayer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.fullName || user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">TOTAL SUBMITTED</p>
                <p className="text-3xl font-bold mt-2">{stats.totalSubmitted}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">APPROVED</p>
                <p className="text-3xl font-bold mt-2">{stats.approved}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">FLAGGED</p>
                <p className="text-3xl font-bold mt-2">{stats.flagged}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm">TOTAL TAX</p>
                <p className="text-3xl font-bold mt-2">${stats.totalAmount.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/daily-return" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold mb-2">Submit Return</h3>
            <p className="text-gray-600">Submit your daily tax return with e-invoice validation</p>
            <div className="mt-4 text-blue-600 font-semibold">Submit Now →</div>
          </Link>

          <Link to="/history" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-4xl mb-3">📜</div>
            <h3 className="text-xl font-bold mb-2">Return History</h3>
            <p className="text-gray-600">View all your submitted returns and their status</p>
            <div className="mt-4 text-blue-600 font-semibold">View History →</div>
          </Link>

          <Link to="/messages" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1 relative">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold mb-2">Messages</h3>
            <p className="text-gray-600">Communicate with tax authorities</p>
            {stats.unreadMessages > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {stats.unreadMessages}
              </div>
            )}
            <div className="mt-4 text-blue-600 font-semibold">View Messages →</div>
          </Link>
        </div>

        {/* Recent Returns */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Returns</h2>
            <Link to="/history" className="text-blue-600 hover:text-blue-800">View All →</Link>
          </div>
          
          {stats.recentReturns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No returns submitted yet</p>
              <Link to="/daily-return" className="text-blue-600 mt-2 inline-block">Submit your first return →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Invoice #</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentReturns.map((returnItem) => (
                    <tr key={returnItem.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{returnItem.invoiceNumber}</td>
                      <td className="p-3">${returnItem.amount}</td>
                      <td className="p-3">{returnItem.submissionDate}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          returnItem.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          returnItem.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {returnItem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notifications Alert */}
        {stats.unreadNotifications > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔔</div>
              <div className="flex-1">
                <p className="font-semibold">You have {stats.unreadNotifications} unread notification(s)</p>
                <p className="text-sm text-gray-600">Check your notifications for important updates</p>
              </div>
              <Link to="/notifications" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;