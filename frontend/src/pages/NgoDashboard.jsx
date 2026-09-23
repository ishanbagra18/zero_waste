// added new navbar and a charchter called captain zerowaste


import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  User,
  ClipboardCheck,
  LogOut,
} from 'lucide-react';


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
  const navigate = useNavigate();
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
  const TOTAL_FRAMES = 165;
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const framesRef = useRef([]);
  const rafIdRef = useRef(null);
  const lastDrawnFrameRef = useRef(-1);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Build the ordered list of frame file numbers (1-166, skipping 163)
  const frameNumbers = useRef(
    Array.from({ length: 166 }, (_, i) => i + 1).filter(n => n !== 163)
  );

  // Preload all frames into Image objects
  useEffect(() => {
    let cancelled = false;
    const images = [];
    let loaded = 0;

    // Use Vite's import.meta.glob to get hashed URLs for each frame
    const frameModules = import.meta.glob(
      '../assets/plant-frames/frame_*.jpg',
      { eager: true, import: 'default' }
    );

    // Build a lookup: frameNumber → resolved URL
    const urlByNumber = {};
    for (const [path, url] of Object.entries(frameModules)) {
      const match = path.match(/frame_(\d+)\.jpg$/);
      if (match) urlByNumber[parseInt(match[1], 10)] = url;
    }

    frameNumbers.current.forEach((num, idx) => {
      const img = new Image();
      img.src = urlByNumber[num] || '';
      img.onload = () => {
        if (cancelled) return;
        try {
          const off = document.createElement('canvas');
          off.width = img.naturalWidth;
          off.height = img.naturalHeight;
          const octx = off.getContext('2d');
          octx.drawImage(img, 0, 0);
          const idata = octx.getImageData(0, 0, off.width, off.height);
          const data = idata.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const maxRGB = Math.max(r, g, b);
            const minRGB = Math.min(r, g, b);
            const sat = maxRGB - minRGB;
            const bright = (r + g + b) / 3;

            // Target light neutral grey / white background pixels
            if (bright > 120 && sat < 45) {
              // Smooth falloff: bright 120 (opaque) -> bright 200+ (transparent)
              let alphaScale = (200 - bright) / 80;
              if (alphaScale < 0) alphaScale = 0;
              if (alphaScale > 1) alphaScale = 1;

              // Extra fade for very low saturation near white
              if (sat < 20 && bright > 150) {
                const satFade = sat / 20;
                alphaScale = Math.min(alphaScale, satFade);
              }

              data[i + 3] = Math.round(data[i + 3] * alphaScale);
            }
          }
          octx.putImageData(idata, 0, 0);
          images[idx] = off;
        } catch (e) {
          images[idx] = img;
        }

        loaded++;
        if (loaded >= TOTAL_FRAMES) setFramesLoaded(true);
      };
      img.onerror = () => {
        if (cancelled) return;
        loaded++;
        if (loaded >= TOTAL_FRAMES) setFramesLoaded(true);
      };
      images[idx] = img;
    });

    framesRef.current = images;
    return () => { cancelled = true; };
  }, []);

  // Draw a specific frame index onto the canvas
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img) return;
    if (lastDrawnFrameRef.current === index) return; // skip redundant draws

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    // Draw plant smaller and positioned further to the right
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    const imgRatio = imgWidth / imgHeight;
    const plantScale = 0.55; // 55% of viewport height
    const drawH = h * plantScale;
    const drawW = drawH * imgRatio;
    // Position: aligned right with 2% padding from right edge
    const drawX = w - drawW - (w * 0.02);
    const drawY = (h - drawH) / 2;

    // 1. Fill canvas with page background color
    const bgColor = '#0f0f1c';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

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
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
        setScrollProgress(progress);

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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1c] via-[#111827] to-[#1f2937] text-white">
      <Toaster />


      {/* Hero Section — Scroll-Driven Plant Growth Frame Animation */}
      <section
        ref={sectionRef}
        className="relative border-b border-white/[0.04]"
        style={{ height: '300vh' }}
      >
        {/* Sticky inner container — pinned for entire scroll-through */}
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: '100vh' }}
        >
          {/* Preloading skeleton */}
          {!framesLoaded && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0f0f1c]">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-emerald-500/30" />
              <p className="mt-4 text-sm text-emerald-400 font-medium tracking-wide animate-pulse">Loading plant animation...</p>
            </div>
          )}

          {/* Canvas — full viewport, plant drawn smaller on the right */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: framesLoaded ? 'block' : 'none' }}
          />

          {/* Gradient overlays for text legibility */}
          {framesLoaded && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent/40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent pointer-events-none" />
            </>
          )}

          {/* Ambient Left Environmental Light Flare */}
          <div className="absolute left-0 top-0 w-[36rem] h-[36rem] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8000ms]" />

          {/* Text content — always visible from the start */}
          <div
            className="relative w-full h-full flex items-center z-10"
            style={{
              opacity: 1,
            }}
          >
            <div className="w-full container mx-auto px-6 sm:px-12 lg:px-8 max-w-7xl py-16">
              <div className="max-w-xl sm:max-w-2xl text-left space-y-6">

                {/* Context Action Kicker */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <p className="text-emerald-400 uppercase tracking-widest text-xs font-black select-none">
                    Ecosystem Hub Portal
                  </p>
                </div>

                {/* Styled Headings Structural Block */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="space-y-4 border-l-2 border-emerald-500/40 pl-4 sm:pl-6"
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] select-none font-display">
                    Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">Changemaker!</span>
                  </h1>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight select-none font-display">
                    Small Things Make a Big Change
                  </h2>

                  <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl select-text pt-1 font-sans">
                    Your efforts today can shape a better tomorrow. Let's reduce waste, uplift communities, and protect our planet—one step at a time.
                  </p>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate('/vendor/allitems')}
                      className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/40 transition text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2"
                    >
                      <span>Explore Surplus Items</span>
                      <span className="text-base">📦</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate('/readmore')}
                      className="border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 font-bold px-6 py-3.5 rounded-xl transition text-xs sm:text-sm backdrop-blur-md"
                    >
                      Read More
                    </motion.button>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>

          {/* Scroll indicator at bottom */}
          {/* added the plant animation  */}
          {framesLoaded && scrollProgress < 0.1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-slate-400 font-medium tracking-wide">Scroll to grow</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          )}
        </div>
      </section>






      {/* 🌍 Why NGOs Matter Value Proposition Grid */}
      <section className="relative py-20 lg:py-28 px-4 sm:px-12 lg:px-8 bg-gradient-to-b from-slate-950 via-[#0a0c14] to-zinc-950 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Section Typography Headers */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Platform Mission Values
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 select-none">
              Why NGOs Matter
            </h3>
          </div>

          {/* Core Feature Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            {/* Block: Sustainability */}
            <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-emerald-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

              <span className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl text-emerald-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
                <FaLeaf size={22} />
              </span>

              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-200">
                  Sustainability
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  Promoting the regular distribution of surplus goods systematically diverts clean, usable excess assets straight away from local landfill ecosystems.
                </p>
              </div>
            </article>

            {/* Block: Community Upliftment */}
            <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-indigo-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

              <span className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-2xl text-indigo-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
                <FaUsers size={22} />
              </span>

              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
                  Community Upliftment
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  Directly collaborating with verified network vendors allows agile non-profits to dispatch high-priority essentials straight to families in need.
                </p>
              </div>
            </article>

            {/* Block: Awareness */}
            <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-pink-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute inset-0 bg-pink-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

              <span className="bg-pink-500/10 border border-pink-500/20 p-3.5 rounded-2xl text-pink-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
                <FaLightbulb size={22} />
              </span>

              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-pink-400 transition-colors duration-200">
                  Platform Awareness
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  Educating teams on consumer habits establishes data accountability, lowering regional overproduction behaviors and waste pipelines.
                </p>
              </div>
            </article>

          </div>
        </div>
      </section>







      {/* 📊 High-Fidelity Analytical Statistics Layout Card Section */}
      <section className="py-20 px-4 sm:px-12 lg:px-8 bg-gradient-to-b from-[#0f111a] via-slate-950 to-zinc-950">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Section Typography Headers */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Live Operational Stream
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white select-none">
              My Activity Overview
            </h3>
          </div>

          {/* Primary Statistics Row Matrix */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {/* Stat: Total Claimed */}
            <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] border-l-4 border-l-emerald-500 p-5 rounded-2xl text-left shadow-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex justify-between items-start">
                <span className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                  <FaBoxOpen size={16} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight select-text">{totalClaims}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Total Claimed</span>
              </div>
            </div>

            {/* Stat: Pending */}
            <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] border-l-4 border-l-amber-500 p-5 rounded-2xl text-left shadow-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex justify-between items-start">
                <span className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-400">
                  <FaHourglassHalf size={16} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight select-text">{pending}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Pending Approval</span>
              </div>
            </div>

            {/* Stat: Approved */}
            <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] border-l-4 border-l-blue-500 p-5 rounded-2xl text-left shadow-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex justify-between items-start">
                <span className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400">
                  <FaCheckCircle size={16} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight select-text">{approved}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Approved Requests</span>
              </div>
            </div>

            {/* Stat: Delivered */}
            <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] border-l-4 border-l-pink-500 p-5 rounded-2xl text-left shadow-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex justify-between items-start">
                <span className="bg-pink-500/10 border border-pink-500/20 p-2.5 rounded-xl text-pink-400">
                  <FaTruck size={16} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight select-text">{delivered}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Delivered Items</span>
              </div>
            </div>

          </div>

          {/* Extended Operational Pipeline Submetrics Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl shadow-inner">
            <div className="text-center p-3 border-b sm:border-b-0 sm:border-r border-white/[0.04] last:border-0">
              <span className="text-xl font-black text-cyan-400 block select-text">{assigned}</span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-0.5">Volunteers Assigned</span>
            </div>
            <div className="text-center p-3 border-b sm:border-b-0 sm:border-r border-white/[0.04] last:border-0">
              <span className="text-xl font-black text-amber-400 block select-text">{pickupConfirmed}</span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-0.5">Pickups Confirmed</span>
            </div>
            <div className="text-center p-3 last:border-0">
              <span className="text-xl font-black text-fuchsia-400 block select-text">{impactScore}</span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-0.5">Calculated Impact Score</span>
            </div>
          </div>

        </div>
      </section>


















      {/* 🏁 Vendor Directory CTA Section */}
      <section className="relative py-20 lg:py-24 px-6 sm:px-12 lg:px-8 bg-gradient-to-b from-slate-950 via-[#0a0c14] to-zinc-950 overflow-hidden border-t border-white/[0.04]">
        {/* Modern Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Ambient Indigo Base Glow Ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 group">
          {/* Micro Badge Header */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Supply Network
            </span>
          </div>

          {/* Typography Content */}
          <div className="space-y-3">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 select-none">
              Check All The Vendors
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed select-text">
              Discover active merchants contributing to systemic regional sustainability. Explore live asset inventories and participate in reducing supply waste loops instantly.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRedirect}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.98] text-slate-950 font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition-all duration-200 group/btn"
              type="button">
              <span>View All Vendors</span>
              <span className="text-sm font-black group-hover/btn:translate-x-1 transition-transform duration-150">&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* 🥧 Claim Status Pie Chart Section */}
      <section className="relative py-20 px-4 sm:px-12 bg-gradient-to-b from-zinc-950 to-slate-950 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Header Elements */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Live Metric Stream
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white select-none">
              Claim Status Distribution
            </h2>
          </div>

          {/* Recharts Wrapper Card */}
          <div className="bg-white/[0.01] border border-white/[0.06] p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl min-h-[360px] flex items-center justify-center">
            {pieData && pieData.length === 0 ? (
              <div className="text-center text-slate-500 text-xs italic py-12 space-y-2">
                <span>📊</span>
                <p>No interactive claim metrics logged yet to draw analytics visuals.</p>
              </div>
            ) : (
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="42%"
                      outerRadius={100}
                      innerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#020617" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderRadius: "12px",
                        borderColor: "rgba(255,255,255,0.08)",
                        fontSize: "12px"
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ fontSize: "11px", color: "#94a3b8", paddingTop: "16px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      </section>













      {/* 📍 Nearest Vendors Call-to-Action */}
      <section className="relative py-16 lg:py-24 px-6 sm:px-12 lg:px-8 bg-gradient-to-br from-slate-950 via-[#0f111a] to-zinc-950 overflow-hidden border-t border-white/[0.05]">
        {/* Ambient Geometric Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10 pointer-events-none" />

        {/* Radial Emerald Base Glow Ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 group">

          {/* Micro Badge Header */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Proximity Engine
            </span>
          </div>

          {/* Section Typography Headers */}
          <div className="space-y-3">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Find Nearest Vendors
            </h3>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Execute a real-time city-wide coordinate scan to locate active supplier nodes closest to you. Cut down transit footprints instantly by securing localized stock.
            </p>
          </div>

          {/* Action Routing Trigger */}
          <div className="pt-2">
            <Link
              to="/near"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/40 transition-all duration-150"
            >
              <span>Discover Nearby Vendors</span>
              <span className="text-xs tracking-normal opacity-70 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Link>
          </div>

        </div>
      </section>




      <section className="relative py-20 lg:py-28 px-6 sm:px-12 lg:px-24 bg-gradient-to-br from-slate-950 via-[#0f111a] to-zinc-950 text-white overflow-hidden border-t border-white/[0.05]">
        {/* Ambient Background Grid/Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

        {/* Left Side Glow */}
        <div className="absolute -left-16 top-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">

          {/* Text Context Column */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <div className="space-y-3">
              <span className="inline-flex bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Logistics Dispatch Hub
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Book a Volunteer <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  for Transportation
                </span>
              </h2>
            </div>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
              Lacking independent heavy transport mechanisms to complete your claims pick-ups? Tap into our verified community volunteer pool to schedule secure, end-to-end stock collection transits.
            </p>

            <div className="pt-2">
              <Link
                to="/ngo/bookvolunteer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950/40 transition-all duration-150"
              >
                <span>Schedule Freight Volunteer</span>
                <span className="text-xs transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Graphic Asset Showcase Column */}
          <div className="w-full md:w-1/2 flex justify-center relative group">
            {/* Decorative Outer Aura Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition duration-500" />

            <div className="relative rounded-3xl bg-slate-950 border border-white/[0.06] p-4 sm:p-6 shadow-2xl w-full max-w-md md:max-w-lg transition duration-300 group-hover:border-white/10">
              <img
                src="https://i.pinimg.com/originals/c4/9a/20/c49a207e0f89c9290d98fd43a87a8cb0.gif"
                alt="Logistics asset distribution flow motion illustration graphic"
                className="w-full h-auto rounded-2xl mix-blend-screen opacity-90 object-contain"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>





    </div>
  );
};

export default NgoDashboard;
