import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import {
  PackageCheck,
  Handshake,
  PackageX,
  Layers,
  Bell,
  Plus,
  ClipboardList,
  User,
  LogOut,
  Edit3,
  Trash2,
  MapPin,
  ChevronDown,
  Building2,
  PieChart as ChartIcon,
  AlertTriangle
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VendorDashboard = () => {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const NOTIFICATION_API = "http://localhost:3002/api/notifications/notification";

  const fetchNotifications = async () => {
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }
    try {
      const res = await axios.get(NOTIFICATION_API, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNotifications(res.data.notifications || []);
    } catch (error) {
      toast.error("Failed to load notifications");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchMyItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3002/api/items/my-items", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 100 },
        });
        if (Array.isArray(res.data.items)) {
          setItems(res.data.items);
        } else {
          toast.error("Invalid response format.");
          setItems([]);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
    fetchNotifications();
  }, [token]);

  const confirmDelete = (id) => {
    setDeleteItemId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:3002/api/items/delete-item/${deleteItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item._id !== deleteItemId));
      toast.success("Item deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    } finally {
      setShowConfirmModal(false);
      setDeleteItemId(null);
    }
  };

  const handlebutton = () => {
    navigate("/allngos");
  };

  const handlereadmore = () => {
    navigate("/readmore");
  };

  const handlelogout = async () => {
    try {
      await axios.get("http://localhost:3002/api/users/logout", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.clear();
      toast.success("Logout successful!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const visibleItems = items.slice(0, visibleCount);
  const loadMoreItems = () => setVisibleCount((prev) => prev + 5);

  // Stats Aggregations
  const totalItems = items.length;
  const claimedItems = items.filter((item) => item.status === "claimed").length;
  const unclaimedItems = items.filter((item) => item.status !== "claimed").length;
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const pieData = [
    { name: "Claimed Items", value: claimedItems },
    { name: "Unclaimed Items", value: unclaimedItems },
  ].filter(data => data.value > 0);

  const COLORS = ["#facc15", "#10b981"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f111a] to-zinc-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30">
      <Toaster position="top-right" />

      {/* Navbar Container */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.06] px-6 lg:px-12 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-hidden="true">🌱</span>
          <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 select-none">
            ZERO WASTE
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
          <Link to="/vendor/createitem" className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-950/30">
            <Plus size={16} /> <span className="hidden md:inline">Create Item</span>
          </Link>
          <Link to="/vendor/allitems" className="text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-1.5">
            <ClipboardList size={16} /> <span className="hidden md:inline">All Items</span>
          </Link>
          <Link to="/myprofile" className="text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-1.5">
            <User size={16} /> <span className="hidden md:inline">Profile</span>
          </Link>

          <Link to="/notifications" className="relative p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition" aria-label="Notifications">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full ring-2 ring-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          <button
            onClick={handlelogout}
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3.5 py-2 rounded-xl transition text-rose-400 font-bold"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Responsive Hero Banner Space */}
      <section
        className="relative min-h-[50vh] lg:min-h-[60vh] flex items-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.75), rgba(15, 17, 26, 1)), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200')" }}
      >
        <div className="max-w-4xl mx-auto text-center px-6 space-y-5">
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
            Supplier Operations Portal
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Give Waste a Second Chance
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Empowering vendors to transform surplus inventory into meaningful contributions, fostering community well-being and driving a zero-waste future.
          </p>
          <div className="flex gap-4 justify-center pt-2">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-950/40 transition">
              Let&apos;s Talk 💬
            </button>
            <button
              onClick={handlereadmore}
              className="border border-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl hover:bg-white/5 transition"
            >
              Read More
            </button>
          </div>
        </div>
      </section>

      {/* Active Inventory Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              📦 My Listed Items
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Track, update, and manage your current ecological surplus items below.
            </p>
          </div>
        </header>

        {/* Loading / Cards Grid Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/[0.04] rounded-3xl p-5 h-80 animate-pulse space-y-4">
                <div className="bg-slate-800 rounded-xl h-40 w-full" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleItems.map((item) => (
              <div
                key={item._id}
                className="group bg-slate-900/40 backdrop-blur-sm border border-white/[0.06] p-4 rounded-3xl shadow-xl hover:border-emerald-500/30 hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden aspect-video w-full mb-4 border border-white/[0.04] bg-slate-950">
                    <img
                      src={item.itemImage?.url || "https://via.placeholder.com/300"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-2 right-2 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md ${item.status === "claimed"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 px-1">
                    <h3 className="text-lg font-bold text-slate-100 truncate" title={item.name}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]" title={item.description || "No description provided"}>
                      {item.description || "No description provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.04] space-y-2 text-[11px] text-slate-300 px-1">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <MapPin size={12} className="shrink-0 text-emerald-400" />
                    <span>{item.location || "Unknown Location"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-400 bg-white/[0.01] p-2 rounded-xl border border-white/[0.02]">
                    <div>Qty: <span className="font-bold text-slate-200">{item.quantity || 0}</span></div>
                    <div className="truncate">Type: <span className="font-bold text-slate-200">{item.category}</span></div>
                    <div className="col-span-2 truncate">Mode: <span className="font-bold text-slate-200">{item.mode}</span></div>
                  </div>

                  {item.claimStatus && (
                    <div className="text-[10px] bg-slate-950/60 border border-white/[0.04] px-2 py-1 rounded-md w-fit italic text-slate-400">
                      Pipeline Phase: {item.claimStatus}
                    </div>
                  )}

                  <div className="mt-4 pt-2 flex gap-2">
                    <Link
                      to={`/vendor/updateitem/${item._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-white/[0.04] hover:bg-emerald-600 border border-white/[0.08] hover:border-emerald-500 text-slate-200 hover:text-white text-xs font-semibold py-2 rounded-xl transition"
                    >
                      <Edit3 size={12} /> Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(item._id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-white/[0.02] hover:bg-rose-950/40 border border-white/[0.06] hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-semibold py-2 rounded-xl transition"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/20 border border-white/[0.04] border-dashed rounded-3xl space-y-3">
            <span className="text-3xl block">📦</span>
            <p className="text-sm font-medium text-slate-500 italic">No operational assets logged on your matrix yet.</p>
          </div>
        )}

        {/* Load More Trigger Control */}
        {visibleCount < items.length && (
          <div className="text-center pt-6">
            <button
              onClick={loadMoreItems}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md"
            >
              Load More Pipelines <ChevronDown size={14} />
            </button>
          </div>
        )}
      </main>

      {/* Analytical Aggregate Block Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.05]">
        <header className="text-center space-y-2 mb-12">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Operational Activity Overview
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Live balance sheets generated from your ecosystem supply interactions.
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={PackageCheck} value={totalItems} label="Total Items Listed" accentClass="text-emerald-400" borderClass="hover:border-emerald-500/20" />
          <StatCard icon={Handshake} value={claimedItems} label="Claimed Items" accentClass="text-amber-400" borderClass="hover:border-amber-500/20" />
          <StatCard icon={PackageX} value={unclaimedItems} label="Unclaimed Items" accentClass="text-blue-400" borderClass="hover:border-blue-500/20" />
          <StatCard icon={Layers} value={totalQuantity} label="Total Unit Volume" accentClass="text-pink-400" borderClass="hover:border-pink-500/20" />
        </div>
      </section>

      {/* Interactive Distribution Graphics & NGO Directory Route */}
      <section className="bg-slate-900/30 border-t border-white/[0.05] py-20 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto rounded-3xl mb-12">

        {/* Module Area: NGO Directory Router Card */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-start space-y-6 hover:border-emerald-500/30 transition duration-300 relative group overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
          <div className="space-y-3">
            <span className="bg-emerald-500/10 text-emerald-400 p-3.5 rounded-2xl inline-block border border-emerald-500/10">
              <Building2 size={24} />
            </span>
            <h3 className="text-2xl font-extrabold text-white">Collaborating NGO Network</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Query verified regional non-profit structures logged onto the zero-waste framework. Match your logistics capability with active demand networks to maximize asset delivery speed.
            </p>
          </div>
          <button
            onClick={handlebutton}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-950/20"
          >
            View All Partner NGOs →
          </button>
        </div>

        {/* Module Area: Distribution Chart Graphic Visualizer */}
        <div className="bg-slate-950 border border-white/[0.06] p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[340px]">
          <h4 className="text-sm font-bold tracking-wide text-slate-400 flex items-center gap-2 mb-4">
            <ChartIcon size={16} className="text-amber-400" /> Pipeline Claims Stratification
          </h4>

          {pieData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs italic space-y-2">
              <span>📊</span>
              <p>Insufficient inventory data elements mapped to compile live chart visuals.</p>
            </div>
          ) : (
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    outerRadius={75}
                    innerRadius={50}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#020617" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderRadius: "12px", borderColor: "rgba(255,255,255,0.08)" }} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Action Dialog Modal overlay */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 border border-white/[0.08] p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4">
            <div className="mx-auto bg-rose-500/10 text-rose-400 p-3 rounded-full w-fit">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Destructive Action Warning</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you absolutely sure you want to scrub this listing? Erased data parameters cannot be recovered by management pipelines.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition"
              >
                Yes, Delete Item
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

// Static Presentation Layer Sub-Component For Analytics Displays
const StatCard = ({ icon: Icon, value, label, accentClass, borderClass }) => (
  <div className={`bg-slate-900/40 backdrop-blur-sm border border-white/[0.04] p-5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between min-h-[125px] ${borderClass}`}>
    <span className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl w-fit inline-block text-slate-400">
      <Icon size={18} className={accentClass} />
    </span>
    <div className="mt-4">
      <span className={`text-2xl sm:text-3xl font-black block tracking-tight ${accentClass}`}>{value}</span>
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">{label}</span>
    </div>
  </div>
);

export default VendorDashboard;