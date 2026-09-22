import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaRecycle, FaHandHoldingHeart, FaUsers, FaSeedling, FaTruck, FaChartLine, FaArrowRight } from "react-icons/fa";
import { ArrowLeft, Sparkles, ShieldCheck, HeartHandshake, Leaf } from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

const Readmore = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-24 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Hero Section */}
      <ParallaxHero
        badgeText="Sustainability Charter & Vision"
        title={
          <>
            Join the Zero Waste <span className="text-emerald-400">Movement</span>
          </>
        }
        subtitle="A community-driven platform bridging local vendors with NGOs to repurpose surplus resources into meaningful community support."
        actionButtons={
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white font-semibold text-sm transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Go Back
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-20">
        
        {/* Circular Economy Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-slate-800 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-5 text-left"
          >
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Circular Framework
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Repurposing Surplus, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Eliminating Waste</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              ZeroWaste intercepts edible surplus food and reusable assets directly from commercial vendors before disposal. By giving NGOs instant claim capabilities and dispatching volunteer couriers, we build a seamless circular economy.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative border border-emerald-500/30 rounded-3xl p-8 bg-slate-950/80 backdrop-blur-md text-center space-y-4 shadow-xl">
              <FaRecycle className="text-5xl text-emerald-400 mx-auto animate-spin-slow" />
              <div className="text-3xl font-black tracking-tight text-white">100% Circular</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Every listed surplus item stays away from landfills and reaches community hands directly.</p>
            </div>
          </motion.div>
        </div>

        {/* Visual Pillars Section */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Core Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Our Strategic Objectives</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">The fundamental principles guiding our eco redistribution ecosystem.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -6 }} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:border-emerald-500/40 backdrop-blur-xl flex flex-col justify-between shadow-xl">
              <div>
                <FaRecycle className="text-2xl text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold mb-2 tracking-tight text-white">Reduce Waste</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Give unused or near-expiry items a dynamic second life by listing and donating instead of discarding.</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:border-teal-500/40 backdrop-blur-xl flex flex-col justify-between shadow-xl">
              <div>
                <FaHandHoldingHeart className="text-2xl text-teal-400 mb-4" />
                <h3 className="text-lg font-bold mb-2 tracking-tight text-white">Support NGOs</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Help grassroots certified organizations access verified, essential physical resources without massive operational costs.</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:border-cyan-500/40 backdrop-blur-xl flex flex-col justify-between sm:col-span-2 md:col-span-1 shadow-xl">
              <div>
                <FaUsers className="text-2xl text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold mb-2 tracking-tight text-white">Empower Communities</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Build an open source local circular economy structure that directly benefits local vendors, NGOs, and volunteers.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image + Text Section */}
        <div className="grid md:grid-cols-12 gap-10 items-center bg-slate-900/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl">
          <div className="md:col-span-5 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative"
            >
              <img
                src="https://i.pinimg.com/1200x/78/9b/0a/789b0ac9fac08dc435429de872301b79.jpg"
                alt="Zero Waste Initiative Artwork"
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-all duration-700"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 space-y-4 order-1 md:order-2 text-left"
          >
            <h2 className="text-3xl font-black tracking-tight text-white">What is Zero Waste?</h2>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Zero Waste is a structured network ecosystem where local supply vendors can digitally list their surplus inventories—including surplus food batches, unsold apparel, functional electronics, or furniture. 
              </p>
              <p>
                Verified NGOs instantly scan the dashboard to claim these items directly. This system effectively intercepts waste at the root stage, enabling real-time social logistics, optimizing delivery channels, and promoting deep transparency via unified dashboards.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -4 }} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
            <FaSeedling className="text-xl text-emerald-400 mb-3" />
            <h3 className="text-base font-bold tracking-wide mb-1 text-white">Sustainable Living</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Promote absolute ecosystem restoration and proactive conservation ethics with every single item verification pass.</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
            <FaTruck className="text-xl text-teal-400 mb-3" />
            <h3 className="text-base font-bold tracking-wide mb-1 text-white">Efficient Logistics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Seamless routing utilities to coordinate smooth drop points, real-time dispatch, and zero friction handling handoffs.</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl sm:col-span-2 lg:col-span-1">
            <FaChartLine className="text-xl text-cyan-400 mb-3" />
            <h3 className="text-base font-bold tracking-wide mb-1 text-white">Impact Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Granular calculations translating claim operations into tangible verified weight data metrics and carbon offsetting indices.</p>
          </motion.div>
        </div>

        {/* Call to Action Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-emerald-500/30 p-8 sm:p-12 rounded-3xl text-center overflow-hidden shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h2 className="text-3xl font-black tracking-tight text-white">Ready to Make an Impact?</h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Whether you are an enterprise vendor looking to optimize surplus, an NGO expanding outreach, or a volunteer driver—your actions matter. Let's build a clean distribution world where nothing goes to waste.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Readmore;