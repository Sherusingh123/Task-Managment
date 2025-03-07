import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupU() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save form data to localStorage
    localStorage.setItem("userData", JSON.stringify(formData));
    alert("User data saved to localStorage!");
    navigate("/user/login");
    // Reset form fields
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-100">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Employee Sign Up
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-yellow-400 shadow-lg border-2 border-blue-500 rounded-lg p-6 flex flex-col gap-4 w-80"
      >
        <div className="text-lg font-bold text-blue-900 mb-4">
          Welcome,
          <br />
          <span className="text-blue-800 text-base font-medium">
            Sign up to continue
          </span>
        </div>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full h-10 border-2 border-blue-500 rounded-lg shadow-sm px-3 focus:ring-2 focus:ring-blue-300 outline-none placeholder-blue-700 text-blue-900"
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full h-10 border-2 border-blue-500 rounded-lg shadow-sm px-3 focus:ring-2 focus:ring-blue-300 outline-none placeholder-blue-700 text-blue-900"
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full h-10 border-2 border-blue-500 rounded-lg shadow-sm px-3 focus:ring-2 focus:ring-blue-300 outline-none placeholder-blue-700 text-blue-900"
          required
        />
        <button
          type="submit"
          className="mt-4 w-32 h-10 mx-auto rounded-lg border-2 border-blue-500 bg-blue-600 shadow-md text-white font-semibold cursor-pointer hover:bg-blue-700 active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          Let’s go →
        </button>
      </form>
    </div>
  );
}

export default SignupU;
