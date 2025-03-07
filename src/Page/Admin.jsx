import React, { StrictMode, useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/ContextPage";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const { adminDetails, setadminDetails, notify } = useContext(AppContext);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedAdminDetails = JSON.parse(
        localStorage.getItem("adminDetails")
      );
      if (savedAdminDetails) {
        setadminDetails(savedAdminDetails);
      }
    } catch (err) {
      console.error("Error loading admin details from localStorage:", err);
    }
  }, [setadminDetails]);

  // Log notifications if available
  useEffect(() => {
    const notificationData = JSON.parse(localStorage.getItem("issues")) || [];
    notificationData.forEach((data) => {
      notify(data?.description);
    });
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    console.log(storedMessages);
    setMessages(storedMessages);
  }, [notify]);

  const submitHandler = (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const date = e.target.date.value.trim();
    const name = e.target.name.value.trim();
    const category = e.target.category.value.trim();
    const description = e.target.description.value.trim();

    if (!title || !date || !name || !category || !description) {
      setError("All fields are required.");
      return;
    }

    const newTask = {
      Atitle: title,
      Adate: date,
      Aname: name,
      Acategory: category,
      Adescription: description,
    };

    setadminDetails((prev) => {
      const updatedAdminDetails = [...(prev || []), newTask];
      localStorage.setItem("adminDetails", JSON.stringify(updatedAdminDetails));
      return updatedAdminDetails;
    });

    setError("");
    setSuccessMessage("Task successfully created!");
    setTimeout(() => setSuccessMessage(""), 3000);
    e.target.reset();
  };

  const handleLogout = () => {
    navigate("/");
  };

  const filteredTasks = (adminDetails || []).filter((task) =>
    task.Aname.toLowerCase().includes(searchTerm)
  );

  const sortedTasks = [...filteredTasks].sort((a, b) =>
    sortOrder
      ? new Date(a.Adate) - new Date(b.Adate)
      : new Date(b.Adate) - new Date(a.Adate)
  );

  return (
    <div className="bg-yellow-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-yellow-300 bg-yellow-100">
        <h1 className="text-2xl font-light text-gray-800">
          Welcome Back, <br />
          <span className="text-3xl font-semibold text-yellow-600">
            Admin 👋
          </span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-yellow-600 text-white px-5 py-2 rounded-md hover:bg-yellow-500 transition"
        >
          Log Out
        </button>
      </div>

      {/* Task Form */}
      <div className="p-6 bg-white rounded-md shadow-lg mt-6 mx-6">
        <h2 className="text-xl font-semibold text-yellow-600 mb-4">
          Create New Task
        </h2>
        <form
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          onSubmit={submitHandler}
        >
          {/* Task Form Fields */}
          <div className="w-full">
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task Title
            </label>
            <input
              id="task-title"
              name="title"
              type="text"
              placeholder="Make a UI design"
              className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="task-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <input
              id="task-date"
              name="date"
              type="date"
              className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="assign-to"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Assign to
            </label>
            <input
              id="assign-to"
              name="name"
              type="text"
              placeholder="Employee name"
              className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              placeholder="Design, Development, etc."
              className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          {/* Task Description */}
          <div className="w-full">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide task details here..."
              className="w-full h-32 p-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
            ></textarea>
          </div>

          <div className="w-full mt-4">
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md"
            >
              Create Task
            </button>
          </div>
        </form>

        {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
        {successMessage && (
          <div className="text-green-500 text-sm mt-3">{successMessage}</div>
        )}
      </div>

      {/* Task Table */}
      <div className="relative overflow-x-auto mt-6 mx-6 rounded-md shadow-lg bg-white">
        <h2 className="text-xl font-semibold text-yellow-600 mb-4">
          Task Overview
        </h2>
        <div className="flex justify-between items-center mb-4 px-4">
          <input
            type="text"
            placeholder="Search tasks..."
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="p-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <button
            onClick={() => setSortOrder(!sortOrder)}
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            {sortOrder ? "Sort by Date ↓" : "Sort by Date ↑"}
          </button>
        </div>
        <table className="w-full text-sm text-gray-800">
          <thead className="text-xs uppercase bg-yellow-500 text-white">
            <tr>
              <th className="px-6 py-4">Employee Name</th>
              <th className="px-6 py-4">Task Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task, index) => (
              <tr
                key={index}
                className={`border-b border-yellow-200 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-yellow-100 transition-all`}
              >
                <td className="px-6 py-4">{task.Aname}</td>
                <td className="px-6 py-4">{task.Atitle}</td>
                <td className="px-6 py-4">{task.Acategory}</td>
                <td className="px-6 py-4">{task.Adate}</td>
                <td className="px-6 py-4">{task.Adescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message Section */}
      <div className="w-[500px] lg:w-1/2 p-6 bg-white rounded-lg shadow-lg mt-6 mx-6">
        <h3 className="text-lg font-semibold text-yellow-500 mb-4">Messages</h3>
        <div className="max-h-60 overflow-hidden bg-yellow-50 p-4 rounded-md shadow-inner">
          {messages.map((messageData, index) => (
            <div
              key={index}
              className="text-sm p-3 mb-2 rounded-md"
              style={{ backgroundColor: "#003366", color: "#FFFFFF" }}
            >
              <strong>{messageData.sender}: </strong>
              {messageData.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
