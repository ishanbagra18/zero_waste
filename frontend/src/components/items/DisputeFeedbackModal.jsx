import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ShieldCheck,
  X,
  ThermometerSnowflake,
  PackageX,
  ClockAlert,
  Scale,
  FileText,
  KeyRound,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ISSUE_TYPES = [
  {
    id: "packaging_damage",
    label: "Packaging Compromised",
    description: "Torn seals, crushed cartons, or torn plastic wrapping",
    icon: PackageX,
    color: "amber",
  },
  {
    id: "temperature_breach",
    label: "Temperature Breach",
    description: "Chilled or frozen food arrived at unsafe room temp",
    icon: ThermometerSnowflake,
    color: "cyan",
  },
  {
    id: "spoilage_risk",
    label: "Freshness / Spoilage",
    description: "Unusual smell, discoloration, or signs of decay",
    icon: ClockAlert,
    color: "rose",
  },
  {
    id: "quantity_mismatch",
    label: "Quantity Discrepancy",
    description: "Substantially less food received than listed in claim",
    icon: Scale,
    color: "purple",
  },
  {
    id: "other",
    label: "Other Condition Notice",
    description: "General handling or storage issue not listed above",
    icon: FileText,
    color: "slate",
  },
];

const SEVERITY_LEVELS = [
  {
    id: "minor_notice",
    label: "Minor Notice",
    subtext: "Usable with minor trimming or vendor feedback for future shipments",
    badgeColor: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  },
  {
    id: "partial_damage",
    label: "Partial Damage",
    subtext: "Portion was salvaged safely; remaining volume disposed respectfully",
    badgeColor: "bg-orange-400/10 text-orange-300 border-orange-400/20",
  },
  {
    id: "major_unsafe",
    label: "Major / Unsafe",
    subtext: "Unfit for human distribution; logged for community trust audit",
    badgeColor: "bg-rose-400/10 text-rose-300 border-rose-400/20",
  },
];

export default function DisputeFeedbackModal({
  isOpen,
  onClose,
  item,
  notificationId,
  onSuccess,
}) {
  const [issueType, setIssueType] = useState("packaging_damage");
  const [severity, setSeverity] = useState("minor_notice");
  const [notes, setNotes] = useState("");
  const [otp, setOtp] = useState("");
  const [includeOtpRelease, setIncludeOtpRelease] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const itemId = item._id || item.id || (typeof item === "string" ? item : null);
  const itemName = item.name || "Surplus Resource";
  const vendorName = item.vendor?.name || item.vendorName || "Partner Donor";
  const token = localStorage.getItem("token");

  const handleSubmit = async (verifyOtpTogether) => {
    if (!issueType) {
      toast.error("Please select the observed issue category.");
      return;
    }
    if (!notes.trim() || notes.trim().length < 10) {
      toast.error("Please provide at least 10 characters of respectful notes.");
      return;
    }
    if (verifyOtpTogether && !otp.trim()) {
      toast.error("Enter the 6-digit OTP to release delivery verification.");
      return;
    }

    setSubmitting(true);
    try {
      const conditionPayload = {
        issueType,
        severity,
        notes: notes.trim(),
      };

      if (verifyOtpTogether) {
        // Release OTP and attach condition report atomically
        await axios.patch(
          `${API_URL}/api/items/${itemId}/verify-otp`,
          {
            otp: otp.trim(),
            conditionReport: conditionPayload,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(
          "Quality report logged & delivery verified with OTP. Donor notified respectfully."
        );
      } else {
        // Log condition report independently before releasing OTP
        await axios.post(
          `${API_URL}/api/items/${itemId}/condition-report`,
          conditionPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(
          "Respectful condition report logged. Donor and network record updated."
        );
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Condition report error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit condition report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0d1320] p-6 sm:p-8 shadow-2xl text-slate-100 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Condition & Quality Feedback
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Trust & Audit
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Log a constructive condition report before releasing OTP. Respectful
                documentation helps donors improve cold-chain handling while maintaining network integrity.
              </p>
            </div>
          </div>

          {/* Item details card */}
          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-slate-950/60 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Item Under Inspection
              </p>
              <p className="text-sm font-semibold text-white mt-0.5">{itemName}</p>
              <p className="text-xs text-slate-400">Donor: {vendorName}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <ShieldCheck size={14} />
              <span>Receiving NGO Protected</span>
            </div>
          </div>

          {/* Step 1: Issue Type */}
          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Observed Condition Issue
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ISSUE_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = issueType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setIssueType(type.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-400 text-white shadow-lg shadow-amber-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? "bg-amber-400 text-slate-950"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold">{type.label}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Severity Level */}
          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. Severity Rating
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SEVERITY_LEVELS.map((level) => {
                const isSelected = severity === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSeverity(level.id)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? "bg-slate-900 border-amber-400 shadow-md shadow-amber-500/10"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border inline-block w-fit mb-2 ${level.badgeColor}`}
                    >
                      {level.label}
                    </span>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {level.subtext}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Constructive Notes */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Respectful Condition Notes
              </label>
              <span className="text-[11px] text-slate-500">
                Maintain polite, objective language
              </span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., 3 out of 10 trays showed compromised seal upon delivery; remaining 7 verified safe. Temperature checked at 8°C. Suggest cooler boxes for future transit."
              className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Optional OTP verification section */}
          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-slate-950/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound size={15} className="text-amber-400" />
                <span className="text-xs font-bold text-white">
                  Verify & Release OTP in Same Step?
                </span>
              </div>
              <input
                type="checkbox"
                id="includeOtpToggle"
                checked={includeOtpRelease}
                onChange={(e) => setIncludeOtpRelease(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
              />
            </div>
            {includeOtpRelease && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 flex flex-col sm:flex-row gap-3 items-center"
              >
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit Delivery OTP"
                  className="flex-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-white text-xs placeholder-slate-500 outline-none focus:border-amber-400 font-mono tracking-wider"
                />
                <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                  <Info size={13} /> Marks delivery complete with condition note attached
                </span>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end items-center">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-900 transition"
            >
              Cancel
            </button>

            {includeOtpRelease ? (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                {submitting ? "Logging & Verifying..." : "Submit Report & Verify OTP"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <AlertTriangle size={15} />
                {submitting ? "Logging Report..." : "Log Condition Report Only"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
