import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const AllBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        toast.error("You must be logged in to view bookings.");
        navigate("/");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          "http://localhost:3002/api/book/allbooking",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setBookings(res.data.bookings || res.data);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch bookings.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-gray-100 p-8 font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 text-transparent bg-clip-text tracking-widest">
          All Bookings
        </h1>

        {loading && (
          <p className="text-center text-gray-400 text-lg animate-pulse">
            Loading bookings...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold text-lg mb-6">
            {error}
          </p>
        )}

        {!loading && !error && bookings.length === 0 && (
          <p className="text-center text-gray-400 text-lg italic">
            No bookings found.
          </p>
        )}

        {!loading && !error && bookings.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                onClick={() =>
                  navigate(`/booking/${booking._id}`, { state: { booking } })
                }
                className="cursor-pointer bg-gradient-to-tr from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 p-7 hover:scale-[1.03] transition-transform duration-300"
              >
                <h2 className="text-2xl font-bold mb-5 text-indigo-400 tracking-wide border-b border-indigo-600 pb-2">
                  Booking ID:{" "}
                  <span className="text-gray-200 font-mono text-base break-words">
                    {booking._id}
                  </span>
                </h2>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">
                    NGO Details:
                  </h3>
                  <p>
                    <span className="font-semibold text-indigo-300">Name:</span>{" "}
                    {booking.ngo?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">Email:</span>{" "}
                    <a
                      href={`mailto:${booking.ngo?.email}`}
                      className="hover:underline text-indigo-400"
                    >
                      {booking.ngo?.email || "N/A"}
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">Organisation:</span>{" "}
                    {booking.ngo?.organisation || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">Location:</span>{" "}
                    {booking.ngo?.location || "N/A"}
                  </p>
                </div>

                <div className="space-y-2 text-gray-300 mb-5">
                  <p>
                    <span className="font-semibold text-indigo-300">Volunteer ID:</span>{" "}
                    {booking.volunteer || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">From Location:</span>{" "}
                    {booking.fromLocation || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">To Location:</span>{" "}
                    {booking.toLocation || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">Notes:</span>{" "}
                    {booking.notes || "None"}
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">Status:</span>{" "}
                    <span
                      className={`font-bold ${
                        booking.status?.toLowerCase() === "confirmed"
                          ? "text-green-400"
                          : booking.status?.toLowerCase() === "pending"
                          ? "text-yellow-400"
                          : booking.status?.toLowerCase() === "cancelled"
                          ? "text-red-400"
                          : "text-gray-300"
                      }`}
                    >
                      {booking.status || "Unknown"}
                    </span>
                  </p>
                </div>

                <p className="text-gray-400 text-sm italic">
                  Created At:{" "}
                  {new Date(booking.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllBookingsPage;
