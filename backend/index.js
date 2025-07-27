// server.js or index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import fileUpload from 'express-fileupload';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bookingRoute from './routes/booking.route.js';
import userRoute from './routes/user.route.js';
import itemRoute from './routes/item.route.js';
import chatbotRoute from './routes/chatbot.route.js';
import notificationRouter from './routes/notification.route.js';
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";

import Message from './models/message.model.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Manage online users
let onlineUsers = new Map();

const addUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, socketId);
  }
};

const removeUser = (socketId) => {
  for (let [userId, sId] of onlineUsers.entries()) {
    if (sId === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

const getUserSocketId = (userId) => {
  return onlineUsers.get(userId);
};

// ✅ Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", Array.from(onlineUsers.keys()));
    console.log("Online Users:", onlineUsers);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      const newMessage = new Message({ senderId, receiverId, message });
      const savedMessage = await newMessage.save();

      const receiverSocketId = getUserSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", savedMessage);
      }

      socket.emit("getMessage", savedMessage); // Sender also gets their sent message
    } catch (err) {
      console.error("Message Save Error:", err.message);
      socket.emit("messageError", { error: "Message not sent." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
    removeUser(socket.id);
    io.emit("getUsers", Array.from(onlineUsers.keys()));
  });
});

// ✅ Middleware & Config
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
}));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ API Routes
app.use("/api/users", userRoute);
app.use("/api/items", itemRoute);
app.use("/api/notifications", notificationRouter);
app.use("/api/message", messageRoute);
app.use("/api/chat", chatbotRoute);
app.use("/api/review", reviewRoute);
app.use("/api/book",bookingRoute);

// ✅ Base route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ✅ MongoDB & Server Startup
const mongo = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(mongo);
    console.log("✅ MongoDB connected");

    server.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

startServer();
