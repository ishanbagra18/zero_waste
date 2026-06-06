import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { MdLocationOn, MdShoppingCart, MdHistory, MdCalendarToday } from "react-icons/md";
import { motion } from "framer-motion";

const MyClaimed = () => {
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchMyClaimed();
  }, [token]);

  // डायनामिक क्लेम स्टेटस कलर्स के लिए हेल्पर फ़ंक्शन
  const getStatusStyle = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "approved" || lowerStatus === "claimed") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (lowerStatus === "pending") {
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
    return "bg-zinc-800 text-zinc-400 border-zinc-700/50";
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 bg-zinc-950">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-purple-500 rounded-full animate-spin"></div>
        <span className="text-zinc-400 text-sm font-medium tracking-wide">Fetching your claimed history...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16 selection:bg-purple-500 selection:text-black antialiased">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-r from-purple-300 via-purple-500 to-purple-300 bg-clip-text text-transparent mb-4">
          Your Claimed Resources
        </h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto">
          Review and monitor the real-time fulfillment status of your requested surplus goods.
        </p>
      </div>

      {/* Empty State */}
      {claimedItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl max-w-md mx-auto space-y-3">
          <MdHistory className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-zinc-500 font-medium">You haven't claimed any resource items yet.</p>
        </div>
      ) : (
        /* Items Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {claimedItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-5 backdrop-blur-md hover:border-zinc-700/80 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Image Wrapper */}
                <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-zinc-950 border border-zinc-800/50 relative">
                  <img
                    src={item.itemImage?.url || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />

                  {/* Absolute Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border backdrop-blur-md ${getStatusStyle(item.claimStatus)}`}>
                      {item.claimStatus || "Claimed"}
                    </span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="space-y-2">
                  <h2 className="text-lg font-bold tracking-tight text-zinc-100 capitalize line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {item.name}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <MdShoppingCart className="text-zinc-500 w-4 h-4 shrink-0" />
                    <span>Quantity Requested: <span className="text-zinc-200 font-semibold">{item.quantity}</span></span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
                    <MdCalendarToday className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {item.claimedAt ? new Date(item.claimedAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vendor Footer Profiles */}
              <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center gap-3">
                <img
                  src={item.vendor?.photo?.url || "https://via.placeholder.com/100x100?text=User"}
                  alt="Vendor Profile"
                  className="w-9 h-9 rounded-full object-cover border border-zinc-800 bg-zinc-900 shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100x100?text=User";
                  }}
                />
                <div className="min-w-0 flex-grow">
                  <p className="text-xs font-semibold text-zinc-200 truncate">
                    {item.vendor?.name || "Unknown Vendor"}
                  </p>
                  <div className="flex items-center text-zinc-500 text-[10px] truncate mt-0.5">
                    <MdLocationOn className="mr-0.5 shrink-0" />
                    <span className="truncate">{item.vendor?.location || "Remote Origin"}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaimed;