import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION: Check if fields are empty
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      const res = await login(formData);

      // Check if login was successful
      if (!res.data || !res.data.role) {
        setError("Invalid credentials");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      alert("Login Successful");

      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data || "Login Failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-xl w-96"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          E-FILING PORTAL
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-3 rounded hover:bg-blue-800 transition"
        >
          LOGIN
        </button>

        <p className="mt-4 text-center">
          No account?
          <Link
            to="/signup"
            className="text-blue-700 ml-1 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;