// src/pages/BookVolunteer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdEmail,
  MdLocationOn,
  MdVolunteerActivism,
} from "react-icons/md";

// Neon gradients used per card for color variation
const gradients = [
  "from-[#2bc0e4] via-[#eaecc6] to-[#208ea2]",     // Aqua-neon
  "from-[#fc00ff] via-[#00dbde] to-[#194fa1]",     // Pink/blue magenta
  "from-[#f7971e] via-[#ffd200] to-[#f7971e]",     // Amber
  "from-[#21d4fd] via-[#b721ff] to-[#21d4fd]",     // Blue/violet
  "from-[#4776e6] via-[#8e54e9] to-[#4776e6]",     // Indigo-purple
  "from-[#ff6a00] via-[#252525] to-[#ee0979]",     // Orange/red with black
];

export default function BookVolunteer() {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/users/allvolunteer")
      .then((res) => {
        const vols = res.data.Volunteer || [];
        setVolunteers(vols);
        setFilteredVolunteers(vols);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    setFilteredVolunteers(
      volunteers.filter(
        (v) =>
          v.name?.toLowerCase().includes(term) ||
          v.location?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, volunteers]);

  return (
    <div className="min-h-screen w-full py-16 px-3 md:px-12 bg-gradient-to-br from-black via-[#16181a] to-[#1f2633]">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-indigo-500 text-center mb-10 drop-shadow-lg uppercase tracking-wider select-none">
        Meet Our Volunteers
      </h1>
      {/* Neon glass search bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-lg">
          <MdSearch className="absolute left-4 top-3.5 text-cyan-400 text-2xl pointer-events-none" />
          <input
            type="text"
            placeholder="Search name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full text-lg rounded-2xl border border-cyan-800 bg-gradient-to-r from-black/90 to-[#151a22]/95 text-cyan-100 placeholder-cyan-700 shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/70 backdrop-blur-lg transition"
            aria-label="Search volunteer"
          />
        </div>
      </div>

      {loading ? (
        <div className="w-full flex flex-col items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-fuchsia-400 mb-6" />
          <span className="text-cyan-400 text-lg font-bold">Loading volunteers…</span>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="text-center text-neutral-500 text-xl mt-12 font-semibold italic">No volunteers found.</div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredVolunteers.map((vol, idx) => (
            <VolunteerCard key={vol._id} volunteer={vol} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function VolunteerCard({ volunteer, idx }) {
  const gradient = gradients[idx % gradients.length];

  return (
    <Link
      to={`/bookingform/${volunteer._id}`}
      className={`relative rounded-3xl shadow-2xl p-0 pb-5 overflow-hidden bg-gradient-to-br ${gradient} border border-black/60 transition-transform duration-300 hover:scale-105 hover:shadow-cyan-400/60 group block`}
      style={{ minHeight: 380 }}
      title={`Book ${volunteer.name}`}
    >
      {/* Glassy effect, top overlay */}
      <div className="absolute left-4 top-4 z-10 bg-black/30 backdrop-blur-md px-4 py-1 rounded-full font-semibold text-xs text-cyan-100 uppercase tracking-wider">
        Volunteer
      </div>
      <div className="flex flex-col items-center pt-12 pb-2 relative z-10">
        <img
          src={volunteer.photo?.url || "https://i.pravatar.cc/192"}
          alt={volunteer.name}
          className="w-24 h-24 rounded-full border-4 border-cyan-300 shadow-neon bg-black object-cover mb-1"
        />
        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow select-none">{volunteer.name}</h3>
        <div className="flex items-center gap-2 bg-cyan-800/60 rounded-2xl px-3 py-1 mb-2 shadow text-cyan-200 text-sm font-bold">
          <MdVolunteerActivism />
          <span>{volunteer.role || "Volunteer"}</span>
        </div>
        <div className="flex items-center gap-2 text-fuchsia-200 bg-black/60 rounded-xl px-3 py-1 mb-1 text-sm shadow">
          <MdEmail size={18} />
          <span>{volunteer.email}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-200 bg-black/60 rounded-xl px-3 py-1 text-sm shadow">
          <MdLocationOn size={18} />
          <span>{volunteer.location}</span>
        </div>
      </div>
      {/* Neon bar at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-500 rounded-b-3xl" />
    </Link>
  );
}