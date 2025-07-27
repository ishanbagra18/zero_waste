import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const Updateitem = () => {
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

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/api/items/get-item/${id}`, {
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

    try {
      const form = new FormData();

      // Append all fields
      for (let key in formData) {
        form.append(key, formData[key]);
      }

      if (newImageFile) {
        form.append("itemImage", newImageFile); // Match your backend field name
      }

      await axios.put(
        `http://localhost:3002/api/items/update-item/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Item updated successfully!");
      setTimeout(() => navigate("/vendor/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] via-[#111827] to-[#1f2937] text-white px-6 py-10">
      <Toaster />

      <div className="max-w-5xl mx-auto bg-[#111827] border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
        {/* Image Preview */}
        <div className="w-full h-64 bg-black border-b border-gray-800">
          <img
            src={newImagePreview || oldImageUrl || "https://via.placeholder.com/500"}
            alt="Item Preview"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Form */}
        <div className="p-10">
          <h1 className="text-4xl font-bold text-emerald-400 text-center mb-10">
            ✏️ Update Item
          </h1>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-400">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Upload New Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md file:py-2 file:px-4 file:border-none file:bg-emerald-600 file:text-white"
                />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                >
                  <option value="">-- Select Category --</option>
                  <option value="Food">🍲 Food</option>
                  <option value="Textile">👕 Textile</option>
                  <option value="Books">📚 Books</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Mode</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                  >
                    <option value="donation">🎁 Donation</option>
                    <option value="sale">💰 Sale</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                  >
                    <option value="available">✅ Available</option>
                    <option value="claimed">📌 Claimed</option>
                    <option value="completed">✔️ Completed</option>
                    <option value="expired">⌛ Expired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="col-span-full pt-6">
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 text-lg font-semibold text-black rounded-lg transition-all duration-300"
              >
                🔄 Update Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Updateitem;
