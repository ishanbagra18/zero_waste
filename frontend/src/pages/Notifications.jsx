import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete, MdCheckCircle, MdCancel } from "react-icons/md";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  // Getting token and role from localStorage
  const token = localStorage.getItem("token") || "";
  const role = localStorage.getItem("role") || "";

  const NOTIFICATION_API = "http://localhost:3002/api/notifications/notification";

  const fetchNotifications = async () => {
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }

    try {
      const res = await axios.get(NOTIFICATION_API, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3002/api/notifications/notification/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      toast.success("Marked as read");
    } catch (err) {
      console.error("Error marking as read:", err);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3002/api/notifications/notification/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to delete notification");
    }
  };

  const updateClaimStatus = async (itemId, status) => {
    if (!itemId) {
      toast.error("Item ID is missing in notification");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3002/api/items/${itemId}/claim-status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Claim ${status} successfully`);
      fetchNotifications();
    } catch (error) {
      console.error("Error updating claim status:", error);
      toast.error("Failed to update claim status");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-extrabold mb-8 text-emerald-400 select-none">
        🔔 Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-center mt-20 text-lg select-none">
          No notifications found.
        </p>
      ) : (
        <ul className="space-y-6 max-w-4xl mx-auto">
          {notifications.map((note) => {
            const isUnread = !note.isRead;
            return (
              <li
                key={note._id}
                className={`bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-transform hover:scale-[1.02] ${
                  isUnread ? "border-l-8 border-emerald-400" : "border-l-4 border-gray-700"
                }`}
                aria-live={isUnread ? "polite" : "off"}
              >
                <div className="flex-1">
                  <p
                    className={`text-lg font-semibold ${
                      isUnread ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {note.message}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 select-none">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                  {isUnread && (
                    <button
                      onClick={() => markAsRead(note._id)}
                      className="inline-block mt-3 rounded-md bg-emerald-500 px-4 py-1 text-sm font-medium text-white shadow hover:bg-emerald-600 transition"
                      aria-label="Mark notification as read"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                  {/* Approve / Reject buttons for vendors */}
                  {role === "vendor" && note.itemId && (
                    <>
                      <button
                        onClick={() => updateClaimStatus(note.itemId, "approved")}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow text-white font-semibold transition"
                        aria-label="Approve claim"
                        title="Approve"
                      >
                        <MdCheckCircle size={20} /> Approve
                      </button>

                      <button
                        onClick={() => updateClaimStatus(note.itemId, "collected")}
                        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md shadow text-white font-semibold transition"
                        aria-label="Mark as collected"
                        title="Collected"
                      >
                        <MdCheckCircle size={20} /> Collected
                      </button>

                      <button
                        onClick={() => updateClaimStatus(note.itemId, "rejected")}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md shadow text-white font-semibold transition"
                        aria-label="Reject claim"
                        title="Reject"
                      >
                        <MdCancel size={20} /> Reject
                      </button>
                    </>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => deleteNotification(note._id)}
                    className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md shadow text-white font-semibold transition"
                    aria-label="Delete notification"
                  >
                    <MdDelete size={20} /> Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notification;
