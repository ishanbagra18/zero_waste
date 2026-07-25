import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete, MdCheckCircle, MdCancel } from "react-icons/md";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [ngoIdInputs, setNgoIdInputs] = useState({});

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
      toast.error("Failed to load notifications");
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

  const confirmPickup = async (itemId) => {
    if (!itemId) {
      toast.error("Item ID is missing in notification");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3002/api/items/${itemId}/pickup-confirmed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Pickup confirmed");
      fetchNotifications();
    } catch (error) {
      console.error("Error confirming pickup:", error);
      toast.error(error.response?.data?.message || "Failed to confirm pickup");
    }
  };

  const verifyDeliveryOtp = async (itemId, notificationId) => {
    const otp = (otpInputs[notificationId] || "").trim();

    if (!itemId) {
      toast.error("Item ID is missing in notification");
      return;
    }

    if (!otp) {
      toast.error("Enter the OTP to verify delivery");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3002/api/items/${itemId}/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Delivery verified successfully");
      setOtpInputs((prev) => ({ ...prev, [notificationId]: "" }));
      fetchNotifications();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    }
  };

  const acceptBookingRequest = async (bookingId, notificationId) => {
    const ngoId = (ngoIdInputs[notificationId] || "").trim();
    if (!bookingId) {
      toast.error("Booking ID is missing.");
      return;
    }
    if (!ngoId) {
      toast.error("Enter the NGO ID to accept booking.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3002/api/book/${bookingId}/accept`,
        { ngoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking request accepted successfully!");
      setNgoIdInputs((prev) => ({ ...prev, [notificationId]: "" }));
      fetchNotifications();
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error(error.response?.data?.message || "Failed to accept booking.");
    }
  };

  const confirmBookingPickupAction = async (bookingId, notificationId) => {
    const ngoId = (ngoIdInputs[notificationId] || "").trim();
    if (!bookingId) {
      toast.error("Booking ID is missing.");
      return;
    }
    if (!ngoId) {
      toast.error("Enter the NGO ID to confirm pickup.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3002/api/book/${bookingId}/pickup-confirmed`,
        { ngoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Pickup confirmed successfully!");
      setNgoIdInputs((prev) => ({ ...prev, [notificationId]: "" }));
      fetchNotifications();
    } catch (error) {
      console.error("Error confirming booking pickup:", error);
      toast.error(error.response?.data?.message || "Failed to confirm pickup.");
    }
  };

  const verifyBookingOtpAction = async (bookingId, notificationId) => {
    const otp = (otpInputs[notificationId] || "").trim();
    if (!bookingId) {
      toast.error("Booking ID is missing.");
      return;
    }
    if (!otp) {
      toast.error("Enter the OTP to verify delivery.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3002/api/book/${bookingId}/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking delivery verified successfully!");
      setOtpInputs((prev) => ({ ...prev, [notificationId]: "" }));
      fetchNotifications();
    } catch (error) {
      console.error("Error verifying booking OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP.");
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
            const canActOnClaim = role === "vendor" && note.itemId && note.notificationType === "claim_request" && note.actionStatus === "pending";
            const canVerifyOtp = role === "NGO" && note.itemId && note.notificationType === "pickup_confirmed" && note.actionStatus === "pending";
            const canConfirmPickup = role === "Volunteer" && note.itemId && note.notificationType === "claim_approved" && note.actionStatus === "approved";

            const isVolunteer = role === "Volunteer";
            const isNgo = role === "NGO";
            const canAcceptBooking = isVolunteer && note.bookingId && note.notificationType === "booking_request" && note.actionStatus === "pending";
            const canVerifyBookingOtp = (isNgo || isVolunteer) && note.bookingId && note.notificationType === "booking_pickup_confirmed" && note.actionStatus === "pending";
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
                  {/* Claim request actions for vendors */}
                  {canActOnClaim && (
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
                        onClick={() => updateClaimStatus(note.itemId, "rejected")}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md shadow text-white font-semibold transition"
                        aria-label="Reject claim"
                        title="Reject"
                      >
                        <MdCancel size={20} /> Reject
                      </button>
                    </>
                  )}

                  {/* Volunteer pickup confirmation */}
                  {canConfirmPickup && (
                    <button
                      onClick={() => confirmPickup(note.itemId)}
                      className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-md shadow text-white font-semibold transition"
                      aria-label="Confirm pickup"
                      title="Confirm Pickup"
                    >
                      <MdCheckCircle size={20} /> Pickup Confirmed
                    </button>
                  )}

                  {/* OTP verification for NGOs */}
                  {canVerifyOtp && (
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <input
                        type="text"
                        value={otpInputs[note._id] || ""}
                        onChange={(e) =>
                          setOtpInputs((prev) => ({
                            ...prev,
                            [note._id]: e.target.value,
                          }))
                        }
                        placeholder={note.otpCode ? `OTP: ${note.otpCode}` : "Enter OTP"}
                        className="rounded-md bg-gray-900 border border-gray-600 px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-400"
                      />
                      <button
                        onClick={() => verifyDeliveryOtp(note.itemId, note._id)}
                        className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md shadow text-white font-semibold transition"
                        aria-label="Verify OTP"
                        title="Verify OTP"
                      >
                        <MdCheckCircle size={20} /> Verify OTP
                      </button>
                    </div>
                  )}

                  {/* Booking Acceptance action */}
                  {canAcceptBooking && (
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <input
                        type="text"
                        value={ngoIdInputs[note._id] || ""}
                        onChange={(e) =>
                          setNgoIdInputs((prev) => ({
                            ...prev,
                            [note._id]: e.target.value,
                          }))
                        }
                        placeholder="Enter NGO ID to accept"
                        className="rounded-md bg-gray-900 border border-gray-600 px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-400 text-sm"
                      />
                      <button
                        onClick={() => acceptBookingRequest(note.bookingId, note._id)}
                        className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md shadow text-white font-semibold transition text-sm"
                      >
                        <MdCheckCircle size={20} /> Accept Booking
                      </button>
                    </div>
                  )}

                  {/* Booking OTP verification action */}
                  {canVerifyBookingOtp && (
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <input
                        type="text"
                        value={otpInputs[note._id] || ""}
                        onChange={(e) =>
                          setOtpInputs((prev) => ({
                            ...prev,
                            [note._id]: e.target.value,
                          }))
                        }
                        placeholder="Enter OTP code"
                        className="rounded-md bg-gray-900 border border-gray-600 px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-400 text-sm"
                      />
                      <button
                        onClick={() => verifyBookingOtpAction(note.bookingId, note._id)}
                        className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md shadow text-white font-semibold transition text-sm"
                      >
                        <MdCheckCircle size={20} /> Verify OTP
                      </button>
                    </div>
                  )}

                  {role === "NGO" && note.otpCode && (note.notificationType === "booking_pickup_confirmed" || note.notificationType === "claim_approved") && (
                    <div className="w-full md:w-auto rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-cyan-100 text-sm">
                      Delivery OTP: <span className="font-semibold">{note.otpCode}</span>
                    </div>
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
