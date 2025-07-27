import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Add the itemId field here
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item", // Assuming you have an 'Item' model for claimed items
    required: false, // Optional, as some notifications may not relate to an item
  },

  userInfo: {
    name: { type: String },
    email: { type: String },
    organisation: { type: String },
    location: { type: String },
  },

  message: {
    type: String,
    required: true,
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;