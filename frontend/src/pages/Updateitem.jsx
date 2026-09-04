import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  Upload,
  ArrowLeft,
  CheckCircle2,
  Package,
  Layers,
  MapPin,
  Tag,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

export default function Updateitem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    location: "",
    category: "",
    status: "available",
    mode: "donation",
  });

  const [oldImageUrl, setOldImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/items/get-item/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const item = res.data.item;

        setFormData({
          name: item.name || "",
          description: item.description || "",
          price: item.price || 0,
          quantity: item.quantity || 0,
          location: item.location || "",
          category: item.category || "",
          status: item.status || "available",
          mode: item.mode || "donation",
        });

        setOldImageUrl(item.itemImage?.url || "");
      } catch (err) {
        toast.error("Failed to load item details");
        console.error(err);
      }
    };

    fetchItem();
  }, [id, token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      for (let key in formData) {
        form.append(key, formData[key]);
      }
      if (newImageFile) {
        form.append("itemImage", newImageFile);
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/items/update-item/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Item updated successfully!");
      setTimeout(() => navigate("/vendor/dashboard"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <ParallaxHero
        badgeText="Vendor Asset Management"
        title={
          <>
            Update Item <span className="text-emerald-400">Specifications</span>
          </>
        }
        subtitle="Modify listing parameters, update volume quantities, price points, and photo assets."
        actionButtons={
          <button
            onClick={() => navigate("/vendor/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Vendor Dashboard
          </button>
        }
      />

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start"
      >
        {/* Photo Upload Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Item Asset Photo
          </span>

          <div className="w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative group">
            <img
              src={newImagePreview || oldImageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}
              alt="Item Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <label className="w-full py-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider cursor-pointer text-center block transition shadow-md">
            Upload Replacement Photo
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {/* Inputs Column */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Textile">Textile</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="donation">Donation</option>
                <option value="sale">Sale</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="available">Available</option>
                <option value="claimed">Claimed</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Updating Item...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 text-slate-950" /> Update Item Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
