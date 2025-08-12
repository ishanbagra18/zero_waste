import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MdLocationOn,
  MdCategory,
  MdPriceChange,
  MdShoppingCart,
  MdSyncAlt,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import api from "../util/api";

const Allitems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/api/items/get-items", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(res.data.items)) {
          setItems(res.data.items);
          setFilteredItems(res.data.items);
          setCategories([...new Set(res.data.items.map((item) => item.category))]);
          setLocations([...new Set(res.data.items.map((item) => item.location))]);
        } else {
          toast.error("Invalid response format.");
        }
      } catch (error) {
        console.error("❌ Error fetching items:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Failed to load items");
      }
    };

    fetchItems();
  }, [token]);

  useEffect(() => {
    let filtered = [...items];
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (selectedLocation) {
      filtered = filtered.filter((item) => item.location === selectedLocation);
    }
    setFilteredItems(filtered);
  }, [selectedCategory, selectedLocation, items]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 px-8 py-16 text-white font-sans">
      <Toaster />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-blue-500 mb-4 drop-shadow-lg select-none">
          ♻️ Discover & Reclaim Resources
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl">
          Explore vendor-posted surplus items and reclaim for good.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 mb-14">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="bg-gray-700 text-white px-5 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedLocation(e.target.value)}
          value={selectedLocation}
          className="bg-gray-700 text-white px-5 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="">All Locations</option>
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc.charAt(0).toUpperCase() + loc.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-xl text-gray-500 mt-20 select-none">No items found.</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/vendor/item/${item._id}`)}
              className="cursor-pointer bg-gray-800 border border-gray-700 rounded-3xl shadow-xl hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-transform duration-300"
              title={`View details for ${item.name}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" ? navigate(`/vendor/item/${item._id}`) : null)}
            >
              {/* Image */}
              <div className="h-56 w-full overflow-hidden rounded-t-3xl shadow-inner">
                <img
                  src={item.itemImage?.url || "/images/no-image.png"}
                  alt={item.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold capitalize tracking-wide truncate text-white select-none">
                    {item.name}
                  </h2>
                  <span
                    className={`text-xs px-4 py-1 rounded-full font-semibold ${
                      item.status === "available"
                        ? "bg-green-600 text-green-100 shadow-md"
                        : "bg-red-600 text-red-100 shadow-md"
                    } select-none`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-400 italic min-h-[3rem] select-text">
                  {item.description || "No description provided."}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2" title={`Location: ${item.location}`}>
                    <MdLocationOn className="text-blue-400" size={20} />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2" title={`Category: ${item.category}`}>
                    <MdCategory className="text-purple-400" size={20} />
                    <span className="truncate">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2" title={`Quantity: ${item.quantity}`}>
                    <MdShoppingCart className="text-teal-400" size={20} />
                    <span>{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2" title={`Price: ₹${item.price}`}>
                    <MdPriceChange className="text-yellow-400" size={20} />
                    <span>₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-2 capitalize" title={`Mode: ${item.mode}`}>
                    <MdSyncAlt className="text-orange-400" size={20} />
                    <span>{item.mode}</span>
                  </div>
                  <div
                    className="flex items-center gap-2 select-none"
                    title={`Status: ${item.status}`}
                    aria-label={`Item status is ${item.status}`}
                  >
                    {item.status === "available" ? (
                      <MdCheckCircle className="text-green-500" size={20} />
                    ) : (
                      <MdCancel className="text-red-500" size={20} />
                    )}
                    <span className="capitalize">{item.status}</span>
                  </div>
                </div>

                {/* Vendor */}
                <div className="pt-3 text-sm text-gray-400 truncate">
                  Vendor:{" "}
                  <span className="text-white font-semibold bg-gray-700 px-3 py-1 rounded-full shadow-sm select-text">
                    {item.vendor?.name || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allitems;
