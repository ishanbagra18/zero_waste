// src/pages/BookVolunteer.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdEmail,
  MdLocationOn,
  MdVolunteerActivism,
} from "react-icons/md";
import api from "../util/api";

const gradients = [
  "from-[#2bc0e4] via-[#eaecc6] to-[#208ea2]",
  "from-[#fc00ff] via-[#00dbde] to-[#194fa1]",
  "from-[#f7971e] via-[#ffd200] to-[#f7971e]",
  "from-[#21d4fd] via-[#b721ff] to-[#21d4fd]",
  "from-[#4776e6] via-[#8e54e9] to-[#4776e6]",
  "from-[#ff6a00] via-[#252525] to-[#ee0979]",
];

export default function BookVolunteer() {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api
      .get("/api/users/allvolunteer")
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
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-indigo-500 text-center mb-10 drop-shadow-2xl uppercase tracking-wider select-none">
        Meet Our Volunteers
      </h1>
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-lg">
          <MdSearch className="absolute left-4 top-3.5 text-cyan-400 text-2xl pointer-events-none" />
          <input
            type="text"
            placeholder="Search name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full text-lg rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-r from-black/90 to-[#151a22]/95 text-cyan-100 placeholder-cyan-400/80 shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/90 backdrop-blur-lg transition duration-200"
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
        <div className="flex flex-col gap-12 max-w-5xl mx-auto">
          {filteredVolunteers.map((vol, idx) => (
            <VolunteerCard key={vol._id} volunteer={vol} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function VolunteerCard({ volunteer, idx }) {
  const navigate = useNavigate();
  const gradient = gradients[idx % gradients.length];

  const handleReviewClick = (e) => {
    e.preventDefault();
    navigate(`/review/${volunteer._id}`);
  };

  return (
    <div className="relative flex items-center md:flex-row flex-col w-full min-h-[220px] group transition-all duration-400">
      {/* Background accent shape */}
      <div
        className={`absolute -left-10 top-1/3 -translate-y-1/2 w-56 h-56 rounded-full blur-2xl opacity-20 z-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-30 ${gradient}`}
      ></div>
      {/* Main Card glass surface */}
      <Link
        to={`/bookingform/${volunteer._id}`}
        className={`flex flex-1 min-w-0 rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-bl from-white/10 via-black/40 to-[#181f31]/90 border border-cyan-300/10 relative z-10
          transition transform hover:scale-[1.025] hover:shadow-fuchsia-300/40`}
        title={`Book ${volunteer.name}`}
      >
        {/* Avatar piece */}
        <div className="relative flex items-center px-6">
          <div className="relative z-10">
            <img
              src={volunteer.photo?.url || "https://i.pravatar.cc/192"}
              alt={volunteer.name}
              className="w-28 h-28 rounded-full border-4 border-fuchsia-400/70 shadow-2xl shadow-cyan-400/30 bg-black object-cover ring-2 ring-fuchsia-500/60 transition shadow-lg -ml-8 -mt-8 md:ml-0 md:mt-0"
              draggable={false}
              style={{ boxShadow: "0 8px 50px 6px rgba(24,255,255,0.10)" }}
            />
            {/* Floating badge */}
            <span className="animate-pulse absolute -bottom-2 -right-2 shadow-xl flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-400 to-cyan-500 w-9 h-9 border-2 border-black/80 text-white text-lg shadow-md">
              <MdVolunteerActivism size={22} />
            </span>
          </div>
        </div>
        {/* Card Content */}
        <div className="flex-1 px-3 md:px-6 py-7 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-2xl font-extrabold text-white leading-tight drop-shadow select-none mb-1 tracking-wider">
              {volunteer.name}
            </h3>
            <div className="flex gap-3 flex-wrap mt-2">
              <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-xl bg-gradient-to-r from-cyan-700/90 to-fuchsia-700/70 text-cyan-100 font-bold shadow border border-cyan-400/20">
                <MdVolunteerActivism size={16} /> {volunteer.role || "Volunteer"}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-xl bg-black/60 text-fuchsia-200 font-semibold border border-fuchsia-400/20 shadow">
                <MdEmail size={15} /> {volunteer.email}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-xl bg-[#12263f]/80 text-cyan-200 border border-cyan-200/20">
                <MdLocationOn size={15} /> {volunteer.location}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-xl bg-gradient-to-tr from-indigo-700/60 via-[#246ca7]/70 to-cyan-900/50 text-indigo-50 border border-cyan-400/20">
                <MdLocationOn size={15} /> {volunteer.badge}
              </span>
            </div>
          </div>
          {/* Button */}
          <div className="w-full flex justify-end mt-8">
            <button
              onClick={handleReviewClick}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 via-fuchsia-500 to-cyan-700 hover:from-cyan-600 hover:to-fuchsia-800 text-white text-sm font-bold shadow-lg shadow-fuchsia-400/20 transition-all duration-200 border border-cyan-300/30 outline-none focus:ring-2 focus:ring-fuchsia-300/50"
            >
              Review
            </button>
          </div>
        </div>
        {/* Vibrant side strip */}
        <div className="w-2 hidden md:block bg-gradient-to-b from-fuchsia-400 via-cyan-300 to-indigo-400 rounded-tr-2xl rounded-br-2xl opacity-90"></div>
      </Link>
    </div>
  );
}
