import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Upload,
  Lock,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import ParallaxHero from "../components/ParallaxHero";

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
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const navigate = useNavigate();

  const handleBack = () => {
    if (role === "vendor") navigate("/vendor/dashboard");
    else if (role === "ngo") navigate("/ngo/dashboard");
    else if (role === "volunteer") navigate("/volunteer/dashboard");
    else navigate("/myprofile");
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
        `${import.meta.env.VITE_API_BASE_URL}/api/users/updateProfile/${userId}`,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header Section with Back Button */}
      <ParallaxHero
        badgeText="Profile Control Console"
        title={
          <>
            Update Your <span className="text-emerald-400">Account Profile</span>
          </>
        }
        subtitle="Configure your personal identity, contact channels, organisation details, and operational location."
        actionButtons={
          <button
            onClick={handleBack}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            Back to Dashboard
          </button>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Master Profile Control Layout Card */}
        <div className="w-full bg-slate-900/90 border border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          {/* Identity/Profile Preview Panel */}
          <aside className="md:w-1/3 p-8 bg-slate-950/60 flex flex-col items-center justify-center gap-6 border-b md:border-b-0 md:border-r border-slate-800">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-emerald-500/40 group-hover:border-emerald-400 transition duration-300 shadow-2xl bg-slate-950">
                <img
                  src={photoPreview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Profile Avatar Target Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center space-y-1.5 max-w-full px-2">
              <h3 className="text-xl font-extrabold text-white truncate">
                {form.name || "Identity Unset"}
              </h3>
              <p className="text-xs font-bold tracking-wide text-emerald-400 uppercase truncate">
                {form.organisation || "Corporate Node"}
              </p>
            </div>

            <div className="w-full border-t border-slate-800/80 pt-4 flex flex-col gap-2 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 truncate">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{form.location || "Not Specified"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 truncate">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{form.phone || "Not Provided"}</span>
              </div>
            </div>

            <label className="cursor-pointer group mt-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition duration-200 shadow-sm">
              <Upload className="text-emerald-400 w-4 h-4 group-hover:scale-110 transition-transform" />
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
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Account Details
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Configure individual directory metadata variables securely.</p>
              </header>

              {/* Navigation Tab Anchors */}
              <nav className="flex gap-2 border-b border-slate-800 mb-8" aria-label="Profile Tabs">
                {[
                  { id: "personal", label: "Personal Information" },
                  { id: "security", label: "Security & Credentials" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-bold transition-all relative border-b-2 -mb-[2px] cursor-pointer ${
                      activeTab === tab.id
                        ? "border-emerald-500 text-emerald-400 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Functional View Forms Container */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === "personal" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField
                      label="Legal Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      icon={<User className="w-4 h-4 text-emerald-400" />}
                      placeholder="e.g., Jane Doe"
                      autoComplete="name"
                    />
                    <InputField
                      label="Primary Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      icon={<Mail className="w-4 h-4 text-emerald-400" />}
                      placeholder="name@org.com"
                      autoComplete="email"
                    />
                    <InputField
                      label="Contact Phone Number"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      icon={<Phone className="w-4 h-4 text-emerald-400" />}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                    />
                    <InputField
                      label="Affiliated Organisation"
                      name="organisation"
                      value={form.organisation}
                      onChange={handleChange}
                      icon={<Building2 className="w-4 h-4 text-emerald-400" />}
                      placeholder="Company or Group Name"
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        label="Operational Base Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        icon={<MapPin className="w-4 h-4 text-emerald-400" />}
                        placeholder="City, State, Country"
                        autoComplete="street-address"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Change Password
                      </label>
                      <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 text-slate-500 cursor-not-allowed select-none">
                        <Lock className="w-4 h-4 text-slate-600" />
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          disabled
                          className="bg-transparent outline-none flex-1 text-xs text-slate-600 cursor-not-allowed w-full"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs leading-relaxed flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <strong className="text-amber-400 font-bold block mb-0.5">System Notice</strong>
                        Cryptographic profile update controls are currently managed by platform policies. To change password, use the Forgot Password recovery flow.
                      </div>
                    </div>
                  </div>
                )}

                {/* Submissions Action Block Footer */}
                <div className="pt-6 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || activeTab !== "personal"}
                    className="w-full sm:w-auto min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
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
      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
        {label}
      </label>
      <div className="group flex items-center gap-2.5 bg-slate-950 focus-within:bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
        <span className="shrink-0">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="bg-transparent outline-none flex-1 text-white text-xs md:text-sm placeholder-slate-500 w-full"
        />
      </div>
    </div>
  );
}