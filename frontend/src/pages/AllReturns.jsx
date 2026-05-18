import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

function AllReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedReturn, setSelectedReturn] = useState(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/all-returns");
      setReturns(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateReturnStatus = async (id, status, comment) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/returns/${id}/status`, null, {
        params: { status, comment }
      });
      fetchReturns();
      alert(`Return ${status} successfully`);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const filteredReturns = filter === "ALL" 
    ? returns 
    : returns.filter(r => r.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case "APPROVED": return "text-green-600 bg-green-100";
      case "REJECTED": return "text-red-600 bg-red-100";
      case "FLAGGED": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading returns...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">📑 All Returns</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded ${filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("APPROVED")}
            className={`px-4 py-2 rounded ${filter === "APPROVED" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("REJECTED")}
            className={`px-4 py-2 rounded ${filter === "REJECTED" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          >
            Rejected
          </button>
          <button
            onClick={() => setFilter("FLAGGED")}
            className={`px-4 py-2 rounded ${filter === "FLAGGED" ? "bg-yellow-600 text-white" : "bg-gray-200"}`}
          >
            Flagged
          </button>
        </div>

        {/* Returns Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Taxpayer</th>
                <th className="p-3 text-left">Invoice #</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Risk Level</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((returnItem) => (
                <tr key={returnItem.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{returnItem.id}</td>
                  <td className="p-3">{returnItem.user?.fullName || returnItem.user?.email}</td>
                  <td className="p-3">{returnItem.invoiceNumber}</td>
                  <td className="p-3">${returnItem.amount}</td>
                  <td className="p-3">{returnItem.submissionDate}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded ${getStatusColor(returnItem.status)}`}>
                      {returnItem.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded ${
                      returnItem.riskLevel === "HIGH" ? "bg-red-100 text-red-600" :
                      returnItem.riskLevel === "MEDIUM" ? "bg-yellow-100 text-yellow-600" :
                      "bg-green-100 text-green-600"
                    }`}>
                      {returnItem.riskLevel}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedReturn(returnItem)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Review
                      </button>
                      {returnItem.status === "FLAGGED" && (
                        <>
                          <button
                            onClick={() => {
                              const comment = prompt("Enter approval comment:");
                              if (comment) updateReturnStatus(returnItem.id, "APPROVED", comment);
                            }}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const comment = prompt("Enter rejection reason:");
                              if (comment) updateReturnStatus(returnItem.id, "REJECTED", comment);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Review Modal */}
        {selectedReturn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-w-full">
              <h2 className="text-2xl font-bold mb-4">Return Details</h2>
              <div className="space-y-2">
                <p><strong>Invoice:</strong> {selectedReturn.invoiceNumber}</p>
                <p><strong>Amount:</strong> ${selectedReturn.amount}</p>
                <p><strong>Description:</strong> {selectedReturn.description}</p>
                <p><strong>Attachment:</strong> {selectedReturn.attachmentName}</p>
                <p><strong>Status:</strong> {selectedReturn.status}</p>
                <p><strong>Risk Level:</strong> {selectedReturn.riskLevel}</p>
                <p><strong>Validation Message:</strong> {selectedReturn.validationMessage}</p>
                <p><strong>Submitted:</strong> {new Date(selectedReturn.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
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

export default AllReturns;