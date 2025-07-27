import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.userId) {
        setUserId(payload.userId);
      }
    } catch (err) {
      toast.error("Invalid token. Please log in again.");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3002/api/users/myprofile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data.user);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-700 border-t-green-500 h-16 w-16"></div>
        <p className="text-green-400 ml-4 text-lg font-semibold">Loading...</p>
        <style>{`
          .loader {
            animation: spin 1.2s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <p className="text-red-500 text-xl font-semibold">User not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 sm:p-16">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 select-none mb-6 sm:mb-0">
          My Profile
        </h1>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/updateprofile")}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg font-semibold transition shadow-lg text-white"
            aria-label="Update Profile"
          >
            ✏️ Update Profile
          </button>
          <button
            onClick={() => navigate("/forgotpassword")}
            className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-5 py-3 rounded-lg font-semibold transition shadow-lg text-white"
            aria-label="Forgot Password"
          >
            🔑 Forgot Password
          </button>
          <button
            onClick={() => navigate(`/allreview/${userId}`)}
            className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 px-5 py-3 rounded-lg font-semibold transition shadow-lg text-white"
            aria-label="View All Reviews"
          >
            📋 View All Reviews
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* Left side - Profile Summary */}
        <section className="bg-white/5 border border-white/20 rounded-3xl shadow-xl p-10 flex flex-col items-center text-center select-none">
          <img
            src={
              user.photo?.url ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={`${user.name}'s profile`}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-green-400 shadow-2xl mb-6"
            loading="lazy"
          />
          <h2 className="text-4xl font-extrabold text-green-300 capitalize mb-1 truncate">
            {user.name}
          </h2>
          <p className="text-lg text-green-400 font-semibold mb-6">
            {user.role === "vendor" ? "Vendor Partner" : "NGO Partner"}
          </p>

          {/* Badges & Rating */}
          <div className="space-y-4 w-full max-w-xs mx-auto">
            <Badge
              icon="🏅"
              label="Badge"
              value={user.badge || "N/A"}
              bgGradient="from-purple-700 to-purple-900"
              textColor="text-purple-200"
              shadow="shadow-purple-900"
            />
            <Badge
              icon="⭐"
              label="Rating"
              value={`${user.averageRating || 0}/5`}
              bgGradient="from-yellow-600 to-amber-700"
              textColor="text-yellow-100"
              shadow="shadow-yellow-700"
            />
          </div>
        </section>

        {/* Right side - Details and Message */}
        <section className="lg:col-span-2 flex flex-col gap-10">
          {/* Bio & Other Details */}
          <div className="bg-white/5 border border-white/20 rounded-3xl shadow-lg p-10 text-gray-300">
            <h3 className="text-3xl font-bold text-green-400 mb-8 select-none">
              Bio & Other Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-lg tracking-wide">
              {[
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
                { label: "Organisation", value: user.organisation || "—" },
                { label: "Location", value: user.location || "—" },
                { label: "Role", value: user.role?.toString() || "—" },
              ].map(({ label, value }) => (
                <InfoItem key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          {/* Impact message */}
          <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border border-green-700 rounded-3xl p-8 shadow-lg flex flex-col items-center text-center text-green-100 max-w-4xl mx-auto select-none">
            <h4 className="text-2xl font-extrabold mb-3">🌱 Making an Impact</h4>
            <p className="max-w-xl leading-relaxed">
              You’ve taken a strong step toward sustainability by joining Zero Waste.
              Keep donating surplus, supporting NGOs, and reducing environmental impact.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

// Badge component
const Badge = ({ icon, label, value, bgGradient, textColor, shadow }) => (
  <div
    className={`flex items-center gap-3 px-6 py-3 rounded-full ${bgGradient} shadow-lg ${shadow} animate-fade-in`}
    style={{ animationDelay: "0.15s" }}
  >
    <span className="text-2xl">{icon}</span>
    <span className={`text-sm font-semibold tracking-wide ${textColor}`}>
      {label}: <span className="font-bold">{value}</span>
    </span>
  </div>
);

// Info item for details grid
const InfoItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-gray-500 uppercase tracking-wider text-xs">{label}</p>
    <p className="break-words">{value}</p>
  </div>
);

export default MyProfile;
