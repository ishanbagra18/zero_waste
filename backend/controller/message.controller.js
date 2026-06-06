import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Conversation from "../models/Conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create the message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

        if (newMessage) {
      conversation.messages.push(newMessage._id);
    }


    // Push message to conversation.messages array
  await Promise.all([conversation.save(), newMessage.save()]); // run parallel

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error);
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



