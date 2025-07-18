import Notification from "../models/notification.model.js";


export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });


        if (!notifications ) {
            return res.status(404).json({ message: "No notifications found" });
        }

        return res.status(200).json({ 
            message: "Notifications fetched successfully",
            notifications: notifications.map(notification => ({
                _id: notification._id,
                message: notification.message,
                isRead: notification.isRead,
                createdAt: notification.createdAt
            }))
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Server error" });
        
    }
}


export const markAsRead = async (req,res)=>
{
    try {

        const notificationID = req.params.id;

        if (!notificationID) {
            return res.status(400).json({ message: "Notification ID is required" });
        }


        const notification  = await Notification.findById(notificationID);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();


        return res.status(200).json({
            message: "Notification marked as read successfully",
            notification: {
                _id: notification._id,
                message: notification.message,
                isRead: notification.isRead,
                createdAt: notification.createdAt
            }
        });


        
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ message: "Server error" });
    }
};





export const deleteNotification = async (req,res)=>
{
    try {

        const notificationID = req.params.id;

        if( !notificationID) {
            return res.status(400).json({ message: "Notification ID is required" });
        }

        const notification = await Notification.findById(notificationID);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await notification.deleteOne();
        return res.status(200).json({ message: "Notification deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({ message: "Server error" });
        
    }
}