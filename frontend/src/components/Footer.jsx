import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Heart, Sparkles, Send, Globe, Shield, ArrowUpRight } from "lucide-react";
import EcoMascotQuote from "./EcoMascotQuote";

const Footer = () => {
  const [pledgeEmail, setPledgeEmail] = useState("");
  const [pledged, setPledged] = useState(false);

  const handlePledgeSubmit = (e) => {
    e.preventDefault();
    if (!pledgeEmail) return;
    setPledged(true);
    setTimeout(() => {
      setPledgeEmail("");
      setPledged(false);
    }, 4000);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-12 pb-8 px-6 md:px-16 lg:px-24 relative overflow-hidden font-sans">
      {/* Background ambient light blobs */}
      <div className="absolute left-1/4 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Mascot quote banner */}
        <EcoMascotQuote />

        {/* Multi-column Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pt-4 border-t border-slate-800/60">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-300/30">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white font-display flex items-center gap-1">
                  Zero<span className="text-emerald-400">Waste</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
                </span>
                <span className="text-[10px] font-semibold text-emerald-400/80 tracking-widest uppercase -mt-1">
                  Sustainability Portal
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering local communities, vendors, NGOs, and volunteers to eliminate surplus food waste and build a zero-waste future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/vendor/allitems" className="hover:text-emerald-400 transition flex items-center gap-1 group">
                  <span>Browse Surplus Items</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link to="/allvendors" className="hover:text-emerald-400 transition flex items-center gap-1 group">
                  <span>Partner Vendors</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link to="/near" className="hover:text-emerald-400 transition flex items-center gap-1 group">
                  <span>Nearby Surplus Hubs</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link to="/readmore" className="hover:text-emerald-400 transition flex items-center gap-1 group">
                  <span>Impact Insights</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Role Portals */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">Hub Roles</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/ngo/dashboard" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span>NGO Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Vendor Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/volunteer/dashboard" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Volunteer Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Sustainability Pledge */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">Take The Zero-Waste Pledge</h3>
            <p className="text-xs text-slate-400">
              Join thousands of changemakers receiving weekly impact updates.
            </p>
            {pledged ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Pledge taken! Welcome to the movement 🌱</span>
              </motion.div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={pledgeEmail}
                  onChange={(e) => setPledgeEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Built With Love */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-6 border-t border-slate-800/40">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            © {new Date().getFullYear()} ZeroWaste Platform. All rights reserved.
          </span>
          <span className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" /> for a Greener Tomorrow
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
