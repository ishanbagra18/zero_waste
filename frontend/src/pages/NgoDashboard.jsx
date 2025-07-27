import React, { useEffect, useState } from "react";
import axios from "axios";
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



const NgoDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);



   const NOTIFICATION_API = "http://localhost:3002/api/notifications/notification";

  const fetchNotifications = async () => {
    // console.log("📡 Fetching notifications...");
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


    const unreadCount = notifications.filter(n => !n.isRead).length;




  useEffect(() => {
    const fetchMyClaimed = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/items/get-claimed-items", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setClaimedItems(res.data.claimedItems || []);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch claimed items");
        console.error(error);
        setLoading(false);
      }
    };

    fetchMyClaimed();
    fetchNotifications();
  }, [token]);



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
 <nav className="flex justify-between items-center px-10 py-5 bg-[#101624] border-b border-gray-700">
  <h1 className="text-3xl font-extrabold text-emerald-400">Zero Waste</h1>
  <div className="flex items-center gap-4">
    <Link
      to="/vendor/allitems"
      className="bg-indigo-600 px-4 py-2 rounded hover:bg-blue-600"
    >
      🧾 All Items
    </Link>



    <Link
      to="/myprofile"
      className="bg-pink-700 hover:bg-pink-500 px-4 py-2 rounded"
    >
      👤 My Profile
    </Link>

    <Link
      to="/ngo/myclaimed"
      className="bg-purple-700 hover:bg-purple-500 px-4 py-2 rounded"
    >
      🐬 My Claim
    </Link>

    <button
      onClick={handleLogout}
      className="border border-black pt-2 pb-2 px-4 bg-sky-500 hover:bg-sky-600 rounded"
    >
      📤 Logout
    </button>
       <Link to="/notifications" className="relative p-2 rounded-full hover:bg-gray-800 transition">
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
        className="w-full h-screen bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/35/3f/d2/353fd21fe8848574148cc83bd6ae38cb.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-emerald-400 mb-6 drop-shadow-lg">
            Welcome, Changemaker!
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Small Things Make a Big Change
          </h2>
          <p className="max-w-2xl text-lg md:text-xl text-gray-200">
            Your efforts today can shape a better tomorrow. Let’s reduce waste, uplift communities,
            and protect our planet—one step at a time.
          </p>
        </div>
      </section>

      {/* Why NGOs Matter */}
      <section className="bg-[#0f172a] py-20 px-6 md:px-24">
        <h3 className="text-3xl font-bold text-center mb-12 text-white">🌍 Why NGOs Matter</h3>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="text-3xl text-emerald-400 mb-4">
              <FaLeaf />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Sustainability</h4>
            <p className="text-gray-400 text-sm">
              Promoting the use of surplus goods helps reduce landfill waste and supports circular
              economy principles.
            </p>
          </div>
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="text-3xl text-indigo-400 mb-4">
              <FaUsers />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Community Upliftment</h4>
            <p className="text-gray-400 text-sm">
              Collaborating with vendors allows NGOs to distribute essentials to those in need.
            </p>
          </div>
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="text-3xl text-pink-400 mb-4">
              <FaLightbulb />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Awareness</h4>
            <p className="text-gray-400 text-sm">
              Raising awareness on responsible consumption reduces overproduction and waste.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="py-20 px-6 md:px-24 bg-[#111827]">
        <h3 className="text-3xl font-bold text-center mb-12 text-white">📈 My Activity Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-gradient-to-tr from-emerald-600 to-emerald-400 p-6 rounded-2xl shadow-lg">
            <div className="text-white text-4xl mb-2">
              <FaBoxOpen />
            </div>
            <h4 className="text-2xl font-bold text-white">{totalClaims}</h4>
            <p className="text-sm text-white/90 mt-1">Total Claimed</p>
          </div>
          <div className="bg-gradient-to-tr from-yellow-600 to-yellow-400 p-6 rounded-2xl shadow-lg">
            <div className="text-white text-4xl mb-2">
              <FaHourglassHalf />
            </div>
            <h4 className="text-2xl font-bold text-white">{pending}</h4>
            <p className="text-sm text-white/90 mt-1">Pending</p>
          </div>
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-6 rounded-2xl shadow-lg">
            <div className="text-white text-4xl mb-2">
              <FaCheckCircle />
            </div>
            <h4 className="text-2xl font-bold text-white">{approved}</h4>
            <p className="text-sm text-white/90 mt-1">Approved</p>
          </div>
          <div className="bg-gradient-to-tr from-pink-600 to-pink-400 p-6 rounded-2xl shadow-lg">
            <div className="text-white text-4xl mb-2">
              <FaTruck />
            </div>
            <h4 className="text-2xl font-bold text-white">{delivered}</h4>
            <p className="text-sm text-white/90 mt-1">Delivered</p>
          </div>
        </div>
      </section>




       <section className="relative py-20 px-6 md:px-24 bg-[#111827] overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h3 className="text-4xl font-extrabold text-white mb-4">🏁 Check All The Vendors</h3>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Discover vendors contributing to sustainability. Explore their offerings and get involved in reducing waste through circular solutions.
        </p>

        <button
          onClick={handleRedirect}
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full shadow-lg transition duration-300"
        >
          View All Vendors
        </button>
      </div>
    </section>


    {/* 🥧 Claim Status Pie Chart */}
