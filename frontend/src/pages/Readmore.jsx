import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEcoLeaf } from "../context/EcoLeafContext";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  HeartHandshake,
  Leaf,
  Globe2,
  ShieldCheck,
  PackageCheck,
  Recycle,
  HandHeart,
  MoveRight,
  Users, // Fixed: imported Users icon
  CheckCircle2,
  Truck,
  Sprout,
  Boxes,
  TrendingUp,
  CircleCheck,
  Zap,
} from "lucide-react";

import {
  FaRecycle,
  FaHandHoldingHeart,
  FaUsers,
  FaSeedling,
  FaTruck,
  FaChartLine,
} from "react-icons/fa";

/* -------------------------------------------------------------------------- */
/*                                ANIMATIONS                                  */
/* -------------------------------------------------------------------------- */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                              REUSABLE UI                                   */
/* -------------------------------------------------------------------------- */

const SectionLabel = ({ children, icon: Icon = Sparkles }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-2 text-xs font-semibold tracking-wide text-emerald-300">
    <Icon size={14} />
    <span>{children}</span>
  </div>
);

const SectionHeader = ({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className={`mb-12 ${
      align === "center"
        ? "mx-auto max-w-3xl text-center"
        : "max-w-2xl text-left"
    }`}
  >
    {eyebrow && (
      <div
        className={`mb-5 flex ${
          align === "center" ? "justify-center" : "justify-start"
        }`}
      >
        <SectionLabel>{eyebrow}</SectionLabel>
      </div>
    )}

    <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
      {title}{" "}
      {highlight && (
        <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
          {highlight}
        </span>
      )}
    </h2>

    {description && (
      <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
        {description}
      </p>
    )}
  </motion.div>
);

const Pill = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-slate-300">
    {Icon && <Icon size={13} className="text-emerald-300" />}
    {children}
  </span>
);

/* -------------------------------------------------------------------------- */
/*                              PILLAR CARD                                   */
/* -------------------------------------------------------------------------- */

