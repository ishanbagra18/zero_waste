import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import { Bell } from "lucide-react";
import { 
  ShoppingBag, 
  User, 
  ClipboardCheck, 
  LogOut, 
} from 'lucide-react';


import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


import {
  FaLeaf,
  FaUsers,
  FaLightbulb,
  FaBoxOpen,
  FaHourglassHalf,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";



const NgoDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [claimedItems, setClaimedItems] = useState([]);
    const [notifications, setNotifications] = useState([]);



   const NOTIFICATION_API = "http://localhost:3002/api/notifications/notification";

    const unreadCount = notifications.filter(n => !n.isRead).length;




  useEffect(() => {
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
        console.log("✅ Notifications fetched:", res.data.notifications);
        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      }
    };

    const fetchMyClaimed = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/items/get-claimed-items", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setClaimedItems(res.data.claimedItems || []);
      } catch (error) {
        toast.error("Failed to fetch claimed items");
        console.error(error);
      }
    };

    fetchMyClaimed();
    fetchNotifications();
  }, [token, NOTIFICATION_API]);



   const handleRedirect = () => {
    navigate('/allvendors');
  };











  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3002/api/users/logout", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.clear();
      toast.success("Logout successfully");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const totalClaims = claimedItems.length;
  const pending = claimedItems.filter((item) => item.claimStatus === "pending").length;
  const approved = claimedItems.filter((item) => item.claimStatus === "approved").length;
  const assigned = claimedItems.filter((item) => item.deliveryStatus === "volunteer_assigned").length;
  const pickupConfirmed = claimedItems.filter((item) => item.deliveryStatus === "pickup_confirmed").length;
  const delivered = claimedItems.filter(
    (item) => item.deliveryStatus === "delivered" || item.claimStatus === "collected"
  ).length;
  const impactScore = delivered * 10 + pickupConfirmed * 5 + assigned * 2;



  const pieData = [
  { name: "Pending", value: pending },
  { name: "Approved", value: approved },
  { name: "Delivered", value: delivered },
];

const COLORS = ["#10b981", "#6366f1", "#f43f5e"];


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1c] via-[#111827] to-[#1f2937] text-white">
      <Toaster />

      {/* Navbar */}
<nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.06] px-6 lg:px-12 py-4 flex items-center justify-between shadow-lg shadow-black/20">
  
  {/* Branding Block */}
  <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
    <span className="text-2xl transition-transform group-hover:scale-110" role="img" aria-hidden="true">🌱</span>
    <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 select-none">
      ZERO WASTE
    </h1>
  </Link>

  {/* Functional Navigation Action Hub */}
  <div className="flex items-center gap-2 sm:gap-3 font-semibold text-xs sm:text-sm">
    
    {/* Link: All Items */}
    <Link 
      to="/vendor/allitems" 
      className="text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/[0.03] transition-all flex items-center gap-1.5 focus:outline-none focus:bg-white/5"
    >
      <ShoppingBag size={15} className="text-slate-400" />
      <span className="hidden md:inline">All Items</span>
    </Link>

    {/* Link: My Profile */}
    <Link 
      to="/myprofile" 
      className="text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/[0.03] transition-all flex items-center gap-1.5 focus:outline-none focus:bg-white/5"
    >
      <User size={15} className="text-slate-400" />
      <span className="hidden md:inline">My Profile</span>
    </Link>

    {/* Link: My Claim */}
    <Link 
      to="/ngo/myclaimed" 
      className="text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/[0.03] transition-all flex items-center gap-1.5 focus:outline-none focus:bg-white/5"
    >
      <ClipboardCheck size={15} className="text-slate-400" />
      <span className="hidden md:inline">My Claim</span>
    </Link>

    {/* Separator Divider Line */}
    <span className="h-5 w-[1px] bg-white/[0.08] mx-1 hidden sm:block" aria-hidden="true" />

    {/* Link Button: Notifications Control */}
  <Link 
  to="/notifications" 
  className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 flex items-center justify-center"
  aria-label={`${unreadCount || 0} unread notifications`}
>
  <Bell size={20} />
  
  {unreadCount > 0 && (
    <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center rounded-full ring-2 ring-slate-950 animate-pulse select-none">
      {unreadCount}
    </span>
  )}
