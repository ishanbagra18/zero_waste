import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  ShieldCheck,
  Lock,
  Upload,
  Leaf,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("vendor");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!photo) {
      toast.error("Please upload an verification photo or logo.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone.trim());
    formData.append("organisation", organisation.trim());
    formData.append("location", location.trim());
    formData.append("role", role);
    formData.append("password", password);
    formData.append("photo", photo);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const { token, user } = res.data;
      if (authLogin && token && user) {
        authLogin(token, user.role, user);
      } else {
        localStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
      }
      toast.success("Registration successful! Welcome to ZeroWaste.");
      setTimeout(() => {
        if (user.role === "vendor") {
          navigate("/vendor/dashboard");
        } else if (user.role === "NGO") {
          navigate("/ngo/dashboard");
        } else if (user.role === "Volunteer") {
          navigate("/volunteer/dashboard");
        }
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      const msg = err.response?.data?.message || "Registration failed. Please check form details.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white relative flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-x-hidden">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-2xl my-4">
        
        {/* Left Branding Panel */}
        <div className="lg:w-2/5 p-8 md:p-12 space-y-8 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border-b lg:border-b-0 lg:border-r border-slate-800/80 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                ZeroWaste Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                Zero Waste Movement
              </span>
            </h1>

            <p className="text-base text-emerald-200/90 font-medium leading-relaxed">
              Connect surplus food & items to those in need. Join our network of verified Vendors, NGOs, and Volunteers.
            </p>

            <ul className="space-y-3 text-xs md:text-sm text-slate-300 pt-2">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Instant match for food surplus listings</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Live dispatch logistics & tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Impact metrics for carbon & weight saved</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Verified Ecosystem</span>
            </div>
            <p>Empowering local food security and reducing environmental waste nationwide.</p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} ZeroWaste Portal. All rights reserved.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:w-3/5 w-full p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-slate-900/60 backdrop-blur-xl">
          <div className="mb-6 space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Account Registration
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-sm text-slate-400">Fill in your details to get started on ZeroWaste</p>
          </div>

          {error && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs md:text-sm px-4 py-3 rounded-2xl font-semibold text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
            {/* Grid Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Full Name
                </label>
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
                  <User className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-transparent flex-1 outline-none text-sm text-white placeholder-slate-500"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-transparent flex-1 outline-none text-sm text-white placeholder-slate-500"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Grid Row 2: Phone & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Phone Number
                </label>
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-transparent flex-1 outline-none text-sm text-white placeholder-slate-500"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  City / Location
                </label>
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="New York, USA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="bg-transparent flex-1 outline-none text-sm text-white placeholder-slate-500"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Grid Row 3: Organisation & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Organisation / Business
                </label>
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
                  <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Green Harvest Bakery"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    required
                    className="bg-transparent flex-1 outline-none text-sm text-white placeholder-slate-500"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Role
                </label>
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-transparent flex-1 outline-none text-sm text-white cursor-pointer"
                  >
                    <option value="vendor" className="bg-slate-900 text-white">Vendor (Business / Supplier)</option>
                    <option value="NGO" className="bg-slate-900 text-white">NGO (Charity / Non-Profit)</option>
                    <option value="Volunteer" className="bg-slate-900 text-white">Volunteer (Logistics Driver)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid Row 4: Password & Photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
                  <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-transparent flex-1 outline-none text-sm text-white placeholder-slate-500"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="focus:outline-none text-slate-500 hover:text-emerald-400 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Photo Upload Zone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Profile Photo / Logo
                </label>
                <label className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 hover:border-emerald-500/80 transition cursor-pointer shadow-inner group">
                  <Upload className="w-5 h-5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-400 truncate flex-1 font-medium">
                    {photo ? photo.name : "Choose image file..."}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    required
                    className="hidden"
                  />
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    Browse
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 font-black text-slate-950 rounded-2xl shadow-xl shadow-emerald-500/20 text-sm md:text-base uppercase tracking-wider transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center text-xs md:text-sm text-slate-400 pt-2">
              Already registered?{" "}
              <Link to="/" className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1">
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
