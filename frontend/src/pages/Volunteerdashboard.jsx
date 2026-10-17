import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import useDashboardEntrance from "../hooks/useDashboardEntrance";
import { HeartHandshake } from "lucide-react";
import volunteer3dHero from "../assets/volunteer_3d_hero.png";

import {
  
  Recycle,
  PackageCheck,
  House,
} from "lucide-react";

import {  ArrowRight } from "lucide-react";
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
  const dashboardRef = useRef(null);
  useDashboardEntrance(dashboardRef);
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
    <div ref={dashboardRef} className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24 relative font-sans antialiased">
      <Toaster position="top-right" />

      {/* 🌟 1. Cinematic Hero Landing Banner */}

<section
  data-gsap-intro
  className="relative isolate flex min-h-[75vh] w-full items-center overflow-hidden border-b border-white/[0.08] bg-[#020617] sm:min-h-[85vh]"
  style={{
    backgroundImage: `
      linear-gradient(90deg, rgba(2,6,23,0.97) 0%, rgba(2,6,23,0.88) 48%, rgba(2,6,23,0.68) 100%),
      linear-gradient(0deg, #020617 0%, transparent 45%),
      url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=85&w=2000')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Ambient lighting */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-emerald-500/[0.13] blur-[130px]" />
    <div className="absolute -right-32 top-1/4 h-[35rem] w-[35rem] rounded-full bg-cyan-500/[0.10] blur-[140px]" />
    <div className="absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-teal-500/[0.08] blur-[120px]" />

    <div
      className="absolute inset-0 opacity-[0.055]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "linear-gradient(to bottom, black, transparent 95%)",
      }}
    />

    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
  </div>

  <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
    <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">

      {/* LEFT: Welcome and actions */}
      <div className="space-y-8 lg:col-span-7">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex max-w-full items-center gap-3 rounded-full border border-emerald-400/20 bg-slate-950/55 px-4 py-2.5 shadow-lg shadow-emerald-950/20 backdrop-blur-xl"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          </span>

          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300 sm:text-xs sm:tracking-[0.2em]">
            Volunteer Operations Center
          </span>

          <span className="hidden h-4 w-px bg-white/15 sm:block" />

          <span className="hidden text-xs text-slate-400 sm:block">
            Making every delivery count
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="relative space-y-5"
        >
          <div className="absolute -left-4 top-1 hidden h-28 w-1 rounded-full bg-gradient-to-b from-emerald-400 via-teal-400/50 to-transparent sm:block lg:-left-6" />

          <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-300">
            <HeartHandshake className="h-4 w-4 text-emerald-400" />
            Every journey makes a difference
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
            Welcome,
            <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text pb-2 text-transparent">
              Hero Volunteer.
            </span>
          </h1>

          <h2 className="text-lg font-semibold leading-relaxed text-slate-200 sm:text-xl lg:text-2xl">
            Driven by purpose.{" "}
            <span className="text-slate-400">Powered by community.</span>
          </h2>

          <p className="max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            Turn surplus food into meaningful impact. Coordinate regional
            dispatches, respond to NGO transport requests, and verify
            deliveries with secure 6-digit OTPs.
            <span className="font-medium text-emerald-300">
              {" "}Every successful handoff matters.
            </span>
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Link
            to="/volunteer/recent-bookings"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 px-6 py-4 font-bold text-slate-950 shadow-[0_8px_30px_rgba(16,185,129,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(16,185,129,0.35)] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:px-7"
          >
            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />

            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-black/10">
              <Navigation className="h-[18px] w-[18px]" />
            </span>

            <span className="relative text-left">
              <span className="block text-sm sm:text-base">
                Freight Bookings
              </span>
              <span className="mt-0.5 block text-xs font-medium text-slate-800/75">
                View and manage requests
              </span>
            </span>

            <span className="relative ml-1 rounded-full bg-slate-950/10 px-2.5 py-1 text-sm font-extrabold tabular-nums">
              {totalBookings}
            </span>

            <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => navigate("/readmore")}
            className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:px-7"
          >
            <span>Discover Our Mission</span>
            <ArrowRight className="h-4 w-4 text-emerald-300 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Value indicators */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid max-w-xl grid-cols-3 border-t border-white/10 pt-6"
        >
          <div className="pr-3 sm:pr-5">
            <div className="mb-2 flex items-center gap-2 text-emerald-300">
              <Recycle className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Recover
              </span>
            </div>
            <p className="text-xs leading-5 text-slate-400 sm:text-sm">
              Rescue surplus food
            </p>
          </div>

          <div className="border-l border-white/10 px-3 sm:px-5">
            <div className="mb-2 flex items-center gap-2 text-teal-300">
              <Truck className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Deliver
              </span>
            </div>
            <p className="text-xs leading-5 text-slate-400 sm:text-sm">
              Connect every handoff
            </p>
          </div>

          <div className="border-l border-white/10 pl-3 sm:pl-5">
            <div className="mb-2 flex items-center gap-2 text-cyan-300">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Verify
              </span>
            </div>
            <p className="text-xs leading-5 text-slate-400 sm:text-sm">
              Confirm deliveries
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Logistics visual panel */}
      <motion.div
        initial={{ opacity: 0, x: 28, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.18 }}
        className="relative mx-auto w-full max-w-md lg:col-span-5 lg:ml-auto"
      >
        {/* Background glow */}
        <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-emerald-400/15 via-transparent to-cyan-400/10 blur-2xl" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.12] bg-slate-950/75 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-6">

          {/* Panel header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">
                  Delivery Operations
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Your impact starts here
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] px-3 py-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Volunteer hub
              </span>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative my-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 p-5 sm:p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-emerald-400/10" />
            <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full border border-emerald-400/10" />
            <div className="absolute bottom-0 left-0 h-24 w-40 bg-emerald-400/[0.06] blur-2xl" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  One mission
                </p>
                <p className="mt-2 max-w-[200px] text-2xl font-black leading-tight text-white sm:text-3xl">
                  From surplus
                  <span className="block text-emerald-300">
                    to support.
                  </span>
                </p>
              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-emerald-300/20 bg-emerald-400/10 shadow-inner shadow-emerald-300/10 sm:h-24 sm:w-24">
                <HeartHandshake className="h-10 w-10 text-emerald-300 sm:h-12 sm:w-12" />
              </div>
            </div>

            {/* Journey line */}
            <div className="relative z-10 mt-7 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07] text-slate-300">
                <PackageCheck className="h-4 w-4" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-400/70 via-teal-300/50 to-cyan-400/70" />
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <Truck className="h-4 w-4" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-teal-300/50 to-cyan-400/70" />
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <House className="h-4 w-4" />
              </div>
            </div>

            <div className="relative z-10 mt-2 flex justify-between text-[10px] font-medium text-slate-400 sm:text-xs">
              <span>Surplus</span>
              <span>Transport</span>
              <span>Community</span>
            </div>
          </div>

          {/* Booking callout */}
          <Link
            to="/volunteer/recent-bookings"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-all duration-300 hover:border-emerald-400/25 hover:bg-emerald-400/[0.06]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Navigation className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-white">
                  Freight bookings
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Open your dispatch requests
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 text-sm font-bold tabular-nums text-emerald-300">
                {totalBookings}
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300" />
            </div>
          </Link>

          {/* Footer */}
          <div className="mt-5 flex items-start gap-3 px-1">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <p className="text-xs leading-5 text-slate-400">
              Verify delivery handoffs using your platform's 6-digit OTP
              workflow.
            </p>
          </div>
        </div>

        {/* Floating decorative chip */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-2 top-16 hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-xl backdrop-blur-xl sm:flex lg:-right-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Purpose in motion</p>
            <p className="mt-1 text-[10px] text-slate-400">
              Every handoff matters
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>
</section>













      {/* 🌍 2. Why Volunteers Matter Value Proposition Grid */}
<section className="relative py-16 lg:py-24 px-4 sm:px-12 lg:px-8 bg-gradient-to-b from-slate-950 via-[#0a0c14] to-zinc-950 border-t border-white/[0.04]">
  <div className="max-w-6xl mx-auto space-y-12">

    {/* Section Heading */}
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 bg-emerald-500/[0.07] border border-emerald-400/20 text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Logistics Mission Values
        </span>
      </div>

      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
        Why Volunteer Logistics Matter
      </h3>

      <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-7">
        Every pickup, every secure handoff, and every delivery brings us
        one step closer to a world with less waste and more care.
      </p>
    </div>

    {/* Value Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">

      {/* Card 1 */}
      <article className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400/40 hover:bg-white/[0.045] hover:shadow-[0_15px_45px_-20px_rgba(16,185,129,0.2)]">

        <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-emerald-400/[0.04] transition-all duration-500 group-hover:scale-150 group-hover:bg-emerald-400/[0.08]" />

        <div className="relative mb-7 flex w-full items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-emerald-400/15">
            <FaTruck size={23} />
          </div>
          <span className="text-4xl font-black tracking-tighter text-white/[0.07] group-hover:text-emerald-300/20 transition-colors duration-300">
            01
          </span>
        </div>

        <div className="relative space-y-3">
          <h4 className="text-xl lg:text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-emerald-300">
            Rapid Redistribution
          </h4>
          <p className="text-sm text-slate-400 leading-7">
            Ensure surplus perishable food reaches community centers
            on time through efficient pickups and coordinated
            volunteer transportation.
          </p>
        </div>

        <div className="mt-7 pt-5 w-full border-t border-white/[0.07]">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <FaTruck size={13} />
            Faster pickups. Less waste.
          </span>
        </div>
      </article>

      {/* Card 2 */}
      <article className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-400/40 hover:bg-white/[0.045] hover:shadow-[0_15px_45px_-20px_rgba(129,140,248,0.2)]">

        <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-indigo-400/[0.04] transition-all duration-500 group-hover:scale-150 group-hover:bg-indigo-400/[0.08]" />

        <div className="relative mb-7 flex w-full items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-indigo-400/15">
            <FaShieldAlt size={23} />
          </div>
          <span className="text-4xl font-black tracking-tighter text-white/[0.07] group-hover:text-indigo-300/20 transition-colors duration-300">
            02
          </span>
        </div>

        <div className="relative space-y-3">
          <h4 className="text-xl lg:text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-indigo-300">
            OTP-Verified Handoff
          </h4>
          <p className="text-sm text-slate-400 leading-7">
            Validate every transfer using a six-digit OTP, ensuring
            a more secure, transparent, and accountable delivery
            process from pickup to handoff.
          </p>
        </div>

        <div className="mt-7 pt-5 w-full border-t border-white/[0.07]">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <FaShieldAlt size={13} />
            Secure. Transparent. Reliable.
          </span>
        </div>
      </article>

      {/* Card 3 */}
      <article className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-teal-400/40 hover:bg-white/[0.045] hover:shadow-[0_15px_45px_-20px_rgba(45,212,191,0.2)]">

        <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-teal-400/[0.04] transition-all duration-500 group-hover:scale-150 group-hover:bg-teal-400/[0.08]" />

        <div className="relative mb-7 flex w-full items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-teal-400/15">
            <FaHeart size={23} />
          </div>
          <span className="text-4xl font-black tracking-tighter text-white/[0.07] group-hover:text-teal-300/20 transition-colors duration-300">
            03
          </span>
        </div>

        <div className="relative space-y-3">
          <h4 className="text-xl lg:text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-teal-300">
            Direct Social Impact
          </h4>
          <p className="text-sm text-slate-400 leading-7">
            Empower grassroots NGOs by reducing transportation
            barriers, helping them dedicate more time and resources
            to families and communities in need.
          </p>
        </div>

        <div className="mt-7 pt-5 w-full border-t border-white/[0.07]">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal-300">
            <FaHeart size={13} />
            People first. Always.
          </span>
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
    data-gsap-card
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
