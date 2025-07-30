import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  MdLocationOn,
  MdShoppingCart,
  MdSyncAlt,
} from "react-icons/md";
import { motion } from "framer-motion";

const MyClaimed = () => {
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyClaimed = async () => {
      try {
        const res = await axios.get("https://zero-waste-2xxf.onrender.com/api/items/get-claimed-items", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setClaimedItems(res.data.claimedItems || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchMyClaimed();
  }, [token]);

  if (loading) {
    return (
      // <div className="flex justify-center items-center min-h-screen bg-[#0f172a] text-slate-300 text-lg">
      //   Loading your claimed items...
      // </div>

        <LoadingSpinner loading={loading} />


    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold text-center mb-10">My Claimed Items</h1>

      {claimedItems.length === 0 ? (
        <div className="text-center text-slate-400 text-lg">
          You haven't claimed any items yet.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {claimedItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-5 flex flex-col justify-between"
            >
              {/* Image */}
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                <img
                  src={item.itemImage?.url || "https://via.placeholder.com/400x300?text=No+Image"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
              </div>

              {/* Item Info */}
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{item.name}</h2>
                <div className="flex items-center text-sm text-slate-400">
                  <MdShoppingCart className="mr-2" />
                  Quantity: <span className="ml-1 text-slate-300">{item.quantity}</span>
                </div>
                <div className="flex items-center text-sm text-slate-400">
                  <MdSyncAlt className="mr-2" />
                  Status:
                  <span className="ml-2 capitalize text-slate-200 font-medium">
                    {item.claimStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Claimed at:{" "}
                  {new Date(item.claimedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              {/* Vendor Info */}
              <div className="mt-5 pt-4 border-t border-slate-700 flex items-center gap-4">
                <img
                  src={item.vendor?.photo?.url || "https://via.placeholder.com/100x100?text=User"}
                  alt="Vendor"
                  className="w-10 h-10 rounded-full object-cover border border-slate-600"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100x100?text=User";
                  }}
                />
                <div className="text-sm">
                  <p className="font-semibold text-slate-100">
                    {item.vendor?.name || "Unknown Vendor"}
                  </p>
                  <div className="flex items-center text-slate-400 text-xs">
                    <MdLocationOn className="mr-1" />
                    {item.vendor?.location || "Unknown Location"}
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
