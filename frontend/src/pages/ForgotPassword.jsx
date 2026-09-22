import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  KeyRound,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  Users,
  Truck,
  CheckCircle2,
  Zap,
} from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";
import { playClickSound } from "../utils/audio";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("vendor");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    playClickSound();
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!email || !role || !password) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/forgot-password`,
        {
          email: email.trim(),
          role,
          newPassword: password,
        }
      );

      toast.success(res.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password. Verify email & role.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header Section */}
      <ParallaxHero
        badgeText="Cryptographic Passkey Vault"
        title={
          <>
            Reset Account <span className="text-emerald-400">Security Passkey</span>
          </>
        }
        subtitle="Verify your account identity and select your role to generate an updated security key."
        actionButtons={
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            Back to Login
          </button>
        }
      />

      {/* Futuristic Centered Vault Passkey Card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl overflow-hidden">
          
          {/* Top Animated Glowing Laser Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse" />

          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
            
            {/* Centered Security Shield Emblem Header */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full blur-lg opacity-25 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-slate-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Zap size={12} /> Live Passkey Encryption
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Update Account Passkey
                </h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Select your account role, enter your registered email, and configure your new passkey.
                </p>
              </div>
            </div>

            {/* Step 1: Interactive Role Selector Tiles */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-300 text-center sm:text-left">
                1. Select Account System Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "vendor", label: "Vendor", icon: Building2, desc: "Supplier" },
                  { id: "NGO", label: "NGO", icon: Users, desc: "Charity" },
                  { id: "Volunteer", label: "Volunteer", icon: Truck, desc: "Logistics" },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleRoleSelect(item.id)}
                      className={`group p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10"
                          : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 absolute top-2 right-2" />
                      )}
                      <IconComp className={`w-5 h-5 ${isSelected ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span className="text-xs font-black tracking-wide block">{item.label}</span>
                      <span className="text-[10px] text-slate-500 block font-medium">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Credentials Input Fields */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-300">
                2. Account Credentials
              </label>

              {/* Email Address */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3.5 rounded-2xl border border-slate-800 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition shadow-inner">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="email"
                    placeholder="Registered Email Address (e.g., name@org.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="bg-transparent flex-1 outline-none text-xs sm:text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3.5 rounded-2xl border border-slate-800 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition shadow-inner">
                  <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Passkey (Min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    minLength={6}
                    className="bg-transparent flex-1 outline-none text-xs sm:text-sm text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="focus:outline-none text-slate-500 hover:text-emerald-400 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] px-1">
                    <span className={password.length >= 6 ? "text-emerald-400 font-bold" : "text-amber-400"}>
                      {password.length >= 6 ? "✓ Passkey length meets security criteria" : "⚠️ Passkey must be at least 6 characters"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Authorize & Submit CTA Button */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 font-black text-slate-950 rounded-2xl shadow-xl shadow-emerald-500/20 text-xs sm:text-sm uppercase tracking-widest transition disabled:opacity-50 active:scale-[0.98] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Updating Passkey...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Authorize & Update Passkey
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Return to Login Page
                </Link>
              </div>
            </div>

          </form>

          {/* Footer Security Badge */}
          <div className="py-3 px-6 bg-slate-950/80 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Protected by ZeroWaste 256-Bit Encrypted Security Ledger</span>
          </div>

        </div>
      </div>
    </div>
  );
}