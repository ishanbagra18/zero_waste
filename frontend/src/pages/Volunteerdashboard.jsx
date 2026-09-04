import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Truck,
  CheckCircle2,
  Bell,
  Calendar,
  User,
  LogOut,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Navigation,
  Compass,
  Heart,
  Package,
} from "lucide-react";

export default function Volunteerdashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const [bookingRes, notificationRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/book/allbooking`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/notification`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      ]);

      setBookings(bookingRes.data.bookings || []);
      setNotifications(notificationRes.data.notifications || []);
    } catch (error) {
      console.error("❌ Error loading volunteer dashboard:", error);
      toast.error("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/logout`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.clear();
      toast.success("Signed out successfully.");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const activeTransits = bookings.filter((b) => b.status === "accepted" || b.status === "pickup_confirmed").length;
  const completedDeliveries = bookings.filter((b) => b.status === "completed" || b.status === "delivered").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24 relative">
      <Toaster position="top-right" />

      {/* Hero Header Section */}
      <section className="relative pt-16 pb-12 flex items-center justify-center overflow-hidden">
        {/* Vignette Gradients for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

        {/* Ambient Light Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-8 py-16 text-center space-y-8">
          {/* Status Kicker Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>🟢 Live Logistics Network • Volunteer Hub</span>
          </motion.div>

          {/* Hero Headings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">Hero Volunteer!</span>
            </h1>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-200 tracking-tight">
              Driven by Purpose, Powered by Community
            </h2>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
              Your dedication ensures surplus food moves swiftly from vendors to NGOs. Manage regional food recovery dispatches, accept NGO transport requests, and validate completed deliveries.
            </p>
          </motion.div>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Link
              to="/volunteer/recent-bookings"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 text-slate-950" /> Freight Bookings Console ({totalBookings})
            </Link>

            <Link
              to="/notifications"
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-slate-200 font-bold text-sm backdrop-blur-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 relative"
            >
              <Bell className="w-4 h-4 text-emerald-400" /> Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/myprofile"
              className="px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-sm backdrop-blur-md transition flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-teal-400" /> Profile
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 font-semibold text-sm backdrop-blur-md transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content Dashboard Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 relative z-20 space-y-10">
        {/* Real-time KPI Overview Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={Bell}
            value={unreadCount}
            label="Unread Alerts"
            subtext="Live Socket Feed"
            accent="text-emerald-400"
            border="hover:border-emerald-500/40"
          />
          <StatCard
            icon={Calendar}
            value={totalBookings}
            label="Total Freight Jobs"
            subtext={`${pendingBookings} awaiting approval`}
            accent="text-teal-300"
            border="hover:border-teal-500/40"
          />
          <StatCard
            icon={Activity}
            value={activeTransits}
            label="Active Transits"
            subtext="In-progress transport"
            accent="text-emerald-300"
            border="hover:border-emerald-500/40"
          />
          <StatCard
            icon={ShieldCheck}
            value={completedDeliveries}
            label="Verified Deliveries"
            subtext="OTP validated"
            accent="text-teal-400"
            border="hover:border-teal-500/40"
          />
        </div>

        {/* Primary Logistics Workstation Card */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Primary Logistics Workstation
            </h2>
            <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Station #01 Active
            </span>
          </div>

          <div>
            <Link
              to="/volunteer/recent-bookings"
              className="group p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 backdrop-blur-2xl shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition duration-500" />
              <div className="space-y-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                    Logistics Freight Bookings Console <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                  </h3>
                  <p className="text-sm text-slate-400 mt-2.5 leading-relaxed font-medium max-w-3xl">
                    Access your complete operational queue. Expand any booking to view full waybill details, approve/decline pending requests, confirm transport pickup, and verify 6-digit delivery OTP codes upon destination arrival.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 relative z-10">
                <span className="text-sm">Launch Freight Console ({totalBookings} Total Jobs) &rarr;</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-emerald-300">Operational Hub</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Live Freight Activity Stream */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" /> Live Freight Activity Stream
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time status updates on incoming NGO bookings.</p>
            </div>
            <Link
              to="/notifications"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20"
            >
              <Bell className="w-3.5 h-3.5" /> Notifications ({unreadCount})
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-slate-950/60 border border-slate-800/80 animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Truck className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 italic">No bookings logged in your queue yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((b) => (
                <motion.div
                  key={b._id}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      {b.ngo?.name || "Partner NGO Request"}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{b.fromLocation}</span>
                      <span className="text-slate-600">&rarr;</span>
                      <span className="text-slate-300">{b.toLocation}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-bold capitalize">
                      {b.status}
                    </span>
                    <Link
                      to="/volunteer/recent-bookings"
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, value, label, subtext, accent, border }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className={`p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-3 transition-all ${border}`}
  >
    <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
      <Icon className={`w-5 h-5 ${accent}`} />
    </div>
    <div>
      <span className={`text-2xl sm:text-3xl font-black ${accent}`}>{value}</span>
      <p className="text-xs font-bold text-slate-200 mt-1">{label}</p>
      <p className="text-[10px] font-medium text-slate-400 mt-0.5">{subtext}</p>
    </div>
  </motion.div>
);
