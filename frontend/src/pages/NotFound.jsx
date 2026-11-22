import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Compass, Home, Package, ArrowLeft, Sparkles, HelpCircle } from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  useDocumentTitle("404 - Page Not Found", "The requested page could not be found on the ZeroWaste portal.");
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const getHomePath = () => {
    if (!isAuthenticated) return "/";
    const r = (role || "").toLowerCase();
    if (r === "vendor") return "/vendor/dashboard";
    if (r === "volunteer") return "/volunteer/dashboard";
    return "/ngo/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl text-center space-y-8 p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl relative z-10"
      >
        {/* Clickable Brand Logo Header */}
        <div className="flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-300/30 group-hover:rotate-12 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black tracking-tight text-white font-display flex items-center gap-1">
                Zero<span className="text-emerald-400">Waste</span>
                <Sparkles className="w-4 h-4 text-emerald-400 opacity-80" />
              </span>
              <span className="text-[10px] font-semibold text-emerald-400/80 tracking-widest uppercase -mt-1">
                Sustainability Portal
              </span>
            </div>
          </Link>
        </div>

        {/* 404 Visual Icon */}
        <div className="relative inline-block my-2">
          <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 font-display select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="p-4 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-xl shadow-emerald-500/20"
            >
              <Compass className="w-10 h-10 text-emerald-400" />
            </motion.div>
          </div>
        </div>

        {/* Informative Error Copy */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Looks like this path diverged from our zero-waste mission. The page you are looking for may have been moved, expired, or does not exist.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            to={getHomePath()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-sm font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {isAuthenticated ? "Go to Dashboard" : "Go to Home"}
          </Link>

          <Link
            to="/vendor/allitems"
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4 text-emerald-400" />
            Browse Items
          </Link>
        </div>

        {/* Support Help Link */}
        <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Need assistance? Contact our team at </span>
          <a href="mailto:support@zerowaste.org" className="text-emerald-400 hover:underline font-medium">
            support@zerowaste.org
          </a>
        </div>
      </motion.div>
    </div>
  );
}

