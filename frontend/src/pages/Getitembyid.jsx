import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  MdLocationOn,
  MdCategory,
  MdShoppingCart,
  MdPriceChange,
  MdSyncAlt,
  MdCheckCircle,
  MdCancel,
  MdArrowBack,
  MdEmail,
  MdBusiness,
  MdPerson,
} from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Getitembyid = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchItemById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const fetchItemById = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3002/api/items/get-item/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data && res.data.item) {
        setItem(res.data.item);
      } else {
        toast.error("Item not found or unexpected response.");
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = () => {
    confirmAlert({
      title: "Confirm to Claim",
      message: "Are you sure you want to claim this resource item?",
      buttons: [
        {
          label: "Yes, Claim",
          onClick: async () => {
            try {
              await axios.patch(
                `http://localhost:3002/api/items/${id}/claim`,
                {},
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              toast.success("Item claimed successfully!");
              fetchItemById();
            } catch (error) {
              const errMsg =
                error.response?.data?.message || "Failed to claim item.";
              toast.error(errMsg);
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {
            toast("Claim cancelled.");
          },
        },
      ],
    });
  };

  const handleFetchError = (error) => {
    if (error.response?.status === 401) {
      toast.error("Unauthorized: Please log in again.");
    } else if (error.response?.status === 404) {
      toast.error("Item not found.");
    } else {
      toast.error("Failed to load item details.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      <Toaster />

      {loading ? (
        <div className="flex flex-col h-screen items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-zinc-400 text-sm font-medium tracking-wide">Loading item details...</span>
        </div>
      ) : item ? (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          {/* Back Button Container */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all text-sm font-semibold shadow-sm"
              aria-label="Back"
            >
              <MdArrowBack size={18} />
              Back to Catalog
            </button>
          </div>

          {/* Main Card Grid Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-zinc-900/30 border border-zinc-900 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
            
            {/* Left Column: Image Area */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/60 shadow-inner relative group">
                <img
                  src={item.itemImage?.url || "/images/no-image.png"}
                  alt={item.name || "Resource item"}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/no-image.png";
                  }}
                />
              </div>

              {/* Status Display Box */}
              <div className={`w-full p-4 rounded-2xl border text-center font-bold text-sm tracking-wide ${
                item.status === "available"
                  ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                  : "bg-rose-500/5 text-rose-400 border-rose-500/10"
              }`}>
                Status: {item.status === "available" ? "Available for Claim" : item.status?.toUpperCase()}
              </div>
            </div>

            {/* Right Column: Detailed Parameters */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-100 capitalize mb-3">
                  {item.name}
                </h1>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {item.description || "No extensive description provided for this specific resource item."}
                </p>

                {/* Structured Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <DetailCard
                    icon={<MdCategory size={18} className="text-zinc-500" />}
                    label="Category"
                    value={item.category}
                  />
                  <DetailCard
                    icon={<MdLocationOn size={18} className="text-zinc-500" />}
                    label="Location"
                    value={item.location}
                  />
                  <DetailCard
                    icon={<MdShoppingCart size={18} className="text-zinc-500" />}
                    label="Available Quantity"
                    value={item.quantity}
                  />
                  <DetailCard
                    icon={<MdPriceChange size={18} className="text-zinc-500" />}
                    label="Value / Price"
                    value={`₹${item.price}`}
                  />
                  <DetailCard
                    icon={<MdSyncAlt size={18} className="text-zinc-500" />}
                    label="Transaction Mode"
                    value={item.mode}
                  />
                  <DetailCard
                    icon={
                      item.status === "available" ? (
                        <MdCheckCircle size={18} className="text-emerald-500" />
                      ) : (
                        <MdCancel size={18} className="text-rose-500" />
                      )
                    }
                    label="Verification"
                    value={item.status === "available" ? "Verified Active" : "Inactive / Closed"}
                  />
                </div>
              </div>

              {/* CTA Action Bar */}
              <div className="w-full pt-4 border-t border-zinc-800/60">
                {item.status !== "available" ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl text-zinc-500 bg-zinc-900 border border-zinc-800 cursor-not-allowed font-bold text-sm uppercase tracking-wider"
                    aria-disabled="true"
                  >
                    {item.status === "rejected" ? "Temporarily Unavailable" : "Resource Already Claimed"}
                  </button>
                ) : (
                  <button
                    onClick={handleClaim}
                    className="w-full py-3.5 rounded-xl text-black bg-emerald-500 hover:bg-emerald-400 font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/10 transition-all duration-200 transform active:scale-98"
                  >
                    Claim Resource Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Vendor Details Section Below */}
          <div className="mt-8 bg-zinc-900/10 border border-zinc-900/60 rounded-2xl p-6">
            <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
              <MdBusiness className="text-zinc-400 w-4 h-4" /> Provider Profile Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <MdPerson className="text-zinc-600 shrink-0 w-4 h-4" />
                <div className="truncate">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Contact Person</p>
                  <p className="text-zinc-300 font-medium">{item.vendor?.name || "Unknown Vendor"}</p>
                </div>
              </div>

              {item.vendor?.email && (
                <div className="flex items-center gap-2.5 min-w-0">
                  <MdEmail className="text-zinc-600 shrink-0 w-4 h-4" />
                  <div className="truncate">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email Address</p>
                    <p className="text-blue-400 font-medium truncate" title={item.vendor.email}>{item.vendor.email}</p>
                  </div>
                </div>
              )}

              {item.vendor?.organisation && (
                <div className="flex items-center gap-2.5 min-w-0">
                  <MdBusiness className="text-zinc-600 shrink-0 w-4 h-4" />
                  <div className="truncate">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Organization</p>
                    <p className="text-zinc-300 font-medium truncate">{item.vendor.organisation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 max-w-sm mx-auto">
          <p className="text-rose-400 font-medium">Item details could not be parsed or found.</p>
        </div>
      )}
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3.5 bg-zinc-900/50 border border-zinc-800/80 px-4 py-3 rounded-xl">
    <div className="shrink-0 text-zinc-400">{icon}</div>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-zinc-200 font-semibold truncate capitalize">{value || "N/A"}</span>
    </div>
  </div>
);

export default Getitembyid;