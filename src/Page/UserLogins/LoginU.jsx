import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginU() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve user data from localStorage
    const storedData = JSON.parse(localStorage.getItem("userData") || "null");

    // Ensure `storedData` is an array or an object and validate credentials
    let user = null;
    if (Array.isArray(storedData)) {
      // If storedData is an array, find the user
      user = storedData.find(
        (u) => u.email === formData.email && u.password === formData.password
      );
    } else if (
      storedData &&
      storedData.email === formData.email &&
      storedData.password === formData.password
    ) {
      // If storedData is a single object, match directly
      user = storedData;
    }

    if (user) {
      setMessage("Login successful!");
      localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store logged-in user details
      navigate("/employee");
    } else {
      setMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Employee Login</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-yellow-400 p-6 rounded-md shadow-lg flex flex-col gap-6 w-80"
      >
        <div className="text-xl font-bold text-blue-900">
          Welcome,
          <br />
          <span className="text-blue-800 text-base font-medium">
            Sign in to continue
          </span>
        </div>

        {/* Email Input */}
        <input
          className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password Input */}
        <input
          className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-32 mx-auto px-4 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none active:translate-y-1"
        >
          Let’s go →
        </button>
      </form>

      {/* Display Message */}
      {message && (
        <p className="mt-4 text-center text-blue-800 font-medium">{message}</p>
      )}

      {/* Signup Link */}
      <Link
        to="/user/signup"
        className="block mt-4 text-center text-blue-600 font-medium hover:underline"
      >
        Don’t have an account? Sign up
      </Link>
    </div>
  );
}

export default LoginU;
