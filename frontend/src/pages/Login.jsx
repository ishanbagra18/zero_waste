import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdLogin,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { Leaf, ArrowRight, KeyRound } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendor");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
        email,
        password,
        role,
      });
      const { token, user } = res.data;
      authLogin(token, user.role, user);
      toast.success("Login successful!");
      if (user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (user.role === "NGO") {
        navigate("/ngo/dashboard");
      } else if (user.role === "Volunteer") {
        navigate("/volunteer/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Ambient Eco Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Container Card */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-2xl my-4">
        
        {/* Left Branding Section */}
        <div className="md:w-1/2 p-8 md:p-12 space-y-6 flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border-b md:border-b-0 md:border-r border-slate-800/80 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">ZeroWaste Ecosystem</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Flip the Waste <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Script Today
            </span>
          </h1>

          <h2 className="text-sm md:text-base text-emerald-200/90 font-medium leading-relaxed">
            ♻️ Turning surplus food & physical resources into community support, one item at a time.
          </h2>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-400 italic">
            <p className="text-slate-300 font-semibold">"One platform. Zero waste. Infinite impact."</p>
            <p>Direct real-time redistribution connecting Vendors, NGOs, and Volunteer logistics.</p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 w-full p-8 md:p-12 space-y-6 flex flex-col justify-center bg-slate-900/60 backdrop-blur-xl"
        >
          <div className="space-y-1 text-left">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400">Enter your credentials to access your dashboard</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-4 py-3 rounded-2xl text-center font-semibold animate-pulse">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
              <MdEmail className="text-emerald-400 shrink-0" size={18} />
              <input
                type="email"
                name="email"
                placeholder="name@organisation.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-transparent flex-1 outline-none text-xs md:text-sm text-white placeholder-slate-500"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <Link
                to="/forgotpassword"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition inline-flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" /> Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
              <MdLock className="text-emerald-400 shrink-0" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-transparent flex-1 outline-none text-xs md:text-sm text-white placeholder-slate-500"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="focus:outline-none text-slate-500 hover:text-emerald-400 transition"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Select Role
            </label>
            <div className="flex items-center gap-2.5 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition shadow-inner">
              <MdPerson className="text-emerald-400 shrink-0" size={18} />
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSubmitting}
                className="bg-transparent flex-1 outline-none text-xs md:text-sm text-white cursor-pointer"
              >
                <option value="vendor" className="bg-slate-900 text-white">
                  Vendor (Business / Supplier)
                </option>
                <option value="NGO" className="bg-slate-900 text-white">
                  NGO (Charity / Non-Profit)
                </option>
                <option value="Volunteer" className="bg-slate-900 text-white">
                  Volunteer (Logistics Driver)
                </option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 font-black text-slate-950 rounded-2xl shadow-xl shadow-emerald-500/20 text-xs md:text-sm uppercase tracking-wider transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <MdLogin size={18} />
                Sign In to Platform
              </>
            )}
          </button>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-400 pt-2">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              Register Account <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
