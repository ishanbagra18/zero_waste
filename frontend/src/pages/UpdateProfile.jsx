import { useEffect, useState } from "react";
import api from "../util/api";
import { useNavigate } from "react-router-dom";

import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdBusiness,
  MdCloudUpload,
  MdLock,
} from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";

export default function UpdateProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    organisation: "",
    photo: null,
  });

  const [userId, setUserId] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/vendor/dashboard");
  };

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.userId) {
        setUserId(payload.userId);
        setForm({
          name: payload.name || "",
          email: payload.email || "",
          phone: payload.phone || "",
          organisation: payload.organisation || "",
          location: payload.location || "",
          photo: null,
        });
      }
    } catch (err) {
      toast.error("Error decoding user information.");
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setForm({ ...form, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.name || form.name.length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid email format.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Phone must be a 10-digit number.");
      return;
    }

    if (!form.organisation) {
      toast.error("Organisation is required.");
      return;
    }

    if (!form.location) {
      toast.error("Location is required.");
      return;
    }

    if (!userId) {
      toast.error("User ID missing from token.");
      return;
    }

    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      await api.put(
        `/api/users/updateProfile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-10">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition hover:shadow-emerald-400/40"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Profile Side */}
        <div className="md:w-1/3 p-8 bg-gray-900 flex flex-col items-center justify-center gap-6 border-r border-white/10">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-green-500 hover:border-purple-500 transition-all duration-500 shadow-xl">
            <img
              src={
                photoPreview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold">
              {form.name || "Your Name"}
            </h3>
            <p className="text-green-400">{form.organisation || "Organisation"}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-sm">
            {form.location && (
              <span className="bg-green-800/30 border border-green-500 px-3 py-1 rounded-full">
                📍 {form.location}
              </span>
            )}
            {form.phone && (
              <span className="bg-green-800/30 border border-green-500 px-3 py-1 rounded-full">
                📞 {form.phone}
              </span>
            )}
            {form.email && (
              <span className="bg-green-800/30 border border-green-500 px-3 py-1 rounded-full">
                📧 {form.email}
              </span>
            )}
          </div>

          <label className="cursor-pointer text-sm text-gray-300 flex items-center gap-2 hover:underline mt-4">
            <MdCloudUpload />
            Upload New Photo
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form Side */}
        <form
          onSubmit={handleSubmit}
          className="md:w-2/3 p-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <h2 className="col-span-2 text-3xl font-bold text-green-400 mb-2">
            Edit Profile
          </h2>

          {/* Tabs */}
          <div className="col-span-2 flex gap-4 mb-2 border-b border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === "personal"
                  ? "border-b-2 border-green-500 text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Personal Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === "security"
                  ? "border-b-2 border-green-500 text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Security
            </button>
          </div>

          {/* Tab: Personal Info */}
          {activeTab === "personal" && (
            <>
              <InputField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                icon={<MdPerson />}
              />
              <InputField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                icon={<MdEmail />}
              />
              <InputField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                icon={<MdPhone />}
              />
              <InputField
                label="Organisation"
                name="organisation"
                value={form.organisation}
                onChange={handleChange}
                icon={<MdBusiness />}
              />
              <InputField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                icon={<MdLocationOn />}
              />
            </>
          )}

          {/* Tab: Security */}
          {activeTab === "security" && (
            <>
              <div className="col-span-2 text-sm text-gray-400">
                <label className="block mb-2">Change Password (coming soon)</label>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-gray-700 opacity-50">
                  <MdLock />
                  <input
                    type="password"
                    placeholder="New password"
                    disabled
                    className="bg-transparent outline-none flex-1 text-white"
                  />
                </div>
              </div>
              <p className="col-span-2 text-yellow-400 text-sm mt-4">
                🔒 Password management and 2FA will be added soon.
              </p>
            </>
          )}

          {/* Submit Button */}
          <div className="col-span-2 mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300"
            >
              ✅ Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ Reusable InputField component
function InputField({ label, name, value, onChange, icon }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-gray-700">
        {icon}
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          required
          className="bg-transparent outline-none flex-1 text-white"
        />
      </div>
    </div>
  );
}
