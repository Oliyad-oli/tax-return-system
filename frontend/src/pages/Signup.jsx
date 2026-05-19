import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    try {
      await signup(formData);
      alert("Signup Successful");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data || "Signup Failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-xl w-96"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          TAXPAYER REGISTER
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

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
          placeholder="Password (min 4 characters)"
          value={formData.password}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-3 rounded hover:bg-blue-800 transition"
        >
          REGISTER
        </button>

        <p className="mt-4 text-center">
          Already have account?
          <Link
            to="/"
            className="text-blue-700 ml-1 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;