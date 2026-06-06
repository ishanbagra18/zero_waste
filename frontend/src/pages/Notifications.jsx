import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { 
  MdDelete, 
  MdCheckCircle, 
  MdCancel, 
  MdNotificationsActive, 
  MdMarkEmailRead,
  MdOutlineHourglassEmpty 
} from "react-icons/md";

// Centralized API Base URLs
const BASE_URL = "http://localhost:3002/api";
const API = {
  NOTIFICATIONS: `${BASE_URL}/notifications/notification`,
  ITEMS: `${BASE_URL}/items`,
  BOOKINGS: `${BASE_URL}/book`
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [ngoIdInputs, setNgoIdInputs] = useState({});

  const token = localStorage.getItem("token") || "";
  const role = localStorage.getItem("role") || "";

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  const fetchNotifications = async () => {
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(API.NOTIFICATIONS, getAuthConfig());
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API.NOTIFICATIONS}/${id}/read`, {}, getAuthConfig());
      // Optimistically update UI state to avoid layout flashing
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      toast.success("Marked as read");
    } catch (err) {
      console.error("Error marking as read:", err);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API.NOTIFICATIONS}/${id}`, getAuthConfig());
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to delete notification");
    }
  };

  const updateClaimStatus = async (itemId, status) => {
    if (!itemId) return toast.error("Item ID is missing");
    try {
      await axios.patch(`${API.ITEMS}/${itemId}/claim-status`, { status }, getAuthConfig());
      toast.success(`Claim ${status} successfully`);
      fetchNotifications();
    } catch (error) {
      console.error("Error updating claim status:", error);
      toast.error("Failed to update claim status");
    }
  };

  const confirmPickup = async (itemId) => {
    if (!itemId) return toast.error("Item ID is missing");
    try {
      await axios.patch(`${API.ITEMS}/${itemId}/pickup-confirmed`, {}, getAuthConfig());
      toast.success("Pickup confirmed");
      fetchNotifications();
    } catch (error) {
      console.error("Error confirming pickup:", error);
      toast.error(error.response?.data?.message || "Failed to confirm pickup");
    }
  };

  const handleInputChange = (setter, id, value) => {
    setter(prev => ({ ...prev, [id]: value }));
  };

  const verifyDeliveryOtp = async (itemId, notificationId) => {
    const otp = (otpInputs[notificationId] || "").trim();
    if (!itemId) return toast.error("Item ID is missing");
    if (!otp) return toast.error("Enter the OTP to verify delivery");

    try {
      await axios.patch(`${API.ITEMS}/${itemId}/verify-otp`, { otp }, getAuthConfig());
      toast.success("Delivery verified successfully");
      handleInputChange(setOtpInputs, notificationId, "");
      fetchNotifications();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    }
  };

  const acceptBookingRequest = async (bookingId, notificationId) => {
    const ngoId = (ngoIdInputs[notificationId] || "").trim();
    if (!bookingId) return toast.error("Booking ID is missing.");
    if (!ngoId) return toast.error("Enter the NGO ID to accept booking.");

    try {
      await axios.patch(`${API.BOOKINGS}/${bookingId}/accept`, { ngoId }, getAuthConfig());
      toast.success("Booking request accepted successfully!");
      handleInputChange(setNgoIdInputs, notificationId, "");
      fetchNotifications();
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error(error.response?.data?.message || "Failed to accept booking.");
    }
  };

  const verifyBookingOtpAction = async (bookingId, notificationId) => {
    const otp = (otpInputs[notificationId] || "").trim();
    if (!bookingId) return toast.error("Booking ID is missing.");
    if (!otp) return toast.error("Enter the OTP to verify delivery.");

    try {
      await axios.patch(`${API.BOOKINGS}/${bookingId}/verify-otp`, { otp }, getAuthConfig());
      toast.success("Booking delivery verified successfully!");
      handleInputChange(setOtpInputs, notificationId, "");
      fetchNotifications();
    } catch (error) {
      console.error("Error verifying booking OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-slate-100 p-4 sm:p-8 font-sans antialiased">
      <Toaster position="top-right" />
      
      <header className="max-w-4xl mx-auto mb-10 flex items-center justify-between border-b border-gray-800 pb-5">
        <div className="flex items-center gap-3">
          <MdNotificationsActive className="text-emerald-400 text-3xl sm:text-4xl animate-pulse" />
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent select-none">
            Notifications Center
          </h1>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-gray-800 border border-gray-700 text-emerald-400 rounded-full capitalize shadow-inner">
          Role: {role || "Guest"}
        </span>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-32 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm animate-pulse">Syncing updates...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="max-w-md mx-auto flex flex-col items-center justify-center mt-24 p-8 border border-dashed border-gray-800 rounded-2xl bg-gray-900/40 text-center">
          <MdOutlineHourglassEmpty className="text-gray-600 text-5xl mb-4" />
          <p className="text-gray-400 text-lg font-medium">All caught up!</p>
          <p className="text-gray-500 text-sm mt-1">No pending notifications at this time.</p>
        </div>
      ) : (
        <ul className="space-y-4 max-w-4xl mx-auto">
          {notifications.map((note) => {
            const isUnread = !note.isRead;
            
            // Evaluated flags
            const canActOnClaim = role === "vendor" && note.itemId && note.notificationType === "claim_request" && note.actionStatus === "pending";
            const canVerifyOtp = role === "NGO" && note.itemId && note.notificationType === "pickup_confirmed" && note.actionStatus === "pending";
            const canConfirmPickup = role === "Volunteer" && note.itemId && note.notificationType === "claim_approved" && note.actionStatus === "approved";
            const canAcceptBooking = role === "Volunteer" && note.bookingId && note.notificationType === "booking_request" && note.actionStatus === "pending";
            const canVerifyBookingOtp = (role === "NGO" || role === "Volunteer") && note.bookingId && note.notificationType === "booking_pickup_confirmed" && note.actionStatus === "pending";
            const showNgoOtpBadge = role === "NGO" && note.otpCode && (note.notificationType === "booking_pickup_confirmed" || note.notificationType === "claim_approved");

            return (
              <li
                key={note._id}
                className={`bg-gray-900/70 backdrop-blur-md border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-300 hover:border-gray-700 hover:shadow-xl ${
                  isUnread ? "border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 to-transparent" : "border-gray-800"
                }`}
                aria-live={isUnread ? "polite" : "off"}
              >
                {/* Text Content Block */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-2">
                    {isUnread && <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2.5 flex-shrink-0 animate-ping" />}
                    <p className={`text-base font-medium leading-relaxed ${isUnread ? "text-slate-100" : "text-gray-400"}`}>
                      {note.message}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500">
                    <time dateTime={note.createdAt}>
                      {new Date(note.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </time>
                    {isUnread && (
                      <button
                        onClick={() => markAsRead(note._id)}
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold uppercase tracking-wider text-[10px] transition"
                        aria-label="Mark notification as read"
                      >
                        <MdMarkEmailRead size={14} /> Mark Read
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Dynamic Action Area */}
                <div className="flex flex-wrap items-center gap-2.5 lg:justify-end w-full lg:w-auto border-t lg:border-t-0 border-gray-800 pt-4 lg:pt-0">
                  
                  {/* Claim Request: Vendor controls */}
                  {canActOnClaim && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => updateClaimStatus(note.itemId, "approved")}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md shadow-emerald-950/20"
                      >
                        <MdCheckCircle size={18} /> Approve
                      </button>
                      <button
                        onClick={() => updateClaimStatus(note.itemId, "rejected")}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md shadow-rose-950/20"
                      >
                        <MdCancel size={18} /> Reject
                      </button>
                    </div>
                  )}

                  {/* Volunteer Action: Confirm items pickup */}
                  {canConfirmPickup && (
                    <button
                      onClick={() => confirmPickup(note.itemId)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md"
                    >
                      <MdCheckCircle size={18} /> Confirm Pickup
                    </button>
                  )}

                  {/* NGO Action: Verify Delivery OTP */}
                  {canVerifyOtp && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInputs[note._id] || ""}
                        onChange={(e) => handleInputChange(setOtpInputs, note._id, e.target.value)}
                        placeholder={note.otpCode ? `OTP Hint: ${note.otpCode}` : "Enter OTP Code"}
                        className="w-full sm:w-40 rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-600 outline-none focus:border-emerald-500/50 text-center tracking-widest font-mono"
                      />
                      <button
                        onClick={() => verifyDeliveryOtp(note.itemId, note._id)}
                        className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}

                  {/* Volunteer Action: Accept Incoming Booking Request */}
                  {canAcceptBooking && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={ngoIdInputs[note._id] || ""}
                        onChange={(e) => handleInputChange(setNgoIdInputs, note._id, e.target.value)}
                        placeholder="Enter NGO ID"
                        className="w-full sm:w-44 rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-600 outline-none focus:border-emerald-500/50"
                      />
                      <button
                        onClick={() => acceptBookingRequest(note.bookingId, note._id)}
                        className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Accept Booking
                      </button>
                    </div>
                  )}

                  {/* Booking Delivery: OTP verification input */}
                  {canVerifyBookingOtp && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInputs[note._id] || ""}
                        onChange={(e) => handleInputChange(setOtpInputs, note._id, e.target.value)}
                        placeholder="OTP Code"
                        className="w-full sm:w-32 rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-600 outline-none focus:border-emerald-500/50 text-center tracking-widest font-mono"
                      />
                      <button
                        onClick={() => verifyBookingOtpAction(note.bookingId, note._id)}
                        className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}

                  {/* Display Only Static Code Badges for NGOs */}
                  {showNgoOtpBadge && (
                    <div className="w-full sm:w-auto text-center rounded-lg border border-sky-500/20 bg-sky-500/5 px-4 py-2 text-sky-400 text-xs font-mono">
                      Delivery OTP: <span className="font-bold text-sm text-sky-300">{note.otpCode}</span>
                    </div>
                  )}

                  {/* Delete Option */}
                  <button
                    onClick={() => deleteNotification(note._id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 hover:text-rose-400 border border-gray-800 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 transition"
                    aria-label="Delete notification"
                  >
                    <MdDelete size={16} /> <span className="sm:hidden lg:inline">Delete</span>
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