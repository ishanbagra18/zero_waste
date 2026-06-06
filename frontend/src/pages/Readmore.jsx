import React from "react";
import { motion } from "framer-motion";
import { FaRecycle, FaHandHoldingHeart, FaUsers, FaSeedling, FaTruck, FaChartLine, FaArrowRight } from "react-icons/fa";

const Readmore = () => {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen px-6 md:px-12 lg:px-24 py-20 font-sans selection:bg-purple-500 selection:text-black antialiased">
      <div className="max-w-6xl mx-auto space-y-28">
        
        {/* Hero Section Split Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <span className="text-xs uppercase tracking-widest font-black text-purple-500 bg-purple-500/10 px-3 py-1 rounded-md border border-purple-500/20">
              Our Vision
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-zinc-100 via-purple-400 to-zinc-100 bg-clip-text text-transparent">
              Join the Zero Waste Movement
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
              A community-driven platform that bridges the gap between vendors and NGOs, helping repurpose unused goods into meaningful resources. Be part of a circular economy that empowers people and protects the planet.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-purple-500/10 rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative border border-zinc-800 rounded-3xl p-8 bg-zinc-900/30 backdrop-blur-md text-center space-y-4">
              <FaRecycle className="text-5xl text-purple-400 mx-auto animate-spin-slow" />
              <div className="text-3xl font-black tracking-tight text-white">100% Circular</div>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">Every listed surplus item stays away from landfills and reaches community hands directly.</p>
            </div>
          </motion.div>
        </div>

        {/* Visual Pillars Section */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Core Objectives</h2>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-sm mx-auto">The three fundamental pillars powering our green platform initiative.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -6 }} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-800 flex flex-col justify-between">
              <div>
                <FaRecycle className="text-2xl text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold mb-2 tracking-tight">Reduce Waste</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">Give unused or near-expiry items a dynamic second life by listing and donating instead of discarding.</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-800 flex flex-col justify-between">
              <div>
                <FaHandHoldingHeart className="text-2xl text-purple-400 mb-4" />
                <h3 className="text-lg font-bold mb-2 tracking-tight">Support NGOs</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">Help grassroots certified organizations access verified, essential physical resources without massive operational costs.</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-800 flex flex-col justify-between sm:col-span-2 md:col-span-1">
              <div>
                <FaUsers className="text-2xl text-amber-400 mb-4" />
                <h3 className="text-lg font-bold mb-2 tracking-tight">Empower Communities</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">Build an open source local circular economy structure that directly benefits local vendors, NGOs, and under-represented crowds.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image + Text Section */}
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/20 shadow-2xl relative"
            >
              <img
                src="https://i.pinimg.com/1200x/78/9b/0a/789b0ac9fac08dc435429de872301b79.jpg"
                alt="Zero Waste Initiative Artwork"
                className="w-full h-auto object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 space-y-6 order-1 md:order-2"
          >
            <h2 className="text-3xl font-black tracking-tight text-white">What is Zero Waste?</h2>
            <div className="space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
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
          <motion.div whileHover={{ y: -4 }} className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-2xl">
            <FaSeedling className="text-xl text-lime-400 mb-3" />
            <h3 className="text-base font-bold tracking-wide mb-1 text-zinc-200">Sustainable Living</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Promote absolute ecosystem restoration and proactive conservation ethics with every single item verification pass.</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-2xl">
            <FaTruck className="text-xl text-blue-400 mb-3" />
            <h3 className="text-base font-bold tracking-wide mb-1 text-zinc-200">Efficient Logistics</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Seamless routing utilities to coordinate smooth drop points, real-time dispatch, and zero friction handling handoffs.</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-2xl sm:col-span-2 lg:col-span-1">
            <FaChartLine className="text-xl text-cyan-400 mb-3" />
            <h3 className="text-base font-bold tracking-wide mb-1 text-zinc-200">Impact Analytics</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Granular calculations translating claim operations into tangible verified weight data metrics and carbon offsetting indices.</p>
          </motion.div>
        </div>

        {/* Call to Action Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-zinc-900/30 border border-purple-500/20 p-8 sm:p-12 rounded-3xl text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl font-black tracking-tight text-zinc-100">Ready to Make an Impact?</h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Whether you are an enterprise vendor looking to optimize surplus, an NGO expanding outreach, or a volunteer coordinator—your actions matter. Let's build a clean distribution world where nothing goes to waste.
            </p>
            <div className="pt-2">
              <button className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/10 text-sm group">
                Get Started Today
                <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Readmore;