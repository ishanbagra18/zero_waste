import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  Upload,
  ArrowLeft,
  CheckCircle2,
  Package,
  Layers,
  MapPin,
  Tag,
  IndianRupee,
  FileText,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

export default function CreateItem() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
    price: "0",
    mode: "donation",
    location: "",
    status: "available",
    expiryDate: "",
    isUrgent: false,
    itemImage: null,
  });

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "itemImage" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, itemImage: file }));
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else if (name === "mode") {
      setForm((prev) => ({
        ...prev,
        mode: value,
        price: value === "donation" ? "0" : (prev.price === "0" ? "" : prev.price),
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!form.name || !form.quantity || !form.category || !form.location || !form.itemImage) {
      toast.error("Please fill in all required fields including the item photo.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      const finalPrice = form.mode === "donation" ? "0" : (form.price || "0");

      Object.entries(form).forEach(([key, value]) => {
        if (key === "price") {
          formData.append("price", finalPrice);
        } else {
          formData.append(key, value);
        }
      });

      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/items/create-item`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setShowModal(true);
    } catch (err) {
      console.error("Create item fault:", err);
      toast.error(err.response?.data?.message || "Failed to post new surplus item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <ParallaxHero
        badgeText="Vendor Supply Console"
        title={
          <>
            Post New <span className="text-emerald-400">Surplus Item</span>
          </>
        }
        subtitle="Register excess inventory for non-profit claim requests, logistics transport, and community waste reduction."
        actionButtons={
          <button
            onClick={() => navigate("/vendor/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Vendor Dashboard
          </button>
        }
      />

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-500/40 shadow-2xl max-w-md w-full text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">Item Listed Successfully!</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your surplus item is now active across the exchange network for NGOs to request claims.
            </p>
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-500/20"
            >
              Return to Vendor Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start"
      >
        {/* Photo Upload Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Item Asset Photo <span className="text-emerald-400">*</span>
          </span>

          <div className="w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center relative group">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-2 pointer-events-none p-4">
                <Upload className="w-10 h-10 text-slate-600 mx-auto group-hover:text-emerald-400 transition-colors" />
                <p className="text-xs text-slate-500 font-medium">Click below to attach an item image</p>
              </div>
            )}
          </div>

          <label className="w-full py-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider cursor-pointer text-center block transition shadow-md">
            Select Photo File
            <input type="file" name="itemImage" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
        </div>

        {/* Inputs Column */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Item Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Organic Bakery Surplus Bread"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              placeholder="Provide item specs, packaging details, expiry guidelines..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Quantity <span className="text-emerald-400">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Volume Qty"
                value={form.quantity}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Category <span className="text-emerald-400">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="" disabled>Select Category</option>
                <option value="Food">Food</option>
                <option value="Textile">Textile</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Transaction Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="donation">Donation Asset</option>
                <option value="sale">Commercial Sale</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Price (₹)</label>
              <input
                type="number"
                name="price"
                disabled={form.mode === "donation"}
                placeholder={form.mode === "donation" ? "Free (Donation)" : "Price (₹)"}
                value={form.price}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pickup Location Address <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Sector 5, Industrial Area"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Expiry Date / Time Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Expiry Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition cursor-pointer"
              />
            </div>

            {/* Urgent Pickup Tag Toggle */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-rose-400" /> Priority Status Tag
              </label>
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-700 cursor-pointer hover:border-amber-500/50 transition">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={form.isUrgent}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  ⚡ Mark as Urgent (Expiring within hours)
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Publishing Listing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950" /> Publish Item to Network
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}