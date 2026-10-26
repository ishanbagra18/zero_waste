
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  haversineDistance,
  getCoordinates,
} from '../util/utils';

import {
  MdLocationOn,
  MdArrowBack,
  MdBusiness,
  MdOutlineNearMe,
  MdMap,
  MdMyLocation,
  MdRefresh,
  MdCheckCircle,
  MdOutlineLocationSearching,
  MdArrowForward,
  MdPublic,
} from 'react-icons/md';

const Neartongo = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [nearestVendors, setNearestVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingVendors, setFetchingVendors] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Decode authentication token
  useEffect(() => {
    if (!token) {
      setLoading(false);
      toast.error('Please log in to continue.');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (payload.userId) {
        setUserId(payload.userId);
      } else {
        setLoading(false);
        toast.error('User information not found. Please log in again.');
      }
    } catch {
      setLoading(false);
      toast.error('Invalid token. Please log in again.');
    }
  }, [token]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/myprofile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
      } catch (err) {
        toast.error(
          err.response?.data?.message || 'Failed to fetch your profile.'
        );
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  // Calculate nearest vendors
  const findTopVendors = async () => {
    if (!user?.location || !token) {
      setLoading(false);
      return;
    }

    setFetchingVendors(true);
    setLoading(true);

    try {
      const userCoords = await getCoordinates(user.location);

      if (!userCoords) {
        toast.error("We couldn't determine your location coordinates.");
        setNearestVendors([]);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/allvendor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const vendors = res.data.vendors || [];

      const results = await Promise.all(
        vendors.map(async (vendor) => {
          if (!vendor.location) return null;

          try {
            const coords = await getCoordinates(vendor.location);

            if (!coords) return null;

            const distance = haversineDistance(
              userCoords.lat,
              userCoords.lon,
              coords.lat,
              coords.lon
            );

            if (!Number.isFinite(distance)) return null;

            return {
              ...vendor,
              distance,
            };
          } catch {
            return null;
          }
        })
      );

      const topFive = results
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      setNearestVendors(topFive);
    } catch (error) {
      console.error('Error finding nearest vendors:', error);

      toast.error(
        error.response?.data?.message ||
          'Unable to find nearby vendors. Please try again.'
      );
    } finally {
      setLoading(false);
      setFetchingVendors(false);
    }
  };

  // Recalculate when profile loads or when the user refreshes
  useEffect(() => {
    if (!user) return;

    findTopVendors();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const closestDistance =
    nearestVendors.length > 0
      ? nearestVendors[0].distance.toFixed(2)
      : null;

  const getRankStyle = (index) => {
    if (index === 0) {
      return {
        label: 'Closest match',
        color:
          'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
      };
    }

    return {
      label: `Rank ${String(index + 1).padStart(2, '0')}`,
      color: 'border-white/10 bg-white/[0.04] text-zinc-400',
    };
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080c12] text-white selection:bg-emerald-400 selection:text-[#06110b]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#111922',
            color: '#f4f4f5',
            border: '1px solid #26352f',
            borderRadius: '12px',
          },
        }}
      />

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[420px] w-[650px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[130px]" />

        <div className="absolute right-[-160px] top-[480px] h-[350px] w-[350px] rounded-full bg-teal-500/[0.04] blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'linear-gradient(to bottom, black, transparent 85%)',
          }}
        />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10">
        {/* Navigation */}
        <div className="mb-10 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('/ngo/dashboard')}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-white"
          >
            <MdArrowBack
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Dashboard
          </button>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300 sm:text-xs">
              Vendor discovery
            </span>
          </div>
        </div>

        {/* Page heading */}
        <section className="mb-9">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5">
                <MdOutlineNearMe className="text-emerald-400" size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Smart location matching
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[48px]">
                Find vendors
                <br className="hidden sm:block" />{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  closer to you.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                Discover nearby supply partners ranked by geographical
                distance. Connect with local vendors and make your
                logistics more efficient.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <MdCheckCircle className="text-emerald-400" size={16} />
                  Distance-based ranking
                </span>

                <span className="flex items-center gap-1.5">
                  <MdCheckCircle className="text-emerald-400" size={16} />
                  Top 5 nearby vendors
                </span>
              </div>
            </div>

            {/* Decorative location card */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-3 rounded-3xl bg-emerald-400/[0.08] blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#101820]/90 p-5 shadow-2xl shadow-black/20">
                <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full border border-emerald-400/10" />
                <div className="absolute -right-1 -top-1 h-16 w-16 rounded-full border border-emerald-400/10" />

                <div className="relative mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <MdMyLocation size={23} />
                  </div>

                  <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Your base
                  </span>
                </div>

                <p className="text-xs font-medium text-zinc-500">
                  Search origin
                </p>

                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-zinc-100">
                  {user?.location || 'Loading your profile location...'}
                </p>

                <div className="mt-5 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-xs text-emerald-300">
                  <MdPublic size={17} />
                  <span>Local vendor network</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-[#10151d]/80 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-500 sm:text-sm">
                Vendors found
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <MdBusiness size={18} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {loading ? '—' : String(nearestVendors.length).padStart(2, '0')}
              </span>
              <span className="text-xs text-zinc-500">/ 05</span>
            </div>

            <p className="mt-2 text-[11px] text-zinc-500">
              Closest matching locations
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#10151d]/80 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-500 sm:text-sm">
                Closest vendor
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                <MdOutlineNearMe size={18} />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {loading || closestDistance === null
                  ? '—'
                  : closestDistance}
              </span>

              <span className="text-xs text-zinc-500">
                {closestDistance !== null && !loading ? 'km' : ''}
              </span>
            </div>

            <p className="mt-2 text-[11px] text-zinc-500">
              Straight-line distance
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/[0.08] bg-[#10151d]/80 p-4 sm:p-5 lg:col-span-1">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-500 sm:text-sm">
                Search status
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                <MdMap size={18} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  loading
                    ? 'animate-pulse bg-amber-400'
                    : nearestVendors.length > 0
                      ? 'bg-emerald-400'
                      : 'bg-zinc-500'
                }`}
              />

              <span className="text-xl font-bold tracking-tight text-white">
                {loading
                  ? 'Searching'
                  : nearestVendors.length > 0
                    ? 'Complete'
                    : 'No results'}
              </span>
            </div>

            <p className="mt-2 text-[11px] text-zinc-500">
              {loading
                ? 'Calculating vendor distances...'
                : 'Based on your profile address'}
            </p>
          </div>
        </section>

        {/* Results heading */}
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Curated for your location
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Nearest vendors
              </h2>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                {loading
                  ? 'Finding and sorting available vendors...'
                  : 'Sorted from nearest to farthest'}
              </p>
            </div>

            <button
              onClick={findTopVendors}
              disabled={loading || fetchingVendors || !user?.location}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.035] px-3.5 py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              <MdRefresh
                size={17}
                className={
                  loading || fetchingVendors ? 'animate-spin' : ''
                }
              />
              Refresh results
            </button>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="rounded-3xl border border-white/[0.08] bg-[#10151d]/70 px-5 py-16 text-center sm:py-20">
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full border border-emerald-400/20" />
                <div className="absolute inset-1 rounded-full border border-emerald-400/20" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <MdOutlineLocationSearching size={28} />
                </div>
              </div>

              <h3 className="text-base font-bold text-zinc-100">
                Mapping nearby vendors
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Calculating geographical distances and arranging the
                closest supply partners for you.
              </p>

              <div className="mx-auto mt-6 h-1 w-44 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-emerald-500 to-teal-300" />
              </div>
            </div>
          ) : !user?.location ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.04] px-5 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] text-amber-300">
                <MdLocationOn size={28} />
              </div>

              <h3 className="text-lg font-bold text-white">
                Location required
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
                Add your location to your profile to discover vendors
                near your organisation.
              </p>

              <button
                onClick={() => navigate('/ngo/dashboard')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#07130c] transition hover:bg-emerald-300"
              >
                Back to dashboard
                <MdArrowForward size={17} />
              </button>
            </div>
          ) : nearestVendors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {nearestVendors.map((vendor, index) => {
                const rank = getRankStyle(index);

                return (
                  <article
                    key={vendor._id || index}
                    className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-[#10151d]/90 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#131c24] sm:p-6 ${
                      index === 0
                        ? 'border-emerald-400/25 hover:border-emerald-400/45'
                        : 'border-white/[0.08] hover:border-white/[0.16]'
                    }`}
                  >
                    {/* Top accent */}
                    <div
                      className={`absolute inset-x-0 top-0 h-px ${
                        index === 0
                          ? 'bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent'
                          : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
                      }`}
                    />

                    {/* Card header */}
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                            index === 0
                              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                              : 'border-white/[0.08] bg-white/[0.04] text-zinc-400 group-hover:text-emerald-300'
                          }`}
                        >
                          <MdBusiness size={23} />
                        </div>

                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                            Supply partner
                          </p>

                          <h3
                            title={vendor.name}
                            className="truncate text-base font-bold tracking-tight text-zinc-100 sm:text-lg"
                          >
                            {vendor.name || 'Unnamed vendor'}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-lg border px-2 py-1.5 text-[9px] font-extrabold uppercase tracking-wider ${rank.color}`}
                      >
                        {rank.label}
                      </span>
                    </div>

                    {/* Organisation */}
                    <div className="mb-5 min-h-[42px]">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                        Organisation
                      </p>

                      <p
                        title={vendor.organisation || 'Independent Provider'}
                        className="truncate text-sm font-medium text-zinc-300"
                      >
                        {vendor.organisation || 'Independent Provider'}
                      </p>
                    </div>

                    {/* Distance panel */}
                    <div
                      className={`mb-5 rounded-xl border p-4 ${
                        index === 0
                          ? 'border-emerald-400/15 bg-emerald-400/[0.045]'
                          : 'border-white/[0.06] bg-white/[0.025]'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <MdMap size={16} />
                          Distance from you
                        </span>

                        {index === 0 && (
                          <MdCheckCircle
                            className="text-emerald-400"
                            size={16}
                          />
                        )}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-3xl font-black tracking-tight ${
                            index === 0
                              ? 'text-emerald-300'
                              : 'text-zinc-100'
                          }`}
                        >
                          {vendor.distance.toFixed(2)}
                        </span>

                        <span className="text-xs font-semibold text-zinc-500">
                          km
                        </span>
                      </div>

                      {/* Relative ranking indicator */}
                      <div className="mt-3 flex gap-1">
                        {nearestVendors.map((item, barIndex) => (
                          <div
                            key={item._id || barIndex}
                            className={`h-1 flex-1 rounded-full ${
                              barIndex <= index
                                ? index === 0
                                  ? 'bg-emerald-400/80'
                                  : 'bg-white/20'
                                : 'bg-white/[0.06]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mt-auto border-t border-white/[0.07] pt-4">
                      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                        <MdLocationOn
                          className="shrink-0 text-emerald-400"
                          size={16}
                        />
                        Vendor location
                      </div>

                      <p
                        title={vendor.location}
                        className="line-clamp-2 min-h-[40px] break-words text-xs leading-5 text-zinc-400"
                      >
                        {vendor.location || 'Location not available'}
                      </p>
                    </div>

                    {/* Card hover decoration */}
                    <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-emerald-400/[0.035] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/[0.12] bg-[#10151d]/60 px-5 py-16 text-center sm:py-20">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-zinc-500">
                <MdLocationOn size={30} />
              </div>

              <h3 className="text-lg font-bold text-white">
                No nearby vendors found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                We couldn't find vendors with valid locations to
                calculate distances. Try refreshing or check the
                locations saved in your profile and vendor records.
              </p>

              <button
                onClick={findTopVendors}
                disabled={!user?.location || fetchingVendors}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#07130c] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MdRefresh size={17} />
                Try again
              </button>
            </div>
          )}
        </section>

        {/* Footer note */}
        <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[11px] text-zinc-500">
            <MdMyLocation size={15} className="text-emerald-400" />
            Results are calculated using your profile location.
          </p>

          <p className="text-[10px] font-medium tracking-wide text-zinc-600">
            DISTANCE-BASED DISCOVERY
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Neartongo;
