// src/pages/NgoDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import { Bell } from "lucide-react";
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
import api from "../util/api";

const NgoDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const NOTIFICATION_API = "/api/notifications/notification";

  const fetchNotifications = async () => {
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }
    try {
      const res = await api.get(NOTIFICATION_API, {
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
    const fetchMyClaimed = async () => {
      try {
        const res = await api.get("/api/items/get-claimed-items", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setClaimedItems(res.data.claimedItems || []);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch claimed items");
        setLoading(false);
      }
    };

    fetchMyClaimed();
    fetchNotifications();
  }, [token]);

  const handleRedirect = () => navigate("/allvendors");


    const handleExploreCommunity = ()=>
  {
    navigate("/blogs")
  }




  const handleLogout = async () => {
    try {
      await api.get("/api/users/logout", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.clear();
      toast.success("Logout successfully");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const totalClaims = claimedItems.length;
  const pending = claimedItems.filter((item) => item.claimStatus === "pending").length;
  const approved = claimedItems.filter((item) => item.claimStatus === "approved").length;
  const delivered = claimedItems.filter((item) => item.claimStatus === "collected").length;

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
      <nav className="flex flex-wrap justify-between items-center px-6 py-4 bg-[#101624] border-b border-gray-700 gap-3">
        <h1 className="text-3xl font-extrabold text-emerald-400">Zero Waste</h1>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Link to="/vendor/allitems" className="bg-indigo-600 px-4 py-2 rounded hover:bg-blue-600 text-sm">
            🧾 All Items
          </Link>
          <Link to="/myprofile" className="bg-pink-700 hover:bg-pink-500 px-4 py-2 rounded text-sm">
            👤 My Profile
          </Link>
          <Link to="/ngo/myclaimed" className="bg-purple-700 hover:bg-purple-500 px-4 py-2 rounded text-sm">
            🐬 My Claim
          </Link>
          <button onClick={handleLogout} className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded text-sm">
            📤 Logout
          </button>
          <Link to="/notifications" className="relative p-2 rounded-full hover:bg-gray-800">
            <Bell className="text-white w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="w-full h-[80vh] md:h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/35/3f/d2/353fd21fe8848574148cc83bd6ae38cb.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-400 mb-4 drop-shadow-lg">
            Welcome, Changemaker!
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
            Small Things Make a Big Change
          </h2>
          <p className="max-w-xl text-base md:text-lg text-gray-200">
            Your efforts today can shape a better tomorrow. Let’s reduce waste, uplift communities,
            and protect our planet—one step at a time.
          </p>
        </div>
      </section>

      {/* Why NGOs Matter */}
      <section className="bg-[#0f172a] py-16 px-4 md:px-24">
        <h3 className="text-3xl font-bold text-center mb-10 text-white">🌍 Why NGOs Matter</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { icon: <FaLeaf className="text-emerald-400" />, title: "Sustainability", desc: "Promoting the use of surplus goods helps reduce landfill waste and supports circular economy principles." },
            { icon: <FaUsers className="text-indigo-400" />, title: "Community Upliftment", desc: "Collaborating with vendors allows NGOs to distribute essentials to those in need." },
            { icon: <FaLightbulb className="text-pink-400" />, title: "Awareness", desc: "Raising awareness on responsible consumption reduces overproduction and waste." },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1e293b] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>






      {/* Dashboard Stats */}
      <section className="py-16 px-4 md:px-24 bg-[#111827]">
        <h3 className="text-3xl font-bold text-center mb-10 text-white">📈 My Activity Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { count: totalClaims, icon: <FaBoxOpen />, label: "Total Claimed", bg: "from-emerald-600 to-emerald-400" },
            { count: pending, icon: <FaHourglassHalf />, label: "Pending", bg: "from-yellow-600 to-yellow-400" },
            { count: approved, icon: <FaCheckCircle />, label: "Approved", bg: "from-blue-600 to-blue-400" },
            { count: delivered, icon: <FaTruck />, label: "Delivered", bg: "from-pink-600 to-pink-400" },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-tr ${stat.bg} p-5 rounded-2xl`}>
              <div className="text-white text-3xl mb-2">{stat.icon}</div>
              <h4 className="text-2xl font-bold text-white">{stat.count}</h4>
              <p className="text-sm text-white/90 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>




<section className="py-20 px-6 md:px-32 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-center">
  <h3 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
    🌱 Discover Local Vendors
  </h3>
  <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
    Browse through a curated list of eco-friendly vendors near you.
  </p>
  <Link
    to="/allvendors"
    className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
  >
    All Vendors
  </Link>
</section>






      {/* Pie Chart */}
      <section className="px-4 md:px-24 py-16 bg-[#0f172a]">
        <h2 className="text-3xl font-extrabold text-center text-emerald-400 mb-8">
          🥧 Claim Status Distribution
        </h2>
        <div className="bg-[#1e293b] p-6 rounded-2xl max-w-3xl mx-auto">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", borderColor: "#10b981" }}
                itemStyle={{ color: "#fff" }} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center"
                iconType="circle" wrapperStyle={{ color: "#ddd", marginTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>







      {/* Vendors Section */}
      <section className="py-16 px-4 md:px-24 bg-[#0f172a] text-center">
        <h3 className="text-3xl font-bold text-white mb-4">🔍 Find Nearest Vendors</h3>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          Based on your city, see which vendors are closest and connect instantly.
        </p>
        <Link to="/near" className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full">
          Find Nearby Vendors
        </Link>
      </section>











      {/* Book Volunteer */}
      <section className="flex flex-col md:flex-row items-center gap-10 px-6 md:px-24 py-16 bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4">
            Book a Volunteer for Transportation 🚚
          </h1>
          <p className="text-gray-300 mb-6 max-w-md">
            Need help moving donated goods? Our trusted volunteers are ready to assist.
          </p>
          <Link to="/ngo/bookvolunteer" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl">
            Schedule a Volunteer
          </Link>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="/transportation.gif"
            alt="Transport"
            className="w-full rounded-[40%_60%_60%_40%/50%_40%_60%_50%] shadow-lg"
          />
        </div>
      </section>



<section className="relative py-28 overflow-hidden">
  {/* Gradient angled background */}
  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 transform skew-y-3 origin-top"></div>

  <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-14">
    
    {/* LEFT: Text Content */}
    <div className="flex-1 text-center lg:text-left text-white">
      <h2 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
        Join the Conversation, <br /> Change the World 🌍
      </h2>
      <p className="text-lg text-green-100 mb-8 max-w-xl">
        Be part of a vibrant zero-waste community — read stories, share your tips, 
        and get inspired by people making real change.
      </p>
      <button
        onClick={handleExploreCommunity}
        className="group relative px-8 py-4 bg-white text-green-700 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        Explore Blogs
      </button>
    </div>

    {/* RIGHT: Illustration with floating icons */}
    <div className="flex-1 relative flex justify-center">
      {/* Glassmorphism circle */}
      <div className="w-72 h-72 lg:w-96 lg:h-96 bg-white/10 rounded-full backdrop-blur-lg border border-white/30 shadow-2xl flex items-center justify-center relative overflow-visible">
        
        {/* Main Illustration */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/3176/3176364.png"
          alt="Community"
          className="w-36 lg:w-48 animate-float"
        />

        {/* Floating icons */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
          className="w-10 absolute -top-6 left-12 animate-bounce-slow"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
          className="w-10 absolute bottom-4 -left-6 animate-bounce-slow delay-200"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
          className="w-10 absolute top-8 -right-6 animate-bounce-slow delay-500"
        />
      </div>
    </div>
  </div>

  {/* Floating animations */}
  <style>
    {`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .animate-bounce-slow {
        animation: bounce-slow 5s ease-in-out infinite;
      }
    `}
  </style>
</section>







      <Footer />
    </div>
  );
};

export default NgoDashboard;
