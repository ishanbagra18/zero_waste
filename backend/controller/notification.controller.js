


import Notification from "../models/notification.model.js";
import User from "../models/user.model.js"; // Assuming Volunteer is stored here


// @desc Get all notifications for the current user
export const getNotifications = async (req, res) => {
  try {
    console.log("🧪 [getNotifications] req.user =", req.user);

    const userId = req.user.userId || req.user._id;
    console.log("🔍 [getNotifications] Using userId =", userId);

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      console.log("📭 No notifications found for userId:", userId);
      return res.status(200).json({ message: "No notifications found" });
    }

    console.log(`✅ [getNotifications] Fetched ${notifications.length} notifications`);

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications: notifications.map((notification) => ({
        _id: notification._id,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        itemId: notification.itemId || null, // Include itemId if it exists
        bookingId: notification.bookingId || null,
        notificationType: notification.notificationType || "claim_request",
        actionStatus: notification.actionStatus || "pending",
        otpCode: notification.otpCode || null,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};











// @desc Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notificationID = req.params.id;
    console.log("🧪 [markAsRead] notificationID =", notificationID);

    if (!notificationID) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const notification = await Notification.findById(notificationID);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    console.log("✅ [markAsRead] Notification marked as read");

    return res.status(200).json({
      message: "Notification marked as read successfully",
      notification: {
        _id: notification._id,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        itemId: notification.itemId || null,
        bookingId: notification.bookingId || null,
        notificationType: notification.notificationType || "claim_request",
        actionStatus: notification.actionStatus || "pending",
        otpCode: notification.otpCode || null,
      },
    });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notificationID = req.params.id;
    console.log("🧪 [deleteNotification] notificationID =", notificationID);

    if (!notificationID) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const notification = await Notification.findById(notificationID);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.deleteOne();

    console.log("🗑️ [deleteNotification] Notification deleted");

    return res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




