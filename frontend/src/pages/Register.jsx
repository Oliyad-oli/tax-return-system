import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    fullName: "",
    email: "",
    password: "",
    role: "TAXPAYER"

  });

  const handleChange = (e) => {

    setFormData({

      ...formData,
      [e.target.name]: e.target.value

    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await registerUser(
        formData
      );

      alert(res.data);

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data ||
        "Registration Failed"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-blue-900">
            TAX RETURN SYSTEM
          </h1>

          <p className="text-gray-500 mt-2">
            Create Your Account
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="TAXPAYER">
              Taxpayer
            </option>

            <option value="ADMIN">
              Admin
            </option>

          </select>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition"
          >
            Register
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-700 font-semibold ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;