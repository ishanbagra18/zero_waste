import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdBusiness,
  MdCloudUpload,
  MdLock,
  MdArrowBack,
  MdCheckCircle,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/myprofile");
  };

  // Extract User Metadata safely from JWT
  useEffect(() => {
    if (!token) return;
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid Token Format");

      const payload = JSON.parse(atob(parts[1]));
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
      toast.error("Error decoding user information session.");
    }
  }, [token]);

  // Handle text entries and file streams cleanly
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, photo: file }));

      // Clean up previous preview object URL memory references
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Data validations
    if (!form.name || form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Invalid email address schema.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone number must be exactly 10 numeric digits.");
      return;
    }

    if (!form.organisation.trim()) {
      toast.error("Organisation verification field is required.");
      return;
    }

    if (!form.location.trim()) {
      toast.error("Operating operational location is required.");
      return;
    }

    if (!userId) {
      toast.error("Session Identification missing. Relog and retry.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      await axios.put(
        `http://localhost:3002/api/users/updateProfile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal server profile processing error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white px-4 sm:px-6 lg:px-8 py-10 selection:bg-emerald-500/30">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Control Toolbar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-emerald-400 text-sm font-medium px-4 py-2.5 rounded-xl shadow-md transition-all duration-200"
          >
            <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>

        {/* Master Profile Control Layout Card */}
        <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

          {/* Identity/Profile Preview Panel */}
          <aside className="md:w-1/3 p-8 bg-zinc-950/40 flex flex-col items-center justify-center gap-6 border-b md:border-b-0 md:border-r border-white/[0.08]">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-emerald-500/40 group-hover:border-emerald-400 transition duration-300 shadow-2xl">
                <img
                  src={photoPreview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Profile Avatar Target Preview"
                  className="w-full h-full object-cover bg-zinc-900"
                />
              </div>
            </div>

            <div className="text-center space-y-1.5 max-w-full px-2">
              <h3 className="text-2xl font-extrabold text-zinc-100 truncate">
                {form.name || "Identity Unset"}
              </h3>
              <p className="text-sm font-semibold tracking-wide text-emerald-400 uppercase truncate">
                {form.organisation || "Corporate Node"}
              </p>
            </div>

            <div className="w-full border-t border-white/[0.05] pt-4 flex flex-col gap-2 text-xs font-medium text-zinc-400">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.01] border border-white/[0.03] truncate">
                <span role="img" aria-label="Location">📍</span> <span className="truncate">{form.location || "Not Specifed"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.01] border border-white/[0.03] truncate">
                <span role="img" aria-label="Phone">📞</span> <span className="truncate">{form.phone || "Not Provided"}</span>
              </div>
            </div>

            <label className="cursor-pointer group mt-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition duration-200 shadow-sm">
              <MdCloudUpload className="text-emerald-400 text-sm group-hover:scale-110 transition-transform" />
              <span>Upload New Photo</span>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </aside>

          {/* Form Context Area */}
          <section className="md:w-2/3 p-6 sm:p-10 flex flex-col justify-between min-h-[520px]">
            <div>
              <header className="mb-6">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  Account Management
                </h2>
                <p className="text-zinc-400 text-sm mt-1">Configure individual directory metadata variables securely.</p>
              </header>

              {/* Navigation Tab Anchors */}
              <nav className="flex gap-2 border-b border-white/[0.06] mb-8" aria-label="Profile Tabs">
                {[
                  { id: "personal", label: "Personal Information" },
                  { id: "security", label: "Security & Credentials" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 text-sm font-semibold transition-all relative border-b-2 -mb-[2px] ${activeTab === tab.id
                        ? "border-emerald-500 text-emerald-400 font-bold"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Functional View Forms Container */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === "personal" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fadeIn">
                    <InputField
                      label="Legal Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      icon={<MdPerson />}
                      placeholder="e.g., Jane Doe"
                      autoComplete="name"
                    />
                    <InputField
                      label="Primary Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      icon={<MdEmail />}
                      placeholder="name@org.com"
                      autoComplete="email"
                    />
                    <InputField
                      label="Contact Phone Number"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      icon={<MdPhone />}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                    />
                    <InputField
                      label="Affiliated Organisation"
                      name="organisation"
                      value={form.organisation}
                      onChange={handleChange}
                      icon={<MdBusiness />}
                      placeholder="Company or Group Name"
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        label="Operational Base Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        icon={<MdLocationOn />}
                        placeholder="City, State, Country"
                        autoComplete="street-address"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-4 max-w-md animate-fadeIn">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                        Change Password
                      </label>
                      <div className="flex items-center gap-3 bg-zinc-900/50 px-3.5 py-3 rounded-xl border border-zinc-800 text-zinc-500 cursor-not-allowed select-none">
                        <MdLock className="text-lg" />
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          disabled
                          className="bg-transparent outline-none flex-1 text-sm text-zinc-600 cursor-not-allowed w-full"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-xs leading-relaxed">
                      ⚠️ <strong>System Notice:</strong> Multi-factor Authentication (2FA) and cryptographic profile update controls are currently locked down by global administration configurations and will release shortly.
                    </div>
                  </div>
                )}

                {/* Submissions Action Block Footer */}
                <div className="pt-6 border-t border-white/[0.05] flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || activeTab !== "personal"}
                    className="w-full sm:w-auto min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-700/50 border border-transparent font-semibold text-sm rounded-xl text-white transition-all duration-150 active:scale-[0.98] shadow-md shadow-emerald-950/20"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <MdCheckCircle className="text-base" />
                        <span>Save System Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Reusable Controlled Input Field Component Structure
function InputField({ label, name, type = "text", value, onChange, icon, placeholder, autoComplete }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
        {label}
      </label>
      <div className="group flex items-center gap-3 bg-zinc-900/40 focus-within:bg-zinc-900/90 px-3.5 py-2.5 rounded-xl border border-white/[0.06] focus-within:border-emerald-500/60 transition-all duration-150 shadow-inner">
        <span className="text-zinc-500 group-focus-within:text-emerald-400 text-lg transition-colors duration-150 shrink-0">
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="bg-transparent outline-none flex-1 text-zinc-100 text-sm placeholder-zinc-600 w-full"
        />
      </div>
    </div>
  );
}