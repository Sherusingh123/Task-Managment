import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// Enhanced data structures
const users = new Map();
const admins = new Map();
const messageHistory = new Map();
const issues = new Map();
const conversations = new Map(); // Track active conversations
const unreadMessages = new Map(); // Track unread messages for each user

// Helper function to create conversation ID
const getConversationId = (user1Id, user2Id) => {
  return [user1Id, user2Id].sort().join("-");
};

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle user/admin joining
  socket.on("user_join", (userData) => {
    if (userData.isAdmin) {
      admins.set(socket.id, { ...userData, socketId: socket.id });
      // Send existing data to admin
      socket.emit("message_history", Array.from(messageHistory.entries()));
      socket.emit("issue_history", Array.from(issues.entries()));
      socket.emit("active_conversations", Array.from(conversations.entries()));
      socket.emit("unread_messages", Array.from(unreadMessages.entries()));
    } else {
      users.set(socket.id, { ...userData, socketId: socket.id });
      // Initialize unread messages counter for new user
      unreadMessages.set(socket.id, new Map());
    }

    io.emit("user_list", Array.from(users.values()));
    io.emit("admin_list", Array.from(admins.values()));
  });

  // Handle private messages
  socket.on("private_message", ({ recipientId, message }) => {
    const sender = users.get(socket.id) || admins.get(socket.id);
    if (!sender) return;

    const recipient = users.get(recipientId) || admins.get(recipientId);
    if (!recipient) return;

    const conversationId = getConversationId(socket.id, recipientId);
    const messageData = {
      id: Date.now(),
      conversationId,
      sender: sender.name,
      senderId: socket.id,
      recipient: recipient.name,
      recipientId,
      text: message,
      timestamp: new Date().toISOString(),
      isAdminMessage: sender.isAdmin,
      status: "sent",
      read: false,
    };

    // Store in conversation history
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }
    conversations.get(conversationId).push(messageData);

    // Track unread messages
    if (!unreadMessages.has(recipientId)) {
      unreadMessages.set(recipientId, new Map());
    }
    const recipientUnread = unreadMessages.get(recipientId);
    recipientUnread.set(
      conversationId,
      (recipientUnread.get(conversationId) || 0) + 1
    );

    // Store in message history
    if (!messageHistory.has(recipientId)) {
      messageHistory.set(recipientId, []);
    }
    messageHistory.get(recipientId).push(messageData);

    // Send to recipient and sender
    socket.to(recipientId).emit("private_message", messageData);
    socket.emit("private_message", { ...messageData, status: "delivered" });

    // Notify admins about new message
    admins.forEach((admin) => {
      if (admin.socketId !== socket.id) {
        io.to(admin.socketId).emit("new_message_notification", {
          from: sender.name,
          to: recipient.name,
          message: messageData,
        });
      }
    });
  });

  // Handle message read status
  socket.on("mark_messages_read", ({ conversationId }) => {
    if (conversations.has(conversationId)) {
      const messages = conversations.get(conversationId);
      messages.forEach((msg) => {
        if (msg.recipientId === socket.id) {
          msg.read = true;
        }
      });

      // Clear unread count for this conversation
      const userUnread = unreadMessages.get(socket.id);
      if (userUnread) {
        userUnread.delete(conversationId);
      }

      // Notify message sender about read status
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        io.to(lastMessage.senderId).emit("messages_read", {
          conversationId,
          readBy: socket.id,
        });
      }
    }
  });

  // Handle issue reporting with improved tracking
  socket.on("report_issue", (issueData) => {
    const user = users.get(socket.id);
    if (!user) return;

    const issue = {
      id: Date.now(),
      userId: socket.id,
      userName: user.name,
      ...issueData,
      status: "Pending",
      timestamp: new Date().toISOString(),
      priority: issueData.priority || "normal",
      category: issueData.category || "general",
      updates: [],
    };

    if (!issues.has(user.socketId)) {
      issues.set(user.socketId, []);
    }
    issues.get(user.socketId).push(issue);

    // Notify all admins
    admins.forEach((admin) => {
      io.to(admin.socketId).emit("new_issue", issue);
    });

    socket.emit("issue_reported", issue);
  });

  // Handle issue updates
  socket.on("update_issue", ({ issueId, userId, update }) => {
    const admin = admins.get(socket.id);
    if (!admin) return;

    const userIssues = issues.get(userId);
    if (userIssues) {
      const issue = userIssues.find((i) => i.id === issueId);
      if (issue) {
        issue.updates.push({
          timestamp: new Date().toISOString(),
          adminName: admin.name,
          content: update,
        });

        // Notify user and all admins
        io.to(userId).emit("issue_updated", issue);
        admins.forEach((a) => {
          io.to(a.socketId).emit("issue_updated", issue);
        });
      }
    }
  });

  // Handle issue resolution with notes
  socket.on("resolve_issue", ({ issueId, userId, resolution }) => {
    const admin = admins.get(socket.id);
    if (!admin) return;

    const userIssues = issues.get(userId);
    if (userIssues) {
      const issue = userIssues.find((i) => i.id === issueId);
      if (issue) {
        issue.status = "Resolved";
        issue.resolvedBy = admin.name;
        issue.resolvedAt = new Date().toISOString();
        issue.resolution = resolution;

        // Notify user and admins
        io.to(userId).emit("issue_resolved", issue);
        admins.forEach((a) => {
          io.to(a.socketId).emit("issue_resolved", issue);
        });
      }
    }
  });

  // Handle disconnection with cleanup
  socket.on("disconnect", () => {
    if (users.has(socket.id)) {
      const user = users.get(socket.id);
      users.delete(socket.id);
      // Archive user's conversations
      conversations.forEach((msgs, convId) => {
        if (convId.includes(socket.id)) {
          msgs.forEach((msg) => {
            if (!msg.archived) {
              msg.archived = true;
              msg.archiveDate = new Date().toISOString();
            }
          });
        }
      });
      io.emit("user_list", Array.from(users.values()));
    } else if (admins.has(socket.id)) {
      admins.delete(socket.id);
      io.emit("admin_list", Array.from(admins.values()));
    }
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
