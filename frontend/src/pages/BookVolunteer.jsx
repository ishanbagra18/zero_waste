// src/pages/BookVolunteer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import {
  MdSearch,
  MdEmail,
  MdLocationOn,
  MdVolunteerActivism,
  MdRefresh,
} from "react-icons/md";

// Neon gradients used for the card hover glow effects
const glowGradients = [
  "from-cyan-500 via-teal-400 to-emerald-500",
  "from-fuchsia-500 via-purple-500 to-indigo-500",
  "from-amber-500 via-orange-400 to-red-500",
  "from-blue-500 via-indigo-400 to-violet-500",
  "from-purple-500 via-pink-500 to-rose-500",
  "from-orange-500 via-rose-400 to-pink-600",
];

export default function BookVolunteer() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemId = queryParams.get("itemId") || "";

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVolunteers = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:3002/api/users/allvolunteer")
      .then((res) => {
        setVolunteers(res.data.Volunteer || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load volunteer directory.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Compute filtered results inline during render pass
  const cleanSearchTerm = searchTerm.trim().toLowerCase();
  const filteredVolunteers = volunteers.filter((v) => {
    return (
      v.name?.toLowerCase().includes(cleanSearchTerm) ||
      v.location?.toLowerCase().includes(cleanSearchTerm)
    );
  });

  return (
    <div className="min-h-screen w-full py-16 px-4 sm:px-8 md:px-12 bg-gradient-to-br from-black via-[#0f1115] to-[#141822] text-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-400 uppercase tracking-wider select-none drop-shadow-sm mb-3">
          Meet Our Volunteers
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Connect with dedicated individuals making sustainable impact real.
        </p>
      </header>

      {/* Neon glass search bar */}
      <div className="flex justify-center mb-16">
        <div className="relative w-full max-w-lg group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl blur opacity-30 group-focus-within:opacity-70 transition duration-300"></div>
          <div className="relative">
            <MdSearch className="absolute left-4 top-4 text-cyan-400 text-2xl pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3.5 w-full text-base rounded-2xl border border-white/10 bg-black/80 text-cyan-50 placeholder-neutral-600 shadow-2xl focus:outline-none backdrop-blur-xl transition"
              aria-label="Search volunteer database"
            />
          </div>
        </div>
      </div>

      {/* Core Dynamic Content Areas */}
      {loading ? (
        <div className="w-full flex flex-col items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-cyan-400 border-r-fuchsia-400 mb-4" />
          <span className="text-neutral-400 text-sm font-medium tracking-wide animate-pulse">
            Querying server directory...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-12 max-w-sm mx-auto">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchVolunteers}
            className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm px-4 py-2 rounded-xl transition"
          >
            <MdRefresh /> Retry Connection
          </button>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="text-center text-neutral-500 text-lg py-12 font-medium italic">
          No matches found for "{searchTerm}"
        </div>
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredVolunteers.map((vol, idx) => (
            <VolunteerCard key={vol._id} volunteer={vol} idx={idx} itemId={itemId} />
          ))}
        </main>
      )}
    </div>
  );
}

function VolunteerCard({ volunteer, idx, itemId }) {
  const glowGradient = glowGradients[idx % glowGradients.length];

  return (
    <Link
      to={`/bookingform/${volunteer._id}${itemId ? `?itemId=${itemId}` : ""}`}
      className="relative group block rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1.5"
      title={`Book ${volunteer.name}`}
    >
      {/* Hidden Ambient Glow back-layer (Becomes bright on hover) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${glowGradient} rounded-3xl blur opacity-10 group-hover:opacity-40 transition-opacity duration-300`} />

      {/* True Glass Card Layout Container */}
      <div className="relative rounded-3xl bg-neutral-950/50 backdrop-blur-xl border border-white/[0.07] group-hover:border-white/20 p-6 flex flex-col items-center text-center h-full min-h-[360px] justify-between overflow-hidden">
        
        {/* Role Tag Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {volunteer.role || "Volunteer"}
          </span>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Available Status" />
        </div>

        {/* Identity Section */}
        <div className="flex flex-col items-center flex-grow justify-center w-full">
          <div className="relative mb-4">
            <div className={`absolute -inset-1 bg-gradient-to-tr ${glowGradient} rounded-full blur opacity-40 group-hover:opacity-100 transition duration-300`} />
            <img
              src={volunteer.photo?.url || "https://i.pravatar.cc/150?img=" + (idx + 10)}
              alt={`${volunteer.name}'s profile avatar`}
              className="relative w-24 h-24 rounded-full border-2 border-black bg-neutral-900 object-cover"
              loading="lazy"
            />
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-200 line-clamp-1 px-2 mb-4">
            {volunteer.name}
          </h3>

          {/* Structured Data Badges */}
          <div className="space-y-2 w-full max-w-[240px]">
            <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 shadow-sm">
              <MdEmail className="text-fuchsia-400 text-base shrink-0" />
              <span className="truncate text-left w-full">{volunteer.email}</span>
            </div>

            <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 shadow-sm">
              <MdLocationOn className="text-cyan-400 text-base shrink-0" />
              <span className="truncate text-left w-full">{volunteer.location || "Remote / Unspecified"}</span>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="w-full mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-center text-xs font-bold uppercase tracking-wider text-cyan-400 group-hover:text-fuchsia-400 transition-colors">
          Request Booking &rarr;
        </div>
      </div>
    </Link>
  );
}