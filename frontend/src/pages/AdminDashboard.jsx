import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Chart from "../components/Chart";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalReturns: 0,
    flaggedReturns: 0,
    rejectedReturns: 0,
    approvedReturns: 0,
    chartData: [],
    recentReturns: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/dashboard-stats");
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
          <div className="text-xl text-gray-600">Loading dashboard data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Admin specific styling */}
      <div className="admin-dashboard">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🛡️ Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, Administrator</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">TOTAL RETURNS</p>
                <p className="text-3xl font-bold mt-2">{stats.totalReturns}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <div className="mt-4 text-blue-100 text-sm">All time submissions</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">APPROVED RETURNS</p>
                <p className="text-3xl font-bold mt-2">{stats.approvedReturns}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <div className="mt-4 text-green-100 text-sm">Successfully processed</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">FLAGGED RETURNS</p>
                <p className="text-3xl font-bold mt-2">{stats.flaggedReturns}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
            <div className="mt-4 text-yellow-100 text-sm">Require inspection</div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">REJECTED RETURNS</p>
                <p className="text-3xl font-bold mt-2">{stats.rejectedReturns}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
            <div className="mt-4 text-red-100 text-sm">Needs correction</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Monthly Returns Trend</h2>
            {stats.chartData && stats.chartData.length > 0 ? (
              <Chart data={stats.chartData} type="bar" title="Returns by Month" />
            ) : (
              <div className="text-center py-12 text-gray-500">No data available for chart</div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
                👥 Manage Taxpayers
              </button>
              <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                📑 Review Flagged Returns
              </button>
              <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition">
                💬 View Messages
              </button>
            </div>
          </div>
        </div>

        {/* Recent Returns Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Returns</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Taxpayer</th>
                  <th className="p-3 text-left">Invoice</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentReturns.map((returnItem) => (
                  <tr key={returnItem.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{returnItem.id}</td>
                    <td className="p-3">{returnItem.user?.fullName || returnItem.user?.email}</td>
                    <td className="p-3">{returnItem.invoiceNumber}</td>
                    <td className="p-3">${returnItem.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        returnItem.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        returnItem.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {returnItem.status}
                      </span>
                    </td>
                    <td className="p-3">{returnItem.submissionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;