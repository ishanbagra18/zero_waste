import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete, MdCheckCircle, MdCancel } from "react-icons/md";
import { Bell, ArrowLeft, CheckCircle2, Clock, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import ParallaxHero from "../components/ParallaxHero";

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [ngoIdInputs, setNgoIdInputs] = useState({});

  // Getting token and role from localStorage
  const token = localStorage.getItem("token") || "";
  const role = localStorage.getItem("role") || "";

  const NOTIFICATION_API = `${import.meta.env.VITE_API_BASE_URL}/api/notifications/notification`;

  const fetchNotifications = async () => {
    if (!token) return;

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
        `${import.meta.env.VITE_API_BASE_URL}/api/notifications/notification/${id}/read`,
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
        `${import.meta.env.VITE_API_BASE_URL}/api/notifications/notification/${id}`,
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
        `${import.meta.env.VITE_API_BASE_URL}/api/items/${itemId}/claim-status`,
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
        `${import.meta.env.VITE_API_BASE_URL}/api/items/${itemId}/pickup-confirmed`,
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
        `${import.meta.env.VITE_API_BASE_URL}/api/items/${itemId}/verify-otp`,
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

  const extractId = (id) => {
    if (!id) return "";
    if (typeof id === "object") return id._id || id.id || String(id);
    return String(id);
  };

  const acceptBookingRequest = async (bookingId, notificationId) => {
    const cleanBookingId = extractId(bookingId);
    const ngoId = (ngoIdInputs[notificationId] || "").trim();
    if (!cleanBookingId) {
      toast.error("Booking ID is missing.");
      return;
    }
    if (!ngoId) {
      toast.error("Enter the NGO ID to accept booking.");
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/book/${cleanBookingId}/accept`,
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

  const declineBookingRequest = async (bookingId) => {
    const cleanBookingId = extractId(bookingId);
    if (!cleanBookingId) {
      toast.error("Booking ID is missing.");
      return;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/book/${cleanBookingId}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking request declined.");
      fetchNotifications();
    } catch (error) {
      console.error("Error declining booking:", error);
      toast.error(error.response?.data?.message || "Failed to decline booking.");
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
        `${import.meta.env.VITE_API_BASE_URL}/api/book/${bookingId}/pickup-confirmed`,
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
        `${import.meta.env.VITE_API_BASE_URL}/api/book/${bookingId}/verify-otp`,
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

  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for real-time incoming notifications via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleRealtimeNotification = (newNotif) => {
      console.log("🔔 [Notifications Page] Received instant notification:", newNotif);
      setNotifications((prevNotifications) => {
        if (prevNotifications.some((n) => n._id === newNotif._id)) {
          return prevNotifications;
        }
        return [newNotif, ...prevNotifications];
      });
    };

    socket.on("newNotification", handleRealtimeNotification);

    return () => {
      socket.off("newNotification", handleRealtimeNotification);
    };
  }, [socket]);

  const getDashboardPath = (r) => {
    const norm = (r || "").toLowerCase();
    if (norm === "vendor") return "/vendor/dashboard";
    if (norm === "volunteer") return "/volunteer/dashboard";
    return "/ngo/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <ParallaxHero
        badgeText="Real-time Activity Stream"
        title={
          <>
            Notifications <span className="text-emerald-400">Inbox</span>
          </>
        }
        subtitle="Stay updated on claim requests, volunteer dispatches, and delivery verification signals across the exchange network."
        actionButtons={
          <button
            onClick={() => navigate(getDashboardPath(role))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white font-semibold text-sm transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Dashboard
          </button>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Bell className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 italic">No unread notifications at this moment.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((note) => {
              const isUnread = !note.isRead;
              const canActOnClaim = role === "vendor" && note.itemId && note.notificationType === "claim_request" && note.actionStatus === "pending";
              const canVerifyOtp = role === "NGO" && note.itemId && note.notificationType === "pickup_confirmed" && note.actionStatus === "pending";
              const canConfirmPickup = role === "Volunteer" && note.itemId && note.notificationType === "claim_approved" && note.actionStatus === "approved";

              const isVolunteer = role === "Volunteer";
              const canAcceptBooking = isVolunteer && note.bookingId && note.notificationType === "booking_request" && note.actionStatus === "pending";
              const canVerifyBookingOtp = isVolunteer && note.bookingId && note.notificationType === "booking_pickup_confirmed" && note.actionStatus === "pending";

              return (
                <li
                  key={note._id}
                  className={`bg-slate-900/90 border backdrop-blur-2xl rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all duration-300 shadow-xl ${
                    isUnread
                      ? "border-emerald-500/50 shadow-emerald-500/5"
                      : "border-slate-800 hover:border-slate-700 opacity-90"
                  }`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isUnread ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                      <p className={`text-sm sm:text-base font-bold ${isUnread ? "text-white" : "text-slate-300"}`}>
                        {note.message}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1 font-medium pl-4">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(note.createdAt).toLocaleString()}
                    </p>

                    {isUnread && (
                      <button
                        onClick={() => markAsRead(note._id)}
                        className="ml-4 inline-flex items-center gap-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Read
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2.5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    {/* Claim request actions for vendors */}
                    {canActOnClaim && (
                      <>
                        <button
                          onClick={() => updateClaimStatus(note.itemId, "approved")}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition shadow-md shadow-emerald-500/20"
                        >
                          <MdCheckCircle size={16} /> Approve
                        </button>

                        <button
                          onClick={() => updateClaimStatus(note.itemId, "rejected")}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
                        >
                          <MdCancel size={16} /> Reject
                        </button>
                      </>
                    )}

                    {/* Volunteer pickup confirmation */}
                    {canConfirmPickup && (
                      <button
                        onClick={() => confirmPickup(note.itemId)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-1 bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition shadow-md shadow-teal-500/20"
                      >
                        <MdCheckCircle size={16} /> Confirm Pickup
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
                          placeholder={note.otpCode ? `OTP: ${note.otpCode}` : "Enter 6-digit OTP"}
                          className="rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2 text-white text-xs placeholder-slate-500 outline-none focus:border-emerald-500 font-mono tracking-wider"
                        />
                        <button
                          onClick={() => verifyDeliveryOtp(note.itemId, note._id)}
                          className="inline-flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition shadow-md shadow-emerald-500/20"
                        >
                          <KeyRound className="w-3.5 h-3.5" /> Verify Delivery OTP
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
                          className="rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2 text-white text-xs placeholder-slate-500 outline-none focus:border-emerald-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptBookingRequest(note.bookingId, note._id)}
                            className="flex-1 inline-flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-black transition shadow-md"
                          >
                            <MdCheckCircle size={16} /> Approve
                          </button>
                          <button
                            onClick={() => declineBookingRequest(note.bookingId)}
                            className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition"
                          >
                            <MdCancel size={16} /> Decline
                          </button>
                        </div>
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
                          className="rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2 text-white text-xs placeholder-slate-500 outline-none focus:border-emerald-500 font-mono tracking-wider"
                        />
                        <button
                          onClick={() => verifyBookingOtpAction(note.bookingId, note._id)}
                          className="inline-flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition shadow-md"
                        >
                          <KeyRound className="w-3.5 h-3.5" /> Verify OTP
                        </button>
                      </div>
                    )}

                    {role === "NGO" && note.otpCode && (note.notificationType === "booking_pickup_confirmed" || note.notificationType === "claim_approved") && (
                      <div className="w-full md:w-auto rounded-xl border border-teal-500/40 bg-teal-500/10 px-3.5 py-2 text-teal-300 text-xs font-mono">
                        Delivery OTP: <strong className="text-white tracking-widest">{note.otpCode}</strong>
                      </div>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => deleteNotification(note._id)}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
