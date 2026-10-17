
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  MapPin,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Users,
  Truck,
  PackageCheck,
  X,
  ChevronRight,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

export default function BookVolunteer() {
  const navigate = useNavigate();

  const role = (localStorage.getItem("role") || "").toLowerCase();
  const dashboardPath =
    role === "vendor" ? "/vendor/dashboard" : "/ngo/dashboard";

  const dashboardLabel =
    role === "vendor" ? "Vendor Dashboard" : "NGO Dashboard";

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${API_URL}/api/users/allvolunteer`
      );

      setVolunteers(
        Array.isArray(res.data?.Volunteer)
          ? res.data.Volunteer
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load volunteers. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const query = searchTerm.trim().toLowerCase();

    return (
      volunteer.name?.toLowerCase().includes(query) ||
      volunteer.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-slate-100 selection:bg-emerald-400 selection:text-slate-950">
      {/* Hero */}
      <ParallaxHero
        badgeText="Volunteer Logistics Network"
        title={
          <>
            <span className="font-sans font-extrabold tracking-tight">
              Book Trusted{" "}
            </span>
            <span className="font-sans font-extrabold tracking-tight text-emerald-400">
              Volunteers
            </span>
          </>
        }
        subtitle="Connect with volunteers in your region for food pickup, transportation, and last-mile community distribution."
        actionButtons={
          <button
            onClick={() => navigate(dashboardPath)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/40 hover:bg-white/10"
          >
            {dashboardLabel}
            <ArrowUpRight size={16} />
          </button>
        }
      />

      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* Intro and stats */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid gap-4 lg:grid-cols-[1fr_auto]"
        >
          <div className="flex items-start gap-4">
            <div className="hidden rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.08] p-3 sm:block">
              <Truck className="h-6 w-6 text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Volunteer directory
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Find your logistics partner
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Explore volunteer profiles and select someone who can
                support your next pickup or delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <div className="rounded-xl bg-emerald-400/10 p-2.5">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-white">
                {loading ? "—" : volunteers.length}
              </p>
              <p className="text-xs text-slate-400">
                Registered volunteers
              </p>
            </div>
          </div>
        </motion.section>

        {/* Search toolbar */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#0d1320] p-3 shadow-xl shadow-black/10 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by volunteer name or location..."
                aria-label="Search volunteers by name or location"
                className="w-full rounded-xl border border-white/[0.08] bg-[#080d17] py-3.5 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/[0.06]"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-1 sm:justify-end sm:px-2">
              <span className="text-xs text-slate-400">
                {loading
                  ? "Loading directory..."
                  : `${filteredVolunteers.length} ${
                      filteredVolunteers.length === 1
                        ? "volunteer"
                        : "volunteers"
                    } found`}
              </span>

              <button
                type="button"
                onClick={fetchVolunteers}
                disabled={loading}
                title="Refresh volunteer directory"
                aria-label="Refresh volunteer directory"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Directory content */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-white/[0.07] bg-[#0d1320] p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-white/[0.07]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-2/3 rounded bg-white/[0.07]" />
                    <div className="h-3 w-1/2 rounded bg-white/[0.05]" />
                  </div>
                </div>
                <div className="mt-7 h-12 rounded-xl bg-white/[0.04]" />
                <div className="mt-5 h-11 rounded-xl bg-white/[0.06]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-rose-400/15 bg-rose-400/[0.04] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/10">
              <RefreshCw className="h-6 w-6 text-rose-400" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-white">
              Directory unavailable
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {error}
            </p>
            <button
              onClick={fetchVolunteers}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              {searchTerm ? (
                <Search className="h-7 w-7 text-slate-500" />
              ) : (
                <Users className="h-7 w-7 text-slate-500" />
              )}
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              {searchTerm
                ? "No matching volunteers"
                : "No volunteers available in the directory"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              {searchTerm
                ? `We couldn't find a volunteer matching "${searchTerm}". Try a different name or location.`
                : "There are no registered volunteer profiles to display right now."}
            </p>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredVolunteers.map((volunteer, idx) => (
              <VolunteerCard
                key={volunteer._id}
                volunteer={volunteer}
                idx={idx}
              />
            ))}
          </motion.section>
        )}

        {/* Trust footer */}
        {!loading && !error && volunteers.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-2 border-t border-white/[0.06] pt-6 text-center sm:flex-row sm:gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <p className="text-xs leading-5 text-slate-500">
              Review the volunteer's profile and confirm the booking
              details before arranging transportation.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function VolunteerCard({ volunteer, idx }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(idx * 0.06, 0.3),
      }}
      whileHover={{ y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1320] transition-colors duration-300 hover:border-emerald-400/30 hover:bg-[#101827]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex-1 p-5 sm:p-6">
        {/* Role */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex max-w-[70%] items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <ShieldCheck size={12} />
            <span className="truncate">
              {volunteer.role || "Volunteer"}
            </span>
          </span>

          <span className="text-[10px] font-medium text-slate-500">
            Volunteer profile
          </span>
        </div>

        {/* Identity */}
        <div className="mt-6 flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={volunteer.photo?.url || FALLBACK_AVATAR}
              alt={volunteer.name || "Volunteer"}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="h-[68px] w-[68px] rounded-2xl border border-white/10 bg-slate-800 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute -bottom-1.5 -right-1.5 rounded-lg border border-[#0d1320] bg-emerald-400 p-1">
              <UserRound size={12} className="text-slate-950" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold tracking-tight text-white transition-colors group-hover:text-emerald-300">
              {volunteer.name || "Unnamed volunteer"}
            </h3>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin size={14} className="shrink-0 text-emerald-400" />
              <span className="truncate">
                {volunteer.location || "Location not provided"}
              </span>
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/15 p-3.5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Contact information
          </p>

          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/[0.08]">
              <Mail size={15} className="text-cyan-300" />
            </div>
            <span
              title={volunteer.email || "Email not provided"}
              className="truncate text-xs text-slate-300"
            >
              {volunteer.email || "Email not provided"}
            </span>
          </div>
        </div>

        {/* Logistics capability cue */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <PackageCheck size={15} className="shrink-0 text-emerald-400" />
          <span>Pickup & distribution coordination</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/bookingform/${volunteer._id}`}
        className="mx-5 mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3.5 text-sm font-bold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:mx-6 sm:mb-6"
      >
        <span>Request a booking</span>
        <span className="flex items-center gap-1.5">
          <span className="hidden text-xs font-medium sm:inline">
            View details
          </span>
          <ChevronRight
            size={17}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </Link>
    </motion.article>
  );
}
