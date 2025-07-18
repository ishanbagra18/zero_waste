import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js';
import fileUpload from 'express-fileupload';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // ✅ Import cors
import itemRoute from './routes/item.route.js';
import notificationRouter from './routes/notification.route.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

// ✅ CORS setup: allow frontend requests from Vite (localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if using cookies
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp"
}));

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Routes
app.use("/api/users", userRoute);
app.use("/api/items", itemRoute);
app.use("/api/notifications", notificationRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connect to MongoDB and start server
const mongo = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`🚀 Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();
