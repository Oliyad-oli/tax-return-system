import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";

function Dashboard() {

  return (
    <Layout>

      <h1 className="text-3xl font-bold mb-8">
        TAXPAYER DASHBOARD
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <DashboardCard
          title="Filed Returns"
          value="12"
        />

        <DashboardCard
          title="Pending Returns"
          value="2"
        />

        <DashboardCard
          title="Messages"
          value="5"
        />

      </div>

    </Layout>
  );
}

export default Dashboard;