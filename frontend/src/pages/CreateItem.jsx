import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { 
  MdErrorOutline, 
  MdCheckCircle, 
  MdArrowBack, 
  MdCloudUpload,
  MdLayers,
  MdInfoOutline
} from "react-icons/md";
import { IoMdClose } from "react-icons/io";

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
    price: "",
    mode: "",
    location: "",
    status: "available",
    itemImage: null,
  });

  const [touched, setTouched] = useState({});

  // Explicitly garbage-collect string URL object references on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "itemImage" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, itemImage: file }));
      
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else if (name === "mode") {
      // Dynamic logic: Auto-zero and touch the price if listing mode defaults to a donation
      setForm((prev) => ({
        ...prev,
        mode: value,
        price: value === "donation" ? "0" : prev.price
      }));
      if (value === "donation") {
        setTouched((prev) => ({ ...prev, price: true }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateField = (name, value) => {
    if (["name", "quantity", "price", "location", "category", "mode"].includes(name)) {
      return value?.toString().trim() !== "";
    }
    if (name === "itemImage") return !!value;
    return true;
  };

  const isFormValid = () => {
    return Object.entries(form).every(([key, val]) => validateField(key, val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Trigger full validation visual checks
    const fullTouches = {};
    Object.keys(form).forEach((k) => { fullTouches[k] = true; });
    setTouched(fullTouches);

    if (!isFormValid()) {
      toast.error("Please fill in all mandatory listing parameters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3002/api/items/create-item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setShowModal(true);
    } catch (err) {
      console.error("Create item fault:", err);
      toast.error(err.response?.data?.message || "Failed to finalize your new catalog item entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white px-4 sm:px-6 lg:px-8 py-10 selection:bg-indigo-500/30">
      <Toaster position="top-right" />

      {/* Control Navigation Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate("/vendor/dashboard")}
          className="group inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-indigo-400 text-sm font-medium px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <MdArrowBack className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      {/* Modal Success Mask Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 p-8 rounded-3xl border border-white/[0.08] shadow-2xl max-w-md w-full text-center relative">
            <button 
              onClick={() => setShowModal(false)}
              className="text-slate-400 hover:text-white absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 transition"
              aria-label="Close modal dialog"
            >
              <IoMdClose size={22} />
            </button>
            <MdCheckCircle className="text-emerald-400 text-6xl mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-black tracking-tight mb-2">Item Listed on Ledger</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Your resource variables compiled and synced successfully. It is now active across the exchange network.
            </p>
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold text-sm py-3 px-6 rounded-xl transition shadow-lg shadow-indigo-950/40"
            >
              Return to Dashboard View
            </button>
          </div>
        </div>
      )}

      {/* Primary Configuration Panel */}
      <form 
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto border border-white/[0.06] rounded-3xl shadow-2xl bg-white/[0.02] backdrop-blur-xl p-6 sm:p-10 space-y-8"
      >
        <header className="border-b border-white/[0.05] pb-6 text-center sm:text-left">
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-400">
            Create Item Listing
          </h1>
          <p className="text-slate-400 text-sm mt-1">Register excess inventories or assets for active network circulation.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Block: Image Pipeline */}
          <div className="lg:w-5/12 flex flex-col items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 self-start">
              Resource Photo asset
            </span>
            <div className="w-full h-64 bg-slate-950/60 rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col items-center justify-center p-2 relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Transient asset visual preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center space-y-2 pointer-events-none p-4">
                  <MdCloudUpload className="text-4xl text-slate-600 mx-auto group-hover:text-indigo-400 transition-colors" />
                  <p className="text-xs font-medium text-slate-500">No active item texture assigned yet</p>
                </div>
              )}
            </div>

            <label className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl cursor-pointer text-center transition shadow-sm">
              Upload Image Asset
              <input
                type="file"
                name="itemImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            {touched.itemImage && !form.itemImage && (
              <div className="text-red-400 text-xs font-medium flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg w-full">
                <MdErrorOutline className="text-sm shrink-0" />
                <span>An explicit image attachment is required.</span>
              </div>
            )}
          </div>

          {/* Right Block: Properties Parameters */}
          <div className="lg:w-7/12 flex flex-col gap-6">
            
            {/* Section: Text Metadata */}
            <fieldset className="bg-white/[0.01] border border-white/[0.04] p-5 sm:p-6 rounded-2xl space-y-4">
              <legend className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-2 flex items-center gap-1.5">
                <MdInfoOutline /> Descriptive Profiles
              </legend>
              
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  placeholder="Item Listing Name (e.g., Organic Surplus Apples)"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  className="w-full bg-slate-950/40 focus:bg-slate-950/90 rounded-xl border border-white/[0.06] focus:border-indigo-500/60 px-4 py-3 text-sm text-zinc-100 placeholder-slate-600 outline-none transition"
                  required
                />
                {touched.name && (
                  <span className="absolute right-3.5 top-3.5 text-base">
                    {form.name ? <MdCheckCircle className="text-indigo-400" /> : <MdErrorOutline className="text-red-400" />}
                  </span>
                )}
              </div>

              <textarea
                name="description"
                placeholder="Detailed item logs, expiry parameters, structural specifications, or handling condition limits..."
                value={form.description}
                onChange={handleChange}
                className="w-full bg-slate-950/40 focus:bg-slate-950/90 rounded-xl border border-white/[0.06] focus:border-indigo-500/60 px-4 py-3 text-sm text-zinc-100 placeholder-slate-600 outline-none h-28 resize-none transition"
              />
            </fieldset>

            {/* Section: Data Fields Grid */}
            <fieldset className="bg-white/[0.01] border border-white/[0.04] p-5 sm:p-6 rounded-2xl space-y-4">
              <legend className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-2 flex items-center gap-1.5">
                <MdLayers /> Quantitative Metrics
              </legend>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Mode Selector */}
                <div className="relative group">
                  <select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, mode: true }))}
                    className="w-full bg-slate-950/40 rounded-xl border border-white/[0.06] px-4 py-3 text-sm outline-none cursor-pointer appearance-none text-zinc-100"
                    required
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-500">Transaction Mode</option>
                    <option value="donation" className="bg-slate-900 text-zinc-200">Donation Asset</option>
                    <option value="sale" className="bg-slate-900 text-zinc-200">Commercial Sale</option>
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-[10px] text-slate-500">▼</div>
                </div>

                {/* Pricing Block */}
                <div className="relative group">
                  <input
                    type="number"
                    name="price"
                    disabled={form.mode === "donation"}
                    placeholder={form.mode === "donation" ? "Free (Donation)" : "Price ($)"}
                    value={form.price}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, price: true }))}
                    className="w-full bg-slate-950/40 disabled:bg-zinc-900/30 rounded-xl border border-white/[0.06] focus:border-indigo-500/60 px-4 py-3 text-sm outline-none transition text-zinc-100 placeholder-slate-600 disabled:text-emerald-400 disabled:font-medium disabled:cursor-not-allowed"
                    min="0"
                    required
                  />
                  {touched.price && (
                    <span className="absolute right-3.5 top-3.5 text-base">
                      {form.price ? <MdCheckCircle className="text-indigo-400" /> : <MdErrorOutline className="text-red-400" />}
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="relative group">
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity Volume"
                    value={form.quantity}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, quantity: true }))}
                    className="w-full bg-slate-950/40 rounded-xl border border-white/[0.06] focus:border-indigo-500/60 px-4 py-3 text-sm outline-none transition text-zinc-100 placeholder-slate-600"
                    min="1"
                    required
                  />
                  {touched.quantity && (
                    <span className="absolute right-3.5 top-3.5 text-base">
                      {form.quantity ? <MdCheckCircle className="text-indigo-400" /> : <MdErrorOutline className="text-red-400" />}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className="relative group">
                  <input
                    type="text"
                    name="location"
                    placeholder="Pickup / Supply Location"
                    value={form.location}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, location: true }))}
                    className="w-full bg-slate-950/40 rounded-xl border border-white/[0.06] focus:border-indigo-500/60 px-4 py-3 text-sm outline-none transition text-zinc-100 placeholder-slate-600"
                    required
                  />
                  {touched.location && (
                    <span className="absolute right-3.5 top-3.5 text-base">
                      {form.location ? <MdCheckCircle className="text-indigo-400" /> : <MdErrorOutline className="text-red-400" />}
                    </span>
                  )}
                </div>

                {/* Category Selection */}
                <div className="relative group">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, category: true }))}
                    className="w-full bg-slate-950/40 rounded-xl border border-white/[0.06] px-4 py-3 text-sm outline-none cursor-pointer appearance-none text-zinc-100"
                    required
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-500">Resource Category</option>
                    {["Food", "Textile", "Books", "Other"].map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-zinc-200">{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-[10px] text-slate-500">▼</div>
                </div>

                {/* Status Indicator */}
                <div className="relative group">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-slate-950/40 rounded-xl border border-white/[0.06] px-4 py-3 text-sm outline-none cursor-pointer appearance-none text-zinc-100"
                  >
                    {["available", "claimed", "completed", "expired"].map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-zinc-200">Status: {opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-[10px] text-slate-500">▼</div>
                </div>

              </div>
            </fieldset>

          </div>
        </div>

        {/* Global Submission Form Footer Trigger */}
        <div className="pt-6 border-t border-white/[0.05] flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[200px] bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-700/50 border border-transparent text-sm font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Finalize Network Listing</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}