import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ children }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "ADMIN";

  return (

    <div className="flex">

      <Sidebar isAdmin={isAdmin} />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Topbar />

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Layout;