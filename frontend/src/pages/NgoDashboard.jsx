// added new navbar and a charchter called captain zerowaste


import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import useDashboardEntrance from "../hooks/useDashboardEntrance";
import { useEcoLeaf } from "../context/EcoLeafContext";
import {
  ShoppingBag,
  User,
  ClipboardCheck,
  LogOut,
} from 'lucide-react';


import {
  Sprout,
  Leaf,
  PackageOpen,
  ArrowUpRight,
  ArrowRight,
  Recycle,
  HeartHandshake,
  Globe2,
  ChevronDown,
  Sparkles,
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
  FaLeaf,
  FaUsers,
  FaLightbulb,
  FaBoxOpen,
  FaHourglassHalf,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";



const NgoDashboard = () => {
  const dashboardRef = useRef(null);
  useDashboardEntrance(dashboardRef);
  const navigate = useNavigate();
  const { leavesEnabled, toggleLeaves } = useEcoLeaf();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "NGO";

  const getDashboardPath = (r) => {
    const norm = (r || "").toLowerCase();
    if (norm === "vendor") return "/vendor/dashboard";
    if (norm === "volunteer") return "/volunteer/dashboard";
    return "/ngo/dashboard";
  };

  const [claimedItems, setClaimedItems] = useState([]);
  const [notifications, setNotifications] = useState([]);



  const NOTIFICATION_API = `${import.meta.env.VITE_API_BASE_URL}/api/notifications/notification`;

  const unreadCount = notifications.filter(n => !n.isRead).length;




  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;

      try {
        const res = await axios.get(NOTIFICATION_API, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("✅ Notifications fetched:", res.data.notifications);
        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    const fetchMyClaimed = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/items/get-claimed-items`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setClaimedItems(res.data.claimedItems || []);
      } catch (error) {
        console.error("Error fetching claimed items:", error);
      }
    };

    fetchMyClaimed();
    fetchNotifications();
  }, [token, NOTIFICATION_API]);



  const handleRedirect = () => {
    navigate('/allvendors');
  };











  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/logout`, {
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

  const totalClaims = claimedItems.length;
  const pending = claimedItems.filter((item) => item.claimStatus === "pending").length;
  const approved = claimedItems.filter((item) => item.claimStatus === "approved").length;
  const assigned = claimedItems.filter((item) => item.deliveryStatus === "volunteer_assigned").length;
  const pickupConfirmed = claimedItems.filter((item) => item.deliveryStatus === "pickup_confirmed").length;
  const delivered = claimedItems.filter(
    (item) => item.deliveryStatus === "delivered" || item.claimStatus === "collected"
  ).length;
  const impactScore = delivered * 10 + pickupConfirmed * 5 + assigned * 2;



  const pieData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Delivered", value: delivered },
  ];

  const COLORS = ["#10b981", "#6366f1", "#f43f5e"];
  /* ─── Plant Growth Scroll-Driven Frame Animation State ─── */
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const framesRef = useRef([]);
  const rafIdRef = useRef(null);
  const lastDrawnFrameRef = useRef(-1);
  const [framesLoaded, setFramesLoaded] = useState(false);

  // Sample every 3rd frame (55 frames total): cuts network requests & memory by 67%
  // while preserving buttery-smooth 60fps scroll animation
  const frameNumbers = useRef(
    Array.from({ length: 166 }, (_, i) => i + 1).filter((n, idx) => n !== 163 && idx % 3 === 0)
  );
  const TOTAL_FRAMES = frameNumbers.current.length;

  // Ultra-fast white-background chroma keying processor: converts light background to 100% transparent
  const processFrame = (img) => {
    try {
      const off = document.createElement('canvas');
      const targetW = 640;
      const aspect = (img.naturalWidth || 1280) / (img.naturalHeight || 720);
      const targetH = Math.round(targetW / aspect);
      off.width = targetW;
      off.height = targetH;
      const octx = off.getContext('2d', { willReadFrequently: true });
      octx.drawImage(img, 0, 0, targetW, targetH);
      const idata = octx.getImageData(0, 0, targetW, targetH);
      const data = idata.data;
      const len = data.length;

      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxRGB = Math.max(r, g, b);
        const minRGB = Math.min(r, g, b);
        const sat = maxRGB - minRGB;
        const bright = (r + g + b) / 3;

        // Key out white / light-grey background (high brightness, low saturation)
        if (bright > 125 && sat < 42) {
          let alphaScale = (205 - bright) / 80;
          if (alphaScale < 0) alphaScale = 0;
          else if (alphaScale > 1) alphaScale = 1;

          if (sat < 22 && bright > 155) {
            alphaScale = Math.min(alphaScale, sat / 22);
          }
          data[i + 3] = Math.round(data[i + 3] * alphaScale);
        }
      }
      octx.putImageData(idata, 0, 0);
      return off;
    } catch {
      return img;
    }
  };

  // Preload frames with instant Frame 0 and background idle batching
  useEffect(() => {
    let cancelled = false;
    const images = new Array(TOTAL_FRAMES).fill(null);
    framesRef.current = images;

    const frameLoaders = import.meta.glob(
      '../assets/plant-frames/frame_*.jpg'
    );

    const loaderByNumber = {};
    for (const [path, loader] of Object.entries(frameLoaders)) {
      const match = path.match(/frame_(\d+)\.jpg$/);
      if (match) loaderByNumber[parseInt(match[1], 10)] = loader;
    }

    // Step 1: Only load Frame 0 on initial render
    const initialNum = frameNumbers.current[0];
    const initialLoader = loaderByNumber[initialNum];
    if (initialLoader) {
      initialLoader().then((mod) => {
        if (cancelled) return;
        const firstImg = new Image();
        firstImg.src = mod.default;
        firstImg.onload = () => {
          if (cancelled) return;
          images[0] = processFrame(firstImg);
          setFramesLoaded(true);

          // Step 2: Lazy load remaining frames gradually on idle without blocking main thread
          let nextIdx = 1;
          const scheduleNextBatch = () => {
            if (cancelled || nextIdx >= TOTAL_FRAMES) return;
            const batchEnd = Math.min(nextIdx + 4, TOTAL_FRAMES);
            for (let i = nextIdx; i < batchEnd; i++) {
              const num = frameNumbers.current[i];
              const loader = loaderByNumber[num];
              const currentIdx = i;
              if (loader) {
                loader().then((m) => {
                  if (cancelled) return;
                  const img = new Image();
                  img.src = m.default;
                  img.onload = () => {
                    if (!cancelled) {
                      images[currentIdx] = processFrame(img);
                    }
                  };
                });
              }
            }
            nextIdx = batchEnd;
            if (nextIdx < TOTAL_FRAMES) {
              if ('requestIdleCallback' in window) {
                requestIdleCallback(scheduleNextBatch, { timeout: 150 });
              } else {
                setTimeout(scheduleNextBatch, 40);
              }
            }
          };

          if ('requestIdleCallback' in window) {
            requestIdleCallback(scheduleNextBatch, { timeout: 200 });
          } else {
            setTimeout(scheduleNextBatch, 80);
          }
        };
      });
    }

    return () => { cancelled = true; };
  }, []);

  // Draw a specific frame index onto the canvas (with fallback to nearest ready frame)
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let img = framesRef.current[index];
    if (!img) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (index - offset >= 0 && framesRef.current[index - offset]) {
          img = framesRef.current[index - offset];
          break;
        }
        if (index + offset < TOTAL_FRAMES && framesRef.current[index + offset]) {
          img = framesRef.current[index + offset];
          break;
        }
      }
    }
    if (!img) return;
    if (lastDrawnFrameRef.current === index && lastDrawnFrameRef.current !== -1) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      ctx.scale(dpr, dpr);
    }

    // Draw plant smaller and positioned further to the right
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    const imgRatio = imgWidth / imgHeight;
    const plantScale = 0.55; // 55% of viewport height
    const drawH = h * plantScale;
    const drawW = drawH * imgRatio;
    // Position: shifted further right towards right edge
    const drawX = w - drawW + (w * 0.04);
    const drawY = (h - drawH) / 2;

    // 1. Clear canvas transparently so the background image, perspective grid, and ambient lighting show through
    ctx.clearRect(0, 0, w, h);

    // 2. Draw the transparent plant frame cleanly
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    lastDrawnFrameRef.current = index;
  }, []);

  // Scroll handler: map scroll position within the section to frame index
  useEffect(() => {
    if (!framesLoaded) return;
    // Draw first frame immediately
    drawFrame(0);

    const onScroll = () => {
      if (rafIdRef.current) return; // rAF throttle
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionHeight = section.scrollHeight - window.innerHeight;
        if (sectionHeight <= 0) return;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
        );
        drawFrame(frameIndex);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial draw
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [framesLoaded, drawFrame]);

  // Resize handler to re-draw current frame on viewport change
  useEffect(() => {
    if (!framesLoaded) return;
    const onResize = () => {
      lastDrawnFrameRef.current = -1; // force redraw
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
      );
      drawFrame(frameIndex);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [framesLoaded, drawFrame]);

  // Text is always visible from the start (no scroll-dependent reveal)

  return (
    <div ref={dashboardRef} className="min-h-screen bg-gradient-to-br from-[#0f0f1c] via-[#111827] to-[#1f2937] text-white">
      <Toaster />


      {/* Hero Section — Scroll-Driven Plant Growth Frame Animation */}
   

<section
  data-gsap-intro
  ref={sectionRef}
  className="relative isolate h-[300vh] border-b border-white/[0.06] bg-[#070b14]"
>
  {/* Sticky viewport for scroll-driven plant animation */}
  <div className="sticky top-0 h-screen h-[100svh] min-h-[600px] w-full overflow-hidden">

    {/* Loading screen */}
    {!framesLoaded && (
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070b14]">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-emerald-400/20" />
          <div className="absolute inset-2 rounded-full border border-emerald-400/30" />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <Sprout size={26} />
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-white">
          Preparing your eco experience
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Growing a greener tomorrow...
        </p>

        <div className="mt-5 h-1 w-36 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" />
        </div>
      </div>
    )}

    {/* 🌿 1. Atmospheric Background Image Layer (Community Food Bank & Rescue Operations) */}
    <div
      className="pointer-events-none absolute inset-0 -z-30 overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(7, 11, 20, 0.97) 0%, rgba(7, 11, 20, 0.88) 46%, rgba(7, 11, 20, 0.58) 100%),
          linear-gradient(0deg, #070b14 0%, transparent 45%),
          url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=85&w=2000')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    {/* 🌌 2. Ambient Lighting Glow Meshes & Perspective Grid */}
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      {/* Emerald aura left */}
      <div className="absolute -left-36 top-10 h-[34rem] w-[34rem] rounded-full bg-emerald-500/[0.14] blur-[130px]" />
      {/* Cyan/Teal halo right behind the growing plant, giving its leaves an ethereal highlight */}
      <div className="absolute -right-28 top-1/4 h-[36rem] w-[36rem] rounded-full bg-teal-400/[0.12] blur-[140px]" />
      {/* Deep green ambient pool bottom-center */}
      <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-green-500/[0.08] blur-[120px]" />

      {/* Perspective Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.32) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "linear-gradient(to bottom, black 25%, transparent 95%)",
        }}
      />

      {/* Top glowing boundary line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
    </div>

    {/* Plant animation canvas — keep the entire right side visible and transparent */}
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 h-full w-full pointer-events-none"
      style={{
        display: framesLoaded ? "block" : "none",
        willChange: "transform",
      }}
    />

    {/* Background lighting & reading area veil — protects left text area while keeping plant area transparent */}
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {/* Dark reading area on the left only */}
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#070b14] via-[#070b14]/94 via-[42%] to-transparent sm:via-[38%] lg:w-[74%] lg:via-[#070b14]/85 lg:via-[48%] lg:to-transparent" />

      {/* Slight bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070b14]/75 to-transparent" />

      {/* Gentle glow behind the text, not over the plant */}
      <div className="absolute -left-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-emerald-500/[0.08] blur-[130px]" />

      {/* Very subtle top vignette */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#070b14]/30 to-transparent" />
    </div>

    {/* Hero content — deliberately constrained to the left */}
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="w-full max-w-[590px] lg:w-[49%] xl:max-w-[640px]">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex max-w-full items-center gap-3 rounded-full border border-emerald-400/20 bg-slate-950/50 px-4 py-2.5 backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300 sm:text-xs sm:tracking-[0.2em]">
              Ecosystem Hub Portal
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="relative border-l-2 border-emerald-400/50 py-1 pl-4 sm:pl-6"
          >
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
              Welcome,
              <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text pb-2 text-transparent">
                Changemaker.
              </span>
            </h1>

            <h2 className="mt-5 text-xl font-bold leading-snug tracking-tight text-slate-100 sm:text-2xl md:text-3xl">
              Small things today.
              <span className="mt-1 block text-slate-400">
                A better world tomorrow.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300/90 sm:text-base sm:leading-8 md:text-lg">
              Your actions can shape a more sustainable future.
              Reduce waste, uplift communities, and help valuable
              resources find a second life — one meaningful step
              at a time.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <motion.button
              type="button"
              whileHover={{
                scale: 1.025,
                boxShadow: "0 10px 30px rgba(16,185,129,0.25)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/vendor/allitems")}
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-400 to-teal-300 px-5 py-4 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-950/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:px-6"
            >
              <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />

              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/10">
                <PackageOpen size={19} />
              </span>

              <span className="relative">Explore Surplus Items</span>

              <ArrowUpRight
                size={17}
                className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{
                scale: 1.025,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/readmore")}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-slate-950/30 px-6 py-4 text-sm font-semibold text-slate-100 backdrop-blur-md transition-colors hover:border-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <span>Discover Our Mission</span>
              <ArrowRight
                size={17}
                className="text-emerald-300 transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{
                scale: 1.025,
              }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleLeaves}
              className={`group inline-flex items-center justify-center gap-2.5 rounded-2xl border px-6 py-4 text-sm font-semibold backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                leavesEnabled
                  ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500/30"
                  : "border-white/15 bg-slate-950/30 text-slate-100 hover:border-emerald-400/40 hover:bg-white/[0.08]"
              }`}
            >
              <Leaf className={`h-4 w-4 transition-transform duration-300 ${leavesEnabled ? "rotate-12 text-emerald-400 scale-110" : "text-emerald-400"}`} />
              <span>{leavesEnabled ? "Stop Leaf Animation 🍃" : "Start Leaf Animation 🍃"}</span>
            </motion.button>
          </motion.div>

          {/* Compact value propositions */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5 sm:gap-x-6"
          >
            <div className="flex items-center gap-2">
              <Recycle size={16} className="shrink-0 text-emerald-300" />
              <span className="text-xs font-medium text-slate-300 sm:text-sm">
                Reduce waste
              </span>
            </div>

            <span className="hidden h-4 w-px bg-white/15 sm:block" />

            <div className="flex items-center gap-2">
              <HeartHandshake size={16} className="shrink-0 text-teal-300" />
              <span className="text-xs font-medium text-slate-300 sm:text-sm">
                Support communities
              </span>
            </div>

            <span className="hidden h-4 w-px bg-white/15 sm:block" />

            <div className="flex items-center gap-2">
              <Leaf size={16} className="shrink-0 text-cyan-300" />
              <span className="text-xs font-medium text-slate-300 sm:text-sm">
                Protect our planet
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Small decorative label on the bottom-right, not a card */}
    {framesLoaded && (
      <div className="pointer-events-none absolute bottom-8 right-6 z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-slate-950/25 px-4 py-2 text-xs font-medium text-slate-300/80 backdrop-blur-sm md:flex lg:right-10">
        <Sprout size={14} className="text-emerald-300" />
        <span>Growth begins with one small action</span>
      </div>
    )}

    {/* Scroll indicator */}
    {framesLoaded && (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-7"
      >
        <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 backdrop-blur-md">
          Scroll to grow
        </span>

        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
        >
          <ChevronDown size={17} />
        </motion.div>
      </motion.div>
    )}
  </div>
</section>









      {/* 🌍 Why NGOs Matter Value Proposition Grid */}
 
<section className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#070b14] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
  {/* Background decoration */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
  >
    <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
    <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-500/[0.05] blur-[100px]" />
    <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-pink-500/[0.04] blur-[100px]" />
  </div>

  <div className="mx-auto max-w-7xl">
    {/* Section header */}
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mx-auto mb-14 max-w-3xl text-center sm:mb-16"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
        Our mission & values
      </span>

      <h3 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        Why NGOs{" "}
        <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
          Matter
        </span>
      </h3>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
        Turning surplus into opportunity through sustainable food
        recovery, stronger communities, and responsible resource sharing.
      </p>

      <div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
    </motion.div>

    {/* Mission cards */}
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
      {/* Sustainability */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        whileHover={{ y: -6 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-xl shadow-black/10 transition-colors duration-300 hover:border-emerald-400/30 hover:bg-emerald-400/[0.025] sm:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/[0.06] blur-3xl transition duration-500 group-hover:bg-emerald-400/[0.12]"
        />

        <div className="relative flex items-center justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition duration-300 group-hover:scale-105 group-hover:bg-emerald-400/[0.15]">
            <FaLeaf size={24} />
          </span>

          <span className="text-xs font-bold tracking-[0.18em] text-emerald-400/60">
            01
          </span>
        </div>

        <div className="relative mt-8 flex-1">
          <h4 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-emerald-300 sm:text-2xl">
            Sustainability
          </h4>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Redirecting usable surplus food away from landfills helps
            reduce waste and encourages more responsible resource
            management across local communities.
          </p>
        </div>

        <div className="relative mt-7 border-t border-white/[0.07] pt-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Reduce waste. Recover value.
          </div>
        </div>
      </motion.article>

      {/* Community upliftment */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        whileHover={{ y: -6 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-xl shadow-black/10 transition-colors duration-300 hover:border-indigo-400/30 hover:bg-indigo-400/[0.025] sm:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-400/[0.06] blur-3xl transition duration-500 group-hover:bg-indigo-400/[0.12]"
        />

        <div className="relative flex items-center justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 transition duration-300 group-hover:scale-105 group-hover:bg-indigo-400/[0.15]">
            <FaUsers size={24} />
          </span>

          <span className="text-xs font-bold tracking-[0.18em] text-indigo-400/60">
            02
          </span>
        </div>

        <div className="relative mt-8 flex-1">
          <h4 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-indigo-300 sm:text-2xl">
            Community Upliftment
          </h4>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Connecting NGOs with food vendors helps coordinate surplus
            collection and distribution, making essential resources more
            accessible to families and communities in need.
          </p>
        </div>

        <div className="relative mt-7 border-t border-white/[0.07] pt-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Connect people. Create impact.
          </div>
        </div>
      </motion.article>

      {/* Awareness */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        whileHover={{ y: -6 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-xl shadow-black/10 transition-colors duration-300 hover:border-pink-400/30 hover:bg-pink-400/[0.025] sm:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-400/[0.06] blur-3xl transition duration-500 group-hover:bg-pink-400/[0.12]"
        />

        <div className="relative flex items-center justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-pink-400/20 bg-pink-400/10 text-pink-300 transition duration-300 group-hover:scale-105 group-hover:bg-pink-400/[0.15]">
            <FaLightbulb size={24} />
          </span>

          <span className="text-xs font-bold tracking-[0.18em] text-pink-400/60">
            03
          </span>
        </div>

        <div className="relative mt-8 flex-1">
          <h4 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-pink-300 sm:text-2xl">
            Awareness & Education
          </h4>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Encouraging mindful consumption and responsible food
            management helps communities recognize the value of surplus
            resources and make more sustainable choices.
          </p>
        </div>

        <div className="relative mt-7 border-t border-white/[0.07] pt-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
            Build awareness. Inspire change.
          </div>
        </div>
      </motion.article>
    </div>

    {/* Closing statement */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-8 rounded-2xl border border-emerald-400/10 bg-gradient-to-r from-emerald-400/[0.06] via-white/[0.02] to-teal-400/[0.04] px-5 py-6 text-center sm:px-8"
    >
      <p className="text-sm leading-7 text-slate-300 sm:text-base">
        <span className="font-semibold text-emerald-300">
          Less waste, more possibilities.
        </span>{" "}
        Every meaningful partnership brings us closer to a more
        resourceful and compassionate community.
      </p>
    </motion.div>
  </div>
</section>

















      {/* 📊 High-Fidelity Analytical Statistics Layout Card Section */}

<section className="relative isolate overflow-hidden py-16 sm:py-20 px-4 sm:px-8 lg:px-8 bg-gradient-to-b from-[#0b1020] via-slate-950 to-[#090b14]">
  {/* Ambient background accents */}
  <div className="absolute -top-24 left-1/4 -z-10 h-64 w-64 rounded-full bg-emerald-500/[0.07] blur-[100px] pointer-events-none" />
  <div className="absolute top-1/3 -right-24 -z-10 h-72 w-72 rounded-full bg-blue-500/[0.06] blur-[110px] pointer-events-none" />

  <div className="relative mx-auto max-w-7xl space-y-10 sm:space-y-12">

    {/* Section Header */}
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.06)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live Operational Stream
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          My Activity <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">Overview</span>
        </h3>
        <p className="mx-auto max-w-md text-xs sm:text-sm leading-6 text-slate-400">
          Track your claims, monitor request progress, and measure your impact.
        </p>
      </div>
    </div>

    {/* Primary Statistics */}
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

      {/* Total Claimed */}
      <motion.div data-gsap-card whileHover={{ y: -4, scale: 1.01 }} className="group relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.09] via-white/[0.025] to-transparent p-5 sm:p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:border-emerald-400/35 hover:shadow-xl hover:shadow-emerald-950/20">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/[0.07] blur-2xl transition-all duration-300 group-hover:bg-emerald-400/[0.13]" />
        <div className="relative flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition-transform duration-300 group-hover:scale-110">
            <FaBoxOpen size={19} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/60">01</span>
        </div>
        <div className="relative mt-7">
          <span className="block text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-white">{totalClaims}</span>
          <span className="mt-2 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Total Claimed</span>
        </div>
        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500/80 to-emerald-300/30 transition-all duration-500 group-hover:to-emerald-300/70" />
        </div>
      </motion.div>

      {/* Pending */}
      <motion.div data-gsap-card whileHover={{ y: -4, scale: 1.01 }} className="group relative overflow-hidden rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-400/[0.08] via-white/[0.025] to-transparent p-5 sm:p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:border-amber-400/35 hover:shadow-xl hover:shadow-amber-950/20">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-400/[0.06] blur-2xl transition-all duration-300 group-hover:bg-amber-400/[0.12]" />
        <div className="relative flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300 transition-transform duration-300 group-hover:scale-110">
            <FaHourglassHalf size={19} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/60">02</span>
        </div>
        <div className="relative mt-7">
          <span className="block text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-white">{pending}</span>
          <span className="mt-2 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Pending Approval</span>
        </div>
        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-amber-500/80 to-amber-300/30 transition-all duration-500 group-hover:to-amber-300/70" />
        </div>
      </motion.div>

      {/* Approved */}
      <motion.div data-gsap-card whileHover={{ y: -4, scale: 1.01 }} className="group relative overflow-hidden rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-400/[0.08] via-white/[0.025] to-transparent p-5 sm:p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:border-blue-400/35 hover:shadow-xl hover:shadow-blue-950/20">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-400/[0.06] blur-2xl transition-all duration-300 group-hover:bg-blue-400/[0.12]" />
        <div className="relative flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-300 transition-transform duration-300 group-hover:scale-110">
            <FaCheckCircle size={19} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300/60">03</span>
        </div>
        <div className="relative mt-7">
          <span className="block text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-white">{approved}</span>
          <span className="mt-2 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Approved Requests</span>
        </div>
        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500/80 to-blue-300/30 transition-all duration-500 group-hover:to-blue-300/70" />
        </div>
      </motion.div>

      {/* Delivered */}
      <motion.div data-gsap-card whileHover={{ y: -4, scale: 1.01 }} className="group relative overflow-hidden rounded-2xl border border-pink-400/15 bg-gradient-to-br from-pink-400/[0.08] via-white/[0.025] to-transparent p-5 sm:p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:border-pink-400/35 hover:shadow-xl hover:shadow-pink-950/20">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-pink-400/[0.06] blur-2xl transition-all duration-300 group-hover:bg-pink-400/[0.12]" />
        <div className="relative flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-400/10 text-pink-300 transition-transform duration-300 group-hover:scale-110">
            <FaTruck size={19} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300/60">04</span>
        </div>
        <div className="relative mt-7">
          <span className="block text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-white">{delivered}</span>
          <span className="mt-2 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Delivered Items</span>
        </div>
        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-pink-500/80 to-pink-300/30 transition-all duration-500 group-hover:to-pink-300/70" />
        </div>
      </motion.div>

    </div>

    {/* Operational Impact Metrics */}
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-2 sm:p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">

        {/* Volunteers Assigned */}
        <div className="group relative flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3 p-4 sm:p-6 text-left sm:text-center transition-colors duration-300 hover:bg-white/[0.02] rounded-xl">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300 transition-transform duration-300 group-hover:scale-110">
            <FaBoxOpen size={17} />
          </div>
          <div className="min-w-0 flex-1 sm:flex-none">
            <span className="block text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-cyan-300">{assigned}</span>
            <span className="mt-1.5 block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Volunteers Assigned</span>
          </div>
        </div>

        {/* Pickups Confirmed */}
        <div className="group relative flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3 p-4 sm:p-6 text-left sm:text-center transition-colors duration-300 hover:bg-white/[0.02] rounded-xl">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.08] text-amber-300 transition-transform duration-300 group-hover:scale-110">
            <FaTruck size={17} />
          </div>
          <div className="min-w-0 flex-1 sm:flex-none">
            <span className="block text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-amber-300">{pickupConfirmed}</span>
            <span className="mt-1.5 block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Pickups Confirmed</span>
          </div>
        </div>

        {/* Impact Score */}
        <div className="group relative flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3 p-4 sm:p-6 text-left sm:text-center transition-colors duration-300 hover:bg-white/[0.02] rounded-xl">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/15 bg-fuchsia-400/[0.08] text-fuchsia-300 transition-transform duration-300 group-hover:scale-110">
            <FaCheckCircle size={17} />
          </div>
          <div className="min-w-0 flex-1 sm:flex-none">
            <span className="block text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-fuchsia-300">{impactScore}</span>
            <span className="mt-1.5 block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Calculated Impact Score</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>


























      {/* 🏁 Vendor Directory CTA Section */}
<section className="relative isolate overflow-hidden border-t border-white/[0.06] bg-gradient-to-b from-[#080d19] via-[#0b1020] to-[#090b12] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">

  {/* Background Grid */}
  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

  {/* Background Glows */}
  <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-500/[0.06] blur-[110px]" />
  <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/[0.05] blur-[110px]" />

  <div className="relative z-10 mx-auto max-w-6xl">

    {/* ========================================= */}
    {/* MAIN SECTION HEADING */}
    {/* ========================================= */}

    <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">

      {/* Eyebrow */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3.5 py-1.5">

        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>

        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-[11px]">
          Impact & Community
        </span>

      </div>

      {/* Main Heading */}
      <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">

        Building a{" "}
        <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
          Sustainable Future
        </span>

      </h2>

      {/* Subtitle */}
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
        Track your impact, connect with local vendors, and turn surplus
        resources into meaningful change.
      </p>

      {/* Decorative Divider */}
      <div className="mx-auto mt-5 flex items-center justify-center gap-2">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-400/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-400/50" />
      </div>

    </div>

    {/* ========================================= */}
    {/* TWO-COLUMN DASHBOARD */}
    {/* ========================================= */}

    <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-5">

      {/* ========================================= */}
      {/* LEFT: CLAIM STATUS */}
      {/* ========================================= */}

      <div className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220]/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/25 sm:p-5">

        {/* Top Accent */}
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300 transition-transform duration-300 group-hover:scale-105">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3v18h18M7 14l4-4 4 4 6-7"
                />
              </svg>

            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Claim Status
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Distribution overview
              </p>
            </div>

          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-2.5 py-1.5 text-[10px] font-medium text-emerald-300">

            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            Analytics

          </span>

        </div>

        {/* Pie Chart */}
        <div className="flex flex-1 flex-col justify-center py-3">

          {pieData && pieData.length === 0 ? (

            <div className="flex min-h-[230px] flex-col items-center justify-center text-center">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] text-slate-500">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 3.05A9 9 0 1 0 20.95 13H11V3.05Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 3.5V10h6.5A9 9 0 0 0 14 3.5Z"
                  />
                </svg>

              </div>

              <p className="text-sm font-semibold text-slate-200">
                No claim data yet
              </p>

              <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-500">
                Claim statistics will appear when activity is recorded.
              </p>

            </div>

          ) : (

            <div className="mx-auto w-full max-w-[390px]">

              <div className="h-[235px] w-full sm:h-[250px]">

                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      outerRadius="65%"
                      innerRadius="47%"
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      label={({ percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >

                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#0c1220"
                          strokeWidth={3}
                          className="transition-opacity duration-300 hover:opacity-80"
                        />
                      ))}

                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b1020",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.10)",
                        padding: "10px 13px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        fontSize: "11px",
                      }}
                      labelStyle={{
                        color: "#e2e8f0",
                        fontWeight: 700,
                      }}
                      itemStyle={{
                        color: "#cbd5e1",
                        fontSize: "11px",
                      }}
                    />

                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{
                        fontSize: "10px",
                        color: "#94a3b8",
                        paddingTop: "6px",
                        lineHeight: "19px",
                      }}
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

          )}

        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3">

          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/[0.07] text-emerald-300">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7"
                />
              </svg>

            </span>

            <span className="text-[10px] text-slate-400">
              Claim activity
            </span>
          </div>

          <span className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[10px] text-slate-500">
            Status breakdown
          </span>

        </div>

      </div>

      {/* ========================================= */}
      {/* RIGHT: SUPPLY NETWORK */}
      {/* ========================================= */}

      <div className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220]/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/25 sm:p-5">

        {/* Top Accent */}
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/[0.05] blur-[75px]" />

        {/* Header */}
        <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300 transition-transform duration-300 group-hover:scale-105">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <circle cx="12" cy="5" r="2.5" />
                <circle cx="5" cy="18" r="2.5" />
                <circle cx="19" cy="18" r="2.5" />
                <path
                  strokeLinecap="round"
                  d="m10.8 7.2-4.5 8.5m6.9-8.5 4.5 8.5M7.5 18h9"
                />
              </svg>

            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Supply Network
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Explore & connect
              </p>
            </div>

          </div>

          <span className="shrink-0 rounded-full border border-cyan-400/15 bg-cyan-400/[0.05] px-2.5 py-1.5 text-[10px] font-medium text-cyan-300">
            Community
          </span>

        </div>

        {/* Network Illustration */}
        <div className="relative mx-auto my-3 w-full max-w-[320px]">

          <svg
            viewBox="0 0 320 190"
            className="h-auto w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >

            <defs>

              <pattern
                id="compact-network-grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M20 0H0V20"
                  stroke="#94a3b8"
                  strokeOpacity=".07"
                  strokeWidth=".7"
                />
              </pattern>

              <radialGradient id="compact-network-glow">
                <stop stopColor="#34d399" stopOpacity=".22" />
                <stop offset="1" stopColor="#34d399" stopOpacity="0" />
              </radialGradient>

              <linearGradient
                id="compact-network-line"
                x1="55"
                y1="35"
                x2="265"
                y2="155"
              >
                <stop stopColor="#34d399" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>

            </defs>

            <rect
              width="320"
              height="190"
              rx="12"
              fill="url(#compact-network-grid)"
            />

            {/* Connections */}
            <g
              stroke="#334155"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            >
              <path d="M160 95 60 35" />
              <path d="M160 95 260 35" />
              <path d="M160 95 60 155" />
              <path d="M160 95 260 155" />
            </g>

            <g
              stroke="url(#compact-network-line)"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M160 95 60 35" />
              <path d="M160 95 260 35" />
              <path d="M160 95 60 155" />
              <path d="M160 95 260 155" />
            </g>

            {/* Center Node */}
            <circle
              cx="160"
              cy="95"
              r="45"
              fill="url(#compact-network-glow)"
            />

            <circle
              cx="160"
              cy="95"
              r="27"
              fill="#10342f"
              stroke="#34d399"
              strokeOpacity=".65"
            />

            <circle
              cx="160"
              cy="95"
              r="20"
              fill="#102b2a"
              stroke="#34d399"
              strokeOpacity=".4"
            />

            <g
              stroke="#6ee7b7"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="160" cy="86" r="4" />
              <circle cx="150" cy="103" r="4" />
              <circle cx="170" cy="103" r="4" />
              <path d="m158 90-6 9m10-9 6 9m-16 5h16" />
            </g>

            {/* Vendor Nodes */}
            <g>

              <circle
                cx="60"
                cy="35"
                r="14"
                fill="#102735"
                stroke="#22d3ee"
                strokeWidth="1.3"
              />

              <path
                d="M53 40V30h14v10M51 40h18M57 34h2m4 0h2"
                stroke="#67e8f9"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="260"
                cy="35"
                r="14"
                fill="#103328"
                stroke="#34d399"
                strokeWidth="1.3"
              />

              <path
                d="m253 32 7-3 7 3-7 4-7-4Zm0 4 7 4 7-4"
                stroke="#6ee7b7"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="60"
                cy="155"
                r="14"
                fill="#103328"
                stroke="#34d399"
                strokeWidth="1.3"
              />

              <path
                d="M54 149h12v12H54zM57 153h2m3 0h1m-6 4h2m3 0h1"
                stroke="#6ee7b7"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              <circle
                cx="260"
                cy="155"
                r="14"
                fill="#102735"
                stroke="#22d3ee"
                strokeWidth="1.3"
              />

              <circle
                cx="256"
                cy="152"
                r="2.5"
                stroke="#67e8f9"
                strokeWidth="1.2"
              />

              <circle
                cx="264"
                cy="152"
                r="2.5"
                stroke="#67e8f9"
                strokeWidth="1.2"
              />

              <path
                d="M252 160c0-4 8-4 8 0m0 0c0-4 8-4 8 0"
                stroke="#67e8f9"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

            </g>

            {/* Connection Points */}
            <g fill="#a7f3d0">
              <circle cx="110" cy="65" r="2" />
              <circle cx="210" cy="65" r="2" />
              <circle cx="110" cy="125" r="2" />
              <circle cx="210" cy="125" r="2" />
            </g>

          </svg>

        </div>

        {/* Feature Cards */}
        <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">

          {/* Vendors */}
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5 transition-all duration-300 hover:border-emerald-400/25 hover:bg-emerald-400/[0.035]">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-200">
                Vendors
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Discover suppliers
              </p>
            </div>

          </div>

          {/* Resources */}
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5 transition-all duration-300 hover:border-cyan-400/25 hover:bg-cyan-400/[0.035]">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/[0.08] text-cyan-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v18m-9-9h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-200">
                Resources
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Share supplies
              </p>
            </div>

          </div>

          {/* Sustainability */}
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5 transition-all duration-300 hover:border-teal-400/25 hover:bg-teal-400/[0.035]">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-400/[0.08] text-teal-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-7 10-16Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 20c3-5 7-8 12-11"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-200">
                Sustainability
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Reduce waste
              </p>
            </div>

          </div>

        </div>

        {/* CTA */}
        <div className="relative mt-4 border-t border-white/[0.06] pt-4">

          <button
            onClick={handleRedirect}
            type="button"
            className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-4 py-3 text-xs font-bold text-[#07121a] shadow-[0_5px_20px_rgba(16,185,129,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,185,129,0.22)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1220]"
          >

            Explore All Vendors

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6 6 6-6 6"
              />
            </svg>

          </button>

          <p className="mt-2 text-center text-[10px] text-slate-500">
            Smarter sourcing starts with local connections.
          </p>

        </div>

      </div>

    </div>

  </div>

</section>














      {/* 📍 Nearest Vendors Call-to-Action */}

<section className="relative isolate overflow-hidden border-t border-white/[0.06] bg-gradient-to-b from-[#080d17] via-[#0c1220] to-[#090b13] px-4 py-16 sm:px-8 sm:py-20 lg:px-8 lg:py-24">

  {/* Background Grid */}
  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]" />

  {/* Ambient Lighting */}
  <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/[0.09] blur-[120px]" />
  <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/[0.08] blur-[120px]" />

  <div className="relative z-10 mx-auto max-w-6xl">

    {/* Main Panel */}
    <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0b1220]/80 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-colors duration-500 hover:border-emerald-400/20 sm:rounded-[36px]">

      {/* Top Accent */}
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/[0.07] blur-[100px] transition-all duration-700 group-hover:bg-emerald-400/[0.12]" />

      <div className="grid items-center gap-10 p-5 sm:p-9 md:p-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:p-14">

        {/* LEFT: Content */}
        <div className="relative z-10">

          {/* Eyebrow */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300 sm:text-[11px]">
              Smart Local Discovery
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 text-emerald-300/70">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
            </svg>
          </div>

          {/* Heading */}
          <h3 className="max-w-xl text-4xl font-black leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[58px]">
            Good resources.
            <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text pb-1 text-transparent">
              Right around you.
            </span>
          </h3>

          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Why source from miles away when the right supplier could be nearby? Discover local vendors, find available resources, and build a more sustainable supply chain.
          </p>

          {/* Compact Feature List */}
          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[19px] w-[19px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">Location-based discovery</p>
                <p className="mt-0.5 text-xs text-slate-500">Explore suppliers in your area</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[19px] w-[19px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9-4 9 4-9 4-9-4Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3 12 9 4 9-4M3 17l9 4 9-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">Resources within reach</p>
                <p className="mt-0.5 text-xs text-slate-500">Find locally available supplies</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/15 bg-teal-400/[0.07] text-teal-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[19px] w-[19px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
                  <circle cx="7.5" cy="19" r="2" />
                  <circle cx="17.5" cy="19" r="2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">A lighter footprint</p>
                <p className="mt-0.5 text-xs text-slate-500">Reduce unnecessary transportation</p>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-9">
            <Link
              to="/near"
              className="group/btn relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-6 py-4 text-sm font-extrabold text-[#07121a] shadow-[0_8px_32px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(16,185,129,0.25)] active:translate-y-0 active:scale-[0.98] sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="relative h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>

              <span className="relative">Explore Nearby Vendors</span>

              <span className="relative ml-1 flex h-7 w-7 items-center justify-center rounded-lg bg-black/[0.08] transition-transform duration-300 group-hover/btn:translate-x-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </span>
            </Link>

            <p className="mt-4 text-xs text-slate-500">
              <span className="mr-1.5 text-emerald-400">✳</span>
              Source locally. Travel less. Make an impact.
            </p>
          </div>
        </div>

        {/* RIGHT: Visual Discovery Panel */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">

          {/* Visual Frame */}
          <div className="relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-gradient-to-br from-[#101e2c] via-[#0c1725] to-[#0b1220] p-4 shadow-2xl shadow-black/20 sm:p-5">

            {/* Inner Ambient Light */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/[0.09] blur-[80px]" />

            {/* Visual Header */}
            <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Discovery Network
                </p>
                <p className="mt-1 text-sm font-bold text-white">Your local ecosystem</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-300">Connected</span>
              </div>
            </div>

            {/* Abstract Map */}
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1420]">

              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Map Routes */}
              <svg viewBox="0 0 400 350" className="relative h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">

                <defs>
                  <linearGradient id="vendor-route" x1="80" y1="290" x2="320" y2="70" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34d399" />
                    <stop offset="1" stopColor="#22d3ee" />
                  </linearGradient>
                  <radialGradient id="vendor-glow">
                    <stop stopColor="#34d399" stopOpacity=".22" />
                    <stop offset="1" stopColor="#34d399" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Neighborhood Blocks */}
                <path d="M-20 75 L110 20 L150 60 L80 125 L-10 140Z" fill="#142535" stroke="#294052" strokeWidth="1" />
                <path d="M170 15 L275 5 L305 65 L235 105 L165 70Z" fill="#142535" stroke="#294052" strokeWidth="1" />
                <path d="M280 125 L420 80 L420 160 L330 195 L270 175Z" fill="#142535" stroke="#294052" strokeWidth="1" />
                <path d="M-20 205 L75 160 L135 205 L105 280 L-10 300Z" fill="#142535" stroke="#294052" strokeWidth="1" />
                <path d="M180 220 L255 180 L320 220 L285 300 L195 325 L150 270Z" fill="#142535" stroke="#294052" strokeWidth="1" />
                <path d="M330 235 L420 200 L420 350 L300 350 L320 290Z" fill="#142535" stroke="#294052" strokeWidth="1" />

                {/* Roads */}
                <path d="M-10 175 C70 150 110 170 155 140 S250 125 410 175" stroke="#314454" strokeWidth="8" strokeLinecap="round" />
                <path d="M125 -10 C145 65 180 100 160 155 S185 240 220 360" stroke="#314454" strokeWidth="7" strokeLinecap="round" />
                <path d="M-10 315 C70 275 130 305 205 270 S320 250 410 280" stroke="#314454" strokeWidth="6" strokeLinecap="round" />

                <path d="M-10 175 C70 150 110 170 155 140 S250 125 410 175" stroke="#526575" strokeWidth="1.2" strokeDasharray="4 7" />
                <path d="M125 -10 C145 65 180 100 160 155 S185 240 220 360" stroke="#526575" strokeWidth="1.2" strokeDasharray="4 7" />

                {/* Route Network */}
                <path d="M90 265 C100 230 145 235 160 195 S225 180 250 140 S295 105 315 65" stroke="url(#vendor-route)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 7" />

                {/* Origin Glow */}
                <circle cx="90" cy="265" r="48" fill="url(#vendor-glow)" />
                <circle cx="90" cy="265" r="19" fill="#34d399" fillOpacity=".10" stroke="#34d399" strokeOpacity=".25" />
                <circle cx="90" cy="265" r="9" fill="#34d399" fillOpacity=".15" stroke="#6ee7b7" strokeWidth="1.5" />
                <circle cx="90" cy="265" r="3" fill="#a7f3d0" />

                {/* Vendor Pin 1 */}
                <circle cx="160" cy="195" r="17" fill="#22d3ee" fillOpacity=".08" />
                <circle cx="160" cy="195" r="11" fill="#102b38" stroke="#22d3ee" strokeWidth="1.5" />
                <path d="M160 190 C157.5 190 155.5 192 155.5 194.5 C155.5 198 160 201 160 201 S164.5 198 164.5 194.5 C164.5 192 162.5 190 160 190Z" stroke="#67e8f9" strokeWidth="1.2" />
                <circle cx="160" cy="194.5" r="1.4" fill="#67e8f9" />

                {/* Vendor Pin 2 */}
                <circle cx="250" cy="140" r="18" fill="#34d399" fillOpacity=".08" />
                <circle cx="250" cy="140" r="11" fill="#103328" stroke="#34d399" strokeWidth="1.5" />
                <path d="M244 137 L250 134 L256 137 L250 140 L244 137Z M244 140 L250 143 L256 140 M244 143 L250 146 L256 143" stroke="#6ee7b7" strokeWidth="1.1" strokeLinejoin="round" />

                {/* Vendor Pin 3 */}
                <circle cx="315" cy="65" r="18" fill="#22d3ee" fillOpacity=".08" />
                <circle cx="315" cy="65" r="11" fill="#102b38" stroke="#22d3ee" strokeWidth="1.5" />
                <path d="M309 61 H315 V70 H309 Z M315 64 H319 L321 67 V70 H315 Z" stroke="#67e8f9" strokeWidth="1.1" strokeLinejoin="round" />

                {/* Map Labels */}
                <text x="22" y="48" fill="#647b8e" fontSize="10" letterSpacing="1.5">NORTH</text>
                <text x="278" y="220" fill="#647b8e" fontSize="9" letterSpacing="1">LOCAL AREA</text>
              </svg>

              {/* Floating Origin Card */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-[#0b1723]/95 px-3 py-2.5 shadow-xl backdrop-blur-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" />
                    <path strokeLinecap="round" d="M12 1v3m0 16v3M1 12h3m16 0h3" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white">Your starting point</p>
                  <p className="mt-0.5 text-[9px] text-slate-500">Find resources around you</p>
                </div>
              </div>

              {/* Map Legend */}
              <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0b1723]/90 px-2.5 py-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                <span className="text-[9px] font-medium text-slate-300">Supplier network</span>
              </div>
            </div>

            {/* Bottom Metrics */}
            <div className="relative mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition-colors duration-300 hover:border-emerald-400/20">
                <div className="flex items-center gap-2 text-emerald-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-400">Closer sourcing</span>
                </div>
                <p className="mt-2 text-sm font-extrabold text-white">Local first</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">Discover nearby options</p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition-colors duration-300 hover:border-cyan-400/20">
                <div className="flex items-center gap-2 text-cyan-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                    <circle cx="12" cy="12" r="5" />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-400">Better logistics</span>
                </div>
                <p className="mt-2 text-sm font-extrabold text-white">Less travel</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">Support sustainable sourcing</p>
              </div>

            </div>

            {/* Footer Tag */}
            <div className="relative mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0 text-emerald-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-7 10-16Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c3-5 7-8 12-11" />
              </svg>
              <p className="text-[10px] font-medium text-slate-400 sm:text-[11px]">
                Every local connection can make a difference.
              </p>
            </div>

          </div>

          {/* Decorative Floating Accent */}
          <div className="pointer-events-none absolute -right-2 -top-3 h-14 w-14 rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.035] blur-[1px] sm:-right-4 sm:-top-4" />
          <div className="pointer-events-none absolute -bottom-3 -left-3 h-16 w-16 rounded-full border border-cyan-300/10 bg-cyan-300/[0.025]" />

        </div>
      </div>
    </div>

    {/* Bottom Supporting Line */}
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-3 text-center">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Discover
      </span>
      <span className="h-1 w-1 rounded-full bg-emerald-400/70" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Connect
      </span>
      <span className="h-1 w-1 rounded-full bg-emerald-400/70" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Source Sustainably
      </span>
    </div>

  </div>
</section>














<section className="relative isolate overflow-hidden border-t border-white/[0.06] bg-gradient-to-b from-[#080d18] via-[#0b1120] to-[#090b13] px-4 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28">

  {/* Background Grid */}
  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]" />

  {/* Ambient Glows */}
  <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-cyan-500/[0.09] blur-[120px]" />
  <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-500/[0.09] blur-[120px]" />
  <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

  <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">

    {/* Content Column */}
    <div className="space-y-7 text-center lg:text-left">

      {/* Badge */}
      <div className="flex justify-center lg:justify-start">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-300 sm:text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          Logistics Dispatch Hub
        </span>
      </div>

      {/* Heading */}
      <div className="space-y-5">
        <h2 className="text-3xl font-black leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
          Book a Volunteer
          <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            for Transportation
          </span>
        </h2>

        <p className="mx-auto max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:mx-0">
          Need help transporting your claimed supplies? Connect with community volunteers to coordinate pickups and deliveries, simplify logistics, and get essential resources where they are needed most.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-3 lg:mx-0">

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.035] sm:flex-col sm:items-start sm:gap-3 sm:py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Verified Support</p>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">Community volunteers</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3 transition-all duration-300 hover:border-indigo-400/20 hover:bg-indigo-400/[0.035] sm:flex-col sm:items-start sm:gap-3 sm:py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-400/15 bg-indigo-400/[0.08] text-indigo-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
              <circle cx="7.5" cy="19" r="2" />
              <circle cx="17.5" cy="19" r="2" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Easy Coordination</p>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">Organized pickups</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-400/[0.035] sm:flex-col sm:items-start sm:gap-3 sm:py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-400/[0.08] text-violet-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Flexible Scheduling</p>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">Plan your collection</p>
          </div>
        </div>

      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 pt-1 lg:items-start">
        <Link
          to="/ngo/bookvolunteer"
          className="group/btn relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-cyan-300/30 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 px-7 py-4 text-sm font-extrabold text-slate-950 shadow-[0_8px_30px_rgba(34,211,238,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_38px_rgba(34,211,238,0.23)] active:translate-y-0 active:scale-[0.98] sm:w-auto sm:min-w-[270px]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />

          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="relative h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
            <circle cx="12" cy="12" r="9" />
          </svg>

          <span className="relative">Schedule a Volunteer</span>

          <span className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-black/[0.08] transition-transform duration-300 group-hover/btn:translate-x-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </span>
        </Link>

        <p className="text-[10px] font-medium tracking-wide text-slate-500 sm:text-[11px]">
          Connecting resources, volunteers, and communities.
        </p>
      </div>
    </div>

    {/* Visual Showcase */}
    <div className="group relative mx-auto w-full max-w-xl lg:max-w-none">

      {/* Outer Aura */}
      <div className="pointer-events-none absolute -inset-5 rounded-[36px] bg-gradient-to-br from-cyan-500/[0.12] via-blue-500/[0.05] to-indigo-500/[0.12] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Image Frame */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.10] bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-2 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-500 group-hover:border-cyan-400/20 sm:p-3">

        {/* Image Top Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-3 py-3 sm:px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
                <circle cx="7.5" cy="19" r="2" />
                <circle cx="17.5" cy="19" r="2" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-bold text-slate-200">Volunteer Logistics</p>
              <p className="mt-0.5 text-[10px] text-slate-500">Collection & delivery workflow</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Dispatch
          </span>
        </div>

        {/* Existing Graphic */}
        <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#080d18] sm:min-h-[340px]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/[0.04] via-transparent to-indigo-400/[0.07]" />

          <img
            src="https://i.pinimg.com/originals/c4/9a/20/c49a207e0f89c9290d98fd43a87a8cb0.gif"
            alt="Logistics asset distribution flow motion illustration graphic"
            className="relative z-10 h-auto max-h-[420px] w-full object-contain opacity-90 transition-all duration-700 group-hover:scale-[1.025] group-hover:opacity-100"
            loading="lazy"
          />
        </div>

        {/* Image Footer */}
        <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-300">From pickup to delivery</p>
            <p className="mt-1 text-[10px] text-slate-500">Coordinating community-powered transport</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
            </svg>
          </div>
        </div>

      </div>

      {/* Decorative Corner Accents */}
      <div className="pointer-events-none absolute -bottom-2 -left-2 h-12 w-12 rounded-bl-2xl border-b border-l border-cyan-400/30" />
      <div className="pointer-events-none absolute -right-2 -top-2 h-12 w-12 rounded-tr-2xl border-r border-t border-indigo-400/30" />

    </div>
  </div>
</section>






    </div>
  );
};

export default NgoDashboard;
