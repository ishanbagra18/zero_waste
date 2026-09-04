import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
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
} from "lucide-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ParallaxHero from "../components/ParallaxHero";

export default function Getitembyid() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchItemById();
  }, [id, token]);

  const fetchItemById = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/items/get-item/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data && res.data.item) {
        setItem(res.data.item);
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

  const handleClaim = () => {
    confirmAlert({
      title: "Confirm Resource Claim",
      message: "Are you sure you want to claim this surplus food item for your NGO?",
      buttons: [
        {
          label: "Yes, Claim Item",
          onClick: async () => {
            try {
              await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/api/items/${id}/claim`,
                {},
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              toast.success("Item claim request sent to vendor!");
              fetchItemById();
            } catch (error) {
              const errMsg =
                error.response?.data?.message || "Failed to claim item.";
              toast.error(errMsg);
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {
            toast("Claim cancelled.");
          },
        },
      ],
    });
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
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Catalog
          </button>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {loading ? (
          <div className="h-96 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
        ) : item ? (
          <div className="space-y-6">
            {/* Main Item Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl">
              {/* Left Column: Image Box */}
              <div className="lg:col-span-5 space-y-4">
                <div className="w-full h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group">
                  <img
                    src={item.itemImage?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
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
              </div>

              {/* Right Column: Parameters */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">{item.name}</h1>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {item.description || "No description provided for this surplus food item."}
                    </p>
                  </div>

                  {/* Metadata Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <DetailCard icon={Tag} label="Category" value={item.category} color="text-teal-400" />
                    <DetailCard icon={MapPin} label="Location" value={item.location} color="text-emerald-400" />
                    <DetailCard icon={Package} label="Quantity" value={item.quantity} color="text-teal-400" />
                    <DetailCard icon={IndianRupee} label="Value" value={item.price ? `₹${item.price}` : "Free Donation"} color="text-emerald-400" />
                    <DetailCard icon={RefreshCw} label="Transaction Mode" value={item.mode} color="text-teal-400" />
                    <DetailCard icon={ShieldCheck} label="Verification" value={item.status === "available" ? "Verified Active" : "Closed"} color="text-emerald-400" />
                  </div>
                </div>

                {/* Claim CTA Action */}
                <div className="pt-4 border-t border-slate-800/80">
                  {item.status !== "available" ? (
                    <button
                      disabled
                      className="w-full py-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                    >
                      Resource Already Claimed / Unavailable
                    </button>
                  ) : (
                    <button
                      onClick={handleClaim}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-xl shadow-emerald-500/20"
                    >
                      Submit Claim Request Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Vendor Profile Section */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" /> Provider Profile Information
              </h3>

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
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 italic">
            Item details could not be found.
          </div>
        )}
      </div>
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