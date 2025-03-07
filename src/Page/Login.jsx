import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredEmail = e.target.email.value;
    const enteredPassword = e.target.password.value;

    // Get stored admin data from localStorage
    const storedData = localStorage.getItem("admindata");
    const adminData = storedData ? JSON.parse(storedData) : null;

    // Validate credentials
    if (
      adminData &&
      adminData.email === enteredEmail &&
      adminData.password === enteredPassword
    ) {
      // Authentication successful
      setErrorMessage("");
      navigate("/admin"); // Redirect to dashboard
    } else {
      // Authentication failed
      setErrorMessage("Invalid email or password.");
    }
  };

  useEffect(() => {
    // Check if the user is already logged in (optional logic)
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigate("/admin/dashboard"); // Redirect to dashboard if logged in
    }
  }, [navigate]);

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center bg-blue-100">
        <div className="border-2 rounded-lg border-yellow-500 p-10 bg-white shadow-xl w-96">
          {/* Login Header */}
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Admin Login
          </h1>

          {/* Login Form */}
          <form onSubmit={submitHandler} className="flex flex-col items-center">
            <input
              name="email"
              required
              className="outline-none bg-transparent border-2 border-blue-500 text-blue-900 font-medium text-lg py-2 px-4 rounded-md placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 w-full"
              type="email"
              placeholder="Enter your email"
            />
            <input
              required
              name="password"
              className="outline-none bg-transparent border-2 border-blue-500 text-blue-900 font-medium text-lg py-2 px-4 rounded-md mt-4 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 w-full"
              type="password"
              placeholder="Enter password"
            />
            <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg py-2 px-6 w-full rounded-md shadow-md transition-all">
              Log in
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 mt-4 text-center text-sm">
              {errorMessage}
            </p>
          )}

          {/* Signup Link */}
          <Link
            to={"/admin/signup"}
            className="block mt-4 text-center text-blue-600 font-medium hover:underline"
          >
            Don’t have an account? Sign up
          </Link>
        </div>
      </div>
    </>
  );
};
