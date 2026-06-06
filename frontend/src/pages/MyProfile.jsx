import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  MdEdit, 
  MdLockReset, 
  MdRateReview, 
  MdEmail, 
  MdPhone, 
  MdBusiness, 
  MdLocationOn, 
  MdAccountCircle,
  MdRefresh
} from "react-icons/md";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const navigate = useNavigate();

  // Validate Token and Decrypt Payload
  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) throw new Error("Invalid token structure");
      
      const payload = JSON.parse(atob(base64Url));
      if (payload.userId) {
        setUserId(payload.userId);
      } else {
        throw new Error("Missing user payload data.");
      }
    } catch (err) {
      toast.error("Invalid session credentials.");
      localStorage.removeItem("token");
      setToken(null);
      setLoading(false);
    }
  }, [token]);

  // Fetch Profile Details
  const fetchProfile = async () => {
    if (!userId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:3002/api/users/myprofile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to sync profile information.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId, token]);

  // Loading State with Micro Spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-white">
        <div className="loader ease-linear rounded-full border-4 border-zinc-800 border-t-emerald-500 h-12 w-12"></div>
        <p className="text-emerald-400 mt-4 text-sm font-medium tracking-widest uppercase animate-pulse">
          Syncing profile data...
        </p>
        <style>{`
          .loader { animation: spin 0.8s linear infinite; }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error/Fallback State
  if (!user || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-white px-4 text-center">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-3xl mb-4">⚠️</div>
        <p className="text-zinc-300 text-xl font-semibold max-w-md mb-6">
          {error || "We couldn't retrieve your profile profile information."}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-5 py-2.5 rounded-xl transition font-medium border border-zinc-700 shadow-md"
          >
            <MdRefresh size={18} /> Retry Sync
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition font-medium shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-zinc-100 p-6 sm:p-12 lg:p-16 selection:bg-emerald-500/30 font-sans">
      <Toaster position="top-right" />
      
      {/* Inject custom animation keyframe dynamically */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.06] pb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-500 select-none">
              My Profile
            </h1>
            <p className="text-zinc-400 text-sm mt-1.5">Manage your digital account footprint and impact metrics.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/updateprofile")}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 text-white"
              aria-label="Update Profile"
            >
              <MdEdit size={16} /> Update Profile
            </button>
            <button
              onClick={() => navigate("/forgotpassword")}
              className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:scale-[0.98] px-4 py-2.5 rounded-xl font-bold text-sm transition-all text-zinc-300"
              aria-label="Forgot Password"
            >
              <MdLockReset size={18} /> Reset Password
            </button>
            <button
              onClick={() => navigate(`/allreview/${userId}`)}
              className="inline-flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 active:scale-[0.98] px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-950/40 text-white"
              aria-label="View All Reviews"
            >
              <MdRateReview size={16} /> View Reviews
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Summary Profile Widget Card */}
          <section className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-3xl p-8 flex flex-col items-center text-center shadow-xl">
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur opacity-15 group-hover:opacity-30 transition duration-500"></div>
              <img
                src={user.photo?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={`${user.name || 'User'}'s profile avatar`}
                className="relative w-40 h-40 rounded-full object-cover border-2 border-emerald-500/30 p-1 bg-black shadow-2xl"
                loading="lazy"
              />
            </div>
            
            <h2 className="text-2xl font-extrabold text-white capitalize tracking-wide max-w-full truncate px-2 mb-1">
              {user.name}
            </h2>
            <p className="text-xs uppercase tracking-widest text-emerald-400 font-black mb-8 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              {user.role === "vendor" ? "Vendor Partner" : "NGO Partner"}
            </p>

            {/* Platform Trust Badges */}
            <div className="space-y-3 w-full max-w-[260px]">
              <Badge
                icon="🏅"
                label="System Badge"
                value={user.badge || "No Tier Status"}
                bgGradient="from-purple-950/50 via-purple-900/30 to-zinc-900/50"
                textColor="text-purple-300"
                borderColor="border-purple-500/20"
                delay="0.1s"
              />
              <Badge
                icon="⭐"
                label="Community Rating"
                value={user.averageRating ? `${Number(user.averageRating).toFixed(1)} / 5.0` : "Unrated"}
                bgGradient="from-amber-950/50 via-amber-900/30 to-zinc-900/50"
                textColor="text-amber-300"
                borderColor="border-amber-500/20"
                delay="0.2s"
              />
            </div>
          </section>

          {/* Right Information Dashboard Workspace */}
          <section className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Core Registration Properties Metadata Sheet */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-xl">
              <h3 className="text-xl font-bold text-emerald-400 mb-6 border-b border-white/[0.06] pb-4 select-none">
                Account Directory Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm tracking-wide">
                <InfoItem label="Email Address" value={user.email} icon={<MdEmail />} />
                <InfoItem label="Phone Line" value={user.phone} icon={<MdPhone />} />
                <InfoItem label="Affiliated Organisation" value={user.organisation} icon={<MdBusiness />} />
                <InfoItem label="Base Location" value={user.location} icon={<MdLocationOn />} />
                <div className="sm:col-span-2">
                  <InfoItem label="Assigned Access Role" value={user.role} icon={<MdAccountCircle />} />
                </div>
              </div>
            </div>

            {/* Eco Callout Card */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900/50 to-black border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-4 sm:items-start text-center sm:text-left text-zinc-200">
              <span className="text-4xl shrink-0 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">🌱</span>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white tracking-wide">Making a Sustainable Impact</h4>
                <p className="text-sm leading-relaxed text-zinc-400 max-w-xl">
                  You’ve taken a proactive step toward systemic environmental changes by joining <strong>Zero Waste</strong>. 
                  Keep minimizing surplus disposal pipelines, reinforcing partner NGOs, and scaling green micro-alternatives.
                </p>
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
};

// Presentational Badge Element Component
const Badge = ({ icon, label, value, bgGradient, textColor, borderColor, delay }) => (
  <div
    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-gradient-to-br ${bgGradient} border ${borderColor} opacity-0 animate-fade-in-up shadow-inner`}
    style={{ animationDelay: delay }}
  >
    <span className="text-xl shrink-0" role="img" aria-hidden="true">{icon}</span>
    <div className="text-left min-w-0">
      <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{label}</p>
      <p className={`text-sm font-extrabold truncate ${textColor}`}>{value}</p>
    </div>
  </div>
);

// Presentational Grid Field Matrix Item
const InfoItem = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl shadow-inner min-w-0">
    <span className="text-zinc-500 text-xl mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <span className="text-zinc-500 uppercase tracking-widest font-bold text-[10px] block mb-0.5">{label}</span>
      <span className="break-words font-semibold text-zinc-200 text-sm">{value || "Not Set"}</span>
    </div>
  </div>
);

export default MyProfile;