
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Clock,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBasket,
  CheckCircle2,
  Hourglass,
  Truck,
  Search,
  X,
  CalendarDays,
  Building2,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  HandHeart,
  PackageCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ParallaxHero from "../components/ParallaxHero";
import DisputeFeedbackModal from "../components/items/DisputeFeedbackModal";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const FOOD_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

const VENDOR_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";

export default function MyClaimed() {
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReportItem, setSelectedReportItem] = useState(null);

  const { token } = useAuth();

  const fetchMyClaimed = useCallback(async () => {
    if (!token) {
      setClaimedItems([]);
      setError("Please sign in to view your claimed resources.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${API_URL}/api/items/get-claimed-items`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setClaimedItems(
        Array.isArray(res.data?.claimedItems)
          ? res.data.claimedItems
          : []
      );
    } catch (err) {
      console.error("Error fetching claimed items:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your claimed resources. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyClaimed();
  }, [fetchMyClaimed]);

  const getStatusBadge = (status) => {
    const value = (status || "").toLowerCase();

    if (value === "approved" || value === "claimed") {
      return {
        label: "Approved",
        description: "Vendor approved this claim",
        icon: CheckCircle2,
        color:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      };
    }

    if (value === "pending") {
      return {
        label: "Pending approval",
        description: "Waiting for vendor approval",
        icon: Hourglass,
        color:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };
    }

    if (value === "collected" || value === "completed") {
      return {
        label: "Completed",
        description: "Collection marked complete",
        icon: PackageCheck,
        color:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };
    }

    return {
      label: status || "Unknown status",
      description: "Check the claim with your vendor",
      icon: AlertCircle,
      color:
        "border-rose-400/20 bg-rose-400/10 text-rose-300",
    };
  };

  const stats = useMemo(() => {
    const normalized = claimedItems.map((item) =>
      (item.claimStatus || "").toLowerCase()
    );

    return [
      {
        label: "Total claims",
        value: claimedItems.length,
        icon: ShoppingBasket,
        color: "text-emerald-300",
        bg: "bg-emerald-400/10",
      },
      {
        label: "Awaiting approval",
        value: normalized.filter((s) => s === "pending").length,
        icon: Hourglass,
        color: "text-amber-300",
        bg: "bg-amber-400/10",
      },
      {
        label: "Approved",
        value: normalized.filter(
          (s) => s === "approved" || s === "claimed"
        ).length,
        icon: CheckCircle2,
        color: "text-cyan-300",
        bg: "bg-cyan-400/10",
      },
      {
        label: "Completed",
        value: normalized.filter(
          (s) => s === "collected" || s === "completed"
        ).length,
        icon: PackageCheck,
        color: "text-violet-300",
        bg: "bg-violet-400/10",
      },
    ];
  }, [claimedItems]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return claimedItems.filter((item) => {
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.vendor?.name?.toLowerCase().includes(query) ||
        item.vendor?.location?.toLowerCase().includes(query);

      const status = (item.claimStatus || "").toLowerCase();

      let matchesStatus = true;

      if (statusFilter === "pending") {
        matchesStatus = status === "pending";
      } else if (statusFilter === "approved") {
        matchesStatus = status === "approved" || status === "claimed";
      } else if (statusFilter === "completed") {
        matchesStatus =
          status === "collected" || status === "completed";
      }

      return matchesSearch && matchesStatus;
    });
  }, [claimedItems, searchTerm, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] pb-24 text-slate-100 selection:bg-emerald-400 selection:text-slate-950">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />

      {/* Hero */}
      <ParallaxHero
        badgeText="NGO Resource Management"
        title={
          <>
            My Claimed{" "}
            <span className="text-emerald-400">Food Resources</span>
          </>
        }
        subtitle="Manage your food claims, monitor vendor approvals, and keep track of resources collected for your community."
        actionButtons={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/vendor/allitems"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-400/10 transition hover:bg-emerald-300"
            >
              Browse marketplace
              <ArrowUpRight size={16} />
            </Link>

            <Link
              to="/ngo/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:text-white"
            >
              NGO Dashboard
            </Link>
          </div>
        }
      />

      <main className="relative z-10 mx-auto -mt-5 max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              <HandHeart size={15} />
              Resource tracking
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your claims, in one place
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Follow each resource from the initial request through
              approval and collection.
            </p>
          </div>

          <button
            onClick={fetchMyClaimed}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh claims
          </button>
        </motion.section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-white/[0.07] bg-[#0d1320] p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs leading-5 text-slate-400 sm:text-sm">
                    {stat.label}
                  </span>
                  <div className={`rounded-xl p-2 ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold tracking-tight text-white">
                  {loading ? "—" : stat.value}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Across your claimed resources
                </p>
              </motion.div>
            );
          })}
        </section>

        {/* Search and filters */}
        <section className="rounded-2xl border border-white/[0.07] bg-[#0d1320] p-3 sm:p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search food items, vendors, or locations..."
                aria-label="Search claimed items"
                className="w-full rounded-xl border border-white/[0.08] bg-[#080d17] py-3.5 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/[0.05]"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All claims", value: "all" },
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Completed", value: "completed" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                      statusFilter === filter.value
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                        : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-500">
                {loading
                  ? "Loading claims..."
                  : `Showing ${filteredItems.length} of ${claimedItems.length} claims`}
              </p>
            </div>
          </div>
        </section>

        {/* Loading state */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d1320]"
              >
                <div className="h-48 bg-white/[0.05]" />
                <div className="space-y-4 p-5">
                  <div className="h-4 w-2/3 rounded bg-white/[0.07]" />
                  <div className="h-3 w-1/2 rounded bg-white/[0.05]" />
                  <div className="h-16 rounded-xl bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error state */
          <div className="mx-auto max-w-lg rounded-3xl border border-rose-400/15 bg-rose-400/[0.04] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/10">
              <AlertCircle className="h-7 w-7 text-rose-300" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              Couldn't load your claims
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {error}
            </p>

            {!token ? (
              <p className="mt-4 text-xs text-slate-500">
                Sign in with your NGO account to continue.
              </p>
            ) : (
              <button
                onClick={fetchMyClaimed}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            )}
          </div>
        ) : claimedItems.length === 0 ? (
          /* Empty state */
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.06]">
              <Package className="h-8 w-8 text-emerald-400" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              No claimed resources yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Your claimed food resources will appear here. Browse
              the marketplace to find surplus food for your community.
            </p>

            <Link
              to="/vendor/allitems"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Explore marketplace
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Filter empty state */
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
            <Search className="mx-auto h-9 w-9 text-slate-500" />

            <h3 className="mt-4 text-lg font-bold text-white">
              No matching claims
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Try another search term or status filter.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Claim cards */
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredItems.map((item, index) => (
              <ClaimCard
                key={item._id}
                item={item}
                index={index}
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
                onOpenReport={setSelectedReportItem}
              />
            ))}
          </motion.section>
        )}

        {/* Footer */}
        {!loading && !error && claimedItems.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-2 border-t border-white/[0.06] pt-6 text-center sm:flex-row sm:gap-3">
            <ShieldCheck size={16} className="text-emerald-400" />
            <p className="text-xs leading-5 text-slate-500">
              Keep your claim details updated and coordinate collection
              directly with your vendor.
            </p>
          </div>
        )}
      </main>

      {selectedReportItem && (
        <DisputeFeedbackModal
          isOpen={!!selectedReportItem}
          onClose={() => setSelectedReportItem(null)}
          item={selectedReportItem}
          onSuccess={() => {
            fetchMyClaimed();
            setSelectedReportItem(null);
          }}
        />
      )}
    </div>
  );
}

function ClaimCard({ item, index, getStatusBadge, formatDate, onOpenReport }) {
  const badge = getStatusBadge(item.claimStatus);
  const StatusIcon = badge.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.06, 0.3),
      }}
      whileHover={{ y: -4 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1320] transition-colors duration-300 hover:border-emerald-400/30"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-[#080d17]">
        <img
          src={item.itemImage?.url || FOOD_IMAGE}
          alt={item.name || "Claimed food resource"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FOOD_IMAGE;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#080d17]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            <Package size={12} />
            Food resource
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="line-clamp-1 text-xl font-bold text-white drop-shadow-lg">
            {item.name || "Unnamed resource"}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Status */}
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${badge.color}`}
          >
            <StatusIcon size={13} />
            {badge.label}
          </span>

          <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-slate-500">
            <CalendarDays size={13} />
            {formatDate(item.claimedAt)}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {badge.description}
        </p>

        {/* Quantity */}
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
            <PackageCheck className="h-5 w-5 text-emerald-300" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Claimed quantity
            </p>
            <p className="mt-1 truncate text-base font-bold text-white">
              {item.quantity ?? "—"}
              <span className="ml-1.5 text-xs font-medium text-slate-400">
                units / quantity
              </span>
            </p>
          </div>
        </div>

        {/* Vendor */}
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Supplying partner
          </p>

          <div className="flex items-center gap-3">
            <img
              src={item.vendor?.photo?.url || VENDOR_IMAGE}
              alt={item.vendor?.name || "Vendor"}
              className="h-10 w-10 shrink-0 rounded-xl border border-white/10 bg-slate-800 object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = VENDOR_IMAGE;
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {item.vendor?.name || "Partner vendor"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-400">
                <MapPin
                  size={13}
                  className="shrink-0 text-emerald-400"
                />
                {item.vendor?.location || "Location not provided"}
              </p>
            </div>

            <Building2
              size={17}
              className="shrink-0 text-slate-600"
            />
          </div>
        </div>

        {/* Workflow information */}
        <div className="mt-auto pt-5">
          {(
            item.claimStatus || ""
          ).toLowerCase() === "pending" ? (
            <div className="mb-3 flex gap-2 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-3">
              <Clock
                size={15}
                className="mt-0.5 shrink-0 text-amber-300"
              />
              <p className="text-xs leading-5 text-slate-400">
                Your request is awaiting vendor approval. Check back
                for status updates.
              </p>
            </div>
          ) : null}

          {["approved", "claimed"].includes(
            (item.claimStatus || "").toLowerCase()
          ) && (
            <div className="mb-3 flex gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3">
              <Truck
                size={15}
                className="mt-0.5 shrink-0 text-cyan-300"
              />
              <p className="text-xs leading-5 text-slate-400">
                Approved claim. Coordinate pickup and collection
                arrangements with your vendor.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-xs font-bold text-slate-200">
                Claim status
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Updated from your claim record
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${badge.color.split(" ").find((c) => c.startsWith("text-")) || "text-slate-300"}`}
            >
              {badge.label}
              <ChevronRight size={14} />
            </span>
          </div>

          {/* Condition / Dispute Report Action */}
          {item.conditionReport?.issueType ? (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs text-amber-300">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <AlertTriangle size={13} className="shrink-0 text-amber-400" />
                Condition Logged: {item.conditionReport.issueType.replace("_", " ")}
              </span>
              {onOpenReport && (
                <button
                  type="button"
                  onClick={() => onOpenReport(item)}
                  className="shrink-0 text-[11px] font-bold text-amber-200 hover:text-white underline"
                >
                  Review
                </button>
              )}
            </div>
          ) : (
            onOpenReport && (
              <button
                type="button"
                onClick={() => onOpenReport(item)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-900/50 hover:bg-amber-500/10 hover:border-amber-400/30 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-amber-300 transition"
              >
                <AlertTriangle size={13} className="text-amber-400" />
                Log Condition / Quality Notice
              </button>
            )
          )}
        </div>
      </div>
    </motion.article>
  );
}
