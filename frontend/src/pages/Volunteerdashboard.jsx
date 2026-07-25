import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { MdCheckCircle, MdNotifications, MdEventNote, MdOutlineMarkEmailUnread } from "react-icons/md";

const volunteerImg = "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=800&q=80";

const Volunteerdashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const [itemId, setItemId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingNgoIdInputs, setBookingNgoIdInputs] = useState({});
  const [bookingOtpInputs, setBookingOtpInputs] = useState({});

  const fetchDashboardData = async () => {
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const [bookingRes, notificationRes] = await Promise.all([
        axios.get("http://localhost:3002/api/book/allbooking", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get("http://localhost:3002/api/notifications/notification", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      ]);

      setBookings(bookingRes.data.bookings || []);
      setNotifications(notificationRes.data.notifications || []);
    } catch (error) {
      console.error("❌ Error loading volunteer dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const sendPickupConfirmation = async (event) => {
    event.preventDefault();

    if (!itemId.trim()) {
      toast.error("Enter an item ID first.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3002/api/items/${itemId.trim()}/pickup-confirmed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Pickup confirmation sent to the NGO.");
      setItemId("");
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm pickup.");
    }
  };

  const acceptBookingAction = async (bookingId) => {
    const ngoId = (bookingNgoIdInputs[bookingId] || "").trim();
    if (!ngoId) {
      toast.error("Please enter the NGO ID to accept the booking.");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3002/api/book/${bookingId}/accept`,
        { ngoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking accepted successfully!");
      setBookingNgoIdInputs((prev) => ({ ...prev, [bookingId]: "" }));
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept booking.");
    }
  };

  const confirmBookingPickupAction = async (bookingId) => {
    const ngoId = (bookingNgoIdInputs[bookingId] || "").trim();
    if (!ngoId) {
      toast.error("Please enter the NGO ID to confirm pickup.");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3002/api/book/${bookingId}/pickup-confirmed`,
        { ngoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Pickup confirmed successfully!");
      setBookingNgoIdInputs((prev) => ({ ...prev, [bookingId]: "" }));
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm pickup.");
    }
  };

  const verifyBookingOtpAction = async (bookingId) => {
    const otp = (bookingOtpInputs[bookingId] || "").trim();
    if (!otp) {
      toast.error("Please enter the OTP to verify delivery.");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3002/api/book/${bookingId}/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking delivery verified successfully!");
      setBookingOtpInputs((prev) => ({ ...prev, [bookingId]: "" }));
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3002/api/users/logout", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.clear();
      toast.success("Logout successfully");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const unreadCount = notifications.filter((note) => !note.isRead).length;
  const bookingCount = bookings.length;
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100 flex flex-col font-sans">
      <Toaster position="top-right" />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 grid gap-10 md:grid-cols-[1.15fr_0.85fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-cyan-200 text-sm font-semibold">
              <MdNotifications /> Live Volunteer Dashboard
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-emerald-300 to-indigo-300 text-transparent bg-clip-text drop-shadow-lg">
              Manage pickups, bookings, and delivery signals
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              This dashboard now shows your bookings and notification feed in one place, so pickup confirmation and OTP-driven delivery can happen without hunting through separate screens.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/myprofile"
                className="px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
              >
                My Profile
              </Link>
              <Link
                to="/notifications"
                className="px-6 py-3 rounded-2xl border border-white/15 bg-white/5 font-semibold hover:bg-white/10 transition"
              >
                Open Notifications
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-lg hover:shadow-red-600/40"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
            <img
              src={volunteerImg}
              alt="Volunteering teamwork"
              className="w-full h-full object-cover min-h-[320px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full px-6 py-12 grid gap-6 md:grid-cols-3">
        <StatCard icon={<MdNotifications />} label="Unread Notifications" value={unreadCount} accent="from-cyan-500 to-blue-500" />
        <StatCard icon={<MdEventNote />} label="Total Bookings" value={bookingCount} accent="from-emerald-500 to-green-500" />
        <StatCard icon={<MdOutlineMarkEmailUnread />} label="Pending Bookings" value={pendingBookings} accent="from-fuchsia-500 to-pink-500" />
      </section>

      <section className="max-w-7xl mx-auto w-full px-6 pb-12 grid gap-8 lg:grid-cols-[1fr_1.15fr] items-start">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-gray-900 to-slate-950 p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-3 text-emerald-300">Pickup Confirmation</h2>
          <p className="text-gray-300 mb-6 max-w-2xl">
            After you pick up the item, enter the item ID to notify the NGO. They will verify delivery with the OTP shown in their notification feed.
          </p>

          <form onSubmit={sendPickupConfirmation} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="Paste item ID here"
              className="flex-1 rounded-2xl bg-slate-950/80 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-400"
              aria-label="Item ID"
            />
            <button
              type="submit"
              className="rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400 transition inline-flex items-center justify-center gap-2"
            >
              <MdCheckCircle size={20} /> Confirm Pickup
            </button>
          </form>

          <div className="mt-6 space-y-3 text-sm text-gray-300">
            <p className="flex items-center gap-2"><MdCheckCircle className="text-emerald-400" /> Booking accepted by NGO</p>
            <p className="flex items-center gap-2"><MdCheckCircle className="text-emerald-400" /> Pickup confirmation sent by volunteer</p>
            <p className="flex items-center gap-2"><MdCheckCircle className="text-emerald-400" /> NGO verifies OTP to complete delivery</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Recent Bookings</h2>
            {loading ? (
              <p className="text-gray-400">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-400">No bookings available yet.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
                {bookings.map((booking) => (
                  <div key={booking._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{booking.ngo?.name || "NGO"}</p>
                      <span className="text-xs rounded-full px-3 py-1 bg-cyan-500/15 text-cyan-200 border border-cyan-500/20 capitalize">
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">From: {booking.fromLocation} → To: {booking.toLocation}</p>
                    {booking.notes && <p className="text-xs text-gray-400 mt-1">Notes: {booking.notes}</p>}
                    <p className="text-xs text-gray-500 mt-1">{new Date(booking.createdAt).toLocaleString()}</p>

                    {/* Pending Status Input & Action */}
                    {booking.status === "pending" && (
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={bookingNgoIdInputs[booking._id] || ""}
                          onChange={(e) =>
                            setBookingNgoIdInputs((prev) => ({ ...prev, [booking._id]: e.target.value }))
                          }
                          placeholder="Enter NGO ID to Accept"
                          className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => acceptBookingAction(booking._id)}
                          className="rounded-xl bg-cyan-500 text-slate-950 px-3 py-1.5 text-xs font-bold hover:bg-cyan-400 transition"
                        >
                          Accept
                        </button>
                      </div>
                    )}

                    {/* Accepted Status Input & Action */}
                    {booking.status === "accepted" && (
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={bookingNgoIdInputs[booking._id] || ""}
                          onChange={(e) =>
                            setBookingNgoIdInputs((prev) => ({ ...prev, [booking._id]: e.target.value }))
                          }
                          placeholder="Enter NGO ID for Transport Confirmation"
                          className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
                        />
                        <button
                          onClick={() => confirmBookingPickupAction(booking._id)}
                          className="rounded-xl bg-emerald-500 text-slate-950 px-3 py-1.5 text-xs font-bold hover:bg-emerald-400 transition"
                        >
                          Confirm Transport
                        </button>
                      </div>
                    )}

                    {/* Pickup Confirmed Status Input & Action */}
                    {booking.status === "pickup_confirmed" && (
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={bookingOtpInputs[booking._id] || ""}
                          onChange={(e) =>
                            setBookingOtpInputs((prev) => ({ ...prev, [booking._id]: e.target.value }))
                          }
                          placeholder="Enter OTP to Confirm Delivery"
                          className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-fuchsia-400"
                        />
                        <button
                          onClick={() => verifyBookingOtpAction(booking._id)}
                          className="rounded-xl bg-fuchsia-500 text-white px-3 py-1.5 text-xs font-bold hover:bg-fuchsia-400 transition"
                        >
                          Verify OTP
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>)}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Notifications</h2>
            {loading ? (
              <p className="text-gray-400">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-400">No notifications yet.</p>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                {notifications.slice(0, 8).map((note) => (
                  <div key={note._id} className={`rounded-2xl border p-4 ${note.isRead ? "border-white/10 bg-slate-950/50" : "border-cyan-400/20 bg-cyan-500/10"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{note.notificationType || "notification"}</p>
                      <span className="text-[11px] uppercase tracking-wider text-gray-400">
                        {note.isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 mt-2">{note.message}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                      {note.itemId && <span className="rounded-full border border-white/10 px-2 py-1">Item: {note.itemId}</span>}
                      {note.bookingId && <span className="rounded-full border border-white/10 px-2 py-1">Booking: {note.bookingId}</span>}
                      {note.otpCode && <span className="rounded-full border border-emerald-400/20 px-2 py-1 text-emerald-200">OTP attached</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 border-t border-gray-700 text-gray-500 text-sm backdrop-blur-sm bg-gray-900/60">
        © 2025 VolunteerHub. Crafted with care and purpose.
      </footer>
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }) => (
  <div className={`rounded-3xl p-[1px] bg-gradient-to-r ${accent} shadow-xl`}>
    <div className="rounded-3xl bg-slate-950/90 backdrop-blur-xl p-6 text-center border border-white/5">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-3xl text-white">
        {icon}
      </div>
      <p className="text-gray-400 text-sm uppercase tracking-[0.3em]">{label}</p>
      <p className="mt-2 text-4xl font-extrabold text-white">{value}</p>
    </div>
  </div>
);

export default Volunteerdashboard;
