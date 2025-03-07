import React, { createContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure Toastify styles are imported

// Create a Context
export const AppContext = createContext();

export default function ContextPage({ children }) {
  const [adminDetails, setadminDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) || [] // Initialize from localStorage
  );
  const [employeeData, setEmployee] = useState(null);

  // Sync admin state with localStorage
  useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(admin));
  }, [admin]);

  // Notification function
  const notify = (message = "Default message") => toast(message);

  return (
    <AppContext.Provider
      value={{
        adminDetails,
        setadminDetails,
        userDetails,
        setUserDetails,
        admin,
        setAdmin,
        employeeData,
        setEmployee,
        notify,
      }}
    >
      {children}
      <ToastContainer /> {/* Required to display toast notifications */}
    </AppContext.Provider>
  );
}
