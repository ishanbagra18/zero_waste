import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  PackageOpen,
  ArrowLeft,
  Compass,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Leaf,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { playClickSound } from "../utils/audio";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle(
    "404 - Page Not Found",
    "The requested page could not be found on the ZeroWaste portal."
  );
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated) return "/";
    const currentRole = (role || "").toLowerCase();
    if (currentRole === "vendor") return "/vendor/dashboard";
    if (currentRole === "ngo") return "/ngo/dashboard";
    if (currentRole === "volunteer") return "/volunteer/dashboard";
    return "/";
  };

  const handleOpenChatbot = () => {
    playClickSound();
    window.dispatchEvent(new CustomEvent("open-chatbot"));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-16 selection:bg-emerald-500 selection:text-white">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10 space-y-8">
        {/* Floating 404 Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-emerald-500/10"
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Page Not Found • Error 404</span>
        </motion.div>

        {/* Large 404 Visual Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <h1 className="text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 font-display select-none">
            4<span className="text-emerald-400">0</span>4
          </h1>
          <div className="absolute -top-3 right-1/4 sm:right-1/3 animate-bounce">
            <Sparkles className="w-6 h-6 text-emerald-400 opacity-80" />
          </div>
        </motion.div>

        {/* Informative Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Lost in the Zero-Waste Movement?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            The page, surplus batch, or route you are searching for might have been claimed, redistributed, or moved to a different coordinate.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            to={getDashboardPath()}
            onClick={() => playClickSound()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-500/40"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>

          <Link
            to="/vendor/allitems"
            onClick={() => playClickSound()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/40 hover:bg-slate-800/80 text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
          >
            <PackageOpen className="w-4 h-4 text-emerald-400" />
            <span>Browse Surplus Items</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              navigate(-1);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-transparent border border-white/10 hover:border-white/20 text-slate-400 hover:text-white font-medium text-sm transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Quick Assist Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto"
        >
          <Link
            to="/readmore"
            onClick={() => playClickSound()}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                Our Mission & Insights
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Learn how surplus redistribution saves lives & carbon.
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleOpenChatbot}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all group flex items-start gap-3 text-left w-full"
          >
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 shrink-0 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                Ask ZeroWaste AI
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Open our assistant for quick answers and guidance.
              </p>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

