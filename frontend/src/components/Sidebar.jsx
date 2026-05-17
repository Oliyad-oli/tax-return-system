import { Link } from "react-router-dom";

function Sidebar() {

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-10">
        E-FILING PORTAL
      </h1>

      <div className="flex flex-col gap-5">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/daily-return">
          Register Return
        </Link>

        <Link to="/return-history">
          Filing History
        </Link>

      </div>

    </div>
  );
}

export default Sidebar;