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

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await signup(formData);

      alert("Signup Successful");

      navigate("/");

    } catch (error) {

      alert("Signup Failed");
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

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-3 rounded"
        >
          REGISTER
        </button>

        <p className="mt-4 text-center">

          Already have account?

          <Link
            to="/"
            className="text-blue-700 ml-1"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Signup;