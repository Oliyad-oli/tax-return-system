import { Link } from "react-router-dom";

function Sidebar() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (

    <div className="w-64 bg-blue-950 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-10">
        TAX SYSTEM
      </h1>

      <ul className="space-y-4">

        <li>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </li>

        {
          user?.role === "TAXPAYER" && (
            <>
              <li>
                <Link to="/daily-return">
                  Register Return
                </Link>
              </li>

              <li>
                <Link to="/history">
                  Return History
                </Link>
              </li>
            </>
          )
        }

        {
          user?.role === "ADMIN" && (
            <>
              <li>
                <Link to="/admin">
                  Admin Dashboard
                </Link>
              </li>
            </>
          )
        }

      </ul>

    </div>
  );
}

export default Sidebar;