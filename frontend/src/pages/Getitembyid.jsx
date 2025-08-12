// (File: Getitembyid.jsx)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import api from "../util/api";
import {
  MdLocationOn,
  MdCategory,
  MdShoppingCart,
  MdPriceChange,
  MdSyncAlt,
  MdCheckCircle,
  MdCancel,
  MdArrowBack,
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
      const res = await api.get(`/api/items/get-item/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    message: "Are you sure you want to claim this item?",
    buttons: [
      {
        label: "Yes, Claim",
        onClick: async () => {
          try {
            const response = await api.patch(
              `/api/items/${id}/claim`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            toast.success("Item claimed successfully!");
            fetchItemById();
          } catch (error) {
            console.error("Error claiming item:", error);
            toast.error(
              error.response?.data?.message || "Failed to claim item."
            );
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
    <div className="min-h-screen font-sans relative bg-[#0a101a]">
      <Toaster />
      {loading ? (
        <div className="flex flex-col h-screen items-center justify-center">
          <div className="loader mb-4"></div>
          <span className="text-gray-300 text-xl">Loading item details...</span>
        </div>
      ) : item ? (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#121826] via-[#1a2239] to-[#21263b] relative pb-12 sm:pb-10">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${
                item.itemImage?.url || "/images/no-image.png"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(7px) brightness(0.45)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <div className="relative z-20 flex justify-center items-start px-3 sm:px-6 pt-10 sm:pt-20">
            <div className="w-full max-w-2xl rounded-3xl bg-[#181c27]/95 shadow-2xl backdrop-blur-2xl ring-1 ring-blue-700/20 relative flex flex-col items-center pb-10 border border-[#23294e]/50">
              <div className="w-full h-72 rounded-t-3xl overflow-hidden relative border-b border-[#23294e]/60">
                <img
                  src={item.itemImage?.url || "/images/no-image.png"}
                  alt={item.name || "No image"}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/no-image.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#181c27]/80 to-transparent" />
                <button
                  onClick={() => navigate(-1)}
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 text-gray-100 hover:bg-indigo-900/90 transition shadow-sm font-medium"
                  aria-label="Back"
                >
                  <MdArrowBack size={21} />
                  Back
                </button>
              </div>

              <div className="w-full pt-10 px-6 pb-8 flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-emerald-400 mb-1 tracking-tight">
                  {item.name}
                </h1>
                <p className="mb-3 text-gray-300 italic">
                  {item.description || "No description provided."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-3">
                  <DetailCard
                    icon={<MdCategory size={22} className="text-cyan-400" />}
                    label="Category"
                    value={item.category}
                  />
                  <DetailCard
                    icon={<MdLocationOn size={22} className="text-blue-400" />}
                    label="Location"
                    value={item.location}
                  />
                  <DetailCard
                    icon={<MdShoppingCart size={22} className="text-pink-400" />}
                    label="Quantity"
                    value={item.quantity}
                  />
                  <DetailCard
                    icon={<MdPriceChange size={22} className="text-yellow-300" />}
                    label="Price"
                    value={`₹${item.price}`}
                  />
                  <DetailCard
                    icon={<MdSyncAlt size={22} className="text-orange-300" />}
                    label="Mode"
                    value={item.mode}
                  />
                  <DetailCard
                    icon={
                      item.status === "available" ? (
                        <MdCheckCircle size={22} className="text-green-400" />
                      ) : (
                        <MdCancel size={22} className="text-red-400" />
                      )
                    }
                    label="Status"
                    value={
                      item.status === "available"
                        ? "Available"
                        : item.status?.charAt(0).toUpperCase() +
                          item.status?.slice(1)
                    }
                  />
                </div>

                {/* Claim Button: updated logic based on item.status */}
                <div className="w-full flex justify-center my-4">
                  {item.status !== "available" ? (
                    <button
                      disabled
                      className="px-10 py-3 rounded-2xl text-gray-400 bg-[#23294e]/80 cursor-not-allowed font-semibold text-lg shadow-xl border-2 border-gray-500/80"
                      aria-disabled="true"
                    >
                      Already Claimed
                    </button>
                  ) : (
                    <button
                      onClick={handleClaim}
                      className="px-10 py-3 rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-500 hover:to-blue-600 font-bold text-lg shadow-2xl border-2 border-emerald-800 transition"
                    >
                      Claim Now
                    </button>
                  )}
                </div>

                <div className="w-full px-2 pt-5 border-t border-[#23294e]/60 text-sm space-y-1.5">
                  <p>
                    <span className="font-semibold text-emerald-400">Vendor:</span>{" "}
                    <span className="px-2 py-0.5 rounded-full bg-[#21263b] text-gray-200">
                      {item.vendor?.name || "Unknown Vendor"}
                    </span>
                  </p>
                  {item.vendor?.email && (
                    <p>
                      <span className="font-semibold text-emerald-400">Email:</span>{" "}
                      <span className="text-blue-300">{item.vendor.email}</span>
                    </p>
                  )}
                  {item.vendor?.organisation && (
                    <p>
                      <span className="font-semibold text-emerald-400">
                        Organisation:
                      </span>{" "}
                      <span className="text-gray-300">
                        {item.vendor.organisation}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500 text-xl pt-32">
          Item details could not be loaded.
        </p>
      )}

      {/* Loader Animation */}
      <style>{`
        .loader {
          border: 3px solid #334155;
          border-top: 3px solid #10b981;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-[#23294e]/80 backdrop-blur px-4 py-3 rounded-2xl shadow border border-[#334155]/50">
    <div>{icon}</div>
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      <span className="text-md text-gray-100 font-medium">{value || "N/A"}</span>
    </div>
  </div>
);

export default Getitembyid;
