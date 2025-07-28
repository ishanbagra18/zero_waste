// src/pages/Bookingform.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

// Status colors for chips
const statuses = ["pending", "accepted", "rejected", "cancelled", "completed"];
const statusColor = {
  pending: "bg-yellow-500 text-yellow-900",
  accepted: "bg-blue-500 text-blue-900",
  rejected: "bg-red-500 text-red-900",
  cancelled: "bg-gray-500 text-gray-900",
  completed: "bg-green-500 text-green-900",
};

export default function Bookingform() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!state || !state.booking) {
      console.warn("No booking data provided in route state");
      return;
    }
    setBooking(state.booking);
  }, [state]);

  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [token]);

  const updateStatus = async (newStatus) => {
    if (!booking?._id) {
      toast.error("Booking ID missing");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3002/api/book/${booking._id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Status updated to ${newStatus}`);
      setBooking((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Loading or missing booking
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-900 font-sans">
        <Toaster />
        <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md shadow-xl text-xl text-white font-semibold">
          No booking data provided.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#010314] via-[#19192b] via-80% to-[#34025f] relative font-sans overflow-hidden">
      <Toaster position="top-center" />
      {/* Animated colorful blurred background circles */}
      <div
        className="pointer-events-none select-none absolute -top-20 left-10 w-[550px] h-[550px] bg-gradient-to-br from-indigo-600 to-blue-700 opacity-40 blur-3xl rounded-full animate-pulse"
        aria-hidden
      />
      <div
        className="pointer-events-none select-none absolute bottom-0 right-0 w-[470px] h-[470px] bg-gradient-to-tr from-pink-500 to-purple-700 opacity-30 blur-3xl rounded-full animate-pulse delay-1000"
        aria-hidden
      />
      {/* Glassmorphic card */}
      <div className="relative z-10 w-full max-w-2xl mx-auto rounded-3xl shadow-2xl bg-white/10 border-[1.5px] border-white/25 backdrop-blur-xl px-10 py-14 flex flex-col items-center transition-all duration-300">
        {/* Heading */}
        <h1 className="text-[2.7rem] md:text-5xl text-center font-extrabold mb-10 tracking-tight text-white drop-shadow-lg whitespace-nowrap">
          <span className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-transparent bg-clip-text">
            Booking Details
          </span>
        </h1>

        {/* Booking info */}
        <div className="w-full space-y-6 px-2 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking ID */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-base text-slate-400 font-medium uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7V4a2 2 0 00-2-2H7a2 2 0 00-2 2v3"/>
                  <rect width="20" height="16" x="2" y="7" rx="2" fill="none" stroke="currentColor" />
                </svg>
                Booking ID
              </span>
              <div className="text-xl text-white select-all truncate bg-black/20 px-3 py-2 rounded-md">{booking._id}</div>
            </div>
            {/* NGO */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-base text-pink-300 font-medium uppercase tracking-widest">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">NGO</text></svg>
                NGO
              </span>
              <div className="text-xl text-pink-100 px-3 py-2 rounded-md bg-pink-900/20">{booking.ngo?.name || "N/A"}</div>
            </div>
            {/* Volunteer */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-base text-emerald-300 font-medium uppercase tracking-widest">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="9" fill="white">VOL</text></svg>
                Volunteer
              </span>
              <div className="text-xl text-emerald-100 px-3 py-2 rounded-md bg-emerald-900/20">
                {booking.volunteer?.name || booking.volunteer || "N/A"}
              </div>
            </div>
            {/* From Location */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-base text-sky-300 font-medium uppercase tracking-widest">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 7.25 7 13 7 13s7-5.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                From
              </span>
              <div className="text-xl text-sky-100 px-3 py-2 rounded-md bg-sky-900/20">{booking.fromLocation || "N/A"}</div>
            </div>
            {/* To Location */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-base text-indigo-300 font-medium uppercase tracking-widest">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m12 2 8 7v13H4V9l8-7zm0 2.3L6 9V20h12V9l-6-4.7z"/>
                </svg>
                To
              </span>
              <div className="text-xl text-indigo-100 px-3 py-2 rounded-md bg-indigo-900/20">{booking.toLocation || "N/A"}</div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-1">
            <span className="flex items-center gap-2 text-base text-slate-400 font-medium uppercase tracking-widest">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="16" x="2" y="4" rx="2" fill="none" stroke="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9h16" />
              </svg>
              Status
            </span>
            <span
              className={`inline-block px-5 py-2 mt-1 font-extrabold text-sm uppercase rounded-2xl shadow-md tracking-wider scale-105 border border-white/30 ${statusColor[booking.status] || "bg-gray-700 text-white"}`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        {/* Status update buttons */}
        <div className="mt-12 w-full flex flex-wrap gap-5 justify-center items-center">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              disabled={booking.status === s}
              className={`
                group relative px-6 py-2 rounded-2xl font-semibold tracking-wide text-base flex items-center gap-2 border
                transition-all duration-200 bg-gradient-to-tr
                ${
                  booking.status === s
                    ? "from-slate-500 to-slate-700 text-gray-200 border-gray-700 cursor-not-allowed opacity-50"
                    : "from-indigo-500 via-purple-600 to-fuchsia-600 text-white border-transparent hover:from-pink-600 hover:to-indigo-400 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/60"
                }
                shadow-lg
              `}
              style={{
                boxShadow: booking.status === s
                  ? undefined
                  : "0 2px 25px 2px rgba(120,105,255,0.18)",
              }}
            >
              <span>
                {/* Status icon based on state */}
                {s === "pending" && (
                  <svg className="w-4 h-4 text-yellow-200 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M12 8v4l3 3" strokeWidth="2" />
                  </svg>
                )}
                {s === "accepted" && (
                  <svg className="w-4 h-4 text-blue-100 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" />
                  </svg>
                )}
                {s === "rejected" && (
                  <svg className="w-4 h-4 text-red-200 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" />
                  </svg>
                )}
                {s === "cancelled" && (
                  <svg className="w-4 h-4 text-gray-200 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M8 12h8" strokeWidth="2" />
                  </svg>
                )}
                {s === "completed" && (
                  <svg className="w-4 h-4 text-green-200 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M9 12l2 2l4-4" strokeWidth="2" />
                  </svg>
                )}
              </span>
              <span className="capitalize">{s}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
