import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Star,
  Search,
  MapPin,
  Mail,
  Phone,
  Building2,
  Users,
  ArrowUpRight,
  HeartHandshake,
  X,
  HandHeart,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import ParallaxHero from "../components/ParallaxHero";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

export default function Allngos() {
  const { ngos, fetchNgos, loadingNgos } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNgos();
  }, [fetchNgos]);

  const filteredNgos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const results = (ngos || []).filter((ngo) => {
      return (
        ngo.name?.toLowerCase().includes(query) ||
        ngo.organisation?.toLowerCase().includes(query) ||
        ngo.location?.toLowerCase().includes(query)
      );
    });

    // Preserve the original initial limit when there is no search.
    return query ? results : results.slice(0, 12);
  }, [searchQuery, ngos]);

  const handleChatClick = (ngoId) => {
    navigate(`/chatting/${ngoId}`);
  };

  const handleReviewClick = (ngoId) => {
    navigate(`/review/${ngoId}`);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] pb-24 text-slate-100 selection:bg-emerald-400 selection:text-slate-950">
      {/* Hero */}
      <ParallaxHero
        badgeText="NGO Partner Network"
        title={
          <>
            Discover{" "}
            <span className="text-emerald-400">NGO Partners</span>
          </>
        }
        subtitle="Connect with nonprofit organizations, community kitchens, and local food-rescue initiatives working to reduce food waste and support communities."
      />

      <main className="relative z-10 mx-auto -mt-5 max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Page introduction */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              <HeartHandshake size={15} />
              Community directory
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Find your next impact partner
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Explore NGO profiles, connect directly with organizations,
              and share feedback about your collaboration.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-white/[0.08] bg-[#0d1320] px-4 py-3 sm:self-auto">
            <div className="rounded-xl bg-emerald-400/10 p-2.5">
              <Users size={20} className="text-emerald-400" />
            </div>

            <div>
              <p className="text-2xl font-bold tabular-nums text-white">
                {loadingNgos ? "—" : (ngos || []).length}
              </p>
              <p className="text-xs text-slate-400">
                Registered NGOs
              </p>
            </div>
          </div>
        </motion.section>

        {/* Search */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#0d1320] p-3 shadow-xl shadow-black/10 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by NGO name, organization, or location..."
                aria-label="Search NGO directory"
                className="w-full rounded-xl border border-white/[0.08] bg-[#080d17] py-3.5 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/[0.05]"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-1 sm:justify-end sm:px-2">
              <span className="text-xs text-slate-400">
                {loadingNgos
                  ? "Loading directory..."
                  : `${filteredNgos.length} ${
                      filteredNgos.length === 1
                        ? "organization"
                        : "organizations"
                    } found`}
              </span>

              <button
                type="button"
                onClick={() => fetchNgos()}
                disabled={loadingNgos}
                title="Refresh NGO directory"
                aria-label="Refresh NGO directory"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loadingNgos ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Loading skeletons */}
        {loadingNgos ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-white/[0.07] bg-[#0d1320] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 rounded-full bg-white/[0.07]" />
                  <div className="h-3 w-3 rounded-full bg-white/[0.05]" />
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <div className="h-20 w-20 rounded-2xl bg-white/[0.07]" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-white/[0.07]" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-white/[0.05]" />
                </div>

                <div className="mt-6 space-y-3 rounded-xl bg-white/[0.03] p-4">
                  <div className="h-3 w-full rounded bg-white/[0.06]" />
                  <div className="h-3 w-4/5 rounded bg-white/[0.06]" />
                  <div className="h-3 w-3/5 rounded bg-white/[0.06]" />
                </div>

                <div className="mt-5 h-10 rounded-xl bg-white/[0.05]" />
              </div>
            ))}
          </div>
        ) : filteredNgos.length === 0 ? (
          /* Empty state */
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <Search size={28} className="text-slate-500" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              {searchQuery
                ? "No matching organizations"
                : "No NGOs found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              {searchQuery
                ? `We couldn't find an NGO matching "${searchQuery}". Try another name or location.`
                : "There are currently no NGO profiles to display."}
            </p>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          /* NGO grid */
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredNgos.map((ngo, index) => (
              <NGOCard
                key={ngo._id}
                ngo={ngo}
                index={index}
                onChat={() => handleChatClick(ngo._id)}
                onReview={() => handleReviewClick(ngo._id)}
              />
            ))}
          </motion.section>
        )}

        {/* Footer */}
        {!loadingNgos && (ngos || []).length > 0 && (
          <div className="flex flex-col items-center justify-center gap-2 border-t border-white/[0.06] pt-6 text-center sm:flex-row sm:gap-3">
            <ShieldCheck size={16} className="text-emerald-400" />
            <p className="text-xs leading-5 text-slate-500">
              Connect respectfully and review organization details before
              coordinating resource distribution.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function NGOCard({ ngo, index, onChat, onReview }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.05, 0.3),
      }}
      whileHover={{ y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1320] transition-colors duration-300 hover:border-emerald-400/30 hover:bg-[#101827]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex-1 p-5">
        {/* Role */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex max-w-[75%] items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <HandHeart size={12} />
            <span className="truncate">{ngo.role || "NGO"}</span>
          </span>

          <Building2 size={16} className="shrink-0 text-slate-600" />
        </div>

        {/* Profile */}
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={ngo.photo?.url || FALLBACK_AVATAR}
              alt={ngo.name || "NGO profile"}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="h-20 w-20 rounded-2xl border border-white/10 bg-slate-800 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute -bottom-2 -right-2 rounded-xl border-2 border-[#0d1320] bg-emerald-400 p-1.5">
              <HeartHandshake size={13} className="text-slate-950" />
            </div>
          </div>

          <h3 className="mt-4 line-clamp-1 w-full text-base font-bold text-white transition-colors group-hover:text-emerald-300">
            {ngo.name || "Unnamed organization"}
          </h3>

          <p
            title={ngo.organisation || "Non-profit organization"}
            className="mt-1.5 flex max-w-full items-center justify-center gap-1.5 text-xs text-slate-400"
          >
            <Building2
              size={13}
              className="shrink-0 text-emerald-400"
            />
            <span className="line-clamp-1">
              {ngo.organisation || "Non-profit organization"}
            </span>
          </p>
        </div>

        {/* Contact information */}
        <div className="mt-6 space-y-3 rounded-xl border border-white/[0.06] bg-black/15 p-3.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <MapPin size={15} className="shrink-0 text-emerald-400" />
            <span
              title={ngo.location || "Location not provided"}
              className="truncate text-xs text-slate-300"
            >
              {ngo.location || "Location not provided"}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2.5">
            <Mail size={15} className="shrink-0 text-cyan-300" />
            <span
              title={ngo.email || "Email not provided"}
              className="truncate text-xs text-slate-300"
            >
              {ngo.email || "Email not provided"}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2.5">
            <Phone size={15} className="shrink-0 text-emerald-400" />
            {ngo.phone ? (
              <a
                href={`tel:${ngo.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="truncate text-xs text-slate-300 transition hover:text-emerald-300"
              >
                {ngo.phone}
              </a>
            ) : (
              <span className="truncate text-xs text-slate-500">
                Contact via chat
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-white/[0.06] p-4">
        <button
          type="button"
          onClick={onChat}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-xs font-bold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <MessageCircle size={15} />
          Chat
        </button>

        <button
          type="button"
          onClick={onReview}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-400 px-3 py-3 text-xs font-extrabold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1320]"
        >
          <Star size={14} />
          Review
          <ChevronRight size={13} />
        </button>
      </div>
    </motion.article>
  );
}
