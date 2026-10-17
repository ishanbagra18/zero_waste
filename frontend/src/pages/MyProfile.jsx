
import React, { useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MdEdit,
  MdLockReset,
  MdRateReview,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdLocationOn,
  MdAccountCircle,
  MdRefresh,
  MdArrowForward,
  MdArrowOutward,
  MdShield,
  MdStar,
  MdEco,
  MdVerifiedUser,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const MyProfile = () => {
  const { user, userId, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      setRefreshing(true);
      await refreshProfile();
      setError(null);
    } catch (err) {
      setError("Failed to sync profile information. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] px-4 text-white">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal-500/[0.07] blur-[120px]" />

        <div className="relative flex flex-col items-center rounded-3xl border border-white/[0.08] bg-white/[0.03] px-10 py-12 text-center shadow-2xl backdrop-blur-xl">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-emerald-400/15 border-t-emerald-400" />
            <MdAccountCircle size={30} className="text-emerald-300" />
          </div>

          <h2 className="mt-6 text-lg font-bold text-white">
            Loading your profile
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Syncing your account information...
          </p>
        </div>
      </div>
    );
  }

  // Error or missing profile
  if (!user || error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] px-4 text-white">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-red-500/[0.06] blur-[120px]" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/[0.08] bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-3xl text-red-300">
            !
          </div>

          <h2 className="mt-6 text-2xl font-black text-white">
            Profile unavailable
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            {error || "We couldn't retrieve your profile information."}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={fetchProfile}
              disabled={refreshing}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MdRefresh
                size={19}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Retrying..." : "Retry Sync"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Go to Login
              <MdArrowForward size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b14] font-sans text-slate-100 selection:bg-emerald-400/30">
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

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-teal-500/[0.06] blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/[0.035] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Page header */}
        <header className="mb-9 flex flex-col gap-6 border-b border-white/[0.08] pb-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-2">
              <MdVerifiedUser size={15} className="text-emerald-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs">
                Account Center
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              My{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Profile
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Manage your personal information, account preferences, and
              community presence from one place.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton
              onClick={() => navigate("/updateprofile")}
              icon={<MdEdit size={18} />}
              primary
            >
              Edit Profile
            </ActionButton>

            <ActionButton
              onClick={() => navigate("/forgotpassword")}
              icon={<MdLockReset size={19} />}
            >
              Reset Password
            </ActionButton>

            <ActionButton
              onClick={() => navigate(`/allreview/${userId}`)}
              icon={<MdRateReview size={18} />}
            >
              My Reviews
            </ActionButton>
          </div>
        </header>

        {/* Profile workspace */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-7">
          {/* Profile identity card */}
          <div className="lg:col-span-4">
            <ThreeDProfileCard user={user} />
          </div>

          {/* Account information */}
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-8">
            <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/50 shadow-xl shadow-black/10 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-7">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                      <MdAccountCircle size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                      Account Details
                    </h2>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500 sm:ml-11 sm:text-sm">
                    Your registered information and account role.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/updateprofile")}
                  aria-label="Edit account details"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.07] hover:text-emerald-300"
                >
                  <MdEdit size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6">
                <InfoItem
                  label="Email Address"
                  value={user.email}
                  icon={<MdEmail />}
                  accent="emerald"
                />

                <InfoItem
                  label="Phone Number"
                  value={user.phone}
                  icon={<MdPhone />}
                  accent="teal"
                />

                <InfoItem
                  label="Affiliated Organisation"
                  value={user.organisation}
                  icon={<MdBusiness />}
                  accent="cyan"
                />

                <InfoItem
                  label="Base Location"
                  value={user.location}
                  icon={<MdLocationOn />}
                  accent="blue"
                />

                <div className="sm:col-span-2">
                  <InfoItem
                    label="Assigned Access Role"
                    value={formatRole(user.role)}
                    icon={<MdShield />}
                    accent="violet"
                  />
                </div>
              </div>
            </section>

            {/* Community profile highlights */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <HighlightCard
                icon={<MdStar size={22} />}
                title="Community Rating"
                value={
                  user.averageRating
                    ? `${Number(user.averageRating).toFixed(1)} / 5.0`
                    : "Not rated yet"
                }
                description="Your feedback and reputation in the community."
                accent="amber"
              />

              <HighlightCard
                icon={<MdVerifiedUser size={22} />}
                title="Community Badge"
                value={user.badge || "Getting started"}
                description="Your current platform recognition."
                accent="violet"
              />
            </section>

            {/* Sustainability callout */}
            <section className="group relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/35 via-slate-900/70 to-slate-950 p-6 shadow-xl shadow-emerald-950/10 sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/[0.08] blur-[80px] transition-colors duration-500 group-hover:bg-emerald-400/[0.13]" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-inner">
                  <MdEco size={30} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white sm:text-xl">
                      Making a Sustainable Impact
                    </h3>
                    <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                      Zero Waste
                    </span>
                  </div>

                  <p className="max-w-2xl text-sm leading-7 text-slate-400">
                    Being part of Zero Waste means being part of a
                    community working toward more responsible resource use.
                    Keep supporting surplus recovery, community partnerships,
                    and sustainable choices.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/readmore")}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-300 transition hover:text-emerald-200"
                  >
                    Discover our mission
                    <MdArrowOutward
                      size={17}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom account footer */}
        <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Manage your information and keep your account up to date.</span>
          <button
            type="button"
            onClick={fetchProfile}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 font-semibold text-slate-400 transition hover:text-emerald-300 disabled:opacity-50"
          >
            <MdRefresh
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Syncing..." : "Sync profile"}
          </button>
        </footer>
      </main>
    </div>
  );
};

