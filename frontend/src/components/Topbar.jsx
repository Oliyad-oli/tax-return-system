function Topbar() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between">

      <h1 className="text-2xl font-bold">
        Welcome, {user?.fullName}
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}

export default Topbar;