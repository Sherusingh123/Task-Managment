import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Employee() {
  const userInfo = JSON.parse(localStorage.getItem("userData")) || {};
  const initialTaskInfo =
    JSON.parse(localStorage.getItem("adminDetails")) || [];

  const [tasks, setTasks] = useState(initialTaskInfo);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const userTasks = tasks.filter((task) => task?.Aname === userInfo?.name);

  // Task counts
  const completedCount = userTasks.filter(
    (task) => task.status === "complete"
  ).length;
  const rejectedCount = userTasks.filter(
    (task) => task.status === "reject"
  ).length;
  const uncompletedCount = userTasks.filter(
    (task) => task.status === "uncomplete"
  ).length;

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const updateTaskStatus = (taskId, action) => {
    const updatedTasks = tasks
      .map((task) => {
        if (task.id === taskId) {
          if (action === "reject") {
            displayMessage("Task removed. Warning: Rejected!");
            return null; // Remove task
          }
          if (action === "complete") {
            displayMessage(`Task Completed on ${new Date().toLocaleString()}`);
            return {
              ...task,
              status: action,
              completedDate: new Date().toLocaleString(),
            };
          }
          if (action === "uncomplete") {
            displayMessage("Warning: Task marked as uncompleted!");
            return { ...task, status: action };
          }
          if (action === "accept") {
            displayMessage("Task accepted. Ready to do!");
            return { ...task, status: action };
          }
        }
        return task;
      })
      .filter(Boolean);

    setTasks(updatedTasks);
    localStorage.setItem("adminDetails", JSON.stringify(updatedTasks));
  };

  const handleLogout = () => navigate("/");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-900 to-yellow-500 min-h-screen">
      <div className="text-center mb-8">
        <button
          onClick={handleLogout}
          className="bg-yellow-600 text-white mb-20 px-5 py-2 rounded-md hover:bg-blue-900 transition float-end"
        >
          Log Out
        </button>
        <h1 className="text-3xl font-bold text-yellow-200">
          {getGreeting()} <br />
          <span className="text-3xl font-semibold text-white">
            {userInfo?.name || "Guest"} 👋
          </span>
        </h1>
      </div>

      {/* Task Count Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <SummaryCard
          count={userTasks.length}
          label="Your Tasks"
          color="bg-yellow-400"
          textColor="text-blue-900"
        />
        <SummaryCard
          count={completedCount}
          label="Completed Tasks"
          color="bg-blue-500"
          textColor="text-white"
        />
        <SummaryCard
          count={rejectedCount}
          label="Rejected Tasks"
          color="bg-red-500"
          textColor="text-white"
        />
        <SummaryCard
          count={uncompletedCount}
          label="Uncompleted Tasks"
          color="bg-yellow-500"
          textColor="text-blue-900"
        />
      </div>

      {/* Task Cards */}
      <div className="flex flex-wrap gap-5 justify-start">
        {userTasks.length > 0 ? (
          userTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={updateTaskStatus}
            />
          ))
        ) : (
          <div className="w-full text-center text-gray-800">
            No tasks assigned to you.
          </div>
        )}
      </div>

      {/* Notification Message */}
      {message && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold animate-bounce">
          {message}
        </div>
      )}
    </div>
  );
}

const SummaryCard = ({ count, label, color, textColor }) => (
  <div
    className={`text-center ${color} ${textColor} p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300`}
  >
    <h2 className="text-3xl font-bold">{count}</h2>
    <h3 className="text-xl mt-2 font-medium">{label}</h3>
  </div>
);

const TaskCard = ({ task, onStatusChange }) => {
  const { Acategory, Adate, Atitle, Adescription, status, completedDate, id } =
    task;

  return (
    <div
      className={`relative p-5 rounded shadow-lg transition duration-300 ${
        status === "accept"
          ? "bg-green-100"
          : status === "reject"
          ? "bg-red-100"
          : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="bg-yellow-400 text-blue-900 text-xs font-semibold px-3 py-1 rounded">
          {Acategory}
        </span>
        <span className="text-sm text-gray-500">{Adate}</span>
      </div>
      <h3 className="font-medium text-lg">{Atitle}</h3>
      <p className="text-sm text-gray-600 mt-2">{Adescription}</p>

      {completedDate && (
        <div className="text-sm text-green-500 mt-2">
          Completed on: {completedDate}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex gap-2">
        {status === "accept" && (
          <>
            <button
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              onClick={() => onStatusChange(id, "complete")}
            >
              Complete
            </button>
            <button
              className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              onClick={() => onStatusChange(id, "uncomplete")}
            >
              Uncomplete
            </button>
          </>
        )}
        {!status && (
          <>
            <button
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              onClick={() => onStatusChange(id, "accept")}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              onClick={() => onStatusChange(id, "reject")}
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Employee;
