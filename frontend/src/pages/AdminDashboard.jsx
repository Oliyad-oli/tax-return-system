import Layout from "../components/Layout";

function AdminDashboard() {

  return (

    <Layout>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">

          <h1 className="text-xl font-bold mb-2">
            TOTAL RETURNS
          </h1>

          <p className="text-3xl font-bold text-blue-700">
            120
          </p>

        </div>

        <div className="bg-white p-6 rounded-xl shadow">

          <h1 className="text-xl font-bold mb-2">
            FLAGGED RETURNS
          </h1>

          <p className="text-3xl font-bold text-yellow-600">
            14
          </p>

        </div>

        <div className="bg-white p-6 rounded-xl shadow">

          <h1 className="text-xl font-bold mb-2">
            REJECTED RETURNS
          </h1>

          <p className="text-3xl font-bold text-red-600">
            5
          </p>

        </div>

      </div>

    </Layout>
  );
}

export default AdminDashboard;