</Link>

    {/* Action: Logout Trigger */}
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 focus:border-zinc-700 px-3.5 py-2 rounded-xl transition-all text-rose-400 font-bold focus:outline-none active:scale-[0.98]"
      type="button"
    >
      <LogOut size={14} />
      <span className="hidden sm:inline">Logout</span>
    </button>

  </div>
</nav>


      {/* Hero Section */}
     {/* 🌟 Cinematic Welcome Landing Banner */}
<section 
  className="w-full min-h-[75vh] sm:min-h-[85vh] bg-cover bg-center relative flex items-center overflow-hidden border-b border-white/[0.04]"
  style={{
    backgroundImage: "url('https://i.pinimg.com/1200x/35/3f/d2/353fd21fe8848574148cc83bd6ae38cb.jpg')",
  }}
>
  {/* Multi-Layered Vignette for Absolute Typographic Legibility */}
  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent/40" />
  <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent" />

  {/* Ambient Left Environmental Light Flare */}
  <div className="absolute left-0 top-0 w-[36rem] h-[36rem] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8000ms]" />

  <div className="relative w-full container mx-auto px-6 sm:px-12 lg:px-8 max-w-7xl z-10 py-16">
    <div className="max-w-3xl text-left space-y-6">
      
      {/* Context Action Kicker */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <p className="text-emerald-400 uppercase tracking-widest text-xs font-black select-none">
          Ecosystem Hub Portal
        </p>
      </div>

      {/* Styled Headings Structural Block */}
      <div className="space-y-4 border-l-2 border-emerald-500/30 pl-4 sm:pl-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] select-none">
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">Changemaker!</span>
        </h1>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight select-none">
          Small Things Make a Big Change
        </h2>
        
        <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl select-text pt-1">
          Your efforts today can shape a better tomorrow. Let’s reduce waste, uplift communities, and protect our planet—one step at a time.
        </p>
      </div>

    </div>
  </div>
</section>






   {/* 🌍 Why NGOs Matter Value Proposition Grid */}
<section className="relative py-20 lg:py-28 px-4 sm:px-12 lg:px-8 bg-gradient-to-b from-slate-950 via-[#0a0c14] to-zinc-950 border-t border-white/[0.04]">
  <div className="max-w-6xl mx-auto space-y-12">
    
    {/* Section Typography Headers */}
    <div className="text-center space-y-2">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          Platform Mission Values
        </span>
      </div>
      <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 select-none">
        Why NGOs Matter
      </h3>
    </div>

    {/* Core Feature Matrix */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      
      {/* Block: Sustainability */}
      <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-emerald-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
        
        <span className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl text-emerald-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
          <FaLeaf size={22} />
        </span>
        
        <div className="space-y-2">
          <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-200">
            Sustainability
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Promoting the regular distribution of surplus goods systematically diverts clean, usable excess assets straight away from local landfill ecosystems.
          </p>
        </div>
      </article>

      {/* Block: Community Upliftment */}
      <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-indigo-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
        
        <span className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-2xl text-indigo-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
          <FaUsers size={22} />
        </span>
        
        <div className="space-y-2">
          <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
            Community Upliftment
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Directly collaborating with verified network vendors allows agile non-profits to dispatch high-priority essentials straight to families in need.
          </p>
        </div>
      </article>

      {/* Block: Awareness */}
      <article className="group bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] hover:border-pink-500/30 p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-pink-500/[0.01] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
        
        <span className="bg-pink-500/10 border border-pink-500/20 p-3.5 rounded-2xl text-pink-400 block mb-5 shadow-inner transition duration-300 group-hover:scale-105">
          <FaLightbulb size={22} />
        </span>
        
        <div className="space-y-2">
          <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-pink-400 transition-colors duration-200">
            Platform Awareness
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Educating teams on consumer habits establishes data accountability, lowering regional overproduction behaviors and waste pipelines.
          </p>
        </div>
      </article>

    </div>
  </div>
</section>







     {/* 📊 High-Fidelity Analytical Statistics Layout Card Section */}
<section className="py-20 px-4 sm:px-12 lg:px-8 bg-gradient-to-b from-[#0f111a] via-slate-950 to-zinc-950">
  <div className="max-w-7xl mx-auto space-y-12">
    
    {/* Section Typography Headers */}
    <div className="text-center space-y-2">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          Live Operational Stream
        </span>
      </div>
      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white select-none">
        My Activity Overview
      </h3>
    </div>

    {/* Primary Statistics Row Matrix */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Stat: Total Claimed */}
      <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] border-l-4 border-l-emerald-500 p-5 rounded-2xl text-left shadow-xl hover:bg-white/[0.02] transition-colors group">
        <div className="flex justify-between items-start">
          <span className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
            <FaBoxOpen size={16} />
          </span>
        </div>
        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight select-text">{totalClaims}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Total Claimed</span>
        </div>
      </div>

      {/* Stat: Pending */}
      <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] border-l-4 border-l-amber-500 p-5 rounded-2xl text-left shadow-xl hover:bg-white/[0.02] transition-colors group">
        <div className="flex justify-between items-start">
          <span className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-400">
            <FaHourglassHalf size={16} />
          </span>
        </div>
        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight select-text">{pending}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Pending Approval</span>
        </div>
      </div>

      {/* Stat: Approved */}
      <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] border-l-4 border-l-blue-500 p-5 rounded-2xl text-left shadow-xl hover:bg-white/[0.02] transition-colors group">
        <div className="flex justify-between items-start">
          <span className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400">
            <FaCheckCircle size={16} />
          </span>
        </div>
        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight select-text">{approved}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Approved Requests</span>
        </div>
      </div>

      {/* Stat: Delivered */}
      <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] border-l-4 border-l-pink-500 p-5 rounded-2xl text-left shadow-xl hover:bg-white/[0.02] transition-colors group">
        <div className="flex justify-between items-start">
          <span className="bg-pink-500/10 border border-pink-500/20 p-2.5 rounded-xl text-pink-400">
            <FaTruck size={16} />
          </span>
        </div>
        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight select-text">{delivered}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Delivered Items</span>
        </div>
      </div>

    </div>

    {/* Extended Operational Pipeline Submetrics Card */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl shadow-inner">
      <div className="text-center p-3 border-b sm:border-b-0 sm:border-r border-white/[0.04] last:border-0">
        <span className="text-xl font-black text-cyan-400 block select-text">{assigned}</span>
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-0.5">Volunteers Assigned</span>
      </div>
      <div className="text-center p-3 border-b sm:border-b-0 sm:border-r border-white/[0.04] last:border-0">
        <span className="text-xl font-black text-amber-400 block select-text">{pickupConfirmed}</span>
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-0.5">Pickups Confirmed</span>
      </div>
      <div className="text-center p-3 last:border-0">
        <span className="text-xl font-black text-fuchsia-400 block select-text">{impactScore}</span>
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-0.5">Calculated Impact Score</span>
      </div>
    </div>

  </div>
</section>


















{/* 🏁 Vendor Directory CTA Section */}
<section className="relative py-20 lg:py-24 px-6 sm:px-12 lg:px-8 bg-gradient-to-b from-slate-950 via-[#0a0c14] to-zinc-950 overflow-hidden border-t border-white/[0.04]">
  {/* Modern Tech Grid Pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
  
  {/* Ambient Indigo Base Glow Ring */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />

  <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 group">
    {/* Micro Badge Header */}
    <div className="flex justify-center">
      <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        Supply Network
      </span>
    </div>

    {/* Typography Content */}
    <div className="space-y-3">
      <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 select-none">
        Check All The Vendors
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed select-text">
        Discover active merchants contributing to systemic regional sustainability. Explore live asset inventories and participate in reducing supply waste loops instantly.
      </p>
    </div>

    {/* Action Trigger Link */}
    <div className="pt-2">
      <button
        onClick={handleRedirect}
        className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-950/40 border border-blue-400/20 transition-all duration-150 group/btn"
        type="button"
      >
        <span>View All Vendors</span>
        <span className="text-xs tracking-normal opacity-80 group-hover/btn:translate-x-1 transition-transform duration-150">&rarr;</span>
      </button>
    </div>
  </div>
</section>

{/* 🥧 Claim Status Pie Chart Section */}
<section className="relative py-20 px-4 sm:px-12 bg-gradient-to-b from-zinc-950 to-slate-950 border-t border-white/[0.04]">
  <div className="max-w-3xl mx-auto space-y-10">
    
    {/* Header Elements */}
    <div className="text-center space-y-2">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          Live Metric Stream
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white select-none">
        Claim Status Distribution
      </h2>
    </div>

    {/* Recharts Wrapper Card */}
    <div className="bg-white/[0.01] border border-white/[0.06] p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl min-h-[360px] flex items-center justify-center">
      {pieData && pieData.length === 0 ? (
        <div className="text-center text-slate-500 text-xs italic py-12 space-y-2">
          <span>📊</span>
          <p>No interactive claim metrics logged yet to draw analytics visuals.</p>
        </div>
      ) : (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
             <Pie
  data={pieData}
  cx="50%"
  cy="42%"
  outerRadius={100}
  innerRadius={65}
  paddingAngle={4}
  dataKey="value"
  label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#020617" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#020617", 
                  borderRadius: "12px", 
                  borderColor: "rgba(255,255,255,0.08)",
                  fontSize: "12px" 
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", color: "#94a3b8", paddingTop: "16px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>

  </div>
</section>













{/* 📍 Nearest Vendors Call-to-Action */}
<section className="relative py-16 lg:py-24 px-6 sm:px-12 lg:px-8 bg-gradient-to-br from-slate-950 via-[#0f111a] to-zinc-950 overflow-hidden border-t border-white/[0.05]">
  {/* Ambient Geometric Texture Overlay */}
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10 pointer-events-none" />
  
  {/* Radial Emerald Base Glow Ring */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

  <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 group">
    
    {/* Micro Badge Header */}
    <div className="flex justify-center">
      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Proximity Engine
      </span>
    </div>

    {/* Section Typography Headers */}
    <div className="space-y-3">
      <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
        Find Nearest Vendors
      </h3>
      <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
        Execute a real-time city-wide coordinate scan to locate active supplier nodes closest to you. Cut down transit footprints instantly by securing localized stock.
      </p>
    </div>

    {/* Action Routing Trigger */}
    <div className="pt-2">
      <Link
        to="/near"
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/40 transition-all duration-150"
      >
        <span>Discover Nearby Vendors</span>
        <span className="text-xs tracking-normal opacity-70 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
      </Link>
    </div>

  </div>
</section>




<section className="relative py-20 lg:py-28 px-6 sm:px-12 lg:px-24 bg-gradient-to-br from-slate-950 via-[#0f111a] to-zinc-950 text-white overflow-hidden border-t border-white/[0.05]">
  {/* Ambient Background Grid/Texture */}
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
  
  {/* Left Side Glow */}
  <div className="absolute -left-16 top-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">
    
    {/* Text Context Column */}
    <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
      <div className="space-y-3">
        <span className="inline-flex bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          Logistics Dispatch Hub
        </span>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Book a Volunteer <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            for Transportation
          </span>
        </h2>
      </div>

      <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
        Lacking independent heavy transport mechanisms to complete your claims pick-ups? Tap into our verified community volunteer pool to schedule secure, end-to-end stock collection transits.
      </p>

      <div className="pt-2">
        <Link
          to="/ngo/bookvolunteer"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950/40 transition-all duration-150"
        >
          <span>Schedule Freight Volunteer</span>
          <span className="text-xs transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </Link>
      </div>
    </div>

    {/* Graphic Asset Showcase Column */}
    <div className="w-full md:w-1/2 flex justify-center relative group">
      {/* Decorative Outer Aura Glow Ring */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition duration-500" />
      
      <div className="relative rounded-3xl bg-slate-950 border border-white/[0.06] p-4 sm:p-6 shadow-2xl w-full max-w-md md:max-w-lg transition duration-300 group-hover:border-white/10">
        <img
          src="https://i.pinimg.com/originals/c4/9a/20/c49a207e0f89c9290d98fd43a87a8cb0.gif"
          alt="Logistics asset distribution flow motion illustration graphic"
          className="w-full h-auto rounded-2xl mix-blend-screen opacity-90 object-contain"
          loading="lazy"
        />
      </div>
    </div>

  </div>
</section>








    <Footer/>





    </div>
  );
};

export default NgoDashboard;
