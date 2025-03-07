import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserTie, FaUser } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function HomePage() {
  const [theme, setTheme] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDayTime, setIsDayTime] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hours = currentTime.getHours();
    setIsDayTime(hours >= 6 && hours < 18);
  }, [currentTime]);

  useEffect(() => {
    // Simulate a loading period
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the time as needed
    return () => clearTimeout(loadingTimeout);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-black text-gray-200"
          : "bg-gradient-to-br from-blue-100 to-yellow-300 text-gray-800"
      }`}
    >
      <header className="p-6 flex justify-between items-center shadow-lg">
        {isLoading ? (
          <Skeleton width={200} height={40} />
        ) : (
          <h1 className="text-4xl font-extrabold tracking-wide animate-pulse">
            Task Management
          </h1>
        )}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton width={150} height={40} />
          ) : (
            <button
              onClick={toggleTheme}
              className="bg-gray-700 px-4 py-2 rounded-lg text-white hover:bg-gray-500 transition-transform transform hover:scale-105"
            >
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </button>
          )}
          {isLoading ? (
            <Skeleton width={150} height={40} />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              Logged in as {userRole}
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400 transition-transform transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/user/login"
              className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-400 transition-transform transform hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <div className="text-center py-12">
        {isLoading ? (
          <>
            <Skeleton width={300} height={50} />
            <Skeleton width={400} height={30} className="mt-4" />
          </>
        ) : (
          <>
            <h2 className="text-5xl font-bold mb-4 animate-fade-in">
              Streamline Your Tasks
            </h2>
            <p className="text-xl animate-fade-in-delayed">
              Manage tasks effectively as an Admin or Employee
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
        {isLoading ? (
          <>
            <Skeleton height={300} className="rounded-lg" />
            <Skeleton height={300} className="rounded-lg" />
          </>
        ) : (
          <>
            <div className="flex flex-col items-center p-8 bg-blue-500 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 hover:shadow-xl">
              <FaUserTie className="text-6xl text-white mb-4" />
              <h3 className="text-3xl font-bold">Admin</h3>
              <p>Assign and manage tasks seamlessly.</p>
              <div className="mt-4 w-full">
                <Link
                  to="/admin/login"
                  className="block text-center bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-transform transform hover:scale-105 w-full"
                >
                  Login
                </Link>
                <Link
                  to="/admin/signup"
                  className="mt-2 block text-center bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-transform transform hover:scale-105 w-full"
                >
                  Signup
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center p-8 bg-yellow-400 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 hover:shadow-xl">
              <FaUser className="text-6xl text-blue-900 mb-4" />
              <h3 className="text-3xl font-bold">Employee</h3>
              <p>Track and complete your tasks efficiently.</p>
              <div className="mt-4 w-full">
                <Link
                  to="/user/login"
                  className="block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-transform transform hover:scale-105 w-full"
                >
                  Login
                </Link>
                <Link
                  to="/user/signup"
                  className="mt-2 block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-transform transform hover:scale-105 w-full"
                >
                  Signup
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="p-6 text-center">
        {isLoading ? (
          <Skeleton width={400} height={20} />
        ) : (
          <>
            <ul className="flex justify-center gap-6 mb-4">
              <li>
                <Link to="/About" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/Contect" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/Privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/Chating" className="hover:underline">
                  Issue Reporting User
                </Link>
              </li>
            </ul>
            <p>
              © {new Date().getFullYear()} Task Management. All rights reserved.
            </p>
          </>
        )}
      </footer>
    </div>
  );
}

export default HomePage;
