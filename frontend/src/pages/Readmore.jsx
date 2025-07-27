import React from "react";
import { motion } from "framer-motion";
import { FaRecycle, FaHandHoldingHeart, FaUsers, FaSeedling, FaTruck, FaChartLine } from "react-icons/fa";

const Readmore = () => {










  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen px-4 md:px-20 py-16 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-purple-400 drop-shadow-md">
            Join the Zero Waste Movement
          </h1>
          <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
            A community-driven platform that bridges the gap between vendors and
            NGOs, helping repurpose unused goods into meaningful resources. Be part of a circular economy that empowers people and protects the planet.
          </p>
        </motion.div>

        {/* Visual Section */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <FaRecycle className="text-4xl mx-auto text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reduce Waste</h3>
            <p className="text-gray-400">Give unused items a second life by donating instead of discarding.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <FaHandHoldingHeart className="text-4xl mx-auto text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Support NGOs</h3>
            <p className="text-gray-400">Help NGOs access essential resources for community development.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <FaUsers className="text-4xl mx-auto text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Empower People</h3>
            <p className="text-gray-400">Build a circular economy that benefits everyone—vendors, NGOs, and society.</p>
          </motion.div>
        </div>

        {/* Image + Text Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            src="https://i.pinimg.com/1200x/78/9b/0a/789b0ac9fac08dc435429de872301b79.jpg"
            alt="Zero Waste Initiative"
            className="rounded-xl shadow-lg w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-lg text-gray-300"
          >
            <h2 className="text-3xl font-bold text-white mb-4">What is Zero Waste?</h2>
            <p className="mb-4">
              Zero Waste is a platform where vendors can list their unused or surplus items—such as food, clothing, electronics, or furniture. NGOs can then claim these items either as donations or for a minimal fee, ensuring essential goods reach those who need them most.
            </p>
            <p>
              This not only helps in reducing environmental waste but also supports NGOs in their mission to serve underprivileged communities. The platform encourages conscious contribution and promotes environmental sustainability through collaboration.
            </p>
          </motion.div>
        </div>

        {/* Feature Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <FaSeedling className="text-4xl mx-auto text-lime-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sustainable Living</h3>
            <p className="text-gray-400">Promote eco-friendly practices and resource conservation with every contribution.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <FaTruck className="text-4xl mx-auto text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Efficient Logistics</h3>
            <p className="text-gray-400">Seamless logistics support for pickup, delivery, and tracking of donated items.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <FaChartLine className="text-4xl mx-auto text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Impact Analytics</h3>
            <p className="text-gray-400">Track the environmental and social impact of your actions through dashboards and reports.</p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-purple-400 text-black p-10 rounded-xl text-center shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="mb-6 text-lg max-w-2xl mx-auto">
            Whether you're a vendor, an NGO, or a volunteer, your contribution matters. Join the platform and be part of the change. Let’s build a world where nothing is wasted and everything has value.
          </p>
          <button  className="bg-black text-purple-400 px-8 py-3 text-lg rounded-md hover:bg-gray-900 transition">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Readmore;
