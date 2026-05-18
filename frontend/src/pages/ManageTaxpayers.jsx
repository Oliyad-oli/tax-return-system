import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

function ManageTaxpayers() {
  const [taxpayers, setTaxpayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTaxpayers();
  }, []);

  const fetchTaxpayers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/taxpayers");
      setTaxpayers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTaxpayer = async (id, email) => {
    if (window.confirm(`Are you sure you want to delete taxpayer: ${email}?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/taxpayers/${id}`);
        fetchTaxpayers();
        alert("Taxpayer deleted successfully");
      } catch (error) {
        console.error(error);
        alert("Failed to delete taxpayer");
      }
    }
  };

  const resetPassword = async (id, email) => {
    const newPassword = prompt(`Enter new password for ${email}:`);
    if (newPassword && newPassword.length >= 6) {
      try {
        await axios.put(`http://localhost:8080/api/admin/taxpayers/${id}/reset-password`, null, {
          params: { newPassword }
        });
        alert("Password reset successfully");
      } catch (error) {
        console.error(error);
        alert("Failed to reset password");
      }
    } else {
      alert("Password must be at least 6 characters");
    }
  };

  const viewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading taxpayers...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">👥 Manage Taxpayers</h1>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxpayers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewDetails(user)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => resetPassword(user.id, user.email)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => deleteTaxpayer(user.id, user.email)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for user details */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-w-full">
              <h2 className="text-2xl font-bold mb-4">Taxpayer Details</h2>
              <div className="space-y-2">
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Name:</strong> {selectedUser.fullName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ManageTaxpayers;