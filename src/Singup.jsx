import React from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate(); // Hook for navigation

  function handleSubmit(e) {
    e.preventDefault();

    // Get form data
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // Store data in localStorage
    localStorage.setItem("admindata", JSON.stringify(data));

    // Redirect to login page after successful signup
    navigate("/admin/login"); // Redirects to login page

    // Reset form fields
    e.target.reset();
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-100">
      {/* Signup Form */}
      <div className="bg-white shadow-lg border-2 border-yellow-500 rounded-xl p-8 w-96">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Admin Signup
        </h1>
        <p className="text-center text-blue-700 mb-6">
          Sign up to manage your admin dashboard.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="w-full h-12 border-2 border-blue-500 text-blue-900 rounded-md px-4 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 outline-none"
            aria-label="Name"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full h-12 border-2 border-blue-500 text-blue-900 rounded-md px-4 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 outline-none"
            aria-label="Email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full h-12 border-2 border-blue-500 text-blue-900 rounded-md px-4 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 outline-none"
            aria-label="Password"
            required
          />
          <button
            type="submit"
            className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-md mt-4 transition-all"
          >
            Let’s go →
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
