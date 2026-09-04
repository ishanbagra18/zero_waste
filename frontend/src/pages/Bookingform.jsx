import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  MapPin,
  FileText,
  Send,
  HeartHandshake,
  ShieldCheck,
  Info,
  ArrowLeft,
  CheckCircle2,
  Package,
  Sparkles,
  Tag,
  Building2,
  User,
} from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

export default function Bookingform() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlItemId = searchParams.get("itemId") || "";
  const urlFromLocation = searchParams.get("fromLocation") || "";
  const urlItemName = searchParams.get("itemName") || "";

  const [claimedItems, setClaimedItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(urlItemId);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  const [fromLocation, setFromLocation] = useState(urlFromLocation);
  const [toLocation, setToLocation] = useState("");
  const [notes, setNotes] = useState(urlItemName ? `Pickup request for claimed item: ${urlItemName}` : "");
  const [submitting, setSubmitting] = useState(false);
  const [loadingClaimed, setLoadingClaimed] = useState(true);

  // Fetch NGO's claimed items
  useEffect(() => {
    const fetchClaimedItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        setLoadingClaimed(true);
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/items/get-claimed-items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res.data.claimedItems || [];
        // Filter approved or active claimed items
        const approved = items.filter(
          (i) => i.claimStatus === "approved" || i.claimStatus === "claimed"
        );
        setClaimedItems(approved);

        // If urlItemId was passed, find it and select it
        if (urlItemId) {
          const match = items.find((i) => i._id === urlItemId);
          if (match) {
            setSelectedItemDetails(match);
            if (!fromLocation) setFromLocation(match.location || match.vendor?.location || "");
          }
        }
      } catch (err) {
        console.error("Error fetching claimed items:", err);
      } finally {
        setLoadingClaimed(false);
      }
    };

    fetchClaimedItems();
  }, [urlItemId]);

  // Handle item selection dropdown change
  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    setSelectedItemId(itemId);

    if (!itemId) {
      setSelectedItemDetails(null);
      return;
    }

    const item = claimedItems.find((i) => i._id === itemId);
    if (item) {
      setSelectedItemDetails(item);
      setFromLocation(item.location || item.vendor?.location || "");
      setNotes(`Pickup request for claimed item: ${item.name}`);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to book a volunteer.");
      return;
    }

    if (!id) {
      toast.error("Volunteer ID is missing.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/book/bookvolunteer/${id}`,
        {
          fromLocation,
          toLocation,
          notes,
          itemId: selectedItemId || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Volunteer booked successfully!");
      navigate("/ngo/dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <ParallaxHero
        badgeText={selectedItemId ? "Item Freight Booking" : "Volunteer Freight Dispatch"}
        title={
          <>
            Dispatch Freight <span className="text-emerald-400">Transport Request</span>
          </>
        }
        subtitle="Select a claimed surplus item and specify transit locations to assign a volunteer for regional food recovery."
        actionButtons={
          <button
            onClick={() => navigate("/ngo/bookvolunteer")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Volunteers
          </button>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          {/* Form Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create Transport Booking</h2>
                <p className="text-xs text-slate-400">Select an approved claimed item & enter pickup/destination details.</p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Claimed Item Selector Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Approved Claimed Item <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Package className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                  <select
                    value={selectedItemId}
                    onChange={handleItemSelect}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="">-- Choose Claimed Surplus Item --</option>
                    {claimedItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} (Qty: {item.quantity}) - {item.location || "Vendor Location"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Pickup Origin Location <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    placeholder="e.g. Vendor Store #4, Downtown Sector"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Destination Delivery Location <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <CheckCircle2 className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                  <input
                    type="text"
                    placeholder="e.g. NGO Community Kitchen, East Wing"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Waybill Notes / Instructions (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-5 h-5 absolute left-4 top-4 text-slate-500" />
                  <textarea
                    placeholder="e.g. Perishable chilled items. Call upon arrival..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Dispatching Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-slate-950" /> Send Booking Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Full Item Details Specification Card */}
          <div className="space-y-6">
            {selectedItemDetails ? (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Linked Surplus Item
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate">ID: {selectedItemDetails._id}</span>
                </div>

                {/* Item Image Preview */}
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                  <img
                    src={selectedItemDetails.itemImage?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}
                    alt={selectedItemDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{selectedItemDetails.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{selectedItemDetails.description || "Fresh surplus item."}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Category</p>
                    <p className="text-white font-semibold capitalize">{selectedItemDetails.category}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Quantity</p>
                    <p className="text-emerald-400 font-semibold">{selectedItemDetails.quantity}</p>
                  </div>
                </div>

                {/* Vendor Contact Info */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" /> Vendor Origin Station
                  </p>
                  <p className="text-white font-bold">{selectedItemDetails.vendor?.name || "Partner Vendor"}</p>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" /> {selectedItemDetails.location || selectedItemDetails.vendor?.location}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-400" /> Transport Pipeline Protocol
                </h3>

                <div className="space-y-3">
                  {[
                    { num: 1, title: "Select Claimed Item", desc: "Link the exact surplus food item to this transport run." },
                    { num: 2, title: "NGO Submits Request", desc: "Volunteer receives an instant booking notification with full item specs." },
                    { num: 3, title: "Automated OTP Signal", desc: "System generates a 6-digit OTP code sent directly to NGO." },
                    { num: 4, title: "OTP Verified Delivery", desc: "Upon arrival, volunteer inputs NGO's OTP code to complete job & update item status." },
                  ].map((step) => (
                    <div key={step.num} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {step.num}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{step.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