const PillarCard = ({
  icon: Icon,
  number,
  title,
  description,
  accent = "emerald",
}) => {
  const accents = {
    emerald: {
      icon: "bg-emerald-400/10 text-emerald-300 ring-emerald-300/10",
      glow: "group-hover:shadow-emerald-950/40",
      number: "text-emerald-300",
    },
    cyan: {
      icon: "bg-cyan-400/10 text-cyan-300 ring-cyan-300/10",
      glow: "group-hover:shadow-cyan-950/40",
      number: "text-cyan-300",
    },
    teal: {
      icon: "bg-teal-400/10 text-teal-300 ring-teal-300/10",
      glow: "group-hover:shadow-teal-950/40",
      number: "text-teal-300",
    },
  };

  const style = accents[accent] || accents.emerald;

  return (
    <motion.div
      variants={fadeUp}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-300/20 hover:bg-slate-900 ${style.glow} hover:shadow-2xl`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/[0.04] blur-3xl transition-all duration-500 group-hover:bg-emerald-400/[0.10]" />

      <div className="relative z-10 flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${style.icon}`}
        >
          <Icon size={22} />
        </div>

        <span className={`text-sm font-bold ${style.number}`}>
          {number}
        </span>
      </div>

      <h3 className="relative z-10 mt-6 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="relative z-10 mt-3 text-sm leading-7 text-slate-400">
        {description}
      </p>

      <div className="relative z-10 mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-300">
        <span>Our approach</span>
        <ArrowUpRight
          size={14}
          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                             FEATURE CARD                                   */
/* -------------------------------------------------------------------------- */

const FeatureIcon = ({ icon: Icon }) => (
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/10 bg-gradient-to-br from-emerald-400/15 to-cyan-400/[0.05] text-emerald-300">
    <Icon size={20} />
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    variants={fadeUp}
    className="group flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-300 hover:border-emerald-300/20 hover:bg-white/[0.045] sm:p-6"
  >
    <FeatureIcon icon={Icon} />

    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-center gap-3">
        <h3 className="font-semibold text-white transition-colors group-hover:text-emerald-200">
          {title}
        </h3>

        <span className="text-[10px] font-bold tracking-widest text-slate-600">
          0{index + 1}
        </span>
      </div>

      <p className="text-sm leading-7 text-slate-400">{description}</p>
    </div>
  </motion.div>
);

/* -------------------------------------------------------------------------- */
/*                              PROCESS ROW                                   */
/* -------------------------------------------------------------------------- */

const ProcessRow = ({
  number,
  icon: Icon,
  title,
  description,
  isLast = false,
}) => (
  <motion.div
    variants={fadeUp}
    className="relative flex gap-5 sm:gap-7"
  >
    {!isLast && (
      <div className="absolute bottom-0 left-[23px] top-14 w-px bg-gradient-to-b from-emerald-300/30 to-transparent" />
    )}

    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-slate-900 text-emerald-300 shadow-lg shadow-emerald-950/20">
      <Icon size={20} />
    </div>

    <div className="flex-1 pb-9">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-300">
          STEP {number}
        </span>

        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <p className="max-w-xl text-sm leading-7 text-slate-400">
        {description}
      </p>
    </div>
  </motion.div>
);

/* -------------------------------------------------------------------------- */
/*                               STAT CARD                                    */
/* -------------------------------------------------------------------------- */

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-slate-900/50 p-5 text-center transition-colors hover:border-emerald-300/20 sm:p-6">
    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
      <Icon size={19} />
    </div>

    <div className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
      {value}
    </div>

    <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">
      {label}
    </p>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

const Readmore = () => {
  const navigate = useNavigate();
  const { leavesEnabled, toggleLeaves } = useEcoLeaf();

  const pillars = [
    {
      icon: Recycle,
      number: "01",
      title: "Reduce Waste",
      description:
        "Help businesses and communities redirect usable surplus resources away from landfills and toward people who need them.",
      accent: "emerald",
    },
    {
      icon: HandHeart,
      number: "02",
      title: "Support Communities",
      description:
        "Connect donors, NGOs, and volunteers through a collaborative platform that makes meaningful contributions easier.",
      accent: "cyan",
    },
    {
      icon: Globe2,
      number: "03",
      title: "Protect Our Planet",
      description:
        "Encourage responsible consumption and make better use of existing resources for a more sustainable future.",
      accent: "teal",
    },
  ];

  const features = [
    {
      icon: PackageCheck,
      title: "Surplus Resource Sharing",
      description:
        "Enable vendors to list surplus items so NGOs can discover available resources and coordinate collections.",
    },
    {
      icon: HeartHandshake,
      title: "NGO Collaboration",
      description:
        "Bring organizations and resource providers together to coordinate donations and support community needs.",
    },
    {
      icon: Users,
      title: "Volunteer Participation",
      description:
        "Give volunteers opportunities to contribute their time and support collection and distribution activities.",
    },
    {
      icon: ShieldCheck,
      title: "Account-Based Access",
      description:
        "Support a more organized platform experience with authenticated accounts and role-based access.",
    },
    {
      icon: Truck,
      title: "Collection Coordination",
      description:
        "Help participants coordinate the movement of available resources from donors to receiving organizations.",
    },
    {
      icon: TrendingUp,
      title: "Community Impact",
      description:
        "Encourage ongoing participation by making collaboration, feedback, and responsible resource use part of the process.",
    },
  ];

  const process = [
    {
      number: "01",
      icon: Boxes,
      title: "List Available Resources",
      description:
        "Vendors identify surplus items and share relevant information so organizations can discover available resources.",
    },
    {
      number: "02",
      icon: SearchIcon,
      title: "Discover and Request",
      description:
        "NGOs review available listings and coordinate requests according to their community's needs.",
    },
    {
      number: "03",
      icon: Truck,
      title: "Coordinate Collection",
      description:
        "Participants organize the collection and transfer of approved resources to their intended destination.",
    },
    {
      number: "04",
      icon: Sprout,
      title: "Create Positive Impact",
      description:
        "Usable resources reach communities instead of going to waste, helping promote a more circular and responsible system.",
    },
  ];

  const benefits = [
    "Reduce avoidable resource waste",
    "Improve coordination between participants",
    "Support community-focused organizations",
    "Encourage responsible resource consumption",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b12] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-emerald-500/[0.08] blur-[120px]" />
        <div className="absolute -right-40 top-[30rem] h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-teal-500/[0.05] blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.45) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
      </div>

      {/* All page content */}
      <div className="relative z-10">
        {/* Back navigation */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-emerald-300/25 hover:bg-emerald-300/[0.06] hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Go Back
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* HERO                                                               */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp}>
                <SectionLabel icon={Leaf}>
                  A better way to share resources
                </SectionLabel>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-7 max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-7xl"
              >
                Turning surplus into{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  meaningful impact.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg"
              >
                We are building a more connected approach to resource sharing.
                Our platform brings vendors, NGOs, and volunteers together to
                reduce waste, support communities, and make better use of what
                we already have.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-400/20"
                >
                  Explore the Platform
                  <ArrowUpRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("our-mission")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-emerald-300/25 hover:bg-white/[0.06]"
                >
                  Discover Our Mission
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={toggleLeaves}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    leavesEnabled
                      ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500/30"
                      : "border-white/10 bg-white/[0.035] text-slate-200 hover:border-emerald-300/30 hover:bg-white/[0.06]"
                  }`}
                >
                  <Leaf className={`h-4 w-4 transition-transform duration-300 ${leavesEnabled ? "rotate-12 text-emerald-400 scale-110" : "text-emerald-400"}`} />
                  <span>{leavesEnabled ? "Stop Leaf Animation 🍃" : "Start Leaf Animation 🍃"}</span>
                </button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <Pill icon={Recycle}>Circular Economy</Pill>
                <Pill icon={HeartHandshake}>Community First</Pill>
                <Pill icon={Leaf}>Sustainable Future</Pill>
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-400/[0.10] via-transparent to-cyan-400/[0.08] blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-[#0b1720] to-slate-950 p-6 shadow-2xl shadow-black/30 sm:p-8">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-400/[0.08] blur-3xl" />

                <div className="relative flex items-center justify-between border-b border-white/[0.08] pb-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Our shared vision
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      Waste less. Do more.
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-300">
                    <Sprout size={23} />
                  </div>
                </div>

                <div className="relative my-8 flex items-center justify-center">
                  <div className="absolute h-52 w-52 rounded-full border border-dashed border-emerald-300/20" />
                  <div className="absolute h-40 w-40 rounded-full border border-emerald-300/10" />
                  <div className="absolute h-28 w-28 rounded-full bg-emerald-400/[0.08] blur-xl" />

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 40,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute h-52 w-52"
                  >
                    <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/50" />
                    <div className="absolute bottom-6 right-3 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50" />
                    <div className="absolute bottom-6 left-3 h-2.5 w-2.5 rounded-full bg-teal-300 shadow-lg shadow-teal-300/50" />
                  </motion.div>

                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-emerald-300/20 bg-gradient-to-br from-emerald-400/15 to-teal-400/[0.04] shadow-2xl shadow-emerald-950/40">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-teal-400 text-slate-950">
                      <Recycle size={43} strokeWidth={1.7} />
                    </div>
                  </div>
                </div>

                <div className="relative grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-center">
                    <PackageCheck
                      size={20}
                      className="mx-auto text-emerald-300"
                    />
                    <p className="mt-2 text-xs font-semibold text-white">
                      Vendors
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Share surplus
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-center">
                    <HandHeart
                      size={20}
                      className="mx-auto text-cyan-300"
                    />
                    <p className="mt-2 text-xs font-semibold text-white">
                      NGOs
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Meet needs
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-center">
                    <Users
                      size={20}
                      className="mx-auto text-teal-300"
                    />
                    <p className="mt-2 text-xs font-semibold text-white">
                      Volunteers
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Make it happen
                    </p>
                  </div>
                </div>

                <div className="relative mt-5 flex items-center gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.05] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-300">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      One connected ecosystem
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Connecting resources with the people who need them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Leaf size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    A greener tomorrow
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Starts with action today
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* MISSION                                                            */}
        {/* ------------------------------------------------------------------ */}

        <section
          id="our-mission"
          className="border-y border-white/[0.06] bg-white/[0.015] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Why we exist"
              title="A simple idea."
              highlight="A meaningful difference."
              description="Usable resources should not go to waste while communities face unmet needs. We want to make responsible sharing easier, more organized, and more accessible."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-5 md:grid-cols-3"
            >
              {pillars.map((pillar) => (
                <PillarCard key={pillar.number} {...pillar} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* PLATFORM FEATURES                                                  */}
        {/* ------------------------------------------------------------------ */}

        <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="What we bring together"
              title="More than a platform."
              highlight="A connected community."
              description="Our approach combines resource sharing, collaboration, and coordinated participation to help turn available resources into practical support."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* HOW IT WORKS                                                       */}
        {/* ------------------------------------------------------------------ */}

        <section className="border-y border-white/[0.06] bg-gradient-to-b from-slate-900/40 to-transparent px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeader
                align="left"
                eyebrow="How it works"
                title="From surplus"
                highlight="to solution."
                description="A straightforward process helps participants discover available resources, coordinate requests, and work toward better outcomes."
              />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {process.map((item, index) => (
                  <ProcessRow
                    key={item.number}
                    {...item}
                    isLast={index === process.length - 1}
                  />
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65 }}
              className="relative self-center"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-400/[0.07] to-cyan-400/[0.05] blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b121b] p-6 sm:p-8">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-400/[0.06] blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        The bigger picture
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-white">
                        Every resource matters.
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-300">
                      <Globe2 size={24} />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    By helping the right people connect with the right
                    resources, we can encourage a more thoughtful approach to
                    consumption and community support.
                  </p>

                  <div className="my-7 h-px bg-gradient-to-r from-emerald-300/30 via-white/[0.07] to-transparent" />

                  <div className="space-y-4">
                    {benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3">
                        <CircleCheck
                          size={19}
                          className="mt-0.5 shrink-0 text-emerald-300"
                        />
                        <p className="text-sm leading-6 text-slate-300">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <StatCard
                      icon={FaUsers}
                      value="Community"
                      label="People working together"
                    />
                    <StatCard
                      icon={FaRecycle}
                      value="Circular"
                      label="Resources used responsibly"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* VALUES                                                             */}
        {/* ------------------------------------------------------------------ */}

        <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="What guides us"
              title="Built around"
              highlight="shared responsibility."
              description="Lasting change takes collaboration. These principles shape how we approach resource sharing and community participation."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                {
                  icon: Leaf,
                  title: "Sustainability",
                  description:
                    "Make better use of existing resources and reduce unnecessary waste.",
                },
                {
                  icon: HeartHandshake,
                  title: "Empathy",
                  description:
                    "Keep people and their community needs at the center of every interaction.",
                },
                {
                  icon: ShieldCheck,
                  title: "Responsibility",
                  description:
                    "Encourage organized participation and thoughtful resource handling.",
                },
                {
                  icon: Zap,
                  title: "Action",
                  description:
                    "Turn good intentions into practical steps through collaboration.",
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  className="group rounded-2xl border border-white/[0.07] bg-slate-900/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-slate-900/80 sm:p-6"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/10 bg-emerald-300/[0.07] text-emerald-300 transition-transform duration-300 group-hover:scale-110">
                    <value.icon size={21} />
                  </div>

                  <p className="mb-2 text-xs font-bold tracking-widest text-emerald-300">
                    0{index + 1}
                  </p>

                  <h3 className="text-base font-semibold text-white">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* CTA                                                                */}
        {/* ------------------------------------------------------------------ */}

        <section className="px-4 pb-20 pt-4 sm:px-6 sm:pb-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-gradient-to-br from-[#0c211d] via-[#0b171c] to-[#0b1420] px-6 py-12 text-center sm:px-12 sm:py-16 lg:px-20 lg:py-20"
          >
            <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-emerald-400/[0.10] blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.09] text-emerald-300">
                <Users size={27} />
              </div>

              <SectionLabel icon={Sparkles}>
                Be part of the change
              </SectionLabel>

              <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Better together.
                <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  Better for tomorrow.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Whether you have resources to share, represent an organization,
                or want to volunteer your time, every contribution can help
                move us toward a more responsible future.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-7 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-400/15"
                >
                  Get Started
                  <MoveRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07]"
                >
                  <ArrowLeft size={16} />
                  Back to Previous Page
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  Community-focused
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  Resource-conscious
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  Collaboration-driven
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent" />
      </div>
    </main>
  );
};

/* -------------------------------------------------------------------------- */
/*                          SMALL ICON HELPER                                 */
/* -------------------------------------------------------------------------- */

const SearchIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

export default Readmore;