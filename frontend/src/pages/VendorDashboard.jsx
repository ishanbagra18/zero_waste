import React, { useEffect, useState } from "react";
import api from "../util/api";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import { PackageCheck, Handshake, PackageX, Layers, Bell } from "lucide-react";
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
  const [visibleCount, setVisibleCount] = useState(4);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      // toast.error("Failed to load notifications");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await api.get("/api/items/my-items", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data.items)) {
          setItems(res.data.items);
        } else {
          toast.error("Invalid response format.");
          setItems([]);
        }
      } catch (error) {
        // toast.error(error.response?.data?.message || "Failed to load items");
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
      await api.delete(`/api/items/delete-item/${deleteItemId}`, {
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


  const handledonation = () =>
  {
    navigate("/donation");
  }


  const handleExploreCommunity = ()=>
  {
    navigate("/blogs")
  }

  const handlereadmore = () => {
    navigate("/readmore");
  };

  const handlelogout = async () => {
    try {
      await api.get("/api/users/logout", {
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
  const loadMoreItems = () => setVisibleCount((prev) => prev + 8);

  // Stats
  const totalItems = items.length;
  const claimedItems = items.filter((item) => item.status === "claimed").length;
  const unclaimedItems = items.filter((item) => item.status !== "claimed").length;
  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const pieData = [
    { name: "Claimed Items", value: claimedItems },
    { name: "Unclaimed Items", value: unclaimedItems },
  ];

  const COLORS = ["#facc15", "#10b981"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1c] via-[#111827] to-[#1f2937] text-white font-sans">
      <Toaster />

      {/* Navbar */}
      <nav className="flex flex-wrap justify-between items-center px-4 sm:px-8 py-4 bg-[#101624] border-b border-gray-700 shadow-md sticky top-0 z-50 gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-wide select-none">
          Zero Waste
        </h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Link to="/vendor/createitem" className="bg-emerald-600 px-4 py-2 rounded-md hover:bg-green-600 shadow-md">➕ Create Item</Link>
          <Link to="/vendor/allitems" className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-blue-600 shadow-md">🧾 All Items</Link>
          <Link to="/myprofile" className="bg-pink-700 px-4 py-2 rounded-md hover:bg-pink-500 shadow-md">👤 My Profile</Link>
          <button onClick={handlelogout} className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-md shadow-md">📤 Logout</button>
          <Link to="/notifications" className="relative p-2 rounded-full hover:bg-gray-800">
            <Bell className="text-white w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="w-full h-[90vh] bg-cover bg-center relative flex items-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/2a/6a/26/2a6a26f421af4f318c047023172a367a.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative container mx-auto px-6 md:px-10 max-w-7xl">
          <div className="max-w-2xl text-white">
            <p className="text-green-400 uppercase tracking-widest text-sm font-semibold mb-2 drop-shadow-lg">
              Natural Environment
            </p>
            <h1 className="text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              Give Waste a Second <br /> Chance
            </h1>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed drop-shadow-md">
              Empowering vendors to transform surplus inventory into meaningful
              contributions, fostering community well-being and driving a
              zero-waste future.
            </p>
            <div className="flex gap-4">
              <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-400">
                Let&apos;s Talk 💬
              </button>
              <button
                onClick={handlereadmore}
                className="border border-white text-white font-medium px-8 py-3 rounded-lg hover:bg-white/20 transition shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Heading */}
      <header className="container mx-auto px-10 mt-12 mb-6 max-w-7xl">
        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">📦 My Items</h2>
        <p className="text-gray-400 text-base max-w-xl">
          All your donated and listed items appear here.
        </p>
      </header>

      {/* Items Grid */}
      <div className="container mx-auto px-6 pb-12 max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <div
              key={item._id}
              className="bg-gradient-to-br from-[#1f2937] to-[#111827] p-5 rounded-3xl border border-gray-700 shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.03] transition-transform duration-300 flex flex-col"
            >
              <img
                src={item.itemImage?.url || "https://via.placeholder.com/300"}
                alt={item.name}
                className="w-full h-48 object-cover rounded-xl border border-gray-600 mb-4 shadow-inner"
              />
              <h3 className="text-xl font-semibold text-white truncate mb-1" title={item.name}>
                {item.name}
              </h3>
              <p
                className="text-sm text-gray-400 italic mb-3 line-clamp-3 select-text"
                title={item.description || "No description"}
              >
                {item.description || "No description"}
              </p>

              <div className="text-xs text-gray-300 space-y-1 mt-auto">
                <p>📍 Location: {item.location || "Unknown"}</p>
                <p>
                  📦 Qty: <span className="font-medium">{item.quantity || 0}</span> | 🎯{" "}
                  {item.category}
                </p>
                <p>🛠 Mode: {item.mode}</p>
                <p>
                  📌 Status:{" "}
                  <span
                    className={`ml-1 font-semibold ${
                      item.status === "claimed" ? "text-yellow-400" : "text-green-400"
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.claimStatus && (
                    <span className="ml-2 text-gray-400 font-normal">
                      ({item.claimStatus})
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/vendor/updateitem/${item._id}`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-lg shadow-md text-center transition focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => confirmDelete(item._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg italic select-none">
            No items found.
          </p>
        )}
      </div>

      {/* Load More */}
      {visibleCount < items.length && (
        <div className="text-center pb-16">
          <button
            onClick={loadMoreItems}
            className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-xl text-white font-semibold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Load More ⬇️
          </button>
        </div>
      )}

      {/* Vendor Stats */}
      <section className="container mx-auto px-6 md:px-12 py-16 bg-[#0f172a] border-t border-gray-700 max-w-7xl rounded-3xl shadow-lg">
        <h3 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-emerald-400 tracking-wide drop-shadow-lg">
          📊 Vendor Dashboard Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[{
              icon: PackageCheck,
              value: totalItems,
              label: "Total Items",
              color: "green-400",
              fromTo: "from-[#1f2937] to-[#0f172a]",
              shadow: "hover:shadow-emerald-500/40"
            },
            {
              icon: Handshake,
              value: claimedItems,
              label: "Claimed Items",
              color: "yellow-400",
              fromTo: "from-[#2d3748] to-[#0f172a]",
              shadow: "hover:shadow-yellow-500/40"
            }, 
            {
              icon: PackageX,
              value: unclaimedItems,
              label: "Unclaimed Items",
              color: "blue-400",
              fromTo: "from-[#1a202e] to-[#0f172a]",
              shadow: "hover:shadow-blue-500/40"
            },
            {
              icon: Layers,
              value: totalQuantity,
              label: "Total Quantity",
              color: "pink-400",
              fromTo: "from-[#3f1d3a] to-[#0f172a]",
              shadow: "hover:shadow-pink-500/40"
            }
          ].map(({ icon: Icon, value, label, color, fromTo, shadow }, idx) => (
            <div
              key={label}
              className={`bg-gradient-to-tr ${fromTo} p-6 rounded-3xl border border-gray-800 text-center shadow-lg transform transition-all duration-300 cursor-default ${shadow} hover:-translate-y-1`}
              role="region"
              aria-label={label}
            >
              <div className="flex justify-center mb-4">
                <Icon className={`w-10 h-10 text-${color} drop-shadow-md`} />
              </div>
              <div className={`text-4xl font-extrabold text-${color} select-text`}>{value}</div>
              <p className="text-sm text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-[#1f2937] p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-transform duration-300 scale-100">
            <h2 className="text-xl font-semibold mb-4 text-white" id="modal-title">
              Confirm Delete
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner NGOs Section */}
      <section className="px-6 md:px-24 py-20 bg-[#111827] border-t border-gray-800">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-extrabold text-emerald-400 mb-4 tracking-wide drop-shadow-lg">
            🤝 Partner NGOs
          </h3>
          <p className="text-gray-300 mb-8 text-base md:text-lg">
            Explore all the NGOs collaborating in our zero-waste initiative.
            These organizations help ensure your donations are put to meaningful
            use.
          </p>
          <button
            onClick={handlebutton}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-3 rounded-xl shadow-md transition duration-300 hover:shadow-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            View All NGOs →
          </button>
        </div>
      </section>

      {/* Pie Chart Section */}
      <section className="px-6 md:px-24 py-20 bg-[#0f172a] border-t border-gray-800">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-emerald-400 mb-10 tracking-wide drop-shadow-lg">
          🥧 Claim Status Breakdown
        </h2>

        <div className="bg-[#1e293b] p-8 rounded-3xl shadow-xl border border-gray-700 max-w-3xl mx-auto">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                dataKey="value"
                stroke="#0f172a"
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#111827"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#10b981",
                  borderRadius: "10px",
                }}
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






<section className="relative px-6 md:px-24 py-24 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0f172a] overflow-hidden border-t border-gray-800">
  <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-10 md:p-16 text-center border border-emerald-500/30">
    <h3 className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-6 drop-shadow-lg leading-tight">
      Ready to Make a Difference? 💚
    </h3>
    <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
      Join our mission to eliminate waste. Explore verified NGOs working 
      tirelessly toward sustainability. Your donation can spark real change.
    </p>
    <button
      onClick={handledonation}
      className="group relative inline-flex items-center px-10 py-4 bg-emerald-500 text-black font-semibold rounded-xl shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-400/50 focus:outline-none focus:ring-4 focus:ring-emerald-400"
    >
      <span className="relative z-10">View All NGOs</span>
      <span className="absolute right-4 text-xl transform group-hover:translate-x-1 transition-transform duration-300">
        →
      </span>
    </button>
  </div>
</section>









{/* EXPLORE THE COMMUNITY - HERO STYLE */}
<section className="relative py-28 overflow-hidden">
  {/* Background split */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 skew-y-3 transform origin-top"></div>

  <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
    {/* Left: Text */}
    <div className="flex-1 text-center lg:text-left text-white">
      <h2 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
        Join the Conversation, <br /> Change the World 🌍
      </h2>
      <p className="text-lg text-gray-200 mb-8 max-w-xl">
        Dive into a thriving community of eco-conscious changemakers.  
        Read inspiring blogs, share your ideas, and learn from real journeys.
      </p>
      <button
        onClick={handleExploreCommunity}
        className="group relative px-8 py-4 bg-white text-blue-700 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        Explore Blogs
   
      </button>
    </div>

    {/* Right: Illustration */}
    <div className="flex-1 relative flex justify-center">
      {/* Main circle */}
      <div className="w-72 h-72 lg:w-96 lg:h-96 bg-white/10 rounded-full backdrop-blur-lg border border-white/30 shadow-2xl flex items-center justify-center relative">
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

  {/* Animations */}
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

export default VendorDashboard;
