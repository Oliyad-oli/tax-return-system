import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (

    <Layout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">

          Welcome,
          <span className="text-blue-700 ml-2">
            {user?.fullName}
          </span>

        </h1>

        <p className="text-gray-500 mt-2">
          Taxpayer E-Filing Portal Dashboard
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Register Daily Return
          </h2>

          <p className="text-gray-500 mb-6">
            Submit your daily tax return
            using validated e-invoice data.
          </p>

          <Link
            to="/daily-return"
            className="bg-blue-700 text-white px-5 py-3 rounded-lg inline-block"
          >
            Open
          </Link>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Return History
          </h2>

          <p className="text-gray-500 mb-6">
            View your submitted returns,
            statuses, and notifications.
          </p>

          <Link
            to="/history"
            className="bg-green-600 text-white px-5 py-3 rounded-lg inline-block"
          >
            View History
          </Link>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Notifications
          </h2>

          <p className="text-gray-500 mb-6">
            Tax compliance updates,
            alerts, and announcements.
          </p>

          <button
            className="bg-yellow-500 text-white px-5 py-3 rounded-lg"
          >
            Coming Soon
          </button>

        </div>

      </div>

    </Layout>
  );
}

export default Dashboard;