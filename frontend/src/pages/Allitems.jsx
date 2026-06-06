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
  MdLayers,
} from "react-icons/md";

const Allitems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/items/get-items", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 100,
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
    setCurrentPage(1);
  }, [selectedCategory, selectedLocation, items]);

  const totalPages = Math.max(Math.ceil(filteredItems.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16 selection:bg-blue-500 selection:text-black">
      <Toaster />

      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 bg-clip-text text-transparent mb-4">
          Discover & Reclaim Resources
        </h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto">
          Explore vendor-posted surplus items and claim resources optimized for sustainability.
        </p>
      </div>

      {/* Filters Section */}
      <div className="max-w-xl mx-auto flex gap-4 mb-14 bg-zinc-900/40 p-3 border border-zinc-900 rounded-2xl backdrop-blur-md">
        <div className="w-1/2 relative">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
            className="w-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2 relative">
          <select
            onChange={(e) => setSelectedLocation(e.target.value)}
            value={selectedLocation}
            className="w-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
          >
            <option value="">All Locations</option>
            {locations.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc.charAt(0).toUpperCase() + loc.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl max-w-md mx-auto">
          <p className="text-zinc-500 font-medium">No resource items match your criteria.</p>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedItems.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/vendor/item/${item._id}`)}
                className="group relative flex flex-col justify-between cursor-pointer bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:border-zinc-700/80 hover:-translate-y-1.5"
                title={`View details for ${item.name}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" ? navigate(`/vendor/item/${item._id}`) : null)}
              >
                {/* Image Section */}
                <div className="h-48 w-full overflow-hidden bg-zinc-950 relative border-b border-zinc-800/40">
                  <img
                    src={item.itemImage?.url || "/images/no-image.png"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Status Absolute Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border backdrop-blur-md ${
                        item.status === "available"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-zinc-100 capitalize line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1.5 mb-4 line-clamp-2 h-8 leading-relaxed">
                      {item.description || "No description available for this resource item."}
                    </p>

                    {/* Metadata Structured Grid */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs text-zinc-400 border-t border-zinc-800/60 pt-4 mb-4">
                      <div className="flex items-center gap-2 min-w-0" title={`Location: ${item.location}`}>
                        <MdLocationOn className="text-zinc-500 shrink-0 w-4 h-4" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 min-w-0" title={`Category: ${item.category}`}>
                        <MdCategory className="text-zinc-500 shrink-0 w-4 h-4" />
                        <span className="truncate capitalize">{item.category}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 min-w-0" title={`Quantity: ${item.quantity}`}>
                        <MdShoppingCart className="text-zinc-500 shrink-0 w-4 h-4" />
                        <span className="truncate">Qty: {item.quantity}</span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0" title={`Price: ₹${item.price}`}>
                        <MdPriceChange className="text-zinc-500 shrink-0 w-4 h-4" />
                        <span className="truncate font-semibold text-zinc-300">₹{item.price}</span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0 capitalize" title={`Mode: ${item.mode}`}>
                        <MdSyncAlt className="text-zinc-500 shrink-0 w-4 h-4" />
                        <span className="truncate">{item.mode}</span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0 capitalize" title={`Status: ${item.status}`}>
                        {item.status === "available" ? (
                          <MdCheckCircle className="text-emerald-500 shrink-0 w-4 h-4" />
                        ) : (
                          <MdCancel className="text-rose-500 shrink-0 w-4 h-4" />
                        )}
                        <span className="truncate">{item.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Footer Tag */}
                  <div className="pt-3 border-t border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MdLayers className="w-3.5 h-3.5" /> Origin:
                    </span>
                    <span className="font-medium text-zinc-300 bg-zinc-800/80 border border-zinc-700/30 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                      {item.vendor?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="max-w-7xl mx-auto mt-14 flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-5 py-2.5 text-xs font-semibold tracking-wide text-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-zinc-500 tracking-wider">
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold tracking-wide text-black disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md shadow-blue-600/10"
            >
              Next Page
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Allitems;