<section className="px-6 md:px-24 py-20 bg-[#0f172a] border-t border-gray-800">
  <h2 className="text-3xl md:text-4xl font-extrabold text-center text-emerald-400 mb-10">
    🥧 Claim Status Distribution
  </h2>

  <div className="bg-[#1e293b] p-8 rounded-3xl shadow-2xl border border-gray-700 max-w-3xl mx-auto">
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", borderColor: "#10b981" }}
          itemStyle={{ color: "#fff" }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          wrapperStyle={{ color: "#ddd", marginTop: "20px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</section>



{/* 🔍 Nearest Vendors Call-to-Action */}
<section className="relative py-20 px-6 md:px-24 bg-[#0f172a] overflow-hidden border-t border-gray-700">
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>

  <div className="relative z-10 text-center">
    <h3 className="text-4xl font-extrabold text-white mb-4">🔍 Find Nearest Vendors</h3>
    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
      Based on your current city, see which vendors are closest to you and connect instantly.
    </p>

    <Link
      to="/near"
      className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg rounded-full shadow-lg transition duration-300"
    >
      Find Nearby Vendors
    </Link>
  </div>
</section>




  <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-24 py-20 bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      {/* Text Section */}
      <div className="z-10 w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-bold text-cyan-300 mb-6 leading-tight drop-shadow-md">
          Book a Volunteer <br /> for Transportation 🚚
        </h1>

        <p className="text-gray-300 text-lg mb-8 max-w-xl">
          Need help moving donated goods? Our trusted volunteers are ready to assist you in delivering resources safely and efficiently.
        </p>

        <Link
          to="/ngo/bookvolunteer"
          className="inline-block px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-lg rounded-xl shadow-md hover:shadow-cyan-400/30 transition-all duration-300"
        >
          Schedule a Volunteer
        </Link>
      </div>

 <div className="z-10 w-full md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
  <div className="relative w-full max-w-md md:max-w-lg">
    {/* Blob Background */}
    <div className="absolute -top-6 -left-6 w-full h-full bg-cyan-400 opacity-30 blur-3xl rounded-full animate-pulse z-0"></div>

    {/* Image with unique shape */}
    <img
      src="/transportation.gif"
      alt="Volunteer Transport Illustration"
      className="relative z-10 w-full h-auto rounded-[40%_60%_60%_40%/50%_40%_60%_50%] shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out"
    />
  </div>
</div>

    </section>








    <Footer/>





    </div>
  );
};

export default NgoDashboard;
