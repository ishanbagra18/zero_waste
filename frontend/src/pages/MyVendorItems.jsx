import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  Zap,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Leaf,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { playClickSound, playSuccessSound } from "../utils/audio";
import ParallaxHero from "../components/ParallaxHero";
import ItemCardWithCursor from "../components/items/ItemCardWithCursor";

export default function MyVendorItems() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [disintegratingId, setDisintegratingId] = useState(null);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/items/my-items`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 200 },
        }
      );
      if (Array.isArray(res.data.items)) {
        setItems(res.data.items);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to load vendor items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyItems();
    }
  }, [token]);

  const confirmDelete = (id) => {
    playClickSound();
    setDeleteItemId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteItemId) return;
    const targetId = deleteItemId;
    setShowConfirmModal(false);
    setDisintegratingId(targetId);

    setTimeout(async () => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/items/delete-item/${targetId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems((prev) => prev.filter((item) => item._id !== targetId));
        playSuccessSound();
        toast.success("Item deleted successfully!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete item");
      } finally {
        setDisintegratingId(null);
        setDeleteItemId(null);
      }
    }, 650);
  };

  // Filtering Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "claimed" && item.status === "claimed") ||
      (statusFilter === "unclaimed" && item.status !== "claimed");

    return matchesSearch && matchesStatus;
  });

  const totalCount = items.length;
  const claimedCount = items.filter((i) => i.status === "claimed").length;
  const unclaimedCount = items.filter((i) => i.status !== "claimed").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <ParallaxHero
        badgeText="Vendor Inventory Console"
        title={
          <>
            All Listed <span className="text-emerald-400">Inventory Items</span>
          </>
        }
        subtitle="Manage, update, or remove your full catalogue of active surplus food and resource packages."
        actionButtons={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white font-semibold text-sm transition shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" /> Vendor Dashboard
            </button>
            <Link
              to="/vendor/createitem"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition"
            >
              <PlusCircle className="w-4.5 h-4.5 text-slate-950" /> Add New Item
            </Link>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        
        {/* KPI Counter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-5 rounded-3xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Items Listed</span>
              <span className="text-3xl font-black text-emerald-400">{totalCount}</span>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-5 rounded-3xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Claimed Packages</span>
              <span className="text-3xl font-black text-amber-400">{claimedCount}</span>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-5 rounded-3xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active / Available</span>
              <span className="text-3xl font-black text-teal-400">{unclaimedCount}</span>
            </div>
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-4 sm:p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition shadow-inner"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === "all"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setStatusFilter("unclaimed")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === "unclaimed"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              Active / Available ({unclaimedCount})
            </button>
            <button
              onClick={() => setStatusFilter("claimed")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === "claimed"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              Claimed ({claimedCount})
            </button>
          </div>
        </div>

        {/* Inventory Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 h-80 animate-pulse space-y-4">
                <div className="bg-slate-800 rounded-2xl h-40 w-full" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <ItemCardWithCursor
                  key={item._id}
                  onClick={() => navigate(`/vendor/item/${item._id}`)}
                  className="h-full cursor-pointer"
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={
                      disintegratingId === item._id
                        ? {
                            opacity: [1, 0.6, 0],
                            scale: [1, 0.9, 0.5],
                            filter: ["blur(0px)", "blur(12px)", "blur(24px)"],
                            rotate: [0, -3, 3, 0],
                          }
                        : { opacity: 1, scale: 1, y: 0 }
                    }
                    transition={
                      disintegratingId === item._id
                        ? { duration: 0.6, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                    exit={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                    className="group bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-4 rounded-3xl shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full"
                  >
                  <div>
                    <div className="relative rounded-2xl overflow-hidden aspect-video w-full mb-4 border border-slate-800 bg-slate-950">
                      <img
                        src={item.itemImage?.url || "https://via.placeholder.com/300"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {(item.isUrgent ||
                        (item.expiryDate &&
                          new Date(item.expiryDate).getTime() - Date.now() <= 12 * 60 * 60 * 1000)) && (
                        <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-md flex items-center gap-1 animate-pulse">
                          <Zap size={10} className="fill-slate-950" /> URGENT
                        </span>
                      )}
                      <span
                        className={`absolute top-2 right-2 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md ${
                          item.status === "claimed"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 px-1">
                      <h3 className="text-lg font-bold text-slate-100 truncate" title={item.name}>
                        {item.name}
                      </h3>
                      <p
                        className="text-xs text-slate-400 line-clamp-2 min-h-[2.2rem]"
                        title={item.description || "No description provided"}
                      >
                        {item.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-[11px] text-slate-300 px-1">
                    <div className="flex items-center gap-1.5 text-slate-400 truncate">
                      <MapPin size={12} className="shrink-0 text-emerald-400" />
                      <span>{item.location || "Unknown Location"}</span>
                    </div>

                    {item.expiryDate && (
                      <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[10px]">
                        <Clock size={11} className="shrink-0" />
                        <span>
                          Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                      <div>
                        Qty: <span className="font-bold text-slate-200">{item.quantity || 0}</span>
                      </div>
                      <div className="truncate">
                        Cat: <span className="font-bold text-slate-200">{item.category}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 flex gap-2">
                      <Link
                        to={`/vendor/updateitem/${item._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-950 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-500 text-slate-200 hover:text-white text-xs font-semibold py-2 rounded-xl transition shadow-sm"
                      >
                        <Edit3 size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => confirmDelete(item._id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-950 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-semibold py-2 rounded-xl transition shadow-sm"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              </ItemCardWithCursor>
            ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-bold text-slate-300">No items match your filter.</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or status filter.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-5">
            <div className="mx-auto bg-rose-500/10 text-rose-400 p-4 rounded-2xl w-fit border border-rose-500/20">
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Delete Item Listing?</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-rose-600 hover:bg-rose-500 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition"
              >
                Yes, Delete Item
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
