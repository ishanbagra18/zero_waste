import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Star, Search, MapPin, Mail, Phone, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import ParallaxHero from "../components/ParallaxHero";

export default function Allvendors() {
  const { vendors, fetchVendors, loadingVendors } = useData();
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();

    if (lowerQuery === "") {
      setFilteredVendors(vendors.slice(0, 12));
    } else {
      const filtered = vendors.filter(
        (vendor) =>
          vendor.name?.toLowerCase().includes(lowerQuery) ||
          vendor.organisation?.toLowerCase().includes(lowerQuery) ||
          vendor.location?.toLowerCase().includes(lowerQuery)
      );
      setFilteredVendors(filtered);
    }
  }, [searchQuery, vendors]);

  const handleChatClick = (vendorId) => {
    navigate(`/chatting/${vendorId}`);
  };

  const handleReviewClick = (vendorId) => {
    navigate(`/review/${vendorId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      {/* Hero Header */}
      <ParallaxHero
        badgeText="Certified Vendor Network"
        title={
          <>
            Explore Partner <span className="text-emerald-400">Food Vendors</span>
          </>
        }
        subtitle="Discover verified suppliers, restaurant chains, and commercial kitchens listing surplus inventories for non-profit food recovery."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Search Bar */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-xl flex items-center justify-center max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search vendor by name, organisation, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Vendor Cards Grid */}
        {loadingVendors ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm italic max-w-md mx-auto">
            No vendors match your search query "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                className="group flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 p-6 backdrop-blur-xl transition-all duration-300 shadow-xl"
              >
                <div className="space-y-4">
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                      {vendor.role || "Vendor"}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {/* Profile Head */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={
                        vendor.photo?.url ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={vendor.name}
                      className="w-20 h-20 rounded-full object-cover border border-slate-700 bg-slate-950 p-0.5 mb-3 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                      }}
                    />
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {vendor.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{vendor.organisation || "Independent Supplier"}</span>
                    </p>
                  </div>

                  {/* Meta Details */}
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate">{vendor.location || "Regional Station"}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate" title={vendor.email}>{vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate">{vendor.phone || "Contact via Chat"}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => handleChatClick(vendor._id)}
                    className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Chat
                  </button>

                  <button
                    onClick={() => handleReviewClick(vendor._id)}
                    className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    <Star className="w-3.5 h-3.5 fill-current text-slate-950" /> Review
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}