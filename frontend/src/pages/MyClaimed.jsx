import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Calendar,
  Layers,
  ArrowLeft,
  KeyRound,
  Building2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ParallaxHero from "../components/ParallaxHero";

export default function MyClaimed() {
  const navigate = useNavigate();
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyClaimed = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/items/get-claimed-items`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setClaimedItems(res.data.claimedItems || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch claimed items");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyClaimed();
  }, [token]);

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved" || s === "claimed") {
      return { label: "Approved by Vendor", color: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm shadow-cyan-500/20" };
    }
    if (s === "pending") {
      return { label: "Pending Vendor Approval", color: "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-500/20" };
    }
    if (s === "collected" || s === "completed") {
      return { label: "Delivered & Collected", color: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40 shadow-sm shadow-indigo-500/20" };
    }
    return { label: status || "Unavailable", color: "bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-sm shadow-rose-500/20" };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Section */}
      <ParallaxHero
        badgeText="NGO Claimed Resources"
        title={
          <>
            My Claimed <span className="text-emerald-400">Food Resources</span>
          </>
        }
        subtitle="Track real-time approval status, delivery progress, and vendor security OTPs for your claimed surplus items."
        actionButtons={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/vendor/allitems"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
            >
              Browse Surplus Marketplace
            </Link>
            <Link
              to="/ngo/dashboard"
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition"
            >
              NGO Dashboard
            </Link>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : claimedItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl max-w-md mx-auto space-y-4 shadow-xl">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Claimed Items Yet</h3>
            <p className="text-xs text-slate-400">Browse the surplus marketplace to claim food items for your non-profit organization.</p>
            <Link
              to="/vendor/allitems"
              className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
            >
              Browse Marketplace Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {claimedItems.map((item, index) => {
              const badge = getStatusBadge(item.claimStatus);
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 backdrop-blur-xl p-5 shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Item Image & Status Badge */}
                    <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 relative">
                      <img
                        src={item.itemImage?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-emerald-400" /> Quantity: <span className="font-bold text-white">{item.quantity}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {item.claimedAt ? new Date(item.claimedAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vendor & OTP Details */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.vendor?.photo?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                        alt={item.vendor?.name || "Vendor Profile"}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700 bg-slate-950 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{item.vendor?.name || "Partner Vendor"}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          {item.vendor?.location || "Regional Supply Station"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}