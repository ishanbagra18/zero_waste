import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { MdErrorOutline, MdCheckCircle } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const CreateItem = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "itemImage") {
      const file = files[0];
      setForm((prev) => ({ ...prev, itemImage: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };



  const handlebutton = async () => {
  navigate("/vendor/dashboard");
}





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
    if (!isFormValid()) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
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
      console.error("❌ Create item error:", err);
      toast.error(
        err.response?.data?.message || "Failed to create item. Check console."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white px-6 py-12 relative">
      <Toaster />

      <button
      onClick={handlebutton}
      className="bg-purple-500 hover:bg-purple-600 text-black font-semibold px-8 py-3 rounded-xl shadow-md transition duration-300 hover:shadow-emerald-400/40"
    >
      Back
    </button>



      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl border border-indigo-500 shadow-2xl max-w-md w-full text-center relative">
            <IoMdClose
              className="text-gray-400 text-2xl absolute top-4 right-4 cursor-pointer hover:text-white"
              onClick={() => setShowModal(false)}
            />
            <MdCheckCircle className="text-indigo-400 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Item Created Successfully!</h2>
            <p className="text-gray-300 mb-6">You can now manage it from your dashboard.</p>
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto border border-gray-800 rounded-2xl shadow-2xl bg-gray-900/80 backdrop-blur-lg p-8">
        <h2 className="text-4xl font-bold mb-10 text-indigo-400 text-center">
          Create a New Item Listing
        </h2>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Image Preview */}
          <div className="md:w-5/12 flex flex-col items-center gap-4">
            <div className="w-full h-60 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Image Preview</span>
              )}
            </div>

            <label className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-md cursor-pointer text-center transition duration-200 text-sm">
              Upload Image
              <input
                type="file"
                name="itemImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            {touched.itemImage && !form.itemImage && (
              <div className="text-red-400 text-sm flex items-center gap-1">
                <MdErrorOutline />
                Image is required.
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="md:w-7/12 space-y-6">
            <div className="bg-gray-800 p-5 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                Basic Information
              </h3>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Item Name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className="w-full bg-gray-700 rounded-md px-4 py-2 mt-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                {touched.name && (
                  <span className="absolute top-3 right-3 text-xl">
                    {form.name ? (
                      <MdCheckCircle className="text-indigo-400" />
                    ) : (
                      <MdErrorOutline className="text-red-400" />
                    )}
                  </span>
                )}
              </div>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-4 py-2 mt-3 resize-none h-24 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div className="bg-gray-800 p-5 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                Item Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "quantity", placeholder: "Quantity", type: "number" },
                  { name: "price", placeholder: "Price", type: "number" },
                  { name: "location", placeholder: "Location", type: "text" },
                ].map(({ name, placeholder, type }) => (
                  <div key={name} className="relative">
                    <input
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      onBlur={() => setTouched({ ...touched, [name]: true })}
                      className="bg-gray-700 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    {touched[name] && (
                      <span className="absolute top-2.5 right-3 text-xl">
                        {form[name] ? (
                          <MdCheckCircle className="text-indigo-400" />
                        ) : (
                          <MdErrorOutline className="text-red-400" />
                        )}
                      </span>
                    )}
                  </div>
                ))}

                {[
                  { name: "category", options: ["Food", "Textile", "Books", "Other"] },
                  { name: "mode", options: ["donation", "sale"] },
                  {
                    name: "status",
                    options: ["available", "claimed", "completed", "expired"],
                  },
                ].map(({ name, options }) => (
                  <div key={name} className="relative">
                    <select
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      onBlur={() => setTouched({ ...touched, [name]: true })}
                      className="bg-gray-700 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                      <option value="">Select {name}</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {touched[name] && name !== "status" && (
                      <span className="absolute top-2.5 right-3 text-xl">
                        {form[name] ? (
                          <MdCheckCircle className="text-indigo-400" />
                        ) : (
                          <MdErrorOutline className="text-red-400" />
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-10">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-3 px-10 rounded-lg shadow-lg transition duration-200"
          >
            ☑️ Create Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
