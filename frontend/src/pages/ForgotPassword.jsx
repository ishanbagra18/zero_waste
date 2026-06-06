// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdPerson, MdArrowBack } from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Client-side quick checks
    if (!email || !role || !oldPassword || !password) {
      toast.error("Please complete all mandatory processing fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Security requirement: New password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(false);
      setIsSubmitting(true);
      
      const res = await axios.patch('http://localhost:3002/api/users/forgot-password', {
        email: email.trim(),
        role,
        oldPassword,
        newPassword: password,
      });

      toast.success(res.data.message || "Password updated successfully!");
      
      // Auto redirect to login gateway after short reading delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting credentials. Verify entries.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white px-4 selection:bg-blue-500/30">
      <Toaster position="top-right" />

      <div className="w-full max-w-md relative group">
        {/* Decorative Ambient Background Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-10 group-focus-within:opacity-20 transition duration-500" />
        
        <form
          onSubmit={handleSubmit}
          className="relative bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl w-full border border-white/[0.06] space-y-6"
        >
          {/* Header Block */}
          <header className="text-center space-y-1.5">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Reset Password
            </h2>
            <p className="text-sm text-slate-400">
              Provide your registration context below to update access credentials.
            </p>
          </header>

          {/* Form Content Controls */}
          <div className="space-y-4">
            
            {/* Field: Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Account Email Address
              </label>
              <div className="group flex items-center gap-3 bg-slate-950/50 focus-within:bg-slate-950/90 px-3.5 py-2.5 rounded-xl border border-white/[0.06] focus-within:border-blue-500/60 transition-all duration-150 shadow-inner">
                <MdEmail className="text-slate-500 group-focus-within:text-blue-400 text-lg transition-colors shrink-0" />
                <input
                  type="email"
                  placeholder="name@organisation.com"
                  disabled={isSubmitting}
                  className="bg-transparent outline-none flex-1 text-sm text-slate-100 placeholder-slate-600 w-full disabled:text-slate-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Field: Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                System Profile Identity
              </label>
              <div className="group flex items-center gap-3 bg-slate-950/50 focus-within:bg-slate-950/90 px-3.5 py-2.5 rounded-xl border border-white/[0.06] focus-within:border-blue-500/60 transition-all duration-150 shadow-inner relative">
                <MdPerson className="text-slate-500 group-focus-within:text-blue-400 text-lg transition-colors shrink-0" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-transparent outline-none flex-1 text-sm text-slate-100 w-full disabled:text-slate-500 cursor-pointer appearance-none pr-6"
                  required
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">Select system entity type</option>
                  <option value="NGO" className="bg-slate-900 text-slate-200">NGO Partner</option>
                  <option value="vendor" className="bg-slate-900 text-slate-200">Vendor Partner</option>
                  <option value="Volunteer" className="bg-slate-900 text-slate-200">Volunteer Network</option>
                </select>
                {/* Custom absolute layout drop-down caret arrow */}
                <div className="absolute right-4 pointer-events-none text-xs text-slate-500 group-focus-within:text-blue-400">&nbsp;▼</div>
              </div>
            </div>

            {/* Field: Old Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Old Password
              </label>
              <div className="group flex items-center gap-3 bg-slate-950/50 focus-within:bg-slate-950/90 px-3.5 py-2.5 rounded-xl border border-white/[0.06] focus-within:border-blue-500/60 transition-all duration-150 shadow-inner">
                <MdLock className="text-slate-500 group-focus-within:text-blue-400 text-lg transition-colors shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="bg-transparent outline-none flex-1 text-sm text-slate-100 placeholder-slate-600 w-full disabled:text-slate-500"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Field: New Cryptographic Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Secure New Password
              </label>
              <div className="group flex items-center gap-3 bg-slate-950/50 focus-within:bg-slate-950/90 px-3.5 py-2.5 rounded-xl border border-white/[0.06] focus-within:border-blue-500/60 transition-all duration-150 shadow-inner">
                <MdLock className="text-slate-500 group-focus-within:text-blue-400 text-lg transition-colors shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="bg-transparent outline-none flex-1 text-sm text-slate-100 placeholder-slate-600 w-full disabled:text-slate-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

          </div>

          {/* Action Trigger Block Footer */}
          <div className="pt-2 space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700/50 border border-transparent font-semibold text-sm rounded-xl text-white transition-all duration-150 active:scale-[0.99] shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Authorize Password Update</span>
              )}
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full text-center text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors py-1 group"
            >
              <MdArrowBack className="group-hover:-translate-x-0.5 transition-transform" />
              Return to login portal
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;