// Reusable action button
const ActionButton = ({ children, icon, onClick, primary = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={
      primary
        ? "inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        : "inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
    }
  >
    {icon}
    {children}
  </button>
);

// Reusable profile field
const InfoItem = ({ label, value, icon, accent = "emerald" }) => {
  const accentStyles = {
    emerald: "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300",
    teal: "border-teal-400/15 bg-teal-400/[0.07] text-teal-300",
    cyan: "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300",
    blue: "border-blue-400/15 bg-blue-400/[0.07] text-blue-300",
    violet: "border-violet-400/15 bg-violet-400/[0.07] text-violet-300",
  };

  return (
    <div className="group flex min-w-0 items-start gap-3.5 rounded-2xl border border-white/[0.055] bg-white/[0.018] p-4 transition duration-200 hover:border-white/[0.11] hover:bg-white/[0.035]">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentStyles[accent]}`}
      >
        {React.cloneElement(icon, { size: 20 })}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>
        <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-slate-200">
          {value || "Not set"}
        </p>
      </div>
    </div>
  );
};

// Small highlight card
const HighlightCard = ({ icon, title, value, description, accent }) => {
  const styles = {
    amber: {
      border: "border-amber-400/15 hover:border-amber-400/30",
      icon: "border-amber-400/20 bg-amber-400/10 text-amber-300",
      glow: "bg-amber-400/[0.05]",
      value: "text-amber-200",
    },
    violet: {
      border: "border-violet-400/15 hover:border-violet-400/30",
      icon: "border-violet-400/20 bg-violet-400/10 text-violet-300",
      glow: "bg-violet-400/[0.05]",
      value: "text-violet-200",
    },
  };

  const style = styles[accent] || styles.amber;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-slate-900/50 p-5 transition duration-300 hover:-translate-y-0.5 ${style.border}`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${style.glow}`}
      />

      <div className="relative flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${style.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-300">{title}</p>
          <p className={`mt-2 break-words text-xl font-black ${style.value}`}>
            {value}
          </p>
        </div>
      </div>

      <p className="relative mt-4 text-xs leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
};

// Interactive profile identity card
const ThreeDProfileCard = ({ user }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setTransform({
      rotateY: (x - 0.5) * 12,
      rotateX: (0.5 - y) * 12,
    });

    setGlare({
      x: x * 100,
      y: y * 100,
      opacity: 0.4,
    });
  };

  const resetCard = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const role = formatRole(user.role);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-emerald-400/[0.09] via-transparent to-teal-400/[0.07] blur-xl" />

      <section
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetCard}
        onBlur={resetCard}
        style={{
          transform: `perspective(1100px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 180ms ease-out",
        }}
        className="relative isolate overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#080d17] p-6 shadow-2xl shadow-black/30 sm:p-8"
      >
        {/* Dynamic light reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.10), rgba(16,185,129,0.06) 30%, transparent 65%)`,
            opacity: glare.opacity,
          }}
        />

        <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-emerald-500/[0.09] blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-teal-500/[0.08] blur-[70px]" />

        {/* Profile card header */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Profile Identity
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Your community presence
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-slate-400">
            <MdAccountCircle size={20} />
          </div>
        </div>

        {/* Avatar */}
        <div className="relative z-10 mt-8 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-emerald-400/[0.12] blur-xl" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-500 opacity-90" />

            <img
              src={
                user.photo?.url ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={`${user.name || "User"}'s profile avatar`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
              className="relative h-32 w-32 rounded-full border-[3px] border-slate-950 bg-slate-900 object-cover shadow-xl sm:h-36 sm:w-36"
              loading="lazy"
            />

            <span
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-slate-900 bg-emerald-400 text-slate-950 shadow-lg"
              title="Profile"
            >
              <MdVerifiedUser size={16} />
            </span>
          </div>

          <h2 className="mt-6 max-w-full break-words text-2xl font-black tracking-tight text-white sm:text-3xl">
            {user.name || "Community Member"}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Member of the Zero Waste community
          </p>

          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2">
            <MdShield size={15} className="shrink-0 text-emerald-300" />
            <span className="break-words text-xs font-bold text-emerald-200">
              {role}
            </span>
          </div>
        </div>

        {/* User badges */}
        <div className="relative z-10 mt-8 space-y-3 border-t border-white/[0.08] pt-6">
          <ProfileBadge
            icon={<MdStar size={21} />}
            label="Community Rating"
            value={
              user.averageRating
                ? `${Number(user.averageRating).toFixed(1)} / 5.0`
                : "Not rated yet"
            }
            accent="amber"
          />

          <ProfileBadge
            icon={<MdVerifiedUser size={21} />}
            label="Platform Badge"
            value={user.badge || "Getting started"}
            accent="violet"
          />
        </div>

        {/* Edit shortcut */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/updateprofile";
          }}
          className="relative z-10 mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.06] hover:text-emerald-200"
        >
          <MdEdit size={17} />
          Edit Profile
          <MdArrowOutward size={16} />
        </button>
      </section>
    </div>
  );
};

// Badge inside profile identity card
const ProfileBadge = ({ icon, label, value, accent }) => {
  const accents = {
    amber: "border-amber-400/15 bg-amber-400/[0.06] text-amber-300",
    violet: "border-violet-400/15 bg-violet-400/[0.06] text-violet-300",
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.04]">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accents[accent] || accents.amber}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-bold text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
};

const formatRole = (role) => {
  const normalized = (role || "").toLowerCase();

  if (normalized === "vendor") return "Vendor Partner";
  if (normalized === "volunteer") return "Logistics Volunteer";
  if (normalized === "ngo") return "NGO Partner";

  return role || "Community Partner";
};

export default MyProfile;
