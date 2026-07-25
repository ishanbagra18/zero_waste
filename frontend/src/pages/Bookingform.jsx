import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { MdLocationOn, MdOutlineNotes, MdSend, MdVolunteerActivism, MdChecklist, MdShield, MdInfoOutline } from "react-icons/md";

export default function Bookingform() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log("📌 [BookingForm] Volunteer ID from route param:", id);
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to book a volunteer.");
      return;
    }

    if (!id) {
      toast.error("Volunteer ID is missing.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        `http://localhost:3002/api/book/bookvolunteer/${id}`,
        { fromLocation, toLocation, notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Booking success:", res.data);
      toast.success("Volunteer booked successfully!");
      navigate("/ngo/dashboard");
    } catch (err) {
      console.error("❌ Booking error:", err.response || err.message);
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-cyan-950 text-white px-4 py-10">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="rounded-3xl border border-cyan-500/20 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-4 text-cyan-300">
            <MdVolunteerActivism size={28} />
            <span className="text-sm uppercase tracking-[0.35em] font-semibold">Volunteer Booking</span>
          </div>

          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Schedule transport support in a few steps
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8 max-w-xl">
            Use this form to assign a volunteer for pickup and drop-off. After the booking is sent, the volunteer gets a booking notification, then the item flow continues through pickup confirmation and OTP verification.
          </p>

          <form onSubmit={handleBooking} className="space-y-5">
            <div className="flex items-center gap-4 bg-slate-900/70 p-4 rounded-2xl border border-cyan-700/40 focus-within:border-cyan-400 transition-all duration-300">
              <MdLocationOn className="text-3xl text-cyan-400" />
              <input
                type="text"
                placeholder="From Location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                required
                className="bg-transparent placeholder-cyan-500 outline-none w-full text-base md:text-lg font-medium text-cyan-100"
              />
            </div>

            <div className="flex items-center gap-4 bg-slate-900/70 p-4 rounded-2xl border border-cyan-700/40 focus-within:border-cyan-400 transition-all duration-300">
              <MdLocationOn className="text-3xl text-cyan-400" />
              <input
                type="text"
                placeholder="To Location"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                required
                className="bg-transparent placeholder-cyan-500 outline-none w-full text-base md:text-lg font-medium text-cyan-100"
              />
            </div>

            <div className="flex items-center gap-4 bg-slate-900/70 p-4 rounded-2xl border border-cyan-700/40 focus-within:border-cyan-400 transition-all duration-300">
              <MdOutlineNotes className="text-3xl text-cyan-400" />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-transparent placeholder-cyan-500 outline-none w-full text-base md:text-lg font-medium text-cyan-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-extrabold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-cyan-400/40 transition-all duration-300"
            >
              <MdSend className="text-2xl" />
              {submitting ? "Booking..." : "Book Volunteer"}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-cyan-100/80">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1">
              <MdChecklist /> Volunteer notified
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              <MdShield /> OTP flow stays secure
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 shadow-2xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-cyan-200">How it works</h3>
          <div className="space-y-4 text-gray-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white mb-1">1. NGO books a volunteer</p>
              <p>The volunteer receives a booking notification in their dashboard.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white mb-1">2. Volunteer confirms pickup</p>
              <p>The volunteer dashboard lets them confirm pickup for the assigned item or transport job.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white mb-1">3. NGO verifies OTP</p>
              <p>The OTP is sent to the NGO notification flow and delivery is completed only after verification.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/ngo/dashboard")}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-cyan-100 hover:bg-cyan-500/20 transition"
          >
            <MdInfoOutline size={20} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
