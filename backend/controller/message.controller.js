import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Conversation from "../models/Conversation.model.js";
import { v2 as cloudinary } from "cloudinary";



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    if (!senderId || !receiverId || (!message && !req.files?.photo)) {
      return res.status(400).json({ error: "Message text or photo is required" });
    }

    // 🔍 Find or create a conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // 📤 Handle optional photo upload
    let photo = null;
    if (req.files && req.files.photo) {
      const uploadedPhoto = req.files.photo;

      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(uploadedPhoto.mimetype)) {
        return res.status(400).json({ message: "Invalid photo format." });
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        uploadedPhoto.tempFilePath,
        { folder: "chatPhotos" }
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(cloudinaryResponse.error);
        return res.status(500).json({ message: "Image upload failed." });
      }

      photo = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    // ✉️ Create and save message
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message || "",
      ...(photo && { photo }),
    });

    conversation.messages.push(newMessage._id);

    await Promise.all([newMessage.save(), conversation.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};










export const getMessages = async (req, res) => {
  try {
    console.log("🔍 Step 1: getMessages controller called");

    const { id: chatUser } = req.params;
    const senderId = req.user?.userId;

    console.log("📥 Step 2: Extracted IDs");
    console.log("   ➤ chatUser ID:", chatUser);
    console.log("   ➤ senderId:", senderId);

    if (!chatUser || !senderId) {
      console.warn("⚠️ Missing senderId or chatUser");
      return res.status(400).json({ error: "Missing user IDs" });
    }

    // 🧠 Step 3: Find the conversation and populate referenced messages
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatUser] },
    }).populate("messages"); // ✅ populate actual message docs

    if (!conversation) {
      console.log("📭 No conversation found");
      return res.status(200).json([]);
    }

    console.log("📦 Conversation found. ID:", conversation._id);
    console.log("📝 Messages in conversation (populated):", conversation.messages.length);

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("❌ Error in getMessages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



