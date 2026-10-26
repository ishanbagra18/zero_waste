// added new navbar and a charchter called captain zerowaste


import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { Leaf, ArrowDown, MessageSquare } from "lucide-react";
import { useEcoLeaf } from "../context/EcoLeafContext";
import { Activity } from "lucide-react";
import { ArrowRight, BarChart3 } from 'lucide-react';

import {
  ShieldCheck,
  Truck,
  ChartNoAxesColumn,
  Info,
} from "lucide-react";

import {
  ArrowUpRight,
  CheckCircle2,
  HeartHandshake,
  Recycle,
  Sparkles,
  Sprout,
  Globe2,
} from "lucide-react";


import {
  PackageCheck,
  Handshake,
  PackageX,
  Layers,
  Bell,
  Plus,
  ClipboardList,
  User,
  LogOut,
  Edit3,
  Trash2,
  MapPin,
  ChevronDown,
  Building2,
  PieChart as ChartIcon,
  AlertTriangle,
  Clock,
  Zap,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { playClickSound, playSuccessSound } from "../utils/audio";
import ItemCardWithCursor from "../components/items/ItemCardWithCursor";
import useDashboardEntrance from "../hooks/useDashboardEntrance";


const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']; // Example Tailwind colors

const VendorDashboard = () => {
  const dashboardRef = useRef(null);
  useDashboardEntrance(dashboardRef);

  const heroRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const orb4Ref = useRef(null);

  // Parallax Scroll Tracking for Hero
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothHeroProgress = useSpring(heroScrollY, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.001,
  });

  // Deep Background Layer Transforms
  const bgImageY = useTransform(smoothHeroProgress, [0, 1], ["0%", "26%"]);
  const bgImageScale = useTransform(smoothHeroProgress, [0, 1], [1, 1.18]);
  const bgOpacity = useTransform(smoothHeroProgress, [0, 0.9], [1, 0.45]);
  const bgMesh1Y = useTransform(smoothHeroProgress, [0, 1], [0, -140]);
  const bgMesh2Y = useTransform(smoothHeroProgress, [0, 1], [0, 120]);
  const gridY = useTransform(smoothHeroProgress, [0, 1], [0, 60]);

  // Floating Orbs & Eco Badges (Midground)
  const orb1Y = useTransform(smoothHeroProgress, [0, 1], [0, -180]);
  const orb2Y = useTransform(smoothHeroProgress, [0, 1], [0, -260]);
  const orb3Y = useTransform(smoothHeroProgress, [0, 1], [0, -120]);
  const floatBadge1Y = useTransform(smoothHeroProgress, [0, 1], [0, -170]);
  const floatBadge1Rotate = useTransform(smoothHeroProgress, [0, 1], [-2, 8]);
  const floatBadge2Y = useTransform(smoothHeroProgress, [0, 1], [0, -230]);
  const floatBadge2Rotate = useTransform(smoothHeroProgress, [0, 1], [4, -6]);

  // Foreground Left Column (Headline & CTAs)
  const contentY = useTransform(smoothHeroProgress, [0, 1], [0, 95]);
  const contentOpacity = useTransform(smoothHeroProgress, [0, 0.85], [1, 0.2]);
  const contentScale = useTransform(smoothHeroProgress, [0, 1], [1, 0.96]);

  // Foreground Right Column (3D Interactive Visual Card)
  const cardY = useTransform(smoothHeroProgress, [0, 1], [0, 160]);
  const cardRotate = useTransform(smoothHeroProgress, [0, 1], [0, 4.5]);
  const cardScale = useTransform(smoothHeroProgress, [0, 1], [1, 0.94]);
  const cardFloatingBadgeY = useTransform(smoothHeroProgress, [0, 1], [0, -70]);

  // Bottom Scroll Indicator
  const scrollIndicatorOpacity = useTransform(smoothHeroProgress, [0, 0.15], [1, 0]);
  const scrollIndicatorY = useTransform(smoothHeroProgress, [0, 0.15], [0, 18]);

  // Mouse tilt tracking on hero visual card for 3D tactile interaction
  const [cardMousePos, setCardMousePos] = useState({ x: 0, y: 0 });
  const handleCardMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setCardMousePos({ x, y });
  };
  const handleCardMouseLeave = () => {
    setCardMousePos({ x: 0, y: 0 });
  };

  // GSAP subtle floating ambient glow orbs
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          y: "30px",
          x: "22px",
          duration: 6.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          y: "-38px",
          x: "-25px",
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.8,
        });
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          scale: 1.25,
          opacity: 0.65,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.4,
        });
      }
      if (orb4Ref.current) {
        gsap.to(orb4Ref.current, {
          y: "25px",
          x: "-20px",
          duration: 7.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const { token, logout: authLogout } = useAuth();
  const role = localStorage.getItem("role") || "vendor";

  const getDashboardPath = (r) => {
    const norm = (r || "").toLowerCase();
    if (norm === "vendor") return "/vendor/dashboard";
    if (norm === "volunteer") return "/volunteer/dashboard";
    return "/ngo/dashboard";
  };
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [impactReport, setImpactReport] = useState(null);
  const [loadingImpact, setLoadingImpact] = useState(false);

  const fetchImpactReport = async () => {
    try {
      setLoadingImpact(true);
      setShowImpactModal(true);
      playClickSound();
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/items/impact-report`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setImpactReport(res.data);
      playSuccessSound();
    } catch (err) {
      console.error("Failed to load impact report:", err);
      toast.error("Could not fetch impact report at this time.");
    } finally {
      setLoadingImpact(false);
    }
  };
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { leavesEnabled, toggleLeaves } = useEcoLeaf();

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
      console.error("Failed to load notifications:", error);
    }
  };


  // improve the landing page of vendor dashboard

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchMyItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/items/my-items`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 100 },
        });
        if (Array.isArray(res.data.items)) {
          setItems(res.data.items);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Failed to load vendor items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
    fetchNotifications();
  }, [token]);

  const [disintegratingId, setDisintegratingId] = useState(null);

  const confirmDelete = (id) => {
    playClickSound();
    setDeleteItemId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteItemId) return;
    const targetId = deleteItemId;
    setShowConfirmModal(false);
    setDisintegratingId(targetId);

    setTimeout(async () => {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/items/delete-item/${targetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems((prev) => prev.filter((item) => item._id !== targetId));
        playSuccessSound();
        toast.success("Item deleted successfully!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete item");
      } finally {
        setDisintegratingId(null);
        setDeleteItemId(null);
      }
    }, 650);
  };

  const handlebutton = () => {
    navigate("/allngos");
  };

  const handlereadmore = () => {
    navigate("/readmore");
  };

  const handlelogout = async () => {
    try {
      await authLogout();
      toast.success("Logout successful!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const visibleItems = items.slice(0, 5);

  // Stats Aggregations
  const totalItems = items.length;
  const claimedItems = items.filter((item) => item.status === "claimed").length;
  const unclaimedItems = items.filter((item) => item.status !== "claimed").length;
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const pieData = [
    { name: "Claimed Items", value: claimedItems },
    { name: "Unclaimed Items", value: unclaimedItems },
  ].filter(data => data.value > 0);

  const COLORS = ["#facc15", "#10b981"];

  return (
    <div ref={dashboardRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f111a] to-zinc-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30">
      <Toaster position="top-right" />

      {/* 🌟 Multi-Layered Depth Parallax Hero Section */}
      <section
        ref={heroRef}
        data-gsap-intro
        className="relative isolate flex min-h-[105vh] w-full items-center justify-center overflow-hidden bg-slate-950 px-4 pt-24 pb-20 sm:px-6 lg:px-8"
      >
        {/* Layer 1: Parallax Deep Background Image with scale & translation */}
        <motion.div
          style={{ y: bgImageY, scale: bgImageScale, opacity: bgOpacity }}
          className="absolute inset-0 -z-30 pointer-events-none"
        >
          <div
            className="absolute inset-0 w-full h-[120%] -top-[10%]"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(2, 6, 23, 0.96) 0%, rgba(2, 6, 23, 0.85) 48%, rgba(2, 6, 23, 0.52) 100%),
                linear-gradient(0deg, #020617 0%, transparent 40%),
                url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=85&w=2000')
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </motion.div>

        {/* Layer 2: Parallax Ambient Radial Glow Meshes & Perspective Grid */}
        <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
          <motion.div
            style={{ y: bgMesh1Y }}
            className="absolute -left-40 top-12 h-[34rem] w-[34rem] rounded-full bg-emerald-500/[0.14] blur-[130px]"
          />
          <motion.div
            style={{ y: bgMesh2Y }}
            className="absolute -right-32 top-1/4 h-[38rem] w-[38rem] rounded-full bg-teal-400/[0.12] blur-[140px]"
          />
          <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-green-500/[0.08] blur-[120px]" />

          {/* Perspective Matrix Grid with subtle parallax */}
          <motion.div
            style={{
              y: gridY,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage:
                "linear-gradient(to bottom, black 20%, transparent 95%)",
            }}
            className="absolute inset-0 opacity-[0.065]"
          />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        </div>

        {/* Layer 3: Midground Floating Eco-Orbs (GSAP Organic Floating + Scroll Depth Offset) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Eco Orb 1 - Top Left Emerald Halo */}
          <motion.div
            style={{ y: orb1Y }}
            className="absolute top-16 left-[10%]"
          >
            <div
              ref={orb1Ref}
              className="h-36 w-36 rounded-full bg-gradient-to-br from-emerald-400/25 to-teal-500/10 blur-2xl border border-emerald-400/30"
            />
          </motion.div>

          {/* Eco Orb 2 - Bottom Right Cyan Aura */}
          <motion.div
            style={{ y: orb2Y }}
            className="absolute bottom-20 right-[12%]"
          >
            <div
              ref={orb2Ref}
              className="h-52 w-52 rounded-full bg-gradient-to-tr from-teal-400/20 to-cyan-400/10 blur-3xl border border-teal-300/25"
            />
          </motion.div>

          {/* Eco Orb 3 - Mid Center Sparkle Pulse */}
          <motion.div
            style={{ y: orb3Y }}
            className="absolute top-1/3 left-[48%]"
          >
            <div
              ref={orb3Ref}
              className="h-28 w-28 rounded-full bg-emerald-300/15 blur-xl border border-emerald-200/20"
            />
          </motion.div>

          {/* Floating Eco Badge 1 (High Depth Shift) */}
          <motion.div
            style={{ y: floatBadge1Y, rotate: floatBadge1Rotate }}
            className="absolute top-24 left-[28%] hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-950/70 px-4 py-1.5 shadow-xl shadow-emerald-950/40 backdrop-blur-xl text-xs font-semibold text-emerald-300"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <Sprout className="h-3.5 w-3.5 text-emerald-400" />
            <span>Circular Recovery Network</span>
          </motion.div>

          {/* Floating Eco Badge 2 (Above Card Depth Shift) */}
          <motion.div
            style={{ y: floatBadge2Y, rotate: floatBadge2Rotate }}
            className="absolute top-36 right-[24%] hidden xl:flex items-center gap-2 rounded-full border border-teal-400/30 bg-slate-950/70 px-4 py-1.5 shadow-xl shadow-teal-950/40 backdrop-blur-xl text-xs font-semibold text-teal-300"
          >
            <Zap className="h-3.5 w-3.5 text-teal-300 fill-teal-300" />
            <span>Zero Landfill Diversion</span>
          </motion.div>
        </div>

        {/* Layer 4: Foreground Interactive Content (Left Headline & Right 3D Visual Card) */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          
          {/* LEFT: Transform-linked Content */}
          <motion.div
            style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
            className="mx-auto w-full max-w-3xl text-center lg:mx-0 lg:text-left space-y-7"
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-3 rounded-full border border-emerald-400/25 bg-slate-950/60 px-4 py-2 shadow-lg shadow-emerald-950/30 backdrop-blur-xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300 sm:text-xs">
                Supplier Operations Portal
              </span>

              <span className="h-4 w-px bg-white/15" />

              <span className="text-xs font-medium text-slate-300">
                Built for impact
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="relative space-y-2"
            >
              <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
                Give Waste a
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-teal-300 to-green-200 bg-clip-text pb-2 text-transparent">
                  Second Chance.
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="mx-auto max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0 lg:text-xl"
            >
              Turn surplus inventory into something meaningful. Connect your
              business with verified NGOs and make every resource count
              toward a{" "}
              <span className="font-semibold text-emerald-300">
                zero-waste future.
              </span>
            </motion.p>

            {/* Supporting value propositions */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-300 lg:justify-start"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                Reduce surplus waste
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                Support local communities
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                Track real-time impact
              </span>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28 }}
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start pt-2"
            >
              <button
                onClick={() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 px-7 py-4 font-bold text-slate-950 shadow-[0_8px_30px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(16,185,129,0.4)] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />
                <span className="relative">Let's Talk</span>
                <MessageSquare className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </button>

              <button
                onClick={handlereadmore}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Explore Our Mission
                <ArrowDown className="h-4 w-4 text-emerald-300 transition-transform duration-300 group-hover:translate-y-1" />
              </button>

              <button
                onClick={fetchImpactReport}
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-6 py-4 font-bold text-emerald-300 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500/25 hover:border-emerald-400/70 shadow-lg shadow-emerald-500/15 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <ChartNoAxesColumn className="h-4 w-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>Monthly Impact Certificate</span>
              </button>

              <button
                type="button"
                onClick={toggleLeaves}
                className={`group inline-flex items-center justify-center gap-2.5 rounded-2xl border px-7 py-4 font-semibold backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  leavesEnabled
                    ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500/30"
                    : "border-white/15 bg-white/[0.06] text-white hover:border-emerald-400/40 hover:bg-emerald-400/10"
                }`}
              >
                <Leaf className={`h-4 w-4 transition-transform duration-300 ${leavesEnabled ? "rotate-12 text-emerald-400 scale-110" : "text-emerald-400"}`} />
                <span>{leavesEnabled ? "Stop Leaf Animation 🍃" : "Start Leaf Animation 🍃"}</span>
              </button>
            </motion.div>

            {/* Impact indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.34 }}
              className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-7 text-left"
            >
              <div className="px-3 first:pl-0 sm:px-5">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Leaf className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Planet
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white sm:text-base">
                  Less waste
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Better resource use
                </p>
              </div>

              <div className="px-3 sm:px-5">
                <div className="flex items-center gap-2 text-teal-300">
                  <HeartHandshake className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    People
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white sm:text-base">
                  Stronger communities
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Surplus with purpose
                </p>
              </div>

              <div className="px-3 sm:px-5">
                <div className="flex items-center gap-2 text-green-300">
                  <Recycle className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Future
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white sm:text-base">
                  Circular thinking
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  A sustainable tomorrow
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Differential Parallax & 3D Tilt Visual Card */}
          <motion.div
            style={{ y: cardY, rotateZ: cardRotate, scale: cardScale }}
            className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0"
          >
            {/* Ambient Background Aura behind the card */}
            <div className="absolute -inset-6 rounded-[2.8rem] bg-gradient-to-br from-emerald-400/25 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

            {/* 3D Interactive Card Container */}
            <motion.div
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${-cardMousePos.y * 12}deg) rotateY(${cardMousePos.x * 12}deg)`,
                transition: "transform 0.18s cubic-bezier(0.2, 0, 0, 1)",
                transformStyle: "preserve-3d",
              }}
              className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/60 p-3.5 shadow-2xl shadow-black/40 backdrop-blur-2xl"
            >
              <div className="relative overflow-hidden rounded-[1.5rem] group">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=85&w=1200"
                  alt="Sustainable surplus management"
                  className="h-68 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-84"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-lg shadow-lg">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                  Small actions. Real change.
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-400/20 text-emerald-300 backdrop-blur-md shadow-md">
                    <Sprout className="h-5 w-5" />
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    Waste less.
                    <span className="block text-emerald-300">
                      Give more.
                    </span>
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">
                    A better tomorrow starts with what we choose to do today.
                  </p>
                </div>
              </div>

              {/* Bottom card footer */}
              <div className="flex items-center justify-between gap-3 px-3 py-4 sm:px-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Every resource matters
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Join the zero-waste movement
                    </p>
                  </div>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            {/* Differential Parallax Floating Badge on Right Side */}
            <motion.div
              style={{ y: cardFloatingBadgeY }}
              className="absolute -right-3 top-1/3 hidden items-center gap-3 rounded-2xl border border-white/20 bg-slate-950/85 p-3.5 shadow-2xl backdrop-blur-2xl sm:flex lg:-right-8 z-20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                <Recycle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Reuse. Redistribute.</p>
                <p className="mt-1 text-[11px] text-slate-400">Make an impact</p>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* Layer 5: Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity, y: scrollIndicatorY }}
          className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            Scroll to explore
          </span>
          <div className="flex h-8 w-5 justify-center rounded-full border-2 border-emerald-400/40 p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
          </div>
        </motion.div>
      </section>







      {/* 🌿 Why Vendors Matter Value Proposition Grid */}
     <section className="relative py-20 lg:py-32 px-4 sm:px-12 lg:px-8 bg-[#020617] overflow-hidden border-y border-slate-800/50">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            {/* Upgraded Premium Badge */}
            <div className="inline-flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-emerald-400">
                Eco-Impact Vision
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 drop-shadow-sm">
              Why Vendors Matter
            </h3>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Vendors are the backbone of the zero-waste ecosystem. Every surplus item listed transforms potential waste into vital community support.
            </p>
          </div>
        </div>

        {/* Feature Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          
          {/* Card 1: Preventing Landfill Waste */}
          <article className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/50 p-8 rounded-[2rem] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col items-start text-left overflow-hidden">
            {/* Internal Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <span className="relative bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 block mb-6 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20">
              <PackageCheck size={28} strokeWidth={1.5} />
            </span>
            
            <div className="space-y-3 relative z-10">
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
                Direct Waste Diversion
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-normal group-hover:text-slate-300 transition-colors duration-300">
                By listing surplus food and items, commercial suppliers intercept quality goods before disposal, significantly lowering local landfill mass.
              </p>
            </div>
          </article>

          {/* Card 2: Empowering Non-Profits */}
          <article className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-amber-500/50 p-8 rounded-[2rem] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col items-start text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <span className="relative bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-400 block mb-6 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:bg-amber-500/20">
              <Handshake size={28} strokeWidth={1.5} />
            </span>
            
            <div className="space-y-3 relative z-10">
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors duration-300">
                Community Support
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-normal group-hover:text-slate-300 transition-colors duration-300">
                Your excess stock gives non-profit networks instant access to essentials, helping feed families and support local community centers.
              </p>
            </div>
          </article>

          {/* Card 3: ESG & Circular Economy */}
          <article className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/50 p-8 rounded-[2rem] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col items-start text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <span className="relative bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-2xl text-cyan-400 block mb-6 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:bg-cyan-500/20">
              <Zap size={28} strokeWidth={1.5} />
            </span>
            
            <div className="space-y-3 relative z-10">
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors duration-300">
                Circular Brand Equity
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-normal group-hover:text-slate-300 transition-colors duration-300">
                Demonstrate active sustainability leadership, reduce carbon footprints, and earn trust with eco-conscious consumers in your community.
              </p>
            </div>
          </article>

        </div>
      </div>
    </section>










      {/* Active Inventory Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              📦 My Listed Items
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Showing your surplus inventory items.
            </p>
          </div>
          <Link
            to="/vendor/my-items"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition shadow-lg shrink-0"
          >
            View All My Items ({items.length} Total) &rarr;
          </Link>
        </header>

        {/* Loading / Cards Grid Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/[0.04] rounded-3xl p-5 h-80 animate-pulse space-y-4">
                <div className="bg-slate-800 rounded-xl h-40 w-full" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item) => (
                <ItemCardWithCursor
                  key={item._id}
                  onClick={() => navigate(`/vendor/item/${item._id}`)}
                  className="h-full cursor-pointer"
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={
                      disintegratingId === item._id
                        ? {
                          opacity: [1, 0.6, 0],
                          scale: [1, 0.9, 0.5],
                          filter: ["blur(0px)", "blur(12px)", "blur(24px)"],
                          rotate: [0, -3, 3, 0],
                        }
                        : { opacity: 1, scale: 1, y: 0 }
                    }
                    transition={
                      disintegratingId === item._id
                        ? { duration: 0.6, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      filter: "blur(20px)",
                      transition: { duration: 0.3 },
                    }}
                    className="group bg-slate-900/40 backdrop-blur-sm border border-white/[0.06] p-4 rounded-3xl shadow-xl hover:border-emerald-500/30 hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col justify-between relative overflow-visible h-full"
                  >
                    {/* Particle Disintegration Explosion Overlay */}
                    {disintegratingId === item._id && (
                      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-visible">
                        {Array.from({ length: 42 }).map((_, pIdx) => {
                          const angle = (pIdx / 42) * 360 + (pIdx % 5) * 15;
                          const distance = 90 + (pIdx % 7) * 20;
                          const x = Math.cos((angle * Math.PI) / 180) * distance;
                          const y = Math.sin((angle * Math.PI) / 180) * distance;
                          const colors = ["#10b981", "#2dd4bf", "#38bdf8", "#facc15", "#f43f5e", "#a855f7", "#34d399"];
                          const particleColor = colors[pIdx % colors.length];
                          const particleSize = 4 + (pIdx % 6) * 2;

                          return (
                            <motion.span
                              key={pIdx}
                              initial={{ x: 0, y: 0, opacity: 1, scale: 1.2, rotate: 0 }}
                              animate={{
                                x: x,
                                y: y,
                                opacity: 0,
                                scale: 0,
                                rotate: (pIdx % 2 === 0 ? 1 : -1) * 360,
                              }}
                              transition={{
                                duration: 0.65,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              style={{
                                position: "absolute",
                                width: `${particleSize}px`,
                                height: `${particleSize}px`,
                                backgroundColor: particleColor,
                                borderRadius: pIdx % 2 === 0 ? "50%" : "3px",
                                boxShadow: `0 0 12px ${particleColor}`,
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                    <div>
                      <div className="relative rounded-2xl overflow-hidden aspect-video w-full mb-4 border border-white/[0.04] bg-slate-950">
                        <img
                          src={item.itemImage?.url || "https://via.placeholder.com/300"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {(item.isUrgent || (item.expiryDate && (new Date(item.expiryDate).getTime() - Date.now() <= 12 * 60 * 60 * 1000))) && (
                          <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-md flex items-center gap-1 animate-pulse">
                            <Zap size={10} className="fill-slate-950" /> URGENT
                          </span>
                        )}
                        <span className={`absolute top-2 right-2 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md ${item.status === "claimed"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 px-1">
                        <h3 className="text-lg font-bold text-slate-100 truncate" title={item.name}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]" title={item.description || "No description provided"}>
                          {item.description || "No description provided"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.04] space-y-2 text-[11px] text-slate-300 px-1">
                      <div className="flex items-center gap-1.5 text-slate-400 truncate">
                        <MapPin size={12} className="shrink-0 text-emerald-400" />
                        <span>{item.location || "Unknown Location"}</span>
                      </div>

                      {item.expiryDate && (
                        <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[10px]">
                          <Clock size={11} className="shrink-0" />
                          <span>Expires: {new Date(item.expiryDate).toLocaleDateString()} {new Date(item.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-slate-400 bg-white/[0.01] p-2 rounded-xl border border-white/[0.02]">
                        <div>Qty: <span className="font-bold text-slate-200">{item.quantity || 0}</span></div>
                        <div className="truncate">Type: <span className="font-bold text-slate-200">{item.category}</span></div>
                        <div className="col-span-2 truncate">Mode: <span className="font-bold text-slate-200">{item.mode}</span></div>
                      </div>

                      {item.claimStatus && (
                        <div className="text-[10px] bg-slate-950/60 border border-white/[0.04] px-2 py-1 rounded-md w-fit italic text-slate-400">
                          Pipeline Phase: {item.claimStatus}
                        </div>
                      )}

                      <div className="mt-4 pt-2 flex gap-2">
                        <Link
                          to={`/vendor/updateitem/${item._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 inline-flex items-center justify-center gap-1 bg-white/[0.04] hover:bg-emerald-600 border border-white/[0.08] hover:border-emerald-500 text-slate-200 hover:text-white text-xs font-semibold py-2 rounded-xl transition"
                        >
                          <Edit3 size={12} /> Edit
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(item._id);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1 bg-white/[0.02] hover:bg-rose-950/40 border border-white/[0.06] hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-semibold py-2 rounded-xl transition"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </ItemCardWithCursor>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/20 border border-white/[0.04] border-dashed rounded-3xl space-y-3">
            <span className="text-3xl block">📦</span>
            <p className="text-sm font-medium text-slate-500 italic">No operational assets logged on your matrix yet.</p>
          </div>
        )}

        {/* View All Items Link Button */}
        <div className="text-center pt-6">
          <Link
            to="/vendor/my-items"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black px-7 py-3 rounded.2xl transition-all shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-wider rounded-2xl"
          >
            View All My Listed Items ({items.length} Items) &rarr;
          </Link>
        </div>
      </main>






      {/* Analytical Aggregate Block Metrics */}

<section className="relative z-10 mx-auto max-w-7xl overflow-hidden border-t border-white/[0.08] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

  {/* Ambient background */}
  <div className="pointer-events-none absolute left-1/4 top-20 -z-10 h-72 w-72 rounded-full bg-emerald-500/[0.06] blur-[110px]" />
  <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-cyan-500/[0.05] blur-[110px]" />

  {/* Header */}
  <header className="mb-12 flex flex-col items-center text-center sm:mb-14">
    <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 shadow-lg shadow-emerald-950/10 backdrop-blur-xl">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <Activity size={14} className="text-emerald-300" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs">
        Operational Insights
      </span>
    </div>

    <h3 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
      Your Impact,{" "}
      <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
        In Numbers.
      </span>
    </h3>

    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
      A clear snapshot of your ecosystem's inventory, claims, and
      resource distribution. Every item represents an opportunity
      to make a difference.
    </p>

    <div className="mt-6 flex items-center gap-3">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-400/60" />
      <Leaf size={15} className="text-emerald-400" />
      <span className="text-xs font-medium tracking-wide text-slate-500">
        Progress toward a zero-waste future
      </span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-400/60" />
    </div>
  </header>

  {/* Stats grid */}
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

    {/* Total Items Listed */}
    <motion.div data-gsap-card whileHover={{ y: -5, scale: 1.015 }} className="group relative isolate overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/35 hover:shadow-2xl hover:shadow-emerald-950/30 sm:p-7">
      <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-emerald-400/[0.08] blur-3xl transition-all duration-500 group-hover:bg-emerald-400/[0.15]" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-300">
            Total Items Listed
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            Inventory overview
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <PackageCheck size={22} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <h4 className="text-4xl font-black tracking-tight text-white tabular-nums sm:text-5xl">
          {totalItems}
        </h4>
        <span className="mb-1 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          Listed
        </span>
      </div>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500/80 to-emerald-300/30 transition-transform duration-700 group-hover:scale-x-105" />
      </div>
    </motion.div>

    {/* Claimed Items */}
    <motion.div data-gsap-card whileHover={{ y: -5, scale: 1.015 }} className="group relative isolate overflow-hidden rounded-3xl border border-amber-400/15 bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-950 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/35 hover:shadow-2xl hover:shadow-amber-950/20 sm:p-7">
      <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-amber-400/[0.07] blur-3xl transition-all duration-500 group-hover:bg-amber-400/[0.13]" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-300">
            Claimed Items
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            Items claimed by recipients
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Handshake size={22} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <h4 className="text-4xl font-black tracking-tight text-white tabular-nums sm:text-5xl">
          {claimedItems}
        </h4>
        <span className="mb-1 rounded-lg border border-amber-400/15 bg-amber-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
          Claimed
        </span>
      </div>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-amber-500/80 to-amber-300/30 transition-transform duration-700 group-hover:scale-x-105" />
      </div>
    </motion.div>

    {/* Unclaimed Items */}
    <motion.div data-gsap-card whileHover={{ y: -5, scale: 1.015 }} className="group relative isolate overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-950/35 via-slate-900/80 to-slate-950 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/35 hover:shadow-2xl hover:shadow-blue-950/25 sm:p-7">
      <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-blue-400/[0.07] blur-3xl transition-all duration-500 group-hover:bg-blue-400/[0.13]" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-300">
            Unclaimed Items
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            Inventory not yet claimed
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <PackageX size={22} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <h4 className="text-4xl font-black tracking-tight text-white tabular-nums sm:text-5xl">
          {unclaimedItems}
        </h4>
        <span className="mb-1 rounded-lg border border-blue-400/15 bg-blue-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
          Available
        </span>
      </div>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500/80 to-blue-300/30 transition-transform duration-700 group-hover:scale-x-105" />
      </div>
    </motion.div>

    {/* Total Unit Volume */}
    <motion.div data-gsap-card whileHover={{ y: -5, scale: 1.015 }} className="group relative isolate overflow-hidden rounded-3xl border border-pink-400/15 bg-gradient-to-br from-pink-950/30 via-slate-900/80 to-slate-950 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/35 hover:shadow-2xl hover:shadow-pink-950/20 sm:p-7">
      <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-pink-400/[0.07] blur-3xl transition-all duration-500 group-hover:bg-pink-400/[0.13]" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-300">
            Total Unit Volume
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            Combined listed quantity
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-pink-400/20 bg-pink-400/10 text-pink-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Layers size={22} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <h4 className="text-4xl font-black tracking-tight text-white tabular-nums sm:text-5xl">
          {totalQuantity}
        </h4>
        <span className="mb-1 rounded-lg border border-pink-400/15 bg-pink-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-300">
          Quantity
        </span>
      </div>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-pink-500/80 to-pink-300/30 transition-transform duration-700 group-hover:scale-x-105" />
      </div>
    </motion.div>

  </div>

  {/* Footer note */}
  <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-300">
        <Leaf size={17} />
      </div>
      <p className="text-sm leading-6 text-slate-400">
        Every listing creates an opportunity to put resources to better use.
      </p>
    </div>

    <span className="text-xs font-medium text-slate-500">
      Values reflect the data currently available
    </span>
  </div>
</section>












      {/* Interactive Distribution Graphics & NGO Directory Route */}

<section className="relative mx-auto mb-12 max-w-7xl overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/80 px-4 py-8 shadow-2xl shadow-black/20 sm:px-6 sm:py-10 lg:px-8">
  {/* Ambient background */}
  <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/[0.08] blur-[110px]" />
  <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-400/[0.06] blur-[110px]" />

  {/* Section header */}
  <div className="relative mb-8 flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-end">
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5">
        <Sparkles size={14} className="text-emerald-300" />
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
          Network & Analytics
        </span>
      </div>

      <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
        Operations Overview
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
        Connect with community partners and understand how your inventory
        claims are distributed across the pipeline.
      </p>
    </div>

    <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-slate-300">
      <Activity size={15} className="text-emerald-400" />
      <span>Inventory insights</span>
    </div>
  </div>

  <div className="relative grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-7">

    {/* NGO directory card */}
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/35 via-slate-900/80 to-slate-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-xl hover:shadow-emerald-950/30 sm:p-8">

      {/* Card glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/[0.08] blur-[80px] transition-colors duration-500 group-hover:bg-emerald-400/[0.14]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-1/2 bg-gradient-to-r from-emerald-400/60 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-inner shadow-emerald-300/[0.05] transition-transform duration-300 group-hover:scale-105">
            <Building2 size={27} strokeWidth={2} />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Globe2 size={12} className="text-emerald-400" />
            Community network
          </span>
        </div>

        <div className="mt-7 space-y-3">
          <h3 className="max-w-md text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
            Collaborating NGO Network
          </h3>

          <p className="max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
            Discover verified regional nonprofit partners, coordinate
            transport capabilities, and connect surplus inventory with
            communities that need it most.
          </p>
        </div>

        {/* Value proposition rows */}
        <div className="mt-7 space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
              <ShieldCheck size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Trusted partnerships
              </p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Find verified organizations in your network
              </p>
            </div>
            <ArrowUpRight size={16} className="ml-auto shrink-0 text-slate-600" />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
              <Truck size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Smarter coordination
              </p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Match transport capacity with delivery needs
              </p>
            </div>
            <ArrowUpRight size={16} className="ml-auto shrink-0 text-slate-600" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 border-t border-white/[0.08] pt-6">
        <button
          onClick={handlebutton}
          aria-label="View All Partner NGOs"
          className="group/btn inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:brightness-110 hover:shadow-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
        >
          <Building2 size={17} />
          <span>Explore Partner NGOs</span>
          <ArrowRight size={17} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Build stronger connections. Deliver greater impact.
        </p>
      </div>
    </div>

    {/* Distribution analytics card */}
    <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-950/65 p-6 shadow-xl shadow-black/10 sm:p-8">

      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-400/[0.045] blur-[80px]" />

      {/* Chart heading */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.08] text-amber-300">
            <BarChart3 size={21} />
          </div>

          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
            Pipeline Distribution
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-400">
            Breakdown of inventory claims by category
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            Claims
          </span>
        </div>
      </div>

      {/* Chart area */}
      {pieData.length === 0 ? (
        <div className="relative mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.015] px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
            <ChartIcon size={26} className="text-slate-500" />
          </div>

          <h4 className="mt-5 text-sm font-semibold text-slate-200">
            No chart data available yet
          </h4>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
            Once inventory claims are available, their distribution will
            appear here.
          </p>
        </div>
      ) : (
        <div className="relative mt-5 flex flex-1 flex-col">
          <div className="relative min-h-[270px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  outerRadius="72%"
                  innerRadius="52%"
                  paddingAngle={4}
                  cornerRadius={5}
                  dataKey="value"
                  label={({ percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  stroke="none"
                  style={{ outline: "none" }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#020617"
                      strokeWidth={3}
                      className="transition-opacity duration-200 hover:opacity-80"
                    />
                  ))}
                </Pie>

                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "rgba(2, 6, 23, 0.96)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#f8fafc",
                    padding: "12px 14px",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                  }}
                  itemStyle={{ color: "#e2e8f0", fontSize: "12px" }}
                  labelStyle={{
                    color: "#94a3b8",
                    fontSize: "11px",
                    marginBottom: "4px",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    paddingTop: "16px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-3.5">
            <Info size={16} className="mt-0.5 shrink-0 text-amber-300" />
            <p className="text-xs leading-5 text-slate-400">
              Hover over a chart segment to inspect its corresponding
              category and value.
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
</section>















      {/* Confirmation Action Dialog Modal overlay */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 border border-white/[0.08] p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4">
            <div className="mx-auto bg-rose-500/10 text-rose-400 p-3 rounded-full w-fit">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Destructive Action Warning</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you absolutely sure you want to scrub this listing? Erased data parameters cannot be recovered by management pipelines.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition"
              >
                Yes, Delete Item
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 📊 Official ESG Impact Certificate Modal */}
      {showImpactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-400/30 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 backdrop-blur-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-2">
                  <Sparkles size={11} /> UNEP & FAO Audited Standards
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Monthly ESG Ecological Impact Certificate
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified sustainability metrics and carbon mitigation accounting.
                </p>
              </div>
              <button
                onClick={() => setShowImpactModal(false)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {loadingImpact ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-400">Computing audited carbon & meal metrics...</p>
              </div>
            ) : impactReport ? (
              <div className="space-y-6">
                {/* Meta details banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase text-[9px] font-bold">Organization</span>
                    <span className="font-bold text-white text-sm">{impactReport.donor?.organisation || impactReport.donor?.name || "ZeroWaste Partner"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[9px] font-bold">Reporting Period</span>
                    <span className="font-bold text-emerald-300">{impactReport.reportingPeriod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[9px] font-bold">FSSAI Compliance</span>
                    <span className="font-bold text-emerald-400">100% Certified</span>
                  </div>
                </div>

                {/* 4 Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Food Diverted</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{impactReport.impact?.totalWeightKg} <span className="text-xs font-semibold">kg</span></p>
                  </div>
                  <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.06] p-4 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Meals Provided</p>
                    <p className="text-xl sm:text-2xl font-black text-teal-300 mt-1">{impactReport.impact?.mealsRedistributed}</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-4 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">CO₂e Avoided</p>
                    <p className="text-xl sm:text-2xl font-black text-cyan-300 mt-1">{impactReport.impact?.carbonEmissionsPreventedKg} <span className="text-xs font-semibold">kg</span></p>
                  </div>
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Water Saved</p>
                    <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1">{impactReport.impact?.waterConservedLiters?.toLocaleString()} <span className="text-xs font-semibold">L</span></p>
                  </div>
                </div>

                {/* Equivalents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <span className="text-lg">🚗</span>
                    <div>
                      <p className="font-bold text-slate-200">{impactReport.impact?.equivalents?.passengerCarKmAvoided} km</p>
                      <p className="text-[10px] text-slate-400">Passenger car travel emissions averted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <span className="text-lg">🌳</span>
                    <div>
                      <p className="font-bold text-slate-200">{impactReport.impact?.equivalents?.annualTreeAbsorptionEquivalent} trees/year</p>
                      <p className="text-[10px] text-slate-400">Equivalent annual carbon sequestration</p>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="rounded-2xl border border-white/[0.08] bg-slate-950/60 p-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Executive Auditor Narrative</span>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{impactReport.executiveSummary}"
                  </p>
                </div>

                {/* Citations list */}
                <div className="space-y-1 text-[9.5px] text-slate-500 border-t border-white/[0.06] pt-3">
                  <p className="font-bold uppercase tracking-wider text-slate-400">Statutory Methodologies Cited:</p>
                  {impactReport.citations?.map((c, i) => (
                    <p key={i}>• {c}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-4">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs transition"
              >
                🖨️ Print Certificate
              </button>
              <button
                onClick={() => setShowImpactModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Static Presentation Layer Sub-Component For Analytics Displays
const StatCard = ({ icon: Icon, value, label, accentClass, borderClass }) => (
  <div className={`bg-slate-900/40 backdrop-blur-sm border border-white/[0.04] p-5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between min-h-[125px] ${borderClass}`}>
    <span className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl w-fit inline-block text-slate-400">
      <Icon size={18} className={accentClass} />
    </span>
    <div className="mt-4">
      <span className={`text-2xl sm:text-3xl font-black block tracking-tight ${accentClass}`}>{value}</span>
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">{label}</span>
    </div>
  </div>
);

export default VendorDashboard;
