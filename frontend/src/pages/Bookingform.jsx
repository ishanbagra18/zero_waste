import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const statuses = ["pending", "accepted", "rejected", "cancelled", "completed"];

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

    console.log("Booking state received:", state.booking);
    setBooking(state.booking);
  }, [state]);

  useEffect(() => {
    if (!token) {
      console.error("No token found in localStorage. Redirecting to login.");
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [token]);

  const updateStatus = async (newStatus) => {
    if (!booking?._id) {
      console.error("Booking ID not available");
      toast.error("Cannot update status. Booking ID missing.");
      return;
    }

    try {
      console.log(`Attempting to update status to '${newStatus}' for booking:`, booking._id);

      const res = await axios.patch(
        `http://localhost:3002/api/bookings/${booking._id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Status update successful:", res.data);
      toast.success(`Status updated to ${newStatus}`);
      setBooking((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Error while updating status:", err.response?.data || err.message);
      toast.error("Failed to update status");
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <Toaster />
        <p className="text-lg">No booking data provided.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <Toaster />
      <h1 className="text-4xl font-bold mb-6">Booking Details</h1>

      <div className="bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg">
        <p><strong>Booking ID:</strong> {booking._id}</p>
        <p><strong>NGO:</strong> {booking.ngo?.name || "N/A"}</p>
        <p><strong>Volunteer:</strong> {booking.volunteer?.name || booking.volunteer}</p>
        <p><strong>From:</strong> {booking.fromLocation || "N/A"}</p>
        <p><strong>To:</strong> {booking.toLocation || "N/A"}</p>
        <p><strong>Status:</strong> {booking.status}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            className={`px-4 py-2 rounded text-white font-semibold transition-all ${
              booking.status === s
                ? "bg-green-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={booking.status === s}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
