// server.js or index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Fix querySrv ECONNREFUSED for MongoDB Atlas on local Windows
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    // Ignore if custom DNS fails
  }
}

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
import { notificationQueue } from './queues/notification.queue.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

// ✅ Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://zero-waste200.netlify.app',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
].map(origin => origin.trim().replace(/\/$/, ""));

const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Manage online users
let onlineUsers = new Map();

// ✅ Initialize Notification Message Queue System
notificationQueue.init({ io, onlineUsers });

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
  origin: allowedOrigins,
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

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: mongoState === 1 ? 'healthy' : 'unhealthy',
    mongodb: states[mongoState] || 'unknown',
    env: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_TOKEN: !!process.env.JWT_TOKEN,
      CLOUD_NAME: !!process.env.CLOUD_NAME,
      API_KEY: !!process.env.API_KEY,
      API_SECRET: !!process.env.API_SECRET,
      NODE_ENV: process.env.NODE_ENV || 'not set',
    }
  });
});

// ✅ MongoDB & Server Startup
const mongo = (process.env.MONGODB_URI || '').trim();
console.log(`📋 MONGODB_URI present: ${!!mongo}, length: ${mongo.length}, starts with: ${mongo.substring(0, 20)}...`);

// Persistent reconnect function (accessible globally for health check)
const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already connected");
    return true;
  }
  try {
    console.log("🔄 Attempting MongoDB connection...");
    await mongoose.connect(mongo, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected successfully!");
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error("   Error name:", err.name);
    console.error("   Error message:", err.message);
    console.error("   Error code:", err.code);
    if (err.reason) console.error("   Error reason:", JSON.stringify(err.reason));
    return false;
  }
};

// Update health endpoint to show more info and allow reconnect
app.get('/health/reconnect', async (req, res) => {
  const result = await connectMongo();
  const mongoState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: mongoState === 1 ? 'healthy' : 'unhealthy',
    mongodb: states[mongoState] || 'unknown',
    reconnectAttempted: true,
    reconnectSuccess: result,
    mongoUriLength: mongo.length,
    mongoUriPrefix: mongo.substring(0, 25) + '...',
  });
});

const startServer = async () => {
  // ✅ Start HTTP server FIRST so Render detects the port
  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  });

  // ✅ Then connect to MongoDB with retry logic
  for (let i = 1; i <= 10; i++) {
    const success = await connectMongo();
    if (success) break;
    if (i < 10) {
      const delay = Math.min(5000 * i, 30000);
      console.log(`⏳ Retry ${i}/10 in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    } else {
      console.error("❌ All 10 MongoDB connection attempts failed. Server running without DB.");
    }
  }
};

startServer();
