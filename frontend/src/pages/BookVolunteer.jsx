import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  MapPin,
  HeartHandshake,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building2,
  Clock,
} from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

export default function BookVolunteer() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVolunteers = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/users/allvolunteer`)
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

  const cleanSearchTerm = searchTerm.trim().toLowerCase();
  const filteredVolunteers = volunteers.filter((v) => {
    return (
      v.name?.toLowerCase().includes(cleanSearchTerm) ||
      v.location?.toLowerCase().includes(cleanSearchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      {/* Hero Section */}
      <ParallaxHero
        badgeText="Volunteer Logistics Network"
        title={
          <>
            Book Active <span className="text-emerald-400">Logistics Volunteers</span>
          </>
        }
        subtitle="Connect with dedicated regional volunteers for food pickup, freight transportation, and community distribution support."
        actionButtons={
          <button
            onClick={() => navigate("/ngo/dashboard")}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition shadow-lg"
          >
            Back to NGO Dashboard
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Search Bar */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-xl flex items-center justify-center max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search volunteer by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800 max-w-md mx-auto space-y-3">
            <p className="text-sm font-semibold text-rose-400">{error}</p>
            <button
              onClick={fetchVolunteers}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Directory Search
            </button>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm italic">
            No volunteers match your search term "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((vol, idx) => (
              <VolunteerCard key={vol._id} volunteer={vol} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VolunteerCard({ volunteer, idx }) {
  return (
    <Link
      to={`/bookingform/${volunteer._id}`}
      className="group block rounded-3xl p-6 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 backdrop-blur-xl transition-all duration-300 shadow-xl hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Header Tag */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {volunteer.role || "Volunteer"}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available
          </div>
        </div>

        {/* Avatar & Info */}
        <div className="flex items-center gap-4">
          <img
            src={volunteer.photo?.url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`}
            alt={volunteer.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-700 bg-slate-950 shrink-0 group-hover:scale-105 transition-transform"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
            }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
              {volunteer.name}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 truncate mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {volunteer.location || "Regional Station"}
            </p>
          </div>
        </div>

        {/* Contact Info Box */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate">{volunteer.email}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
        <span>Request Freight Booking</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}