//updated volunteer dashboard 


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Building2,
  ShieldCheck,
  KeyRound,
  Search,
  Truck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  XCircle,
  AlertCircle,
  FileText,
  Send,
} from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

export default function VolunteerBookings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [ngoIdInputs, setNgoIdInputs] = useState({});
  const [otpInputs, setOtpInputs] = useState({});

  const fetchBookings = async () => {
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/book/allbooking`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const data = res.data.bookings || [];
      setBookings(data);

      // Default expand the first active or pending booking if available
      if (data.length > 0 && !expandedBookingId) {
        setExpandedBookingId(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching volunteer bookings:", error);
      toast.error("Failed to load bookings data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const handleAcceptBooking = async (bookingId) => {
    const ngoId = (ngoIdInputs[bookingId] || "").trim();
    if (!ngoId) {
      toast.error("Please enter the NGO ID to accept this booking.");
      return;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/book/${bookingId}/accept`,
        { ngoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking approved successfully!");
      setNgoIdInputs((prev) => ({ ...prev, [bookingId]: "" }));
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept booking.");
    }
  };

  const handleDeclineBooking = async (bookingId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/book/${bookingId}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking request declined.");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to decline booking.");
    }
  };

  const handleConfirmTransport = async (bookingId) => {
    const ngoId = (ngoIdInputs[bookingId] || "").trim();
    if (!ngoId) {
      toast.error("Please enter the NGO ID to confirm transport.");
      return;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/book/${bookingId}/pickup-confirmed`,
        { ngoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Transport confirmed! OTP sent to NGO.");
      setNgoIdInputs((prev) => ({ ...prev, [bookingId]: "" }));
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm transport.");
    }
  };

  const handleVerifyOtp = async (bookingId) => {
    const otp = (otpInputs[bookingId] || "").trim();
    if (!otp) {
      toast.error("Please enter the 6-digit OTP code to verify delivery.");
      return;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/book/${bookingId}/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Delivery verified & shipment completed!");
      setOtpInputs((prev) => ({ ...prev, [bookingId]: "" }));
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP.");
    }
  };

  const toggleExpandCard = (id) => {
    setExpandedBookingId((prevId) => (prevId === id ? null : id));
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "completed"
          ? b.status === "completed" || b.status === "delivered"
          : b.status === activeTab;

    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      b.ngo?.name?.toLowerCase().includes(query) ||
      b.fromLocation?.toLowerCase().includes(query) ||
      b.toLocation?.toLowerCase().includes(query) ||
      b.notes?.toLowerCase().includes(query);

    return matchesTab && matchesQuery;
  });

  const getStatusConfig = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") {
      return {
        label: "Pending Approval",
        color: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        step: 1,
      };
    }
    if (s === "accepted") {
      return {
        label: "Approved / In Transport",
        color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        step: 2,
      };
    }
    if (s === "pickup_confirmed") {
      return {
        label: "Pickup Confirmed",
        color: "bg-teal-500/15 text-teal-300 border-teal-500/30",
        step: 3,
      };
    }
    if (s === "completed" || s === "delivered") {
      return {
        label: "Delivered & Verified",
        color: "bg-emerald-600/20 text-emerald-200 border-emerald-600/30",
        step: 4,
      };
    }
    if (s === "rejected") {
      return {
        label: "Declined",
        color: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        step: 0,
      };
    }
    return { label: status, color: "bg-slate-800 text-slate-300 border-slate-700", step: 1 };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <ParallaxHero
        badgeText="Volunteer Freight Command Center"
        title={
          <>
            Logistics & <span className="text-emerald-400">Transport Bookings</span>
          </>
        }
        subtitle="Review, approve, and manage NGO freight transportation requests. Click any booking card to open its full operational pipeline and action console."
        actionButtons={
          <button
            onClick={() => navigate("/volunteer/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white font-semibold text-sm transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Dashboard
          </button>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        {/* Controls Header: Search & Filter Tabs */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NGO, route, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "All Bookings" },
              { id: "pending", label: "Pending" },
              { id: "accepted", label: "Accepted" },
              { id: "pickup_confirmed", label: "Pickup Confirmed" },
              { id: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${activeTab === tab.id
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Accordion List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const statusCfg = getStatusConfig(b.status);
              const isOpen = expandedBookingId === b._id;

              return (
                <motion.div
                  key={b._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-3xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden shadow-xl ${isOpen
                      ? "bg-slate-900/95 border-emerald-500/50 shadow-emerald-500/5"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                    }`}
                >
                  {/* Collapsed Card Summary Bar (Click to Open/Close) */}
                  <div
                    onClick={() => toggleExpandCard(b._id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-transform group-hover:scale-105 ${isOpen
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-slate-950 border border-slate-800 text-slate-400"
                          }`}
                      >
                        <Building2 className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {b.ngo?.name || "Partner NGO"}
                          </h3>
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-semibold text-slate-200">{b.fromLocation}</span>
                          <span className="text-slate-600">&rarr;</span>
                          <span className="font-semibold text-slate-300">{b.toLocation}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(b.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>

                      <button
                        className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${isOpen
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-950 border-slate-800 text-slate-300 group-hover:border-emerald-500/30"
                          }`}
                      >
                        {isOpen ? (
                          <>
                            Collapse <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Open Details <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Particular Booking Detail View */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-slate-800/80 p-6 sm:p-8 bg-slate-950/60 space-y-6"
                      >
                        {/* 4-Step Pipeline Tracker */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Freight Transport Pipeline</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { num: 1, label: "Booking Request" },
                              { num: 2, label: "Volunteer Approved" },
                              { num: 3, label: "Transport Confirmed" },
                              { num: 4, label: "Verified & Delivered" },
                            ].map((step) => {
                              const isCompleted = statusCfg.step >= step.num;
                              const isCurrent = statusCfg.step === step.num;
                              return (
                                <div
                                  key={step.num}
                                  className={`p-3 rounded-2xl border text-center transition-all ${isCurrent
                                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md"
                                      : isCompleted
                                        ? "bg-slate-900 border-emerald-500/30 text-emerald-400"
                                        : "bg-slate-950/50 border-slate-800 text-slate-600"
                                    }`}
                                >
                                  <div className="text-xs font-black mb-0.5">Step {step.num}</div>
                                  <div className="text-[11px] font-semibold truncate">{step.label}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Detailed Route, Item & Contact Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Partner NGO Info
                            </span>
                            <p className="text-sm font-bold text-white">{b.ngo?.name || "NGO Representative"}</p>
                            <p className="text-xs text-slate-400">{b.ngo?.organisation || "Non-profit Organization"}</p>
                            <p className="text-xs text-slate-400">{b.ngo?.email || "No email listed"}</p>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-teal-400" /> Waybill Transit Route
                            </span>
                            <p className="text-xs text-slate-300 font-semibold">From: {b.fromLocation}</p>
                            <p className="text-xs text-slate-300 font-semibold">To: {b.toLocation}</p>
                            {b.notes && (
                              <p className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded-xl border border-slate-800/60 mt-1">
                                Notes: "{b.notes}"
                              </p>
                            )}
                          </div>

                          {(() => {
                            const itemObj = (b.item && typeof b.item === "object") ? b.item : null;
                            const itemIdStr = typeof b.item === "string" ? b.item : b.item?._id || "";

                            if (!itemObj && !itemIdStr) {
                              return (
                                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                    <Package className="w-3.5 h-3.5 text-slate-400" /> Item Details
                                  </span>
                                  <p className="text-xs text-slate-400 italic">General freight transport booking.</p>
                                </div>
                              );
                            }

                            return (
                              <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Linked Surplus Item
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 truncate" title={itemIdStr}>
                                    ID: {itemIdStr ? (itemIdStr.length > 8 ? `${itemIdStr.substring(0, 8)}...` : itemIdStr) : "N/A"}
                                  </span>
                                </div>
                                {itemObj?.itemImage?.url && (
                                  <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                                    <img src={itemObj.itemImage.url} alt={itemObj.name || "Surplus Item"} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <p className="text-sm font-bold text-white truncate">{itemObj?.name || "Surplus Food Resource"}</p>
                                <div className="grid grid-cols-2 gap-1 text-[11px]">
                                  <span className="text-slate-400">Category: <strong className="text-white capitalize">{itemObj?.category || "Food"}</strong></span>
                                  <span className="text-slate-400">Qty: <strong className="text-emerald-400">{itemObj?.quantity || "Assigned"}</strong></span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Interactive Workstation Action Form for this Particular Booking */}
                        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Operational Action Workstation
                          </h4>

                          {b.status === "pending" && (
                            <div className="space-y-3">
                              <p className="text-xs text-slate-400">
                                Enter the NGO ID provided in your notification to approve this transport request.
                              </p>
                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <input
                                  type="text"
                                  value={ngoIdInputs[b._id] || ""}
                                  onChange={(e) =>
                                    setNgoIdInputs((prev) => ({ ...prev, [b._id]: e.target.value }))
                                  }
                                  placeholder="Enter NGO ID..."
                                  className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                                />
                                <button
                                  onClick={() => handleAcceptBooking(b._id)}
                                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-slate-950" /> Approve Request
                                </button>
                                <button
                                  onClick={() => handleDeclineBooking(b._id)}
                                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:border-rose-500/40 text-rose-400 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                                >
                                  <XCircle className="w-4 h-4" /> Decline
                                </button>
                              </div>
                            </div>
                          )}

                          {b.status === "accepted" && (
                            <div className="space-y-3">
                              <p className="text-xs text-slate-400">
                                Confirm active transport departure. This triggers an automated 6-digit Delivery OTP code sent to the NGO.
                              </p>
                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <input
                                  type="text"
                                  value={ngoIdInputs[b._id] || ""}
                                  onChange={(e) =>
                                    setNgoIdInputs((prev) => ({ ...prev, [b._id]: e.target.value }))
                                  }
                                  placeholder="Enter NGO ID for Transport Confirmation..."
                                  className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500"
                                />
                                <button
                                  onClick={() => handleConfirmTransport(b._id)}
                                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20"
                                >
                                  <Truck className="w-4 h-4 text-slate-950" /> Confirm Transport
                                </button>
                              </div>
                            </div>
                          )}

                          {b.status === "pickup_confirmed" && (
                            <div className="space-y-3">
                              <p className="text-xs text-slate-400">
                                Ask the NGO coordinator for their 6-digit OTP code to verify delivery arrival.
                              </p>
                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <input
                                  type="text"
                                  value={otpInputs[b._id] || ""}
                                  onChange={(e) =>
                                    setOtpInputs((prev) => ({ ...prev, [b._id]: e.target.value }))
                                  }
                                  placeholder="Enter 6-digit Delivery OTP code..."
                                  className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-mono tracking-wider text-center sm:text-left"
                                />
                                <button
                                  onClick={() => handleVerifyOtp(b._id)}
                                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                                >
                                  <KeyRound className="w-4 h-4 text-slate-950" /> Verify Delivery OTP
                                </button>
                              </div>
                            </div>
                          )}

                          {(b.status === "completed" || b.status === "delivered") && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
                              <ShieldCheck className="w-5 h-5 shrink-0" /> Shipment successfully delivered and validated via 6-digit OTP code.
                            </div>
                          )}

                          {b.status === "rejected" && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20">
                              <XCircle className="w-5 h-5 shrink-0" /> Booking request was declined by the volunteer.
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Truck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 italic">No bookings match your selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
