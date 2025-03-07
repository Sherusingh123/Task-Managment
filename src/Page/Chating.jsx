import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client/dist/socket.io.js";
import {
  FaCheckCircle,
  FaPoop,
  FaUserPlus,
  FaPaperPlane,
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaFilter,
  FaSort,
} from "react-icons/fa";

const Chatting = () => {
  const [users, setUsers] = useState(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    return storedUsers || [];
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [messages, setMessages] = useState(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages"));
    return storedMessages || [];
  });
  const [issues, setIssues] = useState(() => {
    const storedIssues = JSON.parse(localStorage.getItem("issues"));
    return storedIssues || [];
  });
  const [notifications, setNotifications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeConversations, setActiveConversations] = useState([]);
  const [issueFilters, setIssueFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
  });
  const [issueSortBy, setIssueSortBy] = useState("timestamp");
  const [issueResolutionNote, setIssueResolutionNote] = useState("");
  const [issueUpdateNote, setIssueUpdateNote] = useState("");

  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("messages", JSON.stringify(messages));
    localStorage.setItem("issues", JSON.stringify(issues));
  }, [users, messages, issues]);

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io("http://localhost:3001");

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const isAdminUser = currentUser?.role === "admin";
    setIsAdmin(isAdminUser);

    // Join chat with user data
    if (currentUser) {
      socketRef.current.emit("user_join", {
        id: socketRef.current.id,
        name: currentUser.name,
        isAdmin: isAdminUser,
      });
    }

    // Listen for updated user list
    socketRef.current.on("user_list", (updatedUsers) => {
      setUsers(
        updatedUsers.filter((user) => user.socketId !== socketRef.current.id)
      );
    });

    // Listen for private messages
    socketRef.current.on("private_message", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
      // Mark messages as read if the conversation is currently open
      if (selectedUser && messageData.senderId === selectedUser.socketId) {
        socketRef.current.emit("mark_messages_read", {
          conversationId: messageData.conversationId,
        });
      }
    });

    // Admin-specific listeners
    if (isAdminUser) {
      // Listen for message history
      socketRef.current.on("message_history", (history) => {
        const formattedHistory = history.reduce((acc, [userId, messages]) => {
          return [...acc, ...messages];
        }, []);
        setMessages(formattedHistory);
      });

      // Listen for issue history
      socketRef.current.on("issue_history", (history) => {
        const formattedIssues = history.reduce((acc, [userId, userIssues]) => {
          return [...acc, ...userIssues];
        }, []);
        setIssues(formattedIssues);
      });

      // Listen for new message notifications
      socketRef.current.on("new_message_notification", (notification) => {
        setNotifications((prev) => [
          ...prev,
          {
            type: "message",
            ...notification,
            timestamp: new Date().toISOString(),
          },
        ]);
      });

      // Listen for new issues
      socketRef.current.on("new_issue", (issue) => {
        setIssues((prev) => [...prev, issue]);
        setNotifications((prev) => [
          ...prev,
          {
            type: "issue",
            issue,
            timestamp: new Date().toISOString(),
          },
        ]);
      });

      // Listen for resolved issues
      socketRef.current.on("issue_resolved", (resolvedIssue) => {
        setIssues((prev) =>
          prev.map((issue) =>
            issue.id === resolvedIssue.id ? resolvedIssue : issue
          )
        );
      });

      socketRef.current.on("active_conversations", (conversations) => {
        setActiveConversations(Array.from(conversations.values()));
      });

      socketRef.current.on("unread_messages", (unreadData) => {
        setUnreadCounts(Object.fromEntries(unreadData));
      });

      socketRef.current.on("messages_read", ({ conversationId, readBy }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.conversationId === conversationId ? { ...msg, read: true } : msg
          )
        );
      });
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedUser]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAddUser = () => {
    const userName = prompt("Enter new user name:");
    if (userName && !users.find((user) => user.name === userName)) {
      const newUser = { id: Date.now(), name: userName };
      setUsers([...users, newUser]);
    }
  };

  const handleSendMessage = () => {
    if (!selectedUser || message.trim() === "") {
      alert(
        selectedUser ? "Message cannot be empty." : "Please select a user."
      );
      return;
    }

    socketRef.current.emit("private_message", {
      recipientId: selectedUser.socketId,
      message: message.trim(),
    });

    setMessage("");
  };

  const handleReportIssue = () => {
    if (!selectedUser || issueDescription.trim() === "") {
      alert(
        selectedUser
          ? "Issue description cannot be empty."
          : "Please select a user."
      );
      return;
    }

    socketRef.current.emit("report_issue", {
      description: issueDescription,
      timestamp: new Date().toISOString(),
      priority: "normal",
      category: "general",
    });

    setIssueDescription("");
  };

  const handleUpdateIssue = (issueId, userId) => {
    if (!issueUpdateNote.trim()) {
      alert("Please enter an update note.");
      return;
    }

    socketRef.current.emit("update_issue", {
      issueId,
      userId,
      update: issueUpdateNote,
    });

    setIssueUpdateNote("");
  };

  const handleResolveIssue = (issueId, userId) => {
    if (!issueResolutionNote.trim()) {
      alert("Please enter a resolution note.");
      return;
    }

    socketRef.current.emit("resolve_issue", {
      issueId,
      userId,
      resolution: issueResolutionNote,
    });

    setIssueResolutionNote("");
  };

  const getFilteredIssues = () => {
    return issues
      .filter((issue) => {
        if (!selectedUser && issueFilters.status !== "all") {
          return issue.status === issueFilters.status;
        }
        return !selectedUser || issue.userId === selectedUser.socketId;
      })
      .sort((a, b) => {
        switch (issueSortBy) {
          case "priority":
            return a.priority.localeCompare(b.priority);
          case "status":
            return a.status.localeCompare(b.status);
          default:
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
      });
  };

  const clearNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const getMessageStatus = (message) => {
    if (message.read) {
      return <FaCheckDouble className="text-blue-500" />;
    }
    if (message.status === "delivered") {
      return <FaCheck className="text-gray-500" />;
    }
    return <FaCheck className="text-gray-300" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-6">
        {isAdmin ? "Admin Dashboard" : "Employee Chat & Support"}
      </h1>

      {/* Notifications Panel for Admin */}
      {isAdmin && notifications.length > 0 && (
        <div className="w-full max-w-6xl mb-6">
          <div className="bg-white rounded-lg shadow-lg border border-blue-300 p-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
              <FaBell className="mr-2" /> Notifications
            </h2>
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                >
                  <div>
                    {notification.type === "message" ? (
                      <p>
                        New message from {notification.from} to{" "}
                        {notification.to}
                      </p>
                    ) : (
                      <p>
                        New {notification.issue.priority} priority issue
                        reported by {notification.issue.userName}
                      </p>
                    )}
                    <span className="text-xs text-blue-600">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <button
                    onClick={() => clearNotification(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between w-full max-w-6xl gap-6">
        <div className="flex-1 max-w-sm p-4 bg-white rounded-lg shadow-lg border border-blue-300">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">
            {isAdmin ? "All Users" : "Online Users"}
          </h2>
          <div className="space-y-3">
            {users.map((user) => (
              <button
                key={user.socketId}
                onClick={() => setSelectedUser(user)}
                className={`block w-full p-3 rounded-lg transition-colors duration-300 relative ${
                  selectedUser?.socketId === user.socketId
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-700"
                } hover:bg-blue-400`}
              >
                <span className="flex items-center justify-between">
                  {user.name}
                  {unreadCounts[user.socketId] > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCounts[user.socketId]}
                    </span>
                  )}
                </span>
              </button>
            ))}
            <button
              onClick={handleAddUser}
              className="flex items-center justify-center w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
            >
              <FaUserPlus className="mr-2" /> Add User
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-sm p-4 bg-white rounded-lg shadow-lg border border-blue-300">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">
            Chat with: {selectedUser?.name || "No User Selected"}
          </h2>
          <div className="h-60 overflow-y-auto p-2 border border-blue-200 rounded-lg mb-4 bg-blue-50">
            {messages
              .filter(
                (msg) =>
                  msg.senderId === selectedUser?.socketId ||
                  msg.recipientId === selectedUser?.socketId
              )
              .map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.isAdminMessage === isAdmin ? "text-right" : "text-left"
                  }`}
                >
                  <div className="flex items-center gap-2 justify-end">
                    <span
                      className={`inline-block px-3 py-2 rounded-lg ${
                        msg.isAdminMessage === isAdmin
                          ? "bg-blue-500 text-white"
                          : "bg-blue-200"
                      }`}
                    >
                      {msg.text}
                    </span>
                    {msg.isAdminMessage === isAdmin && getMessageStatus(msg)}
                  </div>
                  <span className="block text-xs text-blue-600 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 mb-4"
          />
          <button
            onClick={handleSendMessage}
            className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
          >
            <FaPaperPlane className="inline mr-2" /> Send Message
          </button>
        </div>

        <div className="flex-1 max-w-sm p-4 bg-white rounded-lg shadow-lg border border-blue-300">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">
            {isAdmin ? "All Issues" : "Report an Issue"}
          </h2>
          {isAdmin ? (
            <>
              <div className="mb-4 flex gap-2">
                <select
                  value={issueFilters.status}
                  onChange={(e) =>
                    setIssueFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="p-2 border rounded"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <select
                  value={issueSortBy}
                  onChange={(e) => setIssueSortBy(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="timestamp">Sort by Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
              <div className="space-y-4">
                {getFilteredIssues().map((issue) => (
                  <div
                    key={issue.id}
                    className="border border-blue-200 rounded-lg p-3 bg-blue-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{issue.userName}</span>
                      <span
                        className={`text-sm ${
                          issue.status === "Pending"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{issue.description}</p>
                    {issue.updates && issue.updates.length > 0 && (
                      <div className="mb-2 text-sm">
                        <p className="font-semibold">Updates:</p>
                        {issue.updates.map((update, idx) => (
                          <div key={idx} className="ml-2 text-gray-600">
                            <p>{update.content}</p>
                            <span className="text-xs">
                              by {update.adminName} at{" "}
                              {new Date(update.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-blue-600">
                      <span>{new Date(issue.timestamp).toLocaleString()}</span>
                      {issue.status === "Pending" && (
                        <div className="space-y-2">
                          <textarea
                            value={issueUpdateNote}
                            onChange={(e) => setIssueUpdateNote(e.target.value)}
                            placeholder="Add update note..."
                            className="w-full p-2 border rounded text-sm"
                          />
                          <button
                            onClick={() =>
                              handleUpdateIssue(issue.id, issue.userId)
                            }
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            Update
                          </button>
                          <textarea
                            value={issueResolutionNote}
                            onChange={(e) =>
                              setIssueResolutionNote(e.target.value)
                            }
                            placeholder="Add resolution note..."
                            className="w-full p-2 border rounded text-sm"
                          />
                          <button
                            onClick={() =>
                              handleResolveIssue(issue.id, issue.userId)
                            }
                            className="text-green-500 hover:text-green-700"
                          >
                            <FaCheckCircle className="inline mr-1" /> Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 mb-4"
              />
              <button
                onClick={handleReportIssue}
                className="w-full py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-500"
              >
                Report Issue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatting;
