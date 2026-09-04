import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Tag,
  IndianRupee,
  Package,
  CheckCircle2,
  XCircle,
  Layers,
  Filter,
  Search,
  ArrowRight,
} from "lucide-react";
import { useData } from "../context/DataContext";
import ParallaxHero from "../components/ParallaxHero";

export default function Allitems() {
  const { items, fetchItems } = useData();
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (Array.isArray(items)) {
      setCategories([...new Set(items.map((item) => item.category).filter(Boolean))]);
      setLocations([...new Set(items.map((item) => item.location).filter(Boolean))]);
    }
  }, [items]);

  useEffect(() => {
    let filtered = [...items];
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (selectedLocation) {
      filtered = filtered.filter((item) => item.location === selectedLocation);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q)
      );
    }
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [selectedCategory, selectedLocation, searchQuery, items]);

  const totalPages = Math.max(Math.ceil(filteredItems.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getStatusBadgeConfig = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "available") {
      return {
        label: "Available",
        color: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm shadow-cyan-500/20",
        dot: "bg-cyan-400 animate-pulse",
      };
    }
    if (s === "claimed" || s === "pending") {
      return {
        label: "Claimed",
        color: "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-500/20",
        dot: "bg-amber-400",
      };
    }
    if (s === "completed" || s === "collected") {
      return {
        label: "Completed",
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

      {/* Hero Section */}
      <ParallaxHero
        badgeText="Surplus Food & Resource Exchange"
        title={
          <>
            Discover & Reclaim <span className="text-emerald-400">Surplus Food</span>
          </>
        }
        subtitle="Explore vendor-posted food inventories, request resource claims, and optimize community sustainability."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xl">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surplus items..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="relative">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs px-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              onChange={(e) => setSelectedLocation(e.target.value)}
              value={selectedLocation}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs px-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="">All Locations</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto space-y-3">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 italic">No surplus food items match your filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedItems.map((item) => {
                const badge = getStatusBadgeConfig(item.status);
                return (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/vendor/item/${item._id}`)}
                    className="group flex flex-col justify-between cursor-pointer bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 shadow-xl hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      {/* Image Box */}
                      <div className="h-48 w-full overflow-hidden bg-slate-950 relative border-b border-slate-800/80">
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

                        {/* Distinct High-Contrast Status Tag */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 ${badge.color}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Description Details */}
                      <div className="px-5 space-y-2">
                        <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 h-8 leading-relaxed">
                          {item.description || "Fresh surplus inventory ready for community distribution."}
                        </p>

                        {/* Specs */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-3 border-t border-slate-800/80">
                          <span className="flex items-center gap-1 truncate text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </span>
                          <span className="flex items-center gap-1 truncate text-slate-400">
                            <Tag className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span className="truncate capitalize">{item.category}</span>
                          </span>
                          <span className="flex items-center gap-1 truncate text-slate-400">
                            <Package className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Qty: {item.quantity}</span>
                          </span>
                          <span className="flex items-center gap-1 font-bold text-emerald-400">
                            <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.price ? `₹${item.price}` : "Free"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span>View Resource Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:border-emerald-500/40 transition"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs disabled:opacity-30 disabled:pointer-events-none hover:bg-emerald-400 transition"
              >
                Next Page
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}