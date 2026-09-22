import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import volunteer3dHero from "../assets/volunteer_3d_hero.png";
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
  Heart,
  Package,
  PieChart as ChartIcon,
  Leaf,
  Layers,
  Building2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaTruck,
  FaHeart,
  FaShieldAlt,
  FaLeaf,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

export default function Volunteerdashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!token) {
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

  // Pie Chart Data
  const pieData = [
    { name: "Pending Approval", value: pendingBookings },
    { name: "Active In-Transit", value: activeTransits },
    { name: "Verified Delivered", value: completedDeliveries },
  ].filter((d) => d.value > 0);

  const COLORS = ["#facc15", "#38bdf8", "#10b981"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24 relative font-sans antialiased">
      <Toaster position="top-right" />

      {/* 🌟 1. Cinematic Hero Landing Banner */}
      <section
        className="w-full min-h-[75vh] sm:min-h-[85vh] bg-cover bg-center relative flex items-center overflow-hidden border-b border-white/[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.95)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200')",
        }}
      >
        {/* Vignette Gradients for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        {/* Ambient Light Orbs */}
        <div className="absolute left-0 top-0 w-[36rem] h-[36rem] bg-emerald-500/[0.05] rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute right-0 bottom-0 w-[36rem] h-[36rem] bg-teal-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative w-full container mx-auto px-6 sm:px-12 lg:px-8 max-w-7xl z-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Status Kicker Badge */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <p className="text-emerald-400 uppercase tracking-widest text-xs font-black select-none">
                  Live Logistics Operations • Volunteer Hub
                </p>
              </div>

              {/* Styled Headings Structural Block */}
              <div className="space-y-4 border-l-2 border-emerald-500/30 pl-4 sm:pl-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] select-none">
                  Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">Hero Volunteer!</span>
                </h1>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight select-none">
                  Driven by Purpose, Powered by Community
                </h2>

                <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl select-text pt-1">
                  Your dedication accelerates surplus food recovery. Manage regional food dispatches, accept transport requests from NGOs, and validate deliveries with 6-digit OTP codes.
                </p>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    to="/volunteer/recent-bookings"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-emerald-950/40 transition text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4 text-slate-950" /> Freight Bookings Console ({totalBookings})
                  </Link>

                  <button
                    onClick={() => navigate('/readmore')}
                    className="border border-slate-700 hover:border-emerald-500/50 text-slate-200 font-bold px-6 py-3 rounded-xl hover:bg-white/5 transition text-xs sm:text-sm"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Visual Asset */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative group">
              {/* Outer Vibrant Glow Ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-teal-400/10 to-cyan-500/20 rounded-3xl blur-3xl opacity-60 group-hover:opacity-90 transition duration-700 pointer-events-none" />

              {/* Animated Floating 3D Graphic */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                transition={{
                  y: { duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                  opacity: { duration: 0.8 },
                  scale: { duration: 0.8 },
                }}
                className="relative max-w-md w-full flex items-center justify-center overflow-hidden"
              >
                <img
                  src="https://i.pinimg.com/originals/21/cc/d0/21ccd0e8897e00e9c19eeac49dc47288.gif"
                  alt="3D Volunteer Logistics Motion Graphic"
                  className="w-full h-auto object-contain max-h-[320px] rounded-3xl mix-blend-screen opacity-95 hover:scale-105 transition-transform duration-500 relative z-10 shadow-2xl"
                  loading="lazy"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌍 2. Why Volunteers Matter Value Proposition Grid */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-12 lg:px-8 bg-gradient-to-b from-slate-950 via-[#0a0c14] to-zinc-950 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto space-y-12">

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Logistics Mission Values
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 select-none">
              Why Volunteer Logistics Matter
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Block 1 */}
            <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-emerald-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
              <span className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl text-emerald-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
                <FaTruck size={22} />
              </span>
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-200">
                  Rapid Redistribution
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  Rapid transport dispatches ensure surplus perishable food is picked up from vendors and delivered to community centers before expiry.
                </p>
              </div>
            </article>

            {/* Block 2 */}
            <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-indigo-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
              <span className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-2xl text-indigo-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
                <FaShieldAlt size={22} />
              </span>
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
                  OTP Verified Handoff
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  6-digit security OTP pins validate every delivery point, guaranteeing full transparency and accountability for all items transferred.
                </p>
              </div>
            </article>

            {/* Block 3 */}
            <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-teal-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute inset-0 bg-teal-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
              <span className="bg-teal-500/10 border border-teal-500/20 p-3.5 rounded-2xl text-teal-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
                <FaHeart size={22} />
              </span>
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-teal-400 transition-colors duration-200">
                  Direct Social Impact
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  Empower grassroots NGOs by removing transport hurdles, letting them focus resources directly on serving families in need.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 📊 3. Real-time Analytical Metrics Overview */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="text-center space-y-2 mb-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Operational Activity Metrics
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Live summary of your regional transport jobs and delivery status.
          </p>
        </header>

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
            accent="text-blue-400"
            border="hover:border-blue-500/40"
          />
          <StatCard
            icon={ShieldCheck}
            value={completedDeliveries}
            label="Verified Deliveries"
            subtext="OTP validated"
            accent="text-emerald-400"
            border="hover:border-emerald-500/40"
          />
        </div>

        {/* 🚛 4. Primary Workstation & Visual Chart Module Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Primary Workstation Card */}
          <div className="lg:col-span-7">
            <Link
              to="/volunteer/recent-bookings"
              className="group p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 backdrop-blur-2xl shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition duration-500" />
              <div className="space-y-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                    Logistics Freight Console <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                  </h3>
                  <p className="text-sm text-slate-400 mt-2.5 leading-relaxed font-medium">
                    Access your complete operational queue. Expand any booking to view full waybill details, approve pending transport requests, confirm pickup, and enter delivery verification OTP codes.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 relative z-10">
                <span className="text-sm">Open Full Console ({totalBookings} Total Jobs) &rarr;</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-emerald-300">Station Active</span>
              </div>
            </Link>
          </div>

          {/* Recharts Pie Distribution Graphic */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[340px] backdrop-blur-xl">
            <h4 className="text-sm font-bold tracking-wide text-slate-300 flex items-center gap-2 mb-4">
              <ChartIcon size={16} className="text-emerald-400" /> Freight Status Distribution
            </h4>

            {pieData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs italic space-y-2">
                <span>📊</span>
                <p>No freight jobs registered to render chart visualizer.</p>
              </div>
            ) : (
              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      outerRadius={75}
                      innerRadius={50}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#020617" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderRadius: "12px", borderColor: "rgba(255,255,255,0.08)" }} />
                    <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* 📋 5. Live Freight Activity Queue Stream */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" /> Live Freight Queue Stream
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Recent transport requests and pickup jobs.</p>
            </div>
            <Link
              to="/volunteer/recent-bookings"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20"
            >
              View All Freight Jobs ({totalBookings}) &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-slate-950/60 border border-slate-800/80 animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Truck className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No active bookings found in your queue.</p>
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
      </main>
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
