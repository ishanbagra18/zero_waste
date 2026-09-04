import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Truck,
  CheckCircle2,
  ArrowLeft,
  PackageCheck,
  ShieldCheck,
  Info,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

export default function PickupConfirmation() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const [itemId, setItemId] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastConfirmedItem, setLastConfirmedItem] = useState(null);

  const handlePickupConfirmation = async (e) => {
    e.preventDefault();
    const cleanId = itemId.trim();

    if (!cleanId) {
      toast.error("Please enter a valid Surplus Item ID.");
      return;
    }

    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/items/${cleanId}/pickup-confirmed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Pickup confirmed! NGO notified with OTP signal.");
      setLastConfirmedItem({
        id: cleanId,
        timestamp: new Date().toLocaleTimeString(),
      });
      setItemId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm pickup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Toaster position="top-right" />

      {/* Hero Banner */}
      <ParallaxHero
        badgeText="Volunteer Logistics Station"
        title={
          <>
            Surplus Item <span className="text-emerald-400">Pickup Dispatch</span>
          </>
        }
        subtitle="Confirm collected inventory from vendors to trigger instant delivery signals and generate security OTP verification for partner NGOs."
        actionButtons={
          <button
            onClick={() => navigate("/volunteer/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Dashboard
          </button>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        {/* Step Progression Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center">
              1
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step One</p>
              <p className="text-sm font-bold text-white">Item Claimed</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/40 backdrop-blur-xl flex items-center gap-3 shadow-lg shadow-emerald-500/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
              2
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Step</p>
              <p className="text-sm font-bold text-white">Confirm Pickup</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 font-bold flex items-center justify-center">
              3
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Final Step</p>
              <p className="text-sm font-bold text-white">NGO Verification</p>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Execute Pickup Signal</h2>
              <p className="text-xs text-slate-400">Paste the Item ID provided by the supplier or NGO claim record.</p>
            </div>
          </div>

          <form onSubmit={handlePickupConfirmation} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Surplus Item ID <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  placeholder="e.g. 64f8a12b9c7d0e1f..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Processing Signal...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  Confirm Item Pickup Now
                </>
              )}
            </button>
          </form>

          {/* Last Confirmed Status Box */}
          {lastConfirmedItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-emerald-400 uppercase">Recent Confirmation</p>
                  <p className="text-sm font-bold text-white truncate max-w-xs">Item: {lastConfirmedItem.id}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">{lastConfirmedItem.timestamp}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Volunteer Guidelines & Safety Checklist */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" /> Volunteer Transit Protocol
          </h3>
          <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Verify asset packaging integrity and food safety compliance before departing supplier premises.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Executing this form immediately notifies the receiving NGO with their required delivery verification OTP.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Upon arrival at destination, ask the NGO coordinator to share their 6-digit OTP code to complete shipment closure.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
