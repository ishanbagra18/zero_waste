import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdLocationOn, MdOutlineNotes, MdSend } from "react-icons/md";

export default function Bookingform() {
  const { id } = useParams();

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [notes, setNotes] = useState("");

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

    try {
      console.log("📤 Sending booking data to backend:", {
        fromLocation,
        toLocation,
        notes,
      });

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
    } catch (err) {
      console.error("❌ Booking error:", err.response || err.message);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="max-w-xl w-full p-10 bg-[#0d1117] rounded-3xl border border-cyan-800 shadow-[0_0_30px_#06b6d4] text-cyan-100 font-sans">
        <h2 className="text-center text-4xl font-extrabold mb-10 text-cyan-400 tracking-wider drop-shadow-md">
          Book Volunteer
        </h2>
        <form onSubmit={handleBooking} className="space-y-6">
          <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-xl border border-cyan-700 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
            <MdLocationOn className="text-3xl text-cyan-400" />
            <input
              type="text"
              placeholder="From Location"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              required
              className="bg-transparent placeholder-cyan-500 outline-none w-full text-lg font-medium text-cyan-100"
            />
          </div>

          <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-xl border border-cyan-700 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
            <MdLocationOn className="text-3xl text-cyan-400" />
            <input
              type="text"
              placeholder="To Location"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              required
              className="bg-transparent placeholder-cyan-500 outline-none w-full text-lg font-medium text-cyan-100"
            />
          </div>

          <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-xl border border-cyan-700 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
            <MdOutlineNotes className="text-3xl text-cyan-400" />
            <input
              type="text"
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-transparent placeholder-cyan-500 outline-none w-full text-lg font-medium text-cyan-100"
            />
          </div>

          <button
            type="submit"
            className="flex justify-center items-center gap-3 bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-gray-900 font-bold text-lg px-8 py-3 rounded-full shadow-md hover:shadow-cyan-500/40 transition-all duration-300"
          >
            <MdSend className="text-2xl" />
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
