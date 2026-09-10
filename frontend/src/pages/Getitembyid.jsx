import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Tag,
  IndianRupee,
  Package,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Mail,
  Building2,
  User,
  ShieldCheck,
  RefreshCw,
  Clock,
  Zap,
  Handshake,
  AlertTriangle,
  FileCheck,
  Maximize2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ParallaxHero from "../components/ParallaxHero";

export default function Getitembyid() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showVendorActionModal, setShowVendorActionModal] = useState(false);
  const [vendorAction, setVendorAction] = useState("approved"); // 'approved' | 'rejected'
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [relatedItems, setRelatedItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  const [selectedImage, setSelectedImage] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role, userId } = useAuth();

  const isNgoRole = (role || localStorage.getItem("role") || "").toLowerCase() === "ngo";
  const isVendorRole = (role || localStorage.getItem("role") || "").toLowerCase() === "vendor";
  const vendorId = typeof item?.vendor === "object" ? item?.vendor?._id : item?.vendor;
  const isItemVendorOwner = item && vendorId === userId;

  const isUrgentItem = (itemData) => {
    if (!itemData) return false;
    if (itemData.isUrgent) return true;
    if (itemData.expiryDate) {
      const diffMs = new Date(itemData.expiryDate).getTime() - Date.now();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours > 0 && diffHours <= 12) return true;
    }
    return false;
  };

  // Live Countdown Timer Effect
  useEffect(() => {
    if (!item?.expiryDate) return;

    const updateTimer = () => {
      const diff = new Date(item.expiryDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [item?.expiryDate]);

  useEffect(() => {
    fetchItemById();
    fetchRelatedItems();
  }, [id, token]);

  const fetchItemById = async () => {
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/items/get-item/${id}`,
        {
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }
      );
      if (res.data && res.data.item) {
        setItem(res.data.item);
        setSelectedImage(res.data.item.itemImage?.url || "https://i.pinimg.com/1200x/88/47/39/88473985291358d661b8c7526f2dcc19.jpg");
      } else {
        toast.error("Item not found or unexpected response.");
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/items/get-items?limit=6`);
      if (res.data && Array.isArray(res.data.items)) {
        setRelatedItems(res.data.items.filter((i) => i._id !== id).slice(0, 3));
      }
    } catch (err) {
      console.warn("Could not fetch related items:", err);
    }
  };

  const handleFetchError = (error) => {
    if (error.response?.status === 401) {
      toast.error("Unauthorized: Please log in again.");
    } else if (error.response?.status === 404) {
      toast.error("Item not found.");
    } else {
      toast.error("Failed to load item details.");
    }
  };

  // Quick Action: Share Link
  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("📋 Item link copied to clipboard!");
    } else {
      toast("Sharing link available.");
    }
  };

  // Quick Action: Toggle Bookmark
  const handleToggleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      if (next) toast.success("❤️ Added to saved bookmarks!");
      else toast("Removed from bookmarks.", { icon: "💔" });
      return next;
    });
  };

  // Quick Action: Open Google Maps
  const handleOpenMaps = () => {
    if (!item?.location) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Trigger claim confirmation modal
  const handleOpenClaimModal = () => {
    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) {
      toast.error("Please log in to submit resource claims.");
      return;
    }
    setAgreedToTerms(false);
    setShowClaimModal(true);
  };

  // Close claim confirmation modal with feedback
  const handleCancelClaimModal = () => {
    setShowClaimModal(false);
    setAgreedToTerms(false);
    toast("Claim request cancelled.", { icon: "ℹ️" });
  };

  // Submit claim API request
  const executeClaimItem = async () => {
    const activeToken = token || localStorage.getItem("token");
    if (!agreedToTerms) {
      toast.error("Please confirm compliance with handling guidelines.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/items/${id}/claim`,
        {},
        {
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );
      toast.success("🎉 Resource claim request submitted! Vendor notified.");
      setShowClaimModal(false);
      fetchItemById();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to submit claim request.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vendor Action Trigger (Approve / Reject claim)
  const handleOpenVendorAction = (actionType) => {
    setVendorAction(actionType);
    setShowVendorActionModal(true);
  };

  const handleCancelVendorActionModal = () => {
    setShowVendorActionModal(false);
    toast("Vendor action cancelled.", { icon: "ℹ️" });
  };

  const executeVendorAction = async () => {
    const activeToken = token || localStorage.getItem("token");
    setIsSubmitting(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/items/${id}/claim-status`,
        { status: vendorAction },
        {
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );
      toast.success(
        vendorAction === "approved"
          ? "✅ Claim request approved!"
          : "⚠️ Claim request rejected and listing reset."
      );
      setShowVendorActionModal(false);
      fetchItemById();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update claim status.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeConfig = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "available") {
      return {
        label: "Available for Claim",
        color: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm shadow-cyan-500/20",
        dot: "bg-cyan-400 animate-pulse",
      };
    }
    if (s === "claimed" || s === "pending") {
      return {
        label: "Claim Requested",
        color: "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-500/20",
        dot: "bg-amber-400",
      };
    }
    if (s === "completed" || s === "collected") {
      return {
        label: "Collected & Completed",
        color: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40 shadow-sm shadow-indigo-500/20",
        dot: "bg-indigo-400",
      };
    }
    return {
      label: status || "Unavailable",
      color: "bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-sm shadow-rose-500/20",
      dot: "bg-rose-400",
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <ParallaxHero
        badgeText="Surplus Resource Specification"
        title={
          <>
            Item Specifications & <span className="text-emerald-400">Claim Console</span>
          </>
        }
        subtitle="Review item parameters, vendor location, quantity volume, and submit resource claim requests."
        actionButtons={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Catalog
            </button>
            <button
              onClick={handleShareLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-sm transition shadow-lg"
              title="Share Link"
            >
              <FileCheck className="w-4 h-4 text-teal-400" /> Share Link
            </button>
            <button
              onClick={handleToggleBookmark}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition shadow-lg ${
                isBookmarked ? "bg-rose-500/20 border-rose-500/40 text-rose-300" : "bg-slate-900 border-slate-800 text-slate-300 hover:border-rose-500/40"
              }`}
            >
              <span>{isBookmarked ? "❤️ Saved" : "🤍 Bookmark"}</span>
            </button>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {loading ? (
          <div className="h-96 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-emerald-400">Loading Resource Details...</span>
            </div>
          </div>
        ) : item ? (
          <div className="space-y-6">
            {/* Main Item Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl">
              {/* Left Column: Image Box & Live Expiry Timer */}
              <div className="lg:col-span-5 space-y-4">
                <div
                  onClick={() => setLightboxImage(selectedImage || item.itemImage?.url || "https://i.pinimg.com/1200x/88/47/39/88473985291358d661b8c7526f2dcc19.jpg")}
                  className="w-full h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group cursor-pointer shadow-lg"
                >
                  <img
                    src={selectedImage || item.itemImage?.url || "https://i.pinimg.com/1200x/88/47/39/88473985291358d661b8c7526f2dcc19.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://i.pinimg.com/1200x/88/47/39/88473985291358d661b8c7526f2dcc19.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 shadow-xl">
                      <Maximize2 size={14} className="text-emerald-400" /> View Full Image
                    </span>
                  </div>
                </div>


                {/* High Contrast Status Box */}
                {(() => {
                  const badge = getStatusBadgeConfig(item.status);
                  return (
                    <div className={`w-full p-3.5 rounded-2xl border text-center font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${badge.color}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}

                {/* Live Countdown Timer Widget (Only for active available items) */}
                {item.expiryDate && item.status === "available" && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Clock size={16} className="animate-spin-slow" />
                      <span>Time Remaining:</span>
                    </div>
                    {timeLeft.isExpired ? (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase text-[10px]">
                        Expired
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 font-mono font-bold text-white text-sm">
                        <span className="bg-slate-900 px-2 py-1 rounded-md border border-slate-800">{String(timeLeft.hours).padStart(2, "0")}h</span>
                        <span>:</span>
                        <span className="bg-slate-900 px-2 py-1 rounded-md border border-slate-800">{String(timeLeft.minutes).padStart(2, "0")}m</span>
                        <span>:</span>
                        <span className="bg-slate-900 px-2 py-1 rounded-md border border-slate-800">{String(timeLeft.seconds).padStart(2, "0")}s</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Parameters */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">{item.name}</h1>
                      {isUrgentItem(item) && (
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 animate-pulse shadow-md">
                          <Zap className="w-3.5 h-3.5 fill-slate-950" /> ⚡ Urgent Pickup Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {item.description || "No description provided for this surplus food item."}
                    </p>
                  </div>

                  {/* Metadata Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <DetailCard icon={Tag} label="Category" value={item.category} color="text-teal-400" />
                    <div className="relative group cursor-pointer" onClick={handleOpenMaps}>
                      <DetailCard icon={MapPin} label="Location (Click Map)" value={item.location} color="text-emerald-400" />
                    </div>
                    <DetailCard icon={Package} label="Quantity" value={item.quantity} color="text-teal-400" />
                    <DetailCard icon={IndianRupee} label="Value" value={item.price ? `₹${item.price}` : "Free Donation"} color="text-emerald-400" />
                    <DetailCard icon={RefreshCw} label="Transaction Mode" value={item.mode} color="text-teal-400" />
                    <DetailCard icon={ShieldCheck} label="Verification" value={item.status === "available" ? "Verified Active" : "Closed"} color="text-emerald-400" />
                  </div>
                </div>

                {/* Claim / Action Controls Section */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  {/* Scenario 1: Item is available */}
                  {item.status === "available" && (
                    <div>
                      {isNgoRole || !role ? (
                        <button
                          onClick={handleOpenClaimModal}
                          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                        >
                          <Handshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Submit Claim Request Now</span>
                        </button>
                      ) : (
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                          <p className="text-xs text-slate-400">
                            This item is listed and awaiting NGO claim requests.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scenario 2: Item is claimed / pending */}
                  {(item.status === "claimed" || item.status === "pending") && (
                    <div className="space-y-3">
                      {/* Vendor Owner Decision Controls */}
                      {isItemVendorOwner && item.claimStatus === "pending" && (
                        <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                            <AlertTriangle size={16} /> Action Required: Review Pending NGO Claim
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleOpenVendorAction("approved")}
                              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 size={16} /> Approve Claim
                            </button>
                            <button
                              onClick={() => handleOpenVendorAction("rejected")}
                              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                            >
                              <XCircle size={16} /> Reject & Reset
                            </button>
                          </div>
                        </div>
                      )}

                      {/* General Claimed State Display */}
                      {(!isItemVendorOwner || item.claimStatus !== "pending") && (
                        <button
                          disabled
                          className="w-full py-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <ShieldCheck size={18} className="text-amber-500" />
                          <span>Resource Claim Request Processing</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Scenario 3: Completed or Unavailable */}
                  {item.status !== "available" && item.status !== "claimed" && item.status !== "pending" && (
                    <button
                      disabled
                      className="w-full py-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                    >
                      Resource Claim Completed / Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Logistics Lifecycle Stepper (if item is claimed/pending) */}
            {item.status !== "available" && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Live Claim Pipeline Logistics Tracker
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <LogisticsStep
                    step="1"
                    title="Claim Requested"
                    desc="NGO submitted claim"
                    active={true}
                    completed={item.claimStatus === "approved" || item.status === "completed" || item.claimStatus === "collected"}
                  />
                  <LogisticsStep
                    step="2"
                    title="Vendor Verification"
                    desc="Supplier approves claim"
                    active={item.claimStatus === "pending" || item.claimStatus === "approved" || item.status === "completed"}
                    completed={item.claimStatus === "approved" || item.status === "completed" || item.claimStatus === "collected"}
                  />
                  <LogisticsStep
                    step="3"
                    title="Pickup Logistics"
                    desc="Volunteer dispatched"
                    active={item.claimStatus === "approved" || item.deliveryStatus === "pickup_confirmed" || item.status === "completed"}
                    completed={item.deliveryStatus === "pickup_confirmed" || item.deliveryStatus === "delivered" || !!item.pickupConfirmedAt || item.status === "completed" || item.claimStatus === "collected"}
                  />
                  <LogisticsStep
                    step="4"
                    title="OTP Delivery"
                    desc="Handover complete"
                    active={item.deliveryStatus === "pickup_confirmed" || item.status === "completed" || item.claimStatus === "collected"}
                    completed={item.deliveryStatus === "delivered" || item.status === "completed" || item.claimStatus === "collected"}
                  />
                </div>
              </div>
            )}

            {/* Provider Profile Section & Quick Actions */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-400" /> Provider Profile Information
                </h3>
                {vendorId && (
                  <button
                    onClick={() => navigate(`/chatting/${vendorId}`)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>💬 Direct Chat with Vendor</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <User className="w-4 h-4 text-teal-400 shrink-0" />
                  <div className="truncate">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Vendor Contact</p>
                    <p className="font-semibold text-white truncate">{item.vendor?.name || "Partner Vendor"}</p>
                  </div>
                </div>

                {item.vendor?.email && (
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Email Address</p>
                      <p className="font-semibold text-emerald-400 truncate" title={item.vendor.email}>{item.vendor.email}</p>
                    </div>
                  </div>
                )}

                {item.vendor?.organisation && (
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Organisation</p>
                      <p className="font-semibold text-white truncate">{item.vendor.organisation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Surplus Resources Grid */}
            {relatedItems.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  📦 More Surplus Items Available Nearby
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedItems.map((rel) => (
                    <div
                      key={rel._id}
                      onClick={() => navigate(`/vendor/item/${rel._id}`)}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition flex items-center gap-3 shadow-lg group"
                    >
                      <img
                        src={rel.itemImage?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}
                        alt={rel.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{rel.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{rel.category} • {rel.location}</p>
                        <span className="text-[10px] font-bold text-emerald-400 block mt-1">Qty: {rel.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 italic">
            Item details could not be found.
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* Interactive Framer Motion NGO Claim Confirmation Modal */}
      {/* ====================================================== */}
      <AnimatePresence>
        {showClaimModal && item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelClaimModal}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 space-y-6 text-slate-100 overflow-hidden"
            >
              {/* Top Decorative Ambient Glow */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-start gap-4 border-b border-slate-800 pb-5">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-lg shadow-emerald-950/30">
                  <Handshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Confirm Resource Claim</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Review surplus resource parameters before submitting your claim request to the supplier.
                  </p>
                </div>
              </div>

              {/* Resource Summary Snapshot Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.itemImage?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate capitalize">{item.name}</h4>
                    <p className="text-xs text-slate-400 truncate">{item.category} • {item.location}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    Qty: {item.quantity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <div>Vendor: <span className="text-slate-200 font-semibold">{item.vendor?.name || "Supplier"}</span></div>
                  <div>Value: <span className="text-emerald-400 font-semibold">{item.price ? `₹${item.price}` : "Free"}</span></div>
                </div>
              </div>

              {/* Compliance Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/30 transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-500 rounded cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  I confirm our NGO will inspect and transport this food resource safely in accordance with ZeroWaste community guidelines.
                </span>
              </label>

              {/* Modal Footer Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelClaimModal}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
                >
                  Cancel Process
                </button>

                <button
                  type="button"
                  onClick={executeClaimItem}
                  disabled={!agreedToTerms || isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Claim...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck size={16} />
                      <span>Yes, Submit Claim Request</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* Interactive Framer Motion Vendor Decision / Cancellation Modal */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showVendorActionModal && item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelVendorActionModal}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 overflow-hidden"
            >
              <div className="flex items-start gap-4 border-b border-slate-800 pb-5">
                <div
                  className={`p-3 rounded-2xl border shrink-0 ${
                    vendorAction === "approved"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}
                >
                  {vendorAction === "approved" ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white capitalize">
                    {vendorAction === "approved" ? "Approve Claim Request" : "Reject & Reset Listing"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {vendorAction === "approved"
                      ? "Confirm approving this NGO's claim request to initiate delivery / volunteer pickup."
                      : "Confirm rejecting this claim request. The item will be reset to available for other NGOs."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <p className="text-slate-400">Target Resource: <span className="text-white font-bold">{item.name}</span></p>
                <p className="text-slate-400">Quantity: <span className="text-white font-bold">{item.quantity}</span></p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelVendorActionModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeVendorAction}
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg ${
                    vendorAction === "approved"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                      : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : vendorAction === "approved" ? (
                    "Confirm Approval"
                  ) : (
                    "Confirm Rejection"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================== */}
      {/* Lightbox Modal for High Quality Image Zoom */}
      {/* ====================================================== */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-lg cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
            >
              <img src={lightboxImage} alt="Resource View" className="w-full h-full object-contain bg-slate-950" />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-white hover:bg-slate-800 transition"
              >
                <XCircle size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DetailCard = ({ icon: Icon, label, value, color }) => (
  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
    <Icon className={`w-4 h-4 ${color} shrink-0`} />
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-xs font-semibold text-white truncate capitalize">{value || "N/A"}</p>
    </div>
  </div>
);

const LogisticsStep = ({ step, title, desc, active, completed }) => (
  <div
    className={`p-3 rounded-2xl border transition-all ${
      completed
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
        : active
        ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
        : "bg-slate-950/60 border-slate-800 text-slate-500 opacity-60"
    }`}
  >
    <div className="flex items-center gap-2 mb-1">
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
          completed
            ? "bg-emerald-400 text-slate-950"
            : active
            ? "bg-amber-400 text-slate-950 animate-pulse"
            : "bg-slate-800 text-slate-400"
        }`}
      >
        {completed ? "✓" : step}
      </span>
      <span className="text-xs font-bold truncate">{title}</span>
    </div>
    <p className="text-[10px] text-slate-400 truncate">{desc}</p>
  </div>